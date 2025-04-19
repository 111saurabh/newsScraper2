import React from 'react';

const SourceFilter = ({ sources, selectedSource, onChange }) => {
  return (
    <div>
      <label htmlFor="source-filter" className="label">Filter by Source</label>
      <select
        id="source-filter"
        className="input"
        value={selectedSource}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Sources</option>
        {sources.map(source => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SourceFilter;
