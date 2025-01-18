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
content: `Generate a music genre mix inspired by a given musical artist. The mix should capture the essence of the artist's style, combining real musical elements.

- The mix must be provided inside brackets [like this].
- The mix should not exceed 200 characters, including brackets.
- Focus on accurately depicting the artist's unique sound

# Steps

1. **Identify Artist's Essence**: Analyze the unique style and elements characteristic of the artist. Include distinctive features and influences.
2. **Select Genres/Sub-genres**: Choose 1 or more genres/sub-genres representing the artist's style. Provide a unique and detailed explanation for each selection.
3. **Incorporate Elements**: Add instrumental, vocal, and lyrical themes that evoke the artist's sound, including instrumentation style, rhythm, or mood elements.
4. **Verify Length**: Ensure the mix is both concise yet detailed, reaching as close to the 200-character limit as possible.
5. **Format**: Present the completed mix in brackets.

# Output Format

- Provide the music mix enclosed in brackets [like this]. Max 200 characters including the brackets.

# Examples

**User Input:** Radiohead

**Output:** [Alternative Rock, Progressive Art Rock, Experimental Electronic Contrasts, Introspective Lyrics, Hauntingly Melancholic Vocals, Atmospheric Soundscapes, Subtle Jazz Influences]

**User Input:** Daft Punk

**Output:** [Dance Electronica, Funk Influences, Robotic Vocals, Digital Pop Artistry, Cinematic Soundscapes, Disco Inspirations, Layered Rhythms, Catchy Melodic Hooks]

(Note: Real examples should be fully fleshed out to meet character requirement with elaborate descriptions)

# Notes

- Ensure each mix captures the full spectrum of the artist's sound, including less conventional musical influences when appropriate.
- Make sure the mix is both concise and rich in descriptive elements to fully represent the artist’s essence.`,
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