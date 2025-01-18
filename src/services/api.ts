import { CompletionRequest, CompletionResponse, Model, Provider, ProviderConfig, defaultProviders, ModelsResponse, ApiModel } from "@/types/api";

export class ApiService {
  private providers: Record<string, Provider>;

  constructor() {
    this.providers = this.loadProviders();
  }

  private loadProviders(): Record<string, Provider> {
    const storedProviders = JSON.parse(localStorage.getItem("providers") || "{}");
    const providers: Record<string, Provider> = {};

    // Initialize providers with stored configurations
    Object.entries(storedProviders).forEach(([key, config]: [string, ProviderConfig]) => {
      const defaultProvider = defaultProviders[key];
      if (defaultProvider) {
        providers[key] = {
          ...defaultProvider,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl || defaultProvider.baseUrl,
        };
      }
    });

    return providers;
  }

  async getModels(providerName: string): Promise<Model[]> {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`Provider ${providerName} not configured`);
    }

    try {
      const fetchResponse = await fetch(`${provider.baseUrl}${provider.modelsPath}`, {
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
        },
      });

      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch models: ${fetchResponse.statusText}`);
      }

      const data = await fetchResponse.json() as ModelsResponse;
      return data.data.map((model: ApiModel) => ({
        id: model.id,
        name: model.id,
        provider: provider.name,
      }));
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  }

  async generateCompletion(
    providerName: string,
    model: string,
    prompt: string
  ): Promise<CompletionResponse> {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`Provider ${providerName} not configured`);
    }

    const request: CompletionRequest = {
      model,
      messages: [
        {
          role: "system",
          content: "You are a music expert generating artist style descriptions. When given an artist name, create a concise mix of genres and musical elements in this format: [Genre 1, Genre 2, Element 1, Element 2, ...] (max 200 characters including brackets). Focus on combining core genres with specific musical elements that define the artist's sound.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    try {
      const fetchResponse = await fetch(
        `${provider.baseUrl}${provider.completionsPath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!fetchResponse.ok) {
        throw new Error(`API request failed: ${fetchResponse.statusText}`);
      }

      return fetchResponse.json();
    } catch (error) {
      console.error("Error generating completion:", error);
      throw error;
    }
  }

  getAvailableProviders(): string[] {
    return Object.keys(defaultProviders);
  }

  getConfiguredProviders(): string[] {
    return Object.keys(this.providers);
  }

  saveProviderConfig(config: ProviderConfig): void {
    const providers = JSON.parse(localStorage.getItem("providers") || "{}");
    providers[config.name.toLowerCase()] = config;
    localStorage.setItem("providers", JSON.stringify(providers));
    this.providers = this.loadProviders();
  }

  removeProviderConfig(providerName: string): void {
    const providers = JSON.parse(localStorage.getItem("providers") || "{}");
    delete providers[providerName.toLowerCase()];
    localStorage.setItem("providers", JSON.stringify(providers));
    this.providers = this.loadProviders();
  }
}