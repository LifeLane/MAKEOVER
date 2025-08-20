
import { z } from 'zod';

export type UserProfile = {
  name: string;
  photoUrl: string;
  gender: 'male' | 'female' | 'other' | '';
  age: number | string;
  skinTone: string;
  bodyType: string;
  stylePreferences: string[];
  occasionTypes: string[];
  budget: 'low' | 'medium' | 'high' | '';
};

export type SavedLook = {
  id: string;
  imageUrl: string;
  outfitSuggestion: string;
  itemsList: string[];
  colorPalette: string[];
  accessoryTips: string;
  occasion: string;
};

export type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

export type Product = {
  name: string;
  price: string;
  url: string;
  imageUrl: string;
};

export type Outfit = {
    outfitSuggestion: string;
    itemsList: string[];
    colorPalette: string[];
    outfitImage?: string;
    imageUrl?: string;
    accessoryTips?: string;
}

export const StyleBotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the bot.'),
  history: z.array(z.object({
    user: z.string(),
    bot: z.string(),
  })).describe('The conversation history.'),
});
export type StyleBotInput = z.infer<typeof StyleBotInputSchema>;

export const StyleQuizInputSchema = z.object({
  gender: z.string().min(1, 'Please select a gender.'),
  age: z.string().min(1, 'Please select an age group.'),
  bodyType: z.string().min(1, 'Please select a body type.'),
  skinTone: z.string().min(1, 'Please select a skin tone.'),
  occasion: z.string().min(1, 'Please select an occasion.'),
  stylePreferences: z.array(z.string()).min(1, 'Please select at least one style.'),
  colorPreferences: z.array(z.string()).min(1, 'Please select at least one color preference.'),
});
export type StyleQuizInput = z.infer<typeof StyleQuizInputSchema>;
