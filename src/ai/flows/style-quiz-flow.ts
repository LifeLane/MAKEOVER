
'use server';
/**
 * @fileOverview A flow for generating an outfit from a style quiz.
 *
 * - styleQuiz - Generates an outfit based on user's answers to a style questionnaire.
 * - StyleQuizInput - The input type for the flow.
 * - StyleQuizOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { StyleQuizInputSchema } from '@/lib/types';

export type StyleQuizInput = z.infer<typeof StyleQuizInputSchema>;

const StyleQuizOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A creative title for the suggested outfit.'),
  itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  imageUrl: z.string().describe('URL of an image of the generated outfit.'),
});
export type StyleQuizOutput = z.infer<typeof StyleQuizOutputSchema>;

export async function styleQuiz(input: StyleQuizInput): Promise<StyleQuizOutput> {
  return styleQuizFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
    name: 'styleQuizTextPrompt',
    input: { schema: StyleQuizInputSchema },
    output: { schema: z.object({
        outfitSuggestion: z.string().describe('A creative title for the suggested outfit.'),
        itemsList: z.array(z.string()).describe('A list of clothing items in the outfit.'),
        colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
    })},
    prompt: `You are a world-class fashion stylist. A user has provided their style profile through a questionnaire. Your task is to create a stunning, complete outfit for them.

User's Style Profile:
- Gender: {{{gender}}}
- Age Group: {{{age}}}
- Body Type: {{{bodyType}}}
- Skin Tone: {{{skinTone}}}
- Occasion: {{{occasion}}}
- Style Preferences: {{#each stylePreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Color Preferences: {{#each colorPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Instructions:
1.  Based on all the details provided, suggest a complete, fashionable outfit.
2.  Provide a creative and catchy title for the outfit.
3.  List the individual clothing items.
4.  Suggest a complementary color palette that incorporates the user's preferences.
`,
});


const styleQuizFlow = ai.defineFlow(
  {
    name: 'styleQuizFlow',
    inputSchema: StyleQuizInputSchema,
    outputSchema: StyleQuizOutputSchema,
  },
  async (input) => {
    // 1. Generate the outfit description, items, and color palette.
    const { output: textOutput } = await textGenerationPrompt(input);

    if (!textOutput?.itemsList) {
        throw new Error('Failed to generate the outfit details.');
    }

    // 2. Generate an image based on the new design description.
    const imageGenerationPrompt = `A high-fashion, editorial photograph of a model wearing this outfit: ${textOutput.itemsList.join(', ')}. The model is a ${input.gender}, with a ${input.bodyType} build and ${input.skinTone} skin tone. The style is ${input.stylePreferences.join(', ')} and suitable for ${input.occasion}. The color palette should favor: ${input.colorPreferences.join(', ')}.`;
    
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
