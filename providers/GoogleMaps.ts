/**
   * Google Maps Provider
   */
import { Provider } from './Provider';
import { GoogleConfigService } from '../config/GoogleConfigService';

export class GoogleMaps implements Provider {
    name = 'GoogleMaps';
    private configService: GoogleConfigService;

    constructor(configService?: GoogleConfigService) {
      // Allow dependency injection for testing
      this.configService = configService || GoogleConfigService.getInstance();
    }

    private getApiKey(): string {
      return this.configService.get('GOOGLE_MAPS_API_KEY');
    }

    canHandle(url: string): boolean {
      return url.includes('google.com/maps');
    }
    
    getEmbedCode(url: string): string | null {
      // Extract the place ID or coordinates
      let embedSrc = '';
      const apiKey = this.getApiKey();
    
      if (!apiKey) {
        return null;
      }
      
      // For locations with @lat,lng,zoom format
      const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d*)z/);
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        const zoom = Math.floor(parseFloat(coordsMatch[3]));
        embedSrc = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=${zoom}`;
      } 
      // For place URLs
      else if (url.includes('/place/')) {
        // Extract the query part from the URL
        const placeMatch = url.match(/\/place\/([^\/]+)/);
        if (placeMatch) {
          const placeQuery = placeMatch[1].replace(/\+/g, ' ').replace(/%20/g, ' ');
          embedSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(placeQuery)}`;
        }
      }
      // For directions
      else if (url.includes('/dir/')) {
        const dirMatch = url.match(/\/dir\/([^\/]+)\/([^\/]+)/);
        if (dirMatch) {
          const origin = dirMatch[1].replace(/\+/g, ' ').replace(/%20/g, ' ');
          const destination = dirMatch[2].replace(/\+/g, ' ').replace(/%20/g, ' ');
          embedSrc = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
        }
      }
      
      // If we couldn't parse it properly, provide a generic embed
      if (!embedSrc) {
        return null;
      }
      
      return `<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="${embedSrc}"></iframe>`;
    }
  }