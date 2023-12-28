const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/add', taskController.addTask);
router.get('/tasks', taskController.getAllTasks);
router.put('/edit/:id', taskController.editTask); 

router
  .route('/:id')
  .put(taskController.statusChange)
  .delete(taskController.deleteTask);

module.exports = router;
