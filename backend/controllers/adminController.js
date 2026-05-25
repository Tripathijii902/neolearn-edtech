const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get admin statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Aggregate users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Aggregate enrollments
    const enrollments = await User.aggregate([
      { $project: { numberOfEnrollments: { $size: '$enrolledCourses' } } },
      { $group: { _id: null, totalEnrollments: { $sum: '$numberOfEnrollments' } } }
    ]);

    const totalEnrollments = enrollments.length > 0 ? enrollments[0].totalEnrollments : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        usersByRole
      }
    });
  } catch (err) {
    next(err);
  }
};
