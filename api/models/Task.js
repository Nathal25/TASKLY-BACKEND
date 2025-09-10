const mongoose = require('mongoose');

/**
 * Task Schema for MongoDB using Mongoose.
 * Represents a task with details, date, time, status, and associated user.
 * 
 * @typedef {Object} Task
 * @property {string} title - The title of the task (required, max length: 50).
 * @property {string} [details] - Additional details about the task (optional, max length: 500).
 * @property {Date} date - The date the task is scheduled for (required).
 * @property {string} time - The time the task is scheduled for (required).
 * @property {string} status - The current status of the task (default: 'Pending', enum: ['Pending', 'In-progress', 'Completed']).
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user associated with the task (required, references the 'User' model).
 * @property {Date} createdAt - The timestamp when the task was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the task was last updated (auto-generated).
 */
const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength: 50 },
        details: { type: String, maxlength: 500 },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['Pending', 'In-progress', 'Completed'], 
            default: 'Pending' 
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", TaskSchema);