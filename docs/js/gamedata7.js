/* Game 3 — Harga & satuan (px_<lang>) + satuan ukur untuk zcl. Dimuat setelah games3.js.
   Memakai mesin VG (games3.js) dan srPrice/srJudgePrice (speech.js). Prefiks SRS: 'px|<lang>|'. */
const PXM={pm:'Harga bulat',pc:'Harga dengan sen',ms:'Satuan ukur',ch:'Kasir · kembalian',ds:'Diskon & pajak',sm:'Jumlah belanja'};
const PXML={zh:{pm:'Harga bulat (块)',pc:'块 · 毛 · 分',ds:'Diskon (打折)'},ja:{pm:'Harga kecil (円)',pc:'Ribuan & 万円',ds:'割引 & 税込'}};
const PXPRE=l=>'px|'+l+'|';
const PXCUR={en:['USD','GBP','EUR'],de:['EUR'],nl:['EUR'],eo:['EUR'],zh:['CNY'],ja:['JPY']};
const PXSM={de:['Brot','Milch','Käse','Äpfel','Kaffee','Butter'],nl:['brood','melk','kaas','appels','koffie','boter'],en:['bread','milk','cheese','apples','coffee','butter'],eo:['pano','lakto','fromaĝo','pomoj','kafo','butero'],zh:['面包','牛奶','苹果','鸡蛋','咖啡','豆腐'],ja:['パン','牛乳','りんご','たまご','コーヒー','とうふ']};
const pxZ=n=>{const w=vgW(n,'zh');return n==2?'两':/^二(百|千|万)/.test(w)?w.replace(/^二/,'两'):w};
function pxSay(v,cur,l){const M=Math.floor(v/100),m=v%100;
 if(l=='en'){const W=n=>vgW(n,'en'),u={USD:['dollar','dollars','cent','cents'],GBP:['pound','pounds','penny','pence'],EUR:['euro','euros','cent','cents']}[cur||'USD'];
  return M?W(M)+' '+(M==1?u[0]:u[1])+(m?' '+W(m):''):W(m)+' '+(m==1?u[2]:u[3])}
 if(l=='de'){const e=n=>n==1?'ein':vgW(n,'de');return M?e(M)+' Euro'+(m?' '+vgW(m,'de'):''):e(m)+' Cent'}
 if(l=='nl'){const W=n=>vgW(n,'nl');return M?W(M)+' euro'+(m?' '+W(m):''):W(m)+' cent'}
 if(l=='eo'){const W=n=>vgW(n,'eo');return M?W(M)+(M==1?' eŭro':' eŭroj')+(m?' '+W(m):''):W(m)+(m==1?' cendo':' cendoj')}
 if(l=='zh'){const j=m/10|0,f=m%10,J=j==2&&!M?'两':vgW(j,'zh');let s='';if(M)s+=pxZ(M)+'块';
  if(j&&f)s+=J+'毛'+vgW(f,'zh');else if(j)s+=M?J:J+'毛';else if(f)s+=(M?'零':'')+vgW(f,'zh')+(M?'':'分');return s}
 const n=v/100;let k=jaK(n);if(n%10==4)k=k.replace(/よん$/,'よ');return k+'えん'}
const pxWords=(v,cur,l)=>l=='ja'?vgW(v/100,'ja')+'円':pxSay(v,cur,l);
function pxShow(v,cur,l,dec){const M=Math.floor(v/100),m=v%100,sd=l=='de'||l=='nl'||l=='eo'?',':'.',num=dec?vgFmt(M,l)+sd+String(m).padStart(2,'0'):vgFmt(M,l);
 if(l=='ja')return Math.random()<.5?'¥'+num:num+'円';if(l=='zh')return '¥'+num;
 if(cur=='USD')return '$'+num;if(cur=='GBP')return M?'£'+num:m+'p';if(l=='nl')return '€ '+num;return l=='en'?'€'+num:num+' €'}
