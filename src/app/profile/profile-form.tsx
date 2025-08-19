'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { saveUserProfileData, fetchUserProfile } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  photoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', '']),
  age: z.coerce.number().min(13, 'You must be at least 13').max(100).optional().or(z.literal('')),
  skinTone: z.string().min(2, 'Skin tone is required'),
  bodyType: z.string().min(2, 'Body type is required'),
  stylePreferences: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  occasionTypes: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  budget: z.enum(['low', 'medium', 'high', '']),
});

export function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        ...DEFAULT_USER_PROFILE,
        stylePreferences: DEFAULT_USER_PROFILE.stylePreferences.join(', '),
        occasionTypes: DEFAULT_USER_PROFILE.occasionTypes.join(', '),
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const result = await fetchUserProfile();
      if (result.error) {
        toast({
          variant: 'destructive',
          title: "Error fetching profile",
          description: result.error,
        });
      } else if (result) {
        form.reset({
          ...result,
          stylePreferences: result.stylePreferences?.join(', ') || '',
          occasionTypes: result.occasionTypes?.join(', ') || '',
        });
      }
    }
    loadProfile();
  }, [form, toast]);


  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const result = await saveUserProfileData(values);
    if (result.error) {
       toast({
        variant: 'destructive',
        title: "Error saving profile",
        description: result.error,
      });
    } else {
      toast({
        title: "Profile Updated!",
        description: "Your fashion profile has been successfully saved.",
      });
    }
  }

  if (form.formState.isLoading) {
    return (
       <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader><CardTitle className="font-headline text-2xl text-primary">Edit Profile</CardTitle></CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
       </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={form.watch('photoUrl') || ''} />
                <AvatarFallback>
                  {form.watch('name')?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="age" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="gender" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  </FormControl><SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent></Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="budget" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl>
                    <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                  </FormControl><SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent></Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="skinTone" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Skin Tone</FormLabel><FormControl><Input {...field} placeholder="e.g., Fair, Olive, Deep" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="bodyType" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Body Type</FormLabel><FormControl><Input {...field} placeholder="e.g., Athletic, Curvy, Slim" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField name="stylePreferences" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Style Preferences</FormLabel>
                <FormControl><Textarea {...field} placeholder="e.g., Casual, Bohemian, Chic" /></FormControl>
                <FormDescription>Separate styles with a comma.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="occasionTypes" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Occasion Types</FormLabel>
                <FormControl><Textarea {...field} placeholder="e.g., Work, Party, Travel" /></FormControl>
                <FormDescription>Separate occasions with a comma.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
