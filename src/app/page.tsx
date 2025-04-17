'use client';

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {GenerateMarketingContentInput, generateMarketingContent} from '@/ai/flows/generate-marketing-content';
import {Facebook, Instagram} from 'lucide-react';
import {postToFacebook} from '@/services/facebook';
import {postToInstagram} from '@/services/instagram';
import {toast} from '@/hooks/use-toast';
import {cn} from '@/lib/utils';
import {improveMarketingContent, ImproveMarketingContentInput} from '@/ai/flows/improve-marketing-content';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const placeholderImageUrl = 'https://picsum.photos/512/256';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(placeholderImageUrl);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [isImproving, setIsImproving] = useState<boolean>(false);

  const [language, setLanguage] = useState<string>('English');
  const [length, setLength] = useState<string>('Medium');
  const [tone, setTone] = useState<string>('Informative');

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const input: GenerateMarketingContentInput = {
        prompt,
        imageUrl: imageUrl === placeholderImageUrl ? undefined : imageUrl,
        videoUrl,
        language,
        length,
        tone,
      };

      const result = await generateMarketingContent(input);
      setGeneratedContent(result.content);
    } catch (error: any) {
      toast({
        title: 'Error generating content',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveContent = async () => {
    setIsImproving(true);
    try {
      const input: ImproveMarketingContentInput = {
        content: generatedContent,
        imageUrl: imageUrl === placeholderImageUrl ? undefined : imageUrl,
        videoUrl,
        prompt: 'Make this content more engaging and professional.',
      };
      const result = await improveMarketingContent(input);
      setGeneratedContent(result.improvedContent);
    } catch (error: any) {
      toast({
        title: 'Error improving content',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsImproving(false);
    }
  };

  const handlePostToFacebook = async () => {
    try {
      const success = await postToFacebook({content: generatedContent, imageUrl, videoUrl});
      if (success) {
        toast({
          title: 'Successfully posted to Facebook!',
        });
      } else {
        toast({
          title: 'Failed to post to Facebook',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error posting to Facebook',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePostToInstagram = async () => {
    try {
      const success = await postToInstagram({content: generatedContent, imageUrl, videoUrl});
      if (success) {
        toast({
          title: 'Successfully posted to Instagram!',
        });
      } else {
        toast({
          title: 'Failed to post to Instagram',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error posting to Instagram',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-4 bg-secondary">
      <Card className="w-full max-w-3xl p-4 rounded-lg shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Social Boost AI</CardTitle>
          <CardDescription className="text-md text-gray-600">
            Generate engaging marketing content with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                Marketing Content Prompt
              </label>
              <Textarea
                id="prompt"
                rows={3}
                placeholder="Enter your marketing content prompt here."
                className="mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <Input
                type="url"
                id="imageUrl"
                placeholder={placeholderImageUrl}
                className="mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 max-w-full h-auto rounded-md"
                  style={{maxHeight: '256px'}}
                />
              )}
            </div>
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                Video URL
              </label>
              <Input
                type="url"
                id="videoUrl"
                placeholder="Enter video URL (optional)"
                className="mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                    {/* Add more languages here */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                  Length
                </label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select length"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                  Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informative">Informative</SelectItem>
                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="Humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full bg-primary text-primary-foreground hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>

          {generatedContent && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Generated Content</h2>
              <Textarea
                rows={5}
                placeholder="Generated content will appear here."
                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleImproveContent}
                  disabled={isImproving}
                  className={cn(
                    'bg-primary text-primary-foreground hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
                    'w-1/3'
                  )}
                >
                  {isImproving ? 'Improving...' : 'Improve Content'}
                </Button>

                <Button
                  onClick={handlePostToFacebook}
                  className={cn(
                    'bg-primary text-primary-foreground hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
                    'w-1/3'
                  )}
                >
                  Post to <Facebook className="inline-block ml-1 h-4 w-4"/>
                </Button>
                <Button
                  onClick={handlePostToInstagram}
                  className={cn(
                    'bg-primary text-primary-foreground hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
                    'w-1/3'
                  )}
                >
                  Post to <Instagram className="inline-block ml-1 h-4 w-4"/>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