function pxJaEq(a,v){if(v%100)return false;const n=v/100;let t=String(a).replace(/[円えん\s,、。¥￥]|です/g,'');if(/^\d+$/.test(t))return+t===n;if(!t)return false;const k=jaK(n);if(t===k||t===k.replace(/よん$/,'よ'))return true;return typeof jaStrict=='function'&&jaStrict(t)===n}
function pxJ(a,v,l,how,dir,w,read){if(l=='ja'){for(const z of a||[])if(pxJaEq(z,v))return{ok:true,got:srFmtPrice(v,l),alt:z}}
 if(read&&how=='type'&&dir=='B'&&(l=='de'||l=='nl'||l=='en'||l=='eo')&&a.some(z=>/\d/.test(z)))return{ok:false,got:'ketik dalam kata'};
 return srJudgePrice(a,v,l,{eoWords:l=='eo'?[w,w.replace(/ /g,'')]:null})}
const PXTIP={
 de:{pm:'„ein Euro“ (bukan „eins Euro“). Euro dan Cent tidak berubah di jamak: zwei Euro, fünf Cent.',pc:'2,50 € = zwei Euro fünfzig; „Euro“ boleh dilesapkan: zwei fünfzig. Koma = desimal, titik = ribuan.',ms:'Setelah angka, Kilo/Pfund/Gramm/Liter tetap tunggal: drei Kilo, zwei Pfund. 1 Pfund = 500 g.',ch:'Rückgeld/Wechselgeld = kembalian: bayar − total. Hitung Euro dan Cent terpisah.',ds:'20 % Rabatt = bayar 80 %. „Prozent“ dibaca setelah angka: zwanzig Prozent.',sm:'Jumlahkan Euro dan Cent terpisah; 100 Cent = 1 Euro. Sebut: „…Euro …“.'},
 nl:{pm:'Euro tidak jamak: twee euro, drie euro. „één euro“ (bukan „een euros“).',pc:'twee euro vijftig = twee vijftig = € 2,50; 50 cent = vijftig cent. Koma desimal.',ms:'kilo/gram/liter tetap tunggal setelah angka: drie kilo, twee liter. 1 pond = 500 g.',ch:'Wisselgeld = kembalian: betaald − totaal.',ds:'20 procent korting = bayar 80 %.',sm:'Jumlahkan euro dan cent terpisah; 100 cent = 1 euro.'},
 en:{pm:'one dollar (tunggal) vs two dollars (jamak). Simbol $ £ € dibaca sebagai kata di akhir: five dollars.',pc:'two fifty = $2.50; ninety-nine cents; £: fifty pence / 50p. „and“ boleh dilesapkan.',ms:'pound ≈ 454 g, mile ≈ 1,6 km; foot → feet, inch → inches. Sebut angka + satuan.',ch:'change = kembalian: paid − total. „Here’s your change.“',ds:'20 % off = bayar 80 %. „twenty percent off“.',sm:'Jumlahkan dollars dan cents terpisah; 100 cents = 1 dollar.'},
 eo:{pm:'unu eŭro, du eŭroj; setelah kata kerja boleh akusatif: tri eŭrojn. Kata bilangan tak berubah.',pc:'du eŭroj kvindek = 2,50; naŭdek naŭ cendoj = 99 sen. „cendo“ = sen.',ms:'kilogramo/litro/metro: jamak +j (tri kilogramoj); „da“ = dari (tri kilogramoj da pomoj).',ch:'restmono = kembalian: pagita − sumo.',ds:'20 % rabato = bayar 80 %. „dudek procentoj“.',sm:'Jumlahkan eŭroj dan cendoj terpisah; 100 cendoj = 1 eŭro.'},
 zh:{pm:'二 → 两 sebelum satuan/ratusan: 两块, 两百块 (bukan 二块/二百). 块 (lisan) = 元 (tulis).',pc:'一块五 = 1,50 (毛 terakhir dilesapkan); 三块二毛五 = 3,25; 一块零五 = 1,05; 五毛 = 0,50; 五分 = 0,05.',ms:'斤 = 500 g, 公斤 = 1 kg = 2斤. 两 untuk angka 2: 两斤, 两米. 升 = liter, 公里 = km.',ch:'找钱 / 找您 = kembalian: 付 − 总共. 「找您三块五」。',ds:'打八折 = bayar 80 % (bukan 8 %!). 打五折 = setengah harga; 七五折 = 75 %.',sm:'Jumlahkan 块 dan 毛 terpisah; 10毛 = 1块.'},
 ja:{pm:'4円 = よえん (bukan よんえん). 1円 いちえん, 5円 ごえん, 10円 じゅうえん, 50円 ごじゅうえん.',pc:'300円 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく; 3000 さんぜん, 8000 はっせん; 10000 = いちまんえん.',ms:'キロ: いっキロ・さんキロ・ろっキロ・はっキロ・じゅっキロ. グラム: 100g ひゃくグラム. リットル・メートル teratur.',ch:'おつり = kembalian: 預かり − 合計. 「おつりは三百円です」。',ds:'2割引 = diskon 20 % (bayar 80 %). 税込 = termasuk pajak; 税抜 + 10 % = 税込.',sm:'Jumlahkan lalu baca: 合計 ごうけい. 1000円 = せんえん (bukan いちせんえん).'}};
