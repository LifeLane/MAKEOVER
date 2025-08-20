
'use client';

import { UserProfile, SavedLook, WardrobeItem } from '@/lib/types';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';

// Helper to safely access localStorage
const safeLocalStorageGet = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

const safeLocalStorageSet = (key: string, value: any) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
};


// --- User Profile ---
export function saveUserProfile(profile: UserProfile): void {
  safeLocalStorageSet('userProfile', profile);
}

export function getUserProfile(): UserProfile {
  return safeLocalStorageGet('userProfile', DEFAULT_USER_PROFILE);
}


// --- Saved Looks ---
export function saveLook(look: Omit<SavedLook, 'id'>): string {
  const looks = getSavedLooks();
  const newLook: SavedLook = {
    ...look,
    id: `look-${new Date().getTime()}`,
  };
  looks.unshift(newLook); // Add to the beginning
  safeLocalStorageSet('savedLooks', looks);
  return newLook.id;
}

export function getSavedLooks(): SavedLook[] {
  return safeLocalStorageGet('savedLooks', []);
}


// --- Wardrobe Items ---
export function saveWardrobeItem(item: Omit<WardrobeItem, 'id'>): string {
    const items = getWardrobeItems();
    const newItem: WardrobeItem = {
        ...item,
        id: `item-${new Date().getTime()}`,
    };
    items.push(newItem);
    safeLocalStorageSet('wardrobeItems', items);
    return newItem.id;
}

export function getWardrobeItems(): WardrobeItem[] {
    return safeLocalStorageGet('wardrobeItems', []);
}
