import { useMemo, useState } from 'react';
import { createBounty } from '../lib/api';

export default function CreateBounty() {
  const [title, setTitle] = useState('');
  const [hint, setHint] = useState('');
  const [secret, setSecret] = useState('');
  const [apiKey, setApiKey] = useState('');
  const author = useMemo(()=> '0xAUTHOR', []);
  const [status, setStatus] = useState('');

  const onCreate = async () => {
    setStatus('');
    try {
      const r = await createBounty({ title, hint, secret, apiKey, author });
      setStatus('✅ Опубликовано');
      setTitle(''); setHint(''); setSecret('');
    } catch (e: any) {
      setStatus('❌ ' + e.message);
    }
  };

  return (
    <div className="card">
      <h2>Создать баунти</h2>
      <div className="row">
        <input className="input" placeholder="Название" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder="Подсказка" value={hint} onChange={e=>setHint(e.target.value)} />
        <input className="input" placeholder="Пароль (секрет)" value={secret} onChange={e=>setSecret(e.target.value)} />
      </div>
      <div className="row" style={{marginTop:8}}>
        <input className="input" placeholder="API Key" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
        <button className="button" onClick={onCreate} disabled={!title || !secret || !apiKey}>Опубликовать</button>
      </div>
      {status && <p>{status}</p>}
      <p className="badge">Сервер хранит только хэш (SHA-256) секрета с солью.</p>
    </div>
  );
}
