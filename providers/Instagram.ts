// providers/Instagram.ts
import { Provider } from './Provider';

export class Instagram implements Provider {
  name = 'Instagram';
  
  canHandle(url: string): boolean {
    return url.includes('instagram.com/p/') || url.includes('instagram.com/reel/');
  }
  
  getEmbedCode(url: string): string | null {
    // Handle Instagram posts
    // Instagram URLs have format: instagram.com/p/CODE/ or instagram.com/reel/CODE/
    let postID: string | null = null;
    
    const postMatch = url.match(/instagram\.com\/(p|reel)\/([^\/\?&#]*)/);
    if (postMatch) {
      postID = postMatch[2];
    } else {
      return null;
    }
    
    return `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${postID}/" data-instgrm-version="14">
      <div style="padding:16px;">
        <a href="https://www.instagram.com/p/${postID}/" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">
        </a>
      </div>
    </blockquote>
    <script async src="//www.instagram.com/embed.js"></script>`;
  }
}