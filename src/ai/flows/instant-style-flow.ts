
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
    prompt: `You are a highly skilled AI personal stylist with an expert eye for detail. Your task is to generate a new, complete outfit suggestion based on a photograph provided by the user.

**User's Photo:** {{media url=photoDataUri}}

**User's Preferences (Optional):**
- Style: {{#if userProfile.stylePreferences}}{{#each userProfile.stylePreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Not specified{{/if}}
- Budget: {{{userProfile.budget}}}

**Your Analysis and Generation Process:**

1.  **Analyze the Person:** From the user's photo, carefully identify the following key points:
    *   Apparent gender.
    *   Estimated age range (e.g., 20s, 30s, etc.).
    *   Body type.
    *   Skin tone.
    *   The mood and setting of the photo (e.g., casual, professional, urban, nature).

2.  **Develop a Concept:** Based on your analysis and the user's provided preferences, formulate a concept for a new outfit. This concept should be cohesive and well-suited to the person in the photo. Do NOT describe what they are currently wearing.

3.  **Generate the Outfit:** Based on your concept, provide the following:
    *   A creative and catchy title for the new outfit.
    *   A list of the individual clothing items for the new outfit.
    *   A complementary color palette.
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
