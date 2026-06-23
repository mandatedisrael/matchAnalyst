import { BrandName } from "@/components/brand-name";

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandName className="text-lg" />
          <p className="text-muted max-w-md text-xs leading-5">
            Research and analysis only. Not financial, betting, or investment
            advice. Polymarket prices shown for market context when available.
          </p>
        </div>
      </div>
    </footer>
  );
}