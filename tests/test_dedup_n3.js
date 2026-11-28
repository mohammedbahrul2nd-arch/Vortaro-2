/* Uji v7.111: duplikasi N3 ⊂ N4/N5 dihapus + migrasi progres (js/dedup-n3.js). node tests/test_dedup_n3.js
   Data: tak ada entri N3 yang teks Jepangnya sama dengan entri N4/N5; semua kunci tujuan/geser menunjuk entri yang ada; GSK utuh.
   Migrasi: interval terjauh menang, status tertinggi, tanpa kunci yatim, tanpa tabrakan, sekali jalan (idempoten), impor/merge aman. */
const fs=require('fs'),path=require('path'),vm=require('vm');const V=require('./load.js');
const dir=path.join(__dirname,'..','docs','js');
const {DD3,ddMig}=vm.runInNewContext(fs.readFileSync(path.join(dir,'dedup-n3.js'),'utf8')+';({DD3,ddMig})',{});
const GSK={};vm.runInNewContext(fs.readFileSync(path.join(dir,'gsk-ja-N3.js'),'utf8'),{GSK,Object});
let bad=0,n=0;const F=m=>{bad++;if(bad<40)console.log('GAGAL',m)};const ok=(c,m)=>{n++;if(!c)F(m)};
const eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m+' :: '+JSON.stringify(a)+' != '+JSON.stringify(b));
const K={};V.D.C.forEach(c=>K[c[0]]=c);
const nz=t=>t.normalize('NFKC').replace(/\s+/g,'').trim();
const ent=k=>{const i=k.indexOf('@ja');const c=K[k.slice(0,i)];return c&&c[3].ja&&c[3].ja[k.length>i+3?+k.slice(i+4):0]};
/* ---------- data ---------- */
const low=new Set(),cnt={};
for(const c of V.D.C)for(const e of(c[3].ja||[])){cnt[e[3]]=(cnt[e[3]]||0)+1;if(e[3]=='N4'||e[3]=='N5')low.add(nz(e[0]))}
for(const c of V.D.C)for(const e of(c[3].ja||[]))if(e[3]=='N3')ok(!low.has(nz(e[0])),'N3 masih duplikat N4/N5: '+e[0]);
eq([cnt.N4,cnt.N5,cnt.N3,cnt.N2],[626,663,3785,1710],'jumlah entri ja per level');
for(const c of V.D.C)ok(Object.keys(c[3]).length>0,'konsep kosong '+c[0]);
for(const[k,t]of Object.entries(DD3.mv)){ok(t.length>=1&&t.length<=2,'tujuan '+k);for(const x of t){const e=ent(x);ok(e&&(e[3]=='N4'||e[3]=='N5'),'tujuan bukan N4/N5 '+x)}}
for(const[k,t]of Object.entries(DD3.rn)){const e=ent(t);ok(e,'kunci geser tak ada '+t);ok(!(k in DD3.mv),'kunci geser juga dihapus '+k)}
const nk=Object.values(DD3.rn);ok(new Set(nk).size==nk.length,'kunci geser ganda');
for(const[cid,t]of Object.entries(DD3.cm)){ok(!K[cid],'konsep terbuang masih ada '+cid);ok(t.length&&t.every(x=>K[x]),'pengganti konsep '+cid)}
for(const k of Object.keys(GSK))ok(ent(k),'GSK menunjuk entri hilang '+k);
/* ---------- migrasi ---------- */
const card=(i,r,d,t)=>({t:t==null?2:t,s:0,e:250,i,d:d==null?20000+i:d,l:0,r:r||3});
const fresh=()=>({o:{lk:1},srs:{},p:{},s:{},ed:{g:{},v:{}},lib:[],sl:[],lt:{h:[],g:{},d:{}}});
const one=Object.keys(DD3.mv).find(k=>DD3.mv[k].length==1&&!(k in DD3.rn)),T=DD3.mv[one][0];
/* a) tujuan belum punya progres -> salinan; kunci lama hilang */
{const s=fresh();s.srs[one]=card(60);s.p[one]=1;s.s[one]=1;const r=ddMig(s);
 ok(!(one in s.srs)&&!(one in s.p)&&!(one in s.s),'kunci lama masih ada');eq(s.srs[T],card(60),'salinan jadwal');eq(s.p[T],1,'status');ok(s.s[T]===1,'seen');ok(s.o.dd3===1,'penanda');ok(r.moved==1,'moved')}
