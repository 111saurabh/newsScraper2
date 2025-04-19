const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  isPinned: {
    type: Boolean,
    default: false
  }
});

// Pre-save hook to update the updatedAt field
NoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
