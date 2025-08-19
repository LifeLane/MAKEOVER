import { WardrobeClient } from './wardrobe-client';

export default function WardrobePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="text-center sm:text-left w-full">
          <h1 className="text-4xl font-headline font-bold text-primary">My Wardrobe</h1>
          <p className="mt-2 text-lg text-foreground/80">Manage your virtual closet.</p>
        </div>
      </div>
      <WardrobeClient />
    </div>
  );
}
