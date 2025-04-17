// src/ai/flows/generate-marketing-content.ts
'use server';
/**
 * @fileOverview Generates marketing content based on a prompt, image URL, and video URL.
 *
 * - generateMarketingContent - A function that generates marketing content.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMarketingContentInputSchema = z.object({
  prompt: z.string().describe('The marketing prompt.'),
  imageUrl: z.string().optional().describe('The URL of the image.'),
  videoUrl: z.string().optional().describe('The URL of the video.'),
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  content: z.string().describe('The generated marketing content.'),
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

export async function generateMarketingContent(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const generateMarketingContentPrompt = ai.definePrompt({
  name: 'generateMarketingContentPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The marketing prompt.'),
      imageUrl: z.string().optional().describe('The URL of the image.'),
      videoUrl: z.string().optional().describe('The URL of the video.'),
    }),
  },
  output: {
    schema: z.object({
      content: z.string().describe('The generated marketing content.'),
    }),
  },
  prompt: `You are an expert marketing content creator.

  Create marketing content based on the following prompt, image, and video.

  Prompt: {{{prompt}}}
  {{#if imageUrl}}
  Image: {{media url=imageUrl}}
  {{/if}}
  {{#if videoUrl}}
  Video: {{media url=videoUrl}}
  {{/if}}

  The marketing content should be engaging and relevant to the prompt, image, and video.
  Output the content directly without any extra explanations, questions, or greetings.
  `,
});

const generateMarketingContentFlow = ai.defineFlow<
  typeof GenerateMarketingContentInputSchema,
  typeof GenerateMarketingContentOutputSchema
>({
  name: 'generateMarketingContentFlow',
  inputSchema: GenerateMarketingContentInputSchema,
  outputSchema: GenerateMarketingContentOutputSchema,
}, async input => {
  const {output} = await generateMarketingContentPrompt(input);
  return output!;
});
