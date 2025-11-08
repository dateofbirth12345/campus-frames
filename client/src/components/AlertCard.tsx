import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertCardProps = {
  severity: "info" | "warning" | "urgent";
  title: string;
  description: string;
  suggestion?: string;
  affectedCount?: number;
  timestamp: string;
  onResolve?: () => void;
};

export function AlertCard({
  severity,
  title,
  description,
  suggestion,
  affectedCount,
  timestamp,
  onResolve,
}: AlertCardProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case "urgent":
        return {
          icon: AlertTriangle,
          badgeVariant: "destructive" as const,
          borderClass: "border-l-4 border-l-destructive",
        };
      case "warning":
        return {
          icon: AlertCircle,
          badgeVariant: "default" as const,
          borderClass: "border-l-4 border-l-chart-3",
        };
      case "info":
        return {
          icon: Info,
          badgeVariant: "secondary" as const,
          borderClass: "border-l-4 border-l-chart-1",
        };
    }
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <Card className={cn(config.borderClass)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold" data-testid={`alert-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</h3>
              <Badge variant={config.badgeVariant} className="capitalize">
                {severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      {(suggestion || affectedCount) && (
        <CardContent className="pb-3 space-y-2">
          {affectedCount && (
            <p className="text-sm">
              <span className="font-medium">Affected students:</span>{" "}
              <span className="text-muted-foreground">{affectedCount}</span>
            </p>
          )}
          {suggestion && (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm font-medium mb-1">Suggested Action:</p>
              <p className="text-sm text-muted-foreground">{suggestion}</p>
            </div>
          )}
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center gap-4">
        <span className="text-xs text-muted-foreground">{timestamp}</span>
        {onResolve && (
          <Button size="sm" variant="outline" onClick={onResolve} data-testid="button-resolve-alert">
            Mark Resolved
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
