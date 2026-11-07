/** 8 titik tubuh bagian atas, [x,y] berurutan: lSh, rSh, lEl, rEl, lWr, rWr, lHip, rHip.
 *  Dinormalisasi: pusat = tengah bahu, skala = lebar bahu, y ke bawah. */
export type Pts = number[];

export interface Frame {
  t: number; // detik
  p: Pts;
}

export interface Segment {
  id: string;
  name: string;
  start: number;
  end: number;
}

export interface Material {
  id: string;
  title: string;
  source: 'builtin' | 'upload';
  createdAt: number;
  duration: number;
  fps: number;
  segments: Segment[];
  frames: Frame[];
  note?: string;
}

export type Mode = 'belajar' | 'latihan' | 'uji';
