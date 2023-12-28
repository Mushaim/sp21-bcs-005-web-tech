const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
	{
		task: { type: String },
		status: {
			type: String,
			enum: ['backlog', 'todo', 'doing', 'done'],
			default: 'backlog',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
