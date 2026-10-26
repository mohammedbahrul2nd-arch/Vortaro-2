/* ===== Kelas AI (v5.0): salin prompt belajar komprehensif untuk ChatGPT / Claude / Gemini =====
   Prompt dibangun dari materi aplikasi + kosakata/grammar yang masih lemah (lupa, belajar ulang,
   salah di latihan kalimat, masih belajar) PADA BAHASA YANG SAMA. Berlaku untuk semua bahasa.
   Modul ini hanya memakai fungsi/data app.js saat dipanggil, jadi aman dimuat sebelum app.js. */
const AIP={
 zh:{n:'Mandarin',fmt:'汉字 (spasi antar kata) / pinyin bertanda nada / arti Indonesia',
  lens:['urutan kata dan posisi keterangan (waktu, tempat, cara)','partikel & aspek yang terlibat (了, 过, 着, 的/得/地, 吗, 呢) bila relevan','penggolong / kata bilangan yang dipakai','nada dan perubahan nada yang rawan salah dengar (不, 一, nada 3)','lisan vs tulis, santai vs formal'],
  mn:'pecah hanzi menjadi radikal/komponen bermakna, cerita visual, kaitkan nada dengan gerakan tangan/gambar, kata majemuk lain yang memakai hanzi yang sama',
  jb:'jangan menerjemahkan kata per kata dari bahasa Indonesia (tidak ada imbuhan, jamak, atau kala seperti di Indonesia)'},
 ja:{n:'Jepang',fmt:'tulisan Jepang asli (kanji+kana) / hiragana atau furigana / romaji / arti Indonesia',
  lens:['tingkat kesopanan (kasual, です・ます, hormat) dan kapan dipakai','partikel yang terlibat (は・が・を・に・で・へ・と dst.) dan alasan pemilihannya','bentuk kata kerja / kata sifat yang terlibat (kelompok 1/2/3, bentuk kamus・ます・て・た・ない) dan cara membentuknya','urutan kata SOV dan pelesapan subjek','nuansa: sopan vs memaksa, lisan vs tulis'],
  mn:'pecah kanji menjadi komponen + bacaan on/kun, kata serumpun yang memakai kanji sama, gambar mental, kaitkan bunyi dengan kata Indonesia',
  jb:'jangan memindahkan struktur Indonesia (subjek-dulu, tanpa partikel) ke bahasa Jepang'},
 de:{n:'Jerman',fmt:'kalimat Jerman / arti Indonesia',
  lens:['gender & artikel (der/die/das) beserta bentuk jamaknya','kasus (Nominativ/Akkusativ/Dativ/Genitiv) dan akhiran yang berubah','posisi kata kerja (V2, akhir klausa, Satzklammer)','konjugasi, kata kerja kuat/tak beraturan, kata kerja terpisah, Perfekt vs Präteritum','Du vs Sie dan register'],
  mn:'kognat dengan bahasa Inggris/Belanda/Indonesia, warna untuk gender (der biru, die merah, das hijau), kata majemuk dipecah, kalimat jangkar yang memuat artikelnya',
  jb:'jangan memakai urutan kata Indonesia/Inggris begitu saja; perhatikan posisi kata kerja dan kasus'},
 nl:{n:'Belanda',fmt:'kalimat Belanda / arti Indonesia',
  lens:['de vs het dan bentuk jamak (-en / -s)','posisi kata kerja (V2, akhir klausa) dan urutan waktu-cara-tempat','kata kerja tak beraturan, kata kerja terpisah, voltooid (hebben/zijn)','kata "er", diminutif -je','jij/je vs u dan register','pelafalan khas (g, ui, ij, eu) yang rawan salah dengar'],
  mn:'kognat dengan Jerman/Inggris/Indonesia (banyak serapan Belanda), asosiasi bunyi, kata majemuk dipecah, kalimat jangkar yang memuat de/het-nya',
  jb:'jangan menyamakan urutan kata dengan bahasa Indonesia/Inggris; waspadai "false friend" dengan Jerman'},
 eo:{n:'Esperanto',fmt:'kalimat Esperanto / arti Indonesia',
  lens:['akhiran kelas kata (-o, -a, -e, -i, -as/-is/-os/-us/-u)','akusatif -n (objek & arah) dan urutan kata yang fleksibel','awalan/akhiran pembentuk kata (mal-, -ig-, -iĝ-, -ej-, -ul-, -ad-, -et-, -eg- dst.)','tabel korelatif (ki-, ti-, i-, ĉi-, neni-)','pembentukan kata dari akar'],
  mn:'pecah menjadi akar + afiks, kemiripan dengan bahasa Latin/Roman/Inggris, satu akar membuka satu keluarga kata',
  jb:'jangan lupa -n pada objek dan jangan membuat kata baru tanpa dasar akar yang jelas'}};
const AIX=['','Sering lupa'];
let aiCtx=null;
const aiO=()=>{const o=S.o;if(!o.aiM)o.aiM='all';if(!o.aiN)o.aiN=10;if(!o.aiW)o.aiW=8;if(o.aiG==null)o.aiG=1;if(!o.aiT)o.aiT='long';if(!o.aiP)o.aiP=4;if(!o.aiF)o.aiF='blk';if(!o.aiK)o.aiK='own';return o};
const aiClean=s=>String(s||'').replace(/\s*\$\\rightarrow\$\s*/g,' → ').replace(/\s+/g,' ').trim();
const aiIsV=k=>String(k).indexOf('@')>=0;
const aiPC=c=>PN[c[1]]||'Kata';

/* ---------- label & skor kelemahan: berdasarkan STATUS SAAT INI ----------
   Kartu yang sudah matang (interval ≥ 21 hari; grammar ≥ batas GCAP) dianggap sudah diingat,
   walau jumlah "lupa" lampaunya masih tercatat. Kalimat salah hanya dihitung bila baru (21 hari)
   dan percobaan terakhirnya belum tepat. */
const aiRem=(c,g)=>!!c&&c.t==2&&c.i>=(g?Math.min(21,typeof GCAP!='undefined'?GCAP:20):21);
function aiState(k,g){const c=S.srs[k];if(c&&c.z)return null;if(aiRem(c,g))return null;
 const t=[];let s=0,t1=0;
 if(c&&c.t==3){t.push('baru lupa, belajar ulang'+(c.l>0?' (lupa '+c.l+'× total)':''));s+=22;t1=1}
 else if(c&&c.t==1){t.push('masih belajar');s+=12}
 else if(c&&c.t==2){const f=(21-Math.min(c.i,21))/21;
  if(c.l>0){t.push('lupa '+c.l+'× · interval baru '+c.i+' hr');s+=8+2*Math.min(c.l,3)+4*f;t1=1}
  else{t.push('ulasan muda ('+c.i+' hr)');s+=4+3*f}}
 else if(S.p[k]==1){t.push('sedang dipelajari');s+=5}
 return{t,s,t1}}
