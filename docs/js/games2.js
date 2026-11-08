/* ===== Games v7.20: hub + mesin soal bersama =====
   Gim: gen (Tebak Gender Jerman) · gnl (Tebak Gender Belanda) (keduanya di games.js) · zcl (Penggolong Mandarin) · phv (Phrasal Verbs Inggris, data di gamedata2.js) · dtv (Trennbare Verben Jerman, data di gamedata3.js) · dad (Artikel & akhiran adjektiva Jerman) · dnl (Belanda)
   SRS memakai S.gg (kunci berawalan: zc| zv| dr|) dan fcCalc. Statistik harian di S.gxd. Opsi di S.o.gx[gim]. */
const GXL=[
 {id:'gen',ic:'⚥',t:'Tebak Gender Jerman',d:'der / die / das untuk kata benda Jerman.',tag:'DE',lg:'de'},
 {id:'gnl',ic:'⚥',t:'Tebak Gender Belanda',d:'de / het untuk kata benda Belanda.',tag:'NL',lg:'nl'},
 {id:'zcl',ic:'个',t:'Penggolong Mandarin',d:'个 · 口 · 杯 · 本 … Pilih semua penggolong (量词) yang tepat.',tag:'ZH',lg:'zh'},
 {id:'dad',ic:'der',t:'Artikel & Akhiran Jerman',d:'Tebak der/den/dem/des, ein/einen/einem/eines dan akhiran adjektiva menurut kasus.',tag:'DE',lg:'de'},
 {id:'dnl',ic:'de',t:'Artikel & Akhiran Belanda',d:'Tebak de/het/een, dit/dat/deze/die, dan adjektiva dengan atau tanpa -e.',tag:'NL',lg:'nl'},
 {id:'phv',ic:'up',t:'Phrasal Verbs Inggris',d:'give up, look after, put up with … Pilih partikel yang tepat atau arti phrasal verb.',tag:'EN',lg:'en'},
 {id:'dtv',ic:'an',t:'Trennbare Verben Jerman',d:'anrufen, aufstehen, besuchen … Pilih prefiks, bentuk Perfekt / zu-Infinitiv, atau trennbar vs untrennbar.',tag:'DE',lg:'de'}];
/* urutan hub: default dikelompokkan per bahasa; urutan pribadi disimpan di S.o.gxOrd (daftar id) */
const GXLG=[['zh','Mandarin'],['en','Inggris'],['de','Jerman'],['nl','Belanda']];
const gxIsGen=g=>g=='gen'||g=='gnl';
let gxEdit=0;
function gxOrdered(){const def=GXL.map((m,i)=>({m,i,r:GXLG.findIndex(z=>z[0]==m.lg)})).sort((a,b)=>a.r-b.r||a.i-b.i).map(z=>z.m),sv=Array.isArray(S.o.gxOrd)?S.o.gxOrd:null;
 if(!sv)return def;const out=[];for(const id of sv){const m=def.find(z=>z.id==id);if(m&&!out.includes(m))out.push(m)}for(const m of def)if(!out.includes(m))out.push(m);return out}
function gxMove(id,dir){const cur=gxOrdered().map(m=>m.id),i=cur.indexOf(id),j=dir=='up'?i-1:i+1;if(i<0||j<0||j>=cur.length)return;[cur[i],cur[j]]=[cur[j],cur[i]];S.o.gxOrd=cur}
const GXO=(g)=>{const o=ggO();if(!o.gx||typeof o.gx!='object')o.gx={};const d={zcl:{n:10,r:200,py:1,cats:[],verb:1,acc:'l',ov:{}},dad:{n:6,r:200,modes:['ad','ai','jd','ji','mx','an','pa','pj','pf','pd'],cases:['Nom','Akk','Dat','Gen'],lv:[]},dnl:{n:4,r:200,modes:['art','dem','adj','pla','pld','plf'],lv:[]},phv:{n:6,r:200,modes:['pt','ar']},dtv:{n:6,r:200,modes:['pf','pe','zu','tu']}};
 if(!o.gx[g])o.gx[g]=JSON.parse(JSON.stringify(d[g]||{}));const x=o.gx[g];for(const k in d[g]||{})if(x[k]==null)x[k]=JSON.parse(JSON.stringify(d[g][k]));return x};
let gxCur=null,gxQ=null,gxRes=null,gxFree=0,gxSes={n:0,ok:0,st:0,best:0};
const gxDay=()=>fcDay(Date.now());
function gxStat(g){const d=gxDay();if(!S.gxd||S.gxd.d!==d)S.gxd={d,g:{}};if(!S.gxd.g[g])S.gxd.g[g]={n:0,r:0,x:0,a:0,ok:0};return S.gxd.g[g]}
const gxShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const gxRnd=a=>a[Math.random()*a.length|0];
const GXLW={A1:6,A2:5,B1:3,B2:1.5,C1:1,C2:.7,'HSK 1':6};
const gxWt=a=>{let t=0;const w=a.map(x=>{const v=GXLW[x.lv]||1;t+=v;return v});let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]};
const gxEq=(a,b)=>a.size==b.size&&[...a].every(x=>b.has(x));
/* ---- antrean SRS umum (item = {k}) ---- */
function gxQueue(g,items){const st=gxStat(g),o=GXO(g),now=Date.now(),td=gxDay(),L=[],R=[],N=[],ah=[];
 for(const x of items){const c=S.gg[x.k];if(!c||!c.t){N.push(x);continue}if(c.t==2){if(c.d<=td)R.push(x)}else if(c.d<=now)L.push(x);else if(c.d<=now+12e5)ah.push(x)}
 return{L,R,N,ah,nL:Math.max(0,o.n+(st.x|0)-st.n),rL:Math.max(0,o.r-st.r)}}
function gxPickQ(q,all){if(q.L.length)return ggMin(q.L);const nn=Math.min(q.N.length,q.nL),rr=Math.min(q.R.length,q.rL);
 const pn=()=>gxRnd(q.N),pr=()=>gxRnd(q.R);
 if(nn&&rr)return Math.random()<nn/(nn+rr)?pn():pr();if(rr)return pr();if(nn)return pn();if(q.ah.length)return ggMin(q.ah);gxFree=1;return all.length?gxRnd(all):null}
