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
import { eventStyling, EventStylingInput, EventStylingOutput } from '@/ai/flows/event-styling';

const EventStylingOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A detailed outfit suggestion for the event.'),
  itemsList: z.array(z.string()).describe('A list of clothing items for the outfit.'),
  colorPalette: z.array(z.string()).describe('A suggested color palette for the outfit.'),
  imageUrl: z.string().describe('URL of an image of the generated outfit.'),
});

const StyleBotOutputSchema = z.object({
  response: z.string().describe("The bot's text response. This should be used for conversation."),
  outfit: EventStylingOutputSchema.optional().describe('The generated outfit details, if an outfit was created.'),
});
export type StyleBotOutput = z.infer<typeof StyleBotOutputSchema>;

// Define a tool for the AI to use.
const suggestOutfitForEvent = ai.defineTool(
    {
      name: 'suggestOutfitForEvent',
      description: 'Suggests a complete outfit for a user for a specific event. This should be used when the user explicitly asks for an outfit for an occasion like a "party", "wedding", "interview", etc. Gather all necessary information before calling this tool.',
      inputSchema: z.object({
          occasion: z.string().describe("The event the user needs an outfit for. e.g., 'summer wedding guest'"),
          mood: z.string().optional().describe("The desired mood or theme. e.g., 'elegant', 'casual', 'festive'"),
          budget: z.enum(['low', 'medium', 'high']).optional().describe("The user's budget for the outfit."),
          weather: z.string().optional().describe("The weather for the event. e.g., 'warm and sunny'")
      }),
      outputSchema: EventStylingOutputSchema,
    },
    async (input) => {
        // In a real application, you would fetch the user's profile and wardrobe from a database.
        // For this demo, we'll use a default profile.
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
        return result;
      } catch (e) {
        console.error(e);
        throw new Error("I had a little trouble creating that outfit. Maybe try asking for something a bit different?");
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

If the user asks for an outfit for a specific event (like a party, wedding, or work), you MUST first ask clarifying questions to gather the required information for the 'suggestOutfitForEvent' tool (occasion, mood, budget, weather). Once you have enough information, use the 'suggestOutfitForEvent' tool.

When you decide to call the tool, first respond with a confirmation message like "Got it! Let me work my magic...". Then, the tool's output will be handled by the system. Do not try to describe the outfit yourself in the text response.

Conversation History:
{{#each history}}
User: {{{user}}}
Mirror: {{{bot}}}
{{/each}}

New User Message: {{{message}}}
`,
});

const styleBotFlow = ai.defineFlow(
  {
    name: 'styleBotFlow',
    inputSchema: StyleBotInputSchema,
    outputSchema: StyleBotOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const toolResult = await toolCall.run();

      return {
        response: llmResponse.text(),
        outfit: toolResult as EventStylingOutput,
      };
    }

    return { response: llmResponse.text() };
  }
);
