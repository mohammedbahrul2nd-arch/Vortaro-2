/* ===== Games v7.20: hub + mesin soal bersama =====
   Gim: gen (Tebak gender, games.js) · zcl (Penggolong Mandarin) · dad (Artikel & akhiran adjektiva Jerman) · dnl (Belanda)
   SRS memakai S.gg (kunci berawalan: zc| zv| dr|) dan fcCalc. Statistik harian di S.gxd. Opsi di S.o.gx[gim]. */
const GMS=[
 {id:'gen',ic:'⚥',t:'Tebak Gender',d:'der / die / das dan de / het untuk kata benda Jerman & Belanda.',tag:'DE · NL'},
 {id:'zcl',ic:'个',t:'Penggolong Mandarin',d:'个 · 口 · 杯 · 本 … Pilih semua penggolong (量词) yang tepat.',tag:'ZH'},
 {id:'dad',ic:'der',t:'Artikel & Akhiran Jerman',d:'Tebak der/den/dem/des, ein/einen/einem/eines dan akhiran adjektiva menurut kasus.',tag:'DE'},
 {id:'dnl',ic:'de',t:'Artikel & Akhiran Belanda',d:'Tebak de/het/een, dit/dat/deze/die, dan adjektiva dengan atau tanpa -e.',tag:'NL'}];
const GXO=(g)=>{const o=ggO();if(!o.gx||typeof o.gx!='object')o.gx={};const d={zcl:{n:10,r:200,py:1,cats:[],verb:1},dad:{n:6,r:200,modes:['ad','ai','jd','ji','mx','an'],cases:['Nom','Akk','Dat','Gen'],lv:[]},dnl:{n:4,r:200,modes:['art','dem','adj'],lv:[]}};
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
function zcMake(x){
 if(x.t=='v'){const v=x.v,ok=v[3];return{g:'zcl',k:x.k,x,cell:'Penggolong verbal',blanks:[{lab:'Pilih semua yang benar',opts:zcOpts(ok,8),ok:ok,multi:1,l:'zh'}],
  parts:v[0].split('___').flatMap((s,i,a)=>i<a.length-1?[s,0]:[s]),tr:v[2],py:v[1],note:v[4],full:c=>[v[0].replace('___',c),v[1].replace('___',(ZCL[c]||[c])[0]||c)],say:c=>v[0].replace('___',c)}}
 const fr=ZCF.filter(f=>f[5]=='*'||f[5].includes(x.cat)),simple=fr.filter(f=>f[5]=='*'),f=Math.random()<.45?gxRnd(simple):gxRnd(fr);
 const ok=x.cl;return{g:'zcl',k:x.k,x,cell:'Penggolong · '+(ZCCAT[x.cat]||''),blanks:[{lab:'Pilih semua yang benar',opts:zcOpts(ok,8),ok:ok,multi:1,l:'zh'}],
  parts:[f[0],0,x.zh+f[2]],tr:f[4].replace('{n}',x.id),py:f[1]+' ___ '+x.py+f[3],note:x.note,
  full:c=>[f[0]+c+x.zh+f[2],zcYi(f[1],c)+' '+((ZCL[c]||[''])[0])+' '+x.py+f[3]],say:c=>f[0]+c+x.zh+f[2]}}
/* ============ DE: artikel & akhiran ============ */
const DEC=['Nom','Akk','Dat','Gen'],DEN={Nom:'Nominativ · subjek',Akk:'Akkusativ · objek langsung',Dat:'Dativ · objek tak langsung',Gen:'Genitiv · kepemilikan'},GN={m:'maskulin',f:'feminin',n:'netral'};
const DEF={Nom:{m:'der',f:'die',n:'das'},Akk:{m:'den',f:'die',n:'das'},Dat:{m:'dem',f:'der',n:'dem'},Gen:{m:'des',f:'der',n:'des'}};
const DIN={Nom:{m:'ein',f:'eine',n:'ein'},Akk:{m:'einen',f:'eine',n:'ein'},Dat:{m:'einem',f:'einer',n:'einem'},Gen:{m:'eines',f:'einer',n:'eines'}};
const DAD={Nom:{m:'e',f:'e',n:'e'},Akk:{m:'en',f:'e',n:'e'},Dat:{m:'en',f:'en',n:'en'},Gen:{m:'en',f:'en',n:'en'}};
const DAI={Nom:{m:'er',f:'e',n:'es'},Akk:{m:'en',f:'e',n:'es'},Dat:{m:'en',f:'en',n:'en'},Gen:{m:'en',f:'en',n:'en'}};
const DEFA=['der','die','das','den','dem','des'],INDA=['ein','eine','einen','einem','einer','eines'],ENDS=['e','en','er','es','em'];
const DEFR={Nom:['Hier ist {P}.','Dort steht {P}.','Das ist {P}.','Heute kommt {P}.'],Akk:['Ich sehe {P}.','Er braucht {P}.','Sie kauft {P}.','Wir suchen {P}.','Ich habe ein Geschenk für {P}.','Sie läuft um {P}.','Er geht ohne {P} nach Hause.'],
 Dat:['Ich spreche mit {P}.','Wir sprechen von {P}.','Er wohnt bei {P}.','Sie kommt aus {P}.','Das Buch liegt auf {P}.','Sie sitzt neben {P}.','Das gehört {P}.','Ich danke {P}.'],Gen:['Das ist das Haus {P}.','Wegen {P} bleiben wir hier.','Trotz {P} gehen wir spazieren.','Während {P} schlafe ich.','Das ist die Farbe {P}.']};
const DADJ=['alt','neu','klein','groß','gut','schön','jung','lang','kurz','kalt','warm','billig','schnell','langsam','interessant','wichtig','freundlich','ruhig','stark','schwer','leicht','hell','bekannt','praktisch','modern'];
const DEM={ad:'Artikel tentu',ai:'Artikel tak tentu',jd:'Akhiran setelah artikel tentu',ji:'Akhiran setelah artikel tak tentu',mx:'Artikel + akhiran sekaligus',an:'Semua artikel yang cocok'};
const deGenOf=a=>({der:'m',die:'f',das:'n'}[a]);
let deP={};
function dePool(){const o=GXO('dad'),k=o.lv.join();if(deP.k==k)return deP.v;const v={m:[],f:[],n:[]};
 for(const x of ggAll('de')){if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[A-Za-zÄÖÜäöüß]{2,18}$/.test(x.w))continue;const g=deGenOf(x.art);if(g)v[g].push(x)}deP={k,v};return v}
