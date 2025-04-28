
  /**
   * Bing Maps Provider
   */
  import { Provider } from './Provider';

  export class BingMaps implements Provider {
    name = 'BingMaps';
    
    canHandle(url: string): boolean {
      return url.includes('bing.com/maps');
    }
    
    getEmbedCode(url: string): string | null {
      // Try to extract coordinates from cp parameter (centerpoint)
      const coordsMatch = url.match(/[?&]cp=(-?\d+\.\d+)~(-?\d+\.\d+)/);
      // Try to extract search query
      const queryMatch = url.match(/[?&]q=([^&]+)/);
      // Try to extract level (zoom)
      const levelMatch = url.match(/[?&]lvl=(\d+)/);
      
      const zoom = levelMatch ? levelMatch[1] : '12';
      
      let embedSrc = '';
      
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        embedSrc = `https://www.bing.com/maps/embed?h=600&w=800&cp=${lat}~${lng}&lvl=${zoom}&typ=d&sty=r`;
      } else if (queryMatch) {
        const query = decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ');
        embedSrc = `https://www.bing.com/maps/embed?h=600&w=800&q=${encodeURIComponent(query)}`;
      } else {
        // Generic fallback
        return null;
      }
      
      return `<iframe width="600" height="450" frameborder="0" src="${embedSrc}" scrolling="no"></iframe>`;
    }
  }