function aiWrongRecent(k,g){if(g){const a=(LT('a')[k]||[]).filter(x=>Date.now()-x[0]<2592e6).slice(-4);if(!a.length)return 0;let b=0,w=1,tt=0;a.slice().reverse().forEach(x=>{b+=w*(x[2]==2?0:x[2]==1?.5:1);tt+=w;w*=.8});return b/tt>=.4?1:0}
 const h=(SI.w[k]||[]).filter(x=>Date.now()-x.t<18144e5);return h.length&&h[h.length-1].r<2?h.filter(x=>x.r==0).length||1:0}
/* kandidat kosakata lemah untuk satu bahasa */
function aiPoolV(L,exK){const keys=new Set();Object.keys(S.srs).forEach(k=>keys.add(k));Object.keys(S.p).forEach(k=>{if(S.p[k]==1)keys.add(k)});
 const out=[];keys.forEach(k=>{if(!aiIsV(k)||lang(k)!=L||k==exK)return;const c=K[base(k)];if(!c||!(c[3][L]||[]).length)return;
  const st0=aiState(k,0);if(!st0)return;const wr=(SI.w[base(k)]||[]).filter(h=>(h.l||'')==L).length?aiWrongRecent(base(k),0):0;
  let s=st0.s,tags=st0.t.slice(),t1=st0.t1;if(wr){s+=6;t1=1;tags.push('salah di latihan kalimat baru-baru ini')}
  if(s<=0)return;out.push({k,c,s,tags,tier:t1?1:2,pos:c[1]})});return out}
/* kandidat grammar lemah */
function aiPoolG(L,exK){const keys=new Set();Object.keys(S.srs).forEach(k=>{if(GK[k])keys.add(k)});Object.keys(S.p).forEach(k=>{if(GK[k]&&S.p[k]==1)keys.add(k)});Object.keys(LT('a')).forEach(k=>{if(GK[k])keys.add(k)});
 const out=[];keys.forEach(k=>{const g=GK[k];if(!g||g[1]!=L||k==exK)return;const c=S.srs[k];if(aiRem(c,1))return;
  const st0=aiState(k,1)||{t:[],s:0,t1:0},wr=aiWrongRecent(k,1);let s=st0.s,tags=st0.t.slice(),t1=st0.t1;
  if(wr){s+=8;t1=1;tags.push('salah di latihan grammar baru-baru ini')}
  if(s<=0)return;out.push({k,g,s,tags,tier:t1?1:2})});return out}
function aiSort(a,jit){return a.map(x=>({...x,j:x.s+Math.random()*(jit||0)})).sort((x,y)=>y.j-x.j)}
function aiTake(a,N){const q={V:Math.ceil(N*.4),N:Math.ceil(N*.35),A:Math.ceil(N*.25),O:Math.ceil(N*.15)},u={},out=[],rest=[];
 for(const x of a){const p=x.pos||'O';if(out.length<N&&(u[p]||0)<(q[p]||1)){out.push(x);u[p]=(u[p]||0)+1}else rest.push(x)}
 for(const x of rest){if(out.length>=N)break;out.push(x)}
 return out.sort((x,y)=>x.tier-y.tier||y.j-x.j)}

/* ---------- teks bantu ---------- */
function aiForm(e,pos,L){let t='';
 if(L=='de'&&typeof DX!='undefined'&&DX){if(pos=='N'&&DX.n[e[0]])t='jamak: '+DX.n[e[0]];else if(pos=='V'&&DX.v[e[0]])t='er/sie/es · Präteritum · Perfekt: '+DX.v[e[0]]}
 else if(L=='nl'&&typeof DXN!='undefined'&&DXN){if(pos=='N'&&DXN.n[e[0]])t='jamak: '+DXN.n[e[0]];else if(pos=='V'&&DXN.v[e[0]])t='hij/zij/het · verleden · voltooid: '+DXN.v[e[0]];else if(pos=='A'&&DXN.a[e[0]])t='komparatif: '+DXN.a[e[0]]}
 return t}
function aiWordLine(c,L,x){const seen=new Set(),es=(c[3][L]||[]).filter(e=>!seen.has(e[0])&&seen.add(e[0])).slice(0,2);
 const w=es.map(e=>e[0]+(e[1]?' ('+e[1]+')':'')).join(' / '),f=es.map(e=>aiForm(e,c[1],L)).filter(Boolean)[0];
 return `${w} = ${c[2]} [${aiPC(c)}]`+(f?` · ${f}`:'')}
const aiLvOf=(c,L)=>{const e=(c[3][L]||[])[0];return e&&e[3]?e[3]:''};
function aiExLines(g,n){return(g[7]||[]).slice(0,n).map(e=>'- '+e.split('\n').join(' | '))}
function aiSentHist(h){return h.s.replace(/\s+/g,' ').trim()}

/* konteks taksonomi grammar */
function aiTax(k){const out=[];if(!TX.G[k])return out;
 const t=txT(k),fn=txFn(k).map(x=>txL(x)),pr=txPri(k),reg=t.find(x=>x.startsWith('reg.')),nu=t.filter(x=>x.startsWith('nu.')),as=t.filter(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x));
 const bits=[];if(fn.length)bits.push('fungsi: '+fn.join(' · '));if(pr)bits.push('prioritas: '+PRIL[pr]);if(reg)bits.push('register: '+txL(reg));if(nu.length)bits.push('nuansa: '+nu.map(txL).join(', '));if(as.length)bits.push('aspek: '+as.map(txL).join(', '));
 if(bits.length)out.push('Peta grammar: '+bits.join(' | '));
 const w=o=>{const wk=aiState(o,1);return wk&&wk.t.length?' (aku masih lemah di sini)':''};
 (KM[k]||[]).forEach(i=>{const c=TX.K[i],oth=c[1].map(([s,n])=>[txK(s),n]).filter(x=>x[0]&&x[0]!=k);if(oth.length)out.push(`Sering tertukar (${c[0]}):\n`+oth.map(([o,n])=>`  - ${txNm(o)} [${GK[o][2]}]${w(o)} — ${n}`).join('\n'))});
 const pk=PRK[k]||[],pb=PRR[k]||[];
 if(pk.length)out.push('Prasyarat (idealnya sudah dikuasai): '+pk.map(o=>txNm(o)+w(o)).join(', '));
 if(pb.length)out.push('Jadi dasar untuk: '+pb.slice(0,8).map(o=>txNm(o)).join(', '));
 return out}

/* ---------- pemilihan bahan ---------- */
function aiGather(k,jit){const o=aiO(),v=aiIsV(k),L=v?lang(k):GK[k][1];
 const pv=aiSort(aiPoolV(L,k),jit),pg=aiSort(aiPoolG(L,k),jit);
 return{k,v,L,poolV:pv,poolG:pg,words:aiTake(pv,o.aiW),gr:pg.slice(0,v?2:3),off:new Set()}}