function deGen(w,g){if(g=='f')return w;if(g=='m'&&/(e|ent|ant|ist|oge|at|ge|ei|ie|ung)$/i.test(w))return null;if(g=='n'&&/e$/i.test(w))return null;
 if(/nis$/i.test(w))return w+'ses';const sy=(w.toLowerCase().match(/[aeiouäöüy]+/g)||[]).length;if(/(s|ß|x|z|sch|tsch)$/i.test(w))return w+'es';return sy<=1?w+'es':w+'s'}
function deCells(){const o=GXO('dad'),c=[];for(const m of o.modes)for(const cs of o.cases)for(const g of ['m','f','n'])c.push({k:`dr|de|${m}|${cs}|${g}`,m,cs,g});return c}
function deMake(cell){const {m,cs,g}=cell,P=dePool()[g];let x=null,form=null;
 for(let i=0;i<40&&!x;i++){const y=P.length?gxWt(P):null;if(!y)break;const f=cs=='Gen'?deGen(y.w,g):y.w;if(f){x=y;form=f}}
 if(!x)return null;const adj=gxRnd(DADJ),fr=gxRnd(DEFR[cs]),def=DEF[cs][g],ind=DIN[cs][g];
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
 const expl=`${DEN[cs]} · ${GN[g]}: <b>${def} ${form}</b> · <b>${ind} ${form}</b> · adjektiva: <b>${def} alt${DAD[cs][g]} ${form}</b> / <b>${ind} alt${DAI[cs][g]} ${form}</b>`;
 const full=()=>{const ar=blanks[0].ok[0];return m=='ad'||m=='ai'||m=='an'?fr.replace('{P}',ar+' '+form):m=='jd'?fr.replace('{P}',def+' '+adj+DAD[cs][g]+' '+form):m=='ji'?fr.replace('{P}',ind+' '+adj+DAI[cs][g]+' '+form):fr.replace('{P}',blanks[0].ok[0]+' '+adj+blanks[1].ok[0]+' '+form)};
 return{g:'dad',k:cell.k,cell:`${DEM[m]} · ${DEN[cs].split(' · ')[0]} · ${GN[g]}`,blanks,parts,adj:m=='jd'||m=='ji'||m=='mx'?adj:'',x,tr:`${form} = ${x.c[2]}`,expl,fullTxt:full(),say:()=>full(),L:'de',hint:m=='an'?'':''}}
