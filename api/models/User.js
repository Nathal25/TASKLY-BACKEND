const mongoose = require('mongoose');

// Define the user schema with validation rules
const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        age: {type: Number, min: 13, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, minlength: 8, required: true, 
            match: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/},
            // (?=.*[A-Z]) At least one uppercase letter 
            // (?=.*\d) At least one number
            // (?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]) At least one special character
            // [A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,} At least 8 characters long
        resetPasswordToken: {type: String, default: null}, 
        resetPasswordExpires: {type: Date, default: null},
    },
    {
        timestamps: true 
    }
);

// Create and export the User model with the defined UserSchema
module.exports = mongoose.model("User", UserSchema)