/* ---------- level kalimat: sesuai topik, atau level tertinggi yang dipilih di pengaturan ---------- */
function aiRank(L,n){const l=D.L.find(x=>x[0]==L);let i=l?l[4].indexOf(n):-1;if(i<0){const g=D.GL.find(x=>x[0]==L);i=g?g[3].indexOf(n):-1}return i}
function aiMaxLv(L){const o=S.o,names=[];const grab=a=>(a||[]).forEach(x=>{const p=String(x).split(':');if(p[0]==L&&p[1])names.push(p.slice(1).join(':'))});
 grab(o.ff);grab(o.gff);if(!names.length){grab(S.f);grab(S.gf)}
 let best=null,bi=-1;names.forEach(n=>{const i=aiRank(L,n);if(i>bi){bi=i;best=n}});return best}
function aiEff(L,own){if(aiO().aiK!='max')return own;const m=aiMaxLv(L);return m&&aiRank(L,m)>aiRank(L,own)?m:own}
function aiLvNote(L,own){const e=aiEff(L,own);return e&&own&&e!=own?` Level kalimat: ${e} (level tertinggi yang kupilih di aplikasi; topik utama sendiri berlevel ${own}). Kalimat boleh memakai tata bahasa dan kosakata setingkat itu, tetapi SEMUA kartu yang sedang kupelajari di daftar tetap wajib dipakai.`:''}
/* ---------- penyusun prompt ---------- */
function aiWeakBlock(ctx){const L=ctx.L,P=AIP[L],o=aiO(),ws=ctx.words.filter((x,i)=>!ctx.off.has(i)),h=[];
 const line=x=>`- ${aiWordLine(x.c,L,x)} — ${x.tags.join('; ')}`;
 const t1=ws.filter(x=>x.tier==1),t2=ws.filter(x=>x.tier==2);
 h.push(`### Kosakata ${P.n} yang masih lemah (data nyata dari riwayat belajarku)`);
 if(!ws.length)h.push(`(Aku belum punya kosakata ${P.n} yang tercatat lemah. Pakai kosakata umum yang sederhana untuk level ini.)`);
 else{if(t1.length)h.push(`SERING LUPA / SALAH (prioritas tertinggi, ulang paling sering):\n`+t1.map(line).join('\n'));
  if(t2.length)h.push(`MASIH BELAJAR / PENGULANGAN:\n`+t2.map(line).join('\n'))}
 const gs=o.aiG?ctx.gr:[];
 if(gs.length)h.push(`### Grammar ${P.n} lain yang masih lemah (sentuh ringan di contoh bila wajar, jangan jadi fokus)\n`+gs.map(x=>`- ${x.g[4]} [${x.g[2]}] — ${x.tags.join('; ')}${x.g[6]?' · pola: '+aiClean(x.g[6]):''}`).join('\n'));
 return h.join('\n\n')}

function aiRules(ctx,main,hasW,hasG){const gx=hasW||hasG,ex=[hasW?'kosakata lemah (prioritas SERING LUPA)':'',hasG?'grammar lemah':''].filter(Boolean).join(' dan/atau ');
 return `## ⚖️ ATURAN WAJIB UNTUK SETIAP KALIMAT\nBerlaku untuk SEMUA kalimat yang kamu tulis: contoh, dialog, soal tes, jawaban benar, dan kartu hafalan.\n`+
 `1. SETIAP kalimat HARUS memuat ${main}. Tidak boleh ada satu pun kalimat tanpa unsur ini. **Tebalkan** bagian yang menunjukkannya.\n`+
 (gx?`2. Di samping itu, SETIAP kalimat harus memuat minimal 1 elemen tambahan dari profil belajarku: ${ex}. Maksimal 3 elemen tambahan per kalimat supaya fokus tetap pada topik utama. Tandai elemen tambahan dengan _garis bawah_ atau huruf miring.\n3. Topik utama harus selalu menonjol; elemen tambahan hanya pendamping. Semua elemen di profilku harus muncul minimal 1× di seluruh jawaban, dan yang SERING LUPA minimal 2× dalam konteks berbeda.\n4. Jika sebuah elemen tambahan tidak cocok secara gramatikal atau makna, pakai elemen lain dari daftar, atau tulis “(dilewati: alasan)”. Jangan merusak kealamian kalimat demi memaksa elemen.\n`:`2. Kosakata pendamping: pakai kata sederhana yang umum; beri arti bila ada kata baru.\n`)+
 `${gx?5:3}. Di bawah setiap kalimat contoh tulis satu baris label: “Topik utama: … | Tambahan: …” agar aku bisa memeriksa bahwa aturan ini dipenuhi.`}
