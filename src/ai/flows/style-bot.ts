'use server';
/**
 * @fileOverview A conversational AI style bot.
 *
 * - styleBot - A function that handles the chatbot conversation.
 * - StyleBotInput - The input type for the styleBot function.
 * - StyleBotOutput - The return type for the styleBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { StyleBotInputSchema } from '@/lib/types';
import type { StyleBotInput } from '@/lib/types';


const StyleBotOutputSchema = z.object({
  response: z.string().describe('The bot\'s response.'),
});
export type StyleBotOutput = z.infer<typeof StyleBotOutputSchema>;

export async function styleBot(input: StyleBotInput): Promise<StyleBotOutput> {
  return styleBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleBotPrompt',
  input: {schema: StyleBotInputSchema},
  output: {schema: StyleBotOutputSchema},
  prompt: `You are a friendly and helpful fashion stylist bot named 'Mirror'. Your personality is insightful, encouraging, and a bit magical, like a fashion-savvy magic mirror. Your goal is to help users with their fashion questions, providing them with tips, and boosting their confidence.

Keep your responses concise and easy to read on a mobile device.

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
