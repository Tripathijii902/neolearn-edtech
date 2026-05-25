const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required']
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String, // AWS S3 or Cloudinary URL
    required: [true, 'Video URL is required']
  },
  duration: {
    type: Number, // duration in seconds
    required: true
  },
  order: {
    type: Number, // ordering within the module
    required: true
  },
  isFreePreview: {
    type: Boolean,
    default: false
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required']
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please specify a price (0 for free)']
  },
  thumbnailUrl: {
    type: String, // AWS S3 URL for course cover image
    required: true
  },
  tags: {
    type: [String],
    index: true
  },
  modules: [moduleSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
