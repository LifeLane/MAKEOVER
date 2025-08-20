import { VisualDesignerClient } from "./visual-designer-client";

export default function VisualDesignerPage() {
  return (
    <div className="px-2 sm:px-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-headline text-primary-dark font-bold tracking-tight lg:text-4xl">
          Visual Designer
        </h1>
        <p className="mt-2 text-sm text-foreground/80">
          Bring your fashion ideas to life. Upload an image and let Mirror create a unique design.
        </p>
      </div>
      <VisualDesignerClient />
    </div>
  );
}
