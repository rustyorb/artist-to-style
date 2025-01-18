import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Model } from "@/types/api";
import { ApiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectProps {
  provider: string;
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ provider, value, onChange }: ModelSelectProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const apiService = new ApiService();

  useEffect(() => {
    const fetchModels = async () => {
      if (!provider) return;

      setLoading(true);
      try {
        const fetchedModels = await apiService.getModels(provider);
        setModels(fetchedModels);

        // If no model is selected and we have models, select the first one
        if (!value && fetchedModels.length > 0) {
          onChange(fetchedModels[0].id);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch models",
          description: "Please check your API configuration and try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [provider, toast, onChange, value]);

  if (!provider) {
    return null;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={loading ? "Loading models..." : "Select a model"}
        />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
