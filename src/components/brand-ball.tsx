interface BrandBallProps {
  size?: number;
  className?: string;
}

export function BrandBall({ size = 24, className = "" }: BrandBallProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle
        cx="16"
        cy="16"
        r="14.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />
      <path
        fill="currentColor"
        fillOpacity="0.92"
        d="M16 6.2 19.8 12.1 18.1 18.6 13.9 18.6 12.2 12.1 16 6.2Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.7"
        d="M16 6.2 19.8 12.1 23.4 14.2M12.2 12.1 8.6 14.2M18.1 18.6 20.1 24.2M13.9 18.6 11.9 24.2M16 6.2V3.8M23.4 14.2 25.4 16M8.6 14.2 6.6 16"
      />
    </svg>
  );
}