'use server';

/**
 * @fileOverview A daily outfit suggestion AI agent.
 *
 * - dailyOutfitSuggestion - A function that suggests a daily outfit.
 * - DailyOutfitSuggestionInput - The input type for the dailyOutfitSuggestion function.
 * - DailyOutfitSuggestionOutput - The return type for the dailyOutfitSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { WardrobeItem } from '@/lib/types';

const DailyOutfitSuggestionInputSchema = z.object({
  gender: z.string().describe('The gender of the user.'),
  age: z.number().describe('The age of the user.'),
  skinTone: z.string().describe('The skin tone of the user.'),
  bodyType: z.string().describe('The body type of the user.'),
  stylePreferences: z.array(z.string()).describe('The style preferences of the user.'),
  occasionTypes: z.array(z.string()).describe('The occasion types the user dresses for.'),
  budget: z.string().describe('The budget range of the user.'),
  weather: z.string().describe('The current weather conditions.'),
  trendingStyles: z.array(z.string()).describe('The current trending styles.'),
  wardrobeItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    imageUrl: z.string(),
  })).describe('A list of items currently in the user\'s wardrobe.'),
});
export type DailyOutfitSuggestionInput = z.infer<typeof DailyOutfitSuggestionInputSchema>;

const DailyOutfitSuggestionOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A title for the suggested outfit.'),
  outfitImage: z.string().describe('An image of the suggested outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
});
export type DailyOutfitSuggestionOutput = z.infer<typeof DailyOutfitSuggestionOutputSchema>;

export async function dailyOutfitSuggestion(input: DailyOutfitSuggestionInput): Promise<DailyOutfitSuggestionOutput> {
  return dailyOutfitSuggestionFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'dailyOutfitTextPrompt',
  input: {schema: DailyOutfitSuggestionInputSchema},
  output: {schema: z.object({
      outfitSuggestion: z.string().describe('A title for the suggested outfit.'),
      itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
      colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  })},
  prompt: `You are a personal stylist. Suggest a complete outfit based on the following information:

User Profile:
- Gender: {{{gender}}}
- Age: {{{age}}}
- Skin Tone: {{{skinTone}}}
- Body Type: {{{bodyType}}}
- Style Preferences: {{#each stylePreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Occasion Types: {{#each occasionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Budget: {{{budget}}}

Current Conditions:
- Weather: {{{weather}}}
- Trending Styles: {{#each trendingStyles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

User's Wardrobe:
{{#if wardrobeItems}}
  You should prioritize using items from the user's existing wardrobe:
  {{#each wardrobeItems}}
  - {{name}} ({{category}})
  {{/each}}
{{else}}
  The user has not added any items to their wardrobe.
{{/if}}

Instructions:
1.  Suggest a complete outfit, including clothing items and colors.
2.  Prioritize using items from the user's wardrobe if available.
3.  Provide a creative title for the outfit.
`, 
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const dailyOutfitSuggestionFlow = ai.defineFlow(
  {
    name: 'dailyOutfitSuggestionFlow',
    inputSchema: DailyOutfitSuggestionInputSchema,
    outputSchema: DailyOutfitSuggestionOutputSchema,
  },
  async input => {
    const {output: textOutput} = await textGenerationPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate outfit text');
    }

    const imageResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an image of an outfit based on these items: ${textOutput.itemsList.join(', ')}. The style should be: ${input.stylePreferences.join(', ')}.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const outfitImage = imageResponse.media?.url ?? '';

    return {
      ...textOutput,
      outfitImage,
    };
  }
);
