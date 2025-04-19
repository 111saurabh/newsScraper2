import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../contexts/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(searchParams.get('addNote') === 'true');

  // Fetch article details
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/articles/${id}`);
        setArticle(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch article. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  // Fetch user's notes for this article if authenticated
  useEffect(() => {
    const fetchNotes = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await axios.get(`/api/notes/article/${id}`);
        setNotes(response.data);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    
    fetchNotes();
  }, [id, isAuthenticated]);

  // Handle adding a new note
  const handleAddNote = (newNote) => {
    setNotes([newNote, ...notes]);
    setShowNoteForm(false);
  };

  // Handle updating a note
  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note._id === updatedNote._id ? updatedNote : note
    ));
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId));
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Article not found'}
      </div>
    );
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
            {article.source}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {article.category}
          </span>
          <span>{publishedDate}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        <p className="text-lg text-gray-700 mb-4">{article.summary}</p>
        
        <div className="text-sm text-gray-600">
          By {article.author}
        </div>
      </div>
      
      {/* Article image */}
      {article.imageUrl && (
        <div className="mb-8">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full max-h-96 object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
            }}
          />
        </div>
      )}
      
      {/* Article content */}
      <div className="prose max-w-none mb-8">
        {article.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
      
      {/* Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Notes section */}
      {isAuthenticated && (
        <div className="mt-12 border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Notes</h2>
            
            {!showNoteForm && (
              <button 
                onClick={() => setShowNoteForm(true)}
                className="btn btn-primary"
              >
                Add Note
              </button>
            )}
          </div>
          
          {showNoteForm && (
            <div className="mb-8">
              <NoteForm 
                articleId={id} 
                onSuccess={handleAddNote}
                onCancel={() => setShowNoteForm(false)}
              />
            </div>
          )}
          
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map(note => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            !showNoteForm && (
              <p className="text-gray-600">
                You haven't added any notes for this article yet.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
