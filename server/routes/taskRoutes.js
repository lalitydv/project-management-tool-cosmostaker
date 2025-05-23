
import express from 'express';
import {
  addTask,
  getProjectTasks,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addTask); // create
router.get('/:projectId', protect, getProjectTasks); // fetch tasks by project
router.put('/:id', protect, updateTaskStatus); // update status
router.delete('/:id', protect, deleteTask); // delete task

export default router;
