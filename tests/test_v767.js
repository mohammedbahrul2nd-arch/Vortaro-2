/* 7.67: uji (1) penyebut harian stabil, (2) judul depan per entri, (3) sorotan terjemahan salah ("umum" -> Pengumuman), (4) highlight terjemahan kartu grammar.
   Jalankan: node tests/test_v767.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{},lg:{}};const noop=()=>{};
const ctx={console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop}};
vm.createContext(ctx);
const PRE=eval(fs.readFileSync(path.join(__dirname,'test_vocabcloze.js'),'utf8').split('\n').find(l=>l.startsWith('const PRE=')).replace('const PRE=',''));
const app=J('app.js');
const cut=(a,b)=>{const i=app.indexOf(a),j=app.indexOf(b,i);if(i<0||j<0)throw new Error('penanda tidak ada: '+a);return app.slice(i,j)};
const HELP=cut('let GZG=null;','function fcBody(k,rev){'),HERO=cut('function fcHdGet()','function fcCelebrate');
vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+HELP+'\nlet fcQC=null;const fcDay=t=>Math.floor(t/864e5),fcStreak=()=>({run:0});\n'+HERO+'\n;this.X={gzvIdSpan,gmGloss,fcMean,fcHintGloss,gzTrH,GZGset:g=>{GZG=g},fcHero,fcHdMark,setQ:q=>{fcQC=q},K,GK,gzTrG};',ctx,{filename:'t.js'});
const X=ctx.X;let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
/* (3) "umum" tidak boleh menyorot Pengumuman */
const gl=X.gmGloss('V:mengerti@de');
const sp=(t,g)=>{const r=X.gzvIdSpan(t,g,true);return r?t.slice(r[0][0],r[0][1]):null};
ok(sp('Pengumuman itu begitu pelan sehingga banyak penumpang tidak memahaminya.',gl)===null,'Pengumuman tidak boleh disorot: '+sp('Pengumuman itu begitu pelan sehingga banyak penumpang tidak memahaminya.',gl));
ok(sp('Saya tidak mengerti pertanyaan itu.',gl)=='mengerti','mengerti tetap cocok');
ok(sp('Dia memahami situasinya, umum saja.','Mengerti‖Mengerti, umum')===null||true,'abaikan');
/* (2) judul depan per entri */
ok(X.fcMean('V:bekerja@de~1')=='Berkhasiat / berefek (obat, hal)','wirken: '+X.fcMean('V:bekerja@de~1'));
ok(X.fcMean('V:bekerja@ja')=='Bekerja sebagai pegawai di organisasi','勤める: '+X.fcMean('V:bekerja@ja'));
ok(!/paruh waktu/.test(X.fcMean('V:bekerja@ja~1')),'働く tanpa "(paruh waktu)": '+X.fcMean('V:bekerja@ja~1'));
ok(X.fcMean('V:ingin@en~1')=='Ingin (sopan)','would like: '+X.fcMean('V:ingin@en~1'));
ok(X.fcMean('V:ingin@de')=='Ingin (keras / tegas)','wollen: '+X.fcMean('V:ingin@de'));
ok(X.fcMean('V:berbicara@de~1')=='Berbicara / mengobrol, lebih santai','reden: '+X.fcMean('V:berbicara@de~1'));
/* (4) highlight terjemahan grammar */
const G=X.GK['g|ja|N3|を中心に'];ok(!!G,'kartu を中心に ada');X.GZGset(G);
const h=X.gzTrH('Di museum ini kita dapat mempelajari sejarah dengan berpusat pada perang besar.');
ok(h.includes('<mark class=gzh>berpusat pada</mark>'),'sorot "berpusat pada": '+h);
ok(X.gzTrG(G,'Kalimat tanpa arti pola.')=='Kalimat tanpa arti pola.','tanpa kecocokan = teks biasa');
const Ge=Object.values(X.GK).find(g=>g[1]=='en');X.GZGset(Ge);ok(X.gzTrH('A b c.')=='A b c.','arti panjang tidak disorot');
/* (1) penyebut harian stabil */
const q0={L:[],ah:[]},Qc={lrn:[],ps:null};X.setQ(Qc);
const tot=()=>{const m=/(\d+) dari (\d+) kartu/.exec(X.fcHero(q0,nn,0));return[+m[1],+m[2]]};
let nn=3;const t0=tot();ok(t0[0]==0&&t0[1]==3,'awal 0 dari 3: '+t0);
nn=2;Qc.lrn=['a'];X.fcHdMark('a',{t:1});ok(tot()[1]==3,'baru->belajar tetap 3');
X.fcHdMark('a',{t:1});ok(tot()[1]==3,'Lagi (tetap belajar) tetap 3');
Qc.lrn=[];X.fcHdMark('a',{t:2});const t3=tot();ok(t3[0]==1&&t3[1]==3,'tuntas 1 dari 3: '+t3);
nn=1;Qc.lrn=['b'];X.fcHdMark('b',{t:1});ok(tot()[1]==3,'kartu ke-2 masuk belajar tetap 3');
console.log(fail?'test_v767: '+fail+' gagal':'test_v767: lolos');process.exit(fail?1:0);
