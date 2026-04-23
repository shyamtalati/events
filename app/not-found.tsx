import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-950">Event not found</h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        We could not find that event. It may have been removed or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Return to upcoming events
      </Link>
    </section>
  );
}