/* ============ NL ============ */
const NLM={art:'Artikel & penentu yang cocok',dem:'Dit / dat / deze / die',adj:'Akhiran adjektiva (-e atau tanpa -e)'};
const NLADJ=['oud','nieuw','klein','goed','lang','kort','jong','koud','warm','mooi','leuk','sterk','lelijk','belangrijk','vriendelijk','rustig','interessant','moeilijk','makkelijk','bekend'];
const NLFR=['Ik zie {P}.','Hier is {P}.','Zij koopt {P}.','Hij zoekt {P}.','Wij hebben {P}.','Ik heb {P} gekocht.','Dit is {P}.','Hij praat over {P}.','Ik denk aan {P}.'];
const NLDET={def:'bentuk tentu (de/het)',een:'een',geen:'geen',dem:'dit/dat/deze/die',pos:'mijn/jouw/zijn'};
let nlP={};
function nlPool(){const o=GXO('dnl'),k=o.lv.join();if(nlP.k==k)return nlP.v;const v={de:[],het:[]};
 for(const x of ggAll('nl')){if(o.lv.length&&!o.lv.includes(x.lv))continue;if(!/^[a-zëïéèäöüA-Z]{2,20}$/.test(x.w))continue;if(v[x.art])v[x.art].push(x)}nlP={k,v};return v}
function nlCells(){const o=GXO('dnl'),c=[];for(const m of o.modes){if(m=='adj')for(const d of Object.keys(NLDET))for(const t of['de','het'])c.push({k:`dr|nl|adj|${d}|${t}`,m,d,t});
 else if(m=='dem')for(const p of['near','far'])for(const t of['de','het'])c.push({k:`dr|nl|dem|${p}|${t}`,m,d:p,t});else for(const t of['de','het'])c.push({k:`dr|nl|art||${t}`,m,d:'',t})}return c}
function nlMake(cell){const {m,d,t}=cell,NP=nlPool()[t],x=NP.length?gxWt(NP):null;if(!x)return null;const fr=gxRnd(NLFR),n=x.w,adj=gxRnd(NLADJ);let blanks,np,expl,full;
 const defA=t,rl=`${t}-woord`;
 if(m=='art'){const n1=t=='het'?'dit':'deze',n2=t=='het'?'dat':'die',o1=t=='het'?'de':'het',ok=[t,'een','geen',n1,n2,'mijn'],bad=[o1,t=='het'?'deze':'dit',t=='het'?'die':'dat'];
  blanks=[{opts:gxShuf(ok.concat(bad)),ok,multi:1,lab:'Pilih semua yang cocok',l:'nl'}];np=[0,' '+n];expl=`<b>${t} ${n}</b> → ${rl}. Yang cocok: ${t} / een / geen / ${n1}, ${n2} / mijn (jouw, zijn, haar…) ${n}.`;full=fr.replace('{P}',t+' '+n)}
 else if(m=='dem'){const near=d=='near',ok=t=='het'?(near?'dit':'dat'):(near?'deze':'die');blanks=[{opts:['dit','dat','deze','die'],ok:[ok],multi:0,lab:near?'Penunjuk dekat (ini)':'Penunjuk jauh (itu)',l:'nl'}];np=[0,' '+n];expl=`${rl}: ${t=='het'?'dit (ini) / dat (itu)':'deze (ini) / die (itu)'} ${n}.`;full=fr.replace('{P}',ok+' '+n)}
 else{const dets={def:t,een:'een',geen:'geen',dem:t=='het'?gxRnd(['dit','dat']):gxRnd(['deze','die']),pos:gxRnd(['mijn','jouw','zijn','haar'])},dt=dets[d],bare=(d=='een'||d=='geen')&&t=='het',ok=bare?'ø':'e';
  blanks=[{opts:['e','ø'],ok:[ok],multi:0,lab:'Akhiran adjektiva',l:'',suf:1,nl:1}];np=[dt+' '+adj,0,' '+n];
  expl=bare?`<b>${dt}</b> + <b>het</b>-woord (tunggal, tak tentu) → adjektiva <b>tanpa -e</b>: ${dt} ${adj} ${n}.`:`${d=='een'||d=='geen'?`<b>${dt}</b> + <b>de</b>-woord`:`kata penentu tentu (${dt})`} → adjektiva <b>+e</b>: ${dt} ${adj}e ${n}.`;full=fr.replace('{P}',dt+' '+adj+(bare?'':'e')+' '+n)}
 const parts=[];fr.split('{P}').forEach((s,i,a)=>{parts.push(s);if(i<a.length-1)np.forEach(p=>parts.push(p))});
 const cl=m=='adj'?`${NLM.adj} · ${NLDET[d]} · ${rl}`:m=='dem'?`Penunjuk · ${d=='near'?'dekat':'jauh'} · ${rl}`:`Penentu · ${rl}`;
 return{g:'dnl',k:cell.k,cell:cl,blanks,parts,adj:m=='adj'?adj:'',x,tr:`${n} = ${x.c[2]}`,expl,fullTxt:full,say:()=>full,L:'nl'}}
