const GlobalController = require('../controllers/GlobalController');
const TaskDAO = require("../dao/TaskDAO");

/**
 * TaskController class handles task-related operations such as creating, retrieving, updating, and deleting tasks.
 * It extends the GlobalController and uses TaskDAO for data access operations.
 */
class TaskController extends GlobalController {
    constructor() {;
        super(TaskDAO);
    }

    /**
     * Creates a new task associated with the authenticated user.
     * 
     * @async
     * @param {Object} req - The request object.
     * @param {Object} req.body - The request body containing task details.
     * @param {string} req.body.title - The title of the task.
     * @param {string} req.body.date - The date of the task.
     * @param {string} req.body.time - The time of the task.
     * @param {string} req.body.status - The status of the task.
     * @param {string} req.userId - The ID of the authenticated user (from middleware).
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Sends a response with the created task ID or an error message.
     */

    async create(req, res) {
        try {
            const { title, date, time, status } = req.body;

            // Validar campos obligatorios
            if (!title || !date || !time || !status) {
                return res.status(400).json({ message: "Completa este campo" });
            }

            // Asociar la tarea con el usuario (userId)
            const userId = req.userId; // Esto debe venir del middleware de autenticación
            const taskData = { ...req.body, userId };

            // Crear la tarea
            const task = await TaskDAO.create(taskData);
            res.status(201).json({ id: task._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "No pudimos guardar tu tarea, inténtalo de nuevo" });
        }
    }

    /**
     * Retrieves all tasks associated with the authenticated user.
     * 
     * @async
     * @param {Object} req - The request object.
     * @param {string} req.userId - The ID of the authenticated user (from middleware).
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Sends a response with the list of tasks or an error message.
     */

    async getAll(req, res) {
        try {
            const userId = req.userId; // Esto debe venir del middleware de autenticación
            const tasks = await TaskDAO.getAll({ userId });
            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "No pudimos obtener tus tareas, inténtalo de nuevo" });
        }
    }
    
    /**
     * Updates an existing task associated with the authenticated user.
     * 
     * @async
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The ID of the task to update.
     * @param {Object} req.body - The request body containing updated task details.
     * @param {string} req.body.title - The updated title of the task.
     * @param {string} req.body.date - The updated date of the task.
     * @param {string} req.body.time - The updated time of the task.
     * @param {string} req.body.status - The updated status of the task.
     * @param {string} req.userId - The ID of the authenticated user (from middleware).
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Sends a response indicating success or an error message.
     */

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, date, time, status } = req.body;
            const userId = req.userId; // Esto debe venir del middleware de autenticación

            // Validar campos obligatorios
            if (!title || !date || !time || !status) {
                return res.status(400).json({ message: "Completa este campo" });
            }
            // Verificar que la tarea pertenece al usuario
            const task = await TaskDAO.getById(id);
            if (!task || task.userId.toString() !== userId) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }
            // Actualizar la tarea
            await TaskDAO.update(id, { title, date, time, status });
            res.status(200).json({ message: "Tarea actualizada correctamente" });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes an existing task associated with the authenticated user.
     * 
     * @async
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The ID of the task to delete.
     * @param {string} req.userId - The ID of the authenticated user (from middleware).
     * @param {Object} res - The response object.
     * @returns {Promise<void>} Sends a response indicating success or an error message.
     */

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId; // Esto debe venir del middleware de autenticación   
            // Verificar que la tarea pertenece al usuario
            const task = await TaskDAO.getById(id);
            if (!task || task.userId.toString() !== userId) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }      
            // Eliminar la tarea
            await TaskDAO.delete(id);
            res.status(200).json({ message: "Tarea eliminada correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "No pudimos eliminar tu tarea, inténtalo de nuevo" });
        }  
    }

}

module.exports = new TaskController();