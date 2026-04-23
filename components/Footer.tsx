export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto flex w-full max-w-content flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p className="font-medium text-stone-950">&copy; {year} Drexel University Events. All rights reserved.</p>
        <p>A curated event directory for Drexel students, clubs, and campus programming.</p>
      </div>
    </footer>
  );
}
