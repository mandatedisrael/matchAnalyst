import { BrandBall } from "@/components/brand-ball";

const ORBS = [
  { size: 56, top: "8%", left: "6%", delay: "0s", duration: "18s", opacity: 0.14 },
  { size: 36, top: "22%", right: "8%", delay: "-4s", duration: "14s", opacity: 0.1 },
  { size: 72, top: "58%", left: "4%", delay: "-8s", duration: "22s", opacity: 0.08 },
  { size: 28, top: "72%", right: "12%", delay: "-2s", duration: "12s", opacity: 0.12 },
  { size: 44, top: "38%", right: "22%", delay: "-6s", duration: "16s", opacity: 0.09 },
] as const;

export function FloatingBalls() {
  return (
    <div className="floating-balls pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {ORBS.map((orb, index) => (
        <div
          key={index}
          className="floating-ball text-accent"
          style={{
            top: "top" in orb ? orb.top : undefined,
            left: "left" in orb ? orb.left : undefined,
            right: "right" in orb ? orb.right : undefined,
            opacity: orb.opacity,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
          }}
        >
          <BrandBall size={orb.size} className="ball-spin-slow" />
        </div>
      ))}
    </div>
  );
}