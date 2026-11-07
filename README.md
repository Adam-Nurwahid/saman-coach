# Saman Coach (Vite + React + TypeScript)

```
npm install
npm run dev      # http://localhost:5173 (kamera butuh localhost/https; model pose dimuat dari internet)
npm run build
```

## Struktur: dua sisi terpisah

```
src/
  features/
    learn/    SISI BELAJAR  : Library, Session (mode Belajar / Latihan / Uji). Hanya MEMBACA materi.
    studio/   SISI STUDIO   : Uploader (video -> materi), MaterialManager (ganti nama, hapus, ekspor/impor JSON).
  core/       logika murni  : geometry, score, pose (MediaPipe), analyze (video -> materi), builtin
  shared/     store (localStorage), router (hash), SkeletonView
```

Aturan: `learn` dan `studio` tidak saling impor. Keduanya hanya bertemu lewat `shared/store.ts`
(Studio menulis, Belajar membaca; daftar materi otomatis diperbarui).

## Route
- `#/` beranda
- `#/belajar` daftar materi
- `#/belajar/:id/:mode` mode = belajar | latihan | uji
- `#/studio` unggah dan kelola materi

## Catatan
- Materi bawaan adalah draf ilustrasi, belum divalidasi guru/sanggar Saman.
- Ambang skor (`core/score.ts`: TOLERANCE, TIER_GOOD, TIER_OK) masih sementara.
- Skema materi ada di `src/types.ts`. Skor terbaik dan materi unggahan disimpan di localStorage.
