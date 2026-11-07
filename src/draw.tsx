import{useEffect,useRef}from'react';import{Bones,Pose}from'./core/geo';
export function ctx(c:HTMLCanvasElement):[CanvasRenderingContext2D,number,number]{
  const k=devicePixelRatio||1,W=c.clientWidth,H=c.clientHeight;
  if(c.width!==Math.round(W*k)){c.width=Math.round(W*k);c.height=Math.round(H*k)}
  const x=c.getContext('2d')!;x.setTransform(k,0,0,k,0,0);return[x,W,H]}
/** Stickman tampilan cermin (sisi kiri anatomis di kiri layar). s = lebar bahu dalam piksel. */
export function stick(c:CanvasRenderingContext2D,b:Bones,x:number,y:number,s:number,col:string,lw:number){
  c.save();c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';
  const L=[x-.5*s,y],R=[x+.5*s,y],
  arm=(sh:number[],u:number[],f:number[])=>{const e=[sh[0]-u[0]*.8*s,sh[1]+u[1]*.8*s];return[sh,e,[e[0]-f[0]*.7*s,e[1]+f[1]*.7*s]]},
  line=(p:number[][])=>{c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()};
  line([L,R]);line(arm(L,b[0],b[1]));line(arm(R,b[2],b[3]));
  line([L,[x-.35*s,y+1.7*s],[x+.35*s,y+1.7*s],R]);line([[x,y],[x,y-.25*s]]);
  c.beginPath();c.arc(x,y-.55*s,.3*s,0,7);c.stroke();c.restore()}
export function PoseThumb({p}:{p:Pose}){
  const r=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const c=r.current!.getContext('2d')!;c.fillStyle='#fff';c.fillRect(0,0,110,120);stick(c,p.bones,55,42,22,'#000',2.5)},[p]);
  return<canvas ref={r} width={110} height={120} title={p.name}/>}
