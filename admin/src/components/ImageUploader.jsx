import React, { useState, useRef } from 'react';
import { uploadImage } from '../api';

/**
 * ImageUploader — shows current image preview, a URL text field,
 * and a file-pick button. On file select, auto-uploads and fills the URL.
 *
 * Props:
 *   token    — JWT token (required for upload)
 *   value    — current image URL string
 *   onChange — called with the new URL string
 */
export default function ImageUploader({ token, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(token, file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      {/* Preview */}
      {value && (
        <div className="mb-2">
          <img
            src={value}
            alt="preview"
            style={{ height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #dee2e6' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="URL εικόνας ή ανεβάστε αρχείο →"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
        >
          {uploading
            ? <span className="spinner-border spinner-border-sm" />
            : <><i className="bi bi-upload me-1"></i>Ανέβασμα</>}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
