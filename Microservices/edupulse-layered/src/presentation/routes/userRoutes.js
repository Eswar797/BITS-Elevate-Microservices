const express = require('express');
const router = express.Router();
const userService = require('../../application/services/UserService');
const { authenticateToken } = require('../../infrastructure/security');

// Auth routes
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User management routes
router.get('/userManagement/getAll', authenticateToken, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/userManagement/remove/:id', authenticateToken, async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/userManagement/update/:id', authenticateToken, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Profile routes
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/enroll/:courseId', authenticateToken, async (req, res) => {
  try {
    const user = await userService.enrollInCourse(req.user.id, req.params.courseId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 