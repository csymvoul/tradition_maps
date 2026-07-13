import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces, createPlace, deletePlace } from '../api';
import PlaceForm from '../components/PlaceForm';

export default function Places({ token }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setPlaces(await getPlaces());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data) {
    setSaving(true);
    try {
      await createPlace(token, data);
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Διαγραφή του μέρους "${name}"; Αυτό θα διαγράψει και όλες τις παραδόσεις του.`)) return;  // eslint-disable-line no-restricted-globals
    try {
      await deletePlace(token, id);
      setPlaces(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-dark" />
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Μέρη</h3>
        <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-lg me-1"></i>{showForm ? 'Ακύρωση' : 'Νέο Μέρος'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card p-4 mb-4">
          <h5 className="fw-semibold mb-3">Προσθήκη Νέου Μέρους</h5>
          <PlaceForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={saving} token={token} />
        </div>
      )}

      {places.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-geo-alt" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2">Δεν υπάρχουν μέρη. Προσθέστε το πρώτο!</p>
        </div>
      ) : (
        <div className="card">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Όνομα</th>
                <th>Περιοχή</th>
                <th>Παραδόσεις</th>
                <th>Συντεταγμένες</th>
                <th style={{ width: '120px' }}></th>
              </tr>
            </thead>
            <tbody>
              {places.map(p => (
                <tr key={p._id}>
                  <td className="fw-semibold">{p.name}</td>
                  <td className="text-muted">{p.region || '—'}</td>
                  <td>
                    <span className="badge bg-secondary">{(p.traditions || []).length}</span>
                  </td>
                  <td className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {p.latitude?.toFixed(3)}, {p.longitude?.toFixed(3)}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/places/${p.id}`} className="btn btn-sm btn-outline-dark">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id, p.name)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
