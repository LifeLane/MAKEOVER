// This file is machine-generated - edit with care!

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
});
export type DailyOutfitSuggestionInput = z.infer<typeof DailyOutfitSuggestionInputSchema>;

const DailyOutfitSuggestionOutputSchema = z.object({
  outfitImage: z.string().describe('An image of the suggested outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  accessoryTips: z.string().describe('Accessory tips for the outfit.'),
});
export type DailyOutfitSuggestionOutput = z.infer<typeof DailyOutfitSuggestionOutputSchema>;

export async function dailyOutfitSuggestion(input: DailyOutfitSuggestionInput): Promise<DailyOutfitSuggestionOutput> {
  return dailyOutfitSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyOutfitSuggestionPrompt',
  input: {schema: DailyOutfitSuggestionInputSchema},
  output: {schema: DailyOutfitSuggestionOutputSchema},
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

Instructions:
1.  Suggest a complete outfit, including clothing items, colors, and accessories.
2.  Provide accessory tips for the outfit.
3.  Create an image of the suggested outfit.

Output the outfit image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.`, // eslint-disable-line
  // Gemini safety filters can be configured here.
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
    const {output} = await prompt(input);

    // Generate the outfit image using the googleai/gemini-2.0-flash-preview-image-generation model.
    const imageResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an image of an outfit based on these items: ${output?.itemsList?.join(', ')}`, // eslint-disable-line
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (imageResponse.media?.url) {
      output!.outfitImage = imageResponse.media.url;
    }

    return output!;
  }
);
