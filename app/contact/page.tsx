'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Metadata } from 'next';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { toast } from 'sonner';

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      toast.success("Message sent! We’ll be in touch.");
      setFields({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild aria-label="Back">
            <Link href="/asmaul-husna">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Contact Us</h1>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={fields.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={fields.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={fields.subject}
            onChange={handleChange}
            placeholder="What is this about?"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={fields.message}
            onChange={handleChange}
            placeholder="Your message…"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        <Button type="submit" disabled={pending} className="gap-2">
          <Send className="h-4 w-4" />
          {pending ? 'Sending…' : 'Send Message'}
        </Button>
      </form>
    </main>
  );
}
