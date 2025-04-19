const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes for current user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to current user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get notes for a specific article
router.get('/article/:articleId', async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      articleId: req.params.articleId
    }).sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new note
router.post('/', async (req, res) => {
  try {
    const { title, content, articleId, tags, color } = req.body;
    
    // Create new note
    const newNote = new Note({
      title,
      content,
      articleId,
      userId: req.user.id,
      tags: tags || [],
      color: color || '#ffffff'
    });
    
    await newNote.save();
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to current user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update fields
    const { title, content, tags, color, isPinned } = req.body;
    
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (color) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to current user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await note.remove();
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export notes as PDF
router.get('/export/pdf', async (req, res) => {
  try {
    // This endpoint would generate a PDF from user's notes
    // In a real implementation, you would use a library like PDFKit
    // For now, we'll just return a message
    
    res.json({
      message: 'PDF export functionality would be implemented here',
      notes: await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
