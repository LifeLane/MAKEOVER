import { WardrobeClient } from './wardrobe-client';

export default function WardrobePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="text-center sm:text-left w-full">
          <h1 className="text-2xl font-headline font-bold text-primary lg:text-4xl">My Wardrobe</h1>
          <p className="mt-2 text-sm text-foreground/80">Manage your virtual closet.</p>
        </div>
      </div>
      <WardrobeClient />
    </div>
  );
}
