// @ts-nocheck
'use server';
import { dailyOutfitSuggestion, DailyOutfitSuggestionInput, DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { eventStyling, EventStylingInput, EventStylingOutput } from '@/ai/flows/event-styling';
import { regenerateOutfit, RegenerateOutfitInput, RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { UserProfile } from '@/lib/types';
import { MOCK_USER_PROFILE } from '@/lib/constants';

type ActionResponse<T> = (T & { error?: never }) | { error: string };

export async function getDailyOutfit(): Promise<ActionResponse<DailyOutfitSuggestionOutput>> {
  const input: DailyOutfitSuggestionInput = {
    ...MOCK_USER_PROFILE,
    weather: 'Sunny, 25°C', 
    trendingStyles: ['oversized blazers', 'wide-leg trousers'],
  };
  try {
    const result = await dailyOutfitSuggestion(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate daily outfit suggestion.' };
  }
}

export async function getEventOutfit(data: Omit<EventStylingInput, keyof UserProfile>): Promise<ActionResponse<EventStylingOutput>> {
   const input: EventStylingInput = {
    ...MOCK_USER_PROFILE,
    ...data,
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
