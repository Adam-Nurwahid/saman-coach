import { useEffect, useState } from 'react';

/** Route berbasis hash: #/belajar/saman-draf/latihan → ['belajar','saman-draf','latihan'] */
const parse = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);

export function useRoute(): string[] {
  const [r, setR] = useState(parse);
  useEffect(() => {
    const on = () => setR(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export const go = (...parts: string[]) => {
  window.location.hash = '/' + parts.map(encodeURIComponent).join('/');
};