function aiBuildG(ctx){const o=aiO(),g=GK[ctx.k],L=ctx.L,P=AIP[L],eff=aiEff(L,g[2]),lvN=aiLvNote(L,g[2]),N=o.aiN,step=o.aiM=='step',ws=ctx.words.filter((x,i)=>!ctx.off.has(i)),hasW=ws.length>0;
 const kv=(g[10]||[]).filter(p=>p[0]||p[1]),cat=aiClean(g[3]),hist=(SI.g[ctx.k]||[]).filter(h=>h.r<2).slice(-3);
 const T=[];
 T.push(`## 🎯 PERAN\nKamu guru ${P.n} berpengalaman sekaligus pelatih memori. Muridmu: penutur bahasa Indonesia yang belajar ${P.n} (level ${eff}).${lvN} Jelaskan dalam bahasa Indonesia, tulis semua contoh dalam bahasa ${P.n}. Gaya: jelas, hangat, konkret, tanpa basa-basi panjang. Jika ragu soal fakta bahasa (pengecualian, nuansa), katakan ragu, jangan mengarang. Pakai bentuk yang natural, bukan terjemahan harfiah.`);
 const tp=[`Grammar: ${g[4]} (${P.n} ${g[2]})`];if(cat)tp.push(`Kategori: ${cat}`);if(g[5])tp.push(`${g[11]||'Fungsi'}: ${g[5]}`);if(g[6])tp.push(`Pola: ${g[6]}`);
 if(kv.length)tp.push(`Tabel/rincian: ${kv.map(p=>p[0]+' = '+p[1]).join('; ')}`);
 if(g[8].length)tp.push(`${g[12]||'Keterangan'}:\n`+g[8].map(x=>'- '+x).join('\n'));
 if(g[9].length)tp.push(`Kasus khusus:\n`+g[9].map(x=>'- '+x).join('\n'));
 if(g[7].length)tp.push(`Contoh dari materiku (jadikan acuan, jangan disalin mentah):\n`+aiExLines(g,3).join('\n'));
 aiTax(ctx.k).forEach(x=>tp.push(x));
 T.push(`## 📘 TOPIK HARI INI\n`+tp.join('\n'));
 let pr=`## 🧠 PROFIL BELAJARKU (dari aplikasi Vortaro)\nPakai data ini sebagai BAHAN contoh supaya aku sekalian mengulang apa yang paling sering kulupa.\n\n`+aiWeakBlock(ctx);
 if(hist.length)pr+=`\n\n### Kalimat buatanku sebelumnya dengan grammar ini (belum tepat)\n`+hist.map(h=>'- '+aiSentHist(h)).join('\n')+`\nAnalisis pola kesalahanku, koreksi, lalu sebut 1–2 kebiasaan yang perlu kuwaspadai.`;
 T.push(pr);
 T.push(aiRules(ctx,`grammar utama “${g[4]}”${g[6]?' (pola: '+aiClean(g[6])+')':''} dalam bentuk yang benar`,hasW,o.aiG&&ctx.gr.length>0));
 const lens=P.lens.map(x=>'   · '+x).join('\n');
 const S1=[
 `**1. Gambaran besar** — 3–4 kalimat: grammar ini untuk apa dan intuisi intinya, dengan analogi ke bahasa Indonesia.`,
 `**2. Rumus & cara membentuk** — langkah demi langkah (tabel bila ada pola/bentuk), termasuk pengecualian. Pastikan poin-poin berikut tercakup bila relevan:\n${lens}`,
 `**3. Kapan dipakai & kapan JANGAN** — situasi nyata, nuansa, register; beri 2 contoh “benar tapi tidak natural” beserta alasannya.`,
 `**4. Jebakan penutur Indonesia** — kesalahan paling sering; ingat: ${P.jb}. Tiap jebakan dengan contoh salah → benar.`,
 `**5. Pembeda dengan pola mirip** — tabel perbandingan singkat dengan pola yang sering tertukar${(KM[ctx.k]||[]).length?' (lihat “Sering tertukar” di atas)':''}.`,
 `**6. ${N} contoh kalimat berjenjang** (mudah → sulit; 1–3 pendek, sisanya makin natural). Setiap kalimat mengikuti ATURAN WAJIB di atas (grammar utama + elemen dari profilku). Untuk tiap kalimat: (a) ${P.fmt}; (b) bedah kata per kata singkat; (c) 1 kalimat “kenapa grammar ini dipakai di sini”; (d) baris label. Tutup dengan tabel rekap: elemen profil | bentuk yang dipakai | nomor kalimat.`,
 `**7. Mini dialog** 5–6 baris, tiap baris tetap memuat grammar utama${hasW?' plus elemen dari profilku':''} (aturan wajib berlaku), lengkap dengan terjemahan.`,
 `**8. Jembatan ingatan (mnemonik)** — ${hasW?'untuk setiap kata SERING LUPA di profilku, buat 1 asosiasi yang mudah diingat':'untuk 3 kata kunci dari pelajaran ini, buat 1 asosiasi yang mudah diingat'}; teknik yang bisa dipakai: ${P.mn}. Tambahkan 1 kalimat “jangkar” pendek yang gampang diingat, dan 1 rumus mnemonik untuk grammar ini.`,
 `**9. Tes ingat aktif** — JANGAN tampilkan jawaban dulu; tunggu jawabanku, lalu koreksi satu per satu dan jelaskan kesalahanku:\n   A. 5 soal isian rumpang (cloze) pada bagian grammar utama atau elemen profilku;\n   B. 5 soal terjemahan Indonesia → ${P.n} (kalimat sumber harus menuntut grammar utama);\n   C. 3 kalimat salah yang harus kuperbaiki (jebakan yang umum);\n   D. 3 soal “pilih yang tepat” antara pola mirip;\n   E. 1 tantangan produksi: aku menulis 3 kalimat sendiri dengan grammar ini + 3 kata dari profilku, kamu koreksi.`,
 `**10. Rangkuman & kartu hafalan** — rumus 1 kalimat + cheat-sheet 5 baris; lalu 8 kartu flashcard “depan | belakang”, satu per baris, siap disalin. Kartu berisi kalimat harus memuat grammar utama + elemen profilku.`,
 `**11. Jadwal ulang** — saran apa yang diulang hari ini, besok, +3, +7, +14 hari, dan 1 aktivitas 5 menit untuk setiap sesi.`];
 if(!step)T.push(`## 🛠️ CARA MENGAJAR (ikuti urutan, beri judul bernomor)\n`+S1.join('\n\n')+`\n\nAturan format: tabel untuk rumus/perbandingan/rekap; **tebal** untuk kata lemahku; jangan memotong di tengah bagian. Jika jawaban terlalu panjang, bagi jadi beberapa pesan dan akhiri tiap pesan dengan “ketik: lanjut”. Di akhir, tanya bagian mana yang masih membingungkan dan tawarkan sesi latihan lanjutan.`);
 else T.push(`## 🛠️ CARA MENGAJAR — MODE INTERAKTIF BERTAHAP\nAjari aku seperti les privat, bukan ceramah: kirim SATU tahap per pesan lalu berhenti dan tanya “sudah paham / lanjut?”. Jika aku bilang bingung, jelaskan ulang dengan cara berbeda sebelum lanjut.\nTahap 1–5 (konsep): ceritakan secara ringkas, lalu ajukan 1 pertanyaan cek-pemahaman sebelum lanjut.\nTahap 6–7: contoh dan dialog (aturan kosakata lemah di bawah).\nTahap 8: mnemonik.\nTahap 9: tes ingat — SATU soal per giliran, tunggu jawabanku, beri umpan balik, dan ULANGI soal/kata yang kujawab salah beberapa soal kemudian.\nTahap 10–11: rangkuman, kartu hafalan, jadwal ulang.\n\nIsi tiap tahap:\n`+S1.join('\n')+`\n\nMulai dari tahap 1 sekarang.`);
 return T.join('\n\n')}

