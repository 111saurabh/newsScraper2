import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">The News Scraper</h1>
          <p className="mt-2 text-gray-600">Your personalized news aggregator</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
