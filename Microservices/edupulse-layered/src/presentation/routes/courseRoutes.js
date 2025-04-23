const express = require('express');
const router = express.Router();
const courseService = require('../../application/services/CourseService');
const { authenticateToken } = require('../../infrastructure/security');

// Public routes
router.get('/courseManagement/getAll', async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/courseManagement/:id', async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ data: course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.post('/courseManagement', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    const courseData = {
      ...req.body,
      instructor: req.user.id
    };
    const course = await courseService.createCourse(courseData);
    res.status(201).json({ data: course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/courseManagement/:id', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the course instructor can update the course' });
    }

    const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
    res.json({ data: updatedCourse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/courseManagement/:id', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the course instructor can delete the course' });
    }

    await courseService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Course progress and completion
router.post('/courseManagement/completedCourse', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const result = await courseService.markCourseAsCompleted(userId, courseId);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/courseManagement/saveProgress', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId, step } = req.body;
    const result = await courseService.saveProgress(userId, courseId, step);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/courseManagement/completedCourses/:userId', authenticateToken, async (req, res) => {
  try {
    const courses = await courseService.getCompletedCourses(req.params.userId);
    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lesson management
router.post('/courseManagement/:id/lessons', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the course instructor can add lessons' });
    }

    const updatedCourse = await courseService.addLesson(req.params.id, req.body);
    res.status(201).json({ data: updatedCourse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/courseManagement/:id/lessons/:lessonId', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the course instructor can update lessons' });
    }

    const updatedCourse = await courseService.updateLesson(
      req.params.id,
      req.params.lessonId,
      req.body
    );
    res.json({ data: updatedCourse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/courseManagement/:id/lessons/:lessonId', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the course instructor can delete lessons' });
    }

    const updatedCourse = await courseService.deleteLesson(req.params.id, req.params.lessonId);
    res.json({ data: updatedCourse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 