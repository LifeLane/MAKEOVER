import type { UserProfile, SavedLook, WardrobeItem } from './types';

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Alex Doe',
  photoUrl: 'https://placehold.co/100x100.png',
  gender: 'female',
  age: 28,
  skinTone: 'fair',
  bodyType: 'athletic',
  stylePreferences: ['bohemian', 'casual'],
  occasionTypes: ['work', 'party', 'travel'],
  budget: 'medium',
};

export const SAVED_LOOKS_DATA: SavedLook[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/400x600.png',
    outfitSuggestion: 'A chic summer outfit for a casual day out.',
    itemsList: ['Floral Sundress', 'White Sneakers', 'Denim Jacket'],
    colorPalette: ['#f2d5c3', '#ffffff', '#6b8aab'],
    accessoryTips: 'Pair with a simple gold necklace and a canvas tote bag.',
    occasion: 'Casual Outing',
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/400x600.png',
    outfitSuggestion: 'A professional and stylish look for a business meeting.',
    itemsList: ['Navy Blue Blazer', 'White Silk Blouse', 'Tailored Trousers'],
    colorPalette: ['#2c3e50', '#ecf0f1', '#34495e'],
    accessoryTips: 'A leather briefcase and classic watch complete this look.',
    occasion: 'Business Meeting',
  },
];

export const WARDROBE_ITEMS_DATA: WardrobeItem[] = [
  { id: '1', name: 'Blue Denim Jeans', category: 'Bottoms', imageUrl: 'https://placehold.co/300x400.png' },
  { id: '2', name: 'Classic White Tee', category: 'Tops', imageUrl: 'https://placehold.co/300x400.png' },
  { id: '3', name: 'Black Leather Jacket', category: 'Outerwear', imageUrl: 'https://placehold.co/300x400.png' },
  { id: '4', name: 'Summer Floral Dress', category: 'Dresses', imageUrl: 'https://placehold.co/300x400.png' },
];
