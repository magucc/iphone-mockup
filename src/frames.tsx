import React from "react";

export interface FrameProps extends React.SVGAttributes<SVGSVGElement> {
  frameColor?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  return [
    `M ${x + r},${y}`,
    `L ${x + w - r},${y}`,
    `A ${r},${r} 0 0 1 ${x + w},${y + r}`,
    `L ${x + w},${y + h - r}`,
    `A ${r},${r} 0 0 1 ${x + w - r},${y + h}`,
    `L ${x + r},${y + h}`,
    `A ${r},${r} 0 0 1 ${x},${y + h - r}`,
    `L ${x},${y + r}`,
    `A ${r},${r} 0 0 1 ${x + r},${y}`,
    "Z",
  ].join(" ");
}

/** Unique ID counter to avoid collisions when multiple frames render */
let idCounter = 0;
function useFrameIds(prefix: string) {
  const [ids] = React.useState(() => {
    const n = ++idCounter;
    return {
      mask: `${prefix}-mask-${n}`,
      gradEdge: `${prefix}-ge-${n}`,
      gradFace: `${prefix}-gf-${n}`,
      gradTi: `${prefix}-gt-${n}`,
      gradHl: `${prefix}-gh-${n}`,
      shadowDI: `${prefix}-sdi-${n}`,
    };
  });
  return ids;
}

// ---------------------------------------------------------------------------
// iPhone 17  —  Frame: 1350×2760, Screen: x72 y69 1205×2621, r120
// ---------------------------------------------------------------------------

