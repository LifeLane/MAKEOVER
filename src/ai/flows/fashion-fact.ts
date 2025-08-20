'use server';
/**
 * @fileOverview Generates a fashion fact for a given date.
 *
 * - getFashionFact - A function that retrieves a fashion fact for a date.
 * - FashionFactInput - The input type for the getFashionFact function.
 * - FashionFactOutput - The return type for the getFashionFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FashionFactInputSchema = z.object({
  date: z.string().describe('The date for which to find a fashion fact, in format like "Month Day". e.g., "January 1st"'),
});
export type FashionFactInput = z.infer<typeof FashionFactInputSchema>;

const FashionFactOutputSchema = z.object({
  fact: z.string().describe('A fun and interesting fashion fact related to the provided date.'),
});
export type FashionFactOutput = z.infer<typeof FashionFactOutputSchema>;

export async function getFashionFact(input: FashionFactInput): Promise<FashionFactOutput> {
  return fashionFactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fashionFactPrompt',
  input: {schema: FashionFactInputSchema},
  output: {schema: FashionFactOutputSchema},
  prompt: `You are a fashion historian. Provide one fun, catchy, and interesting fashion fact related to the date: {{{date}}}. The fact should be a single, concise sentence. Make it surprising or noteworthy.

For example, for "May 26th", a good fact would be: "On this day in 1873, Levi Strauss and Jacob Davis were granted a patent for blue jeans."
Another example for "January 1st": "On New Year's Day in 1925, the iconic Chanel No. 5 perfume was launched."

Date: {{{date}}}
`,
});

const fashionFactFlow = ai.defineFlow(
  {
    name: 'fashionFactFlow',
    inputSchema: FashionFactInputSchema,
    outputSchema: FashionFactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
