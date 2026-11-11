/* Game suara & hitung — data dan pembuat soal angka (num_zh … num_eo). Murni, tanpa DOM.
   Soal: {k,cell,L,dir:'A'|'B',exp,show,say,words,key:{main,sub,tip},judge(alts)->{ok,got}} */
const VG={};
const VGLG=['zh','ja','de','nl','en','eo'];
const VGLN={zh:'Mandarin',ja:'Jepang',de:'Jerman',nl:'Belanda',en:'Inggris',eo:'Esperanto'};
const vgRi=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const vgPick=a=>a[Math.floor(Math.random()*a.length)];
/* ---------- Mandarin ---------- */
const ZHD='零一二三四五六七八九',ZHPY={零:'líng',一:'yī',二:'èr',三:'sān',四:'sì',五:'wǔ',六:'liù',七:'qī',八:'bā',九:'jiǔ',十:'shí',百:'bǎi',千:'qiān',万:'wàn',点:'diǎn',第:'dì',幺:'yāo',两:'liǎng'};
function zhSub(n,first){let s='',pend=0;const d=[n/1000|0,n/100%10|0,n/10%10|0,n%10],u=['千','百','十',''];
 for(let i=0;i<4;i++){const x=d[i];if(!x){if(s)pend=1;continue}if(pend){s+='零';pend=0}
  if(x==1&&u[i]=='十'&&!s&&first)s+='十';else s+=ZHD[x]+u[i]}return s}
function zhW(n){if(n==0)return '零';if(n<1e4)return zhSub(n,true);const hi=n/1e4|0,lo=n%1e4;let s=zhSub(hi,true)+'万';if(lo){if(lo<1000)s+='零';s+=zhSub(lo,false)}return s}
const zhLiang=s=>s.replace(/二(?=[百千万])/g,'两');
const zhPinyin=s=>[...s].map(c=>ZHPY[c]||'').filter(Boolean).join(' ');
const zhDig=(d,tel)=>d=='1'&&tel?'幺':ZHD[+d];
/* ---------- Jepang ---------- */
const JAD='〇一二三四五六七八九',JAK=['ぜろ','いち','に','さん','よん','ご','ろく','なな','はち','きゅう'];
function jaSub(n){let s='';const th=n/1000|0,h=n/100%10|0,t=n/10%10|0,u=n%10;
 if(th)s+=(th>1?JAD[th]:'')+'千';if(h)s+=(h>1?JAD[h]:'')+'百';if(t)s+=(t>1?JAD[t]:'')+'十';if(u)s+=JAD[u];return s}
function jaN(n){if(n==0)return '零';if(n<1e4)return jaSub(n);const hi=n/1e4|0,lo=n%1e4;return jaSub(hi)+'万'+(lo?jaSub(lo):'')}
function jaKSub(n){let s='';const th=n/1000|0,h=n/100%10|0,t=n/10%10|0,u=n%10;
 if(th)s+=({1:'せん',3:'さんぜん',8:'はっせん'})[th]||JAK[th]+'せん';
 if(h)s+=({1:'ひゃく',3:'さんびゃく',6:'ろっぴゃく',8:'はっぴゃく'})[h]||JAK[h]+'ひゃく';
 if(t)s+=(t>1?JAK[t]:'')+'じゅう';if(u)s+=JAK[u];return s}
