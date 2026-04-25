import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 py-3 backdrop-blur-xl">
      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-content gap-3 rounded-lg border border-line/80 bg-surface/95 p-3 shadow-[0_18px_46px_rgba(24,31,36,0.08)] sm:w-[calc(100%-3rem)] sm:grid-cols-[auto_minmax(12rem,1fr)_auto] sm:items-center lg:w-[calc(100%-4rem)]">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-[0.8125rem] font-semibold text-white shadow-sm">
            CE
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-tight">Campus Event Guide</span>
        </Link>

        <form action="/" className="order-3 sm:order-none">
          <label htmlFor="site-search" className="sr-only">
            Search events
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search events, hosts, tags"
            className="h-10 w-full rounded-lg border border-line bg-muted/60 px-3 text-sm text-ink outline-none transition placeholder:text-soft focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
          />
        </form>

        <Link
          href="/?range=this-week#events"
          className="justify-self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          This week
        </Link>
      </div>
    </header>
  );
}
