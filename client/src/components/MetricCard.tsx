import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
};

export function MetricCard({ title, value, icon, trend, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-chart-2" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-chart-2" : "text-destructive"
            )}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
