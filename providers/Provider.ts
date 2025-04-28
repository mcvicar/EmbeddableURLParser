
// Providers/Provider.ts
export interface Provider {
    name: string;
    canHandle(url: string): boolean;
    getEmbedCode(url: string): string | null;
}