/* ============ ZCL: penggolong Mandarin ============ */
const ZCCAT={p:'Orang',a:'Hewan',o:'Benda',f:'Makanan',d:'Minuman',l:'Tempat',e:'Hal & kejadian',w:'Cuaca'};
let zcA=null;
function zcAll(){if(zcA)return zcA;zcA=[];ZCN.forEach(s=>{const a=s.split('|');zcA.push({k:'zc|'+a[0],t:'n',zh:a[0],py:a[1],id:a[2],cl:a[3].split('/'),cat:a[4],note:a[5]||''})});ZCV.forEach((v,i)=>zcA.push({k:'zv|'+i,t:'v',v}));return zcA}
function zcPool(){const o=GXO('zcl');return zcAll().filter(x=>x.t=='v'?o.verb:(!o.cats.length||o.cats.includes(x.cat)))}
const ZCG=[['张','条','根','支','枝','把'],['杯','瓶','碗','盘','壶'],['只','头','匹','条','口'],['件','套','双','副','顶'],['座','幢','间','所','家','扇'],['本','封','篇','首','句','幅'],['辆','架','台','部','艘','列'],['场','次','遍','趟','顿','下'],['个','位','名','口'],['块','片','颗','粒','枚','滴'],['朵','棵','束','面','盏','份']];
const ZCC=['个','本','张','条','只','杯','件','位','把','双','瓶','碗','辆','家','间','块','支','封','台','部','首','棵','朵','头','匹','份','片','颗','座','幅','篇','场','次','口','名'];
const zcTone=p=>{const m=String(p).match(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/);if(!m)return 0;return 'āēīōūǖ'.includes(m[0])?1:'áéíóúǘ'.includes(m[0])?2:'ǎěǐǒǔǚ'.includes(m[0])?3:4};
const zcYi=(pre,cl)=>{const t=zcTone((ZCL[cl]||[''])[0]);return pre.replace(/y[īíì]$/,t==4||t==0?'yí':'yì')};
function zcOpts(ok,n){const g=new Set(ok);let pool=[];ZCG.forEach(gr=>{if(ok.some(c=>gr.includes(c)))gr.forEach(c=>{if(!g.has(c)&&!pool.includes(c))pool.push(c)})});pool=gxShuf(pool).slice(0,3);
 if(!g.has('个')&&!pool.includes('个')&&Math.random()<.7)pool.push('个');
 for(const c of gxShuf(ZCC)){if(pool.length>=n-ok.length)break;if(!g.has(c)&&!pool.includes(c))pool.push(c)}
 return gxShuf(ok.concat(pool.slice(0,n-ok.length)))}
const ZCTR={b:0,u:0,l:1,d:2},ZCTN={b:'baku',u:'tambahan pribadi',l:'lisan lazim',d:'diperdebatkan'};
/* Daftar jawaban satu soal: all=[{c,t}], ok=wajib, soft=diterima tapi tidak dihitung salah (diberi label). Penolakan/tambahan pribadi dari S.o.gx.zcl.ov */
function zcAns(x){const o=GXO('zcl'),ov=(o.ov&&o.ov[x.k])||{},rej=ov.rej||[],add=ov.add||[],lim={b:0,l:1,a:2}[o.acc]!=null?{b:0,l:1,a:2}[o.acc]:1;
 const base=x.t=='v'?x.v[3].map(c=>({c,t:ZCT['#'+x.k.slice(3)+':'+c]||'b'})):x.cl.map(c=>({c,t:ZCT[x.zh+':'+c]||'b'}));
 let all=base.filter(a=>!rej.includes(a.c));if(!all.length)all=base;
 add.forEach(c=>{if(!all.some(a=>a.c==c))all.push({c,t:'u'})});
 let ok=all.filter(a=>ZCTR[a.t]<=lim);if(!ok.length)ok=all;
 return{all,ok:ok.map(a=>a.c),soft:all.filter(a=>!ok.includes(a)).map(a=>a.c),tier:Object.fromEntries(all.map(a=>[a.c,a.t]))}}
function zcMake(x){const A=zcAns(x),allc=A.all.map(a=>a.c),bl=()=>({lab:'Pilih semua yang benar',opts:zcOpts(allc,8),ok:A.ok,soft:A.soft,multi:1,l:'zh'});
 if(x.t=='v'){const v=x.v;return{g:'zcl',k:x.k,x,A,cell:'Penggolong verbal',blanks:[bl()],
  parts:v[0].split('___').flatMap((s,i,a)=>i<a.length-1?[s,0]:[s]),tr:v[2],py:v[1],note:v[4],full:c=>[v[0].replace('___',c),v[1].replace('___',(ZCL[c]||[c])[0]||c)],say:c=>v[0].replace('___',c)}}
 const fr=ZCF.filter(f=>f[5]=='*'||f[5].includes(x.cat)),simple=fr.filter(f=>f[5]=='*'),f=Math.random()<.45?gxRnd(simple):gxRnd(fr);
 return{g:'zcl',k:x.k,x,A,cell:'Penggolong · '+(ZCCAT[x.cat]||''),blanks:[bl()],
  parts:[f[0],0,x.zh+f[2]],tr:f[4].replace('{n}',x.id),py:f[1]+' ___ '+x.py+f[3],note:x.note,
  full:c=>[f[0]+c+x.zh+f[2],zcYi(f[1],c)+' '+((ZCL[c]||[''])[0])+' '+x.py+f[3]],say:c=>f[0]+c+x.zh+f[2]}}
/* ============ DE: artikel & akhiran ============ */
const DEC=['Nom','Akk','Dat','Gen'],DEN={Nom:'Nominativ · subjek',Akk:'Akkusativ · objek langsung',Dat:'Dativ · objek tak langsung',Gen:'Genitiv · kepemilikan'},DGN={m:'maskulin',f:'feminin',n:'netral'};
const DEF={Nom:{m:'der',f:'die',n:'das'},Akk:{m:'den',f:'die',n:'das'},Dat:{m:'dem',f:'der',n:'dem'},Gen:{m:'des',f:'der',n:'des'}};
const DIN={Nom:{m:'ein',f:'eine',n:'ein'},Akk:{m:'einen',f:'eine',n:'ein'},Dat:{m:'einem',f:'einer',n:'einem'},Gen:{m:'eines',f:'einer',n:'eines'}};
const DAD={Nom:{m:'e',f:'e',n:'e'},Akk:{m:'en',f:'e',n:'e'},Dat:{m:'en',f:'en',n:'en'},Gen:{m:'en',f:'en',n:'en'}};
const DAI={Nom:{m:'er',f:'e',n:'es'},Akk:{m:'en',f:'e',n:'es'},Dat:{m:'en',f:'en',n:'en'},Gen:{m:'en',f:'en',n:'en'}};
const DEFA=['der','die','das','den','dem','des'],INDA=['ein','eine','einen','einem','einer','eines'],ENDS=['e','en','er','es','em'];
/* Bingkai kalimat (v7.24): 'teks|tag' -> {t,g}. frPick: acak tanpa ulang sampai semua bingkai terpakai, tidak pernah sama dua kali berturut-turut. */
const frParse=a=>a.map(s=>{const i=s.indexOf('|');return i<0?{t:s,g:''}:{t:s.slice(0,i),g:s.slice(i+1)}});
const FRB={};
function frPick(key,list){let b=FRB[key];if(!b)b=FRB[key]={bag:[],last:null};
 if(!b.bag.length){b.bag=gxShuf(list.slice());if(list.length>1&&b.bag[b.bag.length-1]===b.last){const j=Math.random()*(b.bag.length-1)|0,t=b.bag[j];b.bag[j]=b.bag[b.bag.length-1];b.bag[b.bag.length-1]=t}}
 const f=b.bag.pop();b.last=f;return f}
const frWhy=(cs,f)=>!f||!f.g?'':cs=='Nom'?` · Subjek (kata kerja <b>${esc(f.g)}</b>)`:` · Kasus karena: <b>${esc(f.g)}</b>${/Genitiv$/.test(f.g)?'':' + '+({Akk:'Akkusativ',Dat:'Dativ',Gen:'Genitiv'}[cs])}`;
const DEFR={Nom:frParse(FR_DE.Nom),Akk:frParse(FR_DE.Akk),Dat:frParse(FR_DE.Dat),Gen:frParse(FR_DE.Gen)};
const DADJ=['alt','neu','klein','groß','gut','schön','jung','lang','kurz','kalt','warm','billig','schnell','langsam','interessant','wichtig','freundlich','ruhig','stark','schwer','leicht','hell','bekannt','praktisch','modern'];
const DEM={ad:'Artikel tentu',ai:'Artikel tak tentu',jd:'Akhiran setelah artikel tentu',ji:'Akhiran setelah artikel tak tentu',mx:'Artikel + akhiran sekaligus',an:'Semua artikel yang cocok',pa:'Jamak: artikel (die/die/den/der)',pj:'Jamak: akhiran adjektiva',pf:'Jamak: bentuk kata benda',pd:'Jamak: Dativ +n'};
const deGenOf=a=>({der:'m',die:'f',das:'n'}[a]);
let deP={};
function dePool(){const o=GXO('dad'),k=o.lv.join();if(deP.k==k)return deP.v;const v={m:[],f:[],n:[]};
 for(const x of ggAll('de')){if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[A-Za-zÄÖÜäöüß]{2,18}$/.test(x.w))continue;const g=deGenOf(x.art);if(g)v[g].push(x)}deP={k,v};return v}
