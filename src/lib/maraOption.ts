// Counselor's "With MARA agent / Without MARA agent" choice, made while
// creating the receipt in the Opportunity Flow Payment stage. It decides which
// Client Advisory Agreement text is generated and is printed on the receipt.
// Kept per lead in the browser so the later Agreement stage and receipt
// reprints see the same choice; defaults to 'mara' (the standard agreement).
export type MaraOption = 'mara' | 'non_mara';

const key = (leadId: number | string | null | undefined) => `maraOption:${leadId ?? ''}`;

export function getMaraOption(leadId: number | string | null | undefined): MaraOption {
  try {
    return window.localStorage.getItem(key(leadId)) === 'non_mara' ? 'non_mara' : 'mara';
  } catch {
    return 'mara';
  }
}

export function setMaraOption(leadId: number | string | null | undefined, value: MaraOption) {
  try {
    window.localStorage.setItem(key(leadId), value);
  } catch {
    // Storage blocked — the choice just won't persist past this session.
  }
}
