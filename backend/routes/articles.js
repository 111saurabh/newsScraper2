const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, source, search, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (source) {
      query.source = source;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Get articles
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Article.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available sources
router.get('/sources/list', async (req, res) => {
  try {
    const sources = await Article.distinct('source');
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin only: Create new article
router.post('/', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { title, content, summary, url, imageUrl, source, category, author, publishedAt, keywords } = req.body;
    
    // Check if article already exists
    const existingArticle = await Article.findOne({ url });
    if (existingArticle) {
      return res.status(400).json({ message: 'Article with this URL already exists' });
    }
    
    // Create new article
    const newArticle = new Article({
      title,
      content,
      summary,
      url,
      imageUrl,
      source,
      category,
      author,
      publishedAt: publishedAt || new Date(),
      keywords: keywords || []
    });
    
    await newArticle.save();
    
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin only: Update article
router.put('/:id', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Update fields
    const { title, content, summary, imageUrl, category, author, keywords } = req.body;
    
    if (title) article.title = title;
    if (content) article.content = content;
    if (summary) article.summary = summary;
    if (imageUrl) article.imageUrl = imageUrl;
    if (category) article.category = category;
    if (author) article.author = author;
    if (keywords) article.keywords = keywords;
    
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin only: Delete article
router.delete('/:id', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await article.remove();
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
