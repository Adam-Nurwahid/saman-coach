import{Bones,Lesson,U,V}from'./core/geo';
const mk=(a:V,b:V):Bones=>[a,b,[-a[0],a[1]],[-b[0],b[1]]].map(x=>U(x as V));
const P=(id:string,name:string,cue:string,a:V,b:V)=>({id,name,cue,bones:mk(a,b)});
const seq=['siap','dada','tangan','angkat','silang','tangan','dada','siap'];
/** Materi bawaan: DRAF ilustrasi, belum divalidasi guru/sanggar. */
export const BUILTIN:Lesson={id:'saman-dasar',title:'Saman: gerak dasar (draf)',source:'bawaan',seq,times:seq.map((_,i)=>i*1.5),poses:[
  P('siap','Siap','Duduk tegak, kedua tangan di atas paha.',[.15,1],[-.3,.95]),
  P('dada','Tepuk dada','Siku dekat badan, kedua telapak ke dada.',[.35,.94],[-.92,-.38]),
  P('tangan','Tepuk tangan','Siku terbuka ke samping, telapak bertemu di depan dada.',[.8,.6],[-.9,-.43]),
  P('angkat','Angkat tangan','Siku setinggi bahu, telapak menghadap atas.',[.85,-.1],[.2,-.98]),
  P('silang','Silang','Lengan bawah bersilang di depan dada.',[-.2,.98],[-.8,-.6])]};
const K='lessons-v1';
const mine=():Lesson[]=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}};
export const loadLessons=()=>[BUILTIN,...mine()];
export const saveLesson=(l:Lesson)=>localStorage.setItem(K,JSON.stringify([...mine().filter(x=>x.id!==l.id),l]));
export const delLesson=(id:string)=>localStorage.setItem(K,JSON.stringify(mine().filter(x=>x.id!==id)));
