import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ArticleCard = ({ article }) => {
  const { isAuthenticated } = useAuth();
  const date = new Date(article.publishedAt).toLocaleDateString();
  
  return (
    <div className="card h-full flex flex-col">
      <div className="relative">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/300x200?text=No+Image';
            }}
          />
        )}
        <div className="absolute top-0 right-0 bg-primary-600 text-white px-2 py-1 text-xs">
          {article.source}
        </div>
        <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-75 text-white px-2 py-1 text-xs">
          {article.category}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          <Link to={`/article/${article._id}`} className="hover:text-primary-600">
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
          <span>{date}</span>
          <span>{article.author}</span>
        </div>
      </div>
      
      <div className="px-4 pb-4 flex justify-between">
        <Link 
          to={`/article/${article._id}`} 
          className="text-primary-600 hover:text-primary-800"
        >
          Read more
        </Link>
        
        {isAuthenticated && (
          <Link 
            to={`/article/${article._id}?addNote=true`} 
            className="text-secondary-600 hover:text-secondary-800"
          >
            Add note
          </Link>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