export const IPhone17Frame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1350, H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;
  const outerR = 155;
  const ids = useFrameIds("i17");

  const diW = 295, diH = 90, diR = 45;
  const diX = (W - diW) / 2, diY = 128;

  const outer = roundedRectPath(0, 0, W, H, outerR);
  const screen = roundedRectPath(sx, sy, sw, sh, sr);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      overflow="visible"
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
    >
      <defs>
        <mask id={ids.mask}>
          <path d={outer} fill="white" />
          <path d={screen} fill="black" />
        </mask>
        <linearGradient id={ids.gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={ids.gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <filter id={ids.shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Frame body — masked to punch out screen area */}
      <g mask={`url(#${ids.mask})`}>
        <path d={outer} fill={frameColor} />
        <path d={outer} fill={`url(#${ids.gradEdge})`} />
        <path d={outer} fill={`url(#${ids.gradFace})`} />
      </g>

      {/* Bezel inner highlight */}
      <path d={roundedRectPath(sx - 1, sy - 1, sw + 2, sh + 2, sr + 1)}
        fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="2" />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${ids.shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={(diH - 4) / 2}
        rx={diR - 2} ry={diR - 2} fill="#fff" fillOpacity="0.06" />

      {/* Buttons */}
      <rect x={-7} y={560} width={11} height={60} rx={3} fill={frameColor} />
      <rect x={-7} y={560} width={11} height={60} rx={3} fill="#fff" fillOpacity="0.12" />
      <rect x={-9} y={660} width={13} height={130} rx={4} fill={frameColor} />
      <rect x={-9} y={660} width={13} height={130} rx={4} fill="#fff" fillOpacity="0.10" />
      <rect x={-9} y={820} width={13} height={130} rx={4} fill={frameColor} />
      <rect x={-9} y={820} width={13} height={130} rx={4} fill="#fff" fillOpacity="0.10" />
      <rect x={W - 4} y={820} width={13} height={200} rx={4} fill={frameColor} />
      <rect x={W - 4} y={820} width={13} height={200} rx={4} fill="#fff" fillOpacity="0.10" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone 17 Pro  —  Frame: 1350×2760, Screen: x72 y69 1205×2621, r120
// ---------------------------------------------------------------------------

export const IPhone17ProFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1350, H = 2760;
  const sx = 72, sy = 69, sw = 1205, sh = 2621, sr = 120;
  const outerR = 155;
  const ids = useFrameIds("i17p");

  const diW = 290, diH = 88, diR = 44;
  const diX = (W - diW) / 2, diY = 128;

  const outer = roundedRectPath(0, 0, W, H, outerR);
  const screen = roundedRectPath(sx, sy, sw, sh, sr);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      overflow="visible"
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
    >
      <defs>
        <mask id={ids.mask}>
          <path d={outer} fill="white" />
          <path d={screen} fill="black" />
        </mask>
        <linearGradient id={ids.gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id={ids.gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="35%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={ids.gradTi} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.07" />
        </linearGradient>
        <filter id={ids.shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000" floodOpacity="0.75" />
        </filter>
      </defs>

      <g mask={`url(#${ids.mask})`}>
        <path d={outer} fill={frameColor} />
        <path d={outer} fill={`url(#${ids.gradEdge})`} />
        <path d={outer} fill={`url(#${ids.gradFace})`} />
        <path d={outer} fill={`url(#${ids.gradTi})`} />
      </g>

      <path d={roundedRectPath(sx - 1, sy - 1, sw + 2, sh + 2, sr + 1)}
        fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="2" />

      {/* Dynamic Island */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${ids.shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={(diH - 4) / 2}
        rx={diR - 2} ry={diR - 2} fill="#fff" fillOpacity="0.06" />

      {/* Rail highlights */}
      <line x1={outerR} y1="1" x2={W - outerR} y2="1" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" />
      <line x1="1" y1={outerR} x2="1" y2={H - outerR} stroke="#fff" strokeOpacity="0.16" strokeWidth="1.5" />
      <line x1={W - 1} y1={outerR} x2={W - 1} y2={H - outerR} stroke="#fff" strokeOpacity="0.16" strokeWidth="1.5" />

      {/* Buttons */}
      <rect x={-7} y={560} width={11} height={60} rx={3} fill={frameColor} />
      <rect x={-7} y={560} width={11} height={60} rx={3} fill="#fff" fillOpacity="0.14" />
      <rect x={-9} y={660} width={13} height={130} rx={4} fill={frameColor} />
      <rect x={-9} y={660} width={13} height={130} rx={4} fill="#fff" fillOpacity="0.12" />
      <rect x={-9} y={820} width={13} height={130} rx={4} fill={frameColor} />
      <rect x={-9} y={820} width={13} height={130} rx={4} fill="#fff" fillOpacity="0.12" />
      <rect x={W - 4} y={820} width={13} height={200} rx={4} fill={frameColor} />
      <rect x={W - 4} y={820} width={13} height={200} rx={4} fill="#fff" fillOpacity="0.12" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone 17 Pro Max  —  Frame: 1470×3000, Screen: x75 y66 1319×2867, r130
// ---------------------------------------------------------------------------

export const IPhone17ProMaxFrame: React.FC<FrameProps> = ({
  frameColor = "#1c1c1e",
  children,
  ...svgProps
}) => {
  const W = 1470, H = 3000;
  const sx = 75, sy = 66, sw = 1319, sh = 2867, sr = 130;
  const outerR = 168;
  const ids = useFrameIds("i17pm");

  const diW = 318, diH = 92, diR = 46;
  const diX = (W - diW) / 2, diY = 124;

  const outer = roundedRectPath(0, 0, W, H, outerR);
  const screen = roundedRectPath(sx, sy, sw, sh, sr);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      overflow="visible"
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
    >
      <defs>
        <mask id={ids.mask}>
          <path d={outer} fill="white" />
          <path d={screen} fill="black" />
        </mask>
        <linearGradient id={ids.gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.19" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.21" />
        </linearGradient>
        <linearGradient id={ids.gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.11" />
          <stop offset="35%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={ids.gradTi} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.07" />
        </linearGradient>
        <filter id={ids.shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.78" />
        </filter>
      </defs>

      <g mask={`url(#${ids.mask})`}>
        <path d={outer} fill={frameColor} />
        <path d={outer} fill={`url(#${ids.gradEdge})`} />
        <path d={outer} fill={`url(#${ids.gradFace})`} />
        <path d={outer} fill={`url(#${ids.gradTi})`} />
      </g>

      <path d={roundedRectPath(sx - 1, sy - 1, sw + 2, sh + 2, sr + 1)}
        fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="1.5" />

      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${ids.shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={(diH - 4) / 2}
        rx={diR - 2} ry={diR - 2} fill="#fff" fillOpacity="0.06" />

      <line x1={outerR} y1="1" x2={W - outerR} y2="1" stroke="#fff" strokeOpacity="0.30" strokeWidth="2" />
      <line x1="1" y1={outerR} x2="1" y2={H - outerR} stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" />
      <line x1={W - 1} y1={outerR} x2={W - 1} y2={H - outerR} stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" />

      <rect x={-7} y={600} width={11} height={65} rx={3} fill={frameColor} />
      <rect x={-7} y={600} width={11} height={65} rx={3} fill="#fff" fillOpacity="0.14" />
      <rect x={-9} y={710} width={13} height={140} rx={4} fill={frameColor} />
      <rect x={-9} y={710} width={13} height={140} rx={4} fill="#fff" fillOpacity="0.12" />
      <rect x={-9} y={885} width={13} height={140} rx={4} fill={frameColor} />
      <rect x={-9} y={885} width={13} height={140} rx={4} fill="#fff" fillOpacity="0.12" />
      <rect x={W - 4} y={880} width={13} height={215} rx={4} fill={frameColor} />
      <rect x={W - 4} y={880} width={13} height={215} rx={4} fill="#fff" fillOpacity="0.12" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// iPhone Air  —  Frame: 1380×2880, Screen: x60 y72 1259×2735, r125
// ---------------------------------------------------------------------------

export const IPhoneAirFrame: React.FC<FrameProps> = ({
  frameColor = "#1a1a1a",
  children,
  ...svgProps
}) => {
  const W = 1380, H = 2880;
  const sx = 60, sy = 72, sw = 1259, sh = 2735, sr = 125;
  const outerR = 158;
  const ids = useFrameIds("iair");

  const diW = 285, diH = 86, diR = 43;
  const diX = (W - diW) / 2, diY = 130;

  const outer = roundedRectPath(0, 0, W, H, outerR);
  const screen = roundedRectPath(sx, sy, sw, sh, sr);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      overflow="visible"
      {...svgProps}
      style={{ ...svgProps.style, display: "block" }}
    >
      <defs>
        <mask id={ids.mask}>
          <path d={outer} fill="white" />
          <path d={screen} fill="black" />
        </mask>
        <linearGradient id={ids.gradEdge} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={ids.gradFace} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
        <filter id={ids.shadowDI} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.70" />
        </filter>
      </defs>

      <g mask={`url(#${ids.mask})`}>
        <path d={outer} fill={frameColor} />
        <path d={outer} fill={`url(#${ids.gradEdge})`} />
        <path d={outer} fill={`url(#${ids.gradFace})`} />
      </g>

      <path d={roundedRectPath(sx - 1, sy - 1, sw + 2, sh + 2, sr + 1)}
        fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="1.5" />

      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} ry={diR}
        fill="#050505" filter={`url(#${ids.shadowDI})`} />
      <rect x={diX + 2} y={diY + 2} width={diW - 4} height={(diH - 4) / 2}
        rx={diR - 2} ry={diR - 2} fill="#fff" fillOpacity="0.05" />

      <line x1={outerR} y1="1.5" x2={W - outerR} y2="1.5" stroke="#fff" strokeOpacity="0.26" strokeWidth="2" />

      <rect x={-7} y={570} width={11} height={58} rx={3} fill={frameColor} />
      <rect x={-7} y={570} width={11} height={58} rx={3} fill="#fff" fillOpacity="0.11" />
      <rect x={-9} y={668} width={13} height={126} rx={4} fill={frameColor} />
      <rect x={-9} y={668} width={13} height={126} rx={4} fill="#fff" fillOpacity="0.09" />
      <rect x={-9} y={824} width={13} height={126} rx={4} fill={frameColor} />
      <rect x={-9} y={824} width={13} height={126} rx={4} fill="#fff" fillOpacity="0.09" />
      <rect x={W - 4} y={830} width={13} height={195} rx={4} fill={frameColor} />
      <rect x={W - 4} y={830} width={13} height={195} rx={4} fill="#fff" fillOpacity="0.09" />
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
