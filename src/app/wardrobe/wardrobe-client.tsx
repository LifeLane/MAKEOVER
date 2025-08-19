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
import { fetchWardrobeItems, addWardrobeItem } from '@/app/actions';
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

  const loadItems = async () => {
    // No need to set loading true here if we want to avoid flicker on add
    const result = await fetchWardrobeItems();
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching wardrobe',
        description: result.error,
      });
    } else {
      setItems(result.items);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadItems();
  }, []);

  const onAddItem: SubmitHandler<NewItemForm> = async (data) => {
    const result = await addWardrobeItem(data);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error adding item',
        description: result.error,
      });
    } else {
      toast({
        title: 'Item Added!',
        description: 'Your new item has been added to your wardrobe.',
      });
      setIsFormOpen(false);
      reset();
      await loadItems(); // Refresh the list
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="overflow-hidden group">
            <CardContent className="p-0">
              <Skeleton className="relative aspect-[3/4] w-full" />
              <div className="p-4 bg-card">
                <Skeleton className="h-5 w-3/4 mb-2" />
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
            <Button>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => (
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
