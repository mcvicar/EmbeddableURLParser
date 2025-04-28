import { EmbeddableURLParser } from '../EmbeddableURLParser';
import { Provider } from '../providers/Provider';

// Mock provider for testing
class MockProvider implements Provider {
  name = 'Mock';
  canHandleCalled = false;
  getEmbedCodeCalled = false;
  shouldHandle = true;
  returnEmbed = null;
  
  canHandle(url: string): boolean {
    this.canHandleCalled = true;
    return this.shouldHandle;
  }
  
  getEmbedCode(url: string): string | null {
    this.getEmbedCodeCalled = true;
    return this.returnEmbed;
  }
}

describe('EmbeddableURLParser', () => {
  let parser: EmbeddableURLParser;
  let mockProvider: MockProvider;
  
  beforeEach(() => {
    parser = new EmbeddableURLParser();
    mockProvider = new MockProvider();
    // Register our mock provider for testing
    parser['providers'].set(mockProvider.name, mockProvider);
  });
  
  test('should initialize with default providers', () => {
    const freshParser = new EmbeddableURLParser();

    // Check if default providers are registered
    expect(freshParser['providers'].size).toBeGreaterThan(0);
    expect(freshParser['providers'].has('YouTube')).toBe(true);
    expect(freshParser['providers'].has('Instagram')).toBe(true);
    expect(freshParser['providers'].has('TikTok')).toBe(true);
    expect(freshParser['providers'].has('GoogleMaps')).toBe(true);
    expect(freshParser['providers'].has('BingMaps')).toBe(true);
    expect(freshParser['providers'].has('Spotify')).toBe(true);
    expect(freshParser['providers'].has('OpenStreetMap')).toBe(true);
    expect(freshParser['providers'].has('SoundCloud')).toBe(true);
    expect(freshParser['providers'].has('Bluesky')).toBe(true);
    expect(freshParser['providers'].has('AppleMaps')).toBe(false);
    expect(freshParser['providers'].has('YouFaceTube')).toBe(false);
  });
  
  test('should register a new provider', () => {
    const customProvider = new MockProvider();
    customProvider.name = 'Custom';
    parser.registerProvider(customProvider);
    
    expect(parser['providers'].has('Custom')).toBe(true);
    expect(parser['providers'].get('Custom')).toBe(customProvider);
  });
  
  test('should return unknown result for empty URL', () => {
    const result = parser.parseURL('');
    
    expect(result).toEqual({
      embeddable: null,
      sitename: 'Unknown',
      url: ''
    });
  });
  
  test('should call provider methods when parsing URL', () => {
    const result = parser.parseURL('https://example.com');
    
    expect(mockProvider.canHandleCalled).toBe(true);
    expect(mockProvider.getEmbedCodeCalled).toBe(true);
    expect(result).toEqual({
      embeddable: null,
      sitename: 'Mock',
      url: 'https://example.com'
    });
  });
  
  test('should return null embeddable when provider returns null', () => {
    mockProvider.returnEmbed = null;
    
    const result = parser.parseURL('https://example.com/null');
    
    expect(result).toEqual({
      embeddable: null,
      sitename: 'Mock',
      url: 'https://example.com/null'
    });
  });
  
  test('should try next provider if current provider throws an error', () => {
    const errorProvider = new MockProvider();
    errorProvider.name = 'ErrorProvider';
    errorProvider.canHandle = () => { throw new Error('Test error'); };
    
    parser['providers'].set(errorProvider.name, errorProvider);
    
    // The order is not guaranteed in a Map, but our mock provider should still be called
    const result = parser.parseURL('https://example.com');
    
    expect(mockProvider.canHandleCalled).toBe(true);
    expect(result.sitename).not.toBe('Unknown');
  });
  
  test('should return unknown if no provider can handle the URL', () => {
    mockProvider.shouldHandle = false;
    
    const result = parser.parseURL('https://unknown-site.com');
    
    expect(result).toEqual({
      embeddable: null,
      sitename: 'Unknown',
      url: 'https://unknown-site.com'
    });
  });
  
  test('should work with real-world examples', () => {
    // This test depends on the actual implementations of providers
    const freshParser = new EmbeddableURLParser();
    
    const youtubeResult = freshParser.parseURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(youtubeResult.sitename).toBe('YouTube');
    expect(youtubeResult.embeddable).toContain('youtube.com/embed/dQw4w9WgXcQ');
    
    const spotifyResult = freshParser.parseURL('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT');
    expect(spotifyResult.sitename).toBe('Spotify');
    expect(spotifyResult.embeddable).toContain('spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT');
  });
});