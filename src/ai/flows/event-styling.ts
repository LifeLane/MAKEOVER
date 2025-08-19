'use server';
/**
 * @fileOverview Provides personalized outfit suggestions for specific events.
 *
 * - eventStyling - A function that handles the outfit suggestion process for an event.
 * - EventStylingInput - The input type for the eventStyling function.
 * - EventStylingOutput - The return type for the eventStyling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventStylingInputSchema = z.object({
  gender: z.string().describe('The gender of the user.'),
  age: z.number().describe('The age of the user.'),
  skinTone: z.string().describe('The skin tone of the user.'),
  bodyType: z.string().describe('The body type of the user.'),
  stylePreferences: z.array(z.string()).describe('The style preferences of the user.'),
  occasion: z.string().describe('The specific event or occasion.'),
  budget: z.string().describe('The budget range for the outfit.'),
  weather: z.string().describe('The current weather conditions.'),
  mood: z.string().describe('The desired mood or theme for the outfit.'),
});
export type EventStylingInput = z.infer<typeof EventStylingInputSchema>;

const EventStylingOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A detailed outfit suggestion for the event.'),
  itemsList: z.array(z.string()).describe('A list of clothing items for the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  accessoryTips: z.string().describe('Accessory tips to complement the outfit.'),
  imageUrl: z.string().describe('URL of an image of the generated outfit.'),
});
export type EventStylingOutput = z.infer<typeof EventStylingOutputSchema>;

export async function eventStyling(input: EventStylingInput): Promise<EventStylingOutput> {
  return eventStylingFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'eventStylingTextPrompt',
  input: {schema: EventStylingInputSchema},
  output: {schema: z.object({
    outfitSuggestion: z.string().describe('A detailed outfit suggestion for the event.'),
    itemsList: z.array(z.string()).describe('A list of clothing items for the outfit.'),
    colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
    accessoryTips: z.string().describe('Accessory tips to complement the outfit.'),
  })},
  prompt: `You are a personal stylist. Suggest a complete outfit for a
{{{age}}}-year-old {{{gender}}}, {{{bodyType}}} build, {{{skinTone}}} skin,
who prefers {{{stylePreferences}}} style for a {{{occasion}}} event.
The budget is {{{budget}}}, the weather is {{{weather}}}, and the mood/theme is {{{mood}}}.
Include clothing items, colors, and accessories.
`,
});

const eventStylingFlow = ai.defineFlow(
  {
    name: 'eventStylingFlow',
    inputSchema: EventStylingInputSchema,
    outputSchema: EventStylingOutputSchema,
  },
  async input => {
    const {output: textOutput} = await textGenerationPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate event styling text.');
    }

    const imagePrompt = `Generate an image of a ${input.occasion} outfit for a ${input.age}-year-old ${input.gender}, with ${input.stylePreferences.join(', ')} style. Items: ${textOutput.itemsList.join(', ')}`;
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    return {
      ...textOutput,
      imageUrl: media?.url || '',
    };
  }
);