let deGM=null;
function deGenMaps(){if(deGM)return deGM;const L=k=>new Set(DEGSRC[k].split(/\s+/).filter(Boolean)),n={};
 for(const p of DEGSRC.n.split(/\s+/)){const q=p.split('=');if(q[1])n[q[0]]=q[1]}deGM={n,es:L('es'),s:L('s'),inv:L('inv')};return deGM}
/* Genitiv tunggal untuk m/n. Mengembalikan null bila bentuknya tak pasti (kata dilewati, tidak ditebak). */
function deGen(w,g){if(g=='f')return w;if(g!='m'&&g!='n')return null;const M=deGenMaps();
 if(M.n[w])return M.n[w];
 if(M.inv.has(w)||/mus$/.test(w))return w;
 const nis=/nis$/.test(w);
 if(M.es.has(w)){if(/e$/.test(w))return w+'s';return nis?w+'ses':w+'es'}
 if(M.s.has(w))return w+'s';
 if(/(chen|lein|ling)$/.test(w)||(/(er|el|en)$/.test(w)&&w.length>=5))return w+'s';
 if(/(haus|raum|platz)$/.test(w))return w+'es';
 if(/(nis)$/.test(w))return w+'ses';
 if(w.length>=4&&/(sch|z|ß|ss|eis|ais)$/.test(w))return w+'es';
 return null}
function deCells(){const o=GXO('dad'),c=[];for(const m of o.modes){if(DEPLM[m]){c.push(...dePlCells(m));continue}for(const cs of o.cases)for(const g of ['m','f','n'])c.push({k:`dr|de|${m}|${cs}|${g}`,m,cs,g})}return c}
function deMake(cell){if(DEPLM[cell.m])return dePlMake(cell);const {m,cs,g}=cell,P=dePool()[g];let x=null,form=null;
 for(let i=0;i<40&&!x;i++){const y=P.length?gxWt(P):null;if(!y)break;const f=cs=='Gen'?deGen(y.w,g):y.w;if(f){x=y;form=f}}
 if(!x)return null;const adj=gxRnd(DADJ),fo=frPick('de|'+cs+'|s',DEFR[cs]),fr=fo.t,def=DEF[cs][g],ind=DIN[cs][g];
 const so=(arr,ok)=>({opts:arr,ok:[ok],multi:0});let blanks=[],np=[];
 const lab=(t)=>t;
 if(m=='ad'){blanks=[{...so(DEFA,def),lab:'Artikel tentu',l:'de'}];np=[0,' '+form]}
 else if(m=='ai'){blanks=[{...so(INDA,ind),lab:'Artikel tak tentu',l:'de'}];np=[0,' '+form]}
 else if(m=='jd'){blanks=[{...so(ENDS,DAD[cs][g]),lab:'Akhiran adjektiva',l:'',suf:1}];np=[def+' '+adj,0,' '+form]}
 else if(m=='ji'){blanks=[{...so(ENDS,DAI[cs][g]),lab:'Akhiran adjektiva',l:'',suf:1}];np=[ind+' '+adj,0,' '+form]}
 else if(m=='mx'){const d=Math.random()<.5;blanks=[{...so(d?DEFA:INDA,d?def:ind),lab:d?'Artikel tentu':'Artikel tak tentu',l:'de'},{...so(ENDS,(d?DAD:DAI)[cs][g]),lab:'Akhiran adjektiva',l:'',suf:1}];np=[0,' '+adj,1,' '+form]}
 else{const stems=['','e','','en','em','er','es'],pick=(s)=>DIN[cs][g].replace(/^ein/,s);const okA=[def,ind,pick('kein'),pick('mein'),pick('dein')];
  const all=[...new Set([...DEFA,...INDA,'keinen','keinem','keiner','keine','mein','meine','meinen','meinem','meiner'])].filter(a=>!okA.includes(a));
  blanks=[{opts:gxShuf(okA.concat(gxShuf(all).slice(0,5))),ok:okA,multi:1,lab:'Pilih semua artikel/penentu yang cocok',l:'de'}];np=[0,' '+form]}
 const parts=[];fr.split('{P}').forEach((s,i,a)=>{parts.push(s);if(i<a.length-1)np.forEach(p=>parts.push(typeof p=='number'?p:p))});
 const expl=`${DEN[cs]} · ${DGN[g]}: <b>${def} ${form}</b> · <b>${ind} ${form}</b> · adjektiva: <b>${def} alt${DAD[cs][g]} ${form}</b> / <b>${ind} alt${DAI[cs][g]} ${form}</b>`+frWhy(cs,fo);
 const full=()=>{const ar=blanks[0].ok[0];return m=='ad'||m=='ai'||m=='an'?fr.replace('{P}',ar+' '+form):m=='jd'?fr.replace('{P}',def+' '+adj+DAD[cs][g]+' '+form):m=='ji'?fr.replace('{P}',ind+' '+adj+DAI[cs][g]+' '+form):fr.replace('{P}',blanks[0].ok[0]+' '+adj+blanks[1].ok[0]+' '+form)};
 return{g:'dad',k:cell.k,fr:fr,cell:`${DEM[m]} · ${DEN[cs].split(' · ')[0]} · ${DGN[g]}`,blanks,parts,adj:m=='jd'||m=='ji'||m=='mx'?adj:'',x,tr:`${form} = ${x.c[2]}`,expl,fullTxt:full(),say:()=>full(),L:'de',hint:m=='an'?'':''}}
/* ============ NL ============ */
const NLM={art:'Artikel & penentu yang cocok',dem:'Dit / dat / deze / die',adj:'Akhiran adjektiva (-e atau tanpa -e)',pla:'Jamak: artikel & penentu',pld:'Jamak: adjektiva +e',plf:'Jamak: bentuk kata benda'};
const NLADJ=['oud','nieuw','klein','goed','lang','kort','jong','koud','warm','mooi','leuk','sterk','lelijk','belangrijk','vriendelijk','rustig','interessant','moeilijk','makkelijk','bekend'];
const NLFRO=frParse(FR_NL.o),NLFRP=frParse(FR_NL.p),NLFRS=frParse(FR_NL.s),NLFRZ=frParse(FR_NL.z),NLFR=[...NLFRO,...NLFRP];
const nlFrPick=(pl,geen)=>frPick('nl|'+(pl?'z':'s')+'|'+(geen?'g':'n'),geen?[...NLFRO,...(pl?NLFRZ:NLFRS)]:[...NLFR,...(pl?NLFRZ:NLFRS)]);
const NLDET={def:'bentuk tentu (de/het)',een:'een',geen:'geen',dem:'dit/dat/deze/die',pos:'mijn/jouw/zijn'};
let nlP={};
function nlPool(){const o=GXO('dnl'),k=o.lv.join();if(nlP.k==k)return nlP.v;const v={de:[],het:[]};
 for(const x of ggAll('nl')){if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[a-zëïéèäöüA-Z]{2,20}$/.test(x.w))continue;if(v[x.art])v[x.art].push(x)}nlP={k,v};return v}
