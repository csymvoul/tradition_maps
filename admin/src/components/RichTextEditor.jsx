import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [2, 3, false] }],
  ['clean']
];

/**
 * Thin wrapper around Quill 2.
 * Props:
 *   value      — initial HTML string (read once on mount)
 *   onChange   — called with HTML string on every change
 */
export default function RichTextEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) return; // already initialised

    quillRef.current = new Quill(containerRef.current, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR },
      placeholder: 'Αναλυτική περιγραφή…'
    });

    // Set initial content
    if (value) {
      quillRef.current.root.innerHTML = value;
    }

    quillRef.current.on('text-change', () => {
      onChange(quillRef.current.root.innerHTML);
    });

    return () => {
      // Quill 2 doesn't have a destroy(), just remove the toolbar
      const toolbar = containerRef.current?.previousSibling;
      if (toolbar?.classList?.contains('ql-toolbar')) toolbar.remove();
      quillRef.current = null;
    };
  }, []); // intentionally empty — we only init once

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: 140, background: '#fff' }} />
    </div>
  );
}
