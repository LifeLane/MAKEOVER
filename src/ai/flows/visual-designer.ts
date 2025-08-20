
'use server';
/**
 * @fileOverview A flow for generating visual designs from an image and prompt.
 *
 * - generateVisualDesign - Generates a fashion design based on visual and textual input.
 * - VisualDesignerInput - The input type for the flow.
 * - VisualDesignerOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VisualDesignerInputSchema = z.object({
  imageUrl: z.string().url().describe('A URL to an image of a person, theme, or location as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  prompt: z.string().describe('A textual description of the desired design or style.'),
});
export type VisualDesignerInput = z.infer<typeof VisualDesignerInputSchema>;

const VisualDesignerOutputSchema = z.object({
  description: z.string().describe('A detailed description of the generated outfit design.'),
  imageUrl: z.string().url().describe('The URL of the generated outfit image.'),
});
export type VisualDesignerOutput = z.infer<typeof VisualDesignerOutputSchema>;

export async function generateVisualDesign(input: VisualDesignerInput): Promise<VisualDesignerOutput> {
  return visualDesignerFlow(input);
}

const designPrompt = ai.definePrompt({
    name: 'visualDesignPrompt',
    input: { schema: VisualDesignerInputSchema },
    output: { schema: z.object({ description: z.string() }) },
    prompt: `You are an avant-garde fashion designer known for your creative genius. A client has provided you with an image and a design prompt. Your task is to conceptualize and describe a unique, exceptional fashion design.

Analyze the provided image for its colors, shapes, mood, and core elements. Then, synthesize that analysis with the user's design prompt to create something truly new.

- **Reference Image:** {{media url=imageUrl}}
- **Design Prompt:** {{{prompt}}}

Based on the image and prompt, provide a detailed description of your design concept. Be vivid, evocative, and specific about fabrics, cut, and details.
`,
});


const visualDesignerFlow = ai.defineFlow(
  {
    name: 'visualDesignerFlow',
    inputSchema: VisualDesignerInputSchema,
    outputSchema: VisualDesignerOutputSchema,
  },
  async (input) => {
    // 1. Generate the design description based on the prompt and image.
    const { output: textOutput } = await designPrompt(input);

    if (!textOutput?.description) {
        throw new Error('Failed to generate a design description.');
    }

    // 2. Generate an image based on the new design description.
    const imageGenerationPrompt = `A high-fashion, editorial photograph of a model wearing this design: ${textOutput.description}. The image should be visually stunning and ready for a magazine cover.`;
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imageGenerationPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Failed to generate the design image.');
    }

    return {
      description: textOutput.description,
      imageUrl: media.url,
    };
  }
);
