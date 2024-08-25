import { type MouseEvent, useCallback, useMemo, useState } from "react";
import { Convert } from "@/Features/colors/utilities";

type ColorDot = {
  x: number;
  y: number;
  bg: string;
  rgb: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
};

const normalizeValue = (value: number, max: number) => {
  return Math.max(0, Math.min(value, max));
};

const calculateColorWheelPosition = (
  hsl: { h: number; s: number; l: number },
  rad: number
) => {
  const normalizedSaturation = hsl.s / 100;

  const angleInRadians = ((hsl.h - 90) * Math.PI) / 180;

  const x = rad + rad * normalizedSaturation * Math.cos(angleInRadians);
  const y = rad + rad * normalizedSaturation * Math.sin(angleInRadians);

  return { x, y };
};

const convert = new Convert();

export const getDot = (h: number, s: number, l: number): ColorDot => ({
  ...calculateColorWheelPosition({ h, s, l }, 50),
  bg: `hsl(${(h % 360).toFixed()}, ${s.toFixed()}%, ${l.toFixed()}%)`,
  rgb: `rgb(${convert.hslToRgb(h, s, l).join(", ")})`,
  hex: convert.hsl2hex({ h, s, l }),
  hsl: { h, s, l },
});

const calculateGradient = (params: { lightness: number }) => {
  const { lightness } = params;

  const calculatePosition = (params: {
    radius?: number;
    x0?: number;
    y0?: number;
    deg: number;
  }) => {
    const { radius = 50, x0 = 50, y0 = 50, deg } = params;
    return {
      x: normalizeValue(
        x0 + radius * Math.cos((Math.PI / 180) * (deg - 90)),
        100
      ),
      y: normalizeValue(
        y0 + radius * Math.sin((Math.PI / 180) * (deg - 90)),
        100
      ),
    };
  };

  const gradientStops = Array(16)
    .fill(undefined)
    .map((_, index) => {
      const hue = (360 / 16) * index;
      const position = calculatePosition({ deg: hue });
      return {
        top: position.y,
        left: position.x,
        hue: hue + 10,
      };
    });

  const gradient =
    gradientStops
      .map(({ hue, left, top }) => {
        return `radial-gradient(circle at ${left}% ${top}%, 
      hsla(${hue}, 100%, ${lightness}%, 0.7) 0%, 
      hsla(${hue}, 0%, ${lightness}%, 0) 43%)`;
      })
      .join(", ") + ", white";

  return gradient;
};

export const ColorWheel = ({
  colors = [],
  lightness = 50,
  updateColor,
  size = 250,
}: {
  colors: ColorDot[];
  updateColor: (color: { hsl: { h: number; s: number; l: number } }) => void;
  lightness?: number;
  size?: number;
}) => {
  const backgroundStyle = useMemo(() => {
    return calculateGradient({ lightness });
  }, [lightness]);

  const [isDragging, setIsDragging] = useState(false);
  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const handleMouseMoveOnWheel = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const radius = size / 2;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - radius;
      const y = e.clientY - rect.top - radius;

      const angle = (Math.atan2(y, x) * 360) / (Math.PI * 2) + 45;

      const h = Math.round(angle + 45) % 360;

      const distance = Math.sqrt(x * x + y * y);
      const s = Math.round((distance / radius) * 100) % 100;

      updateColor({ hsl: { h, s: s / 100, l: lightness / 100 } });
    },
    [isDragging, lightness, updateColor]
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        background: backgroundStyle,
        borderRadius: "50%",
        position: "relative",
        cursor: "pointer",
      }}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseMove={handleMouseMoveOnWheel}
    >
      {colors.map((color, index) => (
        <Dot key={index} {...color} moving={isDragging} />
      ))}
    </div>
  );
};

const Dot = ({
  x,
  y,
  bg,
  moving = false,
}: ColorDot & {
  moving?: boolean;
}) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: `calc(${y}% - 5px)`, // Adjust for dot size (10px)
        left: `calc(${x}% - 5px)`,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        border: "1px solid white",
        background: bg,
      }}
    />
  );
};
