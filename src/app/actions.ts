'use server';
import { dailyOutfitSuggestion, DailyOutfitSuggestionInput, DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { eventStyling, EventStylingInput, EventStylingOutput } from '@/ai/flows/event-styling';
import { regenerateOutfit, RegenerateOutfitInput, RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { findProducts, FindProductsOutput, FindProductsInput } from '@/ai/flows/find-products';
import { getAccessoryTips, AccessoryTipsInput, AccessoryTipsOutput } from '@/ai/flows/accessory-tips';
import { UserProfile, Product, SavedLook, WardrobeItem } from '@/lib/types';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';
import { getUserProfile, saveUserProfile, getSavedLooks, getWardrobeItems, saveLook, saveWardrobeItem } from '@/services/firestore';

type ActionResponse<T> = (T & { error?: never }) | { error: string };

async function getProfile(): Promise<UserProfile> {
  const profile = await getUserProfile();
  return profile || DEFAULT_USER_PROFILE;
}

export async function getDailyOutfit(): Promise<ActionResponse<DailyOutfitSuggestionOutput>> {
  const userProfile = await getProfile();
  const wardrobeItems = await getWardrobeItems();
  const input: DailyOutfitSuggestionInput = {
    ...userProfile,
    age: userProfile.age || 25,
    weather: 'Sunny, 25°C', 
    trendingStyles: ['oversized blazers', 'wide-leg trousers'],
    wardrobeItems,
  };
  try {
    const result = await dailyOutfitSuggestion(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate daily outfit suggestion.' };
  }
}

export async function getEventOutfit(data: Omit<EventStylingInput, keyof UserProfile | 'wardrobeItems'>): Promise<ActionResponse<EventStylingOutput>> {
   const userProfile = await getProfile();
   const wardrobeItems = await getWardrobeItems();
   const input: EventStylingInput = {
    ...userProfile,
    age: userProfile.age || 25,
    ...data,
    wardrobeItems,
  };
  try {
    const result = await eventStyling(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate event outfit.' };
  }
}

export async function getRegeneratedOutfit(userInput: string): Promise<ActionResponse<RegenerateOutfitOutput>> {
  const input: RegenerateOutfitInput = { userInput };
  try {
    const result = await regenerateOutfit(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to regenerate outfit.' };
  }
}

export async function getProductsForOutfit(data: {items: string[], gender: UserProfile['gender']}): Promise<ActionResponse<FindProductsOutput>> {
  try {
    const input: FindProductsInput = { items: data.items, gender: data.gender };
    const result = await findProducts(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to find products for outfit.' };
  }
}

export async function fetchAccessoryTips(data: AccessoryTipsInput): Promise<ActionResponse<AccessoryTipsOutput>> {
  try {
    const result = await getAccessoryTips(data);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch accessory tips.' };
  }
}

export async function saveUserProfileData(profile: UserProfile): Promise<ActionResponse<{}>> {
  try {
    await saveUserProfile(profile);
    return {};
  } catch (error) {
    console.error(error);
    return { error: 'Failed to save user profile.' };
  }
}

export async function fetchUserProfile(): Promise<ActionResponse<UserProfile>> {
  try {
    const profile = await getUserProfile();
    return profile || DEFAULT_USER_PROFILE;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch user profile.' };
  }
}

export async function fetchSavedLooks(): Promise<ActionResponse<{looks: SavedLook[]}>> {
  try {
    const looks = await getSavedLooks();
    return { looks };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch saved looks.' };
  }
}

export async function saveGeneratedLook(look: Omit<SavedLook, 'id'>): Promise<ActionResponse<{lookId: string}>> {
    try {
        const lookId = await saveLook(look);
        return { lookId };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to save look.' };
    }
}

export async function fetchWardrobeItems(): Promise<ActionResponse<{items: WardrobeItem[]}>> {
  try {
    const items = await getWardrobeItems();
    return { items };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch wardrobe items.' };
  }
}

export async function addWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<ActionResponse<{itemId: string}>> {
  try {
    const itemId = await saveWardrobeItem(item);
    return { itemId };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to add wardrobe item.' };
  }
}
