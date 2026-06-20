type OrnamentProps = {
  width?: number;
  className?: string;
  tone?: "deep" | "light";
};

/**
 * Marca editorial: linha fina · ponto · diamante · ponto · linha fina.
 * Inspirado em filigrana de convite gravado, sem cair em coração-cliche.
 */
export function Ornament({ width = 60, className, tone = "deep" }: OrnamentProps) {
  const color =
    tone === "deep"
      ? "var(--color-champagne-deep)"
      : "var(--color-champagne)";
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className ?? ""}`}
      aria-hidden
    >
      <div
        style={{
          width,
          height: "1px",
          background: `linear-gradient(to right, transparent, ${color} 80%)`,
        }}
      />
      <div
        style={{
          width: "3px",
          height: "3px",
          background: color,
          borderRadius: "9999px",
        }}
      />
      <svg
        width="9"
        height="9"
        viewBox="0 0 10 10"
        aria-hidden
        style={{ color }}
      >
        <path
          d="M5 0.5 L9.5 5 L5 9.5 L0.5 5 Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
      <div
        style={{
          width: "3px",
          height: "3px",
          background: color,
          borderRadius: "9999px",
        }}
      />
      <div
        style={{
          width,
          height: "1px",
          background: `linear-gradient(to left, transparent, ${color} 80%)`,
        }}
      />
    </div>
  );
}

export function HorizontalDivider({
  className,
  width = 32,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <div
      className={`mx-auto ${className ?? ""}`}
      style={{
        height: "1px",
        width,
        background: "var(--color-champagne-deep)",
      }}
      aria-hidden
    />
  );
}

/**
 * Marca vertical fina — ideal pra usar como "sello" no canto de seções
 * ou como separador entre blocos.
 */
export function VerticalMark({ height = 64 }: { height?: number }) {
  return (
    <div
      className="mx-auto flex flex-col items-center gap-1.5"
      aria-hidden
    >
      <div
        style={{
          width: "1px",
          height,
          background: "var(--color-champagne-deep)",
        }}
      />
      <div
        style={{
          width: "5px",
          height: "5px",
          background: "var(--color-champagne-deep)",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}
