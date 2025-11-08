import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

type StoryCardProps = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  likes: number;
  publishedAt: string;
  onLike?: () => void;
  onShare?: () => void;
  onView?: () => void;
};

export function StoryCard({
  id,
  title,
  excerpt,
  category,
  author,
  likes: initialLikes,
  publishedAt,
  onLike,
  onShare,
  onView,
}: StoryCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.();
  };

  return (
    <Card className="hover-elevate transition-all">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-xs text-muted-foreground">{publishedAt}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight" data-testid={`story-title-${id}`}>{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {author.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? "text-destructive" : ""}
            data-testid={`button-like-${id}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="ml-1">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare} data-testid={`button-share-${id}`}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onView} data-testid={`button-view-${id}`}>
            <Eye className="h-4 w-4" />
            <span className="ml-1">View</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
