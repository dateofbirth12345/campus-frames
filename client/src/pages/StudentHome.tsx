import { StoryCard } from "@/components/StoryCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, HeartHandshake, Sparkles, Loader2 } from "lucide-react";
import { useStories, useLikeStory } from "@/hooks/useStories";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function StudentHome() {
  const { toast } = useToast();
  const { data, isLoading } = useStories(3);
  const likeStoryMutation = useLikeStory();

  const stories = data?.stories || [];

  const handleLike = async (id: string) => {
    try {
      await likeStoryMutation.mutateAsync(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/stories/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Story link copied to clipboard!",
    });
  };

  return (
    <div className="space-y-8">
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Wellbeing Matters
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Connect with support, share your story, and discover resources to help you thrive.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button size="lg" onClick={() => window.location.href = "/support"} data-testid="button-get-support">
              <HeartHandshake className="h-5 w-5 mr-2" />
              Get Support
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = "/story/create"} data-testid="button-share-story">
              <BookOpen className="h-5 w-5 mr-2" />
              Share Your Story
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate transition-all">
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Student Stories</CardTitle>
            <CardDescription>
              Read inspiring stories from peers who've overcome challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/stories"} data-testid="button-browse-stories">
              Browse Stories →
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all">
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center mb-2">
              <HeartHandshake className="h-6 w-6 text-chart-2" />
            </div>
            <CardTitle>Counselor Support</CardTitle>
            <CardDescription>
              Connect with trained counselors in a safe, confidential space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/support"} data-testid="button-request-support">
              Request Support →
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all">
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-chart-3/10 flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-chart-3" />
            </div>
            <CardTitle>Create Content</CardTitle>
            <CardDescription>
              Share your journey and help others through creative storytelling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/story/create"} data-testid="button-create-story">
              Create Story →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Stories</h2>
          <Button variant="outline" onClick={() => window.location.href = "/stories"} data-testid="button-view-all-stories">
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : stories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Stories Yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your story and inspire others!</p>
              <Button onClick={() => window.location.href = "/story/create"}>
                Share Your Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                excerpt={story.content.substring(0, 200) + (story.content.length > 200 ? "..." : "")}
                category={story.category}
                author={story.studentId ? "Student" : "Anonymous"}
                likes={story.likes || 0}
                publishedAt={story.publishedAt ? formatDistanceToNow(new Date(story.publishedAt), { addSuffix: true }) : "Recently"}
                onLike={() => handleLike(story.id)}
                onShare={() => handleShare(story.id)}
                onView={() => console.log('View story:', story.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wellness Resources</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Crisis Support</h4>
            <p className="text-sm text-muted-foreground">24/7 crisis text line: Text HOME to 741741</p>
            <p className="text-sm text-muted-foreground">National Suicide Prevention: 1-800-273-8255</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Campus Resources</h4>
            <p className="text-sm text-muted-foreground">Student Health Center: Building A, Room 102</p>
            <p className="text-sm text-muted-foreground">Peer Support Groups: Wednesdays at 3 PM</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