function aiBuildV(ctx){const o=aiO(),L=ctx.L,P=AIP[L],c=K[base(ctx.k)],N=o.aiN,step=o.aiM=='step',ws=ctx.words.filter((x,i)=>!ctx.off.has(i)),hasW=ws.length>0;
 const es=c[3][L]||[],lv0=aiLvOf(c,L),lv=aiEff(L,lv0),lvN=aiLvNote(L,lv0),wr=(SI.w[base(ctx.k)]||[]).filter(h=>h.r==0&&(h.l||'')==L).length,tg=(()=>{const x=aiState(ctx.k,0),cc=S.srs[ctx.k];return x?x.t:(cc&&cc.t==2?['sudah cukup matang (interval '+cc.i+' hr)']:[])})(),hist=(SI.w[base(ctx.k)]||[]).filter(h=>h.r<2&&(h.l||'')==L).slice(-2);
 const T=[];
 T.push(`## 🎯 PERAN\nKamu guru ${P.n} berpengalaman sekaligus pelatih memori. Muridku penutur bahasa Indonesia yang belajar ${P.n}${lv?` (level ${lv})`:''}.${lvN} Jelaskan dalam bahasa Indonesia; semua contoh dalam bahasa ${P.n}. Gaya: jelas, hangat, konkret, tanpa basa-basi. Jika ragu soal fakta bahasa, katakan ragu, jangan mengarang. Pakai bentuk natural, bukan terjemahan harfiah.`);
 const tp=[`Kata: ${aiWordLine(c,L)}${lv0?' · level '+lv0:''}`];
 {const sn=new Set(),us=es.filter(e=>!sn.has(e[0])&&sn.add(e[0]));us.forEach(e=>{if(e[2])tp.push(`Contoh dari materiku${us.length>1?' ('+e[0]+')':''}: ${e[2]}`)})}
 if(tg&&tg.length)tp.push(`Status belajarku untuk kata ini: ${tg.join('; ')}`);
 T.push(`## 📘 KATA YANG DIPELAJARI\n`+tp.join('\n'));
 let pr=`## 🧠 PROFIL BELAJARKU (dari aplikasi Vortaro)\nPasangkan kata utama dengan kosakata ${P.n} lain di bawah ini (yang sering kulupa atau masih kupelajari) supaya aku sekalian mengulang.\n\n`+aiWeakBlock(ctx);
 if(hist.length)pr+=`\n\n### Kalimat buatanku sebelumnya dengan kata ini (belum tepat)\n`+hist.map(h=>'- '+aiSentHist(h)).join('\n')+`\nKoreksi dan jelaskan kebiasaan salahku.`;
 T.push(pr);
 {const wd=es.map(e=>e[0]).filter((x,i,a)=>a.indexOf(x)==i).join(' / ');T.push(aiRules(ctx,`kata utama “${wd}” (boleh dalam bentuk terkonjugasi/jamak/berubah sesuai tata bahasa)`,hasW,o.aiG&&ctx.gr.length>0))}
 const S1=[
 `**1. Inti kata** — makna utama + nuansa, ragam makna lain, kelas kata, bentuk-bentuk pentingnya (konjugasi/jamak/gender/bentuk sopan bila ada), pelafalan atau bacaan beserta jebakannya, register, dan seberapa sering dipakai.`,
 `**2. Anatomi & asal-usul** — komponen/akar/kognat/etimologi yang menjelaskan KENAPA artinya begitu. Teknik yang bisa dipakai: ${P.mn}.`,
 `**3. Kolokasi & frasa tetap** — 6–8 pasangan kata/pola yang paling sering dipakai penutur asli (termasuk partikel/preposisi/kasus yang menyertainya), masing-masing dengan arti.`,
 `**4. Keluarga kata & pembeda** — sinonim, antonim, kata turunan, dan kata mirip yang sering tertukar${hasW?' (cek juga daftar kata lemahku di atas)':''}: beda tegas + contoh minimal pasangan.`,
 `**5. ${N} contoh kalimat berjenjang** (mudah → sulit). Setiap kalimat mengikuti ATURAN WAJIB di atas: memuat kata utama + elemen dari profilku. Untuk tiap kalimat: ${P.fmt}; bedah singkat; catatan bila ada perubahan bentuk; baris label. Tutup dengan tabel rekap: elemen profil | bentuk | nomor kalimat.`,
 `**6. Mini cerita/dialog** 5–7 kalimat; tiap kalimat tetap memuat kata utama${hasW?' dan minimal 1 elemen profilku, dan seluruh cerita memuat SEMUA elemen profilku':''}, dengan terjemahan.`,
 `**7. Jembatan ingatan** — untuk kata utama${hasW?' dan setiap kata SERING LUPA':''}: 1 asosiasi (bunyi/gambar/cerita/komponen) + 1 kalimat jangkar yang mudah diingat.`,
 `**8. Tes ingat aktif** — JANGAN tampilkan jawaban dulu; tunggu jawabanku lalu koreksi satu per satu:\n   A. arti → ${P.n} (5 soal)  B. ${P.n} → arti (5 soal)  C. isian rumpang (5 soal; kalimat selalu memuat kata utama)  D. pilih kata yang tepat di antara kata mirip (3 soal)  E. 1 tantangan: aku menulis 3 kalimat dengan kata utama + kata dari profilku, kamu koreksi.`,
 `**9. Kartu hafalan & jadwal ulang** — 8 flashcard “depan | belakang” (satu per baris, siap disalin; kartu kalimat wajib memuat kata utama + elemen profil) dan jadwal ulang hari ini, besok, +3, +7, +14 hari.`];
 if(!step)T.push(`## 🛠️ CARA MENGAJAR (ikuti urutan, beri judul bernomor)\n`+S1.join('\n\n')+`\n\nAturan format: tabel untuk perbandingan/rekap; **tebal** untuk kata target. Jika jawaban terlalu panjang, bagi jadi beberapa pesan dan akhiri tiap pesan dengan “ketik: lanjut”. Di akhir, tanya bagian mana yang masih membingungkan.`);
 else T.push(`## 🛠️ CARA MENGAJAR — MODE INTERAKTIF BERTAHAP\nAjari seperti les privat: kirim SATU tahap per pesan lalu berhenti dan tanya “lanjut?”. Pada tahap 8 beri SATU soal per giliran, tunggu jawabanku, beri umpan balik, dan ULANGI soal/kata yang kujawab salah beberapa soal kemudian.\n\n`+S1.join('\n')+`\n\nMulai dari tahap 1 sekarang.`);
 return T.join('\n\n')}


