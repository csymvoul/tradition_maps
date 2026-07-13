import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ token, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/');
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar d-flex flex-column">
        <div className="brand">
          <i className="bi bi-map-fill me-2 text-warning"></i>
          Διαχείριση
        </div>
        <nav className="flex-grow-1">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </NavLink>
          <NavLink to="/places" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-geo-alt me-2"></i>Μέρη
          </NavLink>
          <a href="/" target="_blank" className="nav-link" style={{ marginTop: 'auto' }}>
            <i className="bi bi-box-arrow-up-right me-2"></i>Δες το Site
          </a>
        </nav>
        <div style={{ padding: '16px' }}>
          <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>Αποσύνδεση
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content p-4">
        <Outlet />
      </div>
    </div>
  );
}
