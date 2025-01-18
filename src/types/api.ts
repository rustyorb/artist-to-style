export interface Provider {
  name: string;
  baseUrl: string;
  apiKey: string;
  modelsPath: string;
  completionsPath: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
}

export interface ProviderConfig {
  name: string;
  apiKey: string;
  baseUrl?: string;
}

export const defaultProviders: Record<string, Omit<Provider, "apiKey">> = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    modelsPath: "/models",
    completionsPath: "/chat/completions",
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    modelsPath: "/models",
    completionsPath: "/chat/completions",
  },
};

export interface CompletionRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
}

export interface ApiModel {
  id: string;
  name?: string;
  created?: number;
  owned_by?: string;
  [key: string]: string | number | undefined;
}

export interface ModelsResponse {
  data: ApiModel[];
}

export interface CompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}