/* b) N3 lebih jauh -> N3 menang (contoh pengguna: 2 bulan vs 15 hari) */
{const s=fresh();s.srs[one]=card(60,5,30000);s.srs[T]=card(15,9,25000);ddMig(s);eq(s.srs[T],card(60,5,30000),'N3 menang');eq(s.p[T],1,'status <90 hari = Sedang')}
/* c) kartu tujuan lebih jauh -> tidak berubah */
{const s=fresh();s.srs[one]=card(15,9);s.srs[T]=card(60,2,31000);ddMig(s);eq(s.srs[T],card(60,2,31000),'tujuan menang')}
/* d) seri interval: ulasan terbanyak, lalu jadwal terjauh, lalu tujuan */
{let s=fresh();s.srs[one]=card(30,8);s.srs[T]=card(30,3);ddMig(s);eq(s.srs[T].r,8,'seri -> ulasan terbanyak');
 s=fresh();s.srs[one]=card(30,3,50000);s.srs[T]=card(30,3,40000);ddMig(s);eq(s.srs[T].d,50000,'seri -> jadwal terjauh');
 s=fresh();s.srs[one]=card(30,3,40000);const t2=card(30,3,40000);t2.e=111;s.srs[T]=t2;ddMig(s);eq(s.srs[T].e,111,'seri penuh -> tujuan')}
/* e) belajar (t=1) vs ulasan (t=2) dan sebaliknya */
{let s=fresh();s.srs[one]=card(0,0,1e12,1);s.srs[T]=card(5);ddMig(s);eq(s.srs[T].t,2,'ulasan mengalahkan belajar');
 s=fresh();s.srs[one]=card(5);s.srs[T]=card(0,0,1e12,1);ddMig(s);eq(s.srs[T].i,5,'ulasan N3 mengalahkan belajar tujuan')}
/* f) Selesai (>=90) -> status 2; chip Selesai tidak turun bila tujuan menang */
{let s=fresh();s.srs[one]=card(120);s.p[one]=2;ddMig(s);eq(s.p[T],2,'Selesai ikut');
 s=fresh();s.srs[one]=card(10);s.p[one]=1;s.srs[T]=card(100);s.p[T]=2;ddMig(s);eq(s.p[T],2,'Selesai tujuan dipertahankan')}
/* g) tangguhkan (z): milik kartu tujuan; tidak ikut dari N3; tujuan tetap tertangguh saat dikalahkan */
{let s=fresh();s.srs[one]={z:1};ddMig(s);ok(!s.srs[T],'z N3 tidak dipindah');
 s=fresh();s.srs[one]=Object.assign(card(60),{z:1});ddMig(s);ok(s.srs[T]&&!s.srs[T].z,'progres N3 pindah, z tidak ikut');
 s=fresh();s.srs[T]={z:1};s.srs[one]=card(60);ddMig(s);ok(s.srs[T].z===1&&s.srs[T].i==60,'tujuan tertangguh tetap tertangguh')}
