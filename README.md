# EmbeddableURLParser

A modular JavaScript class for parsing URLs and generating embeddable code snippets for various media services.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Adding Custom Providers](#adding-custom-providers)
  - [Available Providers](#available-providers)
- [Architecture](#architecture)
  - [Core Classes](#core-classes)
  - [Provider System](#provider-system)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Test Structure](#test-structure)
- [Examples](#examples)
  - [Basic Example](#basic-example)
  - [Custom Provider Example](#custom-provider-example)
  - [Processing Multiple URLs](#processing-multiple-urls)
- [Contributing](#contributing)
- [License](#license)

## Overview

EmbeddableURLParser is a flexible utility that converts URLs from various media services into embeddable HTML code. It follows a modular provider-based architecture, making it easy to add support for new services without modifying the core code.

## Features

- Convert media URLs into embeddable code snippets
- Modular provider system for easy extensibility
- Built-in support for popular services:
  - YouTube
  - Instagram
  - TikTok
  - Google Maps
  - Apple Maps
  - Bing Maps
- Robust error handling
- Comprehensive test coverage

## Installation

```bash
npm install embeddable-url-parser
```

## Usage

### Basic Usage

```javascript
// Import the parser
const { EmbeddableURLParser } = require('embeddable-url-parser');

// Create an instance
const parser = new EmbeddableURLParser();

// Parse a URL
const embedCode = parser.parseURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// Use the embed code in your application
document.getElementById('embed-container').innerHTML = embedCode;
```

### Adding Custom Providers

```javascript
const { EmbeddableURLParser, Provider } = require('embeddable-url-parser');

// Create a custom provider
import { Provider } from './Provider';

export class Vimeo implements Provider {
  name = 'Vimeo';

  canHandle(url) {
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)/i;
    return vimeoRegex.test(url);
  }
  
  getEmbedCode(url) {
    const videoID = this.extractID(url, /vimeo\.com\/([^\/\?&#]*)/);
    if (!videoID) return null;
    
    return `<iframe src="https://player.vimeo.com/video/${videoID}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
}

// Register the custom provider
const parser = new EmbeddableURLParser();
parser.registerProvider(new Vimeo());

// Use the custom provider
const embedCode = parser.parseURL('https://vimeo.com/123456789');
```

### Available Providers

| Provider | Service | Example URL |
|----------|---------|-------------|
| YouTube | YouTube | https://www.youtube.com/watch?v=dQw4w9WgXcQ |
| Instagram | Instagram | https://www.instagram.com/p/ABC123/ |
| TikTok | TikTok | https://www.tiktok.com/@username/video/1234567890 |
| GoogleMaps | Google Maps | https://www.google.com/maps/place/Empire+State+Building |
| BingMaps | Bing Maps | https://www.bing.com/maps?q=Empire+State+Building |

## Architecture

### Core Classes

#### EmbeddableURLParser

The main class that manages providers and delegates URL parsing:

```javascript
class EmbeddableURLParser {
  constructor() {
    this.providers = {};
    
    // Register default providers
    this.registerProvider(new YouTube());
    this.registerProvider(new Instagram());
    this.registerProvider(new TikTok());
  }

  registerProvider(provider) {
    this.providers[provider.name] = provider;
  }

  parseURL(url) {
    // Try to find a provider that can handle this URL
    for (const providerName in this.providers) {
      const provider = this.providers[providerName];
      if (provider.canHandle(url)) {
        return provider.getEmbedCode(url);
      }
    }
    
    // No provider found
    return null;
  }
}
```

### Provider System

Each provider must implement:

1. **name**: Name of the service
2. **canHandle(url)**: Determine if this provider can handle the given URL
3. **getEmbedCode(url)**: Generate embeddable HTML code for the URL

Example provider implementation:

```javascript
class YouTube implements Provider {
  name = 'YouTube';
  
  canHandle(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/i;
    return youtubeRegex.test(url);
  }
  
  getEmbedCode(url) {
    // Logic to extract video ID and generate embed code
    let videoID;
    
    if (url.includes('youtube.com/watch')) {
      videoID = this.extractID(url, /[?&]v=([^&#]*)/);
    } else if (url.includes('youtu.be')) {
      videoID = this.extractID(url, /youtu\.be\/([^?&#]*)/);
    } else if (url.includes('youtube.com/embed')) {
      videoID = this.extractID(url, /embed\/([^?&#]*)/);
    } else {
      return null;
    }
    
    if (!videoID) return null;
    
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
}
```

## Testing

### Running Tests

The project uses Jest for testing:

```bash
# Install Jest
npm install --save-dev jest

# Run tests
npm test
```

### Test Structure

Tests are organized into groups:

1. **Happy Path Tests**: Test expected behavior with valid inputs
2. **Sad Path Tests**: Test error handling with invalid inputs
3. **Individual Provider Tests**: Test specific provider functionality
4. **Base Class Tests**: Test abstract base class behavior

Example test structure:

```javascript
// Using Jest testing framework
describe('EmbeddableURLParser', () => {
  let parser;

  beforeEach(() => {
    // Create a fresh parser instance before each test
    parser = new EmbeddableURLParser();
  });

  describe('Happy Path - YouTube Provider', () => {
    test('should parse standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = parser.parseURL(url);
      
      expect(result).toContain('<iframe');
      expect(result).toContain('youtube.com/embed/dQw4w9WgXcQ');
    });
    
    // More tests...
  });
  
  describe('Sad Path - Unsupported URLs', () => {
    test('should return null for unsupported URLs', () => {
      const url = 'https://example.com/video';
      const result = parser.parseURL(url);
      
      expect(result).toBeNull();
    });
    
    // More tests...
  });
});
```

## Examples

### Basic Example

```javascript
const parser = new EmbeddableURLParser();

// YouTube
const youtubeEmbed = parser.parseURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(youtubeEmbed);
// Output: <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" ...></iframe>

// Instagram
const instagramEmbed = parser.parseURL('https://www.instagram.com/p/ABC123/');
console.log(instagramEmbed);
// Output: <blockquote class="instagram-media" ...></blockquote><script async src="//www.instagram.com/embed.js"></script>
```

### Custom Provider Example

```javascript
// Twitter/X provider
class Twitter implements Provider {
  cname = 'twitter';
  
  canHandle(url) {
    return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/i.test(url);
  }
  
  getEmbedCode(url) {
    // Extract tweet ID
    const tweetID = this.extractID(url, /\/status\/([0-9]+)/);
    if (!tweetID) return null;
    
    return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script>`;
  }
}

// Register and use
const parser = new EmbeddableURLParser();
parser.registerProvider(new Twitter());

const twitterEmbed = parser.parseURL('https://twitter.com/username/status/1234567890');
console.log(twitterEmbed);
```

### Processing Multiple URLs

```javascript
const parser = new EmbeddableURLParser();

// Register map providers
parser.registerProvider(new GoogleMapsProvider());
parser.registerProvider(new AppleMapsProvider());
parser.registerProvider(new BingMapsProvider());

// Process a list of URLs
const urls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.instagram.com/p/ABC123/',
  'https://www.tiktok.com/@username/video/1234567890',
  'https://www.google.com/maps/place/Empire+State+Building',
  'https://example.com/not-supported'
];

const embedResults = urls.map(url => {
  const embed = parser.parseURL(url);
  return {
    url,
    supported: embed !== null,
    embed
  };
});

console.log(embedResults);
```

## Contributing

Contributions are welcome! To add a new provider:

1. Create a new class that extends `Provider`
2. Implement `canHandle(url)` and `getEmbedCode(url)` methods
3. Add tests for your provider
4. Submit a pull request

## License

MIT License