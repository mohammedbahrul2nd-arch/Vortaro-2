/* Audit 7(c): cadangan lama (tanpa kunci src/lv/spd/rep/hide/thr/self/weak) harus digabung otomatis dengan default oleh GXO. */
const V=require('./load.js');let n=0,bad=0;const ok=(c,m)=>{n++;if(!c){bad++;console.log('GAGAL:',m)}};
if(!V.GXO||!V.GXL||!V.VG){console.log('GAGAL: GXO/GXL/VG tidak diekspor di load.js');process.exit(1)}
const S=V.S||global.S;
const ids=V.GXL.map(g=>g.id);
ok(ids.length>=30,'jumlah game '+ids.length);
ok(new Set(ids).size==ids.length,'id game ganda');
for(const lg of['zh','ja','de','nl','en','eo'])ok(V.GXL.some(g=>g.lg==lg||g.id.endsWith('_'+lg)),'tidak ada game untuk '+lg);
ok(V.GXLG.length==6,'GXLG harus 6 bahasa: '+V.GXLG.length);
for(const g of ids){
  if(!V.VG[g])continue;
  const def=V.VG[g].def||{};
  /* cadangan lama: entri ada tetapi kosong / hanya sebagian */
  S.o.gx={[g]:{n:3}};
  const x=V.GXO(g);
  ok(x.n===3,g+': nilai lama n harus dipertahankan');
  for(const k in def)if(k!='n')ok(x[k]!=null,g+': kunci default hilang '+k);
  /* cadangan lama tanpa entri sama sekali */
  S.o.gx={};const y=V.GXO(g);
  for(const k in def)ok(y[k]!=null,g+': default tidak terisi '+k);
  /* cadangan rusak: gx bukan objek */
  S.o.gx='rusak';const z=V.GXO(g);ok(z&&typeof z=='object','gx rusak harus dipulihkan: '+g);
}
console.log('test_backup_lama:',n,'cek,',bad,'gagal');process.exit(bad?1:0);
