import { redirect } from "next/navigation";

/**
 * Default language pair redirect.
 *
 * In the future, this could read the user's `Accept-Language` header
 * and redirect to the best available match, or check a cookie set
 * when the user changes languages. For v1, English for both is a
 * sensible default.
 */
export default function AsmaulHusnaIndexPage() {
  redirect("/asmaul-husna/en");
}
