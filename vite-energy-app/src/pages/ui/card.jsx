// src/pages/ui/card.jsx
import React from 'react';

export function Card({ children, className }) {
  return <div className={`rounded-lg border p-4 shadow-sm ${className || ''}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}
