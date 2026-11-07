import { FEATURE_NAMES, features, frameAt } from './geometry';
import type { Frame, Pts } from '../types';

/** Toleransi selisih sudut (derajat). Sementara, belum dikalibrasi dengan data penari. */
export const TOLERANCE = 50;
/** Toleransi keterlambatan gerak pengguna (detik). */
const LAG = 0.25;
export const TIER_GOOD = 80;
export const TIER_OK = 60;

function poseScore(a: Pts, b: Pts): number {
  const fa = features(a);
  const fb = features(b);
  let sum = 0;
  for (let i = 0; i < fa.length; i++) sum += Math.max(0, 1 - Math.abs(fa[i] - fb[i]) / TOLERANCE);
  return sum / fa.length;
}

/** Skor 0..100: pose pengguna vs frame referensi terbaik di sekitar waktu t. */
export function matchScore(user: Pts, frames: Frame[], t: number): number {
  let best = -1;
  for (const f of frames) {
    if (Math.abs(f.t - t) > LAG) continue;
    best = Math.max(best, poseScore(user, f.p));
  }
  if (best < 0) best = poseScore(user, frameAt(frames, t));
  return Math.round(best * 100);
}

export function tier(score: number): 'Bagus' | 'Cukup' | 'Ulangi' {
  return score >= TIER_GOOD ? 'Bagus' : score >= TIER_OK ? 'Cukup' : 'Ulangi';
}

/** Petunjuk perbaikan dari fitur dengan selisih terbesar. */
export function hint(user: Pts, ref: Pts): string {
  const fu = features(user);
  const fr = features(ref);
  let worst = 0;
  let diff = 0;
  fu.forEach((v, i) => {
    const d = v - fr[i];
    if (Math.abs(d) > Math.abs(diff)) {
      diff = d;
      worst = i;
    }
  });
  if (Math.abs(diff) < 20) return 'Gerakan sudah sesuai. Pertahankan.';
  const name = FEATURE_NAMES[worst];
  if (worst < 2) return diff < 0 ? `Luruskan ${name} sedikit.` : `Tekuk ${name} lebih dalam.`;
  return diff < 0 ? `Angkat ${name} lebih tinggi.` : `Turunkan ${name} sedikit.`;
}
