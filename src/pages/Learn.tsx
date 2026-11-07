import{useEffect,useRef,useState}from'react';
import{DrawingUtils,PoseLandmarker}from'@mediapipe/tasks-vision';import type{NormalizedLandmark}from'@mediapipe/tasks-vision';
import{Bones,Lesson,U,bonesFrom,errs,score}from'../core/geo';import{createPose}from'../core/pose';
import{ctx,stick}from'../draw';import{delLesson,loadLessons}from'../store';
type Mode='learn'|'practice'|'test';type J='PERFECT'|'GOOD'|'MISS';interface N{p:string;T:number;best:number;j:J|null}
const NM=['lengan atas kiri','lengan bawah kiri','lengan atas kanan','lengan bawah kanan'],COL={PERFECT:'#3ddc84',GOOD:'#ffb74d',MISS:'#ff5252'};
const g=(id:string)=>document.getElementById(id)!;

export function Library(){
  const[ls,setLs]=useState(loadLessons());
  return<section className="page"><h2>Pilih materi</h2><div className="grid">{ls.map(l=><div className="card" key={l.id}><b>{l.title}</b>
    <p className="mut">{l.poses.length} pose · {l.seq.length} gerak · {l.source==='bawaan'?'materi bawaan (draf)':'dari video'}</p>
    <div className="row"><a className="btn" href={`#/belajar/${l.id}`}>Belajar</a>
    {l.source==='video'&&<button onClick={()=>{delLesson(l.id);setLs(loadLessons())}}>Hapus</button>}</div></div>)}</div>
    <p className="mut note">Ingin materi dari video tari lain? Buka <a href="#/studio">Studio</a>.</p></section>}

