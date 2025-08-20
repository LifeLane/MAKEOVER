import { EventStylingClient } from "./event-styling-client";

export default function EventStylingPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-headline text-primary-dark font-bold tracking-tight lg:text-4xl">
          Style for Any Event
        </h1>
        <p className="mt-2 text-sm text-foreground/80">
          Tell us about your event, and we'll craft the perfect look for you.
        </p>
      </div>
      <EventStylingClient />
    </div>
  );
}
