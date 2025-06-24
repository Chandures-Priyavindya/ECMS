// src/pages/ui/button.tsx

import type { ReactNode } from 'react';
import type { JSX } from 'react/jsx-runtime';


interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className }: ButtonProps): JSX.Element {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