function nlCells(){const o=GXO('dnl'),c=[];for(const m of o.modes){if(NLPLM[m]){c.push(...nlPlCells(m));continue}if(m=='adj')for(const d of Object.keys(NLDET))for(const t of['de','het'])c.push({k:`dr|nl|adj|${d}|${t}`,m,d,t});
 else if(m=='dem')for(const p of['near','far'])for(const t of['de','het'])c.push({k:`dr|nl|dem|${p}|${t}`,m,d:p,t});else for(const t of['de','het'])c.push({k:`dr|nl|art||${t}`,m,d:'',t})}return c}
function nlMake(cell){if(NLPLM[cell.m])return nlPlMake(cell);const {m,d,t}=cell,NP=nlPool()[t],x=NP.length?gxWt(NP):null;if(!x)return null;const fo=nlFrPick(false,m=='art'||d=='geen'),fr=fo.t,n=x.w,adj=gxRnd(NLADJ);let blanks,np,expl,full;
 const defA=t,rl=`${t}-woord`;
 if(m=='art'){const n1=t=='het'?'dit':'deze',n2=t=='het'?'dat':'die',o1=t=='het'?'de':'het',ok=[t,'een','geen',n1,n2,'mijn'],bad=[o1,t=='het'?'deze':'dit',t=='het'?'die':'dat'];
  blanks=[{opts:gxShuf(ok.concat(bad)),ok,multi:1,lab:'Pilih semua yang cocok',l:'nl'}];np=[0,' '+n];expl=`<b>${t} ${n}</b> → ${rl}. Yang cocok: ${t} / een / geen / ${n1}, ${n2} / mijn (jouw, zijn, haar…) ${n}.`;full=fr.replace('{P}',t+' '+n)}
 else if(m=='dem'){const near=d=='near',ok=t=='het'?(near?'dit':'dat'):(near?'deze':'die');blanks=[{opts:['dit','dat','deze','die'],ok:[ok],multi:0,lab:near?'Penunjuk dekat (ini)':'Penunjuk jauh (itu)',l:'nl'}];np=[0,' '+n];expl=`${rl}: ${t=='het'?'dit (ini) / dat (itu)':'deze (ini) / die (itu)'} ${n}.`;full=fr.replace('{P}',ok+' '+n)}
 else{const dets={def:t,een:'een',geen:'geen',dem:t=='het'?gxRnd(['dit','dat']):gxRnd(['deze','die']),pos:gxRnd(['mijn','jouw','zijn','haar'])},dt=dets[d],bare=(d=='een'||d=='geen')&&t=='het',ok=bare?'ø':'e';
  blanks=[{opts:['e','ø'],ok:[ok],multi:0,lab:'Akhiran adjektiva',l:'',suf:1,nl:1}];np=[dt+' '+adj,0,' '+n];
  expl=bare?`<b>${dt}</b> + <b>het</b>-woord (tunggal, tak tentu) → adjektiva <b>tanpa -e</b>: ${dt} ${adj} ${n}.`:`${d=='een'||d=='geen'?`<b>${dt}</b> + <b>de</b>-woord`:`kata penentu tentu (${dt})`} → adjektiva <b>+e</b>: ${dt} ${adj}e ${n}.`;full=fr.replace('{P}',dt+' '+adj+(bare?'':'e')+' '+n)}
 const parts=[];fr.split('{P}').forEach((s,i,a)=>{parts.push(s);if(i<a.length-1)np.forEach(p=>parts.push(p))});
 const cl=m=='adj'?`${NLM.adj} · ${NLDET[d]} · ${rl}`:m=='dem'?`Penunjuk · ${d=='near'?'dekat':'jauh'} · ${rl}`:`Penentu · ${rl}`;
 return{g:'dnl',k:cell.k,fr:fr,cell:cl,blanks,parts,adj:m=='adj'?adj:'',x,tr:`${n} = ${x.c[2]}`,expl,fullTxt:full,say:()=>full,L:'nl'}}
/* ============ Jamak DE & NL (v7.21): hanya kata di data terkurasi PLDE_SRC / PLNL_SRC ============ */
const DEPLM={pa:'Artikel jamak (die · die · den · der)',pj:'Akhiran adjektiva jamak',pf:'Bentuk jamak kata benda',pd:'Dativ jamak (+n)'};
const NLPLM={pla:'Jamak: artikel & penentu (selalu de)',pld:'Jamak: adjektiva (+e)',plf:'Jamak: bentuk kata benda (-en / -s)'};
const dePlUm=w=>{const m=[...w.matchAll(/au|Au|a|A|o|O|u|U/g)];if(!m.length)return w;const l=m[m.length-1],r={au:'äu',Au:'Äu',a:'ä',A:'Ä',o:'ö',O:'Ö',u:'ü',U:'Ü'}[l[0]];return w.slice(0,l.index)+r+w.slice(l.index+l[0].length)};
const dePlDer=(p,w)=>({n:w+'n',en:w+'en',e:w+'e',ue:dePlUm(w)+'e',er:w+'er',uer:dePlUm(w)+'er',u0:dePlUm(w),'0':w,s:w+'s',se:w+'se'})[p];
const DEPLP={n:'+ -n',en:'+ -en',e:'+ -e',ue:'umlaut + -e',er:'+ -er',uer:'umlaut + -er',u0:'umlaut saja',0:'tetap sama',s:'+ -s',se:'+ -se (ss)',x:'bentuk khusus — hafalkan'};
const dePlDat=pl=>/[ns]$/.test(pl)?pl:pl+'n';
let plDE=null;
function plDeAll(){if(plDE)return plDE;plDE={};for(const p in PLDE_SRC)PLDE_SRC[p].split(/\s+/).filter(Boolean).forEach(t=>{let w,pl;if(p=='x'){[w,pl]=t.split('=')}else{w=t;pl=dePlDer(p,w)}if(!plDE[w])plDE[w]={pl,p}});return plDE}
const NLPLP={en:'tambah -en',sp:'tambah -en dengan perubahan ejaan (huis → huizen)',s:'tambah -s (umumnya akhiran -el, -er, -en, -je)',a:"tambah -'s (kata berakhir vokal)",x:'bentuk khusus — hafalkan'};
const nlPlDer=(p,w)=>({en:w+'en',s:w+'s',a:w+"'s"})[p];
let plNL=null;
function plNlAll(){if(plNL)return plNL;plNL={};for(const p in PLNL_SRC)PLNL_SRC[p].split(/\s+/).filter(Boolean).forEach(t=>{let w,pl;if(p=='sp'||p=='x'){[w,pl]=t.split('=')}else{w=t;pl=nlPlDer(p,w)}if(!plNL[w])plNL[w]={pl,p}});return plNL}
/* kata ambigu (dua gender berbeda pada data) tidak dipakai di soal jamak */
function plAmb(L){const m={};for(const x of ggAll(L)){(m[x.w]=m[x.w]||new Set()).add(x.art)}const o={};for(const w in m)if(m[w].size>1)o[w]=1;return o}
let plDP={},plNP={};
function dePlPool(){const o=GXO('dad'),k=o.lv.join();if(plDP.k==k)return plDP.v;const A=plDeAll(),amb=plAmb('de'),seen={},v=[];
 for(const x of ggAll('de')){const e=A[x.w];if(!e||amb[x.w]||seen[x.w])continue;if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[A-Za-zÄÖÜäöüß]{2,22}$/.test(x.w))continue;seen[x.w]=1;v.push({x,w:x.w,art:x.art,lv:x.lv,pl:e.pl,p:e.p})}
 plDP={k,v};return v}
