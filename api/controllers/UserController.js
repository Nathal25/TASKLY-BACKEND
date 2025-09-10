const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  // Logout method to clear the JWT token cookie
  logout(req, res) {
    // Clear the token cookie with the same options used to create it
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',      
      sameSite: 'strict'
    });
    res.status(200).json({ message: "Logged out successfully" });
  }
}

// Export an instance of the UserController
module.exports = new UserController();