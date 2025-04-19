import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../contexts/AuthContext';

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch user's notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/notes');
        setNotes(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch notes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, []);

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

  // Export notes as PDF
  const handleExportPDF = () => {
    setExportLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('My Notes - The News Scraper', 20, 20);
      
      // Add user info
      doc.setFontSize(12);
      doc.text(`User: ${currentUser.username}`, 20, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);
      
      // Add notes
      let yPosition = 50;
      
      notes.forEach((note, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Note title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${note.title}`, 20, yPosition);
        yPosition += 7;
        
        // Note content
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        // Split content into lines to avoid overflow
        const contentLines = doc.splitTextToSize(note.content, 170);
        doc.text(contentLines, 20, yPosition);
        yPosition += contentLines.length * 7 + 5;
        
        // Tags
        if (note.tags && note.tags.length > 0) {
          doc.setFontSize(10);
          doc.text(`Tags: ${note.tags.join(', ')}`, 20, yPosition);
          yPosition += 7;
        }
        
        // Date
        doc.setFontSize(10);
        doc.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, 20, yPosition);
        yPosition += 15;
      });
      
      // Save the PDF
      doc.save('my-notes.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to export notes as PDF. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        
        <button
          onClick={handleExportPDF}
          disabled={exportLoading || notes.length === 0}
          className="btn btn-primary"
        >
          {exportLoading ? 'Exporting...' : 'Export as PDF'}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Notes */}
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">You haven't created any notes yet.</p>
              <p className="mt-2">Browse articles and add notes to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map(note => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
