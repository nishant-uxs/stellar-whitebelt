import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  buildPaymentTransaction,
  submitTransaction,
  isValidStellarAddress,
  getExplorerUrl,
} from "@/lib/stellar";
import { Send, ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface SendPaymentProps {
  publicKey: string;
  onSign: (xdr: string) => Promise<string>;
  onBalanceRefresh: () => void;
}

type TxStatus = "idle" | "building" | "signing" | "submitting" | "success" | "error";

export function SendPayment({ publicKey, onSign, onBalanceRefresh }: SendPaymentProps) {
  const { toast } = useToast();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSend = async () => {
    setTxHash(null);
    setErrorMessage(null);

    if (!destination.trim()) {
      toast({ variant: "destructive", title: "Missing Address", description: "Please enter a destination address." });
      return;
    }

    if (!isValidStellarAddress(destination.trim())) {
      toast({ variant: "destructive", title: "Invalid Address", description: "The destination address is not a valid Stellar public key." });
      return;
    }

    if (destination.trim() === publicKey) {
      toast({ variant: "destructive", title: "Invalid Address", description: "You cannot send XLM to yourself." });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid amount greater than 0." });
      return;
    }

    try {
      setStatus("building");
      const xdr = await buildPaymentTransaction(publicKey, destination.trim(), parsedAmount.toFixed(7));

      setStatus("signing");
      const signedXdr = await onSign(xdr);

      setStatus("submitting");
      const hash = await submitTransaction(signedXdr);

      setTxHash(hash);
      setStatus("success");
      setDestination("");
      setAmount("");
      onBalanceRefresh();

      toast({ title: "Transaction Successful", description: "Your XLM payment has been sent." });
    } catch (error: any) {
      setStatus("error");
      const msg = parseError(error);
      setErrorMessage(msg);
      toast({ variant: "destructive", title: "Transaction Failed", description: msg });
    }
  };

  const reset = () => {
    setStatus("idle");
    setTxHash(null);
    setErrorMessage(null);
  };

  const isProcessing = status === "building" || status === "signing" || status === "submitting";

  const statusLabel = {
    building: "Building transaction...",
    signing: "Waiting for signature...",
    submitting: "Submitting to network...",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Send Payment</CardTitle>
        <CardDescription>Transfer XLM on the Stellar Testnet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && txHash ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Transaction Successful</span>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
              <p className="text-xs font-mono break-all" data-testid="text-tx-hash">{txHash}</p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={getExplorerUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Explorer
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={reset} data-testid="button-new-payment">
                New Payment
              </Button>
            </div>
          </div>
        ) : status === "error" && errorMessage ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Transaction Failed</span>
            </div>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button variant="ghost" size="sm" onClick={reset} data-testid="button-try-again">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Address</Label>
              <Input
                id="destination"
                placeholder="G..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isProcessing}
                data-testid="input-destination"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (XLM)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
                data-testid="input-amount"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 border-none text-white"
              data-testid="button-send-payment"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {statusLabel[status as keyof typeof statusLabel]}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Payment
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function parseError(error: any): string {
  const msg = error?.message || "";
  if (msg.includes("User declined")) return "You rejected the transaction signature.";
  if (msg.includes("op_underfunded")) return "Insufficient balance to complete this transaction.";
  if (msg.includes("op_no_destination")) return "The destination account does not exist. It must be funded first.";
  if (msg.includes("Network")) return "Network error. Please check your connection and try again.";
  if (msg.includes("tx_bad_seq")) return "Transaction sequence number mismatch. Please try again.";
  return msg || "An unexpected error occurred.";
}
