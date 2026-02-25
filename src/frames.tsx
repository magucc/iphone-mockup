import React from "react";

export interface FrameProps extends React.SVGAttributes<SVGSVGElement> {
  /** Hex color to tint the frame body. Defaults to near-black. */
  frameColor?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Smooth continuous-curvature corner path (clockwise). */
function squircleRect(x: number, y: number, w: number, h: number, r: number): string {
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

/**
 * Compound path: outer body with screen hole punched out.
 * Uses evenodd fill-rule to make the screen area transparent.
 */
function frameWithHole(
  W: number, H: number, outerR: number,
  sx: number, sy: number, sw: number, sh: number, sr: number,
): string {
  return `${squircleRect(0, 0, W, H, outerR)} ${squircleRect(sx, sy, sw, sh, sr)}`;
}

// ---------------------------------------------------------------------------
// iPhone 17
// ---------------------------------------------------------------------------

export const IPhone17Frame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1350, H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;
  const outerR = 155;
  const body = frameWithHole(W, H, outerR, sx, sy, sw, sh, sr);

  const diW = 295, diH = 90, diR = 45;
  const diX = (W - diW) / 2, diY = 128;

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
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="8%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="92%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={gradSide} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={gradHighlight} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Frame body with screen cutout */}
      <path d={body} fillRule="evenodd" fill={frameColor} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradEdge})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradSide})`} />

      {/* Bezel inner edge highlight */}
      <path
        d={squircleRect(sx - 2, sy - 2, sw + 4, sh + 4, sr + 2)}
        fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2"
      />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2}
        rx={diR - 1} ry={diR - 1} fill="#ffffff" fillOpacity="0.06" />

      {/* Top highlight */}
      <line x1={outerR} y1="1.5" x2={W - outerR} y2="1.5"
        stroke={`url(#${gradHighlight})`} strokeWidth="2.5" />

      {/* Volume buttons */}
      <rect x={-6} y={560} width={10} height={60} rx={5} fill={frameColor} />
      <rect x={-6} y={560} width={10} height={60} rx={5} fill="#ffffff" fillOpacity="0.12" />
      <rect x={-8} y={660} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={660} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.10" />
      <rect x={-8} y={820} width={12} height={130} rx={6} fill={frameColor} />
      <rect x={-8} y={820} width={12} height={130} rx={6} fill="#ffffff" fillOpacity="0.10" />

      {/* Power button */}
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill={frameColor} />
      <rect x={W - 4} y={820} width={12} height={200} rx={6} fill="#ffffff" fillOpacity="0.10" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone 17 Pro
// ---------------------------------------------------------------------------

export const IPhone17ProFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1350, H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;
  const outerR = 155;
  const body = frameWithHole(W, H, outerR, sx, sy, sw, sh, sr);

  const diW = 290, diH = 88, diR = 44;
  const diX = (W - diW) / 2, diY = 128;

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
        <linearGradient id={gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="5%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="95%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id={gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="35%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={gradTi} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.07" />
        </linearGradient>
        <filter id={shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000000" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* Frame body with screen cutout */}
      <path d={body} fillRule="evenodd" fill={frameColor} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradEdge})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradFace})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradTi})`} />

      {/* Bezel inner edge */}
      <path d={squircleRect(sx - 2, sy - 2, sw + 4, sh + 4, sr + 2)}
        fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2}
        rx={diR - 1} ry={diR - 1} fill="#ffffff" fillOpacity="0.06" />

      {/* Rail highlights */}
      <line x1={outerR} y1="1" x2={W - outerR} y2="1" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2" />
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
// ---------------------------------------------------------------------------

export const IPhone17ProMaxFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1470, H = 3000;
  const sx = 75, sy = 66, sw = 1319, sh = 2867, sr = 130;
  const outerR = 168;
  const body = frameWithHole(W, H, outerR, sx, sy, sw, sh, sr);

  const diW = 318, diH = 92, diR = 46;
  const diX = (W - diW) / 2, diY = 124;

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
      </defs>

      {/* Frame body with screen cutout */}
      <path d={body} fillRule="evenodd" fill={frameColor} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradEdge})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradFace})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradTi})`} />

      {/* Bezel inner ring */}
      <path d={squircleRect(sx - 1.5, sy - 1.5, sw + 3, sh + 3, sr + 1.5)}
        fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2}
        rx={diR - 1} ry={diR - 1} fill="#ffffff" fillOpacity="0.06" />

      {/* Rail highlights */}
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
// ---------------------------------------------------------------------------

export const IPhoneAirFrame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1380, H = 2880;
  const sx = 60, sy = 72, sw = 1259, sh = 2735, sr = 125;
  const outerR = 158;
  const body = frameWithHole(W, H, outerR, sx, sy, sw, sh, sr);

  const diW = 285, diH = 86, diR = 43;
  const diX = (W - diW) / 2, diY = 130;

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
      </defs>

      {/* Frame body with screen cutout */}
      <path d={body} fillRule="evenodd" fill={frameColor} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradEdge})`} />
      <path d={body} fillRule="evenodd" fill={`url(#${gradFace})`} />

      {/* Bezel inner edge */}
      <path d={squircleRect(sx - 1.5, sy - 1.5, sw + 3, sh + 3, sr + 1.5)}
        fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1.5" />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={diH / 2 - 2}
        rx={diR - 1} ry={diR - 1} fill="#ffffff" fillOpacity="0.05" />

      {/* Top highlight */}
      <line x1={outerR} y1="1.5" x2={W - outerR} y2="1.5" stroke="#ffffff" strokeOpacity="0.26" strokeWidth="2" />

      {/* Volume buttons */}
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
