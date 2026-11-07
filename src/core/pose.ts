import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { normalize } from './geometry';
import type { Pts } from '../types';

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const UPPER = [11, 12, 13, 14, 15, 16, 23, 24];

let cached: Promise<PoseLandmarker> | null = null;
let lastTs = 0;

/** Satu instance dipakai bersama (sisi belajar & studio). Mencoba GPU, fallback ke CPU. */
export function getPose(): Promise<PoseLandmarker> {
  if (!cached) {
    const p = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM);
      const make = (delegate: 'GPU' | 'CPU') =>
        PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
      try {
        return await make('GPU');
      } catch {
        return await make('CPU');
      }
    })();
    p.catch(() => {
      cached = null;
    });
    cached = p;
  }
  return cached;
}

export interface Detection {
  /** pose ternormalisasi untuk penilaian */
  p: Pts;
  /** titik mentah (0..1) untuk digambar di atas kamera */
  raw: Pts;
}

export function detectUpper(lm: PoseLandmarker, video: HTMLVideoElement, tsMs: number): Detection | null {
  lastTs = Math.max(tsMs, lastTs + 1);
  const res = lm.detectForVideo(video, lastTs);
  const l = res.landmarks[0];
  if (!l) return null;
  const sel = UPPER.map((i) => l[i]);
  if (sel.some((q) => (q.visibility ?? 1) < 0.4)) return null;
  const raw = sel.flatMap((q) => [q.x, q.y]);
  const aspect = video.videoWidth / (video.videoHeight || 1);
  return { raw, p: normalize(raw, aspect) };
}
