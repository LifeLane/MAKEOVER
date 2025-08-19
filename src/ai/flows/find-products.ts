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
      gender: z.enum(['male', 'female', 'other', '']).describe("The user's gender to determine the shopping link."),
    }),
    outputSchema: z.object({
        name: z.string(),
        price: z.string(),
        url: z.string(),
        imageUrl: z.string(),
    }),
  },
  async (input) => {
    // This is a mock implementation.
    // In a real app, you'd search a product database or API.
    console.log(`Searching for product: ${input.itemName} for gender: ${input.gender}`);
    const mockPrice = `$${(Math.random() * 100 + 20).toFixed(2)}`;
    
    let baseUrl = 'https://www.amazon.com/s?k=';
    if (input.gender === 'female') {
        baseUrl = 'https://amzn.to/46YSKh2';
    } else if (input.gender === 'male') {
        baseUrl = 'https://amzn.to/45n6hOe';
    }

    const searchUrl = input.gender === 'female' || input.gender === 'male' 
        ? baseUrl 
        : `${baseUrl}${encodeURIComponent(input.itemName)}`;

    return {
        name: input.itemName,
        price: "Check price on Amazon",
        url: searchUrl,
        imageUrl: `https://placehold.co/300x400.png?text=${encodeURIComponent(input.itemName)}`
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
