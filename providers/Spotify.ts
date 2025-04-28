
  /**
   * Spotify Provider
   */
import { Provider } from './Provider';

export class Spotify implements Provider {
  name = 'Spotify';
  
  canHandle(url: string): boolean {
    return url.includes('spotify.com') && 
           (url.includes('/track/') || 
            url.includes('/album/') || 
            url.includes('/playlist/') ||
            url.includes('/artist/'));
  }
  
  getEmbedCode(url: string): string | null {
    try {
      // Extract the resource type and ID from the URL
      const urlParts = url.split('/');
      let resourceType = '';
      let resourceId = '';
      
      // Find the resource type and ID in the URL segments
      for (let i = 0; i < urlParts.length - 1; i++) {
        if (
          urlParts[i] === 'track' || 
          urlParts[i] === 'album' || 
          urlParts[i] === 'playlist' ||
          urlParts[i] === 'artist'
        ) {
          resourceType = urlParts[i];
          resourceId = urlParts[i + 1];
          // If ID contains query parameters, remove them
          if (resourceId && resourceId.includes('?')) {
            resourceId = resourceId.split('?')[0];
          }
          break;
        }
      }
      
      // If we couldn't find the resource type or ID, return null
      if (!resourceType || !resourceId) {
        return null;
      }
      
      // Construct the embed code based on the resource type
      return `<iframe src="https://open.spotify.com/embed/${resourceType}/${resourceId}" 
        width="300" height="${resourceType === 'track' ? '80' : '380'}" 
        frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    } catch (error) {
      console.error('Error parsing Spotify URL:', error);
      return null;
    }
  }
}