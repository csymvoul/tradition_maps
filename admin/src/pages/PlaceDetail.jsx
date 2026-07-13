import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlace, updatePlace, createTradition, updateTradition, deleteTradition } from '../api';
import PlaceForm from '../components/PlaceForm';
import TraditionForm from '../components/TraditionForm';
import ConfirmButton from '../components/ConfirmButton';

const CAT_LABELS = {
  festival:'Φεστιβάλ', museum:'Μουσείο', church:'Εκκλησία',
  music:'Μουσική', dance:'Χορός', food:'Φαγητό', custom:'Άλλο'
};

export default function PlaceDetail({ token }) {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPlace, setEditPlace] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddTrad, setShowAddTrad] = useState(false);
  const [editTrad, setEditTrad] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try { setPlace(await getPlace(id)); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [id]);

  async function handleUpdatePlace(data) {
    setSaving(true);
    try { setPlace(await updatePlace(token, id, data)); setEditPlace(false); }
    finally { setSaving(false); }
  }

  async function handleAddTradition(data) {
    setSaving(true);
    try { setPlace(await createTradition(token, id, data)); setShowAddTrad(false); }
    finally { setSaving(false); }
  }

  async function handleUpdateTradition(tid, data) {
    setSaving(true);
    try { setPlace(await updateTradition(token, id, tid, data)); setEditTrad(null); }
    finally { setSaving(false); }
  }

  async function handleDeleteTradition(tid) {
    try { setPlace(await deleteTradition(token, id, tid)); }
    catch (err) { setError(err.message); }
  }

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height:'60vh' }}>
      <div className="spinner-border text-dark" />
    </div>
  );
  if (!place) return <div className="alert alert-danger">Το μέρος δεν βρέθηκε.</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link to="/places" className="text-decoration-none text-muted">
          <i className="bi bi-arrow-left me-1"></i>Μέρη
        </Link>
        {/* Preview button */}
        <a
          href={`/place/${id}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-eye me-1"></i>Προεπισκόπηση
        </a>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Place info */}
      <div className="card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="fw-bold mb-1">{place.name}</h4>
            {place.region && <span className="badge bg-secondary mb-2">{place.region}</span>}
            <p className="text-muted mb-0" style={{ fontSize:'0.9rem' }}>{place.description}</p>
          </div>
          <button className="btn btn-outline-dark btn-sm ms-3 flex-shrink-0"
            onClick={() => setEditPlace(!editPlace)}>
            <i className="bi bi-pencil me-1"></i>{editPlace ? 'Ακύρωση' : 'Επεξεργασία'}
          </button>
        </div>

        {editPlace && (
          <div className="mt-4 pt-4 border-top">
            <PlaceForm
              initial={place}
              onSubmit={handleUpdatePlace}
              onCancel={() => setEditPlace(false)}
              loading={saving}
              token={token}
            />
          </div>
        )}
      </div>

      {/* Traditions header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          Παραδόσεις <span className="badge bg-secondary ms-1">{(place.traditions||[]).length}</span>
        </h5>
        <button className="btn btn-dark btn-sm"
          onClick={() => { setShowAddTrad(!showAddTrad); setEditTrad(null); }}>
          <i className="bi bi-plus-lg me-1"></i>{showAddTrad ? 'Ακύρωση' : 'Νέα Παράδοση'}
        </button>
      </div>

      {showAddTrad && (
        <div className="card p-4 mb-4">
          <h6 className="fw-semibold mb-3">Προσθήκη Παράδοσης</h6>
          <TraditionForm
            onSubmit={handleAddTradition}
            onCancel={() => setShowAddTrad(false)}
            loading={saving}
            token={token}
          />
        </div>
      )}

      {(place.traditions||[]).length === 0 ? (
        <div className="text-center text-muted py-4 card">
          <i className="bi bi-collection" style={{ fontSize:'2rem' }}></i>
          <p className="mt-2 mb-0">Δεν υπάρχουν παραδόσεις. Προσθέστε την πρώτη!</p>
        </div>
      ) : (
        <div className="row g-3">
          {(place.traditions||[]).map(t => (
            <div key={t.id} className="col-12">
              <div className="card p-3">
                {editTrad === t.id ? (
                  <>
                    <h6 className="fw-semibold mb-3">Επεξεργασία: {t.name}</h6>
                    <TraditionForm
                      initial={t}
                      onSubmit={data => handleUpdateTradition(t.id, data)}
                      onCancel={() => setEditTrad(null)}
                      loading={saving}
                      token={token}
                    />
                  </>
                ) : (
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <span className={`badge badge-${t.category||'custom'}`}>
                          {CAT_LABELS[t.category]||t.category}
                        </span>
                        <strong>{t.name}</strong>
                        {(t.images||[]).length > 0 && (
                          <small className="text-muted">
                            <i className="bi bi-images me-1"></i>{(t.images||[]).length} εικόνες
                          </small>
                        )}
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize:'0.87rem' }}>
                        {t.description ? t.description.substring(0,150) + (t.description.length>150?'…':'') : ''}
                      </p>
                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        {t.youtube && <a href={t.youtube} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm py-0"><i className="bi bi-youtube me-1"></i>YouTube</a>}
                        {t.google && <a href={t.google} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm py-0"><i className="bi bi-search me-1"></i>Google</a>}
                        {t.visitgreece && <a href={t.visitgreece} target="_blank" rel="noreferrer" className="btn btn-success btn-sm py-0"><i className="bi bi-globe me-1"></i>Visit Greece</a>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0 flex-wrap justify-content-end">
                      <button className="btn btn-sm btn-outline-dark"
                        onClick={() => { setEditTrad(t.id); setShowAddTrad(false); }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <ConfirmButton
                        onConfirm={() => handleDeleteTradition(t.id)}
                        message="Διαγραφή;"
                      >
                        <i className="bi bi-trash"></i>
                      </ConfirmButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
