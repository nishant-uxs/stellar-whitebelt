import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  balance: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BalanceCard({ balance, isLoading, onRefresh }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">
          Your Balance
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          data-testid="button-refresh-balance"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <div className="flex items-baseline gap-2" data-testid="text-balance">
            <span className="text-4xl font-bold tracking-tight">
              {balance ? parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "0.00"}
            </span>
            <span className="text-lg font-medium text-muted-foreground">XLM</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
