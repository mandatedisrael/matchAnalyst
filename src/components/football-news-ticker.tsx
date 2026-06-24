"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { BrandBall } from "@/components/brand-ball";
import type { FootballNewsItem } from "@/types/news";

export function FootballNewsTicker() {
  const [items, setItems] = useState<FootballNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch {
        // Keep empty — skeleton shows until/unless items load.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadNews();
    return () => {
      cancelled = true;
    };
  }, []);

  const tickerItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <section className="animate-fade-up stagger-2 -mx-5 mb-10 sm:-mx-8">
      <div className="mb-3 flex items-center gap-2 px-5 sm:px-8">
        <BrandBall size={16} className="text-accent ball-wiggle" />
        <h2 className="font-display text-sm font-semibold tracking-tight">
          Football news
        </h2>
      </div>

      <div className="news-ticker border-y border-border">
        <div className="news-ticker-label">
          <BrandBall size={12} className="ball-spin-slow" />
          <span>Live</span>
        </div>

        <div className="news-ticker-viewport" aria-live="polite">
          {isLoading && items.length === 0 ? (
            <div className="news-ticker-skeleton">
              <span className="analysis-shimmer h-3 w-48 rounded-full" />
              <span className="analysis-shimmer h-3 w-64 rounded-full" />
              <span className="analysis-shimmer h-3 w-40 rounded-full" />
            </div>
          ) : (
            <div
              className="news-ticker-track"
              style={
                {
                  "--ticker-duration": `${Math.max(items.length * 6, 36)}s`,
                } as CSSProperties
              }
            >
              {tickerItems.map((item, index) => (
                <a
                  key={`${item.id}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-ticker-item"
                >
                  <span className="news-ticker-source">{item.source}</span>
                  <span className="news-ticker-title">{item.title}</span>
                  <span className="news-ticker-separator" aria-hidden>
                    ·
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}