/* ---- satuan ukur ---- */
const PXU={
 de:[{id:'kg',n:['Kilo','Kilo'],al:'kilogramm|kilos?|kg',q:[1,2,3,4,5,10],it:['Kartoffeln','Äpfel','Zwiebeln','Mehl'],sh:'kg'},{id:'g',n:['Gramm','Gramm'],al:'gramm|gr|g',q:[100,200,250,300,500],it:['Käse','Schinken','Butter'],sh:'g'},{id:'lb',n:['Pfund','Pfund'],al:'pfund|pf',q:[1,2,3,5],it:['Äpfel','Zucker','Kaffee'],sh:'Pfund'},{id:'l',n:['Liter','Liter'],al:'litern?|l',q:[1,2,3,5,10],it:['Milch','Wasser','Saft'],sh:'l'},{id:'m',n:['Meter','Meter'],al:'meter|m',q:[2,3,5,10,20],it:['Stoff','Kabel','Seil'],sh:'m'},{id:'km',n:['Kilometer','Kilometer'],al:'kilometer|km',q:[2,3,5,10,20],t:'dist',sh:'km'}],
 nl:[{id:'kg',n:['kilo','kilo'],al:'kilogram|kilo\'?s?|kg',q:[1,2,3,4,5,10],it:['aardappelen','appels','uien','bloem'],sh:'kg'},{id:'g',n:['gram','gram'],al:'gram|gr|g',q:[100,200,250,300,500],it:['kaas','ham','boter'],sh:'g'},{id:'lb',n:['pond','pond'],al:'pond',q:[1,2,3,5],it:['appels','suiker','koffie'],sh:'pond'},{id:'l',n:['liter','liter'],al:'liter|l',q:[1,2,3,5,10],it:['melk','water','sap'],sh:'l'},{id:'m',n:['meter','meter'],al:'meter|m',q:[2,3,5,10,20],it:['stof','kabel','touw'],sh:'m'},{id:'km',n:['kilometer','kilometer'],al:'kilometer|km',q:[2,3,5,10,20],t:'dist',sh:'km'}],
 en:[{id:'kg',n:['kilo','kilos'],al:'kilograms?|kilos?|kg',q:[1,2,3,4,5,10],it:['potatoes','apples','onions','flour'],sh:'kg'},{id:'lb',n:['pound','pounds'],al:'pounds?|lbs?',q:[1,2,3,5,10],it:['apples','sugar','coffee','potatoes'],sh:'lb'},{id:'l',n:['liter','liters'],al:'liters?|litres?|l',q:[1,2,3,5,10],it:['milk','water','juice'],sh:'L'},{id:'gal',n:['gallon','gallons'],al:'gallons?|gal',q:[1,2,5,10],it:['milk','gas','paint'],sh:'gal'},{id:'mi',n:['mile','miles'],al:'miles?|mi',q:[2,3,5,10,20],t:'dist',sh:'mi'},{id:'ft',n:['foot','feet'],al:'feet|foot|ft',q:[2,3,5,6,10],t:'len',sh:'ft'},{id:'in',n:['inch','inches'],al:'inch(?:es)?|in',q:[4,6,8,12,24],t:'len',sh:'in'}],
 eo:[{id:'kg',n:['kilogramo','kilogramoj'],al:'kilogramoj?n?|kilo|kg',q:[1,2,3,4,5,10],it:['terpomoj','pomoj','cepoj'],sh:'kg'},{id:'g',n:['gramo','gramoj'],al:'gramoj?n?|g',q:[100,200,250,300,500],it:['fromaĝo','ŝinko','butero'],sh:'g'},{id:'l',n:['litro','litroj'],al:'litroj?n?|l',q:[1,2,3,5,10],it:['lakto','akvo','suko'],sh:'l'},{id:'m',n:['metro','metroj'],al:'metroj?n?|m',q:[2,3,5,10,20],t:'len',sh:'m'},{id:'km',n:['kilometro','kilometroj'],al:'kilometroj?n?|km',q:[2,3,5,10,20],t:'dist',sh:'km'}],
 zh:[{id:'jin',n:['斤'],al:'(?<!公)斤',q:[1,2,3,5],it:['苹果','香蕉','白菜'],sh:'斤'},{id:'gj',n:['公斤'],al:'公斤|千克',q:[1,2,3,5,10],it:['大米','土豆','面粉'],sh:'公斤'},{id:'ke',n:['克'],al:'克',q:[100,200,250,300,500],it:['奶酪','火腿','黄油'],sh:'克'},{id:'sh',n:['升'],al:'(?<!毫)升',q:[1,2,3,5],it:['牛奶','水','果汁'],sh:'升'},{id:'m',n:['米'],al:'(?<![厘公])米',q:[2,3,5,10,20],it:['布','绳子','电线'],sh:'米'},{id:'km',n:['公里'],al:'公里|千米',q:[2,3,5,10,20],t:'dist',sh:'公里'}],
 ja:[{id:'kiro',n:['キロ'],al:'キロ|きろ|kg',q:[1,2,3,4,5,10],it:['じゃがいも','りんご','お米'],sh:'キロ',jc:'kiro'},{id:'guramu',n:['グラム'],al:'グラム|ぐらむ|g',q:[100,200,300,500],it:['チーズ','ハム','バター'],sh:'グラム',jc:'guramu'},{id:'rittoru',n:['リットル'],al:'リットル|りっとる|l',q:[1,2,3,5,10],it:['牛乳','水','ジュース'],sh:'リットル',jc:'rittoru'},{id:'metoru',n:['メートル'],al:'メートル|めーとる|m',q:[2,3,5,10],it:['布','ひも','ケーブル'],sh:'メートル',jc:'metoru'},{id:'senchi',n:['センチ'],al:'センチ|せんち|cm',q:[2,3,5,10],t:'len',sh:'センチ',jc:'senchi'}]};
