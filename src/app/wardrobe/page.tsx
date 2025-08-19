import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Shirt } from 'lucide-react';
import { WARDROBE_ITEMS_DATA } from '@/lib/constants';

export default function WardrobePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-headline font-bold text-primary">My Wardrobe</h1>
          <p className="mt-2 text-lg text-foreground/80">Manage your virtual closet.</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Item
        </Button>
      </div>

      {WARDROBE_ITEMS_DATA.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {WARDROBE_ITEMS_DATA.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint="clothing item"
                  />
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
       ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
           <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shirt className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Your Wardrobe is Empty</h2>
          <p className="mt-2 text-muted-foreground">
            Upload items from your closet to get started.
          </p>
           <Button className="mt-6">
            <Upload className="mr-2 h-4 w-4" />
            Upload Your First Item
          </Button>
        </div>
      )}
    </div>
  );
}
