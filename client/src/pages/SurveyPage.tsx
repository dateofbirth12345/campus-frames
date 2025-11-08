import { SurveyForm } from "@/components/SurveyForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useCreateSurvey } from "@/hooks/useSurveys";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SurveyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();

  const handleSurveySubmit = async (data: any) => {
    try {
      await createSurveyMutation.mutateAsync({
        ...data,
        staffId: null,
        isAnonymous: true,
      });
      
      toast({
        title: "Survey Submitted",
        description: "Thank you for your anonymous feedback. Your responses help us support student wellbeing.",
      });
      
      setTimeout(() => {
        setLocation("/staff/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Student Wellbeing Survey</h1>
        <p className="text-muted-foreground mt-2">
          Help us understand and support student mental health
        </p>
      </div>

      <Card className="max-w-2xl bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Anonymous & Confidential</CardTitle>
              <CardDescription>
                All responses are completely anonymous to protect student privacy
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ No personally identifiable information is collected</p>
          <p>✓ Data is aggregated for trend analysis only</p>
          <p>✓ Takes approximately 3-5 minutes to complete</p>
        </CardContent>
      </Card>

      <SurveyForm onSubmit={handleSurveySubmit} />
    </div>
  );
}
