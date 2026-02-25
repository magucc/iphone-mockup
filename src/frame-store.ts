/**
 * IndexedDB store for custom device frame PNGs.
 * Frames persist across sessions in the browser.
 */

const DB_NAME = "mockup-frames";
const DB_VERSION = 1;
const STORE_NAME = "frames";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Key format: "iphone-17/black" (deviceId/colorName lowercase) */
function frameKey(deviceId: string, colorName: string): string {
  return `${deviceId}/${colorName.toLowerCase().replace(/\s+/g, "-")}`;
}

/** Save a frame PNG as a Blob */
export async function saveFrame(deviceId: string, colorName: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, frameKey(deviceId, colorName));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Load a frame PNG as an object URL (caller must revoke when done) */
export async function loadFrame(deviceId: string, colorName: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(frameKey(deviceId, colorName));
    req.onsuccess = () => {
      if (req.result) {
        resolve(URL.createObjectURL(req.result));
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/** Check which frames exist for a device */
export async function listFrames(deviceId: string): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    req.onsuccess = () => {
      const prefix = `${deviceId}/`;
      const keys = (req.result as string[])
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.slice(prefix.length));
      resolve(keys);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Delete a specific frame */
export async function deleteFrame(deviceId: string, colorName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(frameKey(deviceId, colorName));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
