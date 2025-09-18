
// This file is intentionally left with placeholder content.
// The actual base64 strings would be too large to include.
// For a real application, these would be very long strings representing images.
import type { Outfit } from './types';

// In a real app, these base64 strings would be very long.
// Using placeholders for brevity. You can generate real ones from any image.
const OUTFIT_PLACEHOLDERS = {
  LEATHER_JACKET: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  FLORAL_DRESS: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  BLUE_SUIT: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  RED_HOODIE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
};

// This is a simplified example. In a real app, you would have actual base64 encoded images.
// For demonstration, we'll use picsum.photos URLs and the user will have to imagine the base64 is real.
// This is a workaround to avoid giant base64 strings in the code. 
// The application logic will use these URLs directly for display.
// To make it fully functional, replace these with actual base64 strings.
export const PREDEFINED_OUTFITS: Outfit[] = [
  { name: 'Leather Jacket', base64: 'https://picsum.photos/id/103/500/500' },
  { name: 'Floral Dress', base64: 'https://picsum.photos/id/102/500/500' },
  { name: 'Blue Suit', base64: 'https://picsum.photos/id/106/500/500' },
  { name: 'Red Hoodie', base64: 'https://picsum.photos/id/107/500/500' },
];

export const LOADING_MESSAGES = [
  "Warming up the AI stylist...",
  "Sketching your new look...",
  "Tailoring the outfit to your pose...",
  "Adjusting the lighting and shadows...",
  "Applying the final photorealistic touches...",
  "Almost ready to reveal your transformation!",
];
