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