/* ---------- prompt pendek: daftar kalimat + arti (+ romanisasi ja/zh) ---------- */
function aiBuildS(ctx){const o=aiO(),L=ctx.L,P=AIP[L],N=o.aiN,ws=ctx.words.filter((x,i)=>!ctx.off.has(i)),gs=o.aiG?ctx.gr:[],hasW=ws.length>0,hasG=gs.length>0;
 const rom=L=='ja'?'romaji':L=='zh'?'pinyin bertanda nada':'',T=[];
 let main,lv;
 if(ctx.v){const c=K[base(ctx.k)],es=c[3][L]||[],sn=new Set(),us=es.filter(e=>!sn.has(e[0])&&sn.add(e[0]));lv=aiLvOf(c,L);
  main=`Kata: ${aiWordLine(c,L)}${lv?' [level '+lv+']':''}`;const ex=us.map(e=>e[2]).filter(Boolean)[0];if(ex)main+=`\nContoh dari materiku: ${ex}`}
 else{const g=GK[ctx.k];lv=g[2];main=`Grammar: ${g[4]} [${g[2]}]`+(g[5]?`\n${g[11]||'Fungsi'}: ${g[5]}`:'')+(g[6]?`\nPola: ${aiClean(g[6])}`:'')+(g[8].length?`\n${g[12]||'Keterangan'}: ${g[8].slice(0,3).join(' ')}`:'')+(g[7].length?`\nContoh dari materiku:\n`+aiExLines(g,2).join('\n'):'')}
 const lvN=aiLvNote(L,lv);lv=aiEff(L,lv);
 T.push(`Buatkan ${N} kalimat contoh bahasa ${P.n} untuk latihanku (penutur Indonesia${lv?', level '+lv:''}).${lvN}`);
 T.push(`TOPIK UTAMA (wajib ada di SETIAP kalimat):\n${main}`);
 const add=[];
 if(hasW)add.push(`Kosakata ${P.n} (sering lupa / sedang kupelajari):\n`+ws.map(x=>`- ${aiWordLine(x.c,L,x)} — ${x.tags[0]}`).join('\n'));
 if(hasG)add.push(`Grammar ${P.n} (sering lupa / sedang kupelajari):\n`+gs.map(x=>`- ${x.g[4]} [${x.g[2]}]${x.g[6]?' · pola: '+aiClean(x.g[6]):''} — ${x.tags[0]}`).join('\n'));
 T.push(`PEMBENTUK KALIMAT (kartu lain milikku):\n`+(add.length?add.join('\n\n'):`(belum ada yang tercatat lemah; pakai kosakata sederhana yang umum)`));
 T.push(`ATURAN:\n1. SETIAP kalimat memuat topik utama (**tebalkan**).\n`+(add.length?`2. SETIAP kalimat juga memuat minimal 1 dan maksimal 3 pembentuk dari daftar di atas (_garis bawah_). Semua pembentuk harus muncul minimal 1×; yang sering lupa minimal 2×. Jika tidak cocok secara gramatikal/makna, pakai pembentuk lain, jangan memaksa.\n3.`:`2.`)+` Kalimat natural, urut dari mudah ke sulit (pendek → panjang), sesuai level${lv?' '+lv:''}. ${lvN?`Kata di luar daftar: boleh setingkat level ${lv}.`:'Kata di luar daftar: sederhana.'}`);
 T.push(`FORMAT (hanya daftar, tanpa penjelasan panjang). Untuk tiap nomor tulis persis:\n1. [kalimat ${P.n}]\n`+(rom?`   [${rom}]\n`:'')+`   [arti bahasa Indonesia]\n   Pembentuk: [topik utama + kata/grammar tambahan yang dipakai]`);
 return T.join('\n\n')}