function pxMsMake(c,q,key){const l=c.l,u=vgPick(PXU[l]),n=vgPick(u.q),it=u.it?vgPick(u.it):'',W=l=='zh'?pxZ(n):vgW(n,l);let say,words,show=vgFmt(n,l)+' '+u.sh+(it&&l!='ja'?' · '+it:it?' · '+it:'');
 const unit=(l=='en'||l=='eo')?u.n[n==1?0:1]:u.n[0];
 if(l=='de')say=u.t=='dist'?`Bis dahin sind es ${W} ${unit}.`:u.t=='len'?`Es ist ${W} ${unit} lang.`:`Ich hätte gern ${n==1?'ein':W} ${unit} ${it}.`;
 else if(l=='nl')say=u.t=='dist'?`Het is nog ${W} ${unit}.`:u.t=='len'?`Het is ${W} ${unit} lang.`:`Ik wil graag ${W} ${unit} ${it}.`;
 else if(l=='en')say=u.t=='dist'?`It's ${W} ${unit} away.`:u.t=='len'?`It's ${W} ${unit} long.`:`I'd like ${W} ${unit} of ${it}.`;
 else if(l=='eo')say=u.t=='dist'?`Estas ${W} ${unit} ĝis tie.`:u.t=='len'?`Ĝi estas ${W} ${unit}n longa.`:`Mi volus ${W} ${unit}n da ${it}.`;
 else if(l=='zh')say=u.t=='dist'?`到那儿有${W}${unit}。`:`我要${W}${unit}${it}。`;
 else{const c0=JCC.find(z=>z.id==u.jc),rd=n<=10?jcRd(c0,n)[0].r:jaK(n)+c0.b;say=u.t=='len'?`ながさは ${rd}です。`:`${it}を ${rd} ください。`}
 words=say;q.say=say;q.words=words;q.show=show;q.exp=n;q.unit=u;q.kind='ms';q.hn='数と単位'==''?'':'jumlah dan satuannya';
 let sub='';if(l=='zh')sub=zhPinyin(say.replace(/。/g,''));
 q.key=key(say.replace(/。$/,''),sub);
 q.judge=a=>pxMsJ(a,n,u,l);return q}
