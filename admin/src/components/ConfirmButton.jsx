import React, { useState } from 'react';

/**
 * Replaces window.confirm() with an inline "Σίγουρος; [Ναι] [Όχι]" toggle.
 * Props:
 *   onConfirm  — called when user clicks Ναι
 *   message    — text shown in confirm state (default: 'Είσαι σίγουρος;')
 *   className  — class for the trigger button
 *   children   — content of the trigger button
 */
export default function ConfirmButton({ onConfirm, message = 'Είσαι σίγουρος;', className = 'btn btn-sm btn-outline-danger', children }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="d-inline-flex align-items-center gap-1">
        <span className="text-muted small me-1" style={{ whiteSpace: 'nowrap' }}>{message}</span>
        <button
          className="btn btn-danger btn-sm py-0 px-2"
          onClick={() => { setConfirming(false); onConfirm(); }}
        >Ναι</button>
        <button
          className="btn btn-outline-secondary btn-sm py-0 px-2"
          onClick={() => setConfirming(false)}
        >Όχι</button>
      </span>
    );
  }

  return (
    <button className={className} onClick={() => setConfirming(true)}>
      {children}
    </button>
  );
}
