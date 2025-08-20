
'use server';
import { dailyOutfitSuggestion, DailyOutfitSuggestionInput, DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { eventStyling, EventStylingInput, EventStylingOutput } from '@/ai/flows/event-styling';
import { regenerateOutfit, RegenerateOutfitInput, RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { findProducts, FindProductsOutput, FindProductsInput } from '@/ai/flows/find-products';
import { getAccessoryTips, AccessoryTipsInput, AccessoryTipsOutput } from '@/ai/flows/accessory-tips';
import { styleBot, StyleBotInput, StyleBotOutput } from '@/ai/flows/style-bot';
import { getFashionFact, FashionFactInput, FashionFactOutput } from '@/ai/flows/fashion-fact';
import { generateVisualDesign as generateVisualDesignFlow, VisualDesignerInput, VisualDesignerOutput } from '@/ai/flows/visual-designer';
import { UserProfile, StyleQuizInput } from '@/lib/types';
import { styleQuiz, StyleQuizOutput } from '@/ai/flows/style-quiz-flow';


type ActionResponse<T> = (T & { error?: never }) | { error: string };

// NOTE: All functions that interact with localStorage have been moved to the client side.
// This file should only contain server-side actions that call AI flows.

export async function getDailyOutfit(input: DailyOutfitSuggestionInput): Promise<ActionResponse<DailyOutfitSuggestionOutput>> {
  try {
    const result = await dailyOutfitSuggestion(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate daily outfit suggestion.' };
  }
}

export async function getEventOutfit(input: EventStylingInput): Promise<ActionResponse<EventStylingOutput>> {
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

export async function getStyleBotResponse(data: StyleBotInput): Promise<ActionResponse<StyleBotOutput>> {
  try {
    const result = await styleBot(data);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get response from Style Bot.' };
  }
}

export async function fetchFashionFact(date: string): Promise<ActionResponse<FashionFactOutput>> {
    try {
        const result = await getFashionFact({ date });
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to fetch fashion fact.' };
    }
}

export async function generateVisualDesign(input: VisualDesignerInput): Promise<ActionResponse<VisualDesignerOutput>> {
    try {
        const result = await generateVisualDesignFlow(input);
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate visual design.' };
    }
}

export async function getStyleQuizOutfit(input: StyleQuizInput): Promise<ActionResponse<StyleQuizOutput>> {
  try {
    const result = await styleQuiz(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate outfit from quiz.' };
  }
}