function nlPlPool(){const o=GXO('dnl'),k=o.lv.join();if(plNP.k==k)return plNP.v;const A=plNlAll(),amb=plAmb('nl'),seen={},v=[];
 for(const x of ggAll('nl')){const e=A[x.w];if(!e||amb[x.w]||seen[x.w])continue;if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[a-zëïéèäöüA-Z]{2,24}$/.test(x.w))continue;seen[x.w]=1;v.push({x,w:x.w,art:x.art,lv:x.lv,pl:e.pl,p:e.p})}
 plNP={k,v};return v}
const DEPLF={Nom:frParse(FR_DE.NomP),Akk:DEFR.Akk,Dat:DEFR.Dat,Gen:DEFR.Gen};
const DEPLD={Nom:'die',Akk:'die',Dat:'den',Gen:'der'},DEPLO={Nom:'e',Akk:'e',Dat:'en',Gen:'er'},DEPLK={Nom:'e',Akk:'e',Dat:'en',Gen:'er'};
const dePlCS={Nom:'Nominativ',Akk:'Akkusativ',Dat:'Dativ',Gen:'Genitiv'};
const dePlFill=(parts,bl)=>parts.map(p=>typeof p=='number'?bl[p].ok[0]:p).join('');
function dePlCells(m){const o=GXO('dad'),c=[];
 if(m=='pa')for(const cs of o.cases)c.push({k:`dr|de|pa|${cs}|p`,m,cs});
 else if(m=='pj')for(const cs of o.cases)for(const v of['d','o','k'])c.push({k:`dr|de|pj|${cs}|${v}`,m,cs,v});
 else if(m=='pf')for(const p of Object.keys(DEPLP))c.push({k:`dr|de|pf||${p}`,m,p});
 else for(const t of['add','n','s'])c.push({k:`dr|de|pd||${t}`,m,t});return c}
function dePlMake(cell){const {m}=cell;let P=dePlPool();if(!P.length)return null;
 if(m=='pf')P=P.filter(z=>z.p==cell.p);else if(m=='pd')P=P.filter(z=>(/n$/.test(z.pl)?'n':/s$/.test(z.pl)?'s':'add')==cell.t);
 if(!P.length)return null;const it=gxWt(P),pl=it.pl,sg=it.w,art=it.art,x=it.x,adj=gxRnd(DADJ),tr=`${sg} (jamak: ${pl}) = ${x.c[2]}`;
 const so=(arr,ok,lab,extra)=>({opts:arr,ok:[ok],multi:0,lab,...extra});let blanks,np,expl,fr=null,cs=cell.cs;
 let fo=null;const build=(frames,npp)=>{fo=frPick('de|'+(frames===DEPLF.Nom?'Nom':frames===DEPLF.Akk?'Akk':frames===DEPLF.Dat?'Dat':'Gen')+'|p',frames);const f=fo.t,parts=[];f.split('{P}').forEach((s,i,a)=>{parts.push(s);if(i<a.length-1)npp.forEach(p=>parts.push(p))});return parts};
 let parts;
 if(m=='pf'){const alts=gxShuf(['n','en','e','ue','er','uer','u0','s','se','0'].map(p=>dePlDer(p,sg))).filter(z=>z!=pl&&z!=sg);const opts=gxShuf([pl,...[...new Set(alts)].slice(0,3)]);
  blanks=[so(opts,pl,'Bentuk jamak',{l:'de'})];parts=[`Singular: ${art} ${sg}  →  Plural: die `,0];
  expl=`<b>die ${esc(pl)}</b> — pola: ${DEPLP[it.p]}. Dativ jamak: <b>den ${esc(dePlDat(pl))}</b>`}
 else if(m=='pd'){const dt=dePlDat(pl),opts=[...new Set([pl,pl+'n',pl+'en',sg])].filter(z=>z==dt||z!=dt);
  blanks=[so(gxShuf(opts),dt,'Bentuk kata benda (Dativ jamak)',{l:'de'})];parts=build(DEPLF.Dat,['den ',0]);
  expl=`Dativ jamak: <b>den ${esc(dt)}</b> — tambah <b>-n</b> pada jamak, kecuali jamak sudah berakhiran -n atau -s (jamak: ${esc(pl)}).`;cs='Dat'}
 else if(m=='pa'){const form=cs=='Dat'?dePlDat(pl):pl;blanks=[so(DEFA,DEPLD[cs],'Artikel tentu jamak',{l:'de'})];parts=build(DEPLF[cs],[0,' '+form]);
  expl=`${dePlCS[cs]} jamak: <b>${DEPLD[cs]} ${esc(form)}</b> (semua gender sama: die / die / den / der)${cs=='Dat'?' · Dativ jamak +n':''}`}
 else{const v=cell.v,form=cs=='Dat'?dePlDat(pl):pl,stem=gxRnd(['kein','mein','dein']);
  if(v=='d'){blanks=[so(ENDS,'en','Akhiran adjektiva',{l:'',suf:1})];np=[DEPLD[cs]+' '+adj,0,' '+form];expl=`Setelah artikel tentu (<b>${DEPLD[cs]}</b>) adjektiva jamak selalu <b>-en</b>: ${DEPLD[cs]} ${adj}en ${esc(form)}`}
  else if(v=='k'){const e=DEPLK[cs];blanks=[so(ENDS,'en','Akhiran adjektiva',{l:'',suf:1})];np=[stem+e+' '+adj,0,' '+form];expl=`Setelah kein-/mein-/dein- jamak (<b>${stem+e}</b>) adjektiva jamak selalu <b>-en</b>: ${stem+e} ${adj}en ${esc(form)}`}
  else{blanks=[so(ENDS,DEPLO[cs],'Akhiran adjektiva',{l:'',suf:1})];np=[adj,0,' '+form];expl=`Tanpa artikel, jamak ${dePlCS[cs]}: <b>-${DEPLO[cs]}</b> (Nom -e · Akk -e · Dat -en · Gen -er): ${adj}${DEPLO[cs]} ${esc(form)}`}
  parts=build(DEPLF[cs],np)}
 if(m!='pf')expl+=frWhy(cs,fo);const full=dePlFill(parts,blanks),L='de',dm=DEPLM[m];
 const lab=m=='pf'?dm:m=='pd'?`${dm} · ${esc(art)}-woord`:`${dm} · ${dePlCS[cs]}${m=='pj'?(cell.v=='d'?' · artikel tentu':cell.v=='k'?' · kein/mein':' · tanpa artikel'):''}`;
 return{g:'dad',k:cell.k,fr:fo?fo.t:'',cell:lab.replace(/&[a-z]+;/g,''),blanks,parts,adj:'',x,tr,expl,fullTxt:full,say:()=>full,L}}
const NLPLD={def:'de',dem:'deze/die',geen:'geen',pos:'mijn',zero:'tanpa penentu'};
function nlPlCells(m){const c=[];if(m=='pla')for(const t of['de','het'])c.push({k:`dr|nl|pla||${t}`,m,t});
 else if(m=='pld')for(const d of Object.keys(NLPLD))for(const t of['de','het'])c.push({k:`dr|nl|pld|${d}|${t}`,m,d,t});
 else for(const p of Object.keys(NLPLP))c.push({k:`dr|nl|plf||${p}`,m,p});return c}
