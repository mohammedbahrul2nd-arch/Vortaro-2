/* Kelas AI · Cloze (v7.90): batas level, parser, impor ke game */
const X=require('./load.js');let f=0,n=0;const ok=(c,m)=>{n++;if(!c){f++;console.log('GAGAL',m)}};
const {ACZ,GCLG,GCV,aczLv,aczCards,aczPick,aczBuild,aczParse,aczAdd,aczClear,aczCount,GXO,gcCells,gcMake,gcPool,gcStat,GCX}=X;
X.S.o={};X.S.gg={};
for(const L of GCLG){const v=GCV[L];ok(ACZ[L],'ACZ '+L);for(const lv of v)ok(ACZ[L].up[lv],'up '+L+' '+lv);
 ok(aczLv(L,v[0])==0&&aczLv(L,v[v.length-1].toLowerCase().replace(/ /g,''))==v.length-1,'aczLv '+L);ok(aczLv(L,'Z9')<0,'level asing '+L)}
ok(aczLv('zh','3')==2&&aczLv('zh','HSK3')==2,'zh digit');
/* prompt: batas level */
for(const L of GCLG){const v=GCV[L];for(let cap=0;cap<v.length;cap++){const cs=aczPick(L,cap,5,0);ok(cs.length>0,'kartu '+L+cap);
  ok(cs.every(g=>v.indexOf(String(g[2]))<=cap),'kartu di atas batas '+L+cap);
  if(!cs.length)continue;const t=aczBuild(L,cap,cs,2);ok(t.includes('MAKSIMUM yang kupilih: '+v[cap]),'cap di prompt '+L+cap);
  const hi=v.slice(cap+1);
  /* teks pengubah level lebih tinggi muncul HANYA di bagian DILARANG, tidak di bagian boleh */
  const bl=t.split('2. ')[1]||'',allowPart=t.split('3. Struktur yang boleh')[1].split('4. Kosakata')[0];
  for(const x of hi)ok(!allowPart.includes(x+': '),'level atas bocor ke bagian boleh '+L+cap+x);
  for(const x of v.slice(0,cap+1))ok(allowPart.includes(x+': '),'level bawah hilang '+L+cap+x);
  ok(t.includes(ACZ[L].ex),'contoh '+L)}}
/* parser: level, jumlah celah, duplikat */
const L='en',cs=aczPick(L,2,3,0),ids=cs.map(g=>g[0]);
const txt=`#1 ${cs[0][4]}
She ___ to school every day. | goes | Dia pergi ke sekolah. | present simple | | go~went | A1
She ___ tennis. | plays | Dia main tenis. | p | | | B1
She ___ it already. | has done | Dia sudah. | p | | | B2
She ___ it. | did | Dia. | p | | | 
The ___ cat sat. | big;sat | x | | | | A1
#2
It ___ rain. | will | Akan. | x | | | A2
#9 judul ngawur
Foo ___ | a | b | c | | | A1`;
const r=aczParse(txt,L,2,ids);
ok(r.ok.length==3,'ok='+r.ok.length+' '+JSON.stringify(r.bad));
ok(r.bad.some(b=>/melebihi batas B1/.test(b.why)),'B2 ditolak');
ok(r.bad.some(b=>/level “kosong”/.test(b.why)),'level kosong ditolak');
ok(r.bad.some(b=>/jumlah jawaban/.test(b.why)),'celah vs jawaban');
ok(r.bad.some(b=>/tidak dikenali/.test(b.why)),'kartu asing');
ok(Array.isArray(r.ok[0].q[1])&&r.ok[0].q[1][0]=='goes',"alt format");
/* impor + sel game */
const before=gcCells(L)(GXO('gcl_en')).length;
ok(aczAdd(L,r.ok)==3,'add');
const cells=gcCells(L)(GXO('gcl_en'));ok(cells.length==before+3,'sel bertambah');
const u=cells.filter(c=>c.x.u);ok(u.length==3&&u.every(c=>/^gc\|.+\|u\d+$/.test(c.k)),'kunci u');
ok(new Set(u.map(c=>c.k)).size==3,'kunci unik');
const q=gcMake(L,'gcl_en')(u[0]);ok(q.blanks.length==1&&q.blanks[0].opts.includes('goes')||q.typ,'make');
ok(q.blanks[0].opts.length>=2,'pengecoh ada (pool dari soal tambahan)');
ok(gcPool(L).some(p=>p.v=='goes'),'pool memuat jawaban tambahan');
ok(gcStat(L).us==3&&aczCount(L).q==3,'stat');
/* duplikat ditolak, hapus */
const r2=aczParse(txt,L,2,ids);ok(r2.ok.length==0&&r2.bad.some(b=>/duplikat/.test(b.why)),'duplikat');
/* ban + rom */
const rz=aczParse(`#1\n我 很 好，你 ___？ | 呢 | Saya baik. | p | Wǒ hěn hǎo, nǐ ne? | 吗~吧 | HSK 1\n我 在 家，你 ___ | 呢 | x | | | | HSK 1\n我 ___ ？吗 | 呢 | x | | pin | | HSK 1`,'zh',0,[X.gcCards().zh[0][0]]);
ok(rz.ok.length==1&&rz.ok[0].q[5].join()=='吗,吧','zh ban');ok(rz.bad.some(b=>/romanisasi/.test(b.why)),'rom wajib');ok(rz.bad.some(b=>/tanda tanya/.test(b.why)),'？ tengah');
aczClear(L);ok(aczCount(L).q==0&&gcCells(L)(GXO('gcl_en')).length==before,'clear');
console.log(f?`test_aicloze: ${f} GAGAL dari ${n}`:`test_aicloze lolos (${n} cek)`);process.exit(f?1:0);
