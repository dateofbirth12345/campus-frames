import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Eye } from "lucide-react";

type StoryEditorProps = {
  onSave: (data: any) => void;
  onPublish: (data: any) => void;
};

export function StoryEditor({ onSave, onPublish }: StoryEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const categories = [
    "Overcoming Anxiety",
    "Building Confidence",
    "Peer Pressure",
    "Academic Success",
    "Healthy Relationships",
    "Mental Health Awareness",
    "Self Care",
    "Other",
  ];

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
    setCharCount(value.length);
    setIsSaved(false);
  };

  const handleSaveDraft = () => {
    onSave(formData);
    setIsSaved(true);
    console.log("Draft saved:", formData);
  };

  const handlePublish = () => {
    onPublish(formData);
    console.log("Story published:", formData);
  };

  const estimatedReadTime = Math.max(1, Math.ceil(formData.content.split(/\s+/).length / 200));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              placeholder="Give your story a compelling title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              data-testid="input-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Your Story</Label>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{charCount} characters</span>
                <span>{estimatedReadTime} min read</span>
                {isSaved && (
                  <Badge variant="secondary" className="text-xs">
                    Saved
                  </Badge>
                )}
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Share your story of positive choices, overcoming challenges, or supporting others..."
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-96 resize-none"
              data-testid="textarea-content"
            />
            <p className="text-xs text-muted-foreground">
              Write from your heart. Your story can inspire and help others facing similar challenges.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 flex-wrap">
          <Button variant="outline" onClick={handleSaveDraft} data-testid="button-save-draft">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!formData.title || !formData.content || !formData.category}
              data-testid="button-publish"
            >
              Publish Story
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Share authentic experiences and positive messages</p>
          <p>✓ Respect privacy - don't include identifying details of others</p>
          <p>✓ Focus on hope, resilience, and positive choices</p>
          <p>✗ Avoid graphic content or triggering details</p>
          <p>✗ Don't promote harmful behaviors</p>
        </CardContent>
      </Card>
    </div>
  );
}