function jaK(n){if(n==0)return 'ぜろ';if(n<1e4)return jaKSub(n);const hi=n/1e4|0,lo=n%1e4;return jaKSub(hi)+'まん'+(lo?jaKSub(lo):'')}
/* penguraian kanji posisional ketat (百一 = 101, bukan 110): tambahan untuk penilaian Jepang */
function jaStrict(t){t=String(t).replace(/\s+/g,'');if(!/^[〇零一二三四五六七八九十百千万]+$/.test(t))return null;const V={'〇':0,'零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};let tot=0,sec=0,cur=null;
 for(const c of t){if(c in V)cur=(cur==null?0:cur*10)+V[c];else if(c=='十'||c=='百'||c=='千'){sec+=(cur==null?1:cur)*({十:10,百:100,千:1000})[c];cur=null}else if(c=='万'){sec+=cur||0;tot+=(sec||1)*1e4;sec=0;cur=null}}
 return tot+sec+(cur||0)}
/* ---------- Jerman ---------- */
const DE1=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'],DET=['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'];
const de99=n=>n<20?DE1[n]:(n%10?(n%10==1?'ein':DE1[n%10])+'und':'')+DET[n/10|0];
function de999(n,ein){const h=n/100|0,r=n%100;let s='';if(h)s+=(h==1?'ein':DE1[h])+'hundert';if(r)s+=de99(r);if(ein)s=s.replace(/eins$/,'ein');return s}
function deW(n){if(n<1000)return n==0?'null':de999(n);const m=n/1e6|0,r=n%1e6,th=r/1000|0,lo=r%1000;let s='';
 if(m)s+=(m==1?'eine Million':de999(m,true)+' Millionen')+(r?' ':'');
 if(th)s+=(th==1?'ein':de999(th,true))+'tausend';if(lo)s+=de999(lo);return s}
/* ---------- Belanda ---------- */
const NL1=['nul','een','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf','dertien','veertien','vijftien','zestien','zeventien','achttien','negentien'],NLT=['','','twintig','dertig','veertig','vijftig','zestig','zeventig','tachtig','negentig'];
const nl99=n=>n<20?NL1[n]:(n%10?NL1[n%10]+(n%10==2||n%10==3?'ën':'en'):'')+NLT[n/10|0];
const nl999=n=>{const h=n/100|0,r=n%100;return (h?(h==1?'honderd':NL1[h]+'honderd'):'')+(r?nl99(r):'')};
function nlW(n){if(n<1000)return n==0?'nul':nl999(n);const m=n/1e6|0,r=n%1e6,th=r/1000|0,lo=r%1000,p=[];
 if(m)p.push(m==1?'een miljoen':nl999(m)+' miljoen');if(th)p.push(th==1?'duizend':nl999(th)+'duizend');if(lo)p.push(nl999(lo));return p.join(' ')}
/* ---------- Inggris ---------- */
const EN1=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],ENT=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const en99=n=>n<20?EN1[n]:ENT[n/10|0]+(n%10?'-'+EN1[n%10]:'');
const en999=n=>{const h=n/100|0,r=n%100;return (h?EN1[h]+' hundred'+(r?' and ':''):'')+(r?en99(r):'')};
function enW(n){if(n<1000)return n==0?'zero':en999(n);const m=n/1e6|0,r=n%1e6,th=r/1000|0,lo=r%1000,p=[];
 if(m)p.push(en999(m)+' million');if(th)p.push(en999(th)+' thousand');if(lo)p.push(p.length&&lo<100?'and '+en99(lo):en999(lo));return p.join(' ')}
/* ---------- Esperanto ---------- */
const EO1=['nul','unu','du','tri','kvar','kvin','ses','sep','ok','naŭ'];
const eo99=n=>n<10?EO1[n]:(n<20?'dek':EO1[n/10|0]+'dek')+(n%10?' '+EO1[n%10]:'');
const eo999=n=>{const h=n/100|0,r=n%100;return [h?(h==1?'cent':EO1[h]+'cent'):'',r?eo99(r):''].filter(Boolean).join(' ')};
function eoW(n){if(n<1000)return n==0?'nul':eo999(n);const m=n/1e6|0,r=n%1e6,th=r/1000|0,lo=r%1000,p=[];
 if(m)p.push(m==1?'unu miliono':eo999(m)+' milionoj');if(th)p.push(th==1?'mil':eo999(th)+' mil');if(lo)p.push(eo999(lo));return p.join(' ')}
