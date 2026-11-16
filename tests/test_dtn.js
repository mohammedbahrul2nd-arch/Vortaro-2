/* Uji game Trennbar & Untrennbar Belanda (dtn): node tests/test_dtn.js */
const V=require('./load.js');
const {DNP,DNX,DNM,DNON,dnMake,dnCells,dnReal,GXO,gxItems,gxSetCur,gxView,gxAct,GXL}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
T(GXL.some(m=>m.id=='dtn'&&m.lg=='nl'),'dtn di hub');
const sc=DNP.filter(x=>x.sc),un=DNP.filter(x=>!x.sc);
T(sc.length>=60,'scheidbaar >=60: '+sc.length);T(un.length>=40,'onscheidbaar >=40: '+un.length);
const infs=new Set();
for(const x of DNP){T(!infs.has(x.inf),'ganda '+x.inf);infs.add(x.inf);
 T(x.inf.startsWith(x.p),'prefiks '+x.inf);T(['A2','B1','B2'].includes(x.lv),'level '+x.inf);
 T(['heeft','is'].includes(x.aux)&&x.pp,'perfectum '+x.inf);
 if(x.sc){T(!DNON.includes(x.p),'sc prefiks '+x.inf);T(x.pp.startsWith(x.p+'ge'),'pp scheidbaar prefiks+ge '+x.inf+' '+x.pp);T(x.te==x.p+' te '+x.stem,'te-inf scheidbaar '+x.te)}
 else{T(DNON.includes(x.p),'on prefiks '+x.inf);T(!x.pp.startsWith('ge')||x.p=='ge','on pp tanpa ge- '+x.inf+' '+x.pp);T(x.te=='te '+x.inf,'te-inf onscheidbaar '+x.te)}
 for(let i=0;i<2;i++){T(x.s[i].split('{').length==2&&x.s[i].includes('{'+x.p+'}'),'kalimat {prefiks} '+x.inf+i);T(x.t[i]&&x.t[i].length>5,'arti kalimat '+x.inf)}}
const items=gxItems('dtn');T(items.length>=400,'jumlah sel '+items.length);
const o=GXO('dtn');T(o.modes.length==5&&Object.keys(DNM).length==5,'lima jenis soal');
const keys=new Set();
for(const c of items){T(!keys.has(c.k),'kunci ganda '+c.k);keys.add(c.k);
 for(let t=0;t<8;t++){const q=dnMake(c);T(!!q,'make '+c.k);if(!q)continue;const b=q.blanks[0];
  T(b.opts.length>=(c.m=='ty'?2:3)&&new Set(b.opts).size==b.opts.length,'opsi unik/>=3 '+c.k+' '+b.opts);T(b.opts.includes(b.ok[0]),'jawaban ada '+c.k);
  T(q.parts.length>=2&&typeof q.say=='function'&&q.fullTxt,'struktur '+c.k);
  if(c.m=='pf'){const x=c.x;
   for(const p of b.opts)if(p!=x.p){T(!dnReal(p,x.stem),'pengecoh verba nyata '+p+x.stem);T(!DNP.some(y=>y.inf==p+x.stem),'pengecoh ada di data '+p+x.stem)}
   T(q.tr,'pf terjemah '+c.k);const full=q.parts[0]+x.p+(q.parts[2]||'');T(full==q.fullTxt,'pf kalimat lengkap '+full+' vs '+q.fullTxt)}
  if(c.m=='pp')for(const z of b.opts)T(/^(heeft|is) /.test(z),'pp aux '+z);
  if(c.m=='ty')T(b.opts.length==2,'ty dua opsi');
  if(c.m=='ar'){const kk=b.opts.map(i=>DNP.find(y=>y.inf==i));T(kk.every(Boolean),'ar verba valid '+c.k);const f=z=>z.tr.split(/;|\//)[0].replace(/\(.*?\)/g,'').trim().split(' ')[0].slice(0,5);T(new Set(kk.map(f)).size==kk.length,'ar arti tidak tumpang tindih '+kk.map(f))}}}
gxSetCur('dtn');gxAct('ggxlv','B2');const b2=gxItems('dtn');T(b2.length>0&&b2.length<items.length&&b2.every(c=>c.lv=='B2'),'filter B2 '+b2.length);gxAct('ggxlv','*');
T(/ggxlv/.test(gxView('dtn')),'tampilan dtn punya level');
console.log('test_dtn',n,'cek');
