import { useRef, useState } from 'react';
import { makeId } from '../../core/analyze';
import { deleteMaterial, isMaterial, renameMaterial, saveMaterial, uploads, useMaterials } from '../../shared/store';
import type { Material } from '../../types';

function download(m: Material) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${m.title.replace(/[^\w-]+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function MaterialManager() {
  useMaterials(); // re-render saat penyimpanan berubah
  const list = uploads();
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  async function importJson(f?: File) {
    if (!f) return;
    try {
      const data: unknown = JSON.parse(await f.text());
      if (!isMaterial(data)) throw new Error('Format JSON bukan materi Saman Coach.');
      saveMaterial({ ...data, id: makeId(), source: 'upload' });
      setMsg('Materi diimpor.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Impor gagal.');
    }
    if (input.current) input.current.value = '';
  }

  return (
    <section className="panel">
      <div className="row-between">
        <h2>Materi saya</h2>
        <button className="btn ghost" onClick={() => input.current?.click()}>Impor JSON</button>
        <input ref={input} type="file" accept="application/json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
      </div>
      {msg && <p className="note">{msg}</p>}
      {list.length === 0 ? (
        <p className="mute">Belum ada materi. Unggah video di atas untuk membuat yang pertama.</p>
      ) : (
        <ul className="mlist">
          {list.map((m) => (
            <li key={m.id}>
              <input
                defaultValue={m.title}
                aria-label="Judul materi"
                onBlur={(e) => e.target.value !== m.title && renameMaterial(m.id, e.target.value)}
              />
              <span className="mute small">{m.segments.length} segmen, {Math.round(m.duration)} dtk</span>
              <button className="chip" onClick={() => download(m)}>Ekspor</button>
              <button className="chip danger" onClick={() => confirm(`Hapus “${m.title}”?`) && deleteMaterial(m.id)}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
