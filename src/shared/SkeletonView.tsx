import { useEffect, useRef } from 'react';
import { drawSkeleton, frameAt } from '../core/geometry';
import type { Frame, Pts } from '../types';

interface Props {
  frames?: Frame[];
  t?: number;
  pose?: Pts;
  size?: number;
}

/** Menggambar pose referensi (tampilan cermin agar cocok dengan kamera selfie). */
export function drawReference(ctx: CanvasRenderingContext2D, p: Pts, w: number, h: number, color = '#F2B53A') {
  ctx.clearRect(0, 0, w, h);
  const s = Math.min(w, h) * 0.2;
  const cx = w / 2;
  const cy = h * 0.34;
  drawSkeleton(ctx, p, (x, y) => [cx - x * s, cy + y * s], { color, width: Math.max(4, w / 70) });
}

export function SkeletonView({ frames, t = 0, pose, size = 360 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current?.getContext('2d');
    if (!c) return;
    drawReference(c, pose ?? frameAt(frames ?? [], t), size, size);
  }, [frames, t, pose, size]);
  return <canvas ref={ref} width={size} height={size} className="skel" aria-label="Pose referensi" />;
}
