
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OutfitCard } from '@/components/outfit-card';
import { getDailyOutfit, getRegeneratedOutfit, fetchFashionFact } from '@/app/actions';
import { Wand2, CalendarPlus, Shirt, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { EventStylingOutput } from '@/ai/flows/event-styling';
import { EmptyState } from './empty-state';
import { getUserProfile, getWardrobeItems } from '@/services/localStorage';
import { Skeleton } from './ui/skeleton';
import { UserProfile, WardrobeItem } from '@/lib/types';
import Image from 'next/image';

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
    return <Skeleton className="h-5 w-full" />;
  }

  return (
    <div className="flex items-center gap-3 text-xs sm:text-sm text-center italic text-foreground/80 bg-accent/30 p-3 rounded-lg">
       <Sparkles className="text-primary w-5 h-5 shrink-0"/>
      <p>{fact}</p>
    </div>
  );
}


export function DashboardClient() {
  const [outfit, setOutfit] = useState<DailyOutfitSuggestionOutput | RegenerateOutfitOutput | EventStylingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setUserProfile(getUserProfile());
    setWardrobe(getWardrobeItems());
  }, []);


  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setOutfit(null);

    const profile = getUserProfile();
    const wardrobeItems = getWardrobeItems();

    const input = {
        ...profile,
        age: profile.age || 25,
        weather: 'Sunny, 25°C', 
        trendingStyles: ['oversized blazers', 'wide-leg trousers'],
        wardrobeItems,
    };

    const result = await getDailyOutfit(input);
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

  if (!userProfile) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto">
       <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-headline text-primary-dark font-bold tracking-tight lg:text-3xl whitespace-nowrap">
          Welcome back, {userProfile.name || 'Fashionista'}!
        </h1>
        <p className="text-base text-foreground/80">
          Your daily style snapshot is ready.
        </p>
      </div>

       <div className='mb-6'>
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
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 shadow-lg">
                <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary">
                        <Wand2 /> Your Daily Suggestion
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3 p-4 pt-0">
                     <p className="text-base text-foreground/80">
                        Ready for your AI-powered look?
                     </p>
                     <Button size="default" onClick={handleGetSuggestion} disabled={isLoading}>
                         {isLoading ? 'Generating...' : <> <Sparkles className="mr-2 h-5 w-5" /> Get Today's Look</>}
                     </Button>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-xl transition-shadow">
                     <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 font-headline text-lg text-primary">
                           <CalendarPlus /> Plan for an Event
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        <p className='text-foreground/80 text-sm'>Have a special occasion? Get the perfect outfit.</p>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/event-styling">Go to Event Styling</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-xl transition-shadow">
                     <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 font-headline text-lg text-primary">
                           <Shirt /> Your Wardrobe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        <div className='flex -space-x-2 rtl:space-x-reverse h-10 items-center'>
                            {wardrobe.slice(0, 4).map((item) => (
                                <Image key={item.id} src={item.imageUrl} alt={item.name} width={40} height={40} className='w-10 h-10 rounded-full border-2 border-white object-cover' data-ai-hint="clothing item" />
                            ))}
                            {wardrobe.length === 0 && <p className='text-sm text-muted-foreground'>Your closet is empty.</p>}
                        </div>
                        <p className='text-foreground/80 text-sm'>Manage your virtual closet with {wardrobe.length} items.</p>
                         <Button asChild variant="outline" size="sm">
                            <Link href="/wardrobe">View Wardrobe</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
