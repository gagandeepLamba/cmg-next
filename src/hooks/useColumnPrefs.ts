'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sanitizePrefs, type ColumnPrefs } from '@/lib/tablePrefs';

// Loads and saves the signed-in user's column layout for one table.
// The server (crm_user_preferences) is the source of truth so the layout
// follows the user across browsers and devices; localStorage is a per-user-key
// cache that makes the first paint instant and is the fallback when the
// server can't persist (migration not applied) or is unreachable.

const storageKey = (tableKey: string, userId: number | string | undefined) => `column-prefs:${tableKey}:${userId ?? 'anon'}`;

function readLocal(key: string): ColumnPrefs | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? sanitizePrefs(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: ColumnPrefs | null) {
  try {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  } catch { /* storage unavailable: layout just won't be cached */ }
}

export function useColumnPrefs(tableKey: string, userId: number | string | undefined) {
  const [prefs, setPrefs] = useState<ColumnPrefs | null>(null);
  const [ready, setReady] = useState(false);
  const cacheKey = storageKey(tableKey, userId);
  const latest = useRef(0);

  useEffect(() => {
    if (userId === undefined || userId === null) return;
    let cancelled = false;
    const cached = readLocal(cacheKey);
    if (cached) setPrefs(cached);
    (async () => {
      try {
        const res = await fetch(`/api/user-preferences?key=${encodeURIComponent(tableKey)}`, { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json?.data?.persisted) {
          const server = sanitizePrefs(json.data.value);
          setPrefs(server);
          writeLocal(cacheKey, server);
        }
      } catch { /* offline: keep the cached layout */ } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [tableKey, userId, cacheKey]);

  const save = useCallback(async (next: ColumnPrefs | null) => {
    setPrefs(next);
    writeLocal(cacheKey, next);
    const ticket = ++latest.current;
    try {
      await fetch('/api/user-preferences', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: tableKey, value: next }),
      });
    } catch {
      // The local copy still applies; the next successful save syncs it.
    }
    return ticket === latest.current;
  }, [tableKey, cacheKey]);

  return { prefs, ready, save };
}
