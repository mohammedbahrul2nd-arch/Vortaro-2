/* node tests/export_zcl.js > KUNCI_PENGGOLONG.md  — tabel kata|penggolong|catatan dengan tingkat keyakinan */
const V=require('./load.js');const {ZCN,ZCV,ZCT,ZCTN,ZCL}=V;
const cat={p:'Orang',a:'Hewan',o:'Benda',f:'Makanan',d:'Minuman',l:'Tempat',e:'Hal & kejadian',w:'Cuaca'};
const L=['# Kunci jawaban penggolong Mandarin (量词)','','Tingkat: **baku** = standar tulis/pelajaran; **lisan lazim** (l) = umum dipakai lisan tetapi kurang baku (sering 个 sebagai pengganti); **diperdebatkan** (d) = penutur/kamus berbeda pendapat. Tanpa tanda = baku. Koreksi lewat tombol 🚩 di game atau beri tahu aku untuk mengubah `ZCT` di `gamedata.js`.','','## Kata benda','','| Kata | Pinyin | Arti | Penggolong (tingkat) | Kategori | Catatan |','|---|---|---|---|---|---|'];
ZCN.forEach(s=>{const a=s.split('|');const cl=a[3].split('/').map(c=>c+' ('+ZCTN[ZCT[a[0]+':'+c]||'b']+')').join(', ');L.push(`| ${a[0]} | ${a[1]} | ${a[2]} | ${cl} | ${cat[a[4]]||a[4]} | ${a[5]||''} |`)});
L.push('','## Penggolong verbal','','| Kalimat | Arti | Jawaban (tingkat) | Catatan |','|---|---|---|---|');
ZCV.forEach((v,i)=>L.push(`| ${v[0]} | ${v[2]} | ${v[3].map(c=>c+' ('+ZCTN[ZCT['#'+i+':'+c]||'b']+')').join(', ')} | ${v[4]||''} |`));
const cnt={b:0,l:0,d:0};ZCN.forEach(s=>{const a=s.split('|');a[3].split('/').forEach(c=>cnt[ZCT[a[0]+':'+c]||'b']++)});
L.push('',`Ringkasan kata benda: baku ${cnt.b}, lisan lazim ${cnt.l}, diperdebatkan ${cnt.d}.`);console.log(L.join('\n'));
