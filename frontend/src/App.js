import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
// import Home from './pages/Home';
import NewsFeed from './pages/NewsFeed';
import ArticleDetail from './pages/ArticleDetail';
import Notes from './pages/Notes';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Home />} /> */}

        {/* //show news feed instead of home */}
        <Route path="/" element={<Navigate to="/news" />} />     






        <Route path="/news" element={<NewsFeed />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/notes" element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            {/* <Profile /> */}
          </ProtectedRoute>
        } />
      </Route>
      
      {/* 404 route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
