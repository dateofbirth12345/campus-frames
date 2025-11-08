import { StoryEditor } from "@/components/StoryEditor";
import { useCreateStory, usePublishStory } from "@/hooks/useStories";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";

export default function StoryCreate() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createStoryMutation = useCreateStory();
  const publishStoryMutation = usePublishStory();
  const [draftId, setDraftId] = useState<string | null>(null);

  const handleSaveDraft = async (data: any) => {
    try {
      const result = await createStoryMutation.mutateAsync({
        ...data,
        studentId: null,
        isPublished: false,
      });
      
      setDraftId(result.story?.id || null);
      
      toast({
        title: "Draft Saved",
        description: "Your story has been saved. You can continue editing or publish it when ready.",
      });
    } catch (error: any) {
      if (error.message?.includes("Content needs review")) {
        toast({
          title: "Content Needs Review",
          description: "Please review your content and make adjustments based on our guidelines.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Unable to save draft. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePublish = async (data: any) => {
    try {
      let storyId = draftId;
      
      if (!storyId) {
        const result = await createStoryMutation.mutateAsync({
          ...data,
          studentId: null,
          isPublished: false,
        });
        storyId = result.story?.id || null;
      }
      
      if (storyId) {
        await publishStoryMutation.mutateAsync(storyId);
        
        toast({
          title: "Story Published",
          description: "Your story is now live and can inspire others!",
        });
        
        setTimeout(() => {
          setLocation("/stories");
        }, 2000);
      }
    } catch (error: any) {
      if (error.message?.includes("Content needs review")) {
        toast({
          title: "Content Needs Review",
          description: "Our AI detected some content that may need adjustment. Please review the guidelines and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Publish Failed",
          description: "Unable to publish story. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Share Your Story</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your experience can inspire and help others facing similar challenges
        </p>
      </div>

      <StoryEditor onSave={handleSaveDraft} onPublish={handlePublish} />
    </div>
  );
}
