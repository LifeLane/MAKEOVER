'use server';

/**
 * @fileOverview Implements the outfit regeneration flow, allowing users to generate alternative outfit options based on their input prompts.
 *
 * - regenerateOutfit - A function that handles the outfit regeneration process.
 * - RegenerateOutfitInput - The input type for the regenerateOutfit function.
 * - RegenerateOutfitOutput - The return type for the regenerateOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateOutfitInputSchema = z.object({
  userInput: z.string().describe('User defined input prompt for outfit regeneration.'),
});
export type RegenerateOutfitInput = z.infer<typeof RegenerateOutfitInputSchema>;

const RegenerateOutfitOutputSchema = z.object({
  outfitSuggestion: z.string().describe('AI-generated outfit suggestion based on the user input.'),
  outfitImage: z.string().describe('AI-generated image of the suggested outfit, as a data URI.'),
});
export type RegenerateOutfitOutput = z.infer<typeof RegenerateOutfitOutputSchema>;

export async function regenerateOutfit(input: RegenerateOutfitInput): Promise<RegenerateOutfitOutput> {
  return regenerateOutfitFlow(input);
}

const regenerateOutfitPrompt = ai.definePrompt({
  name: 'regenerateOutfitPrompt',
  input: {schema: RegenerateOutfitInputSchema},
  output: {schema: RegenerateOutfitOutputSchema},
  prompt: `You are a personal stylist. Based on the user's input, generate an outfit suggestion and an image of the outfit.

User Input: {{{userInput}}}

Outfit Suggestion:
{{output outfitSuggestion}}

Outfit Image:
{{output outfitImage media=true}}`,
  
});

const regenerateOutfitFlow = ai.defineFlow(
  {
    name: 'regenerateOutfitFlow',
    inputSchema: RegenerateOutfitInputSchema,
    outputSchema: RegenerateOutfitOutputSchema,
  },
  async input => {
    const {output} = await regenerateOutfitPrompt(input);

    const imageResult = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: output!.outfitSuggestion,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      outfitSuggestion: output!.outfitSuggestion,
      outfitImage: imageResult.media?.url || '',
    };
  }
);
