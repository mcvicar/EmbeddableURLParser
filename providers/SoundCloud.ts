// providers/SoundCloudProvider.ts
import { Provider } from './Provider';

export class SoundCloud implements Provider {
  name = 'SoundCloud';
  
  canHandle(url: string): boolean {
    return url.includes('soundcloud.com');
  }
  
  getEmbedCode(url: string): string | null {
    try {
      // Validate URL
      if (!url.startsWith('http') || !url.includes('soundcloud.com')) {
        return null;
      }
      
      // SoundCloud URLs should be direct links to tracks, playlists, or users
      // Remove query parameters for clean URLs
      const cleanUrl = url.split('?')[0];
      
      // SoundCloud's oEmbed format requires the exact URL
      return `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" 
               src="https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
               <div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;">
                 <a href="${cleanUrl}" title="Listen on SoundCloud" target="_blank" style="color: #cccccc; text-decoration: none;">SoundCloud</a>
               </div>`;
    } catch (error) {
      console.error('Error parsing SoundCloud URL:', error);
      return null;
    }
  }
}