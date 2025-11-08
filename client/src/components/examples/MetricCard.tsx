import { MetricCard } from '../MetricCard';
import { Users, TrendingUp, AlertTriangle, Heart } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <MetricCard
        title="Total Surveys"
        value={248}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Wellbeing Score"
        value="7.2/10"
        icon={<Heart className="h-4 w-4" />}
        trend={{ value: 5, isPositive: true }}
      />
      <MetricCard
        title="Active Alerts"
        value={3}
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Requires attention"
      />
      <MetricCard
        title="Engagement Rate"
        value="84%"
        icon={<TrendingUp className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  );
}
