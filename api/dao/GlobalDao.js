/**
 * GlobalDao
 *
 * Generic Data Access Object for performing CRUD operations on a Mongoose model.
 * Provides methods to create, read, update, delete, and retrieve all documents.
 *
 * @class GlobalDao
 * @param {Object} model - Mongoose model to operate on
 */
class GlobalDao {
    constructor(model) {
        this.model = model;
    }

     /**
      * Creates a new document in the database.
      * @async
      * @param {Object} data - Data for the new document
      * @returns {Promise<Object>} The created document
      * @throws {Error} If creation fails
      */
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

     /**
      * Reads a document by its ID.
      * @async
      * @param {string} id - Document ID
      * @returns {Promise<Object>} The found document
      * @throws {Error} If not found or retrieval fails
      */
    async read(id) {
        try {
            const document = await this.model.findById(id);
            if (!document) throw new Error("Document not found");
            return document;
        } catch (error) {
            throw new Error(`Error getting document by ID: ${error.message}`);
        }
    }

     /**
      * Updates a document by its ID.
      * @async
      * @param {string} id - Document ID
      * @param {Object} updateData - Data to update
      * @returns {Promise<Object>} The updated document
      * @throws {Error} If not found or update fails
      */
    async update(id, updateData) {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedDocument) throw new Error("Document not found");
            return updatedDocument;
        } catch (error) {
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    }

     /**
      * Deletes a document by its ID.
      * @async
      * @param {string} id - Document ID
      * @returns {Promise<Object>} The deleted document
      * @throws {Error} If not found or deletion fails
      */
    async delete(id) {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id);
            if (!deletedDocument) throw new Error("Document not found");
            return deletedDocument;
        } catch (error) {
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    }

     /**
      * Retrieves all documents matching the filter.
      * @async
      * @param {Object} [filter={}] - Query filter
      * @returns {Promise<Array>} Array of documents
      * @throws {Error} If retrieval fails
      */
    async getAll(filter = {}) {
        try {
            return await this.model.find(filter);
        } catch (error) {
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }
}

module.exports = GlobalDao;