/* ============ alur umum ============ */
function gxItems(g){return g=='zcl'?zcPool():g=='dad'?deCells():nlCells()}
function gxNext(g){const items=gxItems(g);gxFree=0;const q=gxQueue(g,items);let it=gxPickQ(q,items),tries=0,r=null;
 while(it&&!r&&tries++<6){r=g=='zcl'?zcMake(it):g=='dad'?deMake(it):nlMake(it);if(!r)it=gxRnd(items)}
 if(r){r.sel=r.blanks.map(()=>new Set());r.q={n:Math.min(q.N.length,q.nL),r:Math.min(q.R.length,q.rL),l:q.L.length}}
 return r}
function gxScore(q){let perfect=true,wrong=false;q.blanks.forEach((b,i)=>{const ok=new Set(b.ok),s=q.sel[i];if(!gxEq(ok,s))perfect=false;if([...s].some(v=>!ok.has(v)))wrong=true});return perfect?3:wrong?1:2}
function gxFinish(){const q=gxQ,g=q.g,sc=gxScore(q),st=gxStat(g);
 const c=S.gg[q.k],had=c&&c.t;let nx='';
 if(!gxFree){const n=fcCalc(c,sc,Date.now(),true);n.gn=((c&&c.gn)|0)+1;n.go=((c&&c.go)|0)+(sc==3?1:0);S.gg[q.k]=n;if(!had)st.n++;else if(c.t==2)st.r++;nx=n.t==2?fcFmtD(n.i):fcFmt(n.d-Date.now())}
 st.a++;if(sc==3)st.ok++;gxSes.n++;if(sc==3){gxSes.ok++;gxSes.st++;gxSes.best=Math.max(gxSes.best,gxSes.st)}else gxSes.st=0;
 gxRes={sc,next:nx,free:gxFree};buzz(sc==3?10:[16,40,16])}
