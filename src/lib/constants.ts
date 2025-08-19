import type { UserProfile, SavedLook, WardrobeItem } from './types';

// This will be the default for a new user profile.
export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  photoUrl: '',
  gender: 'female',
  age: '',
  skinTone: '',
  bodyType: '',
  stylePreferences: [],
  occasionTypes: [],
  budget: 'medium',
};

// Mock data is no longer needed.
export const SAVED_LOOKS_DATA: SavedLook[] = [];
export const WARDROBE_ITEMS_DATA: WardrobeItem[] = [];
