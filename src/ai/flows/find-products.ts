'use server';
/**
 * @fileOverview A flow for finding shoppable products based on outfit items.
 *
 * - findProducts - A function that finds products for a given list of items.
 * - FindProductsInput - The input type for the findProducts function.
 * - FindProductsOutput - The return type for the findProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const getProductTool = ai.defineTool(
  {
    name: 'getProduct',
    description: 'Get details for a specific clothing or accessory item.',
    inputSchema: z.object({
      itemName: z.string().describe('The clothing item to search for. e.g., "blue denim jacket"'),
      gender: z.enum(['male', 'female', 'other', '']).describe("The user's gender to help refine the search."),
    }),
    outputSchema: z.object({
        name: z.string(),
        price: z.string(),
        url: z.string(),
        imageUrl: z.string(),
    }),
  },
  async (input) => {
    const searchTerm = `${input.gender} ${input.itemName}`.trim();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&tbm=shop`;

    const imageResponse = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A high-quality, professional studio photograph of a single product: a ${input.itemName}. The item should be on a plain, neutral background, like light gray or white. The lighting should be bright and even, highlighting the texture and details of the product. There should be no models or other distracting elements.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    return {
        name: input.itemName,
        price: "Check price on Google",
        url: searchUrl,
        imageUrl: imageResponse.media?.url || `https://placehold.co/300x400.png?text=${encodeURIComponent(input.itemName)}`,
    };
  }
);


const FindProductsInputSchema = z.object({
  items: z.array(z.string()).describe('A list of clothing items in the outfit.'),
  gender: z.enum(['male', 'female', 'other', '']).describe("The user's gender."),
});
export type FindProductsInput = z.infer<typeof FindProductsInputSchema>;

const FindProductsOutputSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    price: z.string(),
    url: z.string(),
    imageUrl: z.string(),
  })).describe('A list of products that match the items in the outfit.'),
});
export type FindProductsOutput = z.infer<typeof FindProductsOutputSchema>;

export async function findProducts(input: FindProductsInput): Promise<FindProductsOutput> {
  return findProductsFlow(input);
}

const findProductsFlow = ai.defineFlow(
  {
    name: 'findProductsFlow',
    inputSchema: FindProductsInputSchema,
    outputSchema: FindProductsOutputSchema,
    tools: [getProductTool],
  },
  async (input) => {
    const productPromises = input.items.map(item => getProductTool({ itemName: item, gender: input.gender }));
    const products = await Promise.all(productPromises);
    
    return { products };
  }
);
