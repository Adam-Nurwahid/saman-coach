import { useEffect, useState } from 'react';
import { BUILTIN } from '../core/builtin';
import type { Material } from '../types';

const MATERIALS = 'saman-coach:materials:v1';
const BEST = 'saman-coach:best:v1';
const EVENT = 'sc-store';

function read<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error('Penyimpanan browser penuh. Hapus materi lama atau ekspor ke JSON dulu.');
  }
  window.dispatchEvent(new Event(EVENT));
}

export const uploads = (): Material[] => read<Material[]>(MATERIALS, []);
export const allMaterials = (): Material[] => [BUILTIN, ...uploads()];
export const getMaterial = (id: string): Material | undefined => allMaterials().find((m) => m.id === id);

export function saveMaterial(m: Material) {
  const list = uploads().filter((x) => x.id !== m.id);
  write(MATERIALS, [m, ...list]);
}
export function deleteMaterial(id: string) {
  write(MATERIALS, uploads().filter((x) => x.id !== id));
}
export function renameMaterial(id: string, title: string) {
  write(MATERIALS, uploads().map((m) => (m.id === id ? { ...m, title: title.trim() || m.title } : m)));
}

export function isMaterial(x: unknown): x is Material {
  const m = x as Material;
  return (
    !!m &&
    typeof m.id === 'string' &&
    typeof m.title === 'string' &&
    typeof m.duration === 'number' &&
    Array.isArray(m.frames) &&
    m.frames.every((f) => typeof f.t === 'number' && Array.isArray(f.p) && f.p.length === 16) &&
    Array.isArray(m.segments) &&
    m.segments.every((s) => typeof s.name === 'string' && typeof s.start === 'number' && typeof s.end === 'number')
  );
}

export const getBest = (id: string): number | null => read<Record<string, number>>(BEST, {})[id] ?? null;
export function saveBest(id: string, score: number): boolean {
  const all = read<Record<string, number>>(BEST, {});
  if ((all[id] ?? -1) >= score) return false;
  write(BEST, { ...all, [id]: score });
  return true;
}

/** Daftar materi yang otomatis ikut berubah saat Studio menyimpan/menghapus. */
export function useMaterials(): Material[] {
  const [list, setList] = useState<Material[]>(allMaterials);
  useEffect(() => {
    const sync = () => setList(allMaterials());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return list;
}
