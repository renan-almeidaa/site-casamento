type OrnamentProps = {
  width?: number;
  className?: string;
};

export function Ornament({ width = 60, className }: OrnamentProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      aria-hidden
    >
      <div
        className="ornament-line"
        style={{ width }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[var(--color-champagne)]"
      >
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
      </svg>
      <div
        className="ornament-line-reverse"
        style={{ width }}
      />
    </div>
  );
}

export function HorizontalDivider({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-px w-10 bg-[var(--color-champagne)] ${className ?? ""}`}
      aria-hidden
    />
  );
}
