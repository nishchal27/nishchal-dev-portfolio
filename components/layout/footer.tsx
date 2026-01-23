export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} Engineering Portfolio
          </p>
          <p className="text-sm text-text-secondary">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
