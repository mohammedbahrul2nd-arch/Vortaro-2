/* A1: uji data & aturan jamak Jerman/Belanda. Jalankan: node tests/test_plural.js */
const X=require('./load.js');let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const{plDeAll,plNlAll,ggAll,dePlDer,nlPlDer,dePlDat,PLDE_SRC,PLNL_SRC}=X;
/* 1. data */
const dd=plDeAll(),nn=plNlAll(),ambD=X.plAmb('de'),ambN=X.plAmb('nl');
const inD=new Set(ggAll('de').map(x=>x.w)),inN=new Set(ggAll('nl').map(x=>x.w));
const used={de:0,nl:0};
for(const w in dd){const e=dd[w];if(!inD.has(w)){ok(0,'DE tak ada di data: '+w);continue}if(ambD[w]){ok(0,'DE ambigu: '+w);continue}used.de++;
 ok(/^[A-ZÄÖÜ]/.test(w),'DE huruf kapital '+w);ok(e.pl&&e.pl!=w||e.p=='0','DE jamak kosong '+w);
 if(e.p=='x')ok(/(en|er|e|s|a|n)$/.test(e.pl)||e.pl==w,'DE x aneh '+w+'='+e.pl)}
for(const w in nn){const e=nn[w];if(!inN.has(w)){ok(0,'NL tak ada di data: '+w);continue}if(ambN[w]){ok(0,'NL ambigu: '+w);continue}used.nl++;
 if(e.p=='sp'){ok(e.pl!=w+'en'&&/en$/.test(e.pl)&&e.pl[0]==w[0]&&Math.abs(e.pl.length-w.length)<=3,'NL sp janggal '+w+'='+e.pl)}
 else if(e.p=='x')ok(/(en|s|a|ën|ses)$/.test(e.pl),'NL x janggal '+w+'='+e.pl);
 else ok(e.pl==nlPlDer(e.p,w),'NL pola '+w)}
