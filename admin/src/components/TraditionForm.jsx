import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const CATEGORIES = [
  { value: 'festival', label: 'Φεστιβάλ' },
  { value: 'museum',   label: 'Μουσείο' },
  { value: 'church',   label: 'Εκκλησία' },
  { value: 'music',    label: 'Μουσική' },
  { value: 'dance',    label: 'Χορός' },
  { value: 'food',     label: 'Φαγητό' },
  { value: 'custom',   label: 'Άλλο' }
];

const EMPTY = {
  name: '', description: '', detailedDescription: '',
  category: 'custom', image: '', youtube: '', google: '', visitgreece: ''
};

export default function TraditionForm({ initial = {}, onSubmit, onCancel, loading, token }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name) return setError('Συμπληρώστε το όνομα παράδοσης.');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="mb-3">
        <label className="form-label fw-semibold">Όνομα Παράδοσης *</label>
        <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Κατηγορία</label>
        <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Σύντομη Περιγραφή</label>
        <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Αναλυτική Περιγραφή</label>
        <textarea className="form-control" rows={4} value={form.detailedDescription} onChange={e => set('detailedDescription', e.target.value)}
          placeholder="Υποστηρίζει HTML..." />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Εικόνα</label>
        <ImageUploader token={token} value={form.image} onChange={v => set('image', v)} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">YouTube URL</label>
        <input className="form-control" value={form.youtube} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/..." />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Google URL</label>
        <input className="form-control" value={form.google} onChange={e => set('google', e.target.value)} placeholder="https://google.com/..." />
      </div>
      <div className="mb-4">
        <label className="form-label fw-semibold">Visit Greece URL</label>
        <input className="form-control" value={form.visitgreece} onChange={e => set('visitgreece', e.target.value)} placeholder="https://visitgreece.gr/..." />
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
