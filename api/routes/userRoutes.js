const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const authenticateToken = require("../middlewares/authMiddleware");
const loginLimiter = require("../middlewares/limiterMiddleware");
const User = require("../models/User");

/**
 * @route POST /users
 * @description Create a new user.
 * @body {string} first name - The name of the user.
 * @body {string} last name - The last name of the user.
 * @body {number} age - The age of the user.
 * @body {string} email - The mail of the user.
 * @body {string} password - The password of the user.
 * @body {string} confirmPassword - The password of the user to confirm.
 * @returns 201 with the id of the created user.
 * @access Public
 */
router.post("/", (req, res) => UserController.create(req, res));

/**
 * @route POST /users/login
 * @description Login.
 * @body {string} email - The mail of the user.
 * @body {string} password - The password of the user.
 * @returns 200 with a success message and a cookie that contains the token inside it.
 * @access Public
 */
router.post("/login", loginLimiter, (req, res) => UserController.login(req, res));

/**
 * @route POST /users/logout
 * @description Logout.
 * @returns 200 with a success message.
 * @access Public
 */
router.post("/logout", (req, res) => UserController.logout(req, res));

/**
 * @route POST /users/forgot-password
 * @description Send an email to recover the password.
 * @body {string} email - The mail of the user (It has to be real, or simulated by some website).
 * @returns 200 with a success message and an email with a recovery link containing the token.
 * @access Public
 */
router.post("/forgot-password", (req, res) => UserController.forgotPassword(req, res));

/**
 * @route POST /users/reset-password
 * @description change the password.
 * @body {string} password - The new password of the user.
 * @body {string} confirmPassword - The new password of the user to confirm.
 * @body {string} token - The token that was sent via email (in the link).
 * @body {string} email - The mail of the user that was sent via email (in the link).
 * @returns 200 with a success message.
 * @access Public
 */
router.post("/reset-password", (req, res) => UserController.resetPassword(req, res));
//router.get("/Prueba1", authenticateToken, (req, res) => UserController.getAll(req, res));

/**
 * @route GET /users
 * @description Retrieve all users.
 * @access Public
 */
router.get("/", (req, res) => UserController.getAll(req, res));

/**
 * @route GET /users/:id
 * @description Retrieve a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
//router.get("/:id", authenticateToken, (req, res) => UserController.read(req, res));

/**
 * @route GET /users/me
 * @description Get the logged-in user's details.
 * @returns 200 with the user's details.
 * @access Public
 */

router.get('/me', authenticateToken, (req, res) => UserController.getLoggedUser(req, res));

/**
 * @route PUT /users/edit-me
 * @description Edit the logged-in user's details.
 * @body {string} [firstName] - Updated first name (optional).
 * @body {string} [lastName] - Updated last name (optional).
 * @body {number} [age] - Updated age (optional).
 * @body {string} [email] - Updated email (optional).
 * @returns 200 with the updated user's details.
 * @access Public
 */

router.put('/edit-me', authenticateToken, (req, res) => UserController.editLoggedUser(req, res));

/**
 * @route GET /check-token
 * @description Verifica que el token JWT enviado sea válido.
 * @access Private (requiere autenticación con JWT)
 * @middleware authenticateToken - Middleware que valida el token y añade los datos del usuario a `req.user`.
 * @returns {object} 200 - Devuelve un mensaje confirmando que el token es válido.
 */

router.get("/check-token", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Token valido" });
});

/**
 * @route DELETE /me
 * @description Elimina la cuenta del usuario autenticado después de validar su identidad.
 * @access Private (requiere autenticación con JWT)
 * @middleware authenticateToken - Middleware que valida el token y añade los datos del usuario a `req.user`.
 * @body {string} password - Contraseña actual del usuario para confirmar la eliminación de la cuenta.
 * @returns {object} 200 - Cuenta eliminada exitosamente.
 * @returns {object} 400 - Si faltan datos obligatorios.
 * @returns {object} 401 - Si la contraseña es incorrecta o el token no es válido.
 * @returns {object} 404 - Si el usuario no existe.
 */

router.delete("/me", authenticateToken, (req, res) => UserController.deleteLoggedUser(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;