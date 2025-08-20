
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavedLook } from '@/lib/types';
import { getSavedLooks } from '@/services/localStorage';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Heart } from 'lucide-react';

export default function SavedLooksPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadLooks = () => {
      setIsLoading(true);
      try {
        const savedLooks = getSavedLooks();
        setLooks(savedLooks);
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Error fetching saved looks',
          description: 'Could not retrieve looks from local storage.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadLooks();
  }, [toast]);
  
  if (isLoading) {
    return (
       <div className="container mx-auto">
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl font-headline font-bold text-primary lg:text-4xl">Saved Looks</h1>
          <p className="mt-2 text-base text-foreground/80">Your collection of favorite styles.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden group shadow-lg">
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="p-0">
                        <Skeleton className="relative aspect-[4/5] w-full" />
                        <div className="p-4 space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-2/3" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-3xl font-headline font-bold text-primary lg:text-4xl">Saved Looks</h1>
        <p className="mt-2 text-base text-foreground/80">Your collection of favorite styles.</p>
      </div>
      
      {looks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look) => (
            <Card key={look.id} className="overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{look.occasion}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={look.imageUrl}
                    alt={look.outfitSuggestion}
                    fill
                    className="object-cover"
                    data-ai-hint="fashion outfit"
                  />
                </div>
                <div className="p-4 space-y-1">
                   <p className="text-sm text-muted-foreground">{look.outfitSuggestion}</p>
                   <p className="text-xs font-medium">Items: {look.itemsList.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
            title="No Saved Looks Yet"
            description="Start discovering outfits and save your favorites here."
            icon={<Heart className="w-12 h-12" />}
        />
      )}
    </div>
  );
}
