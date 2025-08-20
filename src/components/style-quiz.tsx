
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { StyleQuizInput, StyleQuizInputSchema } from '@/lib/types';
import { Wand2 } from 'lucide-react';

interface StyleQuizProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StyleQuizInput) => void;
}

const steps = [
  {
    id: 'gender',
    title: 'Who are we styling today?',
    fields: ['gender'],
  },
  {
    id: 'age',
    title: 'What is your age group?',
    fields: ['age'],
  },
  {
    id: 'physique',
    title: 'Tell us about your physique',
    fields: ['bodyType', 'skinTone'],
  },
  {
    id: 'occasion',
    title: 'What\'s the occasion?',
    fields: ['occasion'],
  },
  {
    id: 'style',
    title: 'What\'s your vibe?',
    description: 'Choose one or more styles that you resonate with.',
    fields: ['stylePreferences'],
  },
];

const stylePreferences = [
    { id: "casual", label: "Casual & Comfy" },
    { id: "chic", label: "Chic & Modern" },
    { id: "bohemian", label: "Bohemian & Artsy" },
    { id: "preppy", label: "Preppy & Polished" },
    { id: "edgy", label: "Edgy & Bold" },
    { id: "vintage", label: "Vintage & Retro" },
]

export function StyleQuiz({ isOpen, onOpenChange, onSubmit }: StyleQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<StyleQuizInput>({
    resolver: zodResolver(StyleQuizInputSchema),
    defaultValues: {
      gender: '',
      age: '',
      bodyType: '',
      skinTone: '',
      occasion: '',
      stylePreferences: [],
    },
  });

  async function processForm(values: StyleQuizInput) {
    onSubmit(values);
  }

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
        await form.handleSubmit(processForm)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand2 /> New Look
          </DialogTitle>
          <DialogDescription>
            Answer a few questions and Mirror will create the perfect look for you.
          </DialogDescription>
        </DialogHeader>

        <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />

        <Form {...form}>
          <form className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <h3 className="font-semibold">{steps[currentStep].title}</h3>
                   {steps[currentStep].description && <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>}
                </div>

                {currentStep === 0 && (
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3 pt-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentStep === 1 && (
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="space-y-3 pt-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="teen" /></FormControl><FormLabel className="font-normal">Teen (13-19)</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="young-adult" /></FormControl><FormLabel className="font-normal">Young Adult (20-35)</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="adult" /></FormControl><FormLabel className="font-normal">Adult (36-55)</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="senior" /></FormControl><FormLabel className="font-normal">Senior (55+)</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentStep === 2 && (
                    <div className="space-y-6 pt-4">
                        <FormField control={form.control} name="bodyType" render={({ field }) => (
                            <FormItem><FormLabel>Body Type</FormLabel><FormControl>
                                 <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="slim" /></FormControl><FormLabel className="font-normal">Slim</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="athletic" /></FormControl><FormLabel className="font-normal">Athletic</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="average" /></FormControl><FormLabel className="font-normal">Average</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="curvy" /></FormControl><FormLabel className="font-normal">Curvy / Plus-size</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="skinTone" render={({ field }) => (
                           <FormItem><FormLabel>Skin Tone</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="fair" /></FormControl><FormLabel className="font-normal">Fair</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="light" /></FormControl><FormLabel className="font-normal">Light</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="medium" /></FormControl><FormLabel className="font-normal">Medium</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="tan" /></FormControl><FormLabel className="font-normal">Tan</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="deep" /></FormControl><FormLabel className="font-normal">Deep</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
                {currentStep === 3 && (
                     <FormField
                        control={form.control}
                        name="occasion"
                        render={({ field }) => (
                          <FormItem className="space-y-3 pt-4">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="everyday" /></FormControl><FormLabel className="font-normal">Everyday Casual</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="work" /></FormControl><FormLabel className="font-normal">Work / Office</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="party" /></FormControl><FormLabel className="font-normal">Party / Night Out</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="formal" /></FormControl><FormLabel className="font-normal">Formal Event</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="vacation" /></FormControl><FormLabel className="font-normal">Vacation</FormLabel></FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                )}
                {currentStep === 4 && (
                     <FormField
                        control={form.control}
                        name="stylePreferences"
                        render={() => (
                          <FormItem className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              {stylePreferences.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="stylePreferences"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                )}


              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={prev} disabled={currentStep === 0}>
            Back
          </Button>
          <Button type="button" onClick={next}>
            {currentStep === steps.length - 1 ? 'Get My Look' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
