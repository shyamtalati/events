import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-lg border border-line bg-surface p-8 text-center shadow-[0_16px_40px_rgba(24,31,36,0.06)]">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Event not found</h1>
      <p className="mt-2 text-sm text-body sm:text-base">
        We could not find that event. It may have been removed or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Return to upcoming events
      </Link>
    </section>
  );
}
