// Gallery image limit configuration for event creation.
// Update MAX_GALLERY_IMAGES to change the enforced limit across the UI.

export const MAX_GALLERY_IMAGES = 5;

export function getGalleryLimitMessage(): string {
  return `You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`;
}

export function isGalleryFull(currentCount: number): boolean {
  return currentCount >= MAX_GALLERY_IMAGES;
}

export function getRemainingSlots(currentCount: number): number {
  return Math.max(0, MAX_GALLERY_IMAGES - currentCount);
}