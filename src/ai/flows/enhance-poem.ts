// Implemented enhancePoem flow.
'use server';

/**
 * @fileOverview A flow to enhance a given poem using GenAI based on a specific prompt.
 *
 * - enhancePoem - A function that enhances a poem based on a prompt.
 * - EnhancePoemInput - The input type for the enhancePoem function.
 * - EnhancePoemOutput - The return type for the enhancePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePoemInputSchema = z.object({
  poem: z.string().describe('The poem to be enhanced.'),
  enhancementPrompt: z.string().describe('The prompt to guide the enhancement of the poem.'),
});
export type EnhancePoemInput = z.infer<typeof EnhancePoemInputSchema>;

const EnhancePoemOutputSchema = z.object({
  enhancedPoem: z.string().describe('The enhanced poem.'),
});
export type EnhancePoemOutput = z.infer<typeof EnhancePoemOutputSchema>;

export async function enhancePoem(input: EnhancePoemInput): Promise<EnhancePoemOutput> {
  return enhancePoemFlow(input);
}

const enhancePoemPrompt = ai.definePrompt({
  name: 'enhancePoemPrompt',
  input: {schema: EnhancePoemInputSchema},
  output: {schema: EnhancePoemOutputSchema},
  prompt: `You are a master poet, skilled at refining existing poems.

  A user has provided a poem they would like to enhance.  Your task is to take the poem and enhance it based on their instructions.

  Original Poem:
  {{poem}}

  Enhancement Instructions:
  {{enhancementPrompt}}

  Enhanced Poem:`,
});

const enhancePoemFlow = ai.defineFlow(
  {
    name: 'enhancePoemFlow',
    inputSchema: EnhancePoemInputSchema,
    outputSchema: EnhancePoemOutputSchema,
  },
  async input => {
    const {output} = await enhancePoemPrompt(input);
    return output!;
  }
);
