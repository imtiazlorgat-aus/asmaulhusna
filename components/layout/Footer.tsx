import Image from 'next/image';
import Link from 'next/link';
import { Headphones } from 'lucide-react';

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=YxaBFVCZ7CU';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
        <nav className="flex items-center gap-4">
          <Image
            src="/AsmaulHusnaLogo.png"
            alt="Asma-ul-Husna logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact Us
          </Link>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Headphones className="h-4 w-4" aria-hidden="true" />
            Listen on YouTube
          </a>
        </nav>
        <div>© {year} asmaulhusna.co.za</div>
      </div>
    </footer>
  );
}
