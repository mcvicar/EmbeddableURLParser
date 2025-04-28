// providers/OpenStreetMapProvider.ts
import { Provider } from './Provider';

export class OpenStreetMap implements Provider {
  name = 'OpenStreetMap';
  
  canHandle(url: string): boolean {
    return url.includes('openstreetmap.org');
  }
  
  getEmbedCode(url: string): string | null {
    try {
      // Check if the URL is valid
      if (!url.startsWith('http')) {
        return null;
      }
      
      // Parse the coordinates from the URL
      // Format example: https://www.openstreetmap.org/#map=15/51.5074/-0.1278
      let zoom = '14';
      let lat = '0';
      let lon = '0';
      
      // Try to extract the map coordinates
      const mapMatch = url.match(/#map=(\d+)\/([^\/]+)\/([^\/]+)/);
      if (mapMatch) {
        zoom = mapMatch[1];
        lat = mapMatch[2];
        lon = mapMatch[3];
      } else {
        // If we can't extract coordinates, default to a generic embed
        return null;
      }
      
      // Create the iframe embed code
      return `<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon)-0.01},${parseFloat(lat)-0.01},${parseFloat(lon)+0.01},${parseFloat(lat)+0.01}&amp;layer=mapnik&amp;marker=${lat},${lon}"
        style="border: 1px solid black"></iframe>
        <br/>
        <small><a href="${url}" target="_blank">View Larger Map</a></small>`;
    } catch (error) {
      console.error('Error parsing OpenStreetMap URL:', error);
      return null;
    }
  }
}