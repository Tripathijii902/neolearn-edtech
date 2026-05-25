const express = require('express');
const { createCourse, getMyCreatedCourses } = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require the user to be logged in and have the 'instructor' or 'admin' role
router.use(protect);
router.use(authorize('instructor', 'admin'));

router
  .route('/courses')
  .post(createCourse)
  .get(getMyCreatedCourses);

module.exports = router;
