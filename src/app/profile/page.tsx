import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="px-2 sm:px-4">
       <div className="mb-6 text-center">
        <h1 className="text-2xl font-headline text-primary-dark font-bold tracking-tight lg:text-4xl">
          Your Fashion Profile
        </h1>
        <p className="mt-2 text-sm text-foreground/80">
          Help us understand your style to give you the best recommendations.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
