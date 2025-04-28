import { GoogleMaps } from '../../providers/GoogleMaps';
import { GoogleConfigService } from '../../config/GoogleConfigService';

describe('GoogleMaps Provider', () => {
  let googleMaps: GoogleMaps;
  let mockConfigService: GoogleConfigService;
  
  beforeEach(() => {
    // Create a mock config service and set up the API key
    mockConfigService = GoogleConfigService.getInstance();
    mockConfigService.set('GOOGLE_MAPS_API_KEY', 'test-api-key');
    
    // Initialize the Google Maps provider with the mock config service
    googleMaps = new GoogleMaps(mockConfigService);
  });

  test('canHandle should return true for Google Maps URLs', () => {
    expect(googleMaps.canHandle('https://www.google.com/maps/@37.7749,-122.4194,12z')).toBe(true);
    expect(googleMaps.canHandle('https://google.com/maps/place/Empire+State+Building')).toBe(true);
    expect(googleMaps.canHandle('https://www.google.com/maps/dir/New+York/Los+Angeles')).toBe(true);
  });

  test('canHandle should return false for non-Google Maps URLs', () => {
    expect(googleMaps.canHandle('https://www.bing.com/maps?q=New+York')).toBe(false);
    expect(googleMaps.canHandle('https://maps.google.com')).toBe(false); // Edge case - no '/maps'
    expect(googleMaps.canHandle('https://www.google.com/search?q=maps')).toBe(false);
  });

  test('getEmbedCode should return valid embed code for coordinates-based URLs', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/@37.7749,-122.4194,12z');
    
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('width="600" height="450"');
    expect(embedCode).toContain('https://www.google.com/maps/embed/v1/view');
    expect(embedCode).toContain('key=test-api-key');
    expect(embedCode).toContain('center=37.7749,-122.4194');
    expect(embedCode).toContain('zoom=12');
  });

  test('getEmbedCode should handle decimal zoom levels', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/@40.7128,-74.0060,15.75z');
    
    expect(embedCode).toContain('zoom=15');
  });

  test('getEmbedCode should return valid embed code for place URLs', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/place/Empire+State+Building');
    
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('https://www.google.com/maps/embed/v1/place');
    expect(embedCode).toContain('key=test-api-key');
    expect(embedCode).toContain('q=Empire%20State%20Building');
  });

  test('getEmbedCode should handle URL-encoded place names', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/place/Times Square, New York');
    
    expect(embedCode).toContain('q=Times%20Square%2C%20New%20York');
  });

  test('getEmbedCode should return valid embed code for directions URLs', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/dir/New York/Los Angeles');
    
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('https://www.google.com/maps/embed/v1/directions');
    expect(embedCode).toContain('key=test-api-key');
    expect(embedCode).toContain('origin=New%20York');
    expect(embedCode).toContain('destination=Los%20Angeles');
  });

  test('getEmbedCode should not return generic directions embed when specific locations not parsed', () => {
    const embedCode = googleMaps.getEmbedCode('https://www.google.com/maps/dir/');
    
    expect(embedCode).toBeNull();
  });

  test('getEmbedCode should return null when API key is missing', () => {
    // Create a new instance with an empty API key
    mockConfigService.set('GOOGLE_MAPS_API_KEY', '');
    const noKeyGoogleMaps = new GoogleMaps(mockConfigService);
    
    expect(noKeyGoogleMaps.getEmbedCode('https://www.google.com/maps/@37.7749,-122.4194,12z')).toBeNull();
  });

  test('getEmbedCode should return null for invalid or unsupported Google Maps URLs', () => {
    expect(googleMaps.getEmbedCode('https://www.google.com/maps')).toBeNull();
    expect(googleMaps.getEmbedCode('https://www.google.com/maps/search/')).toBeNull();
  });
});