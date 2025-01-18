# Artist to Musical Style via AI LLM Text Generation

A web application that generates musical style descriptions for artists using AI. Supports multiple AI providers including OpenAI and OpenRouter.

## Features

- Generate concise musical style descriptions for any artist
- Support for multiple AI providers (OpenAI, OpenRouter)
- Dynamic model selection based on provider
- Secure API key management
- Copy-to-clipboard functionality

## Installation

```sh
# Clone the repository
git clone https://github.com/rustyorb/artist-to-style.git

# Navigate to the project directory
cd artist-to-style

# Install dependencies
npm install

# Start the development server
npm run dev

# Access the application
http://localhost:8080/
```

## Configuration

1. Click the settings icon (⚙️) in the top-right corner
2. Select a provider (OpenAI or OpenRouter)
3. Enter your API key
4. For OpenRouter or custom providers, you can optionally specify a custom base URL

### Provider Setup

#### OpenAI
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Select "OpenAI" as the provider
3. Enter your API key (starts with 'sk-')

#### OpenRouter
1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. Select "OpenRouter" as the provider
3. Enter your API key
4. Optionally customize the base URL if needed

## Usage

1. Configure your preferred AI provider in settings
2. Select an AI model from the dropdown
3. Enter an artist name
4. Click "Generate Style Description"
5. Click the copy icon to copy the result

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API
- OpenRouter API

## Security

- API keys are stored securely in browser localStorage
- No API keys are exposed in the code or version control
- Support for custom base URLs for self-hosted models
