import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: '$CIGAR Smoketron Interface',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get this from https://cloud.walletconnect.com
  chains: [base, baseSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});