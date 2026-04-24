import { redirect } from 'next/navigation';

/**
 * Root redirect. v1 is a single-feature app — there's nothing at `/`
 * to show. Future features (if any) would move this to a landing page.
 */
export default function RootPage() {
  redirect('/asmaul-husna');
}
