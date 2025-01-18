import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/api";
import {
  ProviderConfig as IProviderConfig,
  defaultProviders,
} from "@/types/api";

export function ProviderConfig() {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const { toast } = useToast();
  const apiService = new ApiService();

  const handleSave = () => {
    if (!selectedProvider) {
      toast({
        variant: "destructive",
        title: "Provider Required",
        description: "Please select a provider.",
      });
      return;
    }

    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter an API key.",
      });
      return;
    }

    if (selectedProvider === "openai" && !apiKey.startsWith("sk-")) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
      });
      return;
    }

    const config: IProviderConfig = {
      name: selectedProvider,
      apiKey,
      ...(customBaseUrl && { baseUrl: customBaseUrl }),
    };

    try {
      apiService.saveProviderConfig(config);
      toast({
        title: "Configuration saved",
        description: `${selectedProvider} API configuration has been saved successfully.`,
      });

      // Reset form
      setApiKey("");
      setCustomBaseUrl("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save provider configuration.",
      });
    }
  };

  const handleRemove = () => {
    if (!selectedProvider) return;

    try {
      apiService.removeProviderConfig(selectedProvider);
      toast({
        title: "Provider Removed",
        description: `${selectedProvider} configuration has been removed.`,
      });

      // Reset form
      setSelectedProvider("");
      setApiKey("");
      setCustomBaseUrl("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Remove Failed",
        description: "Failed to remove provider configuration.",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Provider</label>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(defaultProviders).map(([key, provider]) => (
              <SelectItem key={key} value={key}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">API Key</label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={
            selectedProvider === "openai" ? "sk-..." : "Enter API key"
          }
        />
      </div>

      {selectedProvider !== "openai" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Custom Base URL (Optional)
          </label>
          <Input
            value={customBaseUrl}
            onChange={(e) => setCustomBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save Configuration
        </Button>
        {selectedProvider && (
          <Button onClick={handleRemove} variant="destructive">
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
