import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";

export function StyleGenerator() {
  const [artist, setArtist] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateStyle = async () => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please configure your OpenAI API key in settings.",
      });
      return;
    }

    if (!artist.trim()) {
      toast({
        variant: "destructive",
        title: "Artist Required",
        description: "Please enter an artist name.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a music expert generating artist style descriptions. When given an artist name, create a concise mix of genres and musical elements in this format: [Genre 1, Genre 2, Element 1, Element 2, ...] (max 200 characters including brackets). Focus on combining core genres with specific musical elements that define the artist's sound.",
            },
            {
              role: "user",
              content: artist,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate style description. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Style description copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      <div className="space-y-2">
        <Input
          placeholder="Enter artist name..."
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="text-lg"
        />
        <Button
          className="w-full"
          onClick={generateStyle}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Generate Style Description
        </Button>
      </div>

      {result && (
        <Card className="p-4 relative group">
          <p className="text-lg font-medium">{result}</p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  );
}