console.log('Kata jamak valid: DE',used.de,'NL',used.nl);
ok(used.de>=400,'target DE >=400');ok(used.nl>=400,'target NL >=400');
/* 1b. contoh bentuk (oracle manual) */
const exp={Haus:'Häuser',Buch:'Bücher',Kind:'Kinder',Mann:'Männer',Vater:'Väter',Mutter:'Mütter',Bruder:'Brüder',Apfel:'Äpfel',Arzt:'Ärzte',Stadt:'Städte',Hand:'Hände',Zug:'Züge',Bahnhof:'Bahnhöfe',Flughafen:'Flughäfen',Kühlschrank:'Kühlschränke',Ausflug:'Ausflüge',Pass:'Pässe',Schluss:'Schlüsse',Zoll:'Zölle',Baum:'Bäume',Wörterbuch:'Wörterbücher',Handtuch:'Handtücher',Krankenhaus:'Krankenhäuser',Schloss:'Schlösser',Bus:'Busse',Ergebnis:'Ergebnisse',Auto:'Autos',Computer:'Computer',Lehrer:'Lehrer',Schule:'Schulen',Student:'Studenten',Name:'Namen',Museum:'Museen',Datum:'Daten',Tag:'Tage',Rucksack:'Rucksäcke',Garten:'Gärten',Tochter:'Töchter',Bett:'Betten',Mensch:'Menschen',Kaufmann:'Kaufleute',Wort:'Wörter',Bild:'Bilder',Ei:'Eier'};
for(const w in exp)ok(!dd[w]||dd[w].pl==exp[w],`DE ${w}: ${dd[w]&&dd[w].pl} != ${exp[w]}`);
const expN={huis:'huizen',kind:'kinderen',stad:'steden',vader:'vaders',foto:"foto's",boom:'bomen',dag:'dagen',man:'mannen',glas:'glazen',les:'lessen',week:'weken',meisje:'meisjes',boek:'boeken',school:'scholen',straat:'straten',ei:'eieren',stuk:'stukken',prijs:'prijzen',boot:'boten',vraag:'vragen'};
for(const w in expN)ok(!nn[w]||nn[w].pl==expN[w],`NL ${w}: ${nn[w]&&nn[w].pl} != ${expN[w]}`);
ok(dePlDat('Kinder')=='Kindern'&&dePlDat('Frauen')=='Frauen'&&dePlDat('Autos')=='Autos'&&dePlDat('Häuser')=='Häusern','dativ jamak');
/* 2. soal: aturan */
const DEF={Nom:'die',Akk:'die',Dat:'den',Gen:'der'},O={Nom:'e',Akk:'e',Dat:'en',Gen:'er'};
const o=X.GXO('dad');const cells=X.deCells();const kinds={};
ok(cells.length>0,'sel DE kosong');
for(const m of['pa','pj','pf','pd']){const cs=cells.filter(c=>c.m==m);ok(cs.length>0,'tak ada sel '+m);let n=0;
 for(const c of cs)for(let i=0;i<60;i++){const q=X.deMake(c);if(!q)continue;n++;
  const b=q.blanks[0];ok(b.ok.length==1&&b.opts.includes(b.ok[0]),`DE ${m} ok tak ada di opsi`);ok(new Set(b.opts).size==b.opts.length,`DE ${m} opsi duplikat ${b.opts}`);
  const w=q.x.w,e=dd[w];ok(!!e,'kata luar data '+w);const sen=q.fullTxt;
  if(m=='pa')ok(b.ok[0]==DEF[c.cs],'pa salah '+c.cs);
  if(m=='pj'){const ex=c.v=='o'?O[c.cs]:'en';ok(b.ok[0]==ex,`pj ${c.cs}/${c.v} ${b.ok[0]}`)}
  if(m=='pf'){ok(b.ok[0]==e.pl,'pf jamak '+w);ok(b.opts.filter(z=>z==e.pl).length==1,'pf duplikat benar')}
  if(m=='pd'){ok(b.ok[0]==dePlDat(e.pl),'pd '+w);ok(/den /.test(sen),'pd kalimat')}
  if(m=='pa'&&c.cs=='Dat')ok(sen.includes(dePlDat(e.pl)),'pa Dat tambah -n '+sen);
  if(m=='pa'&&c.cs=='Nom')ok(/\b(sind|stehen|kommen|liegen|warten|beginnen|wohnen|fehlen|bleiben|waren)\b/.test(sen),'pa Nom kata kerja jamak: '+sen);
  ok(!/undefined|NaN|\[object/.test(sen+q.expl+q.cell),'teks rusak '+sen)}
 kinds[m]=n;ok(n>0,'DE '+m+' tak menghasilkan soal')}
console.log('DE soal diuji',JSON.stringify(kinds));
const nc=X.nlCells(),k2={};
for(const m of['pla','pld','plf']){const cs=nc.filter(c=>c.m==m);ok(cs.length>0,'tak ada sel NL '+m);let n=0;
 for(const c of cs)for(let i=0;i<60;i++){const q=X.nlMake(c);if(!q)continue;n++;const b=q.blanks[0],e=nn[q.x.w];ok(!!e,'NL kata luar data');
  ok(b.ok.every(v=>b.opts.includes(v)),'NL ok tak di opsi');ok(new Set(b.opts).size==b.opts.length,'NL opsi duplikat '+b.opts);
  if(m=='pla'){ok(b.ok.includes('de')&&!b.ok.includes('het')&&!b.ok.includes('een'),'pla aturan');ok(b.multi==1,'pla multi')}
  if(m=='pld'){ok(b.ok[0]=='e','pld harus +e')}
  if(m=='plf'){ok(b.ok[0]==e.pl,'plf '+q.x.w)}
  ok(!/undefined|NaN|\[object/.test(q.fullTxt+q.expl+q.cell),'NL teks rusak '+q.fullTxt)}
 k2[m]=n;ok(n>0,'NL '+m+' tak menghasilkan soal')}
console.log('NL soal diuji',JSON.stringify(k2));
/* 3. alur gxNext tidak error untuk semua mode */
for(const g of['dad','dnl']){let n=0;for(let i=0;i<300;i++){const q=X.gxNext(g);if(q)n++}ok(n>250,g+' gxNext jarang: '+n)}
/* 4. filter level: A1 saja */
X.GXO('dad').lv=['A1'];for(let i=0;i<100;i++){const q=X.deMake({k:'t',m:'pf',p:'n'});if(q)ok(q.x.lv=='A1','level DE bocor '+q.x.lv)}X.GXO('dad').lv=[];
console.log(fail?`${fail} GAGAL`:'SEMUA UJI LOLOS');process.exit(fail?1:0);
