// tests/providers/SoundCloud.test.ts
import { SoundCloud } from '../../providers/SoundCloud';

describe('SoundCloudProvider', () => {
  let provider: SoundCloud;
  
  beforeEach(() => {
    provider = new SoundCloud();
  });
  
  test('should have the correct name', () => {
    expect(provider.name).toBe('SoundCloud');
  });
  
  describe('canHandle', () => {
    test('should return true for soundcloud.com URLs', () => {
      expect(provider.canHandle('https://soundcloud.com/artist/track')).toBe(true);
      expect(provider.canHandle('http://soundcloud.com/artist/sets/playlist')).toBe(true);
    });
    
    test('should return false for non-SoundCloud URLs', () => {
      expect(provider.canHandle('https://example.com')).toBe(false);
      expect(provider.canHandle('https://spotify.com/track/12345')).toBe(false);
    });
  });
  
  describe('getEmbedCode', () => {
    test('should create embed code for a SoundCloud track URL', () => {
      const embedCode = provider.getEmbedCode('https://soundcloud.com/artist/track-name');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('w.soundcloud.com/player');
      expect(embedCode).toContain(encodeURIComponent('https://soundcloud.com/artist/track-name'));
      expect(embedCode).toContain('iframe');
    });
    
    test('should handle URLs with query parameters', () => {
      const embedCode = provider.getEmbedCode('https://soundcloud.com/artist/track?utm_source=clipboard');
      
      expect(embedCode).not.toBeNull();
      // Should not include the query parameters in the embed URL
      expect(embedCode).toContain(encodeURIComponent('https://soundcloud.com/artist/track'));
      expect(embedCode).not.toContain('utm_source');
    });
    
    test('should handle playlist URLs', () => {
      const embedCode = provider.getEmbedCode('https://soundcloud.com/artist/sets/playlist-name');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain(encodeURIComponent('https://soundcloud.com/artist/sets/playlist-name'));
    });
    
    test('should return null for malformed URLs', () => {
      const embedCode = provider.getEmbedCode('not-a-url');
      
      expect(embedCode).toBeNull();
    });
  });
  
  test('should handle complete SoundCloud workflow', () => {
    // Integration test for the provider
    const url = 'https://soundcloud.com/artist/track-name';
    
    const canHandle = provider.canHandle(url);
    const embedCode = provider.getEmbedCode(url);
    
    expect(canHandle).toBe(true);
    expect(embedCode).not.toBeNull();
    expect(embedCode).toContain('w.soundcloud.com/player');
    expect(embedCode).toMatch(/<iframe.*/);
  });
});