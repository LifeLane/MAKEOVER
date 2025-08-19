'use server';

import { UserProfile, SavedLook, WardrobeItem } from '@/lib/types';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';

// In-memory data store to replace Firestore
let userProfile: UserProfile | null = { ...DEFAULT_USER_PROFILE };
const savedLooks: SavedLook[] = [];
const wardrobeItems: WardrobeItem[] = [];
let lookIdCounter = 1;
let wardrobeIdCounter = 1;


export async function saveUserProfile(profile: UserProfile): Promise<void> {
  userProfile = { ...profile };
  // No return needed for mock
}

export async function getUserProfile(): Promise<UserProfile | null> {
  return userProfile;
}

export async function saveLook(look: Omit<SavedLook, 'id'>): Promise<string> {
    const newLook: SavedLook = {
        ...look,
        id: `look-${lookIdCounter++}`,
    };
    savedLooks.push(newLook);
    return newLook.id;
}

export async function getSavedLooks(): Promise<SavedLook[]> {
    return [...savedLooks];
}

export async function saveWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<string> {
    const newItem: WardrobeItem = {
        ...item,
        id: `item-${wardrobeIdCounter++}`,
    };
    wardrobeItems.push(newItem);
    return newItem.id;
}

export async function getWardrobeItems(): Promise<WardrobeItem[]> {
    return [...wardrobeItems];
}
