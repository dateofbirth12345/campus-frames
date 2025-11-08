import { useAnalytics } from "@/hooks/useAnalytics"
import { MetricCard } from "@/components/MetricCard"
import { AlertCard } from "@/components/AlertCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, AlertTriangle, Heart, Brain, Award, Loader2 } from "lucide-react"

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics()
  const analytics = data?.analytics

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center p-12 text-muted-foreground">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered analysis of student wellbeing data and actionable recommendations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Surveys"
          value={analytics.summary.totalSurveys}
          icon={<Award className="h-4 w-4" />}
          description="Responses analyzed"
        />
        <MetricCard
          title="Avg Stress Level"
          value={`${analytics.summary.avgStressLevel}/10`}
          icon={<Heart className="h-4 w-4" />}
          description="Student reported"
        />
        <MetricCard
          title="Academic Pressure"
          value={`${analytics.summary.avgAcademicPressure}/10`}
          icon={<Brain className="h-4 w-4" />}
          description="Average rating"
        />
        <MetricCard
          title="Key Insights"
          value={analytics.insights.length}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Identified patterns"
        />
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights" data-testid="tab-insights">
            Key Insights
          </TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">
            Trends
          </TabsTrigger>
          <TabsTrigger value="recommendations" data-testid="tab-recommendations">
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="moodBreakdown" data-testid="tab-mood">
            Mood Breakdown
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {analytics.insights.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Critical Insights</h3>
                <p className="text-muted-foreground">Student wellbeing appears to be stable across all metrics.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analytics.insights.map((insight, idx) => (
                <AlertCard
                  key={idx}
                  severity={insight.severity}
                  title={insight.title}
                  description={insight.description}
                  suggestion={insight.recommendation}
                  affectedCount={insight.affectedCount}
                  timestamp={`${insight.affectedCount} students affected`}
                  onResolve={() => {}}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress & Academic Pressure Trends</CardTitle>
              <CardDescription>Weekly progression of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stressLevel" stroke="var(--color-chart-4)" name="Avg Stress Level" />
                  <Line
                    type="monotone"
                    dataKey="academicPressure"
                    stroke="var(--color-chart-1)"
                    name="Academic Pressure"
                  />
                  <Line type="monotone" dataKey="wellnessScore" stroke="var(--color-chart-2)" name="Wellness Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {analytics.recommendations.map((rec, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{rec.category}</CardTitle>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      rec.priority === "high"
                        ? "bg-destructive/20 text-destructive"
                        : rec.priority === "medium"
                          ? "bg-yellow-100 text-yellow-900"
                          : "bg-green-100 text-green-900"
                    }`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rec.actions.map((action, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Mood Breakdown Tab */}
        <TabsContent value="moodBreakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>Student reported moods across all surveys</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={Object.entries(analytics.summary.moodDistribution).map(([mood, count]) => ({
                    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
                    count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-chart-1)" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analytics.summary.moodDistribution).map(([mood, count]) => {
                  const percentage = Math.round((count / analytics.summary.totalSurveys) * 100)
                  return (
                    <div key={mood} className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium capitalize">{mood}</p>
                      <p className="text-2xl font-bold">{percentage}%</p>
                      <p className="text-xs text-muted-foreground">{count} responses</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Based on analysis of {analytics.summary.totalSurveys} student survey responses, our AI system has identified
            key patterns in student wellbeing. The data suggests{" "}
            {analytics.insights.length > 0 ? "several areas requiring attention" : "overall stable wellbeing"}.
          </p>
          <p className="text-muted-foreground">
            Current stress levels average {analytics.summary.avgStressLevel}/10, with academic pressure at{" "}
            {analytics.summary.avgAcademicPressure}/10. Review the recommendations tab for evidence-based interventions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
