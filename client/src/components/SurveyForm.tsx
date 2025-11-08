import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SurveyFormProps = {
  onSubmit: (data: any) => void;
};

export function SurveyForm({ onSubmit }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    studentGrade: "",
    mood: "",
    stressLevel: 5,
    sleepQuality: "",
    socialInteraction: "",
    academicPressure: 5,
    concerns: [] as string[],
    additionalNotes: "",
  });

  const steps = [
    { title: "Basic Info", description: "Tell us a bit about the observation" },
    { title: "Wellbeing", description: "Mood and stress indicators" },
    { title: "Lifestyle", description: "Sleep and social patterns" },
    { title: "Concerns", description: "Any specific concerns" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const concernOptions = [
    "Academic stress",
    "Peer pressure",
    "Family issues",
    "Bullying",
    "Anxiety",
    "Depression",
    "Sleep problems",
    "Substance use",
    "Other",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    console.log("Survey submitted:", formData);
  };

  const toggleConcern = (concern: string) => {
    setFormData({
      ...formData,
      concerns: formData.concerns.includes(concern)
        ? formData.concerns.filter((c) => c !== concern)
        : [...formData.concerns, concern],
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Student Grade Level</Label>
                <Select
                  value={formData.studentGrade}
                  onValueChange={(value) => setFormData({ ...formData, studentGrade: value })}
                >
                  <SelectTrigger id="grade" data-testid="select-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Observed Mood</Label>
                <RadioGroup
                  value={formData.mood}
                  onValueChange={(value) => setFormData({ ...formData, mood: value })}
                  data-testid="radio-mood"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="happy" id="happy" />
                    <Label htmlFor="happy" className="font-normal cursor-pointer">Happy & Energetic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calm" id="calm" />
                    <Label htmlFor="calm" className="font-normal cursor-pointer">Calm & Relaxed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral" className="font-normal cursor-pointer">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stressed" id="stressed" />
                    <Label htmlFor="stressed" className="font-normal cursor-pointer">Stressed or Anxious</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="withdrawn" id="withdrawn" />
                    <Label htmlFor="withdrawn" className="font-normal cursor-pointer">Withdrawn or Sad</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Stress Level (1-10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[formData.stressLevel]}
                    onValueChange={(value) => setFormData({ ...formData, stressLevel: value[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                    data-testid="slider-stress"
                  />
                  <span className="text-2xl font-bold w-8 text-center" data-testid="text-stress-value">
                    {formData.stressLevel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Sleep Quality</Label>
                <RadioGroup
                  value={formData.sleepQuality}
                  onValueChange={(value) => setFormData({ ...formData, sleepQuality: value })}
                  data-testid="radio-sleep"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent" className="font-normal cursor-pointer">Excellent (8+ hours)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="font-normal cursor-pointer">Good (6-8 hours)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair" className="font-normal cursor-pointer">Fair (4-6 hours)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor" className="font-normal cursor-pointer">Poor (less than 4 hours)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Social Interaction</Label>
                <RadioGroup
                  value={formData.socialInteraction}
                  onValueChange={(value) => setFormData({ ...formData, socialInteraction: value })}
                  data-testid="radio-social"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-active" id="very-active" />
                    <Label htmlFor="very-active" className="font-normal cursor-pointer">Very Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="font-normal cursor-pointer">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="font-normal cursor-pointer">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="isolated" id="isolated" />
                    <Label htmlFor="isolated" className="font-normal cursor-pointer">Isolated</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Academic Pressure (1-10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[formData.academicPressure]}
                    onValueChange={(value) => setFormData({ ...formData, academicPressure: value[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                    data-testid="slider-academic"
                  />
                  <span className="text-2xl font-bold w-8 text-center" data-testid="text-academic-value">
                    {formData.academicPressure}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Select any concerns observed (optional)</Label>
                <div className="space-y-2">
                  {concernOptions.map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern}
                        checked={formData.concerns.includes(concern)}
                        onCheckedChange={() => toggleConcern(concern)}
                        data-testid={`checkbox-${concern.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <Label htmlFor={concern} className="font-normal cursor-pointer">
                        {concern}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or context..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="min-h-24"
                  data-testid="textarea-notes"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          data-testid="button-previous"
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} data-testid="button-next">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} data-testid="button-submit-survey">
            Submit Survey
          </Button>
        )}
      </div>
    </div>
  );
}
