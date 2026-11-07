export type V=[number,number];
export type Bones=V[]; // [atas kiri, bawah kiri, atas kanan, bawah kanan]; vektor satuan, x kanan-gambar (kiri anatomis = +x), y bawah
export interface Pose{id:string;name:string;cue:string;bones:Bones}
export interface Lesson{id:string;title:string;source:'bawaan'|'video';poses:Pose[];seq:string[];times:number[]} // times: detik relatif
export interface Lm{x:number;y:number;visibility?:number}
export const U=(a:V):V=>{const n=Math.hypot(a[0],a[1])||1;return[a[0]/n,a[1]/n]};
export const errs=(u:Bones,t:Bones)=>u.map((v,i)=>Math.acos(Math.max(-1,Math.min(1,v[0]*t[i][0]+v[1]*t[i][1])))*57.2958);
export const dist=(a:Bones,b:Bones)=>errs(a,b).reduce((x,y)=>x+y,0)/4;
export const score=(e:number[])=>e.reduce((a,x)=>a+Math.exp(-.5*(x/25)**2),0)/e.length; // sigma 25° (sementara)
/** Arah tulang lengan dalam bingkai badan (garis bahu). null jika sendi tak terlihat / keluar frame / (opsional) terlalu dekat. */
export function bonesFrom(lm:Lm[],w:number,h:number,maxSw=Infinity):Bones|null{
  if(![11,12,13,14,15,16].every(i=>lm[i]&&(lm[i].visibility??1)>.5&&lm[i].x>0&&lm[i].x<1&&lm[i].y>0&&lm[i].y<1))return null;
  const p=(i:number):V=>[lm[i].x*w,lm[i].y*h],sw=Math.hypot(p(11)[0]-p(12)[0],p(11)[1]-p(12)[1])/h;
  if(sw>maxSw)return null;
  const ex=U([p(11)[0]-p(12)[0],p(11)[1]-p(12)[1]]),ey:V=[-ex[1],ex[0]];
  const b=(a:number,c:number):V=>{const d=[p(c)[0]-p(a)[0],p(c)[1]-p(a)[1]];return U([d[0]*ex[0]+d[1]*ex[1],d[0]*ey[0]+d[1]*ey[1]])};
  return[b(11,13),b(13,15),b(12,14),b(14,16)];
}
