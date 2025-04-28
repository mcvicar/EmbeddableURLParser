// tests/providers/OpenStreetMapProvider.test.ts
import { OpenStreetMap } from '../../providers/OpenStreetMap';

describe('OpenStreetMapProvider', () => {
  let provider: OpenStreetMap;
  
  beforeEach(() => {
    provider = new OpenStreetMap();
  });
  
  test('should have the correct name', () => {
    expect(provider.name).toBe('OpenStreetMap');
  });
  
  describe('canHandle', () => {
    test('should return true for openstreetmap.org URLs', () => {
      expect(provider.canHandle('https://www.openstreetmap.org/#map=15/51.5074/-0.1278')).toBe(true);
      expect(provider.canHandle('http://openstreetmap.org/#map=10/48.8566/2.3522')).toBe(true);
    });
    
    test('should return false for non-OpenStreetMap URLs', () => {
      expect(provider.canHandle('https://example.com')).toBe(false);
      expect(provider.canHandle('https://maps.google.com')).toBe(false);
    });
  });
  
  describe('getEmbedCode', () => {
    test('should extract coordinates from OpenStreetMap URL', () => {
      const embedCode = provider.getEmbedCode('https://www.openstreetmap.org/#map=15/51.5074/-0.1278');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('openstreetmap.org/export/embed.html');
      expect(embedCode).toContain('marker=51.5074,-0.1278');
      expect(embedCode).toContain('iframe');
    });
    
    test('should handle different zoom levels', () => {
      const embedCode = provider.getEmbedCode('https://www.openstreetmap.org/#map=10/48.8566/2.3522');
      
      expect(embedCode).not.toBeNull();
      expect(embedCode).toContain('marker=48.8566,2.3522');
    });
    
    test('should return null for OpenStreetMap URL without map coordinates', () => {
      const embedCode = provider.getEmbedCode('https://www.openstreetmap.org/');
      
      expect(embedCode).toBeNull();
    });
    
    test('should return null for malformed URLs', () => {
      const embedCode = provider.getEmbedCode('not-a-url');
      
      expect(embedCode).toBeNull();
    });
  });
  
  test('should handle complete OpenStreetMap workflow', () => {
    // Integration test for the provider
    const url = 'https://www.openstreetmap.org/#map=15/51.5074/-0.1278';
    
    const canHandle = provider.canHandle(url);
    const embedCode = provider.getEmbedCode(url);
    
    expect(canHandle).toBe(true);
    expect(embedCode).not.toBeNull();
    expect(embedCode).toContain('openstreetmap.org/export/embed.html');
    expect(embedCode).toMatch(/<iframe.*/);
  });
});