export function Session({lesson}:{lesson:Lesson}){
  const cam=useRef<HTMLVideoElement>(null),ov=useRef<HTMLCanvasElement>(null),rf=useRef<HTMLCanvasElement>(null),ln=useRef<HTMLCanvasElement>(null);
  const S=useRef({mode:'learn' as Mode,run:false,step:0,hold:0,sim:0,err:[99,99,99,99],user:null as Bones|null,ok:false,
    lm:null as NormalizedLandmark[]|null,speed:.5,pspd:.5,notes:[] as N[],cur:null as N|null,t0:0,pl:null as PoseLandmarker|null,du:null as DrawingUtils|null}).current;
  const[mode,setM]=useState<Mode>('learn'),[ready,setReady]=useState(false),[msg,setMsg]=useState(''),[res,setRes]=useState(''),[running,setRun]=useState(false);
  const P=Object.fromEntries(lesson.poses.map(p=>[p.id,p])),STEPS=[...new Set(lesson.seq)];

  function setMode(m:Mode){S.mode=m;S.run=false;S.step=0;S.hold=0;S.notes=[];S.speed=m==='test'?1:S.pspd;setM(m);setRun(false);setRes('')}
  function play(){
    if(S.run){S.run=false;S.notes=[];setRun(false);return}
    if(!S.pl){setRes('Mulai kamera dulu.');return}
    S.notes=lesson.seq.map((p,i)=>({p,T:3+lesson.times[i]/S.speed,best:0,j:null}));S.t0=performance.now();S.run=true;setRun(true);setRes('')}
  async function start(){
    setMsg('Meminta izin kamera…');
    try{const v=cam.current!;v.srcObject=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:960},height:{ideal:540},facingMode:'user'},audio:false});
      await v.play();ov.current!.width=v.videoWidth;ov.current!.height=v.videoHeight;setMsg('Memuat model pose…');
      S.pl=await createPose();S.du=new DrawingUtils(ov.current!.getContext('2d')!);setReady(true)
    }catch(e){setMsg('Gagal: '+(e as Error).message+'. Buka lewat localhost/https dan izinkan kamera.')}}
  useEffect(()=>()=>{(cam.current?.srcObject as MediaStream|null)?.getTracks().forEach(t=>t.stop());S.pl?.close()},[]);

  useEffect(()=>{
    let raf=0,last=-1,tpv=performance.now();
    const tgt=()=>S.mode==='learn'?P[STEPS[S.step]]:S.run&&S.cur?P[S.cur.p]:P[lesson.seq[0]];
    const finish=()=>{S.run=false;const c={PERFECT:0,GOOD:0,MISS:0};S.notes.forEach(n=>c[n.j!]++);
      const s=Math.round((c.PERFECT*100+c.GOOD*60)/S.notes.length);let b='';
      if(S.mode==='test')try{const k='best:'+lesson.id,o=+(localStorage.getItem(k)||0);if(s>o)localStorage.setItem(k,String(s));b=' · terbaik '+Math.max(s,o)}catch{}
      setRes(`Skor ${s} (${s>=85?'Sangat baik':s>=65?'Baik':s>=40?'Cukup':'Perlu latihan'}) — Perfect ${c.PERFECT}, Good ${c.GOOD}, Miss ${c.MISS}${b}`);setRun(false);S.notes=[]};
    const update=(dt:number,nw:number)=>{
      S.cur=S.run?S.notes.find(n=>!n.j)||null:null;const T=tgt(),can=S.ok&&!!S.user;
      S.err=can?errs(S.user!,T.bones):[99,99,99,99];S.sim=can?score(S.err):0;
      if(S.mode==='learn'){S.hold=S.sim>=.72?S.hold+dt:Math.max(0,S.hold-2*dt);
        if(S.hold>=.8){S.hold=0;S.step++;if(S.step>=STEPS.length){setMode('practice');setRes('Semua langkah selesai. Coba Latihan pelan.')}}return}
      if(!S.run)return;const now=(nw-S.t0)/1e3,W=.6/S.speed;
      S.notes.forEach(n=>{if(n.j)return;if(can&&Math.abs(now-n.T)<=W)n.best=Math.max(n.best,score(errs(S.user!,P[n.p].bones)));
        if(now>n.T+W)n.j=n.best>=.75?'PERFECT':n.best>=.5?'GOOD':'MISS'});
      if(S.notes.every(n=>n.j))finish()};
    const draw=(nw:number)=>{
      const tp=tgt(),now=S.run?(nw-S.t0)/1e3:0,oc=ov.current!;
      let[c,w,h]=ctx(rf.current!);c.fillStyle='#fff';c.fillRect(0,0,w,h);const lw=Math.max(3,h/70);
      stick(c,tp.bones,w/2,h*.4,h*.24,'#000',lw);if(S.ok&&S.user)stick(c,S.user,w/2,h*.4,h*.24,'rgba(46,204,113,.55)',lw);
      const o=oc.getContext('2d')!;o.clearRect(0,0,oc.width,oc.height);
      if(S.lm&&S.du){S.du.drawConnectors(S.lm,PoseLandmarker.POSE_CONNECTIONS,{color:'#ffffff88',lineWidth:2});S.du.drawLandmarks(S.lm,{color:'#fff',radius:2});
        if(S.ok){o.lineWidth=7;o.lineCap='round';[[11,13],[13,15],[12,14],[14,16]].forEach(([a,b],i)=>{const e=S.err[i];
          o.strokeStyle=e<25?'#3ddc84':e<45?'#ffb74d':'#ff5252';o.beginPath();
          o.moveTo(S.lm![a].x*oc.width,S.lm![a].y*oc.height);o.lineTo(S.lm![b].x*oc.width,S.lm![b].y*oc.height);o.stroke()})}}
      let t1,t2=tp.cue;
      if(S.mode==='learn')t1=`Langkah ${S.step+1}/${STEPS.length} · ${tp.name}`;
      else if(S.run)t1=now<3?`Bersiap… ${Math.ceil(3-now)}`:`Gerak ${S.notes.indexOf(S.cur!)+1}/${S.notes.length} · ${tp.name}`;
      else{t1=S.mode==='test'?'Uji · skor dihitung pada 1×':'Latihan · pelan dulu';t2='Tekan Mulai, lalu cocokkan pose saat kartu melewati garis putih.'}
      g('ttl').textContent=t1;g('cue').textContent=t2;g('bar').style.width=(S.mode==='learn'?Math.min(100,S.hold/.8*100):S.sim*100)+'%';
      g('hint').textContent=!S.lm?'Kamera belum menangkap tubuh.':!S.ok?'Pastikan kedua bahu, siku, dan pergelangan tangan terlihat penuh di kamera.'
        :`Kecocokan ${Math.round(S.sim*100)}%`+(S.sim<.72?` · perbaiki ${NM[S.err.indexOf(Math.max(...S.err))]}`:' · tahan pose');
      [c,w,h]=ctx(ln.current!);c.fillStyle='#161616';c.fillRect(0,0,w,h);
      const hx=w*.16,pps=170*S.speed;c.fillStyle='#ffffff14';c.fillRect(hx-34,0,68,h);c.fillStyle='#fff';c.fillRect(hx-1,0,2,h);
      if(!S.notes.length){c.fillStyle='#9a9a9a';c.font='14px system-ui';c.textAlign='center';
        c.fillText(S.mode==='learn'?'Mode Belajar: kuasai tiap pose dulu. Lane aktif di Latihan dan Uji.':'Tekan Mulai',w/2,h/2)}
      S.notes.forEach(n=>{const x=hx+(n.T-now)*pps;if(x<-40||x>w+40)return;
        c.fillStyle=n.j?COL[n.j]:'#fff';c.beginPath();c.roundRect(x-28,10,56,h-20,10);c.fill();
        stick(c,P[n.p].bones,x,h*.4,12,'#000',2);c.fillStyle='#000';c.font='10px system-ui';c.textAlign='center';c.fillText(n.j||P[n.p].name,x,h-16)})};
    const frame=()=>{raf=requestAnimationFrame(frame);const nw=performance.now(),dt=Math.min(.1,(nw-tpv)/1e3);tpv=nw;const v=cam.current!;
      if(S.pl&&v.readyState>=2&&v.currentTime!==last){last=v.currentTime;const r=S.pl.detectForVideo(v,nw);S.lm=r.landmarks[0]||null;
        const b=S.lm&&bonesFrom(S.lm,v.videoWidth,v.videoHeight);S.ok=!!b;
        if(b)S.user=S.user?b.map((x,i)=>U([S.user![i][0]*.5+x[0]*.5,S.user![i][1]*.5+x[1]*.5])) as Bones:b}
      update(dt,nw);draw(nw)};
    frame();return()=>cancelAnimationFrame(raf)},[lesson]);

  return<section className="page">
    <div className="bar2"><a href="#/belajar">← Materi</a><b>{lesson.title}</b>
      <div className="tabs">{(['learn','practice','test'] as Mode[]).map((m,i)=><button key={m} className={mode===m?'on':''} onClick={()=>setMode(m)}>{i+1} {{learn:'Belajar',practice:'Latihan',test:'Uji'}[m]}</button>)}</div></div>
    <main><div className="box"><video ref={cam} className="cam" playsInline muted/><canvas ref={ov} className="ov"/>
      {!ready&&<div className="intro"><b>Siapkan kamera</b><span className="mut">Duduk tegak. Kedua bahu, siku, dan tangan harus terlihat penuh. Butuh internet untuk memuat model.</span>
        <button onClick={start}>Mulai kamera</button><small className="mut">{msg}</small></div>}</div>
      <div className="box"><canvas ref={rf}/></div></main>
    <div className="card"><b id="ttl"/> <span className="mut" id="cue"/><div className="meter"><i id="bar"/></div><div id="hint"/></div>
    <canvas ref={ln} className="lane"/>
    <div className="row">{mode!=='learn'&&<button onClick={play}>{running?'Berhenti':'Mulai'}</button>}
      {mode==='practice'&&<label className="mut">Kecepatan <select defaultValue=".5" onChange={e=>{S.pspd=+e.target.value;S.speed=S.pspd}}><option value=".5">0,5×</option><option value=".75">0,75×</option><option value="1">1×</option></select></label>}
      <span>{res}</span></div>
    {lesson.source==='bawaan'&&<p className="mut note">Urutan pose bawaan adalah draf ilustrasi dan belum divalidasi guru atau sanggar Saman. Ambang skor masih sementara.</p>}
  </section>}
