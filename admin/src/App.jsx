import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';

export default function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route element={<Layout token={token} onLogout={() => setToken(null)} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard token={token} />} />
          <Route path="places" element={<Places token={token} />} />
          <Route path="places/:id" element={<PlaceDetail token={token} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
