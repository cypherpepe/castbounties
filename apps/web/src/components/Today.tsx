import { useEffect, useMemo, useState } from 'react';
import { claimBounty, getStats, getTodayBounty } from '../lib/api';

export default function Today() {
  const [bounty, setBounty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<string>('');
  const [stats, setStats] = useState<{ total: number; correct: number } | null>(null);
  const user = useMemo(() => 'user:demo', []);

  const refresh = async () => {
    setLoading(true);
    const b = await getTodayBounty();
    setBounty(b);
    setLoading(false);
    if (b) setStats(await getStats(b.id));
  };

  useEffect(() => { refresh(); }, []);

  const onClaim = async () => {
    if (!bounty) return;
    setStatus('');
    try {
      const resp = await claimBounty({ bountyId: bounty.id, answer, user });
      setStatus(resp.ok ? '✅ Успех!' : '❌ Ошибка');
      setStats(await getStats(bounty.id));
      setAnswer('');
    } catch (e: any) {
      setStatus('❌ ' + e.message);
    }
  };

  if (loading) return <div className="card">Загрузка…</div>;
  if (!bounty) return <div className="card">Сегодня баунти ещё нет.</div>;

  return (
    <div className="card">
      <h2>Баунти дня</h2>
      <p><b>{bounty.title}</b></p>
      <p className="badge">Подсказка: {bounty.hint}</p>
      <div className="row">
        <input className="input" placeholder="Пароль" value={answer} onChange={e=>setAnswer(e.target.value)} />
        <button className="button" onClick={onClaim} disabled={!answer.trim()}>Клейм</button>
      </div>
      {status && <p>{status}</p>}
      {stats && <p>Всего клеймов: <b>{stats.total}</b> • Правильных: <b>{stats.correct}</b></p>}
    </div>
  );
}
