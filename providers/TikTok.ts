// providers/TikTok.ts
import { Provider } from './Provider';

export class TikTok implements Provider {
  name = 'TikTok';
  
  canHandle(url: string): boolean {
    return url.includes('tiktok.com');
  }
  
  getEmbedCode(url: string): string | null {
    // TikTok URLs have format: tiktok.com/@username/video/VIDEO_ID
    const match = url.match(/tiktok\.com\/(@[^\/]+)\/video\/([^\/\?&#]*)/);
    
    if (match) {
      const username = match[1];
      const videoID = match[2];
      
      return `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/${username}/video/${videoID}" data-video-id="${videoID}">
        <section></section>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>`;
    }
    
    return null;
  }
}