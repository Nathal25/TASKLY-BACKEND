const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const authenticateToken = require('../middlewares/authMiddleware');


/**
 * @route GET /tasks
 * @description Get all tasks for the authenticated user.
 * @access Public
 */
router.get('/', authenticateToken, (req, res) => TaskController.getAll(req, res));


/**
 * @route GET /tasks/:id
 * @description Get a specific task by its ID for the authenticated user.
 * @param {string} id - The ID of the task to retrieve.
 * @access Public
 */

router.get('/:id', authenticateToken, (req, res) => TaskController.read(req, res));

/**
 * @route POST /tasks
 * @description Create a new task for the authenticated user.
 * @access Public
 */
router.post('/', authenticateToken, (req, res) => TaskController.create(req, res));

/**
 * @route PUT /tasks/:id
 * @description Update an existing task by its ID for the authenticated user.
 * @param {string} id - The ID of the task to update.
 * @access Public
 */
router.put('/:id', authenticateToken, (req, res) => TaskController.update2(req, res));

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by its ID for the authenticated user.
 * @param {string} id - The ID of the task to delete.
 * @access Public
 */
router.delete('/:id', authenticateToken, (req, res) => TaskController.delete2(req, res));

module.exports = router;