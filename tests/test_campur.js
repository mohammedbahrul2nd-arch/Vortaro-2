/* Uji Campur (campur.js): indeks per entri Indonesia, kesetaraan level, tampilan. node tests/test_campur.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const ctx={console,document:{addEventListener(){}},window:{},render(){}};vm.createContext(ctx);
vm.runInContext(J('data.js')+';this.D=D;',ctx);
const M={exports:{}};ctx.module=M;vm.runInContext(J('campur.js'),ctx);const mx=M.exports;
let ok=0,bad=0;const t=(c,m)=>{if(c)ok++;else{bad++;console.log('GAGAL:',m)}};
const D=ctx.D;
/* 1. D.C tidak diubah */
const before=JSON.stringify(D.C.slice(0,50));
const idx=mx.index();t(idx.length>1000,'indeks terisi '+idx.length);
t(idx.length<=D.C.length,'indeks tidak lebih besar dari kartu');
/* 2. kesetaraan level */
const eq={zh:{'HSK 1':'A1','HSK 2':'A2','HSK 3':'B1','HSK 4':'B2','HSK 5':'C1','HSK 7-9':'C2'},ja:{N5:'A1',N4:'A2',N3:'B1',N2:'B2',N1:'C1'},de:{B1:'B1',C1:'C1'},en:{C2:'C2'}};
for(const l in eq)for(const v in eq[l])t(mx.cefr(l,v)===eq[l][v],`cefr ${l} ${v} -> ${mx.cefr(l,v)}`);
/* 3. setiap level A1..C2 punya entri; jumlah masuk akal */
const lv=mx.levels();mx.LV.forEach(v=>t(lv.n[v]>0,'level '+v+' punya entri ('+lv.n[v]+')'));
t(lv.sub.A1.indexOf('HSK 1')>=0&&lv.sub.A1.indexOf('N5')>=0,'keterangan A1 memuat HSK 1 & N5: '+lv.sub.A1);
/* 4. pivot Indonesia: tiap grup berisi >=1 bahasa, entri level cocok dengan pilihan */
let multi=0;idx.forEach(g=>{const v=mx.visible(g,'B1');if(!v)return;if(Object.keys(v).length>1)multi++;for(const l in v)v[l].forEach(z=>{if(z.lv!=='B1')t(false,'level salah '+g.g+' '+l)})});
t(multi>50,'banyak grup B1 lintas bahasa ('+multi+')');
/* 5. 'hobi' (bila ada) mengumpulkan banyak bahasa */
const hb=idx.find(g=>g.g.toLowerCase()==='hobi'||g.g.toLowerCase()==='hobi/kegemaran');if(hb)t(Object.keys(hb.e).length>=2,'hobi >=2 bahasa');
/* 6. view: HTML, pagination, pencarian, bahasa dimatikan */
let h=mx.view({lv:'A1',q:'',lim:10});t(h.indexOf('class=row')>0,'view memuat baris');t(h.indexOf('data-a=more')>0,'tombol lebih banyak');
h=mx.view({lv:'all',q:'zzzzqqqq',lim:10});t(h.indexOf('Tidak ada entri')>0,'pencarian kosong');
h=mx.view({lv:'A1',q:'',lim:5000});const cnt=(h.match(/class=row/g)||[]).length;t(cnt===lv.n.A1,`jumlah baris A1 ${cnt} == ${lv.n.A1}`);
mx._off.add('zh');h=mx.view({lv:'A1',q:'',lim:5000});t(h.indexOf('<b style="color:#e11d48">ZH</b>')<0,'zh dimatikan tidak tampil');mx._off.clear();
/* 7. buka satu baris */
mx.view({lv:'all',q:'',lim:3});mx._open.add('0');h=mx.view({lv:'all',q:'',lim:3});mx._open.clear();t(h.indexOf('data-a=say')>0&&h.indexOf('data-a=wopen')>0,'baris terbuka memuat 🔊 & Buka kartu');
t(JSON.stringify(D.C.slice(0,50))===before,'D.C tidak berubah');
console.log(bad?bad+' GAGAL':'semua lolos ('+ok+' cek)');process.exit(bad?1:0);
