'use server';
/**
 * @fileOverview A flow to improve existing marketing content using AI.
 *
 * - improveMarketingContent - A function that handles the improvement of marketing content.
 * - ImproveMarketingContentInput - The input type for the improveMarketingContent function.
 * - ImproveMarketingContentOutput - The return type for the improveMarketingContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveMarketingContentInputSchema = z.object({
  content: z.string().describe('The marketing content to improve.'),
  imageUrl: z.string().optional().describe('Optional URL of an image to include in the improved content.'),
  videoUrl: z.string().optional().describe('Optional URL of a video to include in the improved content.'),
  prompt: z.string().describe('Instructions on how to improve the content.'),
});
export type ImproveMarketingContentInput = z.infer<typeof ImproveMarketingContentInputSchema>;

const ImproveMarketingContentOutputSchema = z.object({
  improvedContent: z.string().describe('The improved marketing content.'),
});
export type ImproveMarketingContentOutput = z.infer<typeof ImproveMarketingContentOutputSchema>;

export async function improveMarketingContent(
  input: ImproveMarketingContentInput
): Promise<ImproveMarketingContentOutput> {
  return improveMarketingContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveMarketingContentPrompt',
  input: {
    schema: z.object({
      content: z.string().describe('The marketing content to improve.'),
      imageUrl: z.string().optional().describe('Optional URL of an image to include in the improved content.'),
      videoUrl: z.string().optional().describe('Optional URL of a video to include in the improved content.'),
      prompt: z.string().describe('Instructions on how to improve the content.'),
    }),
  },
  output: {
    schema: z.object({
      improvedContent: z.string().describe('The improved marketing content.'),
    }),
  },
  prompt: `You are an expert marketing content improver.

You will take the existing marketing content and improve it based on the instructions given.

Existing content: {{{content}}}
Instructions: {{{prompt}}}

{{#if imageUrl}}
Image URL: {{media url=imageUrl}}
{{/if}}

{{#if videoUrl}}
Video URL: {{media url=videoUrl}}
{{/if}}

Improved content:`,
});

const improveMarketingContentFlow = ai.defineFlow<
  typeof ImproveMarketingContentInputSchema,
  typeof ImproveMarketingContentOutputSchema
>({
  name: 'improveMarketingContentFlow',
  inputSchema: ImproveMarketingContentInputSchema,
  outputSchema: ImproveMarketingContentOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return {improvedContent: output!.improvedContent};
});