function pxLastEq(pre,n,l){const asia=l=='zh'||l=='ja';pre=pre.trim();if(!pre)return false;
 if(asia){for(let k=1;k<=Math.min(10,pre.length);k++){const g=srNum(pre.slice(-k),l);if(g===n)return true}return false}
 const w=pre.split(/\s+/);for(let k=1;k<=Math.min(4,w.length);k++){const g=srNum(w.slice(-k).join(' ').replace(/(\d)\s*$/,'$1'),l);if(g===n)return true}return false}
function pxMsJ(alts,n,u,l){let got=null;const asia=l=='zh'||l=='ja';
 const rx=new RegExp(asia?'(?:'+u.al+')':'(?<![a-zäöüéèêëïôûçßĉĝĥĵŝŭ])(?:'+u.al+')(?![a-zäöüéèêëïôûçßĉĝĥĵŝŭ])','i');
 for(const a of alts||[]){const t=String(a).toLowerCase().replace(/(\d)([^\d\s.,])/g,'$1 $2'),m=rx.exec(asia?String(a).toLowerCase():t);
  if(!m){const g=srNum(t,l);if(g!=null&&got==null)got=String(g);continue}
  const pre=(asia?String(a).toLowerCase():t).slice(0,m.index);if(pxLastEq(pre,n,l))return{ok:true,got:n+' '+u.sh,alt:a};
  if(got==null){const g=srNum(pre.trim().split(/\s+/).slice(-3).join(' '),l);got=g!=null?g+' '+u.sh:null}}
 return{ok:false,got:got}}
/* ---- soal ---- */
function pxRand(l,m){const r=vgRi;
 if(l=='ja')return m=='pm'?(Math.random()<.5?r(1,99):r(1,9)*10)*100:(Math.random()<.6?r(10,98)*100:r(1,9)*1000+r(0,9)*100*(Math.random()<.5?1:0))*(Math.random()<.2?10:1);
 if(l=='zh'){const M=m=='pm'?(Math.random()<.7?r(1,99):r(1,9)*100+(Math.random()<.5?0:r(1,9)*10)):r(0,30);if(m=='pm')return M*100;
  const j=r(0,9),f=Math.random()<.3?r(1,9):0;return(M||j||f?M:1)*100+j*10+f||150}
 if(m=='pm')return(Math.random()<.8?r(1,49):r(50,200))*100;
 const mn=[5,10,15,20,25,30,40,45,49,50,60,75,80,90,95,99];return Math.random()<.3?vgPick(mn)||50:r(0,49)*100+vgPick(mn)}
