import { API, BASE_URL } from './urls';
import { MediaCachePolicy, SocialFileType } from '@/component/types/social';

export const mediaKey = (file: SocialFileType) => `${location.origin}:${file.fileId}:${file.cacheVersion}`;
export class MediaVersionMismatch extends Error {}
const aborted = () => new DOMException('Cancelled', 'AbortError');
let storageFailed = false;
let prepared: { key: string; blob: Blob } | null = null;
const warming = new Map<string, AbortController>();
let allowed = new Set<string>();
let policy: MediaCachePolicy = { enabled: false, maxBytes: 0, downloadTimeoutMs: 90000, noProgressTimeoutMs: 15000 };
let queue: Promise<unknown> = Promise.resolve();
const failedUntil = new Map<string, number>();
const pending = new Map<string, { promise: Promise<Blob>; controller: AbortController; users: number }>();

// Database stores blobs on disk; getAll() is deliberately avoided.
const database = () => new Promise<IDBDatabase>((resolve, reject) => {
  let finished = false;
  const timer = setTimeout(() => { finished = true; reject(new Error('Media database timeout')); }, 3000);
  const request = indexedDB.open('ssc-media-cache', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('videos');
  request.onerror = () => { finished = true; clearTimeout(timer); reject(request.error); };
  request.onblocked = () => { finished = true; clearTimeout(timer); reject(new Error('Media database blocked')); };
  request.onsuccess = () => {
    clearTimeout(timer);
    if (finished) { request.result.close(); return; }
    request.result.onversionchange = () => request.result.close();
    resolve(request.result);
  };
});
async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction('videos', mode);
      let request: IDBRequest<T>;
      // Include time queued behind a large blob commit; UI lookup has its own 100ms fallback.
      const timer = setTimeout(() => { try { tx.abort(); } catch { /* already complete */ } }, 120000);
      tx.oncomplete = () => { clearTimeout(timer); resolve(request?.result); };
      tx.onerror = tx.onabort = () => { clearTimeout(timer); reject(tx.error ?? new Error('Media transaction aborted')); };
      try { request = operation(tx.objectStore('videos')); }
      catch (error) { clearTimeout(timer); try { tx.abort(); } catch { /* noop */ } reject(error); }

    });
  } finally { db.close(); }
}
export async function removeCachedMedia(key: string) {
  if (prepared?.key === key) prepared = null;
  if (storageFailed) return;
  try { await transaction('readwrite', s => s.delete(key)); } catch { storageFailed = true; }
}
export function configureMediaCache(files: SocialFileType[], next: MediaCachePolicy | null) {
  policy = next ?? { ...policy, enabled: false };
  let used = 0;
  const keys = new Set<string>();
  if (policy.enabled && Number.isFinite(policy.maxBytes)) {
    files.forEach(file => {
      const key = mediaKey(file), size = file.sizeBytes;
      if (keys.has(key) || !file.cacheVersion || !Number.isFinite(size) || size <= 0 || used + size > policy.maxBytes) return;
      used += size; keys.add(key);
    });
  }
  allowed = keys;
  warming.forEach((controller, key) => { if (!allowed.has(key)) controller.abort(); });
  if (prepared && !allowed.has(prepared.key)) prepared = null;
  // Turning cache OFF must not erase saved videos or trigger fleet-wide downloads.
  if (!policy.enabled || storageFailed) return;
  void transaction('readonly', s => s.getAllKeys()).then(async stored => {
    for (const key of stored) if (!allowed.has(String(key))) await transaction('readwrite', s => allowed.has(String(key)) ? s.getKey(key) : s.delete(key));
  }).catch(() => { storageFailed = true; });
}
export const canCacheMedia = (file: SocialFileType) => policy.enabled && !storageFailed && allowed.has(mediaKey(file));

