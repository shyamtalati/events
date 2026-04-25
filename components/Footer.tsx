export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/95">
      <div className="mx-auto flex w-full max-w-content flex-col gap-2 px-4 py-8 text-sm text-body sm:px-6 lg:px-8">
        <p className="font-medium text-ink">&copy; {year} Campus Event Guide. All rights reserved.</p>
        <p>A curated event directory for students, clubs, and campus programming.</p>
      </div>
    </footer>
  );
}