/* h) status tanpa jadwal (o.lk mati): maks */
{const s=fresh();s.o.lk=0;s.p[one]=2;s.p[T]=1;ddMig(s);eq(s.p[T],2,'status maks')}
/* i) idempoten + tak menyentuh state yang sudah bertanda */
{const s=fresh();s.srs[one]=card(60);ddMig(s);const j=JSON.stringify(s);ok(ddMig(s)===null&&JSON.stringify(s)==j,'jalan kedua tidak mengubah apa pun')}
/* j) dua entri N3 -> satu tujuan: yang terjauh menang, tanpa bergantung urutan */
{const g={};for(const[k,t]of Object.entries(DD3.mv))if(t.length==1)(g[t[0]]=g[t[0]]||[]).push(k);const tk=Object.keys(g).find(x=>g[x].length>1);
 if(tk){const[a,b]=g[tk];for(const[x,y]of[[a,b],[b,a]]){const s=fresh();s.srs[x]=card(40);s.srs[y]=card(75);if(!(x in s.srs))continue;ddMig(s);eq(s.srs[tk].i,75,'dua sumber, terjauh menang')}}else ok(true,'(tak ada kasus dua-sumber)')}
/* k) dua tujuan (N4 dan N5 sama teksnya): keduanya dapat progres N3, masing-masing dibandingkan sendiri */
{const k2=Object.keys(DD3.mv).find(k=>DD3.mv[k].length==2);if(k2){const[t1,t2]=DD3.mv[k2],s=fresh();s.srs[k2]=card(50);s.srs[t1]=card(90);ddMig(s);eq(s.srs[t1].i,90,'tujuan 1 lebih jauh tetap');eq(s.srs[t2].i,50,'tujuan 2 menerima N3')}}
/* l) kunci yang bergeser: nilai ikut ke kunci baru; tak ada tabrakan dengan kunci lain */
{const s=fresh();let i=0;for(const[o,nw]of Object.entries(DD3.rn)){s.srs[o]=card(100+i,1,i);s.p[o]=1;i++}ddMig(s);i=0;
 for(const[o,nw]of Object.entries(DD3.rn)){ok(s.srs[nw]&&s.srs[nw].i==100+i,'rn '+o+' -> '+nw);i++}
 eq(Object.keys(s.srs).length,Object.keys(DD3.rn).length,'jumlah kartu geser tetap')}
/* m) semua kunci lama dimigrasi sekaligus: hasil hanya berisi kunci yang ADA di data baru (tanpa yatim) dan tanpa kehilangan kartu */
{const s=fresh();let i=0;const all=Object.keys(DD3.mv).concat(Object.keys(DD3.rn));for(const k of all){s.srs[k]=card(1+(i++%200));s.p[k]=1;s.s[k]=1}
 const before=Object.keys(s.srs).length;ddMig(s);
 for(const k of Object.keys(s.srs).concat(Object.keys(s.p),Object.keys(s.s)))ok(ent(k),'kunci yatim '+k);
 const tg=new Set(Object.values(DD3.mv).flat());ok(Object.keys(s.srs).length>=Object.keys(DD3.rn).length&&Object.keys(s.srs).length<=before,'jumlah kartu wajar');
 for(const t of tg)ok(s.srs[t],'tujuan tanpa jadwal '+t)}
/* n) edit kosakata (S.ed.v): indeks ikut bergeser; edit N3 yang dihapus pindah ke tujuan bila slot kosong */
{const rk=Object.keys(DD3.rn)[0],cid=rk.slice(0,rk.indexOf('@ja')),oi=rk.includes('~')?+rk.split('~')[1]:0,ni=DD3.rn[rk].includes('~')?+DD3.rn[rk].split('~')[1]:0;
 const s=fresh();const e=[];e[oi]=['x','y','z'];s.ed.v[cid]={e:{ja:e}};ddMig(s);eq(s.ed.v[cid].e.ja[ni],['x','y','z'],'edit ikut indeks baru');
 const s2=fresh(),td=T.slice(0,T.indexOf('@ja')),ti=T.includes('~')?+T.split('~')[1]:0,oc=one.slice(0,one.indexOf('@ja')),oi2=one.includes('~')?+one.split('~')[1]:0;
 if(K[oc]||DD3.cm[oc]){const a=[];a[oi2]=['p','q','r'];s2.ed.v[oc]={e:{ja:a}};ddMig(s2);eq((s2.ed.v[td]&&s2.ed.v[td].e&&s2.ed.v[td].e.ja||[])[ti],['p','q','r'],'edit pindah ke tujuan')}
 const s3=fresh(),a3=[];a3[oi2]=['p','q','r'];s3.ed.v[oc]={e:{ja:a3}};const b3=[];b3[ti]=['asli','',''];s3.ed.v[td]=Object.assign(s3.ed.v[td]||{},{e:{ja:b3}});ddMig(s3);
 if(oc!=td||oi2!=ti)eq(s3.ed.v[td].e.ja[ti],['asli','',''],'edit tujuan tidak ditimpa')}
