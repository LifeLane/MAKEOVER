'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OutfitCard } from '@/components/outfit-card';
import { getEventOutfit, getRegeneratedOutfit } from '@/app/actions';
import type { EventStylingOutput } from '@/ai/flows/event-styling';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  occasion: z.string().min(2, { message: 'Occasion is required.' }),
  budget: z.enum(['low', 'medium', 'high']),
  weather: z.string().min(2, { message: 'Weather is required.' }),
  mood: z.string().optional(),
});

export function EventStylingClient() {
  const [outfit, setOutfit] = useState<EventStylingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      occasion: '',
      budget: 'medium',
      weather: '',
      mood: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutfit(null);
    const result = await getEventOutfit(values);
    if (result.error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      // @ts-ignore
      setOutfit(result);
    }
    setIsLoading(false);
  }

  const handleRegenerate = async (feedback: string) => {
    setIsLoading(true);
    const result = await getRegeneratedOutfit(feedback);
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

  return (
    <>
      <Card className="max-w-2xl mx-auto mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occasion</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wedding, Job Interview" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="weather"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weather</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunny, 25°C" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood / Theme (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Elegant, Festive, Minimalist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Get Outfit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || outfit) && (
        <OutfitCard
          outfit={outfit}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          isRegenerate
        />
      )}
    </>
  );
}