function pxMake(c){const l=c.l,m=c.m,dir=c.dir,cur=vgPick(PXCUR[l]),q={L:l,dir,cell:(PXML[l]&&PXML[l][m]||PXM[m])+' · '+(dir=='A'?'dengar':'lihat')+' → '+(dir=='A'?'jumlah':'ucapkan')};
 const tip=PXTIP[l][m],key=(main,sub,x)=>({main,sub:sub||'',tip,x:x||''}),sy=v=>pxSay(v,cur,l),sub=(v)=>l=='zh'?zhPinyin(sy(v)):l=='ja'?'':(l=='en'||l=='de'||l=='nl')&&v%100?'':'';
 q.inm=dir=='A'?'decimal':'text';q.ph=dir=='A'?'Jumlah (mis. 2,50)':'Bacaan';
 if(m=='ms')return pxMsMake(c,q,key);
 if(m=='pm'||m=='pc'){const v=pxRand(l,m),w=sy(v);q.exp=v;q.show=pxShow(v,cur,l,m=='pc'&&l!='ja'&&l!='zh'||l=='zh'&&m=='pc'&&v%100);q.say=w;q.words=pxWords(v,cur,l);q.kind='price';q.hn='harganya';
  let s='';if(l=='zh')s=zhPinyin(w);else if(l=='ja')s=pxWords(v,cur,l);else if(v%100&&Math.floor(v/100))s=({en:'singkat: ',de:'singkat: ',nl:'singkat: ',eo:'singkat: '}[l])+w.replace(/ (euros?|dollars?|pounds?|euro|eŭroj?|Euro)/,'');
  q.key=key(q.words,s);q.judge=(a,h)=>pxJ(a,v,l,h,dir,w,true);return q}
 const lines=[];let v,say,html='',show='';
 if(m=='ch'){let T,P;if(l=='ja'){T=vgRi(1,49)*100*100;P=T<100000?100000:T<500000?500000:1000000;if(T<50000&&Math.random()<.4)P=100000}
  else{T=(vgRi(1,19)*100+vgPick([0,50,25,75,20,80,90,10,40]));P=vgPick([5,10,20,50]);while(P*100<=T)P*=2;P*=100;if(l=='zh'){T=vgRi(2,49)*100+vgPick([0,0,50,20,80]);P=vgPick([5,10,20,50,100]);while(P*100<=T)P*=2;P*=100}}
  v=P-T;const t=sy(T),p=sy(P);
  say={en:`That'll be ${t}, please. Here you go, ${p}.`,de:`Das macht ${t}. Hier sind ${p}.`,nl:`Dat is dan ${t}. Alsjeblieft, ${p}.`,eo:`Tio estas ${t}. Jen ${p}.`,zh:`一共${t}。给你${p}。`,ja:`ぜんぶで ${t}です。 ${p}で おねがいします。`}[l];
  show=`${pxShow(T,cur,l,l!='ja'&&T%100)}  ·  ${pxShow(P,cur,l,0)}`;lines.push([{en:'Total',de:'Summe',nl:'Totaal',eo:'Sumo',zh:'总共',ja:'合計'}[l],pxShow(T,cur,l,l!='ja'&&T%100)],[{en:'Paid',de:'Gegeben',nl:'Betaald',eo:'Pagita',zh:'付',ja:'預かり'}[l],pxShow(P,cur,l,0)]);
  q.calc=`${pxShow(P,cur,l,l!='ja'&&(P-T)%100||0)} − ${pxShow(T,cur,l,l!='ja'&&T%100)} = ${pxShow(v,cur,l,l!='ja'&&v%100)}`;q.hn='kembaliannya'}
 else if(m=='ds'){const p=l=='ja'?vgPick([10,20,30,50]):vgPick([10,20,25,30,50]);let O;
  if(l=='ja'&&Math.random()<.4){O=vgRi(1,19)*10*100*(Math.random()<.5?5:1);v=O*11/10;say=`ぜいぬきで ${sy(O)}、しょうひぜいは じゅっパーセント。 ぜいこみは いくらですか。`;lines.push(['税抜',pxShow(O,cur,l,0)],['消費税','10%']);q.calc=`${pxShow(O,cur,l,0)} × 1,1 = ${pxShow(v,cur,l,0)}`;show=`税抜 ${pxShow(O,cur,l,0)} · 消費税 10%`}
  else{O=l=='ja'?vgRi(1,50)*100*(Math.random()<.5?10:1)/ (Math.random()<.5?1:1):vgRi(1,25)*100*4/ (Math.random()<.2?4:1);if(l=='ja')O=Math.round(O/1000)*1000||1000;O=Math.max(O,l=='ja'?100000:400);
   if(l!='ja'&&O%400)O-=O%400;v=O*(100-p)/100;const W=n=>vgW(n,l);
   if(l=='zh'){const z=(100-p)/10;say=`原价${sy(O)}，打${p==25?'七五':vgW(z,'zh')}折。`;lines.push(['原价',pxShow(O,cur,l,0)],['',`打${p==25?'七五':vgW(z,'zh')}折`]);show=`原价 ${pxShow(O,cur,l,0)} · 打${p==25?'七五':vgW(z,'zh')}折`}
   else if(l=='ja'){say=`ていかは ${sy(O)}、${jaK(p/10)}わりびきです。`;lines.push(['定価',pxShow(O,cur,l,0)],['',`${p/10}割引`]);show=`定価 ${pxShow(O,cur,l,0)} · ${p/10}割引`}
   else{say={en:`It's ${sy(O)}, with ${W(p)} percent off.`,de:`Das kostet ${sy(O)}, mit ${W(p)} Prozent Rabatt.`,nl:`Het kost ${sy(O)}, met ${W(p)} procent korting.`,eo:`Ĝi kostas ${sy(O)}, kun ${W(p)} procentoj da rabato.`}[l];
    const rb={en:'off',de:'Rabatt',nl:'korting',eo:'rabato'}[l];lines.push([{en:'Price',de:'Preis',nl:'Prijs',eo:'Prezo'}[l],pxShow(O,cur,l,0)],['',`${p} % ${rb}`]);show=`${pxShow(O,cur,l,0)} · ${p} % ${rb}`}
   q.calc=`${pxShow(O,cur,l,0)} × ${100-p} % = ${pxShow(v,cur,l,l!='ja'&&v%100)}`}
  q.hn='harga akhirnya'}
 else{const n=vgRi(2,3),pool=PXSM[l].slice().sort(()=>Math.random()-.5).slice(0,n);let tot=0;const sj=[],lh=[];
  pool.forEach(nm=>{let pv=l=='ja'?vgRi(1,30)*10*100:vgRi(1,6)*100+vgPick([0,0,50,20,30,90,99,10]);if(l=='zh')pv=vgRi(1,25)*100+vgPick([0,0,50,20,80]);tot+=pv;sj.push(l=='ja'?`${nm} ${sy(pv)}`:`${nm} ${sy(pv)}`);lh.push([nm,pxShow(pv,cur,l,l!='ja'&&pv%100)])});
  v=tot;say=sj.join(l=='zh'||l=='ja'?'、 ':', ')+'.';lines.push(...lh);show=lh.map(z=>z.join(' ')).join(' + ');q.calc=lh.map(z=>z[1]).join(' + ')+' = '+pxShow(v,cur,l,l!='ja'&&v%100);q.hn='jumlah totalnya'}
 const w=sy(v);q.exp=v;q.say=say;q.words=say;q.kind='price';
 if(dir=='B'){q.noBig=true;q.html=`<div class=pxl>${lines.map(z=>`<div><span>${esc(z[0])}</span><b>${esc(z[1])}</b></div>`).join('')}</div>`;q.show=show;q.ph='Bacaan atau jumlah'}
 else{q.show=show}
 q.key=key(pxWords(v,cur,l),(l=='zh'?zhPinyin(w):'')+(q.calc?(l=='zh'?' · ':'')+q.calc:''));q.judge=(a,h)=>pxJ(a,v,l,h,dir,w,false);return q}
