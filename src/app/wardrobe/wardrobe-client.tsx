
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Shirt } from 'lucide-react';
import { WardrobeItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getWardrobeItems, saveWardrobeItem } from '@/services/localStorage';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EmptyState } from '@/components/empty-state';

const newItemSchema = z.object({
  name: z.string().min(2, { message: 'Item name is required.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  imageUrl: z.string().url({ message: 'A valid image URL is required.' }),
});

type NewItemForm = z.infer<typeof newItemSchema>;

export function WardrobeClient() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewItemForm>({
    resolver: zodResolver(newItemSchema),
  });

  const loadItems = () => {
    try {
      const wardrobeItems = getWardrobeItems();
      setItems(wardrobeItems);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching wardrobe',
        description: 'Could not retrieve items from local storage.',
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadItems();
    setIsLoading(false);
  }, []);

  const onAddItem: SubmitHandler<NewItemForm> = (data) => {
    try {
      saveWardrobeItem(data);
      toast({
        title: 'Item Added!',
        description: 'Your new item has been added to your wardrobe.',
      });
      setIsFormOpen(false);
      reset();
      loadItems(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error adding item',
        description: 'Could not save item to local storage.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="overflow-hidden group">
            <CardContent className="p-0">
              <Skeleton className="relative aspect-[3/4] w-full" />
              <div className="p-3 bg-card">
                <Skeleton className="h-5 w-3/4 mb-1.5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-right mb-6">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Wardrobe Item</DialogTitle>
              <DialogDescription>
                Add a new item to your virtual closet. Enter an image URL and details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddItem)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" {...register('name')} className="col-span-3" />
                </div>
                 {errors.name && <p className="col-start-2 col-span-3 text-sm text-destructive">{errors.name.message}</p>}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" {...register('category')} className="col-span-3" />
                </div>
                 {errors.category && <p className="col-start-2 col-span-3 text-sm text-destructive">{errors.category.message}</p>}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="imageUrl" {...register('imageUrl')} className="col-span-3" />
                </div>
                 {errors.imageUrl && <p className="col-start-2 col-span-3 text-sm text-destructive">{errors.imageUrl.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] bg-muted/30">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                    data-ai-hint="clothing item"
                  />
                </div>
                <div className="p-3 bg-card">
                  <h3 className="font-semibold truncate text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
            title="Your Wardrobe is Empty"
            description="Upload items from your closet to get started."
            icon={<Shirt className="w-12 h-12" />}
        >
          <Button className="mt-6" onClick={() => setIsFormOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Your First Item
          </Button>
        </EmptyState>
      )}
    </>
  );
}

    