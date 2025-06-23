// src/pages/ui/button.jsx
import React from 'react';

export function Button({ children, onClick, className }) {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
