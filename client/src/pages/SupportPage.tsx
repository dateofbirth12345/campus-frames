import { CounselorRequestForm } from "@/components/CounselorRequestForm";
import { useCreateCounselorRequest } from "@/hooks/useCounselorRequests";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const { toast } = useToast();
  const createRequestMutation = useCreateCounselorRequest();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleRequestSubmit = async (data: any) => {
    try {
      const result = await createRequestMutation.mutateAsync({
        ...data,
        studentId: null,
        status: "pending",
      });
      
      setVerificationCode(result.request?.verificationCode || "N/A");
      setShowSuccessDialog(true);
      
      toast({
        title: "Request Submitted",
        description: "A counselor will review your request and reach out soon.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit request. Please try again or contact support directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Get Support</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            You don't have to face challenges alone. We're here to help.
          </p>
        </div>

        <CounselorRequestForm onSubmit={handleRequestSubmit} />
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Received</DialogTitle>
            <DialogDescription>
              Your counselor support request has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-md p-4">
              <p className="text-sm font-medium mb-2">Your Verification Code:</p>
              <p className="text-2xl font-mono font-bold text-center py-3 bg-background rounded border">
                {verificationCode}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Save this code. You may need it when meeting with your counselor.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>A counselor will review your request within 24-48 hours</li>
                <li>You'll be contacted through your preferred method</li>
                <li>Your first session will be scheduled based on urgency</li>
              </ol>
            </div>
            <Button className="w-full" onClick={() => setShowSuccessDialog(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
