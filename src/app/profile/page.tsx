import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="container mx-auto">
       <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline text-primary-dark font-bold tracking-tight lg:text-5xl">
          Your Fashion Profile
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Help us understand your style to give you the best recommendations.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
