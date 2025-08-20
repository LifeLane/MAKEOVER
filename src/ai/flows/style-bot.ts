'use server';
/**
 * @fileOverview A conversational AI style bot that can use tools.
 *
 * - styleBot - A function that handles the chatbot conversation.
 * - StyleBotInput - The input type for the styleBot function.
 * - StyleBotOutput - The return type for the styleBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { StyleBotInputSchema } from '@/lib/types';
import type { StyleBotInput } from '@/lib/types';
import { eventStyling, EventStylingInput } from '@/ai/flows/event-styling';
import { getUserProfile, getWardrobeItems } from '@/services/localStorage';


const StyleBotOutputSchema = z.object({
  response: z.string().describe('The bot\'s response.'),
});
export type StyleBotOutput = z.infer<typeof StyleBotOutputSchema>;

// Define a tool for the AI to use.
const suggestOutfitForEvent = ai.defineTool(
    {
      name: 'suggestOutfitForEvent',
      description: 'Suggests a complete outfit for a user for a specific event. This should be used when the user explicitly asks for an outfit for an occasion like a "party", "wedding", "interview", etc.',
      inputSchema: z.object({
          occasion: z.string().describe("The event the user needs an outfit for. e.g., 'summer wedding guest'"),
          mood: z.string().optional().describe("The desired mood or theme. e.g., 'elegant', 'casual', 'festive'"),
          budget: z.enum(['low', 'medium', 'high']).optional().describe("The user's budget for the outfit."),
          weather: z.string().optional().describe("The weather for the event. e.g., 'warm and sunny'")
      }),
      outputSchema: z.string(),
    },
    async (input) => {
        // Since this is run on the server, we can't directly access localStorage.
        // For this tool, we will use the default user profile.
        // In a real application, you would fetch this from a database.
        const userProfile = {
            name: 'Guest',
            photoUrl: '',
            gender: 'female',
            age: 28,
            skinTone: 'fair',
            bodyType: 'average',
            stylePreferences: ['chic', 'modern'],
            occasionTypes: ['party', 'work'],
            budget: 'medium',
        } as const;

        const eventStylingInput: EventStylingInput = {
            ...userProfile,
            occasion: input.occasion,
            mood: input.mood || '',
            budget: input.budget || userProfile.budget,
            weather: input.weather || 'mild',
            wardrobeItems: [], // Cannot access wardrobe from server tool
        };
      
      try {
        const result = await eventStyling(eventStylingInput);
        // We can't return the full outfit card in chat yet, so we return a confirmation message.
        // A more advanced implementation could involve sending a special message type to the client.
        return `I've put together a look for a ${input.occasion}! It's a ${result.outfitSuggestion}. You can find similar suggestions on the "Events" page.`;
      } catch (e) {
        console.error(e);
        return "I had a little trouble creating that outfit. Maybe try asking for something a bit different?";
      }
    }
);


export async function styleBot(input: StyleBotInput): Promise<StyleBotOutput> {
  return styleBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleBotPrompt',
  input: {schema: StyleBotInputSchema},
  output: {schema: StyleBotOutputSchema},
  tools: [suggestOutfitForEvent],
  prompt: `You are a friendly and helpful fashion stylist bot named 'Mirror'. Your personality is insightful, encouraging, and a bit magical, like a fashion-savvy magic mirror. Your goal is to help users with their fashion questions, providing them with tips, and boosting their confidence.

Keep your responses concise and easy to read on a mobile device.

If the user asks for an outfit for a specific event (like a party, wedding, or work), you should use the 'suggestOutfitForEvent' tool to generate a suggestion for them. For general fashion questions, answer them directly.

Conversation History:
{{#each history}}
User: {{{user}}}
Mirror: {{{bot}}}
{{/each}}

New User Message: {{{message}}}

Mirror's Response:
`,
});

const styleBotFlow = ai.defineFlow(
  {
    name: 'styleBotFlow',
    inputSchema: StyleBotInputSchema,
    outputSchema: StyleBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
