const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/v1/instructor/courses
// @access  Private/Instructor
exports.createCourse = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.instructor = req.user.id;

    // Handle thumbnail (placeholder if not using Cloudinary yet)
    if (!req.body.thumbnailUrl) {
      req.body.thumbnailUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000';
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get courses created by the logged in instructor
// @route   GET /api/v1/instructor/courses
// @access  Private/Instructor
exports.getMyCreatedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    next(err);
  }
};