/* ---------- umum ---------- */
function vgW(n,l){return l=='zh'?zhW(n):l=='ja'?jaN(n):l=='de'?deW(n):l=='nl'?nlW(n):l=='en'?enW(n):eoW(n)}
/* tahun: dibaca seperti orang menyebutnya */
function vgYear(y,l){
 if(l=='zh')return [...String(y)].map(c=>ZHD[+c]).join('');
 if(l=='ja')return jaN(y);
 if(l=='de'){if(y>=1100&&y<2000){const a=y/100|0,b=y%100;return de99(a)+'hundert'+(b?de99(b):'')}return deW(y)}
 if(l=='nl'){if(y>=1100&&y<2000){const a=y/100|0,b=y%100;return nl99(a)+'honderd'+(b?' '+nl99(b):'')}return nlW(y)}
 if(l=='en'){if(y>=2000&&y<2010)return y==2000?'two thousand':'two thousand and '+EN1[y%100];const a=y/100|0,b=y%100;return b==0?en99(a)+' hundred':b<10?en99(a)+' oh '+EN1[b]:en99(a)+' '+en99(b)}
 return eoW(y)}
/* ordinal */
const ENOI={1:'first',2:'second',3:'third',5:'fifth',8:'eighth',9:'ninth',12:'twelfth'};
function enOrd(n){if(n==100)return 'one hundredth';if(n<20)return ENOI[n]||EN1[n]+'th';const t=n/10|0,u=n%10;return u?ENT[t]+'-'+enOrd(u):ENT[t].replace(/y$/,'ieth')}
const DEOI={1:'erste',2:'zweite',3:'dritte',7:'siebte',8:'achte'};
function deOrd(n){if(n==100)return 'hundertste';return n<20?(DEOI[n]||DE1[n]+'te'):de99(n)+'ste'}
const NLOI={1:'eerste',2:'tweede',3:'derde',8:'achtste'};
function nlOrd(n){if(n==100)return 'honderdste';return n<20?(NLOI[n]||NL1[n]+'de'):nl99(n)+'ste'}
function vgOrd(n,l){return l=='zh'?'第'+zhW(n):l=='ja'?jaN(n)+'番目':l=='de'?deOrd(n):l=='nl'?nlOrd(n):l=='en'?enOrd(n):eo99(n)+'a'}
const vgOrdShow=(n,l)=>l=='zh'?'第'+n:l=='ja'?n+'番目':l=='de'?n+'.':l=='nl'?n+'e':l=='en'?n+(n%100>=11&&n%100<=13?'th':({1:'st',2:'nd',3:'rd'})[n%10]||'th'):n+'-a';
/* digit per digit */
const VGDIG={zh:'零一二三四五六七八九'.split(''),ja:JAK,de:DE1.slice(0,10),nl:NL1.slice(0,10),en:EN1.slice(0,10),eo:EO1};
function vgDigits(s,l,tel){const D=VGDIG[l].slice();if(l=='zh'&&tel)D[1]='幺';return [...s].map(c=>/\d/.test(c)?D[+c]:'').filter(Boolean)}
/* format tampilan */
function vgFmt(n,l){const s=String(n);if(n<1000)return s;const sep=l=='de'||l=='nl'?'.':l=='eo'?' ':',';return s.replace(/\B(?=(\d{3})+(?!\d))/g,sep)}
const vgDecSep=l=>l=='de'||l=='nl'||l=='eo'?',':'.';
function vgDecW(x,l){const s=String(x),[a,b]=s.split('.');const w=vgW(+a,l),pt={zh:'点',ja:'点',de:' Komma ',nl:' komma ',en:' point ',eo:' komo '}[l];
 const ds=vgDigits(b||'',l);return w+pt+(l=='zh'||l=='ja'?ds.join(''):ds.join(' '))}
