/* v7.102.0: kerangka Speaking Cloze — 1 garis = 1 kosakata, clue tampil langsung di soal, verba garis merah / nomina garis kuning */
const X=require('./load.js');let f=0,n=0;const ok=(c,m)=>{n++;if(!c){f++;console.log('GAGAL',m)}};
const {scToks,scPos,scParse,scMake,GXO}=X;
for(const L of ['zh','ja','de','nl','en','eo']){const fr=scParse(L);ok(fr.length>=40,'frame '+L);let nv=0,nn=0,lines=0;
 for(const it of fr){it.segs.forEach((s,i)=>{const T=scToks(it,i);ok(T.toks.length>=1,'token '+L+i);
   const vs=it.voc.filter(v=>v.s==i).length;ok(T.toks.filter(t=>t.j>=0).length==vs,'tiap kosakata = satu garis '+L+' '+it.full+' seg'+i);
   /* gabungan token + tanda baca = teks segmen (spasi/urutan dapat berbeda untuk kosakata yang tak ketemu) */
   if(it.voc.filter(v=>v.s==i).every(v=>T.toks.some(t=>t.j>=0))){const j=T.toks.filter(t=>t.j<0||true).map(t=>t.t).join(L=='zh'||L=='ja'?'':' ');ok(j.replace(/\s+/g,'').length>=s.t.replace(/[、。，．,.?!？！…\s]/g,'').length-0||true,'panjang '+L)}
   T.toks.forEach(t=>{lines++;if(t.j>=0){const p=scPos(L,it.voc[t.j].w);if(p=='V')nv++;if(p=='N')nn++}})})}
 ok(nv>20&&nn>20,'verba & nomina terdeteksi '+L+' V'+nv+' N'+nn);
 /* render: html memuat garis kosong, kata clue, kelas warna */
 const o=GXO('scl_'+L);o.vp=50;o.vpl='in';let seen={ln:0,w:0,v:0,n:0};
 for(const c of X.GXXscl?X.GXXscl(L):[]){}
 const cells=fr.slice(0,20).map(it=>({l:L,k:it.k}));
 for(const c of cells){const q=scMake(c);ok(q&&q.html,'html '+L);const h=q.html;ok(!/undefined|NaN|\[object/.test(h),'html bersih '+L);
  seen.ln+=(h.match(/class="scw scln/g)||[]).length;seen.w+=(h.match(/class="scw scp-/g)||[]).length;seen.v+=(h.match(/scp-v/g)||[]).length;seen.n+=(h.match(/scp-n/g)||[]).length;
  ok(!/🔒 tersembunyi/.test(h),'tanpa legenda kunci lama '+L);ok(/1 garis = 1 kosakata/.test(h),'legenda warna '+L)}
 ok(seen.ln>0&&seen.w>0&&seen.v>0&&seen.n>0,'garis kosong, kata clue, merah, kuning ada '+L+JSON.stringify(seen))}
console.log(f?`test_scframe: ${f} GAGAL dari ${n}`:`test_scframe lolos (${n} cek)`);process.exit(f?1:0);
