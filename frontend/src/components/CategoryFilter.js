import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onChange }) => {
  return (
    <div>
      <label htmlFor="category-filter" className="label">Filter by Category</label>
      <select
        id="category-filter"
        className="input"
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
