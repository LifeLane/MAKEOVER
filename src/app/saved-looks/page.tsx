import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SAVED_LOOKS_DATA } from '@/lib/constants';
import Image from 'next/image';

export default function SavedLooksPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-headline font-bold text-primary">Saved Looks</h1>
        <p className="mt-2 text-lg text-foreground/80">Your collection of favorite styles.</p>
      </div>
      
      {SAVED_LOOKS_DATA.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAVED_LOOKS_DATA.map((look) => (
            <Card key={look.id} className="overflow-hidden group shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{look.occasion}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={look.imageUrl}
                    alt={look.outfitSuggestion}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint="fashion outfit"
                  />
                </div>
                <div className="p-4 space-y-2">
                   <p className="text-sm text-muted-foreground">{look.outfitSuggestion}</p>
                   <p className="text-xs font-medium">Items: {look.itemsList.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h2 className="text-2xl font-bold font-headline">No Saved Looks Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start discovering outfits and save your favorites here.
          </p>
        </div>
      )}
    </div>
  );
}
