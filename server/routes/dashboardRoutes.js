import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Projects: where user is owner or team member
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { teamMembers: userId }],
    });

    const projectStats = {
      total: userProjects.length,
      active: userProjects.length - 2, // You can enhance this later
      completed: 2,
    };

    // Get all tasks from user projects
    const projectIds = userProjects.map(p => p._id);

    const allTasks = await Task.find({ project: { $in: projectIds } });

    const taskOverview = {
      completed: allTasks.filter(t => t.status === 'Completed').length,
      open: allTasks.filter(t => t.status === 'In Progress').length,
      overdue: allTasks.filter(t => t.status === 'Todo').length,
    };

    const taskDistribution = [
      { name: 'Completed', value: taskOverview.completed },
      { name: 'Pending', value: taskOverview.open },
      { name: 'Overdue', value: taskOverview.overdue },
    ];

    // Mocked data
    const invoices = {
      overdue: 5,
      notPaid: 5,
      partiallyPaid: 5,
      fullyPaid: 15,
      draft: 3,
      total: 183000,
      currency: 'USD',
    };

    const meetings = [
      { id: 1, title: 'App Project', time: '6:45 PM', mode: 'Meet' },
      { id: 2, title: 'User Research', time: '6:45 PM', mode: 'Zoom' },
    ];

    const tickets = [
      { id: 1, name: 'Jacob Martinez', msg: 'Need three more features on the mobile-app design.' },
      { id: 2, name: 'Luke Bell', msg: 'Need three more features on the mobile-app design.' },
      { id: 3, name: 'Connor Mitchell', msg: 'Need three more features on the mobile-app design.' },
    ];

    const notifications = [
      '✅ Project “Website Redesign” marked as completed.',
      '⚠️ Task “Fix login bug” is overdue.',
      '📅 Meeting scheduled with client on May 25.',
      '💬 New message from John Doe.',
    ];

    res.json({
      projectStats,
      taskOverview,
      taskDistribution,
      invoices,
      meetings,
      tickets,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard stats failed', error: err.message });
  }
});

export default router;