/* ---------- prompt sedang: teks bacaan berparagraf ---------- */
function aiBuildM(ctx){const o=aiO(),L=ctx.L,P=AIP[L],NP=o.aiP,ws=ctx.words.filter((x,i)=>!ctx.off.has(i)),gs=o.aiG?ctx.gr:[],hasW=ws.length>0,hasG=gs.length>0;
 const rom=L=='ja'?'romaji':L=='zh'?'pinyin bertanda nada':'',T=[];let main,lv,mainShort;
 if(ctx.v){const c=K[base(ctx.k)],es=c[3][L]||[],sn=new Set(),us=es.filter(e=>!sn.has(e[0])&&sn.add(e[0]));lv=aiLvOf(c,L);mainShort=`kata “${us.map(e=>e[0]).join(' / ')}” (boleh berubah bentuk)`;
  main=`Kata: ${aiWordLine(c,L)}${lv?' [level '+lv+']':''}`;const ex=us.map(e=>e[2]).filter(Boolean)[0];if(ex)main+=`\nContoh dari materiku: ${ex}`}
 else{const g=GK[ctx.k];lv=g[2];mainShort=`grammar “${g[4]}”${g[6]?' (pola: '+aiClean(g[6])+')':''}`;main=`Grammar: ${g[4]} [${g[2]}]`+(g[5]?`\n${g[11]||'Fungsi'}: ${g[5]}`:'')+(g[6]?`\nPola: ${aiClean(g[6])}`:'')+(g[8].length?`\n${g[12]||'Keterangan'}: ${g[8].slice(0,3).join(' ')}`:'')+(g[7].length?`\nContoh dari materiku:\n`+aiExLines(g,2).join('\n'):'')}
 const lvN=aiLvNote(L,lv);lv=aiEff(L,lv);
 T.push(`Tulis sebuah teks bacaan bahasa ${P.n} untuk latihan ${o.aiF=='aud'?'listening':'membacaku'} (penutur Indonesia${lv?', level '+lv:''}) sepanjang ${NP} paragraf, ±4–5 kalimat per paragraf.${lvN}`);
 T.push(`TOPIK UTAMA (wajib ada di SETIAP kalimat):\n${main}`);
 const add=[];
 if(hasW)add.push(`Kosakata ${P.n} (sering lupa / sedang kupelajari):\n`+ws.map(x=>`- ${aiWordLine(x.c,L,x)} — ${x.tags[0]}`).join('\n'));
 if(hasG)add.push(`Grammar ${P.n} (sering lupa / sedang kupelajari):\n`+gs.map(x=>`- ${x.g[4]} [${x.g[2]}]${x.g[6]?' · pola: '+aiClean(x.g[6]):''} — ${x.tags[0]}`).join('\n'));
 T.push(`PEMBENTUK KALIMAT (kartu lain milikku):\n`+(add.length?add.join('\n\n'):`(belum ada yang tercatat lemah; pakai kosakata sederhana yang umum)`));
 T.push(`ATURAN:\n1. SETIAP kalimat dalam teks memuat ${mainShort}${o.aiF=='aud'?'':' (**tebalkan**)'}. Tidak boleh ada kalimat tanpa unsur ini.\n`+(add.length?`2. SETIAP kalimat juga memuat minimal 1 dan maksimal 3 pembentuk dari daftar di atas${o.aiF=='aud'?'':' (_garis bawah_)'}. Semua pembentuk harus muncul minimal 1× di seluruh teks; yang sering lupa minimal 2× dalam konteks berbeda. Jika tidak cocok secara gramatikal/makna, pakai pembentuk lain, jangan memaksa.\n3.`:`2.`)+` Teks harus mengalir sebagai satu cerita atau topik yang utuh (misalnya kejadian sehari-hari, surat, atau dialog singkat dalam narasi) dengan judul, bukan kumpulan kalimat lepas. Natural, sesuai level${lv?' '+lv:''}, mudah → sedikit menantang. ${lvN?`Kata di luar daftar: boleh setingkat level ${lv}.`:'Kata di luar daftar: sederhana.'}${o.aiF=='aud'?`\n${add.length?4:3}. MODE AUDIO: teks bahasa ${P.n} akan dibacakan text-to-speech, jadi di dalam teks (bahasa ${P.n} maupun Indonesia) JANGAN pakai penanda apa pun: tanpa tebal, garis bawah, tanda * _ # , tanpa nomor, tanpa romanisasi, tanpa tanda kurung penjelas. Tulis kalimat dengan tanda baca yang wajar dan panjang yang enak didengar.`:''}`);
 if(o.aiF=='aud')T.push(`FORMAT (untuk text-to-speech / listening):\nTulis TEPAT tiga blok berurutan, dipisah satu baris kosong, dan jangan menambah teks lain di dalam dua blok pertama:\n=== TEKS ${P.n.toUpperCase()} ===\n[paragraf 1 bahasa ${P.n}]\n\n[paragraf 2 bahasa ${P.n}]\n\n… (sampai paragraf ${NP}; satu paragraf = satu blok teks, dipisah baris kosong)\n\n=== TERJEMAHAN INDONESIA ===\n[paragraf 1 bahasa Indonesia]\n\n[paragraf 2 bahasa Indonesia]\n\n… (sampai paragraf ${NP}, urutan sama)\n\n=== PEMBENTUK YANG DIPAKAI ===\n(daftar singkat: topik utama + kata/grammar tambahan, dan di paragraf mana muncul)\nJudul teks tidak perlu. Tanpa penjelasan lain.`);
 else if(o.aiF=='sen')T.push(`FORMAT:\nJudul teks (${P.n} + arti Indonesia).\nLalu tulis per paragraf dengan penanda “Paragraf 1”, “Paragraf 2”, dst. Di bawah tiap penanda, untuk SETIAP kalimat (3–5 kalimat per paragraf) tulis persis ${rom?3:2} baris, lalu 1 baris kosong sebelum kalimat berikutnya:\n   [kalimat bahasa ${P.n}]\n`+(rom?`   [${rom}]\n`:'')+`   [arti bahasa Indonesia]\nContoh susunan:\nParagraf 1\n[kalimat ${P.n}]\n`+(rom?`[${rom}]\n`:'')+`[arti Indonesia]\n\n[kalimat ${P.n}]\n`+(rom?`[${rom}]\n`:'')+`[arti Indonesia]\n\nParagraf 2\n…\nSetelah paragraf terakhir, beri satu daftar singkat “Pembentuk yang dipakai” (topik utama + kata/grammar tambahan, dan di paragraf mana muncul). Tanpa penjelasan panjang di luar format ini.`);
 else T.push(`FORMAT:\nJudul teks (${P.n} + arti Indonesia).\nLalu untuk SETIAP paragraf, tulis berurutan:\n   [paragraf ${P.n} utuh]\n`+(rom?`   [${rom} untuk seluruh paragraf]\n`:'')+`   [terjemahan Indonesia paragraf itu]\nDi akhir teks beri “Daftar pembentuk yang dipakai”: topik utama + setiap kata/grammar tambahan dan di paragraf mana ia muncul. Tanpa penjelasan panjang di luar format ini.`);
 return T.join('\n\n')}
const aiBuild=ctx=>{const t=aiO().aiT;return t=='short'?aiBuildS(ctx):t=='mid'?aiBuildM(ctx):ctx.v?aiBuildV(ctx):aiBuildG(ctx)};

/* ---------- UI ---------- */
const aiBtn=(k,txt)=>`<button class="mini aibtn" data-ai=open data-k="${esc(k)}" title="Salin prompt belajar komprehensif untuk AI (ChatGPT / Claude / Gemini)" aria-label="Kelas AI">🎓${txt?' '+txt:''}</button>`;
function aiTitle(ctx){return ctx.v?`${AIP[ctx.L].n} · ${K[base(ctx.k)][3][ctx.L][0][0]}`:`${AIP[ctx.L].n} ${GK[ctx.k][2]} · ${GK[ctx.k][4]}`}
function aiPanel(){const c=aiCtx,o=aiO(),m=document.getElementById('aim');if(!m)return;
 const opt=(n,l,ops)=>`<div class=aio><small>${l}</small><div class=chips>${ops.map(([v,t])=>`<button class="chip${o[n]==v?' on':''}" data-ai=opt data-o=${n} data-v="${v}">${t}</button>`).join('')}</div></div>`;
 const tg=x=>`<span class="aitg ${x.tier==1?'t1':'t2'}">${esc(x.tags[0])}</span>`;
 const chips=c.words.map((x,i)=>{const e=(x.c[3][c.L]||[])[0]||['',''];return`<button class="aiw${c.off.has(i)?' off':''}" data-ai=chip data-v=${i} title="Ketuk untuk ${c.off.has(i)?'menyertakan':'mengeluarkan'} kata ini"><b>${esc(e[0])}</b>${e[1]?` <small>${esc(e[1])}</small>`:''}<span>${esc(x.c[2])}</span>${tg(x)}</button>`}).join('');
 const gch=o.aiG&&c.gr.length?`<div class=aio><small>Grammar lemah ikut disebut</small><div class=aigr>${c.gr.map(x=>`<span class="aitg ${x.tier==1?'t1':'t2'}">${esc(x.g[4])} · ${esc(x.tags[0])}</span>`).join('')}</div></div>`:'';
 const text=aiBuild(c);c.text=text;
 const nW=c.words.filter((x,i)=>!c.off.has(i)).length;
 m.querySelector('.edb').innerHTML=`<div class=aitabs role=tablist>${[['long','Panjang','Pelajaran lengkap + tes'],['mid','Sedang','Teks bacaan berparagraf'],['short','Pendek','Daftar kalimat + arti']].map(([v,t,d])=>`<button class="${o.aiT==v?'on':''}" data-ai=opt data-o=aiT data-v=${v} role=tab><b>${t}</b><small>${d}</small></button>`).join('')}</div><p class=gsub style="margin:4px 0 2px">Salin prompt ini ke <b>ChatGPT</b>, <b>Claude</b>, atau <b>Gemini</b>. ${o.aiT=='mid'?`Isinya teks bacaan berparagraf${c.L=='ja'?' + romaji':c.L=='zh'?' + pinyin':''} dan terjemahannya: topik utama di setiap kalimat, dibentuk bersama kosakata/grammar ${AIP[c.L].n} milikmu yang masih lemah.`:o.aiT=='short'?`Isinya daftar kalimat + arti${c.L=='ja'?' + romaji':c.L=='zh'?' + pinyin':''}: topik utama di setiap kalimat, dibentuk bersama kosakata/grammar ${AIP[c.L].n} milikmu yang masih lemah.`:`Isinya materi lengkap, urutan mengajar, tes ingat aktif, dan kosakata ${AIP[c.L].n} milikmu yang masih lemah.`}</p>`+
  `<div class=aiopts>${o.aiT!='long'?'':opt('aiM','Gaya belajar',[['all','Lengkap sekaligus'],['step','Interaktif bertahap']])}${o.aiT=='mid'?opt('aiP','Panjang bacaan',[[3,'3 paragraf'],[4,'4'],[6,'6']])+opt('aiF','Format bacaan',[['blk','Paragraf utuh + terjemahan'],['sen','Per kalimat: asing · romanisasi · Indonesia'],['aud','Audio / listening: semua paragraf asing, lalu semua Indonesia']]):opt('aiN','Contoh kalimat',[[6,'6'],[10,'10'],[15,'15']])}${opt('aiK','Level kalimat',[['own','Sesuai topik'],['max',aiMaxLv(c.L)?'Level tertinggi pilihanku ('+aiMaxLv(c.L)+')':'Level tertinggi pilihanku (belum dipilih)']])}${opt('aiW','Kata lemah maks.',[[5,'5'],[8,'8'],[12,'12']])}${opt('aiG','Grammar lemah ikut',[[1,'Ya'],[0,'Tidak']])}</div>`+
  `<div class=aio style="margin-top:12px"><div class=aih><small>Kosakata dari progresmu (${nW}/${c.words.length}) — ketuk untuk mengeluarkan</small><button class=mini data-ai=reroll>↻ Acak ulang</button></div>${c.words.length?`<div class=aiws>${chips}</div><p class=gsub style="margin:6px 0 0;font-size:.74rem">Dipilih dari status sekarang: kartu yang sudah matang (interval ≥ 21 hari) tidak dimasukkan walau pernah lupa.</p>`:`<div class="card empty" style="margin:6px 0 0;padding:12px"><b>Belum ada kosakata ${AIP[c.L].n} yang tercatat lemah</b>Setelah kamu memakai Flashcard (tombol “Lagi”) atau menandai kata sebagai “Sedang”, kata-kata itu otomatis masuk ke sini. Untuk sekarang AI memakai kosakata umum.</div>`}</div>${gch}`+
  `<div class=aio style="margin-top:12px"><div class=aih><small>Pratinjau prompt <i class=aicnt>${text.length.toLocaleString('id-ID')} karakter</i> — boleh diedit sebelum disalin</small></div><textarea id=aiTxt spellcheck=false>${esc(text)}</textarea></div>`}
function aiOpen(k){if(!k||(!aiIsV(k)&&!GK[k])||(aiIsV(k)&&!K[base(k)]))return;const L=aiIsV(k)?lang(k):GK[k][1];if(!AIP[L]){toast('Bahasa ini belum didukung Kelas AI.');return}
 aiClose();aiCtx=aiGather(k,0);
 const m=document.createElement('div');m.id='aim';m.className='edm';
 m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Kelas AI"><div class=edh><div><b>🎓 Kelas AI · salin prompt belajar</b><small>${esc(aiTitle(aiCtx))}</small></div><button class=mini data-ai=close aria-label=Tutup>✕</button></div><div class=edb></div><div class="edf aif"><button class=pri data-ai=copy>Salin prompt</button><div class=aisites><a data-ai=site href="https://chatgpt.com/" target=_blank rel=noopener>ChatGPT</a><a data-ai=site href="https://claude.ai/new" target=_blank rel=noopener>Claude</a><a data-ai=site href="https://gemini.google.com/app" target=_blank rel=noopener>Gemini</a>${navigator.share?'<button data-ai=share>Bagikan</button>':''}</div></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';aiPanel()}
function aiClose(){const m=document.getElementById('aim');if(m)m.remove();document.body.style.overflow='';aiCtx=null}
const aiText=()=>{const t=document.getElementById('aiTxt');return t&&t.value.trim()?t.value:(aiCtx?aiCtx.text:'')};
function aiCopy(){const t=aiText();if(!t)return false;ltCopy(t);toast('Prompt disalin ✓ Tempel di AI favoritmu');return true}
document.addEventListener('click',e=>{const m=document.getElementById('aim');
 if(m&&e.target===m){e.stopPropagation();aiClose();return}
 const b=e.target.closest&&e.target.closest('[data-ai]');if(!b)return;const a=b.dataset.ai;
 if(a=='site'){aiCopy();return}
 e.stopPropagation();e.preventDefault();
 if(a=='open'){aiOpen(b.dataset.k)}
 else if(!aiCtx)return;
 else if(a=='close')aiClose();
 else if(a=='copy')aiCopy();
 else if(a=='share'){const t=aiText();try{navigator.share({title:'Prompt Kelas AI',text:t}).catch(()=>{})}catch(x){}}
 else if(a=='reroll'){const o=aiO();aiCtx.poolV=aiSort(aiPoolV(aiCtx.L,aiCtx.k),4);aiCtx.poolG=aiSort(aiPoolG(aiCtx.L,aiCtx.k),4);aiCtx.words=aiTake(aiCtx.poolV,o.aiW);aiCtx.gr=aiCtx.poolG.slice(0,aiCtx.v?2:3);aiCtx.off=new Set();aiPanel()}
 else if(a=='chip'){const i=+b.dataset.v;aiCtx.off.has(i)?aiCtx.off.delete(i):aiCtx.off.add(i);aiPanel()}
 else if(a=='opt'){const o=aiO(),n=b.dataset.o;o[n]=(n=='aiM'||n=='aiT'||n=='aiF'||n=='aiK')?b.dataset.v:+b.dataset.v;if(n=='aiW'){aiCtx.words=aiTake(aiCtx.poolV,o.aiW);aiCtx.off=new Set()}save();aiPanel()}
},true);
document.addEventListener('keydown',e=>{if(!document.getElementById('aim'))return;if(e.key=='Escape'){aiClose()}else if((e.ctrlKey||e.metaKey)&&e.key=='Enter'){e.preventDefault();aiCopy()}});

/* kartu pintas di tab Grammar: grammar & kata paling lemah per bahasa */
function aiHub(){const rows=[];
 for(const L of Object.keys(AIP)){if(!D.L.some(l=>l[0]==L))continue;
  const g=aiSort(aiPoolG(L),0)[0],w=aiSort(aiPoolV(L),0)[0],lbl=AIP[L].n;
  if(g)rows.push(`<div class=row><div data-ai=open data-k="${esc(g.k)}" style="cursor:pointer"><b>${esc(g.g[4])}</b><br><small>${lbl} ${g.g[2]} · grammar · ${esc(g.tags[0])}</small></div>${aiBtn(g.k,'Prompt')}</div>`);
  if(w){const e=w.c[3][L][0];rows.push(`<div class=row><div data-ai=open data-k="${esc(w.k)}" style="cursor:pointer"><b>${esc(e[0])}</b> <small>${esc(e[1]||'')}</small><br><small>${lbl} · kata · ${esc(w.c[2])} · ${esc(w.tags[0])}</small></div>${aiBtn(w.k,'Prompt')}</div>`)}}
 return`<div class=card><b>🎓 Kelas AI</b><p class=gsub style="margin:2px 0 8px">Salin prompt belajar komprehensif (penjelasan → contoh → mnemonik → tes ingat → kartu hafalan) untuk ChatGPT, Claude, atau Gemini. Contoh kalimatnya otomatis memakai kosakata bahasa yang sama yang sering kamu lupa atau masih dipelajari. Tekan 🎓 di kartu grammar, kartu kata, atau Flashcard mana pun.</p>`+
 (rows.length?`<div class=gsec style="margin-top:6px">Yang paling perlu diulang sekarang</div>`+rows.join(''):'<small>Belum ada data lemah. Pakai Flashcard dulu; item yang kamu tandai “Lagi” atau “Sedang” akan muncul di sini. Kamu tetap bisa menekan 🎓 di grammar atau kata apa pun.</small>')+`</div>`}
