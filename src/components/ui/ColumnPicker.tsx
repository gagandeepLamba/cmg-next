'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Columns3, RotateCcw } from 'lucide-react';
import { buildPrefs, orderColumns, visibleKeys, type ColumnDef, type ColumnPrefs } from '@/lib/tablePrefs';

interface ColumnPickerProps {
  columns: ColumnDef[];
  prefs: ColumnPrefs | null;
  onChange: (next: ColumnPrefs | null) => void;
}

// "Columns" button + popover: tick the fields you want to see, reorder them,
// or reset to the full default set. Only columns the page already shows are
// listed - it never exposes anything the table doesn't render.
export function ColumnPicker({ columns, prefs, onChange }: ColumnPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const ordered = orderColumns(columns, prefs);
  const visible = visibleKeys(columns, prefs);
  const hiddenCount = ordered.filter((c) => !visible.has(c.key)).length;

  const toggle = (key: string) => {
    const next = new Set(visible);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange(buildPrefs(ordered, next));
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(buildPrefs(next, visible));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        title="Choose which columns to show"
      >
        <Columns3 className="h-4 w-4" />
        Columns
        {hiddenCount > 0 && <span className="rounded-full bg-blue-100 px-1.5 text-xs font-semibold text-blue-700">{hiddenCount} hidden</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Show columns</p>
          <ul className="max-h-80 overflow-y-auto">
            {ordered.map((column, index) => (
              <li key={column.key} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={visible.has(column.key)}
                    disabled={column.locked}
                    onChange={() => toggle(column.key)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={column.locked ? 'text-gray-500' : ''}>{column.label}</span>
                </label>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${column.label} up`} className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === ordered.length - 1} aria-label={`Move ${column.label} down`} className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-gray-100 pt-1">
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={!prefs}
              className="inline-flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
