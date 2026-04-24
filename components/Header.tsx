import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid w-full max-w-content gap-3 px-4 py-3 sm:px-6 md:grid-cols-[auto_minmax(12rem,1fr)_auto] md:items-center lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-stone-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-[0.8125rem] font-semibold text-white">
            DU
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-tight">Drexel Events</span>
        </Link>

        <form action="/" className="order-3 md:order-none">
          <label htmlFor="site-search" className="sr-only">
            Search events
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search events, hosts, or tags"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </form>

        <Link
          href="/?range=this-week#events"
          className="justify-self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          This week
        </Link>
      </div>
    </header>
  );
}
