# Saman Pose Coach (Vite + React + TypeScript)
    npm install && npm run dev      # buka http://localhost:5173 (kamera butuh localhost/https + internet untuk model)
- `#/belajar`  perpustakaan materi → sesi Belajar / Latihan / Uji (materi bawaan langsung bisa dipakai)
- `#/studio`   unggah video tari → analisis di browser → JSON materi tersimpan otomatis (localStorage) → langsung muncul di Belajar
- `src/core`   logika murni (geometri, analisis video→materi, skor); `src/pages` UI; `src/store.ts` penyimpanan materi
Catatan: materi bawaan adalah draf ilustrasi, belum divalidasi guru/sanggar Saman. Ambang skor masih sementara.