/* bersihkan teks jawaban sebelum dinilai: pemisah ribuan */
function vgClean(t,l){t=String(t==null?'':t).replace(/[  ]/g,' ').trim();
 if(/^\d{1,3}( \d{3})+$/.test(t))return t.replace(/ /g,'');
 if((l=='de'||l=='nl'||l=='eo')&&/^\d{1,3}(\.\d{3})+$/.test(t))return t.replace(/\./g,'');
 if(!(l=='de'||l=='nl'||l=='eo')&&/^\d{1,3}(,\d{3})+$/.test(t))return t.replace(/,/g,'');
 return t}
/* ---------- pecahan ---------- */
const VGFR={
 zh:[['1/2','二分之一','一半'],['1/3','三分之一'],['1/4','四分之一'],['3/4','四分之三'],['2/3','三分之二'],['1/5','五分之一'],['1/10','十分之一']],
 ja:[['1/2','二分の一'],['1/3','三分の一'],['1/4','四分の一'],['3/4','四分の三'],['2/3','三分の二'],['1/5','五分の一'],['1/10','十分の一']],
 de:[['1/2','ein halb'],['1/3','ein Drittel'],['1/4','ein Viertel'],['3/4','drei Viertel'],['2/3','zwei Drittel'],['1/5','ein Fünftel'],['1/10','ein Zehntel']],
 nl:[['1/2','een half'],['1/3','een derde'],['1/4','een kwart'],['3/4','drie kwart'],['2/3','twee derde'],['1/5','een vijfde'],['1/10','een tiende']],
 en:[['1/2','one half','a half'],['1/3','one third','a third'],['1/4','one quarter','a quarter'],['3/4','three quarters'],['2/3','two thirds'],['1/5','one fifth','a fifth'],['1/10','one tenth','a tenth']],
 eo:[['1/2','unu duono'],['1/3','unu triono'],['1/4','unu kvarono'],['3/4','tri kvaronoj'],['2/3','du trionoj'],['1/5','unu kvinono'],['1/10','unu deono']]};
const vgCJ=s=>s.replace(/\s+/g,'').replace(/[0-9]/g,c=>'〇一二三四五六七八九'[+c]).replace(/零/g,'〇').replace(/分の/g,'分之');
function vgJudgeFrac(alts,exp,l){const row=VGFR[l].find(z=>z[0]==exp),forms=row.slice(1);
 for(const a0 of alts||[]){const a=String(a0).trim().replace(/\s*\/\s*/g,'/');if(a==exp)return {ok:true,got:a};
  if(l=='zh'||l=='ja'){const c=vgCJ(a);if(forms.some(f=>vgCJ(f)==c))return {ok:true,got:a}}}
 if(l!='zh'&&l!='ja'){const all=[],own=[];VGFR[l].forEach((z,i)=>z.slice(1).forEach(f=>{all.push(f);own.push(i)}));
  const pk=srPhonPick(alts||[],all);if(pk>=0&&VGFR[l][own[pk]][0]==exp)return {ok:true,got:all[pk]}}
 return {ok:false,got:(alts||[])[0]}}
/* ---------- ordinal: nilai ---------- */
function vgJudgeOrd(alts,n,l){for(const a0 of alts||[]){const a=String(a0).trim();let m=a.match(/\d+/);
  if(m&&+m[0]==n&&!/\d\s*\d/.test(a))return {ok:true,got:+m[0]};
  let g=null;try{g=srOrd(a,l)}catch(e){}if(g===n)return {ok:true,got:g};
  if(l=='zh'||l=='ja'){const z=srNum(a,l);if(z===n)return {ok:true,got:z}}}
 if(l!='zh'&&l!='ja'){const w=vgOrd(n,l);for(const a of alts||[]){if(srOrd(a,l)==null&&srNum(a,l)==null&&srPhonEq(a,w))return {ok:true,got:n}}}
 const g0=alts&&alts.length?(srOrd(alts[0],l)||srNum(alts[0],l)):null;return {ok:false,got:g0}}
