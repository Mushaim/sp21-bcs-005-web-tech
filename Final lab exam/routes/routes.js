const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const multer = require('multer');
const { validateTaskLength } = require('../middlewares/middleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

router.post('/add',validateTaskLength, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.json({ message: err.message, type: 'danger' });
        }

        const task = new Task({
            task: req.body.task,
            assignedTo: req.body.assignedTo, 
        });

        task.save()
            .then(() => {
                req.session.message = {
                    type: 'success',
                    message: 'Task Added Successfully'
                };
                res.redirect('/');
            })
            .catch((err) => {
                res.json({ message: err.message, type: 'danger' });
            });
    });
});

router.get('/', (req, res) => {
    Task.find().exec()
        .then((tasks) => {
            // Pass the tasks to index.ejs when rendering
            res.render('index', {
                title: 'Home Page',
                tasks: tasks  // Pass tasks variable here
            });
        })
        .catch((err) => {
            res.json({ message: err.message });
        });
});



router.get('/add', (req, res) => {
    res.render('addTask', { title: 'Add Task' });
});

router.get('/edit/:id', (req, res) => {
    const taskId = req.params.id;

    Task.findById(taskId)
        .exec()
        .then((task) => {
            if (!task) {
                return res.status(404).send('Task not found');
            }

            res.render('editTask', { title: 'Edit Task', task: task });
        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        });
});
router.post('/update/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTaskData = req.body; // Assuming form data is sent as JSON

        // Find the task by ID and update its data
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        // Redirect to the updated task's page or any other desired route
        res.redirect(`/tasks/${updatedTask._id}`);
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});
router.get('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).send('Task not found');
        }

        // Render a page or send JSON with the task details
        res.render('/', { title: 'Task Details', task: task });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/delete/:id', (req, res) => {
    const taskId = req.params.id;

    Task.findByIdAndDelete(taskId)
        .then((deletedTask) => {
            if (!deletedTask) {
                return res.status(404).send('Task not found');
            }
            
            req.session.message = {
                type: 'success',
                message: 'Task Deleted Successfully'
            };
            res.redirect('/');
        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        });
});

module.exports = router;
