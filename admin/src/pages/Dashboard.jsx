import React, { useState, useEffect } from 'react';
import { getPlaces } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard({ token }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaces().then(setPlaces).finally(() => setLoading(false));
  }, []);

  const totalTraditions = places.reduce((acc, p) => acc + (p.traditions?.length || 0), 0);

  const catCounts = {};
  places.forEach(p => (p.traditions || []).forEach(t => {
    catCounts[t.category || 'custom'] = (catCounts[t.category || 'custom'] || 0) + 1;
  }));

  const CAT_LABELS = {
    festival: 'Φεστιβάλ', museum: 'Μουσείο', church: 'Εκκλησία',
    music: 'Μουσική', dance: 'Χορός', food: 'Φαγητό', custom: 'Άλλο'
  };

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-dark" />
    </div>
  );

  return (
    <div>
      <h3 className="fw-bold mb-4">Dashboard</h3>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <div className="card stat-card">
            <div className="stat-number text-primary">{places.length}</div>
            <div className="text-muted">Συνολικά Μέρη</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="card stat-card">
            <div className="stat-number text-success">{totalTraditions}</div>
            <div className="text-muted">Συνολικές Παραδόσεις</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="card stat-card">
            <div className="stat-number text-warning">{Object.keys(catCounts).length}</div>
            <div className="text-muted">Κατηγορίες</div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(catCounts).length > 0 && (
        <div className="card mb-4 p-3">
          <h6 className="fw-semibold mb-3">Παραδόσεις ανά Κατηγορία</h6>
          {Object.entries(catCounts).map(([cat, count]) => (
            <div key={cat} className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <small className="fw-semibold">{CAT_LABELS[cat] || cat}</small>
                <small className="text-muted">{count}</small>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className={`progress-bar badge-${cat}`}
                  style={{ width: `${(count / totalTraditions) * 100}%`, backgroundColor: undefined }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent places */}
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Μέρη</h6>
          <Link to="/places" className="btn btn-sm btn-dark">Διαχείριση →</Link>
        </div>
        <table className="table table-sm table-hover mb-0">
          <thead>
            <tr>
              <th>Όνομα</th>
              <th>Περιοχή</th>
              <th>Παραδόσεις</th>
            </tr>
          </thead>
          <tbody>
            {places.map(p => (
              <tr key={p.id}>
                <td><Link to={`/places/${p.id}`} className="text-decoration-none fw-semibold">{p.name}</Link></td>
                <td className="text-muted">{p.region || '—'}</td>
                <td><span className="badge bg-secondary">{(p.traditions || []).length}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
