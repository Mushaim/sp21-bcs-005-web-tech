const user = require('../../database/model/user.model');
const Task = require('../../database/model/task.model');

const addTask = async (req, res) => {
	const { task, createdBy, assignedTo } = req.body;

	try {
		if (!task) return res.status(400).send('Please enter the task');
		if (task.length < 10) return res.status(400).send('Add a minimum of 10 characters for the task');

		const taskDetail = new Task({
			task,
			createdBy,
			assignedTo,
		});

		await taskDetail.save();

		// Log specific properties
		console.log('Task:', taskDetail.task);
		console.log('Created By:', taskDetail.createdBy);
		console.log('Assigned To:', taskDetail.assignedTo);

		return res.status(200).send(taskDetail);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Task addition failed');
	}
};

const getAllTasks = async (req, res) => {
    const { id } = req.query;

    try {
        const foundUser = await user.findById(id); // Using 'user' instead of 'User'
        if (!foundUser) {
            return res.status(404).send('User not found');
        }

        const userRole = foundUser.status; // Updated variable name here as well
        let tasklist;

        if (userRole === 'admin') {
            // Admin can see all tasks
            tasklist = await Task.find().populate('assignedTo', 'email');
        } else if (userRole === 'user') {
            // Regular user can only see tasks assigned to them
            tasklist = await Task.find({ assignedTo: id }).populate('assignedTo', 'email');
        } else {
            return res.status(403).send('Unauthorized'); // Handle other roles as needed
        }

        return res.status(200).send(tasklist);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to fetch tasks');
    }
};





const editTask = async (req, res) => {
	try {
		const id = req.params.id;
		console.log("id server", id);
		console.log("req.body", req.body);

		const taskExist = await Task.findById(id);

		if (!taskExist) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// Destructure task and assignedTo from req.body
		const { task, assignedTo } = req.body;

		// Find the user by email
		const userFound = await user.findOne({ email: assignedTo });

		if (!userFound) {
			return res.status(404).json({ msg: "User not found" });
		}

		// Update the task with assignedTo user ID and task details
		const updatedTask = await Task.findByIdAndUpdate(
			id,
			{ task: task, assignedTo: userFound._id },
			{ new: true }
		);

		if (!updatedTask) {
			return res.status(404).json({ msg: "Failed to update task" });
		}

		res.status(200).json({ msg: "Task updated successfully", updatedTask });
	} catch (error) {
		// Log the error for debugging
		console.error("Error in editTask:", error);
		res.status(500).json({ error: error.message });
	}
};

const statusChange = async (req, res) => {
	const { id, string } = req.body;
	try {
		let task = await Task.findById(id);
		if (string === 'right') {
			if (task.status === 'backlog') {
				task.status = 'todo';
				task.save();
				return res.send(task);
			} else if (task.status === 'todo') {
				task.status = 'doing';
				task.save();
				return res.send(task);
			} else if (task.status === 'doing') {
				task.status = 'done';
				task.save();
				return res.send(task);
			}
		} else {
			if (task.status === 'done') {
				task.status = 'doing';
				task.save();
				return res.send(task);
			} else if (task.status === 'doing') {
				task.status = 'todo';
				task.save();
				return res.send(task);
			} else if (task.status === 'todo') {
				task.status = 'backlog';
				task.save();
				return res.send(task);
			}
		}
	} catch (error) {}
};

const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		let response = await Task.findByIdAndDelete(id);
		return res.status(200).send(response);
	} catch (error) {
		return res.status(400).send('deleteFailed');
	}
};

module.exports = {
	addTask,
	getAllTasks,
	editTask,
	statusChange,
	deleteTask,
};
