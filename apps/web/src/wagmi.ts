import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { cookieStorage, createStorage } from 'wagmi';
import { createClient as createViemClient } from 'viem';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  storage: createStorage({ storage: cookieStorage }),
});

export const viemPublicClient = createViemClient({
  chain: mainnet,
  transport: http(),
});
