import { useEffect, useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmi';
import Today from './components/Today';
import CreateBounty from './components/CreateBounty';
import MyBounties from './components/MyBounties';
import { appkit } from './appkit';
import { initFrame } from './frame';

type Tab = 'today' | 'create' | 'mine';

export default function App() {
  const [tab, setTab] = useState<Tab>('today');
  useEffect(() => { appkit(); initFrame(); }, []);
  const tabs = useMemo(() => ([
    { k: 'today' as const, label: 'Сегодня' },
    { k: 'create' as const, label: 'Создать' },
    { k: 'mine' as const, label: 'Мои' }
  ]), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <div className="container">
        <header className="header">
          <h1>CastBounties</h1>
          <div className="actions">
            <button onClick={() => appkit().open()}>Connect</button>
          </div>
        </header>
        <nav className="tabs">
          {tabs.map(t => (
            <button key={t.k} className={tab===t.k?'tab active':'tab'} onClick={()=>setTab(t.k)}>{t.label}</button>
          ))}
        </nav>
        <main className="panel">
          {tab==='today' && <Today/>}
          {tab==='create' && <CreateBounty/>}
          {tab==='mine' && <MyBounties/>}
        </main>
        <footer className="footer">
          <span>Farcaster frame demo • wagmi/viem • AppKit adapter</span>
        </footer>
      </div>
    </WagmiProvider>
  );
}
