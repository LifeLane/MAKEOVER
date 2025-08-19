'use client';

import { useState } from 'react';
import { DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { Button } from '@/components/ui/button';
import { OutfitCard } from '@/components/outfit-card';
import { getDailyOutfit, getRegeneratedOutfit } from '@/app/actions';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { EventStylingOutput } from '@/ai/flows/event-styling';
import { EmptyState } from './empty-state';

export function DashboardClient() {
  const [outfit, setOutfit] = useState<DailyOutfitSuggestionOutput | RegenerateOutfitOutput | EventStylingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setOutfit(null);
    const result = await getDailyOutfit();
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      setOutfit(result);
    }
    setIsLoading(false);
  };
  
  const handleRegenerate = async (feedback: string) => {
    setIsLoading(true);
    const currentSuggestion = outfit ? ('outfitSuggestion' in outfit ? outfit.outfitSuggestion : '') : '';
    const regeneratePrompt = `Based on the last suggestion "${currentSuggestion}", the user wants this change: "${feedback}". Please generate a new outfit.`;

    const result = await getRegeneratedOutfit(regeneratePrompt);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
       setOutfit({
        // @ts-ignore
        ...result,
        imageUrl: result.outfitImage,
        outfitSuggestion: result.outfitSuggestion,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline text-primary-dark font-bold tracking-tight lg:text-5xl">
          Your Style, Reimagined
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Get your personalized daily outfit suggestion from our AI stylist.
        </p>
      </div>
      
      {!outfit && !isLoading && (
        <EmptyState
            title="Get Your Daily Look"
            description="Click the button to generate a personalized outfit suggestion just for you."
            icon={<Wand2 className="w-12 h-12" />}
        >
            <Button size="lg" onClick={handleGetSuggestion}>
                <Wand2 className="mr-2 h-5 w-5" />
                Get Today's Suggestion
            </Button>
        </EmptyState>
      )}

      {(isLoading || outfit) && (
        <OutfitCard
          outfit={outfit}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          isRegenerate
        />
      )}
    </div>
  );
}
