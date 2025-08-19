'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, RefreshCw, Wand2, Palette, Shirt, ShoppingBag } from 'lucide-react';
import { DailyOutfitSuggestionOutput } from '@/ai/flows/daily-outfit-suggestion';
import { useToast } from '@/hooks/use-toast';
import { RegenerateOutfitOutput } from '@/ai/flows/outfit-regeneration';
import { EventStylingOutput } from '@/ai/flows/event-styling';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import type { Product, UserProfile } from '@/lib/types';
import { getProductsForOutfit, saveGeneratedLook, fetchUserProfile } from '@/app/actions';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    fetchUserProfile().then(res => {
      if (!res.error) {
        setUserProfile(res);
      }
    })
  }, []);

  const outfitImage = outfit && ('outfitImage' in outfit ? outfit.outfitImage : 'imageUrl' in outfit ? outfit.imageUrl : '');
  const itemsList = outfit && 'itemsList' in outfit ? outfit.itemsList : [];
  const colorPalette = outfit && 'colorPalette' in outfit ? outfit.colorPalette : [];
  const accessoryTips = outfit && 'accessoryTips' in outfit ? outfit.accessoryTips : 'No tips available.';
  const outfitSuggestion = outfit && 'outfitSuggestion' in outfit ? outfit.outfitSuggestion : "Today's Look";

  useEffect(() => {
    if (outfit && 'itemsList' in outfit && outfit.itemsList && outfit.itemsList.length > 0) {
      setIsFetchingProducts(true);
      setProducts([]);
      getProductsForOutfit({items: outfit.itemsList, gender: userProfile.gender})
        .then(result => {
          if (!result.error) {
            setProducts(result.products);
          } else {
            toast({
              variant: 'destructive',
              title: 'Error finding products',
              description: result.error,
            });
          }
        })
        .finally(() => {
          setIsFetchingProducts(false);
        });
    }
  }, [outfit, userProfile.gender, toast]);

  const handleSave = async () => {
    if (!outfit) return;

    const lookToSave = {
      imageUrl: outfitImage || '',
      outfitSuggestion: outfitSuggestion,
      itemsList: itemsList || [],
      colorPalette: colorPalette || [],
      accessoryTips: accessoryTips || '',
      occasion: 'daily', // This could be improved to be more dynamic
    };

    const result = await saveGeneratedLook(lookToSave);
     if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Look',
        description: result.error,
      });
    } else {
      toast({
        title: 'Look Saved!',
        description: 'You can find your saved looks in the "Saved" section.',
      });
    }
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
    setProducts([]);
    onRegenerate(regenerationInput);
    setRegenerationInput('');
  };

  if (isLoading && !outfit) {
    return <LoadingSkeleton />;
  }
  
  if (!outfit) {
    return null;
  }

  return (
    <Card className="overflow-hidden shadow-lg border-2 border-accent/20">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto min-h-[500px]">
          {isLoading && !outfitImage ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Image
              src={outfitImage || 'https://placehold.co/600x800.png'}
              alt="Suggested outfit"
              fill
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              data-ai-hint="fashion outfit"
            />
          )}
        </div>
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{outfitSuggestion}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow p-6">
            <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold flex items-center gap-2"><Shirt size={18}/> Items & Colors</AccordionTrigger>
                <AccordionContent>
                  {itemsList && itemsList.length > 0 && (
                  <div className="space-y-4">
                    <ul className="list-disc list-inside text-foreground/80 space-y-1">
                      {itemsList.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                    {colorPalette && colorPalette.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2 text-sm"><Palette size={16}/> Color Palette</h3>
                      <div className="flex flex-wrap gap-2">
                        {colorPalette.map((color, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              {accessoryTips && (
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold flex items-center gap-2"><Wand2 size={18}/> Accessory Tips</AccordionTrigger>
                <AccordionContent className="text-foreground/80">
                  {accessoryTips}
                </AccordionContent>
              </AccordionItem>
              )}
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold flex items-center gap-2"><ShoppingBag size={18}/> Shop the Look</AccordionTrigger>
                <AccordionContent>
                  {isFetchingProducts ? (
                     <div className="grid grid-cols-2 gap-4">
                       <ProductSkeleton />
                       <ProductSkeleton />
                     </div>
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-foreground/80">No products found for this look.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
              <Button onClick={handleSave} variant="outline" className="w-full">
                <Heart className="mr-2" /> Save Look
              </Button>
              <Button onClick={handleRegenerateClick} className="w-full flex-grow" disabled={isLoading}>
                <RefreshCw className="mr-2" /> {isLoading ? 'Generating...' : 'Regenerate'}
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
        <CardContent className="p-0">
            <div className="relative aspect-[3/4]">
                {product.imageUrl ? 
                  <Image src={product.imageUrl} alt={product.name} fill objectFit="cover" data-ai-hint="clothing item" />
                  : <Skeleton className='w-full h-full' />
                }
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.price}</p>
                <Button asChild size="sm" className="w-full mt-2">
                  <a href={product.url} target="_blank" rel="noopener noreferrer">Buy Now</a>
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Skeleton className="aspect-square md:aspect-auto w-full h-auto min-h-[500px]" />
        <div className="flex flex-col p-6 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Skeleton className="h-10 w-full sm:w-28" />
            <Skeleton className="h-10 w-full flex-grow" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}
