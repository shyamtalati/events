import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-tight text-stone-950">
          Drexel University Events
        </Link>
      </div>
    </header>
  );
}
