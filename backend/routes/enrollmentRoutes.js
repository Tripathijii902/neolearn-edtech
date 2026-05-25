const express = require('express');
const { enrollInCourse, getEnrolledCourses, saveQuizScore } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/my-courses', getEnrolledCourses);
router.post('/:courseId', enrollInCourse);
router.post('/:courseId/quiz', saveQuizScore);

module.exports = router;