function gxAct(a,x,k){const g=gxCur,o=g&&g!='gen'&&GXO?GXO(g):null;
 if(a=='ggxopen'){gxCur=x;gxQ=null;gxRes=null;gxSes={n:0,ok:0,st:0,best:0};scrollTo(0,0)}
 else if(a=='ggxhome'){gxCur=null;gxQ=null;gxRes=null;ggCur=null;ggRes=null}
 else if(a=='ggxpick'&&gxQ&&!gxRes){const i=+x,b=gxQ.blanks[i],s=gxQ.sel[i];if(b.multi){s.has(k)?s.delete(k):s.add(k)}else{s.clear();s.add(k);if(gxQ.sel.every(z=>z.size)){gxFinish()}}}
 else if(a=='ggxchk'&&gxQ&&!gxRes&&gxQ.sel.every(z=>z.size))gxFinish();
 else if(a=='ggxnext'){gxQ=null;gxRes=null}
 else if(a=='ggxsay'&&gxQ)say(k||gxQ.say(x),gxQ.L||'zh');
 else if(a=='ggxmore'&&o){gxStat(g).x=(gxStat(g).x|0)+10;gxQ=null}
 else if(a=='ggxtg'&&o){const [f,v]=x.split(':'),arr=o[f],i=arr.indexOf(v);i<0?arr.push(v):arr.splice(i,1);if(f=='modes'&&!arr.length)arr.push(v);if(f=='cases'&&!arr.length)arr.push(v);gxQ=null;gxRes=null}
 else if(a=='ggxflag'&&o){o[x]=o[x]?0:1;gxQ=null;gxRes=null}
 else if(a=='ggxrst'){if(confirm('Hapus semua jadwal game ini?')){const p={zcl:['zc|','zv|'],dad:['dr|de|'],dnl:['dr|nl|']}[g]||[];for(const key of Object.keys(S.gg))if(p.some(z=>key.startsWith(z)))delete S.gg[key];gxQ=null;gxRes=null}}}
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
function gxHead(g,sub){const m=GMS.find(z=>z.id==g);return `<div class=gxbar><button class=gxback data-a=ggxhome aria-label="Kembali ke daftar game">‹ Games</button><b>${esc(m.t)}</b><span class=gxses title="Sesi ini">${gxSes.n?`${gxSes.ok}/${gxSes.n}`:''}${gxSes.st>=3?` 🔥${gxSes.st}`:''}</span></div>`}
function gxChips(label,list,cur,field,names){return `<small>${label}</small><div class=chips>${list.map(v=>`<button class="chip${cur.includes(v)?' on':''}" data-a=ggxtg data-v="${field}:${v}">${esc(names?names[v]||v:v)}</button>`).join('')}</div>`}
function gxSettings(g){const o=GXO(g);let h=`${dtag('gxs_'+g)}<summary><span>Pengaturan game</span></summary><div class=card>`;
 if(g=='zcl')h+=`<small>Kategori kata</small><div class=chips><button class="chip${o.cats.length?'':' on'}" data-a=ggxtg data-v="cats:*">Semua</button>${Object.keys(ZCCAT).map(c=>`<button class="chip${o.cats.includes(c)?' on':''}" data-a=ggxtg data-v="cats:${c}">${ZCCAT[c]}</button>`).join('')}</div><label class=fcl><span>Termasuk soal penggolong verbal (次, 遍, 场…)</span><input type=checkbox ${o.verb?'checked ':''}data-a=ggxflag data-v=verb></label><label class=fcl><span>Pinyin di soal</span><input type=checkbox ${o.py?'checked ':''}data-a=ggxflag data-v=py></label>`;
 else{const lv=ggLv(g=='dad'?'de':'nl');h+=gxChips('Jenis soal',g=='dad'?Object.keys(DEM):Object.keys(NLM),o.modes,'modes',g=='dad'?DEM:NLM);if(g=='dad')h+=gxChips('Kasus',DEC,o.cases,'cases',{Nom:'Nominativ',Akk:'Akkusativ',Dat:'Dativ',Gen:'Genitiv'});h+=gxChips('Level kata benda',lv,o.lv,'lv');h+=`<small>Level kosong = semua level.</small>`}
 h+=`<label class=fcl><span>Soal baru per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:n value="${o.n}" min=0 max=9999></label><label class=fcl><span>Maks. ulasan per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:r value="${o.r}" min=0 max=9999></label><div class=btns><button data-a=ggxrst>Reset jadwal game</button></div></div></details>`;return h}
