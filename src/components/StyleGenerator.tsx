import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";
import { ModelSelect } from "@/components/ModelSelect";
import { ApiService } from "@/services/api";

export function StyleGenerator() {
  const [artist, setArtist] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const { toast } = useToast();
  const apiService = new ApiService();

  useEffect(() => {
    // Get the first configured provider
    const providers = apiService.getConfiguredProviders();
    if (providers.length > 0) {
      setSelectedProvider(providers[0]);
    }
  }, []);

  const generateStyle = async () => {
    if (!selectedProvider) {
      toast({
        variant: "destructive",
        title: "Provider Required",
        description: "Please configure an API provider in settings.",
      });
      return;
    }

    if (!selectedModel) {
      toast({
        variant: "destructive",
        title: "Model Required",
        description: "Please select a model.",
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
      const response = await apiService.generateCompletion(
        selectedProvider,
        selectedModel,
        artist
      );
      setResult(response.choices[0].message.content);
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
        <ModelSelect
          provider={selectedProvider}
          value={selectedModel}
          onChange={setSelectedModel}
        />
        <Button className="w-full" onClick={generateStyle} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
