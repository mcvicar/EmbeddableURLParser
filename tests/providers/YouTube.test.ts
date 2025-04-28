import { YouTube } from '../../providers/YouTube';

describe('YouTube', () => {
  let provider: YouTube;
  
  beforeEach(() => {
    provider = new YouTube();
  });
  
  test('should have the correct name', () => {
    expect(provider.name).toBe('YouTube');
  });
  
  describe('canHandle', () => {
    test('should return true for youtube.com URLs', () => {
      expect(provider.canHandle('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(provider.canHandle('http://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    });
    
    test('should return true for youtu.be short URLs', () => {
      expect(provider.canHandle('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    });
    
    test('should return false for non-YouTube URLs', () => {
      expect(provider.canHandle('https://example.com')).toBe(false);
      expect(provider.canHandle('https://vimeo.com/12345')).toBe(false);
    });
  });
  
  describe('getEmbedCode', () => {
    test('should extract video ID from standard YouTube URL', () => {
      const embedCode = provider.getEmbedCode('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('youtube.com/embed/dQw4w9WgXcQ');
      expect(embedCode).toContain('iframe');
    });
    
    test('should extract video ID from short youtu.be URL', () => {
      const embedCode = provider.getEmbedCode('https://youtu.be/dQw4w9WgXcQ');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('youtube.com/embed/dQw4w9WgXcQ');
    });
    
    test('should return null for YouTube URL without video ID', () => {
      const embedCode = provider.getEmbedCode('https://www.youtube.com/');
      
      expect(embedCode).toBeNull();
    });
    
    test('should handle YouTube URLs with additional parameters', () => {
      const embedCode = provider.getEmbedCode('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('youtube.com/embed/dQw4w9WgXcQ');
    });
    
    test('should return null for malformed URLs', () => {
      // This should throw inside the method but be caught and return null
      const embedCode = provider.getEmbedCode('not-a-url');
      
      expect(embedCode).toBeNull();
    });
  });
  
  test('should handle complete YouTube workflow', () => {
    // Integration test for the provider
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    const canHandle = provider.canHandle(url);
    const embedCode = provider.getEmbedCode(url);
    
    expect(canHandle).toBe(true);
    expect(embedCode).not.toBeNull();
    expect(embedCode).toContain('youtube.com/embed/dQw4w9WgXcQ');
    expect(embedCode).toMatch(/<iframe.*<\/iframe>/);
  });
});