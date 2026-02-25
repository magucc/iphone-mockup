import React from "react";

export interface FrameProps extends React.SVGAttributes<SVGSVGElement> {
  /** Hex color to tint the frame body. Defaults to near-black. */
  frameColor?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Smooth continuous-curvature corner path (approximated with cubics).
 *  Matches Apple's "squircle" corner style used on all modern iPhones.
 *  r should be ~10–15% of the shorter side for authentic look.
 */
function squircleRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string {
  // cubic bezier handle ratio for smooth corner (slightly more than circular)
  const k = 0.552 * r;
  return [
    `M ${x + r} ${y}`,
    `L ${x + w - r} ${y}`,
    `C ${x + w - k} ${y} ${x + w} ${y + k} ${x + w} ${y + r}`,
    `L ${x + w} ${y + h - r}`,
    `C ${x + w} ${y + h - k} ${x + w - k} ${y + h} ${x + w - r} ${y + h}`,
    `L ${x + r} ${y + h}`,
    `C ${x + k} ${y + h} ${x} ${y + h - k} ${x} ${y + h - r}`,
    `L ${x} ${y + r}`,
    `C ${x} ${y + k} ${x + k} ${y} ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// iPhone 17
// Frame: 1350 × 2760  |  Screen: x72 y69  1205 × 2621  |  radius: 120
// Bezel: top ~69, bottom ~70, sides ~72–73
// Dynamic Island: pill ~290 × 88, centered horizontally at ~675, top ~130
// Buttons: volume pair left side ~680–780 & ~820–920, power right ~850–1050
// ---------------------------------------------------------------------------

export const IPhone17Frame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1350;
  const H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;

  // Frame outer shape corner radius
  const outerR = 155;
  // Screen cutout id for clip
  const clipId = "screen-clip-17";
  // Dynamic Island
  const diW = 295, diH = 90, diR = 45;
  const diX = (W - diW) / 2; // centered
  const diY = 128;

  // Gradient IDs
  const gradEdge = "grad-edge-17";
  const gradSide = "grad-side-17";
  const gradHighlight = "grad-hl-17";
  const shadowDI = "shadow-di-17";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
      aria-label="iPhone 17 frame"
    >
      <defs>
        {/* Edge gradient — left-to-right subtle sheen */}
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="8%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="92%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.14" />
        </linearGradient>
        {/* Top-to-bottom face gradient */}
        <linearGradient id={gradSide} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
        {/* Thin highlight line at very top */}
        <linearGradient id={gradHighlight} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        {/* Dynamic Island shadow filter */}
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
        </filter>
        {/* Screen clip */}
        <clipPath id={clipId}>
          <path d={squircleRect(sx, sy, sw, sh, sr)} />
        </clipPath>
      </defs>

      {/* ── Outer frame body ── */}
      <path
        d={squircleRect(0, 0, W, H, outerR)}
        fill={frameColor}
      />
      {/* Edge sheen */}
      <path
        d={squircleRect(0, 0, W, H, outerR)}
        fill={`url(#${gradEdge})`}
      />
      {/* Face top-to-bottom tone */}
      <path
        d={squircleRect(0, 0, W, H, outerR)}
        fill={`url(#${gradSide})`}
      />

      {/* ── Screen hole (transparent — children composited behind) ── */}
      {children && (
        <foreignObject x={sx} y={sy} width={sw} height={sh} clipPath={`url(#${clipId})`}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {children}
          </div>
        </foreignObject>
      )}
      {/* Transparent punch-out — nothing drawn in screen area */}

      {/* ── Bezel inner edge highlight ── */}
      <path
        d={squircleRect(sx - 2, sy - 2, sw + 4, sh + 4, sr + 2)}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
        strokeWidth="2"
      />

      {/* ── Dynamic Island ── */}
      <rect
        x={diX}
        y={diY}
        width={diW}
        height={diH}
        rx={diR}
        ry={diR}
        fill="#050505"
        filter={`url(#${shadowDI})`}
      />
      {/* DI inner sheen */}
      <rect
        x={diX + 2}
        y={diY + 2}
        width={diW - 4}
        height={diH / 2 - 2}
        rx={diR - 1}
        ry={diR - 1}
        fill="#ffffff"
        fillOpacity="0.06"
      />

      {/* ── Top highlight line ── */}
      <line
        x1={outerR}
        y1="1.5"
        x2={W - outerR}
        y2="1.5"
        stroke={`url(#${gradHighlight})`}
        strokeWidth="2.5"
      />

      {/* ── Volume buttons (left side) ── */}
      {/* Silent toggle */}
      <rect x={-6} y={560} width={10} height={60} rx={5} fill={frameColor} />
      <rect x={-6} y={560} width={10} height={60} rx={5} fill="#ffffff" fillOpacity="0.12" />
      {/* Volume down */}
      <rect x={-8} y={660} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={660} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.10" />
      {/* Volume up */}
      <rect x={-8} y={820} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={820} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.10" />

      {/* ── Power button (right side) ── */}
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill={frameColor} />
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill="#ffffff" fillOpacity="0.10" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone 17 Pro
// Same frame geometry as 17 but titanium material + thinner inner bezels
// Frame: 1350 × 2760  |  Screen: x72 y69  1205 × 2621  |  radius: 120
// Titanium: sharper sheen, cooler neutral tone, prominent brushed highlights
// ---------------------------------------------------------------------------

export const IPhone17ProFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1350;
  const H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;
  const outerR = 155;
  const clipId = "screen-clip-17p";
  const diW = 290, diH = 88, diR = 44;
  const diX = (W - diW) / 2;
  const diY = 128;

  const gradEdge = "grad-edge-17p";
  const gradFace = "grad-face-17p";
  const gradTi = "grad-ti-17p";
  const shadowDI = "shadow-di-17p";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
      aria-label="iPhone 17 Pro frame"
    >
      <defs>
        {/* Titanium brushed horizontal sheen — slightly cooler/brighter at edges */}
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="5%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="95%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.20" />
        </linearGradient>
        {/* Vertical face shading */}
        <linearGradient id={gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="35%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        {/* Titanium band — diagonal brushed look */}
        <linearGradient id={gradTi} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.07" />
        </linearGradient>
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000000" floodOpacity="0.75" />
        </filter>
        <clipPath id={clipId}>
          <path d={squircleRect(sx, sy, sw, sh, sr)} />
        </clipPath>
      </defs>

      {/* Frame body */}
      <path d={squircleRect(0, 0, W, H, outerR)} fill={frameColor} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradEdge})`} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradFace})`} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradTi})`} />

      {/* Children */}
      {children && (
        <foreignObject x={sx} y={sy} width={sw} height={sh} clipPath={`url(#${clipId})`}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {children}
          </div>
        </foreignObject>
      )}

      {/* Bezel inner edge */}
      <path
        d={squircleRect(sx - 2, sy - 2, sw + 4, sh + 4, sr + 2)}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.07"
        strokeWidth="2"
      />

      {/* Dynamic Island */}
      <rect
        x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505"
        filter={`url(#${shadowDI})`}
      />
      <rect
        x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2} rx={diR - 1} ry={diR - 1}
        fill="#ffffff" fillOpacity="0.06"
      />

      {/* Top edge highlight — titanium is brighter here */}
      <line x1={outerR} y1="1" x2={W - outerR} y2="1" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2" />

      {/* Left rail stripe — titanium characteristic highlight */}
      <line x1="1" y1={outerR} x2="1" y2={H - outerR} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.5" />
      <line x1={W - 1} y1={outerR} x2={W - 1} y2={H - outerR} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.5" />

      {/* Volume buttons */}
      <rect x={-6} y={560} width={10} height={60} rx={5} fill={frameColor} />
      <rect x={-6} y={560} width={10} height={60} rx={5} fill="#ffffff" fillOpacity="0.14" />
      <rect x={-8} y={660} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={660} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.12" />
      <rect x={-8} y={820} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={820} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.12" />

      {/* Power button */}
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill={frameColor} />
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill="#ffffff" fillOpacity="0.12" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone 17 Pro Max
// Frame: 1470 × 3000  |  Screen: x75 y66  1319 × 2867  |  radius: 130
// Thinnest bezels, largest DI pill proportional to screen width
// ---------------------------------------------------------------------------

