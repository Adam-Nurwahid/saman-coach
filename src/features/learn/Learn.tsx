import { getMaterial } from '../../shared/store';
import type { Mode } from '../../types';
import { Library } from './Library';
import { Session } from './Session';

const MODES: Mode[] = ['belajar', 'latihan', 'uji'];

export function Learn({ id, mode }: { id?: string; mode?: string }) {
  if (!id) return <Library />;
  const m = getMaterial(id);
  if (!m) {
    return (
      <main className="page">
        <h1>Materi tidak ditemukan</h1>
        <p className="lead">Materi ini mungkin sudah dihapus. <a href="#/belajar">Kembali ke daftar materi</a>.</p>
      </main>
    );
  }
  const md: Mode = MODES.includes(mode as Mode) ? (mode as Mode) : 'belajar';
  return <Session key={`${m.id}-${md}`} material={m} mode={md} />;
}
