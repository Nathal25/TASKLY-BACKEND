/**
 * GlobalController
 *
 * Handles generic CRUD operations for resources using a provided DAO (Data Access Object).
 * Each method processes HTTP requests, interacts with the DAO, and sends responses.
 *
 * @class GlobalController
 * @param {Object} dao - Data Access Object with CRUD methods
 */
class GlobalController {
    constructor(dao) {
        this.dao = dao;
    }

     /**
      * Creates a new resource.
      * @async
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {void}
      */
    async create(req, res) {
        console.log("Creating item with data:", req.body);
        try {
            const item = await this.dao.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

     /**
      * Reads a resource by ID.
      * @async
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {void}
      */
    async read(req, res) {
        try {
            const item = await this.dao.read(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

     /**
      * Updates a resource by ID.
      * @async
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {void}
      */
    async update(req, res) {
        try {
            const item = await this.dao.update(req.params.id, req.body);
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

     /**
      * Deletes a resource by ID.
      * @async
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {void}
      */
    async delete(req, res) {
        try {
            const item = await this.dao.delete(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

     /**
      * Retrieves all resources, optionally filtered by query parameters.
      * @async
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {void}
      */
    async getAll(req, res) {
        try {
            const items = await this.dao.getAll(req.query);
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = GlobalController;