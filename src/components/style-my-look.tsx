
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface StyleMyLookProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (photoDataUri: string) => void;
}

export function StyleMyLook({ isOpen, onOpenChange, onSubmit }: StyleMyLookProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCameraPermission() {
      if (!isOpen) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    }
    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when component unmounts or dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    await onSubmit(capturedImage);
    setIsLoading(false);
  }

  const handleClose = () => {
    setCapturedImage(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Camera /> Instant Style
          </DialogTitle>
          <DialogDescription>
            Snap a photo or upload an image to get a style recommendation in seconds.
          </DialogDescription>
        </DialogHeader>

        {capturedImage ? (
           <div className="space-y-4">
            <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden border">
                <Image src={capturedImage} alt="Captured preview" fill className="object-contain" />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCapturedImage(null)} className="w-full">Retake</Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin"/> : <Send />}
                    {isLoading ? 'Styling...' : 'Style Me'}
                </Button>
            </div>
           </div>
        ) : (
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4" /> Camera</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="camera" className="mt-4">
            <div className="space-y-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                <Button onClick={handleCapture} className="w-full" disabled={hasCameraPermission !== true}>Snap Photo</Button>
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                        Please enable camera permissions in your browser settings to use this feature.
                    </AlertDescription>
                </Alert>
            )}
             {hasCameraPermission === null && (
                 <div className="flex items-center justify-center h-40">
                     <Loader2 className="animate-spin" />
                     <p className="ml-2">Requesting camera...</p>
                 </div>
             )}
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
             <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-md">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">Click the button below to select an image from your device.</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
             </div>
          </TabsContent>
        </Tabs>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
