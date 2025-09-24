const Task = require('../models/Task');
const GlobalDAO = require('./GlobalDao');

/**
 * Data Access Object (DAO) for managing Task entities.
 * Extends the GlobalDAO class to provide database operations for the Task model.
 */

class TaskDAO extends GlobalDAO {
    /**
     * Constructs a new TaskDAO instance.
     * Passes the Task model to the parent GlobalDAO constructor.
     */
    constructor() {
        super(Task);
    }

    /**
     * Retrieves all Task documents from the database based on the provided filter and sort criteria.
     * 
     * @param {Object} [filter={}] - The filter criteria to apply when querying the database.
     * @param {Object} [sort={}] - The sorting criteria to apply to the query results.
     * @returns {Promise<Array>} - A promise that resolves to an array of Task documents.
     * @throws {Error} - Throws an error if there is an issue retrieving the documents.
     */
    async getAll(filter = {}, sort = {}) {
        try {
            return await this.model.find(filter).sort(sort);
        } catch (error) {
            throw new Error(`Error retrieving documents: ${error.message}`);
        }
    }

    /**
    * Deletes all documents associated with a given user ID.
    *
    * @async
    * @function deleteByUserId
    * @memberof TaskDAO
    * @description Uses the underlying database model to remove all tasks
    * that belong to the specified user.
    *
    * @param {string|import('mongoose').Types.ObjectId} userId - The ID of the user whose tasks should be deleted.
    * @returns {Promise<import('mongoose').DeleteResult>} A promise that resolves with the deletion result,
    * including the number of documents deleted.
    *
    * @throws {Error} Throws an error if the deletion operation fails.
    */
    async deleteByUserId(userId) {
        try {
            return await this.model.deleteMany({ userId: userId });
        } catch (error) {
            throw new Error(`Error deleting documents: ${error.message}`);
        }
    }
}

/**
 * Exports an instance of the TaskDAO class for use in other parts of the application.
 */

module.exports = new TaskDAO();