async function download(file: SocialFileType, controller: AbortController): Promise<Blob> {
  const limits = { ...policy };
  const total = setTimeout(() => controller.abort(), limits.downloadTimeoutMs);
  let idle: ReturnType<typeof setTimeout>;
  const progress = () => { clearTimeout(idle); idle = setTimeout(() => controller.abort(), limits.noProgressTimeoutMs); };
  progress();
  try {
    const response = await fetch(`${BASE_URL}${API.SOCIAL.MEDIA(file.fileId, file.cacheVersion)}`, { signal: controller.signal });
    if (response.status === 409) throw new MediaVersionMismatch('Media version changed');
    if (response.status !== 200 || !response.body) throw new Error('Incomplete media response');
    const mime = response.headers.get('Content-Type')?.split(';')[0];
    if (!mime?.startsWith('video/')) throw new Error('Unexpected media type');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        progress(); length += value.byteLength;
        if (length > file.sizeBytes) throw new Error('Media size exceeded');
        chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    if (length !== file.sizeBytes) throw new Error('Media size mismatch');
    const blob = new Blob(chunks as BlobPart[], { type: mime });
    if (controller.signal.aborted) throw aborted();
    try {
      // Large blobs can take several seconds to commit on Android storage.
      // Admission may have changed while the file was being downloaded.
      if (allowed.has(mediaKey(file))) await transaction('readwrite', s => s.put({ blob, byteLength: length, lastUsedAt: Date.now() }, mediaKey(file)));
    } catch (error) {
      // One quota retry after unused-file cleanup; retain the downloaded blob on failure.
      try {
        if ((error as DOMException)?.name !== 'QuotaExceededError') throw error;
        const keys = await transaction('readonly', s => s.getAllKeys());
        for (const key of keys) if (!allowed.has(String(key))) await transaction('readwrite', s => s.delete(key));
        if (allowed.has(mediaKey(file))) await transaction('readwrite', s => s.put({ blob, byteLength: length, lastUsedAt: Date.now() }, mediaKey(file)));
      } catch { storageFailed = true; }
    }
    return blob;
  } finally { clearTimeout(total); clearTimeout(idle); }
}
/** Only one prepared blob is retained in memory; the playlist remains on disk. */
export const preparedMedia = (file: SocialFileType) => prepared?.key === mediaKey(file) ? prepared.blob : null;
export async function readCachedMedia(file: SocialFileType, signal: AbortSignal): Promise<Blob | null> {
  if (!canCacheMedia(file)) return null;
  if (preparedMedia(file)) return preparedMedia(file);
  try {
    const stored = await transaction<any>('readonly', s => s.get(mediaKey(file)));
    if (signal.aborted) throw aborted();
    if (stored?.blob instanceof Blob && stored.blob.size === file.sizeBytes && stored.blob.type.startsWith('video/')) {
      prepared = { key: mediaKey(file), blob: stored.blob }; return stored.blob;
    }
    if (stored) await transaction('readwrite', s => s.delete(mediaKey(file)));
  } catch (error) {
    if (signal.aborted) throw aborted();
    storageFailed = true;
  }
  return null;
}
/** Warm-up lifetime follows the playlist, not a playing video's ended event. */
export function warmCachedMedia(file: SocialFileType): Promise<void> {
  const key = mediaKey(file);
  if (!canCacheMedia(file) || warming.has(key) || preparedMedia(file)) return Promise.resolve();
  const controller = new AbortController(); warming.set(key, controller);
  return loadCachedMedia(file, controller.signal).then(blob => {
    if (blob && !controller.signal.aborted && allowed.has(key)) prepared = { key, blob };
  }).finally(() => { if (warming.get(key) === controller) warming.delete(key); });
}
export async function loadCachedMedia(file: SocialFileType, signal: AbortSignal): Promise<Blob | null> {
  if (!canCacheMedia(file)) return null;
  const key = mediaKey(file);
  if ((failedUntil.get(key) ?? 0) > Date.now()) return null;
  const stored = await readCachedMedia(file, signal);
  if (stored) return stored;
  if (!canCacheMedia(file)) return null;
  if (signal.aborted) throw aborted();
  let job = pending.get(key);
  if (!job || job.controller.signal.aborted) {
    const controller = new AbortController();
    const promise = queue.catch(() => {}).then(() => { if (controller.signal.aborted) throw aborted(); return download(file, controller); });
    job = { promise, controller, users: 0 }; pending.set(key, job);
    // The scheduler must not retain a completed large Blob in its resolved value.
    queue = promise.then(() => undefined, () => { failedUntil.set(key, Date.now() + 60000); });
    const own = job;
    void promise.finally(() => { if (pending.get(key) === own) pending.delete(key); }).catch(() => {});
  }
  const own = job; own.users++;
  return new Promise<Blob>((resolve, reject) => {
    let released = false;
    const release = () => { if (released) return; released = true; own.users--; signal.removeEventListener('abort', cancel); if (own.users === 0) own.controller.abort(); };
    const cancel = () => { release(); reject(aborted()); };
    signal.addEventListener('abort', cancel, { once: true });
    if (signal.aborted) { cancel(); return; }
    own.promise.then(blob => { if (!released) { release(); resolve(blob); } }, error => { if (!released) { release(); reject(error); } });
  });
}
