export function cleanLinkedInUrl(url: string): string {
  return url.replace(/\?.*$/, '').replace(/\/$/, '').replace(/^https?:\/\//, '').replace(/^www\./, '');
} 
