const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const authenticateToken = require("../middlewares/authMiddleware");
const loginLimiter = require("../middlewares/limiterMiddleware");

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
router.get("/Prueba1", authenticateToken, (req, res) => UserController.getAll(req, res));

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
router.get("/:id", (req, res) => UserController.read(req, res));

/**
 * @route PUT /users/:id
 * @description Update an existing user by ID.
 * @param {string} id - The unique identifier of the user.
 * @body {string} [username] - Updated username (optional).
 * @body {string} [password] - Updated password (optional).
 * @access Public
 */
router.put("/:id", (req, res) => UserController.update(req, res));

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.delete("/:id", (req, res) => UserController.delete(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;