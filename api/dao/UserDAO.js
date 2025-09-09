const User = require('../models/User');
const GlobalDAO = require('./GlobalDao');

// Create a UserDAO class that extends the GlobalDAO sending the User model to the parent constructor
class UserDAO extends GlobalDAO {
    constructor() {
        super(User);
    }

    // Create a method to find a user by email
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
