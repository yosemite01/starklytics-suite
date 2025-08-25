import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  walletType: 'argent' | 'ready' | null;
  isConnecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    walletAddress: null,
    walletType: null,
    isConnecting: false
  });
  const { updateProfile } = useAuth();

  const detectWallets = () => {
    const argentDetected = typeof window !== 'undefined' && !!(window as any).starknet_argentX;
    const readyDetected = typeof window !== 'undefined' && !!(window as any).starknet_ready;
    return { argent: argentDetected, ready: readyDetected };
  };

  const connectWallet = async (type: 'argent' | 'ready') => {
    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      let starknet;
      if (type === 'argent') {
        starknet = (window as any).starknet_argentX;
      } else {
        starknet = (window as any).starknet_ready;
      }

      if (!starknet) {
        throw new Error(`${type} wallet not detected`);
      }

      const [address] = await starknet.enable();
      
      setState({
        isConnected: true,
        walletAddress: address,
        walletType: type,
        isConnecting: false
      });

      // Update user profile with wallet address
      await updateProfile({ wallet_address: address });

      return { success: true, address };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
      return { success: false, error };
    }
  };

  const disconnectWallet = async () => {
    setState({
      isConnected: false,
      walletAddress: null,
      walletType: null,
      isConnecting: false
    });
    await updateProfile({ wallet_address: null });
  };

  useEffect(() => {
    const detected = detectWallets();
    console.log('Detected wallets:', detected);
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    detectWallets
  };
}
