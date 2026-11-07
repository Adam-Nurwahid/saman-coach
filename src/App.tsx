import { Learn } from './features/learn/Learn';
import { Studio } from './features/studio/Studio';
import { LandingPage, PeacockLogo } from './features/landing/LandingPage';
import { useRoute } from './shared/router';

export default function App() {
  const [area, id, mode] = useRoute();

  if (area !== 'belajar' && area !== 'studio') {
    return <LandingPage />;
  }

  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <a className="brand" href="#/">
            <PeacockLogo size={32} />
            <span>Saman Coach</span>
          </a>
          <a href="#/belajar" aria-current={area === 'belajar' ? 'page' : undefined}>Belajar</a>
          <a href="#/studio" aria-current={area === 'studio' ? 'page' : undefined}>Studio</a>
        </div>
      </nav>
      {area === 'belajar' ? <Learn id={id} mode={mode} /> : <Studio />}
      <footer className="foot">
        <div className="wrap">Materi bawaan masih draf ilustrasi dan belum divalidasi guru atau sanggar Saman. Ambang skor bersifat sementara.</div>
      </footer>
    </>
  );
}