/* ---------- telepon ---------- */
function vgTel(l){const r=n=>String(Math.floor(Math.random()*Math.pow(10,n))).padStart(n,'0');
 if(l=='zh')return {d:'1'+vgRi(3,9)+r(9),g:[3,4,4]};
 if(l=='ja')return {d:vgPick(['090','080','070'])+r(8),g:[3,4,4]};
 if(l=='de')return {d:vgPick(['0151','0160','0170','0176'])+r(7),g:[4,3,4]};
 if(l=='nl')return {d:'06'+r(8),g:[2,4,4]};
 if(l=='en')return {d:vgRi(2,9)+r(2)+r(3)+r(4),g:[3,3,4]};
 return {d:r(8),g:[2,2,2,2]}}
const vgGroup=(d,g)=>{let i=0;return g.map(n=>{const s=d.slice(i,i+n);i+=n;return s}).filter(Boolean)};
/* ---------- tingkat ---------- */
const NUM={n20:'0–20',n100:'21–100',n1h:'Ratusan',n1k:'Ribuan',nbig:'Puluh ribu – juta',tel:'Nomor telepon',yr:'Tahun',dec:'Desimal',frc:'Pecahan',ord:'Ordinal'};
const NUTIP={
 zh:{n20:'十一 = 11, 二十 = 20: tidak ada kata khusus seperti belasan.',n100:'二十一 = 2×10+1: urutan seperti Indonesia (puluhan + satuan).',n1h:'200 boleh 二百 atau 两百 (lisan lebih sering 两); 105 → 一百零五 (零 menandai angka puluhan yang kosong).',n1k:'2000 lisan: 两千; 1010 → 一千零一十; 零 dibaca bila ada angka kosong di tengah.',nbig:'Satuan 万 = 10.000: 35万 = 350.000; 一万二 lisan = 12.000.',tel:'Nomor telepon dibaca digit demi digit; 1 dibaca 幺 (yāo) agar tidak tertukar dengan 7 (qī).',yr:'Tahun dibaca digit demi digit: 2026 → 二零二六, lalu 年.',dec:'Desimal: 点 (diǎn) lalu tiap digit satu per satu.',frc:'Pecahan dibaca penyebut dulu: 3/4 → 四分之三 (“dari empat bagian, tiga”).',ord:'Ordinal = 第 + angka: 第五 = ke-5.'},
 ja:{n20:'4 = し/よん, 7 = しち/なな, 0 = ゼロ/れい; 11 = じゅういち.',n100:'二十一 = に・じゅう・いち: sama seperti Indonesia (puluhan lalu satuan).',n1h:'Ubah bunyi: 300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく.',n1k:'3000 さんぜん, 8000 はっせん; 1000 = せん (tanpa いち).',nbig:'Satuan 万 (まん) = 10.000, bukan 1000: 35万 = さんじゅうごまん. 1万 harus いちまん.',tel:'Digit demi digit; 0 = ゼロ/れい, 4 = よん, 7 = なな, 2 sering diperpanjang にー.',yr:'Tahun dibaca sebagai bilangan: 2026 = にせんにじゅうろく, lalu 年 (ねん).',dec:'Desimal: 点 (てん) lalu tiap digit.',frc:'Penyebut dulu: 3/4 = 四分の三 (よんぶんのさん).',ord:'Ordinal: ～番目 (ばんめ).'},
 de:{n20:'11 = elf, 12 = zwölf, 16 = sechzehn, 17 = siebzehn (tanpa -s).',n100:'Urutan terbalik: 21 = einundzwanzig (satu-dan-dua puluh). 30 = dreißig, 60 = sechzig, 70 = siebzig.',n1h:'100 = (ein)hundert; 101 = hunderteins; ditulis menyambung.',n1k:'1999 = eintausendneunhundertneunundneunzig; tahun: neunzehnhundert…',nbig:'Satu kata panjang; eine Million, zwei Millionen (jamak, kata benda). 1,5 Mio. = eineinhalb Millionen.',tel:'Digit demi digit; 2 sering zwo agar tidak mirip drei; 0 = null.',yr:'Sampai 1999: hundert-an (neunzehnhundertdreiundachtzig); sejak 2000: zweitausend…',dec:'Pakai koma: 3,14 = drei Komma eins vier.',frc:'halb, Drittel, Viertel, Fünftel (kata benda netral, dieja: ein Viertel).',ord:'Ordinal: 1.–19. +te (erste, dritte, siebte, achte), 20.+ +ste.'},
 nl:{n20:'Bedakan zeven (7) dan zes (6); 11 = elf, 12 = twaalf.',n100:'Urutan terbalik: 21 = eenentwintig; 22 = tweeëntwintig; 23 = drieëntwintig (+ën), lainnya +en.',n1h:'100 = honderd, 200 = tweehonderd; satu kata.',n1k:'1000 = duizend (tanpa een); 1234 = duizend tweehonderdvierendertig.',nbig:'duizend & miljoen; miljoen tidak berubah bentuk jamak (twee miljoen).',tel:'Digit demi digit atau berpasangan; 0 = nul, 06 = nul zes.',yr:'1983 = negentienhonderd drieëntachtig; 2026 = tweeduizend zesentwintig.',dec:'Pakai koma: 3,14 = drie komma een vier.',frc:'half, derde, kwart, vijfde, tiende; 3/4 = drie kwart.',ord:'Ordinal: eerste, tweede, derde, achtste; lainnya +de (≤19) atau +ste (≥20).'},
 en:{n20:'13–19 berakhiran -teen (stres di akhir), 30–90 -ty (stres di awal): thirteen ≠ thirty.',n100:'21–99 pakai tanda hubung: twenty-one.',n1h:'one hundred and twenty-three (“and” Inggris; Amerika sering tanpa and).',n1k:'1,234 = one thousand two hundred and thirty-four; tidak ada “ones”.',nbig:'Jangan jamak: two hundred thousand (bukan thousands).',tel:'Digit demi digit; 0 = oh (lisan) atau zero; 55 sering “double five”.',yr:'Tahun berpasangan: 1983 = nineteen eighty-three; 2026 = twenty twenty-six.',dec:'Pakai “point”: 3.14 = three point one four.',frc:'one half, one third, one quarter; 3/4 = three quarters.',ord:'first, second, third; lainnya +th (fifth, eighth, ninth, twelfth khusus).'},
 eo:{n20:'1–10: unu du tri kvar kvin ses sep ok naŭ dek; 0 = nul.',n100:'Sangat teratur: dudek tri = 2×10 + 3 (kata terpisah).',n1h:'cent, ducent, tricent …; 123 = cent dudek tri.',n1k:'mil = 1000; du mil = 2000; kata terpisah.',nbig:'mil dan miliono (unu miliono, du milionoj).',tel:'Digit demi digit: unu du tri…',yr:'Sama dengan bilangan: 2026 = du mil dudek ses.',dec:'3,14 = tri komo unu kvar.',frc:'duono, triono, kvarono; 3/4 = tri kvaronoj.',ord:'Cardinal + -a: unua, dua, tria, kvara.'}};