function nlPlMake(cell){const {m}=cell;let P=nlPlPool();if(m=='plf')P=P.filter(z=>z.p==cell.p);else P=P.filter(z=>z.art==cell.t);if(!P.length)return null;
 const it=gxWt(P),pl=it.pl,sg=it.w,art=it.art,x=it.x,tr=`${sg} (meervoud: ${pl}) = ${x.c[2]}`,adj=gxRnd(NLADJ);let blanks,parts,expl;
 let fo=null;const build=(np)=>{fo=nlFrPick(true,m=='pla'||cell.d=='geen');const f=fo.t,ps=[];f.split('{P}').forEach((s,i,a)=>{ps.push(s);if(i<a.length-1)np.forEach(p=>ps.push(p))});return ps};
 if(m=='plf'){const alts=gxShuf([...new Set([sg+'en',sg+'s',sg+"'s",sg+'eren'])]).filter(z=>z!=pl);blanks=[{opts:gxShuf([pl,...alts.slice(0,3)]),ok:[pl],multi:0,lab:'Bentuk meervoud',l:'nl'}];
  parts=[`Enkelvoud: ${art} ${sg}  →  Meervoud: de `,0];expl=`<b>de ${esc(pl)}</b> — ${NLPLP[it.p]}. Meervoud selalu pakai <b>de</b>.`}
 else if(m=='pla'){const ok=['de','geen','deze','die','mijn'],bad=['het','een','dit','dat'];blanks=[{opts:gxShuf(ok.concat(bad)),ok,multi:1,lab:'Pilih semua yang cocok untuk meervoud',l:'nl'}];
  parts=build([0,' '+pl]);expl=`Meervoud selalu <b>de</b>, walau tunggalnya <b>${art}</b> (${art} ${sg} → de ${esc(pl)}). Cocok: de / geen / deze, die / mijn. Tidak cocok: het, een, dit, dat.`}
 else{const d=cell.d,det={def:'de',dem:gxRnd(['deze','die']),geen:'geen',pos:gxRnd(['mijn','jouw','zijn','haar']),zero:''}[d];
  blanks=[{opts:['e','ø'],ok:['e'],multi:0,lab:'Akhiran adjektiva',l:'',suf:1,nl:1}];parts=build([(det?det+' ':'')+adj,0,' '+pl]);
  expl=`Meervoud: adjektiva <b>selalu +e</b>, baik dengan penentu maupun tanpa: ${det?det+' ':''}${adj}e ${esc(pl)}. (Tanpa -e hanya untuk het-woord tunggal tak tentu.)`}
 const full=parts.map(p=>typeof p=='number'?blanks[p].ok[0]=='ø'?'':blanks[p].ok.length>1?blanks[p].ok[0]:blanks[p].ok[0]:p).join('');
 const cl=m=='plf'?`${NLPLM.plf} · ${NLPLP[cell.p].split(' (')[0]}`:m=='pla'?`${NLPLM.pla} · tunggal ${cell.t}-woord`:`${NLPLM.pld} · ${NLPLD[cell.d]}`;
 return{g:'dnl',k:cell.k,fr:fo?fo.t:'',cell:cl,blanks,parts,adj:'',x,tr,expl,fullTxt:full,say:()=>full,L:'nl'}}
/* ============ alur umum ============ */
function gxItems(g){return g=='zcl'?zcPool():g=='dad'?deCells():g=='phv'?phCells():g=='dtv'?dtCells():nlCells()}
function gxNext(g){const items=gxItems(g);gxFree=0;const q=gxQueue(g,items);let it=gxPickQ(q,items),tries=0,r=null;
 while(it&&!r&&tries++<6){r=g=='zcl'?zcMake(it):g=='dad'?deMake(it):g=='phv'?phMake(it):g=='dtv'?dtMake(it):nlMake(it);if(!r)it=gxRnd(items)}
 if(r){r.sel=r.blanks.map(()=>new Set());r.q={n:Math.min(q.N.length,q.nL),r:Math.min(q.R.length,q.rL),l:q.L.length}}
 return r}
function gxScore(q){let perfect=true,wrong=false;q.blanks.forEach((b,i)=>{const ok=new Set(b.ok),sf=new Set(b.soft||[]),s=q.sel[i],s2=new Set([...s].filter(v=>!sf.has(v)||ok.has(v)));if(!gxEq(ok,s2))perfect=false;if([...s].some(v=>!ok.has(v)&&!sf.has(v)))wrong=true});return perfect?3:wrong?1:2}
function gxFinish(){const q=gxQ,g=q.g,sc=gxScore(q),st=gxStat(g);
 const c=S.gg[q.k],had=c&&c.t;let nx='';
 if(!gxFree){const n=fcCalc(c,sc,Date.now(),true);n.gn=((c&&c.gn)|0)+1;n.go=((c&&c.go)|0)+(sc==3?1:0);S.gg[q.k]=n;if(!had)st.n++;else if(c.t==2)st.r++;nx=n.t==2?fcFmtD(n.i):fcFmt(n.d-Date.now())}
 st.a++;if(sc==3)st.ok++;gxSes.n++;if(sc==3){gxSes.ok++;gxSes.st++;gxSes.best=Math.max(gxSes.best,gxSes.st)}else gxSes.st=0;
 gxRes={sc,next:nx,free:gxFree};buzz(sc==3?10:[16,40,16])}
function gxAct(a,x,k){const g=gxCur,o=g&&!gxIsGen(g)&&GXO?GXO(g):null;
 if(a=='ggxopen'){gxCur=x;if(gxIsGen(x)){ggO().ggl=x=='gnl'?'nl':'de';ggCur=null;ggRes=null}gxQ=null;gxRes=null;gxSes={n:0,ok:0,st:0,best:0};scrollTo(0,0)}
 else if(a=='ggxedit'){gxEdit=gxEdit?0:1}
 else if(a=='ggxmv'){gxMove(x,k)}
 else if(a=='ggxord0'){delete S.o.gxOrd}
 else if(a=='ggxhome'){gxCur=null;gxQ=null;gxRes=null;ggCur=null;ggRes=null}
 else if(a=='ggxpick'&&gxQ&&!gxRes){const i=+x,b=gxQ.blanks[i],s=gxQ.sel[i];if(b.multi){s.has(k)?s.delete(k):s.add(k)}else{s.clear();s.add(k);if(gxQ.sel.every(z=>z.size)){gxFinish()}}}
 else if(a=='ggxchk'&&gxQ&&!gxRes&&gxQ.sel.every(z=>z.size))gxFinish();
 else if(a=='ggxnext'){gxQ=null;gxRes=null}
 else if(a=='ggxsay'&&gxQ)say(k||gxQ.say(x),gxQ.L||'zh');
 else if(a=='ggxmore'&&o){gxStat(g).x=(gxStat(g).x|0)+10;gxQ=null}
 else if(a=='ggxtg'&&o){const [f,v]=x.split(':'),arr=o[f],i=arr.indexOf(v);i<0?arr.push(v):arr.splice(i,1);if(f=='modes'&&!arr.length)arr.push(v);if(f=='cases'&&!arr.length)arr.push(v);gxQ=null;gxRes=null}
 else if(a=='ggxacc'&&o){o.acc=x;gxQ=null;gxRes=null}
 else if(a=='ggxov'&&o&&gxQ){const id=gxQ.k;if(!o.ov)o.ov={};const e=o.ov[id]||(o.ov[id]={rej:[],add:[]});e.rej=e.rej||[];e.add=e.add||[];const dl=(ar,c)=>{const i=ar.indexOf(c);if(i>=0)ar.splice(i,1)};
  if(x=='rej'){if(!e.rej.includes(k))e.rej.push(k);dl(e.add,k)}else if(x=='add'){if(!e.add.includes(k))e.add.push(k);dl(e.rej,k)}else{dl(e.rej,k);dl(e.add,k)}
  if(!e.rej.length&&!e.add.length)delete o.ov[id]}
 else if(a=='ggxov0'&&o){if(confirm('Hapus semua laporan/penolakan pribadi penggolong?'))o.ov={}}
 else if(a=='ggxflag'&&o){o[x]=o[x]?0:1;gxQ=null;gxRes=null}
 else if(a=='ggxrst'){if(confirm('Hapus semua jadwal game ini?')){const p={zcl:['zc|','zv|'],dad:['dr|de|'],dnl:['dr|nl|'],phv:['ph|'],dtv:['dv|']}[g]||[];for(const key of Object.keys(S.gg))if(p.some(z=>key.startsWith(z)))delete S.gg[key];gxQ=null;gxRes=null}}}
