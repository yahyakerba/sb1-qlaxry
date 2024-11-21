import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicView } from './pages/PublicView';
import { AdminView } from './pages/AdminView';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/view" replace />} />
          <Route path="/view" element={<PublicView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;