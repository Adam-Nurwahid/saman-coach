import { go } from '../../shared/router';
import { getBest, useMaterials } from '../../shared/store';
import type { Mode } from '../../types';

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: 'belajar', label: 'Belajar', hint: 'Tonton referensi, tanpa kamera' },
  { id: 'latihan', label: 'Latihan', hint: 'Umpan balik langsung' },
  { id: 'uji', label: 'Uji', hint: 'Satu kali tampil penuh' },
];

export function Library() {
  const items = useMaterials();
  return (
    <main className="page">
      <h1>Belajar</h1>
      <p className="lead">Pilih materi, lalu pilih cara berlatih. Materi dari Studio otomatis muncul di sini.</p>
      <div className="grid">
        {items.map((m) => {
          const best = getBest(m.id);
          return (
            <article className="card" key={m.id}>
              <div className={`card-top ${m.source}`}>
                <h2>{m.title}</h2>
              </div>
              <div className="card-in">
                <p className="mute">
                  {m.segments.length} segmen, {Math.round(m.duration)} detik
                  {best !== null && <> &middot; skor terbaik <b>{best}</b></>}
                </p>
                {m.note && <p className="note">{m.note}</p>}
                <div className="mode-row">
                  {MODES.map((x) => (
                    <button key={x.id} className="chip" title={x.hint} onClick={() => go('belajar', m.id, x.id)}>
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mute small">
        Ingin menambah materi sendiri? <a href="#/studio">Buka Studio</a>.
      </p>
    </main>
  );
}
