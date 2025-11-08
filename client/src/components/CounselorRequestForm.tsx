import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock } from "lucide-react";

type CounselorRequestFormProps = {
  onSubmit: (data: any) => void;
};

export function CounselorRequestForm({ onSubmit }: CounselorRequestFormProps) {
  const [formData, setFormData] = useState({
    urgency: "",
    reason: "",
    privacyConsent: false,
  });

  const handleSubmit = () => {
    if (formData.urgency && formData.reason && formData.privacyConsent) {
      onSubmit(formData);
      console.log("Counselor request submitted:", formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Request Counselor Support</CardTitle>
              <CardDescription>Your privacy and wellbeing are our priority</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-md p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Confidential & Secure</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Your request will be handled with complete confidentiality. Only authorized counselors will have access to your information.
            </p>
          </div>

          <div className="space-y-3">
            <Label>How urgent is your need?</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
              data-testid="radio-urgency"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="routine" />
                <Label htmlFor="routine" className="font-normal cursor-pointer">
                  Routine - I'd like to schedule a conversation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soon" id="soon" />
                <Label htmlFor="soon" className="font-normal cursor-pointer">
                  Soon - I need support within a few days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="font-normal cursor-pointer">
                  Urgent - I need immediate support
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="reason">What brings you here today?</Label>
            <Textarea
              id="reason"
              placeholder="Share what's on your mind. You can be as detailed or brief as you're comfortable with..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="min-h-32"
              data-testid="textarea-reason"
            />
            <p className="text-xs text-muted-foreground">
              This helps us match you with the right counselor and prepare for your session.
            </p>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, privacyConsent: checked as boolean })
                }
                data-testid="checkbox-consent"
              />
              <Label htmlFor="consent" className="font-normal text-sm cursor-pointer leading-relaxed">
                I understand that my information will be kept confidential and only shared with authorized counselors. 
                I consent to receiving support through this platform.
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!formData.urgency || !formData.reason || !formData.privacyConsent}
            className="w-full"
            data-testid="button-submit-request"
          >
            Submit Request
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crisis Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="font-medium text-sm">If you're in immediate danger:</p>
            <p className="text-sm text-muted-foreground">Call 911 or go to your nearest emergency room</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">Crisis Text Line:</p>
            <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">National Suicide Prevention Lifeline:</p>
            <p className="text-sm text-muted-foreground">1-800-273-8255</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
