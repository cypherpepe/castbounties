export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

export interface Bounty {
  id: string;
  title: string;
  hint: string;
  createdBy: string;
  createdAt: number;
}

export async function getTodayBounty(): Promise<Bounty | null> {
  const r = await fetch(`${API_BASE}/bounty`, { credentials: 'omit' });
  if (r.status === 204) return null;
  if (!r.ok) throw new Error('Failed to load bounty');
  return r.json();
}

export async function createBounty(input: { title: string; hint: string; secret: string; apiKey: string; author: string; }) {
  const r = await fetch(`${API_BASE}/bounty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': input.apiKey },
    body: JSON.stringify({ title: input.title, hint: input.hint, secret: input.secret, author: input.author }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function claimBounty(input: { bountyId: string; answer: string; user: string; }) {
  const r = await fetch(`${API_BASE}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getStats(bountyId: string) {
  const r = await fetch(`${API_BASE}/bounty/${bountyId}/stats`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
