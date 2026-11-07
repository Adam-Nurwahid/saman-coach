import type { Frame, Pts } from '../types';

export const IDX = { lSh: 0, rSh: 1, lEl: 2, rEl: 3, lWr: 4, rWr: 5, lHip: 6, rHip: 7 } as const;
type V = [number, number];
const pt = (p: Pts, i: number): V => [p[i * 2], p[i * 2 + 1]];

export function angle(a: V, b: V, c: V): number {
  const v1 = [a[0] - b[0], a[1] - b[1]];
  const v2 = [c[0] - b[0], c[1] - b[1]];
  const m = Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1]);
  if (m < 1e-6) return 0;
  const d = (v1[0] * v2[0] + v1[1] * v2[1]) / m;
  return (Math.acos(Math.max(-1, Math.min(1, d))) * 180) / Math.PI;
}

/** Fitur sudut: siku kiri, siku kanan, bahu kiri, bahu kanan (derajat). */
export function features(p: Pts): number[] {
  return [
    angle(pt(p, IDX.lSh), pt(p, IDX.lEl), pt(p, IDX.lWr)),
    angle(pt(p, IDX.rSh), pt(p, IDX.rEl), pt(p, IDX.rWr)),
    angle(pt(p, IDX.lHip), pt(p, IDX.lSh), pt(p, IDX.lEl)),
    angle(pt(p, IDX.rHip), pt(p, IDX.rSh), pt(p, IDX.rEl)),
  ];
}
export const FEATURE_NAMES = ['siku kiri', 'siku kanan', 'lengan kiri', 'lengan kanan'];

/** raw = 8 titik [x,y] koordinat gambar (0..1). aspect = lebar/tinggi video. */
export function normalize(raw: number[], aspect: number): Pts {
  const x = (i: number) => raw[i * 2] * aspect;
  const y = (i: number) => raw[i * 2 + 1];
  const cx = (x(0) + x(1)) / 2;
  const cy = (y(0) + y(1)) / 2;
  const s = Math.hypot(x(0) - x(1), y(0) - y(1)) || 1;
  const out: number[] = [];
  for (let i = 0; i < 8; i++) out.push((x(i) - cx) / s, (y(i) - cy) / s);
  return out;
}

export function frameAt(frames: Frame[], t: number): Pts {
  if (frames.length === 0) return new Array(16).fill(0);
  if (t <= frames[0].t) return frames[0].p;
  const last = frames[frames.length - 1];
  if (t >= last.t) return last.p;
  let lo = 0;
  let hi = frames.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (frames[mid].t <= t) lo = mid;
    else hi = mid;
  }
  const a = frames[lo];
  const b = frames[hi];
  const k = (t - a.t) / (b.t - a.t || 1);
  return a.p.map((v, i) => v + (b.p[i] - v) * k);
}

const BONES: [number, number][] = [
  [IDX.lSh, IDX.rSh], [IDX.lSh, IDX.lHip], [IDX.rSh, IDX.rHip], [IDX.lHip, IDX.rHip],
  [IDX.lSh, IDX.lEl], [IDX.lEl, IDX.lWr], [IDX.rSh, IDX.rEl], [IDX.rEl, IDX.rWr],
];

export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  p: Pts,
  map: (x: number, y: number) => V,
  style: { color: string; width: number },
) {
  const m = (i: number) => map(p[i * 2], p[i * 2 + 1]);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.color;
  ctx.lineWidth = style.width;
  for (const [a, b] of BONES) {
    const A = m(a);
    const B = m(b);
    ctx.beginPath();
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const q = m(i);
    ctx.beginPath();
    ctx.arc(q[0], q[1], style.width * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  // kepala: di atas tengah bahu
  const sx = (p[0] + p[2]) / 2;
  const sy = (p[1] + p[3]) / 2;
  const sw = Math.hypot(p[0] - p[2], p[1] - p[3]);
  const h = map(sx, sy - sw * 0.75);
  const e = map(sx + sw * 0.38, sy - sw * 0.75);
  ctx.beginPath();
  ctx.arc(h[0], h[1], Math.hypot(e[0] - h[0], e[1] - h[1]), 0, Math.PI * 2);
  ctx.stroke();
}
