import { detectUpper, getPose } from './pose';
import type { Frame, Material, Segment } from '../types';

export interface AnalyzeOptions {
  title: string;
  fps: number;
  segmentSec: number;
}

export function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function buildSegments(duration: number, segmentSec: number): Segment[] {
  const out: Segment[] = [];
  const n = Math.max(1, Math.round(duration / segmentSec));
  const len = duration / n;
  for (let i = 0; i < n; i++) {
    out.push({ id: makeId(), name: `Segmen ${i + 1}`, start: +(i * len).toFixed(2), end: +((i + 1) * len).toFixed(2) });
  }
  return out;
}

function seek(v: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve) => {
    if (Math.abs(v.currentTime - t) < 1e-3) return resolve();
    const done = () => {
      v.removeEventListener('seeked', done);
      resolve();
    };
    v.addEventListener('seeked', done);
    v.currentTime = t;
  });
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadeddata = () => resolve(v);
    v.onerror = () => reject(new Error('Video tidak bisa dibaca. Coba format MP4 atau WebM.'));
    v.src = url;
  });
}

/** Video → materi. Semua dikerjakan di browser; video tidak dikirim ke mana pun. */
export async function analyzeVideo(
  file: File,
  opts: AnalyzeOptions,
  onProgress: (ratio: number) => void,
  signal: AbortSignal,
): Promise<Material> {
  const url = URL.createObjectURL(file);
  try {
    const video = await loadVideo(url);
    const duration = video.duration;
    if (!isFinite(duration) || duration < 1) throw new Error('Durasi video terlalu pendek.');
    const pose = await getPose();
    const frames: Frame[] = [];
    const step = 1 / opts.fps;
    const total = Math.floor(duration / step);
    let missed = 0;
    for (let i = 0; i <= total; i++) {
      if (signal.aborted) throw new DOMException('Dibatalkan', 'AbortError');
      const t = Math.min(i * step, duration - 0.05);
      await seek(video, t);
      const det = detectUpper(pose, video, performance.now());
      if (det) frames.push({ t: +t.toFixed(3), p: det.p.map((n) => +n.toFixed(4)) });
      else missed++;
      onProgress(i / total);
    }
    if (frames.length < Math.max(5, total * 0.3)) {
      throw new Error(
        `Tubuh bagian atas hanya terdeteksi di ${frames.length} dari ${total + 1} frame. Pastikan penari satu orang, menghadap kamera, dan bahu sampai pinggul terlihat.`,
      );
    }
    return {
      id: makeId(),
      title: opts.title.trim() || file.name.replace(/\.[^.]+$/, ''),
      source: 'upload',
      createdAt: Date.now(),
      duration: +duration.toFixed(2),
      fps: opts.fps,
      segments: buildSegments(duration, opts.segmentSec),
      frames,
      note: missed > 0 ? `${missed} frame tanpa deteksi dilewati.` : undefined,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
