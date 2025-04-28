import { BingMaps } from '../../providers//BingMaps';

describe('BingMaps Provider', () => {
  const bingMaps = new BingMaps();
  
  test('canHandle should return true for Bing Maps URLs', () => {
    expect(bingMaps.canHandle('https://www.bing.com/maps?q=New+York')).toBe(true);
    expect(bingMaps.canHandle('https://bing.com/maps/default.aspx?cp=40.7128~-74.0060')).toBe(true);
    expect(bingMaps.canHandle('https://www.bing.com/maps?cp=47.6062~-122.3321&lvl=14')).toBe(true);
  });

  test('canHandle should return false for non-Bing Maps URLs', () => {
    expect(bingMaps.canHandle('https://www.google.com/maps?q=New+York')).toBe(false);
    expect(bingMaps.canHandle('https://bing.com/search?q=maps')).toBe(false);
    expect(bingMaps.canHandle('https://www.openstreetmap.org/#map=15/51.5074/-0.1278')).toBe(false);
  });

  test('getEmbedCode should return valid embed code for coordinates-based URLs', () => {
    const embedCode = bingMaps.getEmbedCode('https://www.bing.com/maps?cp=47.6062~-122.3321&lvl=14');
    
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('width="600" height="450"');
    expect(embedCode).toContain('https://www.bing.com/maps/embed');
    expect(embedCode).toContain('cp=47.6062~-122.3321');
    expect(embedCode).toContain('lvl=14');
  });

  test('getEmbedCode should use default zoom level when not specified', () => {
    const embedCode = bingMaps.getEmbedCode('https://www.bing.com/maps?cp=51.5074~-0.1278');
    
    expect(embedCode).toContain('lvl=12');
    expect(embedCode).toContain('cp=51.5074~-0.1278');
  });

  test('getEmbedCode should return valid embed code for query-based URLs', () => {
    const embedCode = bingMaps.getEmbedCode('https://www.bing.com/maps?q=Empire+State+Building');
    
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('https://www.bing.com/maps/embed');
    expect(embedCode).toContain('q=Empire%20State%20Building');
  });

  test('getEmbedCode should handle URL-encoded query parameters correctly', () => {
    const embedCode = bingMaps.getEmbedCode('https://www.bing.com/maps?q=Times+Square%2C+New+York');
    
    expect(embedCode).toContain('q=Times%20Square%2C%20New%20York');
  });

  test('getEmbedCode should return null for invalid or unsupported Bing Maps URLs', () => {
    expect(bingMaps.getEmbedCode('https://www.bing.com/maps')).toBeNull();
    expect(bingMaps.getEmbedCode('https://www.bing.com/maps/default.aspx')).toBeNull();
  });

  test('getEmbedCode should include type and style parameters when coordinates are present', () => {
    const embedCode = bingMaps.getEmbedCode('https://www.bing.com/maps?cp=40.7128~-74.0060&lvl=15');
    
    expect(embedCode).toContain('typ=d&sty=r');
  });
});