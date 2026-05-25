const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Prevent duplicate enrollments
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Pre-save hook to calculate completion percentage
enrollmentSchema.pre('save', async function(next) {
  if (this.isModified('completedLessons')) {
    try {
      // In a real application, you'd fetch the total lessons from the Course model here.
      // E.g., const course = await mongoose.model('Course').findById(this.courseId);
      // const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
      // this.completionPercentage = (this.completedLessons.length / totalLessons) * 100;
      
      // For demonstration, we'll leave the framework in place to update this via a controller or hook
      if (this.completionPercentage === 100) {
        this.isCompleted = true;
      }
    } catch (err) {
      console.error(err);
    }
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
