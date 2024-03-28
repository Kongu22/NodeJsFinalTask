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
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