function ggAct(a,x,k){if(a.startsWith('ggx'))return gxAct(a,x,k);return ggGenAct(a,x,k)}
function ggSet(i,el){if(i.startsWith('gg_x:')){const [,g,f]=i.split(':'),o=GXO(g),v=parseInt(el.value);if(isFinite(v))o[f]=Math.max(0,Math.min(9999,v));gxQ=null;gxRes=null;return}return ggGenSet(i,el)}
/* ============ tampilan ============ */
const gxBlank=(q,i,res)=>{const b=q.blanks[i],s=q.sel[i];let t,cls='';
 if(res){t=b.ok.map(v=>v=='ø'?'∅':v).join(' / ');cls=gxEq(new Set(b.ok),s)?'ok':'bad'}else t=s.size?[...s].join(' / '):'';
 return `<span class="gxb${b.suf?' s':''}${t?' f':''} ${cls}">${t?esc(b.suf&&!res?t:t):'&nbsp;'}</span>`};
function gxSent(q,res){return q.parts.map(p=>typeof p=='number'?gxBlank(q,p,res):esc(p)).join('')}
function gxOptBtn(q,i,v,res){const b=q.blanks[i],on=q.sel[i].has(v),ok=b.ok.includes(v);let c='gxo'+(on?' on':'');
 if(res)c+=ok?(on?' ok':' miss'):on?' bad':'';
 const lbl=b.suf?(v=='ø'?'∅ (tanpa -e)':'-'+v):v;
 return `<button class="${c}" data-a=ggxpick data-v=${i} data-k="${esc(v)}"${res?' disabled':''}>${esc(lbl)}${res&&ok&&!on?'<i>benar</i>':''}</button>`}
function gxHead(g,sub){const m=GXL.find(z=>z.id==g);return `<div class=gxbar><button class=gxback data-a=ggxhome aria-label="Kembali ke daftar game">‹ Games</button><b>${esc(m.t)}</b><span class=gxses title="Sesi ini">${gxSes.n?`${gxSes.ok}/${gxSes.n}`:''}${gxSes.st>=3?` 🔥${gxSes.st}`:''}</span></div>`}
function gxChips(label,list,cur,field,names){return `<small>${label}</small><div class=chips>${list.map(v=>`<button class="chip${cur.includes(v)?' on':''}" data-a=ggxtg data-v="${field}:${v}">${esc(names?names[v]||v:v)}</button>`).join('')}</div>`}
function gxSettings(g){const o=GXO(g);let h=`${dtag('gxs_'+g)}<summary><span>Pengaturan game</span></summary><div class=card>`;
 if(g=='zcl')h+=`<small>Kategori kata</small><div class=chips><button class="chip${o.cats.length?'':' on'}" data-a=ggxtg data-v="cats:*">Semua</button>${Object.keys(ZCCAT).map(c=>`<button class="chip${o.cats.includes(c)?' on':''}" data-a=ggxtg data-v="cats:${c}">${ZCCAT[c]}</button>`).join('')}</div><label class=fcl><span>Termasuk soal penggolong verbal (次, 遍, 场…)</span><input type=checkbox ${o.verb?'checked ':''}data-a=ggxflag data-v=verb></label><small>Penerimaan jawaban</small><div class=chips>${[['b','Baku saja'],['l','Baku + lisan lazim'],['a','Semua']].map(z=>`<button class="chip${o.acc==z[0]?' on':''}" data-a=ggxacc data-v=${z[0]}>${z[1]}</button>`).join('')}</div><small>Jawaban di luar tingkat yang dipilih tidak dihitung salah, hanya diberi label.${Object.keys(o.ov||{}).length?` Laporan pribadi: ${Object.keys(o.ov).length} kata. <button class=chip data-a=ggxov0>Hapus semua</button>`:''}</small><label class=fcl><span>Pinyin di soal</span><input type=checkbox ${o.py?'checked ':''}data-a=ggxflag data-v=py></label>`;
 else if(g=='dtv')h+=gxChips('Jenis soal',Object.keys(DTM),o.modes,'modes',DTM)+`<small>Semua jenis soal mencakup verba trennbar dan untrennbar. Pilih prefiks: trennbar → prefiks di akhir klausa; untrennbar → prefiks menempel pada verba. Minimal satu jenis soal aktif.</small>`;
 else if(g=='phv')h+=gxChips('Jenis soal',Object.keys(PHM),o.modes,'modes',PHM)+`<small>Kalimat contoh disertai terjemahan Indonesia; minimal satu jenis soal aktif.</small>`;
 else{const lv=ggLv(g=='dad'?'de':'nl');h+=gxChips('Jenis soal',g=='dad'?Object.keys(DEM):Object.keys(NLM),o.modes,'modes',g=='dad'?DEM:NLM);if(g=='dad')h+=gxChips('Kasus',DEC,o.cases,'cases',{Nom:'Nominativ',Akk:'Akkusativ',Dat:'Dativ',Gen:'Genitiv'});h+=gxChips('Level kata benda',lv,o.lv,'lv');h+=`<small>Level kosong = semua level.</small>`}
 h+=`<label class=fcl><span>Soal baru per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:n value="${o.n}" min=0 max=9999></label><label class=fcl><span>Maks. ulasan per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:r value="${o.r}" min=0 max=9999></label><div class=btns><button data-a=ggxrst>Reset jadwal game</button></div></div></details>`;return h}
