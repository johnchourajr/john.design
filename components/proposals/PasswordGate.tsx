'use client';

import clsx from 'clsx';
import { FormEvent, ReactNode, useState } from 'react';

interface PasswordGateProps {
  children: ReactNode;
  hasAccess: boolean;
}

export function PasswordGate({ children, hasAccess }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(hasAccess);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch('/api/proposals/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-4">
        <p className="text-body text-white/50">
          This area is password protected.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className={clsx(
            'w-full bg-transparent border-b border-white/20 py-2 text-paragraph outline-none',
            'focus:border-root transition-colors duration-200',
            'placeholder:text-white/30',
          )}
        />
        {error && (
          <p className="text-caption text-red-400">Incorrect password.</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            'text-caption uppercase tracking-widest',
            'text-white/50 hover:text-white transition-colors duration-200',
            loading && 'opacity-50',
          )}
        >
          {loading ? 'Verifying...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
