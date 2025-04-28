// providers/BlueskyProvider.ts
import { Provider } from './Provider';

export class Bluesky implements Provider {
  name = 'Bluesky';
  
  canHandle(url: string): boolean {
    return url.includes('bsky.app');
  }
  
  getEmbedCode(url: string): string | null {
    try {
      // Validate URL
      if (!url.startsWith('http') || !url.includes('bsky.app')) {
        return null;
      }
      
      // Check if this is a post URL
      // Format: https://bsky.app/profile/username.bsky.social/post/[postId]
      const postMatch = url.match(/bsky\.app\/profile\/([^\/]+)\/post\/([^\/]+)/);
      if (!postMatch) {
        return null;
      }
      
      const username = postMatch[1];
      const postId = postMatch[2];
      
      // Bluesky doesn't have an official embed API yet, so we create a card-like embed
      return `<div class="bluesky-embed" style="border: 1px solid #e1e8ed; border-radius: 12px; padding: 16px; max-width: 550px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;">
        <div style="display: flex; margin-bottom: 12px;">
          <div style="font-weight: bold; margin-right: 4px;">@${username}</div>
          <div style="color: #657786;">on Bluesky</div>
        </div>
        <div style="margin-bottom: 12px;">
          Post ID: ${postId}
        </div>
        <a href="${url}" target="_blank" style="text-decoration: none; color: #1da1f2; display: block; margin-top: 8px;">View on Bluesky</a>
      </div>`;
    } catch (error) {
      console.error('Error parsing Bluesky URL:', error);
      return null;
    }
  }
}