
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OutfitCard } from '@/components/outfit-card';
import { getRegeneratedOutfit, fetchFashionFact, getStyleQuizOutfit, getInstantStyle } from '@/app/actions';
import { Wand2, CalendarPlus, Heart, Sparkles, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { EventStylingOutput } from '@/ai/flows/event-styling';
import { getUserProfile, getWardrobeItems } from '@/services/localStorage';
import { Skeleton } from './ui/skeleton';
import { UserProfile, WardrobeItem, StyleQuizInput } from '@/lib/types';
import Image from 'next/image';
import { useChat } from '@/hooks/use-chat';
import { StyleQuiz } from './style-quiz';
import { StyleMyLook } from './style-my-look';
import { InstantStyleOutput } from '@/ai/flows/instant-style-flow';

function FashionFact() {
  const [fact, setFact] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = format(new Date(), 'MMMM do');
    fetchFashionFact(today).then((result) => {
      if (!result.error) {
        setFact(result.fact);
      } else {
        setFact('The little black dress was introduced by Coco Chanel in the 1920s.'); // Fallback fact
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  return (
    <div className="text-left text-sm text-foreground/80 bg-background p-4 rounded-lg border">
      <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">{fact}</p>
    </div>
  );
}


export function DashboardClient() {
  const { generatedOutfit, setGeneratedOutfit } = useChat();
  const [outfit, setOutfit] = useState<DailyOutfitSuggestionOutput | RegenerateOutfitOutput | EventStylingOutput | InstantStyleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const { toast } = useToast();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isStylerOpen, setIsStylerOpen] = useState(false);

  useEffect(() => {
    setUserProfile(getUserProfile());
    setWardrobe(getWardrobeItems());
  }, []);

  // Effect to handle outfits generated from the chat
  useEffect(() => {
    if (generatedOutfit) {
      setOutfit(generatedOutfit);
      setGeneratedOutfit(null); // Reset after displaying
    }
  }, [generatedOutfit, setGeneratedOutfit]);


  const handleGetQuizSuggestion = async (values: StyleQuizInput) => {
    setIsLoading(true);
    setOutfit(null);
    setIsQuizOpen(false);

    const result = await getStyleQuizOutfit(values);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Outfit',
        description: result.error,
      });
    } else {
      setOutfit(result);
    }

    setIsLoading(false);
  };
  
  const handleGetInstantStyle = async (photoDataUri: string) => {
    if (!userProfile) return;
    setIsLoading(true);
    setOutfit(null);
    setIsStylerOpen(false);

    const result = await getInstantStyle({ photoDataUri, userProfile: { stylePreferences: userProfile.stylePreferences, budget: userProfile.budget } });

     if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Style',
        description: result.error,
      });
    } else {
      setOutfit(result);
    }
    setIsLoading(false);
  }

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

  if (!userProfile) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <StyleQuiz 
        isOpen={isQuizOpen}
        onOpenChange={setIsQuizOpen}
        onSubmit={handleGetQuizSuggestion}
      />
      <StyleMyLook 
        isOpen={isStylerOpen}
        onOpenChange={setIsStylerOpen}
        onSubmit={handleGetInstantStyle}
      />
      <div className="space-y-4">
       <div className="mb-4 space-y-1">
        <h1 className="text-xl font-headline text-primary-dark font-bold tracking-tight sm:text-2xl lg:text-3xl whitespace-nowrap">
          Welcome back, {userProfile.name || 'Fashionista'}!
        </h1>
        <p className="text-sm text-foreground/80">
          Your daily style snapshot is ready.
        </p>
      </div>

       <div className='mb-4'>
          <FashionFact />
       </div>

      {(isLoading || outfit) ? (
         <OutfitCard
          outfit={outfit}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          isRegenerate
        />
      ) : (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20 shadow-lg">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-base sm:text-lg text-primary">
                          <Wand2 /> Craft Your Look
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                      <p className='text-xs sm:text-sm text-foreground/80'>Answer a few questions to get a personalized style.</p>
                       <Button size="sm" onClick={() => setIsQuizOpen(true)} disabled={isLoading} className="w-full sm:w-auto">
                           {isLoading ? 'Generating...' : <> <Sparkles className="mr-2 h-4 w-4" /> Start Style Quiz</>}
                       </Button>
                  </CardContent>
              </Card>
               <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/20 shadow-lg">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-base sm:text-lg text-accent">
                          <Camera /> Instant Style
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                      <p className='text-xs sm:text-sm text-foreground/80'>Use your camera or upload a photo for an instant look.</p>
                       <Button size="sm" variant="outline" onClick={() => setIsStylerOpen(true)} disabled={isLoading} className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                           {isLoading ? 'Generating...' : <> <Camera className="mr-2 h-4 w-4" /> Style My Look</>}
                       </Button>
                  </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-xl transition-shadow duration-300">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm sm:text-base text-primary">
                           <CalendarPlus /> Plan for an Event
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        <p className='text-foreground/80 text-xs'>Have a special occasion? Get the perfect outfit.</p>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/event-styling">Go to Event Styling</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-xl transition-shadow duration-300">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-sm sm:text-base text-primary">
                           <Heart /> Your Collection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        <div className='flex -space-x-2 rtl:space-x-reverse h-8 items-center'>
                            {wardrobe.slice(0, 4).map((item) => (
                                <Image key={item.id} src={item.imageUrl} alt={item.name} width={32} height={32} className='w-8 h-8 rounded-full border-2 border-white object-cover' data-ai-hint="clothing item" />
                            ))}
                            {wardrobe.length === 0 && <p className='text-xs text-muted-foreground'>Your collection is empty.</p>}
                        </div>
                        <p className='text-foreground/80 text-xs'>Manage your saved looks and closet items.</p>
                         <Button asChild variant="outline" size="sm">
                            <Link href="/collection">View Collection</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
      </div>
    </div>
  );
}
