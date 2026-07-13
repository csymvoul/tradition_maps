import React, { useState, useRef } from 'react';
import { uploadImage } from '../api';

/**
 * Manages an ordered list of image URLs.
 * Props:
 *   token    — JWT token for authenticated uploads
 *   values   — string[] of image URLs
 *   onChange — called with updated string[]
 */
export default function MultiImageUploader({ token, values = [], onChange }) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  function remove(idx) {
    onChange(values.filter((_, i) => i !== idx));
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...values, url]);
    setUrlInput('');
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(token, file);
      onChange([...values, url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      {/* Thumbnails */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {values.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <img
              src={url}
              alt=""
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #dee2e6' }}
              onError={e => { e.target.style.opacity = 0.3; }}
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              style={{
                position: 'absolute', top: -6, right: -6,
                width: 20, height: 20, borderRadius: '50%', border: 'none',
                background: '#dc3545', color: '#fff', fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0, lineHeight: 1
              }}
            >×</button>
          </div>
        ))}
      </div>

      {/* Add by URL */}
      <div className="input-group input-group-sm mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Προσθήκη URL εικόνας…"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <button type="button" className="btn btn-outline-secondary" onClick={addUrl}>
          Προσθήκη
        </button>
      </div>

      {/* Upload from disk */}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => fileRef.current.click()}
        disabled={uploading}
      >
        {uploading
          ? <><span className="spinner-border spinner-border-sm me-1" />Ανέβασμα…</>
          : <><i className="bi bi-upload me-1"></i>Ανέβασμα από υπολογιστή</>}
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
