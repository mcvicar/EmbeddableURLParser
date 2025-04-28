import { Instagram } from '../../providers/Instagram';

describe('Instagram', () => {
  let provider: Instagram;
  
  beforeEach(() => {
    provider = new Instagram();
  });
  
  test('canHandle should return true for Instagram post URLs', () => {
    expect(provider.canHandle('https://www.instagram.com/p/ABC123/')).toBe(true);
    expect(provider.canHandle('https://instagram.com/p/ABC123/')).toBe(true);
    expect(provider.canHandle('https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link')).toBe(true);
  });

  test('canHandle should return true for Instagram reel URLs', () => {
    expect(provider.canHandle('https://www.instagram.com/reel/ABC123/')).toBe(true);
    expect(provider.canHandle('https://instagram.com/reel/ABC123/?igshid=12345')).toBe(true);
  });

  test('canHandle should return false for non-Instagram URLs', () => {
    expect(provider.canHandle('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
    expect(provider.canHandle('https://www.instagram.com/username/')).toBe(false);
    expect(provider.canHandle('https://www.instagram.com/stories/username/12345/')).toBe(false);
  });

  test('getEmbedCode should return valid embed code for post URLs', () => {
    const embedCode = provider.getEmbedCode('https://www.instagram.com/p/ABC123/');
    expect(embedCode).toContain('blockquote class="instagram-media"');
    expect(embedCode).toContain('https://www.instagram.com/p/ABC123/');
    expect(embedCode).toContain('www.instagram.com/embed.js');
  });

  test('getEmbedCode should return valid embed code for reel URLs', () => {
    const embedCode = provider.getEmbedCode('https://www.instagram.com/reel/XYZ789/');
    expect(embedCode).toContain('blockquote class="instagram-media"');
    expect(embedCode).toContain('https://www.instagram.com/p/XYZ789/');
    expect(embedCode).toContain('www.instagram.com/embed.js');
  });

  test('getEmbedCode should return null for invalid URLs', () => {
    expect(provider.getEmbedCode('https://www.instagram.com/username/')).toBeNull();
  });
});