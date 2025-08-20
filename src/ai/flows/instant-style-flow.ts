
'use server';
/**
 * @fileOverview A flow for generating an outfit from a user's photo.
 *
 * - instantStyle - Generates an outfit based on a user's image.
 * - InstantStyleInput - The input type for the flow.
 * - InstantStyleOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InstantStyleInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the user as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  userProfile: z.object({
    stylePreferences: z.array(z.string()).optional(),
    budget: z.string().optional(),
  }).describe("The user's general style profile."),
});
export type InstantStyleInput = z.infer<typeof InstantStyleInputSchema>;

const InstantStyleOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A creative title for the suggested outfit.'),
  itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  imageUrl: z.string().describe('URL of an image of the generated outfit.'),
});
export type InstantStyleOutput = z.infer<typeof InstantStyleOutputSchema>;

export async function instantStyle(input: InstantStyleInput): Promise<InstantStyleOutput> {
  return instantStyleFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
    name: 'instantStyleTextPrompt',
    input: { schema: InstantStyleInputSchema },
    output: { schema: z.object({
        outfitSuggestion: z.string().describe('A creative title for the suggested outfit.'),
        itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
        colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
    })},
    prompt: `You are a highly skilled AI personal stylist. Analyze the provided image of the user and their style preferences to suggest a complete, new outfit for them. Do not describe what they are currently wearing.

- **User's Photo:** {{media url=photoDataUri}}
- **Style Preferences:** {{#if userProfile.stylePreferences}}{{#each userProfile.stylePreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Any{{/if}}
- **Budget:** {{{userProfile.budget}}}

Instructions:
1.  Based on the user in the photo, suggest a complete, fashionable outfit that would suit them.
2.  Provide a creative and catchy title for the new outfit.
3.  List the individual clothing items for the new outfit.
4.  Suggest a complementary color palette.
`,
});


const instantStyleFlow = ai.defineFlow(
  {
    name: 'instantStyleFlow',
    inputSchema: InstantStyleInputSchema,
    outputSchema: InstantStyleOutputSchema,
  },
  async (input) => {
    // 1. Generate the outfit description, items, and color palette.
    const { output: textOutput } = await textGenerationPrompt(input);

    if (!textOutput?.itemsList) {
        throw new Error('Failed to generate the outfit details.');
    }

    // 2. Generate an image based on the new design description.
    const imageGenerationPrompt = `A high-fashion, editorial photograph of a model wearing this outfit: ${textOutput.itemsList.join(', ')}. The style is ${input.userProfile.stylePreferences && input.userProfile.stylePreferences.length > 0 ? input.userProfile.stylePreferences.join(', ') : 'fashionable'}. The image should look professional and stylish.`;
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imageGenerationPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Failed to generate the outfit image.');
    }

    return {
      ...textOutput,
      imageUrl: media.url,
    };
  }
);
