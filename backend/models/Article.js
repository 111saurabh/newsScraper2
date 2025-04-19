const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String
  },
  source: {
    type: String,
    required: true,
    enum: ['WION', 'Firstpost', 'NDTV', 'The Wire']
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science', 'World']
  },
  author: {
    type: String,
    default: 'Unknown'
  },
  publishedAt: {
    type: Date,
    required: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  keywords: [{
    type: String
  }]
});

// Index for faster searches
ArticleSchema.index({ title: 'text', content: 'text', keywords: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
