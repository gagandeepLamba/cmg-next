// Per-user column preferences for list tables: which of a page's columns a
// user wants to see, and in what order. Pure and browser-safe so the UI, the
// API and the tests share one definition of how a saved layout is applied.
//
// A page declares its columns once (a "registry"); the saved layout only ever
// stores column KEYS, so a column that is later renamed, removed or added never
// breaks a saved layout - unknown keys are ignored and new columns are shown.

export interface ColumnDef {
  key: string;
  label: string;
  /** Always shown and not removable (e.g. the lead's name). */
  locked?: boolean;
}

export interface ColumnPrefs {
  /** Column keys in the user's preferred order. */
  order: string[];
  /** Column keys the user has switched off. */
  hidden: string[];
}

const MAX_KEYS = 100;
const KEY_PATTERN = /^[A-Za-z0-9_.-]{1,64}$/;

/** Parses stored/received JSON into a safe ColumnPrefs, or null if unusable. */
export function sanitizePrefs(raw: unknown): ColumnPrefs | null {
  let value = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== 'object') return null;
  const clean = (input: unknown): string[] => {
    if (!Array.isArray(input)) return [];
    const seen = new Set<string>();
    for (const item of input) {
      if (typeof item === 'string' && KEY_PATTERN.test(item)) seen.add(item);
      if (seen.size >= MAX_KEYS) break;
    }
    return [...seen];
  };
  const { order, hidden } = value as Record<string, unknown>;
  return { order: clean(order), hidden: clean(hidden) };
}

/** Every column in the user's order (hidden ones included): what the picker lists. */
export function orderColumns<T extends ColumnDef>(defs: T[], prefs: ColumnPrefs | null): T[] {
  if (!prefs) return [...defs];
  const byKey = new Map(defs.map((def) => [def.key, def]));
  const result: T[] = [];
  for (const key of prefs.order) {
    const def = byKey.get(key);
    if (def) { result.push(def); byKey.delete(key); }
  }
  // Columns the saved layout has never seen keep their default position.
  for (const def of defs) if (byKey.has(def.key)) result.push(def);
  return result;
}

/** The set of keys that are visible for this user. */
export function visibleKeys(defs: ColumnDef[], prefs: ColumnPrefs | null): Set<string> {
  const hidden = new Set(prefs?.hidden || []);
  const visible = new Set<string>();
  for (const def of defs) {
    if (def.locked || !hidden.has(def.key)) visible.add(def.key);
  }
  return visible;
}

/** The columns to render, in order. */
export function resolveColumns<T extends ColumnDef>(defs: T[], prefs: ColumnPrefs | null): T[] {
  const visible = visibleKeys(defs, prefs);
  return orderColumns(defs, prefs).filter((def) => visible.has(def.key));
}

/** Builds the layout to save from the picker's full ordered list + visibility. */
export function buildPrefs(ordered: ColumnDef[], visible: Set<string>): ColumnPrefs {
  return {
    order: ordered.map((def) => def.key),
    hidden: ordered.filter((def) => !def.locked && !visible.has(def.key)).map((def) => def.key),
  };
}
