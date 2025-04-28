import { TikTok } from '../../providers/TikTok';

describe('TikTok', () => {
  let provider: TikTok;
  
  beforeEach(() => {
    provider = new TikTok();
  });

  test('canHandle should return true for TikTok video URLs', () => {
    expect(provider.canHandle('https://www.tiktok.com/@username/video/1234567890')).toBe(true);
    expect(provider.canHandle('https://tiktok.com/@username/video/1234567890')).toBe(true);
    expect(provider.canHandle('https://www.tiktok.com/@username/video/1234567890?is_copy_url=1')).toBe(true);
    expect(provider.canHandle('https://vm.tiktok.com/ABCDEF/')).toBe(true);
  });

  test('canHandle should return false for non-TikTok URLs', () => {
    expect(provider.canHandle('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
    expect(provider.canHandle('https://www.ticfacetok.com/😱username')).toBe(false);
  });

  test('getEmbedCode should return valid embed code for video URLs', () => {
    const embedCode = provider.getEmbedCode('https://www.tiktok.com/@username/video/1234567890');
    expect(embedCode).toContain('blockquote class="tiktok-embed"');
    expect(embedCode).toContain('data-video-id="1234567890"');
    expect(embedCode).toContain('src="https://www.tiktok.com/embed.js"');
  });

  test('getEmbedCode should not handle shortened URLs', () => {
    const embedCode = provider.getEmbedCode('https://vm.tiktok.com/ABCDEF/');
    expect(embedCode).toBeNull();
  });

  test('getEmbedCode should return null for invalid URLs', () => {
    expect(provider.getEmbedCode('https://www.tiktok.com/!@username')).toBeNull();
  });
});