const NUMS_PRE=l=>'nu|'+l+'|';
function nuNum(lv,l){
 if(lv=='n20')return vgRi(0,20);
 if(lv=='n100')return vgRi(21,100);
 if(lv=='n1h')return vgRi(101,999);
 if(lv=='n1k')return vgRi(1000,9999);
 const d=vgRi(5,7),x=Math.floor(Math.pow(10,d-1)+Math.random()*9*Math.pow(10,d-1));const keep=vgRi(2,4);return Math.round(x/Math.pow(10,Math.max(0,d-keep)))*Math.pow(10,Math.max(0,d-keep))}
function nuJ(a,n,l,w){const r=srJudgeNum(a,n,l,{eoWords:l=='eo'?[w,w.replace(/ /g,'')]:null});if(r.ok||l!='ja')return r;for(const z of a||[])if(jaStrict(z)===n)return {ok:true,got:n,alt:z};return r}
function nuMake(c){const l=c.l,lv=c.lv,dir=c.dir,q={L:l,dir,cell:NUM[lv]+' · '+(dir=='A'?'dengar':'lihat')+' → '+(dir=='A'?'angka':'ucapkan')};
 const tip=NUTIP[l][lv];
 const key=(main,sub,x)=>({main,sub:sub||'',tip,x:x||''});
 if(lv=='tel'){const t=vgTel(l),gs=vgGroup(t.d,t.g);q.exp=t.d;q.show=gs.join(l=='ja'?'-':' ');
  const ws=gs.map(g=>vgDigits(g,l,true).join(' '));q.say=ws.join(', ');q.words=ws.join(' · ');
  q.key=key(q.words,l=='ja'?gs.map(g=>vgDigits(g,l,true).join('')).join('・'):'');q.judge=a=>srJudgeNum(a,t.d,l,{digits:true,eoWords:l=='eo'?[vgDigits(t.d,l).join(' ')]:null});q.kind='digits';return q}
 if(lv=='frc'){const row=vgPick(VGFR[l]),w=row[1];q.exp=row[0];q.show=row[0];q.say=w;q.words=w;q.key=key(w);q.judge=a=>vgJudgeFrac(a,row[0],l);q.kind='frac';return q}
 if(lv=='ord'){const n=Math.random()<.7?vgRi(1,31):vgRi(32,100),w=vgOrd(n,l);q.exp=n;q.show=vgOrdShow(n,l);q.say=w;q.words=w;q.key=key(w,l=='zh'?zhPinyin(w):l=='ja'?'':'');q.judge=a=>vgJudgeOrd(a,n,l);q.kind='ord';return q}
 if(lv=='dec'){const dp=vgRi(1,2),x=(vgRi(1,99)+vgRi(1,Math.pow(10,dp)-1)/Math.pow(10,dp)).toFixed(dp).replace(/0+$/,'');
  const ds=String(x);q.exp=+ds;q.show=ds.replace('.',vgDecSep(l));const w=vgDecW(ds,l);q.say=w;q.words=w;q.key=key(w,l=='zh'?zhPinyin(w):'');
  q.judge=a=>srJudgeNum(a.map(z=>vgClean(z,l)),q.exp,l,{eoWords:l=='eo'?[w,w.replace(/ /g,'')]:null});q.kind='num';return q}
 if(lv=='yr'){const y=vgRi(1900,2035),w=vgYear(y,l);q.exp=y;q.show=String(y);q.say=w;q.words=w;
  let sub='';if(l=='zh')sub=zhPinyin(w);if(l=='ja')sub=jaK(y);q.key=key(w,sub);
  q.judge=a=>nuJ(a,y,l,w);q.kind='num';return q}
 const n=nuNum(lv,l),w=vgW(n,l);q.exp=n;q.show=vgFmt(n,l);q.say=w;q.words=w;
 let sub='';if(l=='zh'){sub=zhPinyin(w);const lw=zhLiang(w);if(lw!=w)sub=lw+' · '+sub}if(l=='ja')sub=jaK(n);
 q.key=key(w,sub);q.judge=a=>nuJ(a.map(z=>vgClean(z,l)),n,l,w);q.kind='num';return q}
function nuCells(l,o){const cs=[];for(const lv of o.modes)for(const dir of (o.dir=='M'?['A','B']:[o.dir])){if(lv=='frc'&&false)continue;cs.push({k:NUMS_PRE(l)+lv+'|'+dir,l,lv,dir})}return cs}
VGLG.forEach(l=>{VG['num_'+l]={lg:l,pre:NUMS_PRE(l),modes:NUM,
 def:{n:10,r:200,modes:['n20','n100','n1h','n1k','tel','ord'],dir:'M',inp:'v'},
 cells:o=>nuCells(l,o),make:c=>nuMake(c)}});
