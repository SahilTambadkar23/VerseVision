"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Wand2,
  Sparkles,
  Share2,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePoemFromImage } from '@/ai/flows/generate-poem-from-image';
import { enhancePoem } from '@/ai/flows/enhance-poem';

export function PoemGenerator() {
  const { toast } = useToast();
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [poem, setPoem] = useState('');
  const [enhancementPrompt, setEnhancementPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageDataUri(loadEvent.target?.result as string);
        setPoem('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePoem = async () => {
    if (!imageDataUri) return;

    setIsGenerating(true);
    try {
      const result = await generatePoemFromImage({ imageDataUri });
      setPoem(result.poem);
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate poem. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePoem = async () => {
    if (!poem || !enhancementPrompt) return;

    setIsEnhancing(true);
    try {
      const result = await enhancePoem({ poem, enhancementPrompt });
      setPoem(result.enhancedPoem);
    } catch (error) {
      console.error('Error enhancing poem:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to enhance poem. Please try again.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSavePoem = () => {
    if (!poem) return;
    const blob = new Blob([poem], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verse-vision-poem.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSharePoem = async () => {
    if (!poem) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Poem from VerseVision',
          text: poem,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
        navigator.clipboard.writeText(poem);
        toast({
            title: 'Copied to Clipboard',
            description: 'Your poem has been copied to your clipboard.',
        });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Your Muse</CardTitle>
          <CardDescription>Upload an image to inspire your poem.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {imageDataUri ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={imageDataUri}
                alt="Uploaded muse"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <button
              onClick={handleImageUploadClick}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg text-center p-8 hover:bg-muted transition-colors"
            >
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <span className="font-semibold text-primary">Click to upload an image</span>
              <span className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</span>
            </button>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
            {imageDataUri && (
                <Button onClick={handleImageUploadClick} variant="outline">
                    Change Image
                </Button>
            )}
        </CardFooter>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Creation</CardTitle>
            <CardDescription>
              {poem ? "Edit your poem or enhance it below." : "Generate a poem from your image."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Your generated poem will appear here..."
              value={poem}
              onChange={(e) => setPoem(e.target.value)}
              className="min-h-[200px] md:min-h-[270px] bg-background"
              disabled={!imageDataUri}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <Button
              onClick={handleGeneratePoem}
              disabled={!imageDataUri || isGenerating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Poem
            </Button>
            <div className='flex gap-2'>
              <Button onClick={handleSharePoem} variant="outline" disabled={!poem}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleSavePoem} variant="outline" disabled={!poem}>
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Enhance Poem</CardTitle>
            <CardDescription>Refine your poem with a guiding prompt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="enhancement-prompt">Enhancement Prompt</Label>
            <Input
              id="enhancement-prompt"
              placeholder="e.g., 'Make it more melancholic' or 'Add a stanza about hope'"
              value={enhancementPrompt}
              onChange={(e) => setEnhancementPrompt(e.target.value)}
              disabled={!poem || isEnhancing}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleEnhancePoem}
              disabled={!poem || !enhancementPrompt || isEnhancing}
              variant="accent"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isEnhancing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Enhance
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
