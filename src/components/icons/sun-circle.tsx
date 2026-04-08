/**
 * SunCircle — concentric rings converging on a solid solar gold circle.
 * Primary hero illustration and logomark anchor for the Tonnau identity.
 */

interface SunCircleProps {
  size?: number;
  className?: string;
  /** Colour of the solid centre disc */
  fillColor?: string;
  /** Colour of the concentric ring strokes */
  ringColor?: string;
}

export function SunCircle({
  size = 320,
  className = "",
  fillColor = "#E09800",
  ringColor = "#0A4B68",
}: SunCircleProps) {
  const cx = size / 2;
  const cy = size / 2;
  const coreRadius = size * 0.12;
  const ringCount = 6;
  const maxRadius = size * 0.46;
  const ringStep = (maxRadius - coreRadius) / ringCount;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Concentric rings — outermost to innermost, fading in opacity */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = maxRadius - i * ringStep;
        const opacity = 0.1 + i * 0.12;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            stroke={ringColor}
            strokeWidth={1.5}
            opacity={opacity}
          />
        );
      })}

      {/* Solid solar gold core */}
      <circle cx={cx} cy={cy} r={coreRadius} fill={fillColor} />

      {/* Inner glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={coreRadius * 1.6}
        stroke={fillColor}
        strokeWidth={1}
        opacity={0.35}
      />
    </svg>
  );
}
