import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { fetchBalance } from "@/lib/stellar";
import { WalletConnect } from "@/components/wallet-connect";
import { BalanceCard } from "@/components/balance-card";
import { SendPayment } from "@/components/send-payment";
import { ThemeToggle } from "@/components/theme-toggle";
import { Zap } from "lucide-react";

export default function Home() {
  const wallet = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const loadBalance = useCallback(async () => {
    if (!wallet.publicKey) return;
    setBalanceLoading(true);
    try {
      const bal = await fetchBalance(wallet.publicKey);
      setBalance(bal);
    } catch {
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    if (wallet.isConnected && wallet.publicKey) {
      loadBalance();
    } else {
      setBalance(null);
    }
  }, [wallet.isConnected, wallet.publicKey, loadBalance]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between gap-4 flex-wrap px-6 py-4 border-b">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-violet-600">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight" data-testid="text-app-title">XLM Pay</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <WalletConnect
            publicKey={wallet.publicKey}
            isConnected={wallet.isConnected}
            isFreighterInstalled={wallet.isFreighterInstalled}
            isConnecting={wallet.isConnecting}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {!wallet.isConnected ? (
            <div className="flex flex-col items-center text-center space-y-6 py-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Welcome to XLM Pay</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Connect your Freighter wallet to view your balance and send XLM on the Stellar Testnet.
                </p>
              </div>
              <WalletConnect
                publicKey={wallet.publicKey}
                isConnected={wallet.isConnected}
                isFreighterInstalled={wallet.isFreighterInstalled}
                isConnecting={wallet.isConnecting}
                onConnect={wallet.connect}
                onDisconnect={wallet.disconnect}
              />
              <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground pt-4">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Testnet
                </span>
                <span>Powered by Stellar</span>
              </div>
            </div>
          ) : (
            <>
              <BalanceCard
                balance={balance}
                isLoading={balanceLoading}
                onRefresh={loadBalance}
              />
              <SendPayment
                publicKey={wallet.publicKey!}
                onSign={wallet.sign}
                onBalanceRefresh={loadBalance}
              />
              <p className="text-center text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Connected to Stellar Testnet
                </span>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
