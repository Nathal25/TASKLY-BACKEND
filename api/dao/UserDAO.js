const User = require('../models/User');
const GlobalDAO = require('./GlobalDao');

/**
 * UserDAO
 *
 * Data Access Object for user-specific operations, extending GlobalDAO for generic CRUD.
 * Provides additional methods for user lookup by email.
 *
 * @class UserDAO
 * @extends GlobalDAO
 */
class UserDAO extends GlobalDAO {
    constructor() {
        super(User);
    }

    /**
     * Finds a user document by email address.
     *
     * @async
     * @param {string} emailToSearch - The email address to search for
     * @returns {Promise<Object|null>} The found user document or null if not found
     * @throws {Error} If retrieval fails
     */
    async readByEmail(emailToSearch) {
        try {
            const document = await User.findOne({email: emailToSearch});
            return document;
        } catch (error) {
            throw new Error(`Error getting document by Email: ${error.message}`);
        }
    }
}

// Export an instance of the UserDAO
module.exports = new UserDAO();
