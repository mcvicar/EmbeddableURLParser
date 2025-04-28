// config/ConfigService.ts
export class GoogleConfigService {
    private static instance: GoogleConfigService;
    private config: Record<string, string> = {};
  
    private constructor() {
      // Initialize with environment variables or load from a secure config file
      this.config = {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
      };
    }
  
    public static getInstance(): GoogleConfigService {
      if (!GoogleConfigService.instance) {
        GoogleConfigService.instance = new GoogleConfigService();
      }
      return GoogleConfigService.instance;
    }
  
    public get(key: string): string {
      return this.config[key] || '';
    }
  
    // For testing purposes
    public set(key: string, value: string): void {
      this.config[key] = value;
    }
  }