/* o) kunci tunggal di S.o: rotasi dibuang, daftar «bukan contoh» digabung, kartu terakhir dipetakan */
{const s=fresh();s.o.fcn=one;s.o.fcl=T;s.o.gsr={[one]:[1,2],[T]:[0]};s.o.gmNo={[one]:['a','b'],[T]:['b','c']};s.o.hd={d:1,c:{[one]:1}};ddMig(s);
 eq(s.o.fcn,T,'fcn');eq(s.o.fcl,T,'fcl');ok(!(one in s.o.gsr)&&!(T in s.o.gsr),'rotasi dibuang');eq(s.o.gmNo[T],['b','c','a'],'gmNo gabung');ok(s.o.hd.c[T]===1&&!(one in s.o.hd.c),'hd')}
/* p) tag Pustaka & riwayat latihan ke konsep yang dibuang -> konsep pengganti */
{const cid=Object.keys(DD3.cm)[0],rep=DD3.cm[cid];const s=fresh();
 s.lib=[{id:1,ps:[{f:['x'],tg:[[{t:'v',k:cid,ks:[cid,'zzz'],n:'a',s:'b'}]]}]}];s.sl=[{id:2,f:'y',tg:[{t:'v',k:cid,ks:[cid],n:'a',s:'b'}]}];s.lt.h=[{k:[cid,'zzz']}];ddMig(s);
 const it=s.lib[0].ps[0].tg[0][0];eq(it.k,rep[0],'tag k');ok(it.ks.includes(rep[0])&&it.ks.includes('zzz')&&!it.ks.includes(cid),'tag ks');eq(s.sl[0].tg[0].k,rep[0],'tag sl');ok(!s.lt.h[0].k.includes(cid)&&s.lt.h[0].k.includes(rep[0]),'lt.h')}
/* q) impor berkas lama (flag=false): dimigrasi tanpa menandai berkas dan tanpa membuat o */
{const d={srs:{[one]:card(60)},p:{[one]:1}};const r=ddMig(d,false);ok(r&&!d.o,'tanpa o baru');ok(d.srs[T]&&!d.srs[one],'dimigrasi');const j=JSON.stringify(d);
 const d2=fresh();d2.o.dd3=1;d2.srs[one]=card(5);ok(ddMig(d2,false)===null&&d2.srs[one],'berkas bertanda dilewati')}
/* r) state kosong / pengguna baru / bentuk aneh tidak melempar galat */
{for(const x of[{},{o:{}},{srs:null,p:[],ed:{v:null}},{o:{gsr:null,gmNo:[],hd:{}}}])try{ddMig(x);ok(true)}catch(e){F('galat '+e.message)}
 ok(ddMig(null)===null,'null')}
console.log(`test_dedup_n3: ${n} cek${bad?', '+bad+' GAGAL':', 0 gagal'} (hapus ${Object.keys(DD3.mv).length} entri N3, geser ${Object.keys(DD3.rn).length} kunci, buang ${Object.keys(DD3.cm).length} konsep)`);process.exit(bad?1:0);