export const IPhone17ProMaxFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1470;
  const H = 3000;
  const sx = 75, sy = 66, sw = 1319, sh = 2867, sr = 130;
  const outerR = 168;
  const clipId = "screen-clip-17pm";
  // DI slightly wider on Pro Max (proportional to wider screen)
  const diW = 318, diH = 92, diR = 46;
  const diX = (W - diW) / 2;
  const diY = 124;

  const gradEdge = "grad-edge-17pm";
  const gradFace = "grad-face-17pm";
  const gradTi = "grad-ti-17pm";
  const shadowDI = "shadow-di-17pm";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
      aria-label="iPhone 17 Pro Max frame"
    >
      <defs>
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.19" />
          <stop offset="5%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="95%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.21" />
        </linearGradient>
        <linearGradient id={gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.11" />
          <stop offset="35%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={gradTi} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.07" />
        </linearGradient>
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.78" />
        </filter>
        <clipPath id={clipId}>
          <path d={squircleRect(sx, sy, sw, sh, sr)} />
        </clipPath>
      </defs>

      <path d={squircleRect(0, 0, W, H, outerR)} fill={frameColor} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradEdge})`} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradFace})`} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradTi})`} />

      {children && (
        <foreignObject x={sx} y={sy} width={sw} height={sh} clipPath={`url(#${clipId})`}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {children}
          </div>
        </foreignObject>
      )}

      {/* Ultra-thin bezel inner ring */}
      <path
        d={squircleRect(sx - 1.5, sy - 1.5, sw + 3, sh + 3, sr + 1.5)}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.07"
        strokeWidth="1.5"
      />

      {/* Dynamic Island */}
      <rect
        x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505"
        filter={`url(#${shadowDI})`}
      />
      <rect
        x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2} rx={diR - 1} ry={diR - 1}
        fill="#ffffff" fillOpacity="0.06"
      />

      <line x1={outerR} y1="1" x2={W - outerR} y2="1" stroke="#ffffff" strokeOpacity="0.30" strokeWidth="2" />
      <line x1="1" y1={outerR} x2="1" y2={H - outerR} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />
      <line x1={W - 1} y1={outerR} x2={W - 1} y2={H - outerR} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />

      {/* Volume buttons */}
      <rect x={-6} y={600} width={10} height={65} rx={5} fill={frameColor} />
      <rect x={-6} y={600} width={10} height={65} rx={5} fill="#ffffff" fillOpacity="0.14" />
      <rect x={-8} y={710} width={12} height={140} rx={6} fill={frameColor} />
      <rect x={-8} y={710} width={12} height={140} rx={6} fill="#ffffff" fillOpacity="0.12" />
      <rect x={-8} y={885} width={12} height={140} rx={6} fill={frameColor} />
      <rect x={-8} y={885} width={12} height={140} rx={6} fill="#ffffff" fillOpacity="0.12" />

      {/* Power button */}
      <rect x={W - 4} y={880} width={12} height={215} rx={6} fill={frameColor} />
      <rect x={W - 4} y={880} width={12} height={215} rx={6} fill="#ffffff" fillOpacity="0.12" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone Air
