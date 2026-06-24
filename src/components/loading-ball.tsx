import { BrandBall } from "@/components/brand-ball";

interface LoadingBallProps {
  label?: string;
  size?: number;
  className?: string;
}

export function LoadingBall({
  label,
  size = 40,
  className = "",
}: LoadingBallProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="ball-bounce text-accent">
        <BrandBall size={size} />
      </div>
      {label && <p className="text-muted text-sm">{label}</p>}
    </div>
  );
}