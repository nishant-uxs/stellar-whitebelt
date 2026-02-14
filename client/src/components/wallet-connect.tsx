import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut, Copy, CheckCircle2, AlertTriangle } from "lucide-react";
import { truncateAddress } from "@/lib/stellar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WalletConnectProps {
  publicKey: string | null;
  isConnected: boolean;
  isFreighterInstalled: boolean | null;
  isConnecting: boolean;
  onConnect: () => Promise<string | undefined>;
  onDisconnect: () => void;
}

export function WalletConnect({
  publicKey,
  isConnected,
  isFreighterInstalled,
  isConnecting,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await onConnect();
      toast({
        title: "Wallet Connected",
        description: "Your Freighter wallet has been connected successfully.",
      });
    } catch (error: any) {
      const message = error?.message || "Failed to connect wallet";
      if (message.includes("not installed")) {
        toast({
          variant: "destructive",
          title: "Freighter Not Found",
          description: "Please install Freighter wallet to use this app.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: message,
        });
      }
    }
  };

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    toast({ title: "Address Copied", description: "Public key copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isFreighterInstalled === false) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-3 p-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-center text-muted-foreground">
            Please install{" "}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
              data-testid="link-freighter-install"
            >
              Freighter wallet
            </a>{" "}
            to use XLM Pay.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-blue-600 to-violet-600 border-none text-white"
        data-testid="button-connect-wallet"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        <span className="text-sm font-mono text-foreground" data-testid="text-public-key">
          {truncateAddress(publicKey || "")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          data-testid="button-copy-address"
        >
          {copied ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDisconnect}
        data-testid="button-disconnect-wallet"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