// Frame: 1380 × 2880  |  Screen: x60 y72  1259 × 2735  |  radius: 125
// Thinnest side rails (60px), aluminum, slightly softer highlights
// ---------------------------------------------------------------------------

export const IPhoneAirFrame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1380;
  const H = 2880;
  const sx = 60, sy = 72, sw = 1259, sh = 2735, sr = 125;
  const outerR = 158;
  const clipId = "screen-clip-air";
  // Air: slightly narrower DI pill to match thinner profile
  const diW = 285, diH = 86, diR = 43;
  const diX = (W - diW) / 2;
  const diY = 130;

  const gradEdge = "grad-edge-air";
  const gradFace = "grad-face-air";
  const shadowDI = "shadow-di-air";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
      aria-label="iPhone Air frame"
    >
      <defs>
        {/* Aluminum — warmer, softer sheen than titanium */}
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="6%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="94%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
        </linearGradient>
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000000" floodOpacity="0.70" />
        </filter>
        <clipPath id={clipId}>
          <path d={squircleRect(sx, sy, sw, sh, sr)} />
        </clipPath>
      </defs>

      <path d={squircleRect(0, 0, W, H, outerR)} fill={frameColor} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradEdge})`} />
      <path d={squircleRect(0, 0, W, H, outerR)} fill={`url(#${gradFace})`} />

      {children && (
        <foreignObject x={sx} y={sy} width={sw} height={sh} clipPath={`url(#${clipId})`}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {children}
          </div>
        </foreignObject>
      )}

      {/* Razor-thin bezel inner edge — Air's thinness is its statement */}
      <path
        d={squircleRect(sx - 1.5, sy - 1.5, sw + 3, sh + 3, sr + 1.5)}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
        strokeWidth="1.5"
      />

      {/* Dynamic Island */}
      <rect
        x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505"
        filter={`url(#${shadowDI})`}
      />
      <rect
        x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2} rx={diR - 1} ry={diR - 1}
        fill="#ffffff" fillOpacity="0.05"
      />

      <line x1={outerR} y1="1.5" x2={W - outerR} y2="1.5" stroke="#ffffff" strokeOpacity="0.26" strokeWidth="2" />

      {/* Volume buttons — slightly shorter for thinner profile aesthetic */}
      <rect x={-6} y={570} width={10} height={58} rx={5} fill={frameColor} />
      <rect x={-6} y={570} width={10} height={58} rx={5} fill="#ffffff" fillOpacity="0.11" />
      <rect x={-8} y={668} width={12} height={126} rx={6} fill={frameColor} />
      <rect x={-8} y={668} width={12} height={126} rx={6} fill="#ffffff" fillOpacity="0.09" />
      <rect x={-8} y={824} width={12} height={126} rx={6} fill={frameColor} />
      <rect x={-8} y={824} width={12} height={126} rx={6} fill="#ffffff" fillOpacity="0.09" />

      {/* Power button */}
      <rect x={W - 4} y={830} width={12} height={195} rx={6} fill={frameColor} />
      <rect x={W - 4} y={830} width={12} height={195} rx={6} fill="#ffffff" fillOpacity="0.09" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const frames: Record<string, React.FC<FrameProps>> = {
  "iphone-17": IPhone17Frame,
  "iphone-17-pro": IPhone17ProFrame,
  "iphone-17-pro-max": IPhone17ProMaxFrame,
  "iphone-air": IPhoneAirFrame,
};