function gxMeta(g,q){const st=gxStat(g);return `<div class=fcc><span class=k1><b>${q?q.q.n:0}</b><small>Baru</small></span><span class=k2><b>${q?q.q.l:0}</b><small>Belajar</small></span><span class=k3><b>${q?q.q.r:0}</b><small>Ulas</small></span></div>`}
function zcRes(q){const A=q.A,ov=(GXO('zcl').ov||{})[q.k]||{},rj=ov.rej||[],ad=ov.add||[],sel=[...q.sel[0]],okS=new Set(q.blanks[0].ok),sfS=new Set(q.blanks[0].soft||[]);
 const li=A.all.map(({c,t})=>{const f=q.full(c),ign=sfS.has(c);return `<li><span class=gxzh>${esc(f[0])}</span> ${spk(q.say(c),'zh')}<small>${esc(f[1])}</small><em>${esc(c)} ${esc((ZCL[c]||['',''])[0])} — ${esc((ZCL[c]||['',''])[1])} <span class="zct ${t}">${ZCTN[t]}${ign?' · tidak dihitung':''}</span></em>${ad.includes(c)||rj.includes(c)?`<button class=zcfl data-a=ggxov data-v=clr data-k="${esc(c)}">↺ Batalkan laporan ${esc(c)}</button>`:`<button class=zcfl data-a=ggxov data-v=rej data-k="${esc(c)}">🚩 Tolak ${esc(c)}</button>`}</li>`}).join('');
 const wrong=sel.filter(c=>!okS.has(c)&&!sfS.has(c)&&!A.all.some(a=>a.c==c)&&!ad.includes(c)),undo=rj.filter(c=>!A.all.some(a=>a.c==c)).map(c=>`<button class=zcfl data-a=ggxov data-v=clr data-k="${esc(c)}">↺ Batalkan penolakan ${esc(c)}</button>`).join('');
 const fb=wrong.map(c=>`<button class=zcfl data-a=ggxov data-v=add data-k="${esc(c)}">🚩 ${esc(c)} juga benar, terima</button>`).join('')+ad.filter(c=>!A.all.some(a=>a.c==c)).map(c=>`<button class=zcfl data-a=ggxov data-v=clr data-k="${esc(c)}">↺ Batalkan tambahan ${esc(c)}</button>`).join('')+undo;
 return `<ul class=gxex>${li}</ul>${q.note?`<div class=gxnote>💡 ${esc(q.note)}</div>`:''}${fb?`<div class=zcfb><small>Tidak setuju dengan kunci ini? Laporanmu disimpan di perangkat dan dipakai pada soal berikutnya.</small>${fb}</div>`:''}`}
function gxView(g){if(!gxQ){gxQ=gxNext(g);gxRes=null}const q=gxQ;let h=gxHead(g)+gxSettings(g);
 if(!q)return h+`<div class="card empty"><b>Tidak ada soal</b>Ubah filter pada pengaturan game.</div>`;
 h+=gxMeta(g,q);const r=gxRes,res=!!r,full=q.sel.every(z=>z.size);
 h+=`<div class="card gxc"><div class=hd><span>${esc(q.cell)}</span><span>${gxFree?'Latihan bebas':(S.gg[q.k]&&S.gg[q.k].t?esc(fcInfo0(S.gg[q.k])):'Baru')}</span></div>`;
 h+=`<div class="gxs${g=='zcl'?' zh':''}">${gxSent(q,res)}</div>`;
 if(g=='zcl'){h+=`<div class=gxtr>${esc(q.tr)}</div>${GXO('zcl').py||res?`<div class=gxpy>${esc(q.py.replace(/___/g,res?q.blanks[0].ok.map(c=>(ZCL[c]||[c])[0]).join('/'):'___'))}</div>`:''}`}
 else h+=`<div class=gxtr>${esc(q.tr)}</div>`;
 q.blanks.forEach((b,i)=>{h+=`<div class=gxl>${esc(b.lab||'')}${b.multi?' <em>(bisa lebih dari satu)</em>':''}</div><div class="gxg${b.opts.length>6?' w':''}${b.opts.some(v=>v.length>9)?' l':''}">${b.opts.map(v=>gxOptBtn(q,i,v,res)).join('')}</div>`});
 if(!res)h+=`<div class=dock>${q.blanks.some(b=>b.multi)||q.blanks.length>1?`<button class=pri data-a=ggxchk${full?'':' disabled'}>Periksa</button>`:''}</div>`;
 if(res){const sc=r.sc;let body='';
  if(g=='zcl'){body=zcRes(q)}
  else body=`<div class=gxex1>${spk(q.fullTxt,q.L)} <b>${esc(q.fullTxt)}</b></div><div class=gxnote>${q.expl}</div>`;
  h+=`<div class="ggr ${sc==3?'ok':sc==2?'part':'bad'}"><b>${sc==3?'✓ Benar':sc==2?'◐ Sebagian benar — masih ada jawaban lain':'✗ Belum tepat'}</b>${r.free?'<small>Latihan bebas (tidak mengubah jadwal)</small>':r.next?`<small>Muncul lagi: ${esc(r.next)}</small>`:''}${body}</div><div class=dock><button class=pri data-a=ggxnext>Lanjut</button></div>`}
 return h+`</div>`}
function gxHub(){const T=(m,ix,n)=>{let st='';
  if(gxIsGen(m.id)){const q=ggQ(m.lg);st=`${q.L.length+Math.min(q.R.length,q.rL)} ulas · ${Math.min(q.N.length,q.nL)} baru`}
  else{const it=gxItems(m.id),q=gxQueue(m.id,it);st=`${q.L.length+Math.min(q.R.length,q.rL)} ulas · ${Math.min(q.N.length,q.nL)} baru`}
  const s=gxIsGen(m.id)?{a:(()=>{const d=ggSd(m.lg);return d?(d.n|0)+(d.r|0):0})(),ok:null}:gxStat(m.id);
  const inf=`<span class=gxic>${esc(m.ic)}</span><span class=gxtx><b>${esc(m.t)}</b><small>${esc(m.d)}</small><em>${esc(st)}${s.a?` · hari ini ${s.ok!=null?s.ok+'/'+s.a:s.a}`:''}</em></span>`;
  if(gxEdit)return `<div class="gxcard gxed l-${m.lg}">${inf}<span class=gxmv><button data-a=ggxmv data-v=${m.id} data-k=up aria-label="Naikkan ${esc(m.t)}"${ix==0?' disabled':''}>▲</button><button data-a=ggxmv data-v=${m.id} data-k=down aria-label="Turunkan ${esc(m.t)}"${ix==n-1?' disabled':''}>▼</button></span></div>`;
  return `<button class="gxcard l-${m.lg}" data-a=ggxopen data-v=${m.id}>${inf}<span class=gxtagc>${m.tag}</span></button>`};
 const ord=gxOrdered(),custom=Array.isArray(S.o.gxOrd);let list='';
 if(custom||gxEdit)list=ord.map((m,i)=>T(m,i,ord.length)).join('');
 else list=GXLG.map(([lg,nm])=>{const ms=ord.filter(m=>m.lg==lg);return ms.length?`<div class=gxgrp>${nm}</div>`+ms.map(m=>T(m,0,0)).join(''):''}).join('');
 const tot=Object.values((S.gxd&&S.gxd.d==gxDay()?S.gxd.g:{})).reduce((a,x)=>({a:a.a+x.a,ok:a.ok+x.ok}),{a:0,ok:0});
 return `<div class=gxhero><b>${tot.a?`${tot.ok}/${tot.a} benar hari ini`:'Pilih game untuk mulai'}</b><small>Latihan singkat 2–5 menit. Jadwal ulasan terpisah dari kartu utama.</small></div><div class=gxtools><button class=chip data-a=ggxedit>${gxEdit?'✓ Selesai mengatur':'↕ Atur urutan'}</button>${gxEdit&&custom?'<button class=chip data-a=ggxord0>Kembalikan urutan per bahasa</button>':''}</div><div class=gxlist>${list}</div>`}
function ggView(){if(!gxCur)return gxHub();if(gxIsGen(gxCur)){ggO().ggl=gxCur=='gnl'?'nl':'de';return `<div class=gxbar><button class=gxback data-a=ggxhome aria-label="Kembali ke daftar game">‹ Games</button><b>${esc(GXL.find(z=>z.id==gxCur).t)}</b><span></span></div>`+ggGenView()}return gxView(gxCur)}
