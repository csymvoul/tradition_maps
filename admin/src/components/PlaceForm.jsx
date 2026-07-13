import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const EMPTY = { name: '', description: '', region: '', latitude: '', longitude: '', image: '' };

export default function PlaceForm({ initial = {}, onSubmit, onCancel, loading, token }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.latitude || !form.longitude) {
      return setError('Συμπληρώστε όνομα, γεωγραφικό πλάτος και μήκος.');
    }
    try {
      await onSubmit({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="mb-3">
        <label className="form-label fw-semibold">Όνομα *</label>
        <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Περιοχή</label>
        <input className="form-control" value={form.region} onChange={e => set('region', e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Περιγραφή</label>
        <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label fw-semibold">Γεωγρ. Πλάτος *</label>
          <input type="number" step="any" className="form-control" value={form.latitude}
            onChange={e => set('latitude', e.target.value)} required />
        </div>
        <div className="col-6">
          <label className="form-label fw-semibold">Γεωγρ. Μήκος *</label>
          <input type="number" step="any" className="form-control" value={form.longitude}
            onChange={e => set('longitude', e.target.value)} required />
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label fw-semibold">Εικόνα</label>
        <ImageUploader token={token} value={form.image} onChange={v => set('image', v)} />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-dark" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
          Αποθήκευση
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Ακύρωση
        </button>
      </div>
    </form>
  );
}