function gxMeta(g,q){const st=gxStat(g);return `<div class=fcc><span class=k1><b>${q?q.q.n:0}</b><small>Baru</small></span><span class=k2><b>${q?q.q.l:0}</b><small>Belajar</small></span><span class=k3><b>${q?q.q.r:0}</b><small>Ulas</small></span></div>`}
function gxView(g){if(!gxQ){gxQ=gxNext(g);gxRes=null}const q=gxQ;let h=gxHead(g)+gxSettings(g);
 if(!q)return h+`<div class="card empty"><b>Tidak ada soal</b>Ubah filter pada pengaturan game.</div>`;
 h+=gxMeta(g,q);const r=gxRes,res=!!r,full=q.sel.every(z=>z.size);
 h+=`<div class="card gxc"><div class=hd><span>${esc(q.cell)}</span><span>${gxFree?'Latihan bebas':(S.gg[q.k]&&S.gg[q.k].t?esc(fcInfo0(S.gg[q.k])):'Baru')}</span></div>`;
 h+=`<div class="gxs${g=='zcl'?' zh':''}">${gxSent(q,res)}</div>`;
 if(g=='zcl'){h+=`<div class=gxtr>${esc(q.tr)}</div>${GXO('zcl').py||res?`<div class=gxpy>${esc(q.py.replace(/___/g,res?q.blanks[0].ok.map(c=>(ZCL[c]||[c])[0]).join('/'):'___'))}</div>`:''}`}
 else h+=`<div class=gxtr>${esc(q.tr)}</div>`;
 q.blanks.forEach((b,i)=>{h+=`<div class=gxl>${esc(b.lab||'')}${b.multi?' <em>(bisa lebih dari satu)</em>':''}</div><div class="gxg${b.opts.length>6?' w':''}">${b.opts.map(v=>gxOptBtn(q,i,v,res)).join('')}</div>`});
 if(!res)h+=`<div class=dock>${q.blanks.some(b=>b.multi)||q.blanks.length>1?`<button class=pri data-a=ggxchk${full?'':' disabled'}>Periksa</button>`:''}</div>`;
 if(res){const sc=r.sc;let body='';
  if(g=='zcl'){const x=q.x;body=`<ul class=gxex>${q.blanks[0].ok.map(c=>{const f=q.full(c);return `<li><span class=gxzh>${esc(f[0])}</span> ${spk(q.say(c),'zh')}<small>${esc(f[1])}</small><em>${esc(c)} ${esc((ZCL[c]||['',''])[0])} — ${esc((ZCL[c]||['',''])[1])}</em></li>`}).join('')}</ul>${q.note?`<div class=gxnote>💡 ${esc(q.note)}</div>`:''}`}
  else body=`<div class=gxex1>${spk(q.fullTxt,q.L)} <b>${esc(q.fullTxt)}</b></div><div class=gxnote>${q.expl}</div>`;
  h+=`<div class="ggr ${sc==3?'ok':sc==2?'part':'bad'}"><b>${sc==3?'✓ Benar':sc==2?'◐ Sebagian benar — masih ada jawaban lain':'✗ Belum tepat'}</b>${r.free?'<small>Latihan bebas (tidak mengubah jadwal)</small>':r.next?`<small>Muncul lagi: ${esc(r.next)}</small>`:''}${body}</div><div class=dock><button class=pri data-a=ggxnext>Lanjut</button></div>`}
 return h+`</div>`}
function gxHub(){const d=gxStat('zcl');const T=GMS.map(m=>{let st='',due='';
  if(m.id=='gen'){const q=ggQ();st=`${q.L.length+Math.min(q.R.length,q.rL)} ulas · ${Math.min(q.N.length,q.nL)} baru`}
  else{const it=gxItems(m.id),q=gxQueue(m.id,it);st=`${q.L.length+Math.min(q.R.length,q.rL)} ulas · ${Math.min(q.N.length,q.nL)} baru`}
  const s=m.id=='gen'?{a:S.ggd&&S.ggd.d==gxDay()?(S.ggd.n+S.ggd.r):0,ok:0}:gxStat(m.id);
  return `<button class=gxcard data-a=ggxopen data-v=${m.id}><span class=gxic>${esc(m.ic)}</span><span class=gxtx><b>${esc(m.t)}</b><small>${esc(m.d)}</small><em>${esc(st)}${s.a?` · hari ini ${s.ok!=null&&m.id!='gen'?s.ok+'/'+s.a:s.a}`:''}</em></span><span class=gxtagc>${m.tag}</span></button>`}).join('');
 const tot=Object.values((S.gxd&&S.gxd.d==gxDay()?S.gxd.g:{})).reduce((a,x)=>({a:a.a+x.a,ok:a.ok+x.ok}),{a:0,ok:0});
 return `<div class=gxhero><b>${tot.a?`${tot.ok}/${tot.a} benar hari ini`:'Pilih game untuk mulai'}</b><small>Latihan singkat 2–5 menit. Jadwal ulasan terpisah dari kartu utama.</small></div><div class=gxlist>${T}</div>`}
function ggView(){if(!gxCur)return gxHub();if(gxCur=='gen')return `<div class=gxbar><button class=gxback data-a=ggxhome aria-label="Kembali ke daftar game">‹ Games</button><b>Tebak Gender</b><span></span></div>`+ggGenView();return gxView(gxCur)}
