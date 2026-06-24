interface BrandNameProps {
  className?: string;
}

export function BrandName({ className = "" }: BrandNameProps) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      ai<span className="text-accent">.ball</span>
    </span>
  );
}

export const BRAND_TITLE = "ai.ball";
export const BRAND_TAGLINE = "AI football analyst";