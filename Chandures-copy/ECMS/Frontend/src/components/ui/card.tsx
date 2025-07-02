// src/pages/ui/card.tsx
import type { ReactNode } from 'react';
import type { JSX } from 'react/jsx-runtime';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps): JSX.Element {
  return <div className="mt-2">{children}</div>;
}
