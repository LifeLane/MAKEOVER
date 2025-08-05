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
    </div>
  );
}
