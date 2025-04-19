import React, { useState } from 'react';
import axios from 'axios';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const createdDate = new Date(note.createdAt).toLocaleDateString();
  
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notes/${note._id}`);
      onDelete(note._id);
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };
  
  if (isEditing) {
    return (
      <div className="mb-4">
        {/* <NoteForm 
          note={note} 
          articleId={note.articleId}
          onSuccess={(updatedNote) => {
            onUpdate(updatedNote);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        /> */}
      </div>
    );
  }
  
  return (
    <div 
      className="card p-4 transition-all hover:shadow-lg"
      style={{ backgroundColor: note.color }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{note.title}</h3>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-primary-600"
          >
            Edit
          </button>
          
          <button 
            onClick={() => setShowConfirmDelete(true)}
            className="text-gray-600 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mt-2 whitespace-pre-line">
        {note.content}
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-white bg-opacity-50 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-right text-xs text-gray-600">
        Created on {createdDate}
      </div>
      
      {showConfirmDelete && (
        <div className="mt-4 border-t pt-4">
          <p className="text-red-600 font-medium">Are you sure you want to delete this note?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
