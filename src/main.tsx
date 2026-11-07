import{createRoot}from'react-dom/client';import{useEffect,useState}from'react';import'./styles.css';
import Studio from'./pages/Studio';import{Library,Session}from'./pages/Learn';import{loadLessons}from'./store';
const useHash=()=>{const[h,s]=useState(location.hash||'#/belajar');
  useEffect(()=>{const f=()=>s(location.hash||'#/belajar');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return h};
function App(){
  const h=useHash(),studio=h.startsWith('#/studio'),id=h.match(/^#\/belajar\/(.+)$/)?.[1],lesson=id?loadLessons().find(l=>l.id===id):undefined;
  return<><header><h1>Saman Pose Coach</h1><nav><a href="#/belajar" className={studio?'':'on'}>Belajar</a><a href="#/studio" className={studio?'on':''}>Studio</a></nav></header>
    {studio?<Studio/>:lesson?<Session key={lesson.id} lesson={lesson}/>:<Library/>}</>}
createRoot(document.getElementById('root')!).render(<App/>);
