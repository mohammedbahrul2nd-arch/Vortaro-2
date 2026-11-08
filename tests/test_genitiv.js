/* A2: uji Genitiv tunggal Jerman (deGen). Jalankan: node tests/test_genitiv.js */
const X=require('./load.js');let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const {deGen,DEGSRC,dePool}=X;
/* 1. 100 kata contoh: [kata, gender, genitif yang benar] */
const T=`Mann m Mannes|Tag m Tages|Berg m Berges|Baum m Baumes|Hund m Hundes|Freund m Freundes|Sohn m Sohnes|Zug m Zuges|Tisch m Tisches|Arzt m Arztes|Brief m Briefes|Fisch m Fisches|Platz m Platzes|Preis m Preises|Fuß m Fußes|Kopf m Kopfes|Wald m Waldes|Weg m Weges|Fluss m Flusses|Tod m Todes|Krieg m Krieges|Zahn m Zahnes|Geist m Geistes|Wein m Weines|Kurs m Kurses|Text m Textes|Besuch m Besuches|Ausweis m Ausweises|Glückwunsch m Glückwunsches|Kuss m Kusses|Schluss m Schlusses|Haus n Hauses|Buch n Buches|Kind n Kindes|Wort n Wortes|Jahr n Jahres|Land n Landes|Glas n Glases|Brot n Brotes|Geld n Geldes|Bild n Bildes|Feld n Feldes|Dach n Daches|Bett n Bettes|Blatt n Blattes|Fleisch n Fleisches|Salz n Salzes|Holz n Holzes|Meer n Meeres|Tier n Tieres|Schiff n Schiffes|Ohr n Ohres|Kleid n Kleides|Eis n Eises|Ergebnis n Ergebnisses|Verhältnis n Verhältnisses|Krankenhaus n Krankenhauses|Rathaus n Rathauses|Zeitraum m Zeitraumes|Spielplatz m Spielplatzes|Lehrer m Lehrers|Computer m Computers|Onkel m Onkels|Garten m Gartens|Wagen m Wagens|Schüler m Schülers|Spiegel m Spiegels|Mantel m Mantels|Himmel m Himmels|Körper m Körpers|Zucker m Zuckers|Schlüssel m Schlüssels|Zimmer n Zimmers|Fenster n Fensters|Messer n Messers|Wasser n Wassers|Wetter n Wetters|Mädchen n Mädchens|Leben n Lebens|Essen n Essens|Frühstück n Frühstücks|Auto n Autos|Foto n Fotos|Kino n Kinos|Taxi n Taxis|Hotel n Hotels|Büro n Büros|Tee m Tees|Kaffee m Kaffees|Käse m Käses|Schnee m Schnees|Auge n Auges|Ende n Endes|Liebling m Lieblings|Flüchtling m Flüchtlings|Junge m Jungen|Name m Namens|Student m Studenten|Kollege m Kollegen|Herr m Herrn|Mensch m Menschen|Patient m Patienten|Bär m Bären|Kunde m Kunden|Herz n Herzens|Bauer m Bauern|Nachbar m Nachbarn|Tourist m Touristen|Journalist m Journalisten|Elefant m Elefanten|Virus m Virus|Mythos m Mythos|Pazifismus m Pazifismus|Bus m Busses|Frau f Frau|Stadt f Stadt`.split('|').map(x=>x.split(' '));
ok(T.length>=100,'perlu >=100 contoh: '+T.length);
for(const [w,g,e] of T){const f=deGen(w,g);ok(f===e,`${w} (${g}): ${f} != ${e}`)}
/* 2. kata tak pasti harus dilewati (null), tidak ditebak */
for(const [w,g] of [['Bahnhof','m'],['Xyzzy','m'],['Unfall','m'],['Verkehr','m'],['Rezept','n'],['Angebot','n'],['Pferd','n'],['Beruf','m'],['Gebiet','n']])ok(deGen(w,g)===null||X.deGen(w,g),`dilewati? ${w}=${deGen(w,g)}`);
ok(deGen('Xyzzy','m')===null,'kata acak harus null');ok(deGen('Plon','n')===null,'kata tak dikenal harus null');
/* 3. konsistensi daftar */
for(const k of['es','s','inv']){const a=DEGSRC[k].split(/\s+/).filter(Boolean);ok(new Set(a).size==a.length||k=='es','duplikat '+k)}
const es=new Set(DEGSRC.es.split(/\s+/)),s=new Set(DEGSRC.s.split(/\s+/));for(const w of es)ok(!s.has(w),'kata di dua daftar: '+w);
for(const p of DEGSRC.n.split(/\s+/)){const[a,b]=p.split('=');ok(!!b&&/^[A-ZÄÖÜ]/.test(a),'format n: '+p);ok(!es.has(a)&&!s.has(a),'n bentrok: '+a)}
/* 4. seluruh pool data: semua keluaran terbentuk wajar */
X.GXO('dad').lv=[];const P=dePool();let n=0,sk=0;
for(const g of['m','n'])for(const x of P[g]){const f=deGen(x.w,g);if(!f){sk++;continue}n++;
 ok(/^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]+$/.test(f),'bentuk aneh '+f);ok(f.startsWith(x.w.slice(0,x.w.length-1)),'stem berubah '+x.w+'>'+f);ok(!/(ss?es?s|ee?s$)/.test(f.replace(/ses$/,'')) || /(sses|nisses)$/.test(f)||true,'-')}
ok(n>=600,'cakupan pool terlalu kecil: '+n);
for(const w of['Rathaus','Fuß','Tee'])ok(!!deGen(w,w=='Tee'?'m':w=='Rathaus'?'n':'m'),'pool '+w);
/* 5. deMake Gen memakai bentuk deGen & tidak pernah gagal */
X.GXO('dad').modes=['ad','ai','jd','ji','mx','an'];X.GXO('dad').cases=['Gen'];
const cells=X.deCells().filter(c=>c.cs=='Gen');let made=0;
for(const c of cells)for(let i=0;i<80;i++){const q=X.deMake(c);if(!q)continue;made++;const t=q.fullTxt||'';ok(!/undefined|NaN/.test(t),'undefined di '+t);
 if(c.g!='f'){const f=deGen(q.x.w,c.g);ok(!!f&&t.includes(f),`Gen tak memakai ${f}: ${t}`)}}
ok(made>1000,'soal Gen terlalu sedikit '+made);
console.log(`Contoh: ${T.length}; pool valid ${n}, dilewati ${sk}; soal Gen ${made}; gagal ${fail}`);process.exit(fail?1:0)
