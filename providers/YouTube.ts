// providers/YouTube.ts
import { Provider } from './Provider';

export class YouTube implements Provider {
  name = 'YouTube';
  
  /**
   * Extract ID from URL
   * @param url - The URL to extract from
   * @param regex - Regular expression with capturing group for ID
   * @returns string | null - The extracted ID or null
   */
  protected extractID(url: string, regex: RegExp): string | null {
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  canHandle(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }
  
  getEmbedCode(url: string): string | null {
   // Handle different YouTube URL formats
   let videoID: string | null = null;
    
   if (url.includes('youtube.com/watch')) {
     // youtube.com/watch?v=VIDEO_ID
     videoID = this.extractID(url, /[?&]v=([^&#]*)/);
   } else if (url.includes('youtu.be')) {
     // youtu.be/VIDEO_ID
     videoID = this.extractID(url, /youtu\.be\/([^?&#]*)/);
   } else if (url.includes('youtube.com/embed')) {
     // youtube.com/embed/VIDEO_ID
     videoID = this.extractID(url, /embed\/([^?&#]*)/);
   } else {
     return null;
   }
   
   if (!videoID) return null;
   
   return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  }
}