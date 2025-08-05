'use server';
/**
 * @fileOverview Provides accessory tips based on the generated outfit and user preferences.
 *
 * - getAccessoryTips - A function that retrieves accessory tips.
 * - AccessoryTipsInput - The input type for the getAccessoryTips function.
 * - AccessoryTipsOutput - The return type for the getAccessoryTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessoryTipsInputSchema = z.object({
  outfitDescription: z
    .string()
    .describe('The description of the generated outfit.'),
  userPreferences: z
    .string()
    .describe('The user preferences regarding style and accessories.'),
});
export type AccessoryTipsInput = z.infer<typeof AccessoryTipsInputSchema>;

const AccessoryTipsOutputSchema = z.object({
  accessoryTips: z.string().describe('Accessory tips for the outfit.'),
});
export type AccessoryTipsOutput = z.infer<typeof AccessoryTipsOutputSchema>;

export async function getAccessoryTips(input: AccessoryTipsInput): Promise<AccessoryTipsOutput> {
  return accessoryTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accessoryTipsPrompt',
  input: {schema: AccessoryTipsInputSchema},
  output: {schema: AccessoryTipsOutputSchema},
  prompt: `You are an expert fashion consultant. Based on the outfit description and user preferences, provide accessory tips to complete the look.

Outfit Description: {{{outfitDescription}}}
User Preferences: {{{userPreferences}}}

Provide concise and practical accessory suggestions. Focus on items that would enhance the outfit and align with the user's style. Consider current trends while providing the tips.`,
});

const accessoryTipsFlow = ai.defineFlow(
  {
    name: 'accessoryTipsFlow',
    inputSchema: AccessoryTipsInputSchema,
    outputSchema: AccessoryTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
