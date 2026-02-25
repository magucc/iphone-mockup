export interface DeviceColor {
  name: string;
  hex: string;
  frame: string;
}

export interface Device {
  id: string;
  name: string;
  frameWidth: number;
  frameHeight: number;
  screen: { x: number; y: number; width: number; height: number };
  screenRadius: number;
  colors: DeviceColor[];
}

export const devices: Device[] = [
  {
    id: "iphone-17",
    name: "iPhone 17",
    frameWidth: 1350,
    frameHeight: 2760,
    screen: { x: 72, y: 69, width: 1205, height: 2621 },
    screenRadius: 120,
    colors: [
      { name: "Black", hex: "#1a1a1a", frame: "frames/iphone-17-black.png" },
      { name: "White", hex: "#e0ddd8", frame: "frames/iphone-17-white.png" },
      { name: "Lavender", hex: "#b1a4c0", frame: "frames/iphone-17-lavender.png" },
      { name: "Mist Blue", hex: "#8ba1b3", frame: "frames/iphone-17-mist-blue.png" },
      { name: "Sage", hex: "#8a9a7b", frame: "frames/iphone-17-sage.png" },
    ],
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    frameWidth: 1350,
    frameHeight: 2760,
    screen: { x: 72, y: 69, width: 1205, height: 2621 },
    screenRadius: 120,
    colors: [
      { name: "Silver", hex: "#c0bfbd", frame: "frames/iphone-17-pro-silver.png" },
      { name: "Deep Blue", hex: "#1b3a5c", frame: "frames/iphone-17-pro-deep-blue.png" },
      { name: "Cosmic Orange", hex: "#c47a3c", frame: "frames/iphone-17-pro-cosmic-orange.png" },
    ],
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    frameWidth: 1470,
    frameHeight: 3000,
    screen: { x: 75, y: 66, width: 1319, height: 2867 },
    screenRadius: 130,
    colors: [
      { name: "Silver", hex: "#c0bfbd", frame: "frames/iphone-17-pro-max-silver.png" },
      { name: "Deep Blue", hex: "#1b3a5c", frame: "frames/iphone-17-pro-max-deep-blue.png" },
      { name: "Cosmic Orange", hex: "#c47a3c", frame: "frames/iphone-17-pro-max-cosmic-orange.png" },
    ],
  },
  {
    id: "iphone-air",
    name: "iPhone Air",
    frameWidth: 1380,
    frameHeight: 2880,
    screen: { x: 60, y: 72, width: 1259, height: 2735 },
    screenRadius: 125,
    colors: [
      { name: "Space Black", hex: "#1a1a1a", frame: "frames/iphone-air-space-black.png" },
      { name: "Cloud White", hex: "#e8e5e0", frame: "frames/iphone-air-cloud-white.png" },
      { name: "Light Gold", hex: "#c5b18a", frame: "frames/iphone-air-light-gold.png" },
      { name: "Sky Blue", hex: "#7fa8c4", frame: "frames/iphone-air-sky-blue.png" },
    ],
  },
];
