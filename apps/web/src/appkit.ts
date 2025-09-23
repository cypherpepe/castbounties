import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { wagmiConfig } from './wagmi';

let _appkit: ReturnType<typeof createAppKit> | undefined;

export function appkit() {
  if (_appkit) return _appkit;
  const wagmiAdapter = new WagmiAdapter({ wagmiConfig });
  _appkit = createAppKit({
    projectId: import.meta.env.VITE_PROJECT_ID || 'CASTBOUNTIES_DEMO',
    adapters: [wagmiAdapter],
    metadata: {
      name: 'CastBounties',
      description: 'Farcaster frame bounties (prod)',
      url: 'https://example.org',
      icons: [],
    },
  });
  return _appkit!;
}
