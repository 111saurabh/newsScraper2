import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import CategoryFilter from '../components/CategoryFilter';
import SourceFilter from '../components/SourceFilter';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    source: '',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1
  });

  // Fetch categories and sources on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, sourcesRes] = await Promise.all([
          axios.get('/api/articles/categories/list'),
          axios.get('/api/articles/sources/list')
        ]);
        
        setCategories(categoriesRes.data);
        setSources(sourcesRes.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    
    fetchFilters();
  }, []);

  // Fetch articles when filters change
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.source) params.append('source', filters.source);
        if (filters.search) params.append('search', filters.search);
        params.append('page', filters.page);
        
        const response = await axios.get(`/api/articles?${params.toString()}`);
        
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
        setError('');
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [filters]);

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category, page: 1 });
  };
  
  const handleSourceChange = (source) => {
    setFilters({ ...filters, source, page: 1 });
  };
  
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">News Feed</h1>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-3">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search articles..."
              className="input flex-grow"
              value={filters.search}
              onChange={handleSearchChange}
            />
            <button type="submit" className="btn btn-primary ml-2">
              Search
            </button>
          </form>
        </div>
        
        {/* Category filter */}
        <div>
          <CategoryFilter 
            categories={categories} 
            selectedCategory={filters.category}
            onChange={handleCategoryChange}
          />
        </div>
        
        {/* Source filter */}
        <div>
          <SourceFilter 
            sources={sources} 
            selectedSource={filters.source}
            onChange={handleSourceChange}
          />
        </div>
        
        {/* Clear filters */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ category: '', source: '', search: '', page: 1 })}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
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
          {/* Articles */}
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
              <p className="mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                <div className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                  Page {filters.page} of {pagination.pages}
                </div>
                
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