function pxCells(l,o){const cs=[];for(const m of o.modes)for(const dir of(o.dir=='M'?['A','B']:[o.dir]))cs.push({k:PXPRE(l)+m+'|'+dir,l,m,dir});return cs}
VGLG.forEach(l=>{VG['px_'+l]={lg:l,pre:PXPRE(l),modes:Object.assign({},PXM,PXML[l]||{}),dirs:{A:'Dengar → jumlah',B:'Lihat → ucapkan'},
 def:{n:10,r:200,modes:['pm','pc','ms','ch'],dir:'M',inp:'v'},cells:o=>pxCells(l,o),make:c=>pxMake(c)};
 GXL.push({id:'px_'+l,ic:l=='ja'?'円':l=='zh'?'块':'€',t:'Harga & satuan — '+VGLN[l],d:'Harga & mata uang, satuan ukur, kasir (kembalian), diskon, jumlah belanja. Dengar → jawab, lihat → ucapkan.',tag:l.toUpperCase(),lg:l})});
/* ---- zcl: satuan ukur & uang (sempurnakan game lama; semua opsi & SRS lama tetap) ---- */
Object.assign(ZCL,{'斤':['jīn','500 gram; harga pasar per 斤'],'公斤':['gōngjīn','kilogram (= 2斤)'],'克':['kè','gram'],'升':['shēng','liter'],'毫升':['háoshēng','mililiter'],'米':['mǐ','meter'],'公里':['gōnglǐ','kilometer'],'角':['jiǎo','jiao = 1/10 yuan (tulis)'],'毛':['máo','mao = 1/10 yuan (lisan)'],'元':['yuán','yuan (tulis, ¥)']});
ZCV.push(
 ['我想买两___苹果，大概一公斤。','wǒ xiǎng mǎi liǎng ___ píngguǒ, dàgài yì gōngjīn.','Saya mau beli dua jin apel, kira-kira satu kilo.',['斤'],'1 斤 = 500 g, jadi 2 斤 ≈ 1 kg'],
 ['他的体重是七十___，也就是七十千克。','tā de tǐzhòng shì qīshí ___, yě jiùshì qīshí qiānkè.','Berat badannya tujuh puluh kilo (70 kg).',['公斤'],'公斤 = kilogram; 斤 hanya setengahnya'],
 ['请给我一___牛奶，也就是一千毫升。','qǐng gěi wǒ yì ___ niúnǎi, yě jiùshì yìqiān háoshēng.','Tolong beri saya satu liter susu (1000 ml).',['升'],'升 = liter'],
 ['这块布长三___，可以做一条裙子。','zhè kuài bù cháng sān ___, kěyǐ zuò yì tiáo qúnzi.','Kain ini panjangnya tiga meter, cukup untuk satu rok.',['米'],'米 = meter (juga: beras/nasi mentah)'],
 ['从这儿到火车站有五___，开车要十分钟。','cóng zhèr dào huǒchēzhàn yǒu wǔ ___, kāichē yào shí fēnzhōng.','Dari sini ke stasiun lima kilometer, naik mobil sepuluh menit.',['公里'],'公里 = kilometer'],
 ['一块钱等于十___。','yí kuài qián děngyú shí ___.','Satu yuan sama dengan sepuluh jiao.',['毛','角'],'毛 lisan, 角 tulisan: 1块 = 10毛 = 10角'],
 ['这瓶水五百___，不贵，两块钱。','zhè píng shuǐ wǔbǎi ___, bú guì, liǎng kuài qián.','Botol air ini 500 mililiter, tidak mahal, dua yuan.',['毫升'],'毫升 = mililiter'],
 ['一公斤等于两___。','yì gōngjīn děngyú liǎng ___.','Satu kilogram sama dengan dua jin.',['斤'],'1公斤 = 2斤 = 1000克'],
 ['一___等于一百厘米。','yì ___ děngyú yìbǎi límǐ.','Satu meter sama dengan seratus sentimeter.',['米'],''],
 ['一斤等于五百___。','yì jīn děngyú wǔbǎi ___.','Satu jin sama dengan lima ratus gram.',['克'],'克 = gram'],
 ['这杯咖啡二十八___，不便宜。','zhè bēi kāfēi èrshíbā ___, bú piányi.','Kopi ini dua puluh delapan yuan, tidak murah.',['块','元'],'块 lisan, 元 tulisan (¥)']);
ZCG.push(['斤','公斤','克','升','毫升','米','公里'],['块','元','角','毛']);
