import { useState, useRef, useCallback, useEffect } from "react";
import { devices, type Device, type DeviceColor } from "./devices";
import { frames } from "./frames";

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>(devices[0]);
  const [color, setColor] = useState<DeviceColor>(devices[0].colors[0]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparentBg, setTransparentBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    },
    [handleFile]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const selectDevice = (d: Device) => {
    setDevice(d);
    setColor(d.colors[0]);
  };

  const renderToCanvas = useCallback(async (): Promise<HTMLCanvasElement> => {
    const padding = 80;
    const canvas = document.createElement("canvas");
    canvas.width = device.frameWidth + padding * 2;
    canvas.height = device.frameHeight + padding * 2;
    const ctx = canvas.getContext("2d")!;

    if (!transparentBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw screenshot clipped to screen area
    if (image) {
      const s = device.screen;
      const screenImg = await loadImage(image);
      ctx.save();
      roundedRect(ctx, padding + s.x, padding + s.y, s.width, s.height, device.screenRadius);
      ctx.clip();
      const crop = coverFit(screenImg.width, screenImg.height, s.width, s.height);
      ctx.drawImage(screenImg, crop.sx, crop.sy, crop.sw, crop.sh, padding + s.x, padding + s.y, s.width, s.height);
      ctx.restore();
    }

    // Serialize SVG from DOM and draw on canvas
    const svgEl = frameRef.current?.querySelector("svg");
    if (svgEl) {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", String(device.frameWidth));
      clone.setAttribute("height", String(device.frameHeight));
      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const frameImg = await loadImage(url);
      URL.revokeObjectURL(url);
      ctx.drawImage(frameImg, padding, padding, device.frameWidth, device.frameHeight);
    }

    return canvas;
  }, [device, image, bgColor, transparentBg]);

  const handleDownload = async () => {
    const canvas = await renderToCanvas();
    const link = document.createElement("a");
    link.download = `mockup-${device.id}-${color.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    const canvas = await renderToCanvas();
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    }, "image/png");
  };

  const FrameComponent = frames[device.id];
  const previewScale = 0.25;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Mockup Generator</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-zinc-800 p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
          <section>
            <Label>Device</Label>
            <div className="flex flex-col gap-1">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectDevice(d)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    device.id === d.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {device.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color.hex === c.hex
                      ? "border-white scale-110"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </section>

          <section>
            <Label>Background</Label>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="accent-zinc-500"
              />
              Transparent
            </label>
            {!transparentBg && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 w-24 font-mono"
                />
              </div>
            )}
          </section>

          <section>
            <Label>Screenshot</Label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors"
            >
              {image ? "Replace image" : "Choose file"}
            </button>
            <p className="text-xs text-zinc-500 mt-1.5">Or drag & drop / paste (Cmd+V)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </section>

          <section className="mt-auto flex flex-col gap-2">
            <button
              onClick={handleDownload}
              disabled={!image}
              className="w-full py-2.5 px-3 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Download PNG
            </button>
            <button
              onClick={handleCopy}
              disabled={!image}
              className="w-full py-2.5 px-3 rounded-lg bg-zinc-800 text-zinc-200 font-medium text-sm hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Copy to clipboard
            </button>
          </section>
        </aside>

        {/* Preview */}
        <main
          className="flex-1 flex items-center justify-center overflow-auto p-8"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {!image ? (
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-16 text-center max-w-md">
              <p className="text-zinc-400 text-lg mb-2">Drop a screenshot here</p>
              <p className="text-zinc-600 text-sm">or paste from clipboard (Cmd+V)</p>
            </div>
          ) : (
            <div
              ref={frameRef}
              className="relative shrink-0"
              style={{
                width: device.frameWidth * previewScale,
                height: device.frameHeight * previewScale,
              }}
            >
              {/* Screenshot layer */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: device.screen.x * previewScale,
                  top: device.screen.y * previewScale,
                  width: device.screen.width * previewScale,
                  height: device.screen.height * previewScale,
                  borderRadius: device.screenRadius * previewScale,
                }}
              >
                <img src={image} alt="Screenshot" className="w-full h-full object-cover" />
              </div>
              {/* SVG frame layer */}
              {FrameComponent && (
                <FrameComponent
                  frameColor={color.hex}
                  className="w-full h-full relative z-10 pointer-events-none"
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
      {children}
    </span>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function coverFit(srcW: number, srcH: number, dstW: number, dstH: number) {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;
  if (srcAspect > dstAspect) {
    const sw = srcH * dstAspect;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  } else {
    const sh = srcW / dstAspect;
    return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
  }
}

export default App;
