
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WardrobeClient } from '../wardrobe/wardrobe-client';
import SavedLooksPage from '../saved-looks/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Shirt } from 'lucide-react';


export function CollectionClient() {
  return (
    <div className="px-2 sm:px-4">
        <div className="mb-6 text-center">
            <h1 className="text-2xl font-headline text-primary-dark font-bold tracking-tight lg:text-4xl">
                My Collection
            </h1>
            <p className="mt-2 text-sm text-foreground/80">
                Your saved outfits and personal wardrobe items, all in one place.
            </p>
        </div>
        <Tabs defaultValue="looks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="looks"><Heart className="mr-2 h-4 w-4" />Saved Looks</TabsTrigger>
                <TabsTrigger value="items"><Shirt className="mr-2 h-4 w-4" />Wardrobe Items</TabsTrigger>
            </TabsList>
            <TabsContent value="looks" className="mt-6">
               <SavedLooksPage />
            </TabsContent>
            <TabsContent value="items" className="mt-6">
                <WardrobeClient />
            </TabsContent>
        </Tabs>
    </div>
  );
}
