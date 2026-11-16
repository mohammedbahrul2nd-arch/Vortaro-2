/* Soal AI per game (v7.101.0): prompt per game × level, parser, impor, dan dimainkan lewat mesin tiap game */
const X=require('./load.js');let f=0,n=0;const ok=(c,m)=>{n++;if(!c){f++;console.log('GAGAL',m)}};
const {AQT,aqBuild,aqParse,aqAdd,aqClear,aqCells,aqMake,aqEx,aqList,aqGames,aqLevels,aqLang,aqBtn,aqGenSettings,aqGenCard,GXL,GXO,GCV,GCN,ACZ,gxSetCur,gxView,gxAct,gxState,gxClear,gxItems,gxFinish,ggView,aqSoloSet}=X;
X.S.o={};X.S.gg={};
const BAD=/undefined|NaN|\[object|null/;
const ids=aqGames();
ok(ids.length==GXL.length&&ids.length==49,'semua 49 game punya Soal AI: '+ids.length);
for(const g of ids){const L=aqLang(g),v=aqLevels(g);
 ok(v.length>=5&&v.join()==GCV[L].join(),'level '+g);
 ok(AQT[g.replace(/^(num|dt|px|shd|scl|gcl)_.*/,'$1')],'topik '+g);
 ok(aqBtn(g).includes('data-aq=open')&&aqBtn(g).includes(g),'tombol '+g);
 if(/^gcl_/.test(g))continue;
 const ex=aqEx(g);ok(ex.split('|').length==7&&ex.trim().endsWith(v[0]),'contoh 7 kolom '+g);
 for(let cap=0;cap<v.length;cap++){
  const t=aqBuild(g,cap,10,['rumah']);
  ok(t.includes('MAKSIMUM yang kupilih: '+v[cap]),'cap di prompt '+g+cap);
  ok(t.includes(ex),'contoh di prompt '+g);ok(t.includes(GXL.find(z=>z.id==g).t),'judul game '+g);
  ok(!BAD.test(t.replace(/“null”, “undefined”, atau “NaN”/,'')),'prompt bersih '+g+cap);
  const allowPart=t.split('3. Struktur yang boleh')[1].split('4. Kosakata')[0];
  for(const x of v.slice(cap+1))ok(!allowPart.includes(x+': '),'level atas bocor '+g+cap+x);
  for(const x of v.slice(0,cap+1))ok(allowPart.includes(x+': '),'level bawah hilang '+g+cap+x);
  /* contoh pada prompt lolos parser pada SEMUA batas level */
  const r=aqParse(ex,g,cap);ok(r.ok.length==1&&!r.bad.length,'contoh lolos '+g+cap+JSON.stringify(r.bad))}}
/* parser: batas level, celah, duplikat, rom */
{const g='pve',v=aqLevels(g),O=GXO(g);O.aq=[];
 const txt=`I'm ___ to it. | used | Aku terbiasa. | p | | | A1
She ___ it already. | has done | Dia sudah. | p | | | B2
She ___ it. | did | Dia. | p | | |
The ___ cat sat. | big;sat | x | | | | A1
Foo | a | b | c | | | A1
Foo ___ | a | b | c | | | A1
Bar ___ baz. | q | z | | | | A1`;
 const r=aqParse(txt,g,1);ok(r.ok.length==3,'ok='+r.ok.length+JSON.stringify(r.bad));
 ok(r.bad.some(b=>/melebihi batas A2/.test(b.why)),'B2 ditolak');ok(r.bad.some(b=>/level “kosong”/.test(b.why)),'lv kosong');ok(r.bad.some(b=>/jumlah jawaban/.test(b.why)),'celah vs jawaban');ok(r.bad.some(b=>/1–3 celah/.test(b.why)),'tanpa celah');
 ok(aqAdd(g,r.ok)==3&&aqList(g).length==3,'add');ok(aqList(g)[0].u==1&&aqList(g)[1].u==2,'uid');
 ok(aqParse(txt,g,1).ok.length==0&&aqParse(txt,g,1).bad.some(b=>/duplikat/.test(b.why)),'duplikat');
 const rz=aqParse('我 很 好，你 ___？ | 呢 | Saya baik. | p | Wǒ hěn hǎo, nǐ ne? | 吗~吧 | HSK 1\n我 在 家，你 ___ | 呢 | x | | | | HSK 1\n我 ___ ？吗 | 呢 | x | | pin | | HSK 1','num_zh',0);
 ok(rz.ok.length==1&&rz.ok[0].q[5].join()=='吗,吧','zh ban');ok(rz.bad.some(b=>/romanisasi/.test(b.why))&&rz.bad.some(b=>/tanda tanya/.test(b.why)),'zh rom/?');
 aqClear(g);ok(aqList(g).length==0,'clear');
 /* batas jumlah */
 const big=[];for(let i=0;i<230;i++)big.push(`Kalimat nomor ${i} ___ x. | a | t | | | | A1`);const rb=aqParse(big.join('\n'),g,0);ok(rb.ok.length==200&&rb.bad.some(b=>/maksimal 200/.test(b.why)),'maks 200');}
/* semua game: impor → sel → soal lewat mesin game → jawab → jadwal */
for(const g of ids){if(/^gcl_/.test(g))continue;const L=aqLang(g),v=aqLevels(g),O=GXO(g);O.aq=[];X.S.gg={};
 const rows=[];for(let i=0;i<8;i++){const c=aqEx(g).split('|').map(z=>z.trim());c[0]=c[0].replace('___','___ ')+(i?' '.repeat(0):'');/* variasi: tambah penanda unik tanpa mengubah jawaban */
  c[2]=c[2]+' ('+i+')';c[1]=c[1];rows.push(c.join(' | '))}
 /* beda kalimat: sisipkan angka di akhir kalimat sebelum tanda baca? cukup ubah kolom 1 dengan akhiran unik */
 const rows2=rows.map((r,i)=>{const c=r.split(' | ');c[0]=c[0].trim()+(L=='zh'||L=='ja'?'':' ')+(i?'':'');return c.join(' | ')});
 const r=aqParse(rows2.join('\n'),g,v.length-1);ok(r.ok.length==1,'dup kalimat sama ditolak '+g+r.ok.length);
 const distinct=[];for(let i=0;i<8;i++){const c=aqEx(g).split('|').map(z=>z.trim());c[0]='『'+i+'』'+(L=='zh'||L=='ja'?'':' ')+c[0];distinct.push(c.join(' | '))}
 const r2=aqParse(distinct.join('\n'),g,v.length-1);ok(r2.ok.length==8&&!r2.bad.length,'8 soal '+g+JSON.stringify(r2.bad));
 const before=gxItems(g).length;ok(aqAdd(g,r2.ok)==8,'add '+g);
 const cs=aqCells(g);ok(cs.length==8&&cs.every(c=>/^aq\|/.test(c.k)&&c.k.includes(g)),'sel '+g);
 if(/^(gen|gnl)$/.test(g)){ok(gxItems(g).length==8,'gen/gnl: hanya soal AI '+g)}else ok(gxItems(g).length==before+8,'gxItems bertambah '+g);
 /* jalankan lewat tampilan game */
 for(const x of gxItems(g))if(!x.aq)X.S.gg[x.k]={t:2,d:1e9,i:30};/* soal bawaan dianggap tidak jatuh tempo → hanya soal AI yang muncul */
 gxSetCur(g);gxClear();O.aqm='c';let h;
 if(/^(gen|gnl)$/.test(g)){aqSoloSet(g);h=ggView();ok(/Latih|Soal AI/.test(h)&&!BAD.test(h),'solo view '+g)}else h=gxView(g);
 let st=gxState();
 /* soal AI harus muncul (soal bawaan bisa muncul lebih dulu bila ada); paksa sel aq lewat reset sampai ketemu */
 let tries=0;while(!(st.q&&st.q.aq)&&tries++<80){gxAct('ggxnext');gxClear();h=/^(gen|gnl)$/.test(g)?ggView():gxView(g);st=gxState()}
 ok(st.q&&st.q.aq&&st.q.g==g,'soal AI muncul di game '+g);if(!(st.q&&st.q.aq))continue;
 ok(/gxs/.test(h)&&!BAD.test(h.replace(/『\d』/g,'')),'tampilan bersih '+g);
 ok(st.q.blanks.every(b=>b.opts.includes(b.ok[0])&&b.opts.length>=3)||st.q.typ,'opsi '+g);
 const q=st.q,k0=q.k;q.blanks.forEach((b,i)=>gxAct('ggxpick',String(i),b.ok[0]));
 const rs=gxState();ok(rs.r&&rs.r.sc==3,'benar → 3 '+g);ok(X.S.gg[k0]&&X.S.gg[k0].t,'jadwal tercatat '+k0);
 h=/^(gen|gnl)$/.test(g)?ggView():gxView(g);ok(/zcfl/.test(h)&&!BAD.test(h.replace(/『\d』/g,'')),'hasil + 🚩 '+g);
 /* mode ketik */
 O.aqm='t';gxClear();h=/^(gen|gnl)$/.test(g)?ggView():gxView(g);let s2=gxState(),t2=0;while(!(s2.q&&s2.q.aq)&&t2++<80){gxClear();h=/^(gen|gnl)$/.test(g)?ggView():gxView(g);s2=gxState()}
 if(s2.q&&s2.q.aq){ok(s2.q.typ&&/gcin0/.test(h),'ketik '+g);s2.q.judge(s2.q.blanks.map(b=>b.ok[0]));gxFinish();ok(gxState().r.sc==3,'ketik benar '+g)}
 aqSoloSet('');aqClear(g);ok(aqCells(g).length==0,'bersih '+g)}
/* filter level: soal AI ikut disaring bila game punya chip level */
{const g='scl_en',O=GXO(g);O.aq=[];const L='en';const mk=lv=>({q:['I ___ tea. '+lv,['drink'],'Aku minum teh.','','',[]],lv});aqAdd(g,[mk('A1'),mk('B1')]);O.lvs=[];ok(aqCells(g).length==2,'tanpa filter');O.lvs=['A1'];ok(aqCells(g).length==1&&aqCells(g)[0].lv=='A1','filter A1');O.lvs=[];aqClear(g)}
/* tombol lama di Pustaka & Kelas AI sudah dihapus; tombol baru ada di pengaturan */
{const fs=require('fs'),P=fs.readFileSync(__dirname+'/../docs/js/pustaka.js','utf8')+fs.readFileSync(__dirname+'/../docs/js/ai-class.js','utf8');ok(!/data-acz=open/.test(P)&&!/Cloze AI/.test(P),'tombol Pustaka/Kelas AI dihapus');
 for(const g of ['gen','scl_ja','num_zh','gcl_en','kas','jcn']){gxSetCur(g);gxClear();const h=/^(gen|gnl)$/.test(g)?ggView():gxView(g);ok(/data-aq=open/.test(h)&&/Soal AI/.test(h),'tombol di tampilan '+g)}}
/* satu arah: soal AI → Pustaka (kalimat lengkap); tidak ada jalur sebaliknya */
{X.S.sl=[];const g='num_zh',O=GXO(g);O.aq=[];
 const r=aqParse('我 家 有 ___ 口 人。 | 四 | Keluargaku ada empat orang. | angka 4 | Wǒ jiā yǒu sì kǒu rén. | | HSK 1\n他 有 ___ 本 ___ 。 | 三;书 | Dia punya tiga buku. | | Tā yǒu sān běn shū. | | HSK 1',g,0);
 ok(r.ok.length==2,'zh 2 soal');aqAdd(g,r.ok);
 ok(X.S.sl.length==2&&X.S.sl.some(x=>x.L=='zh'&&x.f=='我家有四口人。'&&x.i=='Keluargaku ada empat orang.'&&x.r=='Wǒ jiā yǒu sì kǒu rén.'),'kalimat lengkap masuk Pustaka: '+JSON.stringify(X.S.sl.map(x=>x.f)));
 ok(X.S.sl.some(x=>x.f=='他有三本书。'),'multi celah terisi');ok(X.aqLibNGet()==2,'jumlah dilaporkan');
 O.aq=[];aqAdd(g,aqParse('我 家 有 ___ 口 人。 | 四 | Keluargaku ada empat orang. | angka 4 | Wǒ jiā yǒu sì kǒu rén. | | HSK 1',g,0).ok);ok(X.S.sl.length==2&&X.aqLibNGet()==0,'tanpa duplikat di Pustaka');
 /* arah sebaliknya: menambah kalimat ke Pustaka tidak menambah soal game */
 const nq=aqList(g).length;X.S.sl.unshift({id:'zz',L:'zh',f:'我爱你。',r:'',i:'x',c:1,d:0});ok(aqList(g).length==nq&&aqCells(g).length==nq,'Pustaka → game: tidak ada');X.S.sl=[];}
console.log(f?`test_aq: ${f} GAGAL dari ${n}`:`test_aq lolos (${n} cek)`);process.exit(f?1:0);
