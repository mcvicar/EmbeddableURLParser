// tests/providers/BlueskyProvider.test.ts
import { Bluesky } from '../../providers/Bluesky';

describe('BlueskyProvider', () => {
  let provider: Bluesky;
  
  beforeEach(() => {
    provider = new Bluesky();
  });
  
  test('should have the correct name', () => {
    expect(provider.name).toBe('Bluesky');
  });
  
  describe('canHandle', () => {
    test('should return true for bsky.app URLs', () => {
      expect(provider.canHandle('https://bsky.app/profile/username.bsky.social/post/abcdef123456')).toBe(true);
      expect(provider.canHandle('http://bsky.app/profile/user.bsky.social/post/xyz789')).toBe(true);
    });
    
    test('should return false for non-Bluesky URLs', () => {
      expect(provider.canHandle('https://example.com')).toBe(false);
      expect(provider.canHandle('https://twitter.com/user/status/123456')).toBe(false);
    });
  });
  
  describe('getEmbedCode', () => {
    test('should extract username and post ID from Bluesky post URL', () => {
      const embedCode = provider.getEmbedCode('https://bsky.app/profile/username.bsky.social/post/abcdef123456');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('@username.bsky.social');
      expect(embedCode).toContain('abcdef123456');
      expect(embedCode).toContain('View on Bluesky');
    });
    
    test('should handle different username formats', () => {
      const embedCode = provider.getEmbedCode('https://bsky.app/profile/user.bsky.social/post/xyz789');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('@user.bsky.social');
      expect(embedCode).toContain('xyz789');
    });
    
    test('should return null for Bluesky URLs that are not posts', () => {
      const embedCode = provider.getEmbedCode('https://bsky.app/profile/username.bsky.social');
      
      expect(embedCode).toBeNull();
    });
    
    test('should return null for malformed URLs', () => {
      const embedCode = provider.getEmbedCode('not-a-url');
      
      expect(embedCode).toBeNull();
    });
  });
  
  test('should handle complete Bluesky workflow', () => {
    // Integration test for the provider
    const url = 'https://bsky.app/profile/username.bsky.social/post/abcdef123456';
    
    const canHandle = provider.canHandle(url);
    const embedCode = provider.getEmbedCode(url);
    
    expect(canHandle).toBe(true);
    expect(embedCode).not.toBeNull();
    expect(embedCode).toContain('@username.bsky.social');
    expect(embedCode).toContain('div class="bluesky-embed"');
  });
});