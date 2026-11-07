import { MaterialManager } from './MaterialManager';
import { Uploader } from './Uploader';

export function Studio() {
  return (
    <main className="page">
      <h1>Studio</h1>
      <p className="lead">Ubah video tari jadi materi latihan. Hasilnya langsung tersedia di <a href="#/belajar">Belajar</a>.</p>
      <Uploader />
      <MaterialManager />
    </main>
  );
}
