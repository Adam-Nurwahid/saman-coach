import{Bones,Lesson,U,dist,errs}from'./geo';
export interface Sample{t:number;b:Bones|null}
export interface Quality{goodRate:number;warnings:string[];usable:boolean}
const FPS=30;
/** Video (sampel arah tulang per waktu) → materi: pose unik + urutan gerak. Port dari video2template.py (smoothing: rata-rata bergerak). */
export function analyze(s:Sample[],title:string):{lesson:Lesson|null;q:Quality}{
  const good=s.filter(x=>x.b),goodRate=good.length/Math.max(1,s.length),w:string[]=[];
  if(goodRate<.7)w.push(`Hanya ${Math.round(goodRate*100)}% frame lolos (lengan keluar frame atau terlalu dekat kamera)`);
  if(good.length<15)return{lesson:null,q:{goodRate,warnings:[...w,'Terlalu sedikit frame berkualitas baik'],usable:false}};
  const t0=good[0].t,n=Math.floor((good[good.length-1].t-t0)*FPS),B:Bones[]=[],bad:boolean[]=[];let j=0;
  for(let i=0;i<n;i++){const t=t0+i/FPS;while(j<good.length-2&&good[j+1].t<t)j++;
    const a=good[j],c=good[j+1],f=Math.min(1,Math.max(0,(t-a.t)/((c.t-a.t)||1)));
    B.push(a.b!.map((v,k)=>U([v[0]*(1-f)+c.b![k][0]*f,v[1]*(1-f)+c.b![k][1]*f])) as Bones);
    bad.push(Math.min(Math.abs(t-a.t),Math.abs(t-c.t))>.1)}
  const bd=bad.map((_,i)=>bad.slice(Math.max(0,i-6),i+7).some(Boolean));
  const avg=(a:number,b:number):Bones=>B[0].map((_,k)=>{const r=B.slice(a,b+1);return U([r.reduce((x,y)=>x+y[k][0],0),r.reduce((x,y)=>x+y[k][1],0)])}) as Bones;
  const S=B.map((_,i)=>avg(Math.max(0,i-3),Math.min(n-1,i+3)));
  const v=S.map((b,i)=>i?errs(S[i-1],b).reduce((x,y)=>x+y,0)*FPS:0);v[0]=v[1]||0;   // kecepatan sudut total (°/s)
  const segs:[number,number][]=[];let st=-1;
  for(let i=0;i<=n;i++){const on=i<n&&v[i]<120&&!bd[i];if(on&&st<0)st=i;else if(!on&&st>=0){if((i-1-st)/FPS>=.4)segs.push([st,i-1]);st=-1}}
  const m:[number,number][]=[];
  for(const g of segs){const p=m[m.length-1];if(p&&(g[0]-p[1])/FPS<=.5&&dist(avg(g[0],g[1]),avg(p[0],p[1]))<=20)p[1]=g[1];else m.push([g[0],g[1]])}
  const acc:number[]=[],r=12;
  for(let i=r;i<n-r;i++){if(v[i]>=100||bd[i])continue;const win=v.slice(i-r,i+r+1);
    if(v[i]>Math.min(...win)||Math.max(...win)-v[i]<80)continue;
    if(m.some(([a,b])=>i>=a-15&&i<=b+15))continue;
    if(acc.length&&i-acc[acc.length-1]<12)continue;acc.push(i)}
  const notes=[...m.map(([a,b])=>({t:t0+a/FPS,b:avg(a,b)})),...acc.map(i=>({t:t0+i/FPS,b:S[i]}))].sort((a,b)=>a.t-b.t);
  if(notes.length<3)w.push('Gerakan yang terdeteksi sangat sedikit');
  if(!notes.length)return{lesson:null,q:{goodRate,warnings:[...w,'Tidak ada pose terdeteksi'],usable:false}};
  const C:Bones[]=[],cnt:number[]=[],seq:string[]=[];
  for(const x of notes){let bi=-1,bs=18;C.forEach((c,i)=>{const d=dist(x.b,c);if(d<=bs){bi=i;bs=d}});
    if(bi<0){C.push(x.b);cnt.push(1);bi=C.length-1}
    else{const k=cnt[bi]++;C[bi]=C[bi].map((c,q)=>U([c[0]*k+x.b[q][0],c[1]*k+x.b[q][1]])) as Bones}
    seq.push('P'+(bi+1))}
  const lesson:Lesson={id:'v'+Date.now(),title,source:'video',seq,times:notes.map(x=>+(x.t-notes[0].t).toFixed(2)),
    poses:C.map((b,i)=>({id:'P'+(i+1),name:'Pose '+(i+1),cue:'Bentuk lengan seperti stickman.',bones:b}))};
  return{lesson,q:{goodRate,warnings:w,usable:w.length===0}};
}
