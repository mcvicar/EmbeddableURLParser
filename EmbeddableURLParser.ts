// EmbeddableURLParser.ts
import {
    Provider,
    YouTube,
    Instagram,
    TikTok,
    GoogleMaps,
    BingMaps,
    Spotify,
    OpenStreetMap,
    SoundCloud,
    Bluesky
  } from './providers';
  
  // Define the interface for the return object
  export interface EmbedResult {
    embeddable: string | null;
    sitename: string;
    url: string;
  }
  
  /**
   * Main URL Parser Class
   */
  export class EmbeddableURLParser {
    private providers: Map<string, Provider>;
    
    constructor() {
      this.providers = new Map<string, Provider>();
      
      // Register default providers
      this.registerProvider(new YouTube());
      this.registerProvider(new Instagram());
      this.registerProvider(new TikTok());
      this.registerProvider(new GoogleMaps());
      this.registerProvider(new BingMaps());
      this.registerProvider(new Spotify());
      this.registerProvider(new OpenStreetMap());
      this.registerProvider(new SoundCloud());
      this.registerProvider(new Bluesky());
    }
  
    /**
     * Register a new provider
     * @param provider - The provider instance to register
     */
    registerProvider(provider: Provider): void {
      this.providers.set(provider.name, provider);
    }
  
    /**
     * Parse a URL and return embed result
     * @param url - The URL to parse
     * @returns EmbedResult - Object containing embeddable code, sitename and URL
     */
    parseURL(url: string): EmbedResult {
      if (!url) {
        return {
          embeddable: null,
          sitename: 'Unknown',
          url: url || ''
        };
      }
      
      // Try to find a provider that can handle this URL
      for (const provider of this.providers.values()) {
        try {
          if (provider.canHandle(url)) {
            const embeddable = provider.getEmbedCode(url);
            return {
              embeddable,
              sitename: provider.name,
              url
            };
          }
        } catch (error) {
          console.error(`Error in provider ${provider.name}:`, error);
          // Continue to the next provider
        }
      }
      
      // No provider found or all failed
      return {
        embeddable: null,
        sitename: 'Unknown',
        url
      };
    }
  }
  
  // Example usage
  /*
  const parser = new EmbeddableURLParser();
  
  // Test with different URLs
  const youtubeResult = parser.parseURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const instagramResult = parser.parseURL('https://www.instagram.com/p/ABC123/');
  const tiktokResult = parser.parseURL('https://www.tiktok.com/@username/video/1234567890');
  const googleMapsResult = parser.parseURL('https://www.google.com/maps/place/Empire+State+Building');
  const unsupportedResult = parser.parseURL('https://example.com/video');
  
  console.log(youtubeResult);
  // {
  //   embeddable: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" ...',
  //   sitename: 'YouTube',
  //   url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  // }
  */