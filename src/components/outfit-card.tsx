'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, RefreshCw, Wand2, Palette, Shirt } from 'lucide-react';
import { DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { useToast } from '@/hooks/use-toast';
import { RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { EventStylingOutput } from '@/ai/flows/event-styling';
import { Input } from './ui/input';
import { useState } from 'react';

type Outfit = DailyOutfitSuggestionOutput | RegenerateOutfitOutput | EventStylingOutput;

interface OutfitCardProps {
  outfit: Outfit | null;
  isLoading: boolean;
  onRegenerate: (feedback: string) => void;
  isRegenerate?: boolean;
}

export function OutfitCard({ outfit, isLoading, onRegenerate, isRegenerate = false }: OutfitCardProps) {
  const { toast } = useToast();
  const [regenerationInput, setRegenerationInput] = useState('');

  const handleSave = () => {
    toast({
      title: 'Look Saved!',
      description: 'You can find your saved looks in the "Saved Looks" section.',
    });
  };

  const handleRegenerateClick = () => {
    if (isRegenerate && !regenerationInput) {
      toast({
        variant: 'destructive',
        title: 'Feedback Required',
        description: 'Please provide feedback for regeneration.',
      });
      return;
    }
    onRegenerate(regenerationInput);
    setRegenerationInput('');
  };
  
  const outfitImage = outfit && ('outfitImage' in outfit ? outfit.outfitImage : 'imageUrl' in outfit ? outfit.imageUrl : '');
  const itemsList = outfit && 'itemsList' in outfit ? outfit.itemsList : [];
  const colorPalette = outfit && 'colorPalette' in outfit ? outfit.colorPalette : [];
  const accessoryTips = outfit && 'accessoryTips' in outfit ? outfit.accessoryTips : 'No tips available.';
  const outfitSuggestion = outfit && 'outfitSuggestion' in outfit ? outfit.outfitSuggestion : "Today's Look";


  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!outfit) {
    return null;
  }

  return (
    <Card className="overflow-hidden shadow-lg border-2 border-accent/20">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-96 md:h-auto min-h-[500px]">
          <Image
            src={outfitImage || 'https://placehold.co/600x800.png'}
            alt="Suggested outfit"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
            data-ai-hint="fashion outfit"
          />
        </div>
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{outfitSuggestion}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow p-6">
           {itemsList && itemsList.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Shirt size={18}/> Items</h3>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                {itemsList.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            )}
            {colorPalette && colorPalette.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Palette size={18}/> Color Palette</h3>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map((color, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {/* Assuming color is a string like hex code */}
                    <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            )}
            {accessoryTips && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold flex items-center gap-2"><Wand2 size={18}/> Accessory Tips</AccordionTrigger>
                <AccordionContent className="text-foreground/80">
                  {accessoryTips}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-secondary/50 p-4">
            {isRegenerate && (
                <div className='w-full'>
                    <Input 
                    value={regenerationInput}
                    onChange={(e) => setRegenerationInput(e.target.value)}
                    placeholder="e.g., 'make it more casual' or 'use blue tones'"
                    />
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button onClick={handleSave} variant="outline" className="w-full sm:w-auto">
                <Heart className="mr-2" /> Save Look
              </Button>
              <Button onClick={handleRegenerateClick} className="w-full sm:w-auto flex-grow">
                <RefreshCw className="mr-2" /> Regenerate
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-96 w-full md:h-[600px]" />
        <div className="flex flex-col p-6 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <div className="space-y-4 flex-grow">
             <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-full flex-grow" />
          </div>
        </div>
      </div>
    </Card>
  );
}
