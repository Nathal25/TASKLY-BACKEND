const GlobalController = require('../controllers/GlobalController');
const TaskDAO = require("../dao/TaskDAO");

/**
 * TaskController class handles task-related operations such as creating, retrieving, updating, and deleting tasks.
 * It extends the GlobalController and uses TaskDAO for data access operations.
 */
class TaskController extends GlobalController {
    constructor() {
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

        // Validate required fields
        if (!title || !date || !time || !status) {
            return res.status(400).json({ message: "Unfilled fields" });
        }

        // Associate the task with the authenticated user
        const userId = req.userId;
        const taskData = { ...req.body, userId };

        // Create the task
        const task = await TaskDAO.create(taskData);
        res.status(201).json({ id: task._id });
      } catch (error) {
      console.error(error);
      res.status(500).json({ message: "We couldn't save your task, please try again." });
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
            const userId = req.userId;
            const tasks = await TaskDAO.getAll({ userId });
            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "We couldn't get your assignments, please try again" });
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
            const userId = req.userId;

            // Validate required fields
            if (!title || !date || !time || !status) {
                return res.status(400).json({ message: "Campos sin rellenar" });
            }

            const task = await TaskDAO.getById(id);
            if (!task || task.userId.toString() !== userId) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }

            await TaskDAO.update(id, { title, date, time, status });
            res.status(200).json({ message: "Tarea actualizada exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "We couldn't update your task, please try again" });
        }
    }

  /**
   * Updates an existing task by its ID.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.id - The ID of the task to update.
   * @param {Object} req.body - The request body containing updated task details.
   * @param {string} req.body.title - The updated title of the task.
   * @param {string} req.body.date - The updated date of the task.
   * @param {string} req.body.time - The updated time of the task.
   * @param {string} req.body.status - The updated status of the task.
   * @param {Object} res - The response object.
   * @return {Promise<void>} Sends a response indicating success or an error message.
   * */

      async update2(req, res) {
    try {
      const taskId = req.params.id;
      const updates = req.body;

      // Validar que la tarea existe
      const task = await TaskDAO.read(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Actualizar la tarea
      const updatedTask = await TaskDAO.update(taskId, updates);
      res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: "We couldn't update your task, please try again" });
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
        const userId = req.userId; 

        const task = await TaskDAO.getById(id);
        if (!task || task.userId.toString() !== userId) {
            return res.status(404).json({ message: "Task not found" });
        }      

        await TaskDAO.delete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "We couldn't delete your task, please try again" });
    }  
  }

  /**
   * Deletes an existing task by its ID.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.id - The ID of the task to delete.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Sends a response indicating success or an error message.
   */

  async delete2(req, res) {
  try {
    const taskId = req.params.id;

    // Validar que la tarea existe
    const task = await TaskDAO.read(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Eliminar la tarea
    await TaskDAO.delete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: "We couldn't delete your task, please try again" });
  }
}

    /**
   * Updates the status of a task by its ID for the authenticated user.
   * @param {Object} req - The request object. 
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.id - The ID of the task to update the status.
   * @param {Object} req.body - The request body containing the new status.
   * @param {string} req.body.status - The new status for the task.
   */

  async updateTaskStatus(req, res) {
    try {
      const taskId = req.params.id; // ID de la tarea desde la URL
      const { status } = req.body; // Nuevo estado desde el cuerpo de la solicitud

      // Validar que el estado sea válido
      const validStatuses = ['Pending', 'In-progress', 'Completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status invalid. Valid statuses are: Pending, In-progress, Completed.' });
      }

      // Validar que la tarea existe
      const task = await TaskDAO.read(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      // Actualizar el estado de la tarea
      const updatedTask = await TaskDAO.update(taskId, { status });
      res.status(200).json({ message: 'Task status updated successfully.', task: updatedTask });
    } catch (error) {
      console.error('Error updating task status:', error.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
}
}

module.exports = new TaskController();