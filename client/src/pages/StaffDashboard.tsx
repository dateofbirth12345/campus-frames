import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { Users, TrendingUp, AlertTriangle, Heart, ClipboardCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurveyStats, useSurveys, useAnalyzeSurveys } from "@/hooks/useSurveys";
import { useAlerts, useResolveAlert } from "@/hooks/useAlerts";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function StaffDashboard() {
  const { toast } = useToast();
  const { data: statsData, isLoading: statsLoading } = useSurveyStats();
  const { data: surveysData, isLoading: surveysLoading } = useSurveys(10);
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();
  const resolveAlertMutation = useResolveAlert();
  const analyzeMutation = useAnalyzeSurveys();

  const stats = statsData?.stats;
  const surveys = surveysData?.surveys || [];
  const alerts = alertsData?.alerts || [];

  const handleResolveAlert = async (id: string) => {
    try {
      await resolveAlertMutation.mutateAsync(id);
      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeSurveys = async () => {
    try {
      await analyzeMutation.mutateAsync(7);
      toast({
        title: "Analysis Complete",
        description: "AI trend analysis has been completed and new alerts generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze surveys. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMoodPercentage = (mood: string) => {
    if (!stats?.moodDistribution || stats.total === 0) return 0;
    return Math.round((stats.moodDistribution[mood] || 0) / stats.total * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor student wellbeing and manage interventions
        </p>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Surveys"
            value={stats?.total || 0}
            icon={<ClipboardCheck className="h-4 w-4" />}
            description="All time submissions"
          />
          <MetricCard
            title="Avg Stress Level"
            value={`${stats?.avgStressLevel || 0}/10`}
            icon={<Heart className="h-4 w-4" />}
            description="Reported by students"
          />
          <MetricCard
            title="Active Alerts"
            value={alerts.length}
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Requires attention"
          />
          <MetricCard
            title="Academic Pressure"
            value={`${stats?.avgAcademicPressure || 0}/10`}
            icon={<TrendingUp className="h-4 w-4" />}
            description="Average rating"
          />
        </div>
      )}

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Active Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">Mood Trends</TabsTrigger>
          <TabsTrigger value="recent" data-testid="tab-recent">Recent Surveys</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {alertsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground mb-4">Run AI analysis to identify trends and generate alerts</p>
                <Button onClick={handleAnalyzeSurveys} disabled={analyzeMutation.isPending} data-testid="button-analyze-surveys">
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Run AI Analysis"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  severity={alert.severity as "info" | "warning" | "urgent"}
                  title={alert.title}
                  description={alert.description}
                  suggestion={alert.suggestion || undefined}
                  affectedCount={alert.affectedCount || undefined}
                  timestamp={alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }) : "Unknown"}
                  onResolve={() => handleResolveAlert(alert.id)}
                />
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <div>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>Based on {stats?.total || 0} survey responses</CardDescription>
              </div>
              <Button onClick={handleAnalyzeSurveys} disabled={analyzeMutation.isPending} variant="outline" size="sm">
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Refresh Analysis"
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {["happy", "calm", "neutral", "stressed", "withdrawn"].map((mood) => {
                const percentage = getMoodPercentage(mood);
                return (
                  <div key={mood} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{mood}</span>
                      <span className="text-sm text-muted-foreground">{percentage}% of surveys</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          mood === "happy" ? "bg-chart-2" :
                          mood === "calm" ? "bg-chart-1" :
                          mood === "neutral" ? "bg-chart-3" :
                          mood === "stressed" ? "bg-chart-4" :
                          "bg-destructive"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Survey Submissions</CardTitle>
              <CardDescription>Latest {surveys.length} submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {surveysLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : surveys.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No surveys submitted yet
                </div>
              ) : (
                <div className="space-y-3">
                  {surveys.map((survey, i) => (
                    <div key={survey.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Anonymous Survey</p>
                        <p className="text-sm text-muted-foreground">
                          {survey.studentGrade ? `Grade ${survey.studentGrade}` : "Grade not specified"} · 
                          Stress Level: {survey.stressLevel}/10 · 
                          Mood: {survey.mood || "Not specified"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {survey.createdAt ? formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true }) : "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <Button data-testid="button-new-survey" onClick={() => window.location.href = "/staff/surveys"}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            New Survey
          </Button>
          <Button variant="outline" data-testid="button-analyze" onClick={handleAnalyzeSurveys} disabled={analyzeMutation.isPending}>
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
