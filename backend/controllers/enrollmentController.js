const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Enroll a student in a course
// @route   POST /api/v1/enroll/:courseId
// @access  Private (Student)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Get user
    const user = await User.findById(userId);

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(id => id.toString() === courseId.toString());
    if (isEnrolled) {
      return res.status(400).json({ success: false, error: 'You are already enrolled in this course' });
    }

    // Add to enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: user.enrolledCourses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's enrolled courses (populated)
// @route   GET /api/v1/enroll/my-courses
// @access  Private (Student)
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');

    res.status(200).json({
      success: true,
      count: user.enrolledCourses.length,
      data: user.enrolledCourses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a quiz score
// @route   POST /api/v1/enroll/:courseId/quiz
// @access  Private (Student)
exports.saveQuizScore = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { score, passed } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if enrolled
    const isEnrolledQuiz = user.enrolledCourses.some(id => id.toString() === courseId.toString());
    if (!isEnrolledQuiz) {
      return res.status(403).json({ success: false, error: 'You must be enrolled to take the quiz.' });
    }

    // Check if score already exists and update, or push new
    const existingIndex = user.quizScores.findIndex(q => q.courseId.toString() === courseId);
    if (existingIndex > -1) {
      user.quizScores[existingIndex] = { courseId, score, passed, date: Date.now() };
    } else {
      user.quizScores.push({ courseId, score, passed });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.quizScores
    });
  } catch (err) {
    next(err);
  }
};
