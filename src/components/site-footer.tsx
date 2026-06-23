export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold tracking-tight">
            ai<span className="text-accent">.</span>ball
          </p>
          <p className="text-muted max-w-md text-xs leading-5">
            Research and analysis only. Not financial, betting, or investment
            advice. Polymarket prices shown for market context when available.
          </p>
        </div>
      </div>
    </footer>
  );
}