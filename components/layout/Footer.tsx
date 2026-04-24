import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center gap-2 px-6 sm:flex-row sm:justify-between">
        <div>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
        </div>
        <div>© {year} asmaulhusna.co.za</div>
      </div>
    </footer>
  );
}
