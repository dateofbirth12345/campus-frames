import { AlertCard } from '../AlertCard';

export default function AlertCardExample() {
  return (
    <div className="space-y-4 p-6 max-w-3xl">
      <AlertCard
        severity="urgent"
        title="High Stress Levels Detected"
        description="15% increase in students reporting high stress levels (8+ on scale) over the past week."
        suggestion="Consider organizing a stress management workshop or mindfulness session for Grade 11 students."
        affectedCount={42}
        timestamp="2 hours ago"
        onResolve={() => console.log('Resolved')}
      />
      <AlertCard
        severity="warning"
        title="Sleep Pattern Concerns"
        description="Students reporting less than 6 hours of sleep has increased by 20%."
        suggestion="Share sleep hygiene resources and consider adjusting assignment deadlines."
        affectedCount={28}
        timestamp="1 day ago"
        onResolve={() => console.log('Resolved')}
      />
      <AlertCard
        severity="info"
        title="Positive Trend"
        description="Social interaction scores are improving across all grade levels."
        timestamp="3 days ago"
      />
    </div>
  );
}
