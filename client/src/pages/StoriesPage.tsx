import { StoryCard } from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useStories, useLikeStory } from "@/hooks/useStories";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function StoriesPage() {
  const { toast } = useToast();
  const { data, isLoading } = useStories(50);
  const likeStoryMutation = useLikeStory();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const stories = data?.stories || [];

  const filteredStories = stories.filter((story) => {
    const matchesSearch = !searchQuery || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      story.category.toLowerCase().includes(categoryFilter.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Student Stories</h1>
        <p className="text-muted-foreground mt-2">
          Real experiences, authentic voices, shared hope
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-stories"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48" data-testid="select-category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="anxiety">Overcoming Anxiety</SelectItem>
            <SelectItem value="confidence">Building Confidence</SelectItem>
            <SelectItem value="peer-pressure">Peer Pressure</SelectItem>
            <SelectItem value="academic">Academic Success</SelectItem>
            <SelectItem value="self-care">Self Care</SelectItem>
            <SelectItem value="mental-health">Mental Health Awareness</SelectItem>
          </SelectContent>
        </Select>
        <Button data-testid="button-share-your-story" onClick={() => window.location.href = "/story/create"}>
          Share Your Story
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery || categoryFilter !== "all" 
              ? "No stories match your search criteria"
              : "No published stories yet. Be the first to share your story!"}
          </p>
          {!searchQuery && categoryFilter === "all" && (
            <Button className="mt-4" onClick={() => window.location.href = "/story/create"}>
              Share Your Story
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
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
  );
}
