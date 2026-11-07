import { useRef, useState } from 'react';
import { analyzeVideo } from '../../core/analyze';
import { SkeletonView } from '../../shared/SkeletonView';
import { saveMaterial } from '../../shared/store';
import type { Material } from '../../types';

export function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [fps, setFps] = useState(8);
  const [segSec, setSegSec] = useState(4);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Material | null>(null);
  const [scrub, setScrub] = useState(0);
  const [saved, setSaved] = useState(false);
  const [over, setOver] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const pick = (f?: File | null) => {
    setError('');
    setDraft(null);
    setSaved(false);
    if (!f) return;
    if (!f.type.startsWith('video/')) return setError('Berkas bukan video. Pilih MP4 atau WebM.');
    setFile(f);
    setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError('');
    setProgress(0);
    abort.current = new AbortController();
    try {
      const m = await analyzeVideo(file, { title, fps, segmentSec: segSec }, setProgress, abort.current.signal);
      setDraft(m);
      setScrub(0);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        setError(e instanceof Error ? e.message : 'Analisis gagal.');
      }
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!draft) return;
    try {
      saveMaterial({ ...draft, title: title.trim() || draft.title });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan.');
    }
  }

  const renameSeg = (i: number, name: string) =>
    setDraft((d) => d && { ...d, segments: d.segments.map((s, j) => (j === i ? { ...s, name } : s)) });

  return (
    <section className="panel">
      <h2>1. Unggah video tari</h2>
      <label
        className={`drop ${over ? 'over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}
      >
        <input type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        <b>{file ? file.name : 'Tarik video ke sini'}</b>
        <span>{file ? 'Klik untuk mengganti video' : 'atau klik untuk memilih berkas'}</span>
      </label>
      <p className="mute small">Satu penari, menghadap kamera, bahu sampai pinggul terlihat. Video diproses di browser dan tidak diunggah.</p>

      {file && (
        <div className="form">
          <label>Judul materi<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>
            Panjang segmen
            <select value={segSec} onChange={(e) => setSegSec(+e.target.value)}>
              {[3, 4, 5, 6, 8].map((n) => <option key={n} value={n}>{n} detik</option>)}
            </select>
          </label>
          <label>
            Ketelitian
            <select value={fps} onChange={(e) => setFps(+e.target.value)}>
              <option value={6}>Cepat (6 fps)</option>
              <option value={8}>Seimbang (8 fps)</option>
              <option value={12}>Teliti (12 fps)</option>
            </select>
          </label>
          {busy ? (
            <button className="btn ghost" onClick={() => abort.current?.abort()}>Batalkan</button>
          ) : (
            <button className="btn" onClick={analyze}>Analisis video</button>
          )}
        </div>
      )}

      {busy && (
        <div className="bar" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
          <i style={{ width: `${progress * 100}%` }} />
          <span>Menganalisis {Math.round(progress * 100)}%</span>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}

      {draft && (
        <div className="draft">
          <h2>2. Periksa hasil</h2>
          <div className="draft-grid">
            <div>
              <SkeletonView frames={draft.frames} t={scrub} size={300} />
              <input type="range" min={0} max={draft.duration} step={0.05} value={scrub} onChange={(e) => setScrub(+e.target.value)} aria-label="Geser waktu" />
              <p className="mute small">{scrub.toFixed(1)} dari {draft.duration} detik &middot; {draft.frames.length} frame</p>
            </div>
            <div>
              <h3>Nama segmen</h3>
              {draft.segments.map((s, i) => (
                <label key={s.id} className="seg">
                  <span>{s.start.toFixed(1)}&ndash;{s.end.toFixed(1)} dtk</span>
                  <input value={s.name} onChange={(e) => renameSeg(i, e.target.value)} />
                </label>
              ))}
              {draft.note && <p className="note">{draft.note}</p>}
            </div>
          </div>
          <h2>3. Simpan</h2>
          {saved ? (
            <p className="ok">Tersimpan. <a href="#/belajar">Buka di Belajar</a></p>
          ) : (
            <button className="btn" onClick={save}>Simpan materi</button>
          )}
        </div>
      )}
    </section>
  );
}
