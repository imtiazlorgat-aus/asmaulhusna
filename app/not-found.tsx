import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div
        className="font-uthmanic text-6xl text-foreground/80"
        dir="rtl"
        lang="ar"
      >
        ٤٠٤
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, or you may
          have followed an outdated link.
        </p>
      </div>
      <Button asChild>
        <Link href="/asmaul-husna">Return to the viewer</Link>
      </Button>
    </main>
  );
}
