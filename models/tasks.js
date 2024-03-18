const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    deadline: {
        type: Date,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
