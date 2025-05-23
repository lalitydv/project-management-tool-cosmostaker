import express from 'express';
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);            // Create
router.get('/', protect, getUserProjects);           // Read
router.put('/:id', protect, updateProject);          // Update
router.delete('/:id', protect, deleteProject);       // Delete

export default router;
