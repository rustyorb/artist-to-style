import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ConfigModal() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.startsWith("sk-")) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
      });
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    toast({
      title: "Configuration saved",
      description: "Your API key has been saved successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              OpenAI API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}