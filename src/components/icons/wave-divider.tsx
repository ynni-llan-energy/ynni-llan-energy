/**
 * WaveDivider — topographic wave lines used as section dividers.
 * Evoke sea and mountain contour; rendered as SVG paths at low opacity.
 */

interface WaveDividerProps {
  className?: string;
  color?: string;
  opacity?: number;
  /** Number of wave lines to render */
  lines?: number;
  /** flip vertically for alternate sections */
  flip?: boolean;
}

export function WaveDivider({
  className = "",
  color = "#0A4B68",
  opacity = 0.12,
  lines = 4,
  flip = false,
}: WaveDividerProps) {
  const width = 1440;
  const height = 80;
  const lineSpacing = height / (lines + 1);

  // Generate a wave path offset at different vertical positions
  const wavePath = (yBase: number, amplitude: number, frequency: number): string => {
    const points: string[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = yBase + Math.sin((i / steps) * Math.PI * 2 * frequency) * amplitude;
      points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return points.join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`w-full ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      {Array.from({ length: lines }).map((_, i) => {
        const y = lineSpacing * (i + 1);
        // Vary amplitude and frequency per line for an organic feel
        const amplitude = 6 + i * 2;
        const frequency = 1.5 + i * 0.3;
        return (
          <path
            key={i}
            d={wavePath(y, amplitude, frequency)}
            stroke={color}
            strokeWidth={1.2}
            fill="none"
            opacity={opacity - i * 0.02}
          />
        );
      })}
    </svg>
  );
}

/**
 * TopoBackground — full-bleed topographic wave texture for hero sections.
 */
export function TopoBackground({
  className = "",
  color = "#0A4B68",
}: {
  className?: string;
  color?: string;
}) {
  const width = 1440;
  const height = 600;
  const lineCount = 18;

  const topoPath = (yBase: number, i: number): string => {
    const freq = 2 + (i % 3) * 0.7;
    const amp = 20 + (i % 4) * 12;
    const steps = 40;
    const pts = Array.from({ length: steps + 1 }, (_, s) => {
      const x = (s / steps) * width;
      const y =
        yBase +
        Math.sin((s / steps) * Math.PI * 2 * freq + i) * amp +
        Math.cos((s / steps) * Math.PI * freq * 0.5 + i * 0.3) * (amp * 0.4);
      return `${s === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    return pts.join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    >
      {Array.from({ length: lineCount }).map((_, i) => {
        const y = (height / lineCount) * i + height / (lineCount * 2);
        return (
          <path
            key={i}
            d={topoPath(y, i)}
            stroke={color}
            strokeWidth={1}
            fill="none"
            opacity={0.06 + (i % 3) * 0.015}
          />
        );
      })}
    </svg>
  );
}
