import { useEffect, useRef, useState } from 'react';
import { drawSkeleton, frameAt } from '../../core/geometry';
import { detectUpper, getPose } from '../../core/pose';
import { hint, matchScore, tier } from '../../core/score';
import { go } from '../../shared/router';
import { drawReference } from '../../shared/SkeletonView';
import { getBest, saveBest } from '../../shared/store';
import type { Material, Mode } from '../../types';

type Phase = 'ready' | 'loading' | 'countdown' | 'running' | 'done';
interface Result {
  overall: number;
  perSeg: { name: string; score: number | null }[];
  newBest: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const TITLES: Record<Mode, string> = { belajar: 'Belajar', latihan: 'Latihan', uji: 'Uji' };

export function Session({ material, mode }: { material: Material; mode: Mode }) {
  const needCam = mode !== 'belajar';
  const videoRef = useRef<HTMLVideoElement>(null);
  const userCv = useRef<HTMLCanvasElement>(null);
  const refCv = useRef<HTMLCanvasElement>(null);
  const run = useRef({ token: 0, raf: 0, stream: null as MediaStream | null });

  const [phase, setPhase] = useState<Phase>('ready');
  const [segIdx, setSegIdx] = useState(-1); // -1 = semua
  const [speed, setSpeed] = useState(1);
  const [count, setCount] = useState(3);
  const [live, setLive] = useState({ score: 0, hint: '' });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const drawRef = (t: number) => {
    const c = refCv.current?.getContext('2d');
    if (c) drawReference(c, frameAt(material.frames, t), 480, 480);
  };

  const stopCam = () => {
    run.current.stream?.getTracks().forEach((t) => t.stop());
    run.current.stream = null;
  };

  const halt = () => {
    run.current.token++;
    cancelAnimationFrame(run.current.raf);
  };

  useEffect(() => {
    drawRef(0);
    return () => {
      halt();
      stopCam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.id]);

  async function start() {
    setError('');
    setResult(null);
    const token = ++run.current.token;
    const cancelled = () => run.current.token !== token;
    const range = segIdx >= 0 && mode !== 'uji' ? material.segments[segIdx] : { start: 0, end: material.duration };

    let lm: Awaited<ReturnType<typeof getPose>> | null = null;
    if (needCam) {
      try {
        setPhase('loading');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        run.current.stream = stream;
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play();
        lm = await getPose();
      } catch (e) {
        stopCam();
        setPhase('ready');
        setError(
          e instanceof DOMException && e.name === 'NotAllowedError'
            ? 'Izin kamera ditolak. Aktifkan kamera di pengaturan browser lalu coba lagi.'
            : 'Kamera atau model pose tidak bisa dimuat. Pastikan memakai localhost/https dan terhubung internet untuk model.',
        );
        return;
      }
      if (cancelled()) return;
    }

    setPhase('countdown');
    for (let n = 3; n > 0; n--) {
      setCount(n);
      drawRef(range.start);
      await sleep(1000);
      if (cancelled()) return;
    }

    setPhase('running');
    let base = performance.now();
    const sums = material.segments.map(() => 0);
    const counts = material.segments.map(() => 0);
    let lastDetect = 0;
    let lastUi = 0;
    let lastHint = 'Posisikan tubuh bagian atas di dalam kamera.';
    let lastScore = 0;

    const segOf = (t: number) => material.segments.findIndex((s) => t >= s.start && t < s.end);

    const finish = () => {
      cancelAnimationFrame(run.current.raf);
      stopCam();
      userCv.current?.getContext('2d')?.clearRect(0, 0, 640, 480);
      const perSeg = material.segments.map((s, i) => ({
        name: s.name,
        score: counts[i] ? Math.round(sums[i] / counts[i]) : null,
      }));
      const scored = perSeg.filter((p) => p.score !== null) as { score: number }[];
      const overall = scored.length ? Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length) : 0;
      const newBest = mode === 'uji' ? saveBest(material.id, overall) : false;
      setResult({ overall, perSeg, newBest });
      setPhase('done');
    };

    const loop = (now: number) => {
      if (cancelled()) return;
      let t = range.start + ((now - base) / 1000) * speed;
      if (t >= range.end) {
        if (mode !== 'belajar') return finish();
        base = now; // mode belajar: ulang segmen terus-menerus
        t = range.start;
      }
      drawRef(t);

      if (lm && videoRef.current && now - lastDetect > 66 && videoRef.current.readyState >= 2) {
        lastDetect = now;
        const det = detectUpper(lm, videoRef.current, now);
        const uc = userCv.current?.getContext('2d');
        if (uc) {
          uc.clearRect(0, 0, 640, 480);
          if (det) drawSkeleton(uc, det.raw, (x, y) => [(1 - x) * 640, y * 480], { color: '#34D399', width: 5 });
        }
        if (det) {
          lastScore = matchScore(det.p, material.frames, t);
          const i = segOf(t);
          if (i >= 0) {
            sums[i] += lastScore;
            counts[i]++;
          }
          lastHint = mode === 'latihan' ? hint(det.p, frameAt(material.frames, t)) : '';
        } else {
          lastScore = 0;
          lastHint = 'Posisikan tubuh bagian atas di dalam kamera.';
        }
        if (now - lastUi > 250) {
          lastUi = now;
          setLive({ score: lastScore, hint: lastHint });
        }
      }
      run.current.raf = requestAnimationFrame(loop);
    };

    run.current.raf = requestAnimationFrame(loop);
  }

  function stop() {
    halt();
    stopCam();
    userCv.current?.getContext('2d')?.clearRect(0, 0, 640, 480);
    drawRef(0);
    setPhase('ready');
  }

  const best = getBest(material.id);
  const busy = phase === 'loading' || phase === 'countdown' || phase === 'running';

  return (
    <main className="page">
      <a className="back" href="#/belajar">Kembali ke daftar materi</a>
      <h1>{material.title}</h1>
      <p className="lead">
        {TITLES[mode]}
        {mode === 'uji' && best !== null && <> &middot; skor terbaik {best}</>}
      </p>

      <div className="tabs">
        {(['belajar', 'latihan', 'uji'] as Mode[]).map((m) => (
          <button
            key={m}
            className={`chip ${m === mode ? 'on' : ''}`}
            disabled={busy}
            onClick={() => go('belajar', material.id, m)}
          >
            {TITLES[m]}
          </button>
        ))}
      </div>

      <div className="stage-grid">
        {needCam && (
          <div className="cam">
            <video ref={videoRef} muted playsInline />
            <canvas ref={userCv} width={640} height={480} />
            {phase === 'countdown' && <div className="count">{count}</div>}
            {phase === 'running' && (
              <div className="live">
                <b className={tier(live.score).toLowerCase()}>{live.score}</b>
                <span>{live.hint}</span>
              </div>
            )}
          </div>
        )}
        <div className="refbox">
          <canvas ref={refCv} width={480} height={480} />
          {!needCam && phase === 'countdown' && <div className="count">{count}</div>}
        </div>
      </div>

      <div className="controls">
        {mode !== 'uji' && (
          <label>
            Segmen{' '}
            <select value={segIdx} disabled={busy} onChange={(e) => setSegIdx(+e.target.value)}>
              <option value={-1}>Semua</option>
              {material.segments.map((s, i) => (
                <option key={s.id} value={i}>{s.name}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          Kecepatan {speed.toFixed(2)}x{' '}
          <input type="range" min={0.5} max={1.5} step={0.25} value={speed} disabled={busy} onChange={(e) => setSpeed(+e.target.value)} />
        </label>
        {busy ? (
          <button className="btn ghost" onClick={stop}>Berhenti</button>
        ) : (
          <button className="btn" onClick={start}>{phase === 'done' ? 'Ulangi' : 'Mulai'}</button>
        )}
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {result && (
        <section className="result">
          <h2>
            Skor akhir <b>{result.overall}</b> <small>({tier(result.overall)})</small>
          </h2>
          {result.newBest && <p className="ok">Skor terbaik baru tersimpan di browser ini.</p>}
          <ul>
            {result.perSeg.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <b>{s.score === null ? 'tidak dinilai' : `${s.score} (${tier(s.score)})`}</b>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="mute small">Skor adalah panduan latihan, bukan penilaian mutlak. Ambang masih sementara.</p>
    </main>
  );
}
