import { useState, useCallback, useEffect } from "react";
import {
  isConnected,
  requestAccess,
  signTransaction,
  getAddress,
} from "@stellar/freighter-api";

interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
  isFreighterInstalled: boolean | null;
  isConnecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    isConnected: false,
    isFreighterInstalled: null,
    isConnecting: false,
  });

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const result = await isConnected();
        const installed = result.isConnected;
        setState((prev) => ({ ...prev, isFreighterInstalled: installed }));

        if (installed) {
          const addressResult = await getAddress();
          if (addressResult.address && !addressResult.error) {
            setState((prev) => ({
              ...prev,
              publicKey: addressResult.address,
              isConnected: true,
            }));
          }
        }
      } catch {
        setState((prev) => ({ ...prev, isFreighterInstalled: false }));
      }
    };

    checkFreighter();
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true }));
    try {
      const connectionResult = await isConnected();
      if (!connectionResult.isConnected) {
        setState((prev) => ({
          ...prev,
          isFreighterInstalled: false,
          isConnecting: false,
        }));
        throw new Error("Freighter wallet is not installed");
      }

      const accessResult = await requestAccess();
      if (accessResult.error) {
        throw new Error(accessResult.error);
      }

      setState({
        publicKey: accessResult.address,
        isConnected: true,
        isFreighterInstalled: true,
        isConnecting: false,
      });

      return accessResult.address;
    } catch (error) {
      setState((prev) => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      publicKey: null,
      isConnected: false,
      isFreighterInstalled: state.isFreighterInstalled,
      isConnecting: false,
    });
  }, [state.isFreighterInstalled]);

  const sign = useCallback(async (xdr: string) => {
    const result = await signTransaction(xdr, {
      networkPassphrase: "Test SDF Network ; September 2015",
    });
    if (result.error) {
      throw new Error(result.error);
    }
    return result.signedTxXdr;
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sign,
  };
}
