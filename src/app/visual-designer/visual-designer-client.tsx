
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Wand2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateVisualDesign } from '@/app/actions';
import type { VisualDesignerOutput } from '@/ai/flows/visual-designer';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Please provide a detailed description of your vision.' }),
  imageUrl: z.string().url({ message: 'Please provide a valid image URL as a reference.' }),
});

function GeneratedDesign({ design, isLoading }: { design: VisualDesignerOutput | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!design) return null;

  return (
    <Card className="mt-8 shadow-lg animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Your Design Is Ready</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={design.imageUrl}
              alt="Generated Fashion Design"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint="fashion design"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Wand2 size={20} /> Design Concept</h3>
            <p className="text-foreground/80">{design.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VisualDesignerClient() {
  const [design, setDesign] = useState<VisualDesignerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      imageUrl: '',
    },
  });
  
  const imageUrl = form.watch('imageUrl');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDesign(null);

    const result = await generateVisualDesign(values);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Design',
        description: result.error,
      });
    } else {
      setDesign(result);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">Create Your Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><ImageIcon size={16}/> Reference Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://placehold.co/600x600.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {imageUrl && (
                        <div className="relative aspect-square rounded-md overflow-hidden border">
                           <Image src={imageUrl} alt="Reference Preview" fill className="object-cover" data-ai-hint="reference image" />
                        </div>
                    )}
                 </div>
                 <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Sparkles size={16} /> Your Vision</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., 'A flowing evening gown inspired by a starry night, with dark silk and silver embroidery.'" 
                            className="min-h-[200px] sm:min-h-[300px]"
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
             
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Magic...' : 'Generate Design'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <GeneratedDesign design={design} isLoading={isLoading} />
    </>
  );
}
