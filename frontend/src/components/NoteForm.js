import React, { useState } from 'react';
import axios from 'axios';

const NoteForm = ({ articleId, note = null, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [color, setColor] = useState(note?.color || '#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isEditing = !!note;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      return setError('Title and content are required');
    }
    
    try {
      setLoading(true);
      setError('');
      
      const noteData = {
        title,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        color,
        articleId
      };
      
      let response;
      
      if (isEditing) {
        response = await axios.put(`/api/notes/${note._id}`, noteData);
      } else {
        response = await axios.post('/api/notes', noteData);
      }
      
      onSuccess(response.data);
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card p-4" style={{ backgroundColor: color }}>
      <h3 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Note' : 'Add New Note'}
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title"
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="label">Content</label>
          <textarea
            id="content"
            className="input min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your notes about this article..."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="label">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="important, follow-up, idea"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="color" className="label">Note Color</label>
          <div className="flex items-center">
            <input
              id="color"
              type="color"
              className="h-10 w-10 rounded border border-gray-300"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <span className="ml-2 text-gray-600">{color}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
