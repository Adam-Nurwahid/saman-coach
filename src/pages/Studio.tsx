import{useRef,useState}from'react';import type{PoseLandmarker}from'@mediapipe/tasks-vision';
import{Lesson,bonesFrom}from'../core/geo';import{createPose}from'../core/pose';import{Quality,Sample,analyze}from'../core/analyze';
import{saveLesson}from'../store';import{PoseThumb}from'../draw';
const dl=(l:Lesson)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(l,null,1)],{type:'application/json'}));a.download=l.title+'.json';a.click()};
export default function Studio(){
  const vid=useRef<HTMLVideoElement>(null),[src,setSrc]=useState(''),[name,setName]=useState(''),[prog,setProg]=useState(-1),
  [err,setErr]=useState(''),[out,setOut]=useState<{lesson:Lesson;q:Quality}|null>(null);
  async function run(){
    const v=vid.current!;setErr('');setOut(null);setProg(0);let pl:PoseLandmarker|undefined;
    try{
      pl=await createPose();const s:Sample[]=[];
      if(v.readyState<1)await new Promise<void>(r=>{v.onloadedmetadata=()=>r()});
      for(let t=.01;t<v.duration;t+=.05){   // 20 sampel/detik
        v.currentTime=t;await new Promise<void>(r=>{v.onseeked=()=>r()});
        const r=pl.detectForVideo(v,t*1000);
        s.push({t,b:r.landmarks[0]?bonesFrom(r.landmarks[0],v.videoWidth,v.videoHeight,.45):null});setProg(t/v.duration)}
      const o=analyze(s,name||'Materi baru');
      if(o.lesson){saveLesson(o.lesson);setOut({lesson:o.lesson,q:o.q})}else setErr(o.q.warnings.join('. '));
    }catch(e){setErr(String(e))}finally{pl?.close();setProg(-1)}}
  return<section className="page"><h2>Studio: analisis video tari</h2>
    <p className="mut">Unggah video (satu penari, kamera diam, kedua lengan terlihat penuh). Analisis berjalan di browser; hasilnya langsung jadi materi di halaman Belajar.</p>
    <input type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){setSrc(URL.createObjectURL(f));setName(f.name.replace(/\.[^.]+$/,''));setOut(null);setErr('')}}}/>
    {src&&<><video ref={vid} src={src} muted playsInline controls className="pv"/>
      <div className="row"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Judul materi"/>
        <button onClick={run} disabled={prog>=0}>{prog>=0?`Menganalisis ${Math.round(prog*100)}%`:'Analisis video'}</button></div></>}
    {err&&<p className="bad">{err}</p>}
    {out&&<div className="card"><b>{out.lesson.title}</b> tersimpan sebagai materi · {out.lesson.poses.length} pose unik, {out.lesson.seq.length} gerak
      {out.q.warnings.map(w=><p className="warn" key={w}>⚠ {w}</p>)}
      <div className="thumbs">{out.lesson.poses.map(p=><PoseThumb key={p.id} p={p}/>)}</div>
      <div className="row"><a className="btn" href={`#/belajar/${out.lesson.id}`}>Belajar sekarang</a><button onClick={()=>dl(out.lesson)}>Unduh JSON</button></div></div>}
  </section>}
