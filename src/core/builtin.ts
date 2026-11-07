import type { Frame, Material, Pts } from '../types';

/** Materi bawaan: draf ilustrasi yang dibangkitkan dari sudut lengan. Belum divalidasi guru/sanggar Saman. */
type Key = { a: number; g: number }; // a: lengan atas, g: lengan bawah (0 = lurus ke bawah, + = keluar)
const POSE: Record<string, Key> = {
  paha: { a: 18, g: -30 },
  dada: { a: 70, g: -105 },
  samping: { a: 100, g: 100 },
  angkat: { a: 150, g: 170 },
};
const SEQ = ['paha', 'dada', 'paha', 'dada', 'samping', 'angkat', 'samping', 'angkat', 'dada', 'samping', 'dada', 'paha'];
const BEAT = 0.75;

function arm(side: 1 | -1, k: Key): number[] {
  const ra = (k.a * Math.PI) / 180;
  const rg = (k.g * Math.PI) / 180;
  const el = [side * 0.5 + side * Math.sin(ra) * 0.9, Math.cos(ra) * 0.9];
  const wr = [el[0] + side * Math.sin(rg) * 0.8, el[1] + Math.cos(rg) * 0.8];
  return [...el, ...wr];
}

const ease = (x: number) => x * x * (3 - 2 * x);
const lerpKey = (a: Key, b: Key, k: number): Key => ({ a: a.a + (b.a - a.a) * k, g: a.g + (b.g - a.g) * k });

function poseAt(t: number): Pts {
  const i = Math.min(SEQ.length - 1, Math.floor(t / BEAT));
  const next = Math.min(SEQ.length - 1, i + 1);
  const k = lerpKey(POSE[SEQ[i]], POSE[SEQ[next]], ease(Math.min(1, (t - i * BEAT) / BEAT)));
  const l = arm(1, k);
  const r = arm(-1, k);
  // urutan: lSh, rSh, lEl, rEl, lWr, rWr, lHip, rHip
  return [0.5, 0, -0.5, 0, l[0], l[1], r[0], r[1], l[2], l[3], r[2], r[3], 0.4, 1.7, -0.4, 1.7];
}

const duration = SEQ.length * BEAT;
const fps = 10;
const frames: Frame[] = [];
for (let t = 0; t <= duration + 1e-6; t += 1 / fps) frames.push({ t: +t.toFixed(3), p: poseAt(t) });

export const BUILTIN: Material = {
  id: 'saman-draf',
  title: 'Saman dasar (draf)',
  source: 'builtin',
  createdAt: 0,
  duration,
  fps,
  frames,
  segments: [
    { id: 's1', name: 'Tepuk paha dan dada', start: 0, end: 3 },
    { id: 's2', name: 'Ayun samping dan angkat', start: 3, end: 6 },
    { id: 's3', name: 'Rangkaian penutup', start: 6, end: duration },
  ],
  note: 'Draf ilustrasi, belum divalidasi guru atau sanggar Saman.',
};
