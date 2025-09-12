const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { text } = require("express");
const User = require("../models/User");

/**
 * UserController
 *
 * Handles user-specific logic such as registration, login, and password validation for the Taskly backend.
 * Extends GlobalController to inherit generic CRUD operations, but overrides and adds methods for user management.
 *
 * @class UserController
 * @extends GlobalController
 */
class UserController extends GlobalController {
  constructor() {
    super(UserDAO);
  }

  // Override the create method to add custom logic for user creation
  /**
   * Creates a new user with validation and password hashing.
   * Checks for password match, email uniqueness, and hashes the password before saving.
   *
   * @async
   * @override
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async create(req, res) {
    try {
      // Validate password and confirmPassword match
      const passwordError = this.passwordValidation(req);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      // Check if the email already exists
      const existingUser = await UserDAO.readByEmail(req.body.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      await this.hashPassword(req);

      // Call the create method directly from UserDAO (Ignore GlobalController for custom response)
      const item = await UserDAO.create(req.body);
      return res.status(201).json({ id: item._id });

    } catch (error) {
      // Show detailed error only in development
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Additional validation for password
  /**
   * Validates the password and confirmPassword fields in the request.
   * Ensures they match and meet complexity requirements.
   *
   * @param {Object} req - Express request object
   * @returns {string|null} Error message if invalid, otherwise null
   */
  passwordValidation(req) {
    if (req.body.password != req.body.confirmPassword) {
      return "Password and confirm password don't match";
    }

    // Remove confirmPassword before saving
    delete req.body.confirmPassword;

    // Validate the password syntaxis
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    if (!passwordRegex.test(req.body.password)) {
      return "Password invalid"
    }

    return null;
  }

  // Hash the password before saving using bcrypt
  /**
   * Hashes the password in the request body using bcrypt before saving.
   *
   * @async
   * @param {Object} req - Express request object
   * @returns {Promise<void>}
   */
  async hashPassword(req) {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = newPassword;
    return;
  }

  /**
   * Authenticates a user by email and password.
   * Checks credentials and returns a success message and user ID if valid.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<number|void>} Returns 0 on success, otherwise sends error response
   */
  async login(req, res) {
    try {
      // Check if the email exists and take the user
      const user = await UserDAO.readByEmail(req.body.email);
      if(!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if(!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token, with the structure: sing(payload (data), secret (to sign), options)
      const token = jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h'}
      );

      // Send the token in a HTTP-only cookie
      res.cookie('token', token,
        {
          httpOnly: true, // JavaScript cannot access this cookie for the side of the client
          secure: process.env.NODE_ENV === 'production', // Only be sent via HTTPS
          sameSite: 'strict', // To prevent CSRF attacks (Cookie sent only for same-site requests (most secure))
        }
      );

      // Successful login
      res.status(200).json({ message: "Login successful", id: user._id , email: user.email});
    } catch (error) {
      // Show detailed error only in development
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Logout method to clear the JWT token cookie.
   * Clears the authentication cookie (`token`) using the same options
   * as when it was created, effectively logging out the user.
   * 
   * @function logout
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {void} Sends a 200 response with a success message.
   */
  logout(req, res) {
    // Clear the token cookie with the same options used to create it
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',      
      sameSite: 'strict'
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  /**
  * Sends a password reset email to the user.
  *
  * - Verifies if the provided email exists.
  * - Generates a JWT reset token valid for 1 hour.
  * - Stores the token and expiration date in the user record.
  * - Sends an email with the reset link to the user.
  *
  * @async
  * @function forgotPassword
  * @param {import("express").Request} req - Express request object. Expects `req.body.email`.
  * @param {import("express").Response} res - Express response object.
  * @returns {Promise<void>} Sends a 200 response if the email is sent,
  * 202 if the email does not exist, or 500 on server error.
  */
  async forgotPassword(req, res) {
    try {
      // Check if the email exists and take the user
      const user = await UserDAO.readByEmail(req.body.email);
      if(!user) {
        return res.status(202).json({ message: "If the email is registered, you will receive a password reset email" });
      }

      // Generate a JWT token, with the structure: sing(payload (data), secret (to sign), options)
      const token = jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
      );

      // Save the token and its expiration date in the instance of the user
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

      // Update the user with the reset token and expiration
      await UserDAO.update(user._id, user);

      // A transporter object is created with the Nodemailer configuration.
      // The email service (Gmail in this case) and credentials are defined.
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // The URL is constructed, the user must open to reset their password. 
      // The user's token and email are included as query parameters.
      const resetUrl = `http://localhost:8080/api/v1/users/reset-password?token=${token}&email=${user.email}`;

      // Email options to send
      // Include sender, recipient, subject, and message body
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Recuperar contraseña - Taskly',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Taskly</strong>.</p>
          <p>Haz clic en el siguiente botón para continuar:</p>
          <p>
            <a href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; background: #007BFF; 
                  color: #fff; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
            </a>
          </p>
          <p>Si no solicitaste este cambio, simplemente ignora este correo.</p>
          <hr/>
          <small>Este enlace expirará en 1 hora por razones de seguridad.</small>
        </div>
        `
      };
      
      // The email is sent with the defined options
      // sendMail receives a callback for the success or mistake of the sending
      await transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar correo:", error);
        } else {
          console.log("Correo enviado exitosamente:", info);
        }
      });

      res.status(200).json({ message: "Password reset email sent" });

    }catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Resets the user's password using the reset token.
  *
  * - Validates the token and email combination.
  * - Ensures password and confirmPassword match.
  * - Hashes and updates the new password in the database.
  * - Clears the reset token and expiration fields.
  *
  * @async
  * @function resetPassword
  * @param {import("express").Request} req - Express request object. 
  * Expects `req.body.email`, `req.body.token`, `req.body.password`, and `req.body.confirmPassword`.
  * @param {import("express").Response} res - Express response object.
  * @returns {Promise<void>} Sends a 200 response if reset is successful,
  * 400 if the token is invalid/expired, or 500 on server error.
  */
  async resetPassword(req, res) {
    try {
      // Find the user with the reset token and the email
      const user = await UserDAO.readByResetToken(req.body.email, req.body.token);
      if(!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Validate password and confirmPassword match
      const passwordError = this.passwordValidation(req);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      // Hash the new password before saving it
      await this.hashPassword(req);
      user.password = req.body.password;

      // Delete the token and expiration date
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      // Update the user in the database
      await UserDAO.update(user._id, user);

      res.status(200).json({ message: "Password has been reset successfully" });

    }catch (error) {
      // Show detailed error only in development
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      res.status(500).json({ message: "Try again later" });
    }
  }
}

// Export an instance of the UserController
module.exports = new UserController();