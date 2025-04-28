import { Spotify } from '../../providers/Spotify';

describe('Spotify', () => {
  let provider: Spotify;
  
  beforeEach(() => {
    provider = new Spotify();
  });

  test('canHandle should return true for Spotify track URLs', () => {
    expect(provider.canHandle('https://open.spotify.com/track/1234567890')).toBe(true);
    expect(provider.canHandle('https://open.spotify.com/track/1234567890?si=abcdef')).toBe(true);
  });

  test('canHandle should return true for Spotify album URLs', () => {
    expect(provider.canHandle('https://open.spotify.com/album/1234567890')).toBe(true);
  });

  test('canHandle should return true for Spotify playlist URLs', () => {
    expect(provider.canHandle('https://open.spotify.com/playlist/1234567890')).toBe(true);
  });

  test('canHandle should return false for non-Spotify URLs', () => {
    expect(provider.canHandle('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
    expect(provider.canHandle('https://spotify.com')).toBe(false);
  });

  test('getEmbedCode should return valid embed code for track URLs', () => {
    const embedCode = provider.getEmbedCode('https://open.spotify.com/track/1234567890');
    expect(embedCode).toContain('iframe');
    expect(embedCode).toContain('https://open.spotify.com/embed/track/1234567890');
  });

  test('getEmbedCode should return valid embed code for album URLs', () => {
    const embedCode = provider.getEmbedCode('https://open.spotify.com/album/1234567890');
    expect(embedCode).toContain('iframe');
    expect(embedCode).toContain('https://open.spotify.com/embed/album/1234567890');
  });

  test('getEmbedCode should return valid embed code for playlist URLs', () => {
    const embedCode = provider.getEmbedCode('https://open.spotify.com/playlist/1234567890');
    expect(embedCode).toContain('iframe');
    expect(embedCode).toContain('https://open.spotify.com/embed/playlist/1234567890');
  });

  test('getEmbedCode should return null for invalid URLs', () => {
    expect(provider.getEmbedCode('https://open.spotify.com/musician/1234567890')).toBeNull();
  });
});