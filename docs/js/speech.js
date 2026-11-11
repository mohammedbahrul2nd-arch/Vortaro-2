/* speech.js — modul bersama game suara (v7.68.0)
   Bagian murni (tanpa DOM, diuji di tests/test_speech_norm.js): srNum, srDigits, srTime, srDate, srPhon*, srJudge*.
   Bagian browser: srSupported, srStart, pengaturan suara (srSettingsView/srAct).
   Semua nama global berawalan "sr" agar tidak bentrok (lihat tests/test_globals.js). */

/* ---------- peta bahasa & pengenal ---------- */
const SRL={zh:'zh-CN',ja:'ja-JP',de:'de-DE',nl:'nl-NL',en:'en-US',eo:'eo'};
function srAPI(){const w=typeof window!='undefined'?window:null;return w&&(w.SpeechRecognition||w.webkitSpeechRecognition)||null}
function srSupported(){return !!srAPI()}
/* Esperanto: S.o.srEo = 'auto'|'it'|'es'|'off' */
function srEoMode(){const m=(typeof S!='undefined'&&S.o&&S.o.srEo)||'auto';return ['auto','it','es','off'].includes(m)?m:'auto'}
function srLangCode(l,fallback){if(l!='eo')return SRL[l]||'en-US';const m=srEoMode();if(m=='off')return null;if(m=='it')return 'it-IT';if(m=='es')return 'es-ES';return fallback?'it-IT':'eo'}
const SRERR={'not-allowed':'Izin mikrofon ditolak. Aktifkan mikrofon untuk situs ini di pengaturan browser, atau pakai ⌨ Ketik jawaban.','service-not-allowed':'Layanan suara tidak diizinkan di perangkat ini. Pakai ⌨ Ketik jawaban.','no-speech':'Tidak ada suara terdengar. Coba lagi lebih dekat ke mikrofon.','network':'Pengenalan suara butuh internet. Periksa koneksi, atau pakai ⌨ Ketik jawaban.','audio-capture':'Mikrofon tidak ditemukan atau sedang dipakai aplikasi lain.','language-not-supported':'Bahasa ini belum didukung pengenal suara di perangkatmu.','aborted':'Perekaman dihentikan.','bad-grammar':'Tata bahasa pengenal tidak valid.'};
function srErrMsg(e){return SRERR[e]||('Pengenalan suara gagal ('+e+'). Pakai ⌨ Ketik jawaban.')}
let srCur=null,srEoFell=false;
/* srStart({lang,onResult(alts[],raw),onError(kode,pesan),onEnd(),alts:5,grammar}) → objek {stop()} atau null bila tak didukung */
function srStart(o){const API=srAPI();if(!API){o.onError&&o.onError('unsupported','Browser ini belum mendukung pengenalan suara. Pakai ⌨ Ketik jawaban.');o.onEnd&&o.onEnd();return null}
 let code=srLangCode(o.lang,srEoFell);if(!code){o.onError&&o.onError('language-not-supported','Pengenalan suara Esperanto dimatikan. Pakai ⌨ Ketik jawaban.');o.onEnd&&o.onEnd();return null}
 srStop();let got=false,ended=false;const r=new API();r.lang=code;r.interimResults=false;r.continuous=false;r.maxAlternatives=o.alts||5;
 if(o.grammar&&typeof window.SpeechGrammarList!='undefined'||o.grammar&&typeof window.webkitSpeechGrammarList!='undefined'){try{const G=window.SpeechGrammarList||window.webkitSpeechGrammarList,g=new G();g.addFromString(o.grammar,1);r.grammars=g}catch(e){}}
 const fin=()=>{if(ended)return;ended=true;if(srCur===h)srCur=null;o.onEnd&&o.onEnd()};
 r.onresult=ev=>{got=true;const out=[];for(let i=0;i<ev.results.length;i++){const R=ev.results[i];for(let j=0;j<R.length;j++)out.push(String(R[j].transcript||'').trim())}o.onResult&&o.onResult(out.filter(Boolean),out)};
 r.onerror=ev=>{const e=ev&&ev.error||'error';
  if(o.lang=='eo'&&!srEoFell&&srEoMode()=='auto'&&(e=='language-not-supported'||e=='bad-grammar')){srEoFell=true;ended=true;srCur=null;o.onError&&o.onError('eo-fallback','Esperanto belum didukung di perangkat ini; memakai pengenal Italia (ejaan fonetis).');srStart(o);return}
  got=true;o.onError&&o.onError(e,srErrMsg(e))};
 r.onend=()=>{if(!got&&!ended){if(o.lang=='eo'&&!srEoFell&&srEoMode()=='auto'){srEoFell=true;ended=true;srCur=null;srStart(o);return}o.onError&&o.onError('no-speech',srErrMsg('no-speech'))}fin()};
 const h={stop(){try{r.stop()}catch(e){}},abort(){ended=true;try{r.abort()}catch(e){}}};srCur=h;
 try{r.start()}catch(e){o.onError&&o.onError('audio-capture',srErrMsg('audio-capture'));fin();return null}
 return h}
function srStop(){if(srCur){try{srCur.abort()}catch(e){}srCur=null}}

/* ---------- utilitas teks ---------- */
function srLow(s){return String(s==null?'':s).toLowerCase().replace(/[\u00a0\u202f]/g,' ').replace(/[，、。！？!?;；]/g,' ').replace(/\s+/g,' ').trim()}
function srAsc(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function srFW(s){return s.replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-65248)).replace(/[：]/g,':').replace(/[．]/g,'.').replace(/[，]/g,',')}
function srIsInt(s){return /^\d+$/.test(s)}

/* ---------- angka: digit ---------- */
function srDigNum(t,l){t=srFW(t).trim();if(/^[+-]?\d+$/.test(t))return +t;
 const dec=(l=='de'||l=='nl')?',':'.',th=(l=='de'||l=='nl')?'.':',';const esc=c=>'\\'+c;
 const reTh=new RegExp('^\\d{1,3}(?:['+esc(th)+'\\s]\\d{3})+(?:'+esc(dec)+'\\d+)?$'),reTh2=new RegExp('^\\d{1,3}(?:['+esc(dec)+'\\s]\\d{3})+(?:'+esc(th)+'\\d+)?$');
 if(reTh.test(t)){const x=t.replace(new RegExp('['+esc(th)+'\\s]','g'),'').replace(dec,'.');return +x}
 if(new RegExp('^\\d+'+esc(dec)+'\\d+$').test(t))return +t.replace(dec,'.');
 if(/^\d{1,3}(?:\s\d{3})+$/.test(t))return +t.replace(/\s/g,'');
 if(reTh2.test(t)){const x=t.replace(new RegExp('['+esc(dec)+'\\s]','g'),'').replace(th,'.');return +x}
 if(/^\d+[.,]\d+$/.test(t))return +t.replace(',','.');
 return null}

/* ---------- angka: kata → token → nilai ---------- */
/* token: {v:n} nilai 0..99 · {s:m} pengali kecil (10/100/1000) · {b:m} pengali besar (1e3/1e4/1e6/1e8…) · {and:1} "und/en" · {z:1} nol penahan */
function srTable(a){const m={};a.split(' ').forEach(p=>{const i=p.lastIndexOf('=');m[p.slice(0,i)]=p.slice(i+1)});return m}
function srTok(str,tbl,keys){const out=[];let i=0;while(i<str.length){let hit=null;for(const k of keys){if(str.startsWith(k,i)){hit=k;break}}if(!hit)return null;out.push(tbl[hit]);i+=hit.length}return out}
function srMk(tbl){const keys=Object.keys(tbl).sort((a,b)=>b.length-a.length);return {tbl,keys}}
const SRT={};
(function(){
 const V=(...a)=>a.map(x=>({v:x})),mk=(o)=>{const t={};for(const k in o)t[k]=o[k];return srMk(t)};
 /* kana Jepang (hiragana) */
 SRT.jak=mk({'ぜろ':{v:0},'れい':{v:0},'まる':{v:0},'いち':{v:1},'いっ':{v:1},'に':{v:2},'さん':{v:3},'よん':{v:4},'よ':{v:4},'し':{v:4},'ご':{v:5},'ろく':{v:6},'ろっ':{v:6},'しち':{v:7},'なな':{v:7},'はち':{v:8},'はっ':{v:8},'きゅう':{v:9},'きゅ':{v:9},'く':{v:9},
  'じゅう':{s:10},'じゅっ':{s:10},'じっ':{s:10},'ひゃく':{s:100},'びゃく':{s:100},'ぴゃく':{s:100},'せん':{s:1000},'ぜん':{s:1000},'まん':{b:1e4},'おく':{b:1e8},'ちょう':{b:1e12}});
 const dg={'零':0,'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'两':2,'兩':2,'幺':1,'壹':1,'贰':2,'叁':3,'肆':4,'伍':5,'陆':6,'柒':7,'捌':8,'玖':9};
 const hz={};for(const k in dg)hz[k]=k=='零'||k=='〇'?{z:1,v:0}:{v:dg[k]};
 Object.assign(hz,{'十':{s:10},'拾':{s:10},'百':{s:100},'佰':{s:100},'千':{s:1000},'仟':{s:1000},'万':{b:1e4},'萬':{b:1e4},'亿':{b:1e8},'億':{b:1e8},'兆':{b:1e12}});
 SRT.han=mk(hz);
 SRT.de=mk({'null':{v:0},'eins':{v:1},'ein':{v:1},'eine':{v:1},'zwei':{v:2},'zwo':{v:2},'drei':{v:3},'vier':{v:4},'funf':{v:5},'sechs':{v:6},'sieben':{v:7},'acht':{v:8},'neun':{v:9},'zehn':{v:10},'elf':{v:11},'zwolf':{v:12},'dreizehn':{v:13},'vierzehn':{v:14},'funfzehn':{v:15},'sechzehn':{v:16},'siebzehn':{v:17},'achtzehn':{v:18},'neunzehn':{v:19},'zwanzig':{v:20},'dreissig':{v:30},'vierzig':{v:40},'funfzig':{v:50},'sechzig':{v:60},'siebzig':{v:70},'achtzig':{v:80},'neunzig':{v:90},'hundert':{s:100},'tausend':{b:1e3},'million':{b:1e6},'millionen':{b:1e6},'milliarde':{b:1e9},'milliarden':{b:1e9},'und':{and:1}});
 SRT.nl=mk({'nul':{v:0},'een':{v:1},'twee':{v:2},'drie':{v:3},'vier':{v:4},'vijf':{v:5},'zes':{v:6},'zeven':{v:7},'acht':{v:8},'negen':{v:9},'tien':{v:10},'elf':{v:11},'twaalf':{v:12},'dertien':{v:13},'veertien':{v:14},'vijftien':{v:15},'zestien':{v:16},'zeventien':{v:17},'achttien':{v:18},'negentien':{v:19},'twintig':{v:20},'dertig':{v:30},'veertig':{v:40},'vijftig':{v:50},'zestig':{v:60},'zeventig':{v:70},'tachtig':{v:80},'negentig':{v:90},'honderd':{s:100},'duizend':{b:1e3},'miljoen':{b:1e6},'miljard':{b:1e9},'en':{and:1}});
 SRT.eo=mk({'nul':{v:0},'unu':{v:1},'du':{v:2},'tri':{v:3},'kvar':{v:4},'kvin':{v:5},'ses':{v:6},'sep':{v:7},'ok':{v:8},'nau':{v:9},'dek':{s:10},'cent':{s:100},'mil':{b:1e3},'miliono':{b:1e6},'milionoj':{b:1e6},'miliardo':{b:1e9},'miliardoj':{b:1e9}});
 /* Inggris: kata terpisah */
 const en={zero:0,oh:0,nought:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fourty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,a:1,an:1};
 const E={};for(const k in en)E[k]={v:en[k]};Object.assign(E,{hundred:{s:100},thousand:{b:1e3},million:{b:1e6},billion:{b:1e9},and:{skip:1}});SRT.en={tbl:E,words:true};
})();
/* gabungkan token → bilangan atau null. opt.coll: aturan lisan Mandarin/Jepang (一万二 = 12000, 一百二 = 120) */
function srCombine(tk,opt){opt=opt||{};if(!tk||!tk.length)return null;
 if(!tk.some(t=>t.s||t.b)&&tk.every(t=>'v' in t)){if(tk.length==1)return tk[0].v;if(opt.cat&&tk.every(t=>t.v<10))return +tk.map(t=>t.v).join('')}
 let total=0,sec=0,cur=null,and=false,lastS=0,lastB=0,sawZ=false,bigs=[];
 for(let i=0;i<tk.length;i++){const t=tk[i];
  if(t.skip)continue;
  if(t.and){and=true;continue}
  if(t.z){sawZ=true;continue}
  if('v' in t){const v=t.v;
   if(cur===null)cur=v;
   else if(and){cur+=v}
   else if(cur>=20&&cur%10==0&&v>0&&v<10)cur+=v;
   else return null;
   and=false;continue}
  if(t.s){sec+=(cur===null?1:cur)*t.s;cur=null;lastS=t.s;lastB=0;sawZ=false;continue}
  if(t.b){sec+=cur===null?0:cur;const m=sec||1;if(bigs.length&&bigs[bigs.length-1]<=t.b&&total)return null;total+=m*t.b;bigs.push(t.b);sec=0;cur=null;lastB=t.b;lastS=0;sawZ=false;continue}}
 if(cur!==null&&opt.coll&&!sawZ){if(lastS>=100)cur=cur*lastS/10;else if(lastB==1e4&&sec==0)cur=cur*1000}
 return total+sec+(cur===null?0:cur)}
/* bahasa-bahasa kata */
function srWordsNum(t,l){
 if(l=='zh'||l=='ja'){
  const han=t.replace(/[\s,，]/g,'').replace(/(?<=\d)\s*(?=[万亿億千百])/g,'');
  /* campuran angka Arab + satuan: 3万5千, 2千, 1.5万 */
  if(/\d/.test(han)&&/[万萬亿億千百]/.test(han)&&/^[\d.]+[万萬亿億千百]?([\d.]+[万萬亿億千百]?)*$/.test(han)){let sum=0,ok=true;han.replace(/([\d.]+)([万萬亿億千百]?)/g,(m,n,u)=>{const mu={'万':1e4,'萬':1e4,'亿':1e8,'億':1e8,'千':1e3,'百':100}[u]||1;sum+=parseFloat(n)*mu;return m});return sum}
  const dp=han.split(/点|點|てん/);
  if(dp.length==2){const a=dp[0]==''?0:srWordsNum(dp[0],l),f=srDigits(dp[1],l);if(a===null||f==null||f==='')return null;return +(a+'.'+f)}
  let s=han.replace(/^第/,'').replace(/(番目|番|个|個|人|号|號|回|度)$/,'');
  /* kana (Jepang) → token */
  const kana=s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96));
  if(l=='ja'&&/[ぁ-ゖー]/.test(kana)){const tk=srTok(kana,SRT.jak.tbl,SRT.jak.keys);if(tk)return srCombine(tk,{coll:true,cat:true});}
  const tk=srTok(s,SRT.han.tbl,SRT.han.keys);if(!tk)return null;return srCombine(tk,{coll:true,cat:true,keepZ:false})}
 if(l=='en'){let w=t.replace(/[-,]/g,' ').replace(/\band\b/g,' ').replace(/\s+/g,' ').trim();if(!w)return null;
  let ws=w.split(' ');const tk=[];for(const x of ws){const e=SRT.en.tbl[x];if(!e)return null;tk.push(e)}
  /* gaya tahun: nineteen eighty four, twenty twenty six, nineteen oh five */
  if(tk.length>=2&&!tk.some(x=>x.s||x.b)&&tk[0].v>=10&&(tk[1].v>=10||(ws[1]=='oh'||ws[1]=='zero'))){const first=tk[0].v,rest=srCombine(tk.slice(1).map(x=>x.v===0?{v:0}:x),{});const r2=ws[1]=='oh'||ws[1]=='zero'?srCombine(tk.slice(2)):rest;if(r2!==null&&r2<100&&r2>=0)return first*100+r2}
  return srCombine(tk.filter(x=>!(x.v===0&&tk.length>1&&false)))}
 let s=srAsc(t.replace(/ß/g,'ss')).replace(/[\s\-,]/g,'');if(!s)return null;
 const S0=SRT[l];if(!S0)return null;
 /* Jerman "ein hundert" tunggal tetap berlaku; Belanda 'één' → een */
 const tk=srTok(s,S0.tbl,S0.keys);if(!tk)return null;return srCombine(tk,{})}
/* srNum(teks, bahasa) → bilangan atau null */
function srNum(text,l){let t=srLow(srFW(text));if(!t)return null;
 t=t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,m=>/^\.?$/.test(m)?'':m);
 /* ordinal digit: 5., 5th, 5e, 5-a, 5番目 */
 t=t.replace(/^(\d+)(?:st|nd|rd|th|\.|e|de|ste|-a|番目|番|号|日|日目|ᵗʰ)$/,'$1');
 const d=srDigNum(t,l);if(d!==null)return d;
 const mm=t.match(/^([\d.,]+)\s*(million|millions|miljoen|millionen|miliono|billion|thousand|duizend|tausend|mil|k|万|億|亿|千)$/);
 if(mm){const n=srDigNum(mm[1],l);const mu={million:1e6,millions:1e6,miljoen:1e6,millionen:1e6,miliono:1e6,billion:1e9,thousand:1e3,duizend:1e3,tausend:1e3,mil:1e3,k:1e3,'万':1e4,'億':1e8,'亿':1e8,'千':1e3}[mm[2]];if(n!==null)return n*mu}
 const dm=t.match(/^(.+?)\s+(komma|komo|point|dot)\s+(.+)$/);
 if(dm){const a=srNum(dm[1],l),ds=srDigits(dm[3],l);if(a!==null&&ds&&/^\d+$/.test(ds))return +(a+'.'+ds)}
 return srWordsNum(t,l)}
/* srDigits(teks, bahasa) → string digit demi digit (nomor telepon) atau null */
function srDigits(text,l){const t0=srLow(srFW(text));if(!t0)return null;
 if(/\d/.test(t0)){const r=t0.replace(/[^\d]/g,'');if(r&&!/[^\d\s\-+()./]/.test(t0))return r}
 let out='';
 if(l=='zh'||l=='ja'){let s=t0.replace(/[\s\-,，、]/g,'');const kana=s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96));
  if(l=='ja'&&/[ぁ-ゖ]/.test(kana)){const D={ぜろ:0,れい:0,まる:0,いち:1,に:2,さん:3,よん:4,し:4,よ:4,ご:5,ろく:6,しち:7,なな:7,はち:8,きゅう:9,く:9};const ks=Object.keys(D).sort((a,b)=>b.length-a.length);let i=0;while(i<kana.length){if(kana[i]=='の'||kana[i]=='ー'){i++;continue}const k=ks.find(x=>kana.startsWith(x,i));if(!k)return null;out+=D[k];i+=k.length}return out||null}
  for(const ch of s){if(ch=='の')continue;const e=SRT.han.tbl[ch];if(!e||!('v' in e))return null;out+=e.v}return out||null}
 const ws=t0.replace(/[-,]/g,' ').split(' ').filter(Boolean);
 if(l=='en'){let mult=1;for(const w of ws){if(w=='double'){mult=2;continue}if(w=='triple'){mult=3;continue}const e=SRT.en.tbl[w];if(!e||!('v' in e)||e.v>9)return null;out+=String(e.v).repeat(mult);mult=1}return out||null}
 const S0=SRT[l];if(!S0)return null;
 const s=srAsc(t0.replace(/ß/g,'ss')).replace(/[\s\-,]/g,'');const tk=srTok(s,S0.tbl,S0.keys);if(!tk)return null;
 for(const t of tk){if(!('v' in t)||t.v>9){return null}out+=t.v}return out||null}

/* ---------- ordinal → bilangan (de/nl/en/eo) ---------- */
function srOrd(w,l){w=srAsc(srLow(w).replace(/ß/g,'ss')).replace(l=='en'?/[.]/g:/[.\s]/g,'');if(!w)return null;
 const dg=w.match(/^(\d+)(?:st|nd|rd|th|e|de|ste|a|-a)?$/);if(dg)return +dg[1];
 if(l=='en'){const sp={first:1,second:2,third:3,fifth:5,eighth:8,ninth:9,twelfth:12};const x=w.replace(/-/g,' ').split(' ');const last=x.pop();let c=sp[last]!=null?String(['','one','two','three','','five','','','eight','nine','','','twelve'][sp[last]]):last.endsWith('ieth')?last.slice(0,-4)+'y':last.endsWith('th')?last.slice(0,-2):null;if(c===null)return null;return srNum((x.join(' ')+' '+c).trim(),'en')}
 if(l=='de'){const m=w.match(/^(.*?)(e|en|er|em|es)?$/);let b=m[1];const sp={erst:1,dritt:3,siebt:7,acht:8};if(sp[b])return sp[b];
  if(/(dritt|erst|siebt)$/.test(b)){b=b.replace(/dritt$/,'drei').replace(/erst$/,'eins').replace(/siebt$/,'sieben');return srNum(b,'de')}
  if(/igst$/.test(b)||/hundertst$/.test(b)||/tausendst$/.test(b))b=b.slice(0,-2);else if(/t$/.test(b))b=b.slice(0,-1);else return null;return srNum(b,'de')}
 if(l=='nl'){let b=w.replace(/(e|en)$/,m=>'');const sp={eerst:1,derd:3};b=w.replace(/e$/,'');if(sp[b])return sp[b];
  if(/ste$/.test(w)||/st$/.test(b)){b=w.replace(/ste$/,'');}else if(/de$/.test(w)){b=w.replace(/de$/,'')}else return null;if(b=='eer')return 1;return srNum(b,'nl')}
 if(l=='eo'){if(!/a$/.test(w))return null;return srNum(w.slice(0,-1),'eo')}
 return null}

/* ---------- JAM ---------- */
/* srTime(teks, bahasa) → {h,m,amb} (h 0..24 seperti diucapkan; amb=true bila tanpa am/pm dan h≤12) atau null */
function srTimeMk(h,m,pm,am,noon){if(m<0){m+=60;h-=1}if(m>=60){m-=60;h+=1}if(h<0)h+=24;
 let amb=false;if(pm){if(h<12)h+=12}else if(am){if(h==12)h=0}else if(noon!==undefined){}else amb=h<=12;if(h==24&&m==0)h=0;if(h>24||m>59)return null;return {h,m,amb}}
function srTime(text,l){let t=srLow(srFW(text));if(!t)return null;
 let pm=false,am=false;
 /* am/pm umum */
 const ap=t.match(/(?:^|\s|\d)(a\.?\s?m\.?|p\.?\s?m\.?)(?=$|\s|[.,])/);
 if(ap){if(/^p/.test(ap[1]))pm=true;else am=true;t=t.replace(ap[1],' ').replace(/\s+/g,' ').trim()}
 /* digit: 14:30, 14.30, 14h30, 2:30 */
 let m=t.match(/(\d{1,2})\s*[:.h]\s*(\d{2})(?!\d)/);if(m&&l!='ja'&&l!='zh')return srTimeMk(+m[1],+m[2],pm,am);
 if(m)return srTimeMk(+m[1],+m[2],pm,am);
 if(l=='zh')return srTimeZh(t);
 if(l=='ja')return srTimeJa(t,pm,am);
 if(l=='de'||l=='nl')return srTimeDN(t,l,pm,am);
 if(l=='en')return srTimeEn(t,pm,am);
 if(l=='eo')return srTimeEo(t);
 return null}
function srTimeZh(t){let pm=0,am=0,nz=0;t=t.replace(/\s+/g,'');
 if(/下午|晚上|傍晚|晚间|夜里|夜晚|午后/.test(t))pm=1;else if(/上午|早上|早晨|清晨|凌晨|早间|午前/.test(t))am=1;else if(/中午|正午/.test(t))nz=1;
 t=t.replace(/下午|晚上|傍晚|晚间|夜里|夜晚|午后|上午|早上|早晨|清晨|凌晨|早间|午前|中午|正午|现在|现在是|是|在|大约/g,'');
 if(t=='十二点'||t=='12点'){}
 let m=t.match(/^差(.+?)分(?:钟)?(.+?)[点時时]/);if(m){const mi=srNum(m[1],'zh'),h=srNum(m[2],'zh');if(mi===null||h===null)return null;return srTimeMk(h,-mi,pm,am,nz?1:undefined)}
 m=t.match(/^差一刻(.+?)[点時时]/);if(m){const h=srNum(m[1],'zh');if(h===null)return null;return srTimeMk(h,-15,pm,am)}
 m=t.match(/^(.+?)[点點時时](.*)$/);if(!m)return null;const h=srNum(m[1],'zh');if(h===null)return null;let r=m[2].replace(/^(过|过了)/,'').replace(/(钟|整|正)$/,'').replace(/分$/,''),mi;
 if(r=='')mi=0;else if(r=='半')mi=30;else if(r=='一刻')mi=15;else if(r=='三刻')mi=45;else{mi=srNum(r,'zh');if(mi===null)return null}
 if(nz&&h<=6&&!pm)return srTimeMk(h+12,mi,0,0);
 return srTimeMk(h,mi,pm,am,nz?1:undefined)}
function srTimeJa(t,pm,am){t=t.replace(/\s+/g,'');
 if(/午後|ごご/.test(t))pm=true;else if(/午前|ごぜん/.test(t))am=true;t=t.replace(/午後|ごご|午前|ごぜん|いま|今|です/g,'');
 if(/^(正午|しょうご)$/.test(t))return {h:12,m:0,amb:false};
 let sub=0;const mae=t.match(/^(.+?)(?:分前|ふんまえ|ぷんまえ|ぶんまえ)$/);let tt=t;
 let hm=t.match(/^(.+?)(?:時|じ(?![ゅっ]))(.*)$/);if(!hm)return null;const h=srNum(hm[1],'ja');if(h===null)return null;let r=hm[2];
 if(r==''||/^(ちょうど|丁度)$/.test(r))return srTimeMk(h,0,pm,am);
 if(/^(半|はん)$/.test(r))return srTimeMk(h,30,pm,am);
 let neg=1;if(/(分前|ふんまえ|ぷんまえ|ぶんまえ|まえ|前)$/.test(r)){neg=-1;r=r.replace(/(分前|ふんまえ|ぷんまえ|ぶんまえ|まえ|前)$/,'')}
 r=r.replace(/(過ぎ|すぎ)$/,'').replace(/(分|ふん|ぷん|ぶん)$/,'');
 if(r==''){return null}
 const mi=srNum(r,'ja');if(mi===null)return null;return srTimeMk(h,neg*mi,pm,am)}
/* de & nl: halb, Viertel/kwart, nach/vor/over/voor */
function srTimeDN(t,l,pm,am){
 const de=l=='de';t=srAsc(t.replace(/ß/g,'ss')).replace(/[,]/g,' ').replace(/-/g,' ');
 if(!de)t=t.replace(/['’]s\s*(?=ochtends|middags|avonds|nachts)/g,'');
 const per=de?{am:/\b(morgens|vormittags|fruh|frueh|nachts)\b/,pm:/\b(nachmittags|abends|mittags)\b/}:{am:/\b(ochtends|ochtend|nachts)\b/,pm:/\b(middags|avonds|avond)\b/};
 if(per.pm.test(t))pm=true;else if(per.am.test(t))am=true;
 t=t.replace(per.am,' ').replace(per.pm,' ').replace(de?/\b(es ist|ist|um|punkt|genau|ungefahr|gegen|am)\b/g:/\b(het is|is|om|precies|ongeveer|rond)\b/g,' ').replace(/\s+/g,' ').trim();
 if(de&&/\b(mitternacht)\b/.test(t))return {h:0,m:0,amb:false};
 if(!de&&/\b(middernacht)\b/.test(t))return {h:0,m:0,amb:false};
 if(de&&/^mittag$/.test(t)||!de&&/^(twaalf uur middags|middag)$/.test(t))return {h:12,m:0,amb:false};
 const uh=de?'uhr':'uur',hw=de?'halb':'half',vw=de?'viertel':'kwart',nach=de?'nach':'over',vor=de?'vor':'voor';
 const N=x=>{x=x.replace(/\bminuten?\b|\bminuut\b/g,' ').trim();return x?srNum(x,l):null};
 let m;
 /* "<offset> nach|vor [halb] <stunde>" */
 m=t.match(new RegExp('^(.*?)\\s*\\b('+nach+'|'+vor+')\\s+(?:('+hw+')\\s+)?(.+?)(?:\\s+'+uh+')?$'));
 if(m){let off;const o=m[1].trim();if(o==vw||o==('een '+vw)||o=='ein '+vw||o=='einviertel'||o=='ein viertel')off=15;else if(o==('drie '+vw)||o=='dreiviertel'||o=='drei viertel')off=45;else if(o==''){return null}else off=N(o);if(off===null||off===undefined)return null;
  const h=srNum(m[4],l);if(h===null)return null;const base=m[3]?(h-1)*60+30:h*60;const tot=base+(m[2]==nach?off:-off);let hh=Math.floor(tot/60),mm=tot-hh*60;return srTimeMk(hh,mm,pm,am)}
 /* "halb drei" */
 m=t.match(new RegExp('^'+hw+'\\s+(.+?)(?:\\s+'+uh+')?$'));if(m){const h=srNum(m[1],l);if(h===null)return null;return srTimeMk(h-1,30,pm,am)}
 m=t.match(/^(?:dreiviertel|drei viertel|driekwart)\s+(.+?)(?:\s+uhr)?$/);if(m){const h=srNum(m[1],l);if(h===null)return null;return srTimeMk(h-1,45,pm,am)}
 m=t.match(new RegExp('^'+vw+'\\s+(.+?)$'));if(m&&de){const h=srNum(m[1].replace(/\s*uhr$/,''),l);if(h===null)return null;return srTimeMk(h-1,15,pm,am)}
 /* "<jam> Uhr [menit]" */
 m=t.match(new RegExp('^(.+?)\\s*'+uh+'\\s*(.*)$'));if(m){const h=srNum(m[1],l);if(h===null)return null;const mi=m[2].trim()?N(m[2]):0;if(mi===null)return null;return srTimeMk(h,mi,pm,am)}
 const h=srNum(t,l);if(h!==null&&h>=0&&h<=24)return srTimeMk(h,0,pm,am);return null}
function srTimeEn(t,pm,am){t=t.replace(/[,]/g,' ').replace(/-/g,' ');
 if(/\b(afternoon|evening)\b|\bat night\b|\btonight\b/.test(t))pm=true;else if(/\bmorning\b/.test(t))am=true;
 t=t.replace(/\bat night\b/g,' ');
 t=t.replace(/\b(it's|it is|its|at|exactly|about|around|sharp|on the dot|the)\b/g,' ').replace(/\s+/g,' ').trim();
 t=t.replace(/\b(in )?(the )?(morning|afternoon|evening)\b|\bat night\b|\btonight\b|\bin\b/g,' ').replace(/\s+/g,' ').trim();
 if(/^noon$|^midday$/.test(t))return {h:12,m:0,amb:false};if(/^midnight$/.test(t))return {h:0,m:0,amb:false};
 t=t.replace(/\bo['’]?clock\b/g,' ').replace(/\s+/g,' ').trim();
 let m=t.match(/^(?:(a )?(quarter|half)|(.+?))\s+(past|after|to|before|till|of)\s+(.+)$/);
 if(m){let off;if(m[2]=='quarter')off=15;else if(m[2]=='half')off=30;else{off=srNum(m[3].replace(/\bminutes?\b/g,'').trim(),'en');if(off===null)return null}
  const h=srNum(m[5],'en');if(h===null)return null;return srTimeMk(m[4]=='past'||m[4]=='after'?h:h-1,m[4]=='past'||m[4]=='after'?off:60-off,pm,am)}
 m=t.match(/^half\s+(.+)$/);if(m){const h=srNum(m[1],'en');if(h===null)return null;return srTimeMk(h,30,pm,am)}
 m=t.match(/^(.+?)\s+hundred(?:\s+hours)?$/);if(m){const h=srNum(m[1].replace(/^(oh|zero)\s+/,''),'en');if(h!==null&&h<=24)return srTimeMk(h,0,pm,am)}
 const ws=t.split(' ');if(!t)return null;
 for(let i=1;i<=ws.length;i++){const hv=srNum(ws.slice(0,i).join(' '),'en');if(hv===null||hv>24)continue;const rest=ws.slice(i);
  if(!rest.length){return srTimeMk(hv,0,pm,am)}
  let mt=rest.join(' ');let mi;if(/^(oh|o|zero)\s+/.test(mt)){mi=srNum(mt.replace(/^(oh|o|zero)\s+/,''),'en')}else mi=srNum(mt,'en');if(mi===null||mi>59)continue;if(/^(oh|o|zero)\s+/.test(mt)&&mi>9)continue;return srTimeMk(hv,mi,pm,am)}
 return null}
function srTimeEo(t){t=srAsc(t).replace(/-/g,' ').replace(/\b(estas|je|la|horo|horoj|hore)\b/g,' ').replace(/\s+/g,' ').trim();
 if(/^tagmezo$/.test(t))return {h:12,m:0,amb:false};if(/^noktomezo$/.test(t))return {h:0,m:0,amb:false};
 const ordh=x=>{const w=x.trim();if(/^\d+\s*a$/.test(w))return +w.replace(/\D/g,'');return srOrd(w.replace(/\s+/g,' ').replace(/(a)$/,'a'),'eo')};
 let m=t.match(/^(.+?)\s+(antau|post)\s+(.+)$/);
 if(m){let off;const o=m[1].replace(/\bminutoj?\b/g,'').trim();if(o=='kvarono')off=15;else if(o=='duono')off=30;else if(/^tri kvaronoj$/.test(o))off=45;else off=srNum(o,'eo');if(off===null)return null;const h=ordh(m[3]);if(h===null)return null;return srTimeMk(m[2]=='post'?h:h-1,m[2]=='post'?off:60-off,0,0)}
 m=t.match(/^(.+?)\s+kaj\s+(.+)$/);
 if(m){const h=ordh(m[1]);if(h===null)return null;const r=m[2].replace(/\bminutoj?\b/g,'').trim();let mi;if(r=='duono')mi=30;else if(r=='kvarono')mi=15;else if(r=='tri kvaronoj')mi=45;else mi=srNum(r,'eo');if(mi===null)return null;return srTimeMk(h,mi,0,0)}
 const h=ordh(t);if(h!==null)return srTimeMk(h,0,0,0);
 /* kardinal + "horo": "dek kvin horo" tidak umum, tapi terima */
 const n=srNum(t,'eo');if(n!==null&&n<=24)return srTimeMk(n,0,0,0);return null}
/* banding jam: strict24=false → bandingkan mod 12 bila salah satu ambigu */
function srTimeEq(a,b,strict){if(!a||!b)return false;if(a.m!=b.m)return false;if(strict||(!a.amb&&!b.amb))return (a.h%24)==(b.h%24);return a.h%12==b.h%12}

/* ---------- TANGGAL ---------- */
/* srDate → {d,m,y,wd} ; wd ISO: 1=Senin … 7=Minggu ; semua bidang opsional (undefined bila tak disebut) */
const SRMON={
 en:['january','february','march','april','may','june','july','august','september','october','november','december'],
 de:['januar','februar','marz','april','mai','juni','juli','august','september','oktober','november','dezember'],
 nl:['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
 eo:['januaro','februaro','marto','aprilo','majo','junio','julio','augusto','septembro','oktobro','novembro','decembro']};
const SRWD={en:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],de:['montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag'],nl:['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'],eo:['lundo','mardo','merkredo','jaudo','vendredo','sabato','dimanco']};
const SRMONX={de:{janner:1,sonnabend:0},en:{}};
const SRJAD={'ついたち':1,'ふつか':2,'みっか':3,'よっか':4,'いつか':5,'むいか':6,'なのか':7,'ようか':8,'ここのか':9,'とおか':10,'じゅうよっか':14,'はつか':20,'にじゅうよっか':24};
function srYear(s,l){if(!s)return undefined;const d=/^\d{4}$/.test(s.trim())?+s.trim():null;if(d)return d;const n=srNum(s,l);return n!==null&&n>=100&&n<=9999?n:undefined}
function srDate(text,l){let t=srLow(srFW(text));if(!t)return null;const r={};
 /* ISO & numerik */
 let m=t.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);if(m&&(+m[2]<=12)){r.y=+m[1];r.m=+m[2];r.d=+m[3];return srDateWd(r,t,l)}
 if(l=='zh'||l=='ja')return srDateCJ(t,l);
 m=t.match(/(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?(?!\d)/);
 if(m&&!/[a-z]/.test(t.replace(m[0],''))){let a=+m[1],b=+m[2];if(l=='en'){r.m=a;r.d=b}else{r.d=a;r.m=b}if(m[3])r.y=+m[3]<100?2000+ +m[3]:+m[3];if(r.m>12||r.d>31)return null;return r}
 /* bahasa Latin: cari bulan & hari-pekan */
 const MN=SRMON[l],WD=SRWD[l];if(!MN)return null;
 let tt=srAsc(t.replace(/ß/g,'ss')).replace(/[,]/g,' ').replace(/(\d)\.(?=\s|$)/g,'$1 ').replace(/\s+/g,' ').trim();
 const junk=l=='de'?/\b(der|den|dem|am|ist|heute|ten|im)\b/g:l=='nl'?/\b(de|het|is|vandaag|van|op|in)\b/g:l=='en'?/\b(the|of|on|is|today|its|it's)\b/g:/\b(la|de|estas|hodiau|en)\b/g;
 tt=tt.replace(junk,' ').replace(/\s+/g,' ').trim();
 let ws=tt.split(' ').filter(Boolean);
 /* hari pekan */
 for(let i=0;i<ws.length;i++){const k=WD.indexOf(ws[i]);if(k>=0||(l=='de'&&ws[i]=='sonnabend')){r.wd=k>=0?k+1:6;ws.splice(i,1);break}
  if(l=='eo'&&ws[i]=='diman'){}
  if(l=='en'&&/^(mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun)$/.test(ws[i])){r.wd={mon:1,tue:2,tues:2,wed:3,thu:4,thur:4,thurs:4,fri:5,sat:6,sun:7}[ws[i]];ws.splice(i,1);break}}
 let mi=-1;for(let i=0;i<ws.length;i++){let k=MN.indexOf(ws[i]);if(k<0&&l=='de'&&ws[i]=='janner')k=0;if(k<0&&l=='en'&&/^(jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)$/.test(ws[i]))k=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(ws[i].slice(0,3));if(k<0&&l=='en'&&ws[i]=='sept')k=8;if(k>=0){r.m=k+1;mi=i;break}}
 const dayTok=a=>{if(!a.length)return undefined;const j=a.join('');if(/^\d{1,2}(?:st|nd|rd|th|e|de|ste|a|-a)?$/.test(j))return +j.replace(/\D.*$/,'');let n=l=='eo'||l=='de'||l=='nl'||l=='en'?srOrd(j.replace(/\s/g,l=='en'?' ':''),l):null;if(n===null&&l=='en')n=srOrd(a.join(' '),l);if(n===null)n=srNum(a.join(' '),l);return n!==null&&n>=1&&n<=31?n:undefined};
 if(mi>=0){const before=ws.slice(0,mi),after=ws.slice(mi+1);
  let d=dayTok(before);let rest=after;
  if(d===undefined&&after.length){/* "March fifth 2026", "March twenty first", "marto 5" */for(let k=Math.min(l=='en'?2:1,after.length);k>=1;k--){if(/^\d{4}$/.test(after[0]))break;const d2=dayTok(after.slice(0,k));if(d2!==undefined&&(after.length==k||srYear(after.slice(k).join(' '),l)!==undefined)){d=d2;rest=after.slice(k);break}}}
  if(d!==undefined)r.d=d;const y=srYear(rest.join(' '),l);if(y!==undefined)r.y=y;
  /* en: "March 5, 2026" digit-day + year */
  return r}
 /* tanpa bulan: hari (tanggal) saja atau hari-pekan saja */
 if(ws.length){const d=dayTok(ws);if(d!==undefined)r.d=d}
 return (r.d!==undefined||r.wd!==undefined)?r:null}
function srDateWd(r,t,l){return r}
function srDateCJ(t,l){const r={};t=t.replace(/\s+/g,'');
 const WDK={'月':1,'火':2,'水':3,'木':4,'金':5,'土':6,'日':7},WDZ={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'日':7,'天':7,'末':7};
 const WDKN={'げつ':1,'か':2,'すい':3,'もく':4,'きん':5,'ど':6,'にち':7};
 let m;
 if(l=='zh'){m=t.match(/(?:星期|周|週|礼拜|禮拜)([一二三四五六日天])/);if(m){r.wd=WDZ[m[1]];t=t.replace(m[0],'')}}
 else{m=t.match(/([月火水木金土日])曜日?/);if(m){r.wd=WDK[m[1]];t=t.replace(m[0],'')}else{m=t.match(/(げつ|か|すい|もく|きん|ど|にち)ようび/);if(m){r.wd=WDKN[m[1]];t=t.replace(m[0],'')}}}
 t=t.replace(/[,，、]/g,'');
 const dn=(s)=>{if(!s)return undefined;if(l=='ja'&&SRJAD[s]!=null)return SRJAD[s];const n=srNum(s,l);return n!==null&&n>=1&&n<=31?n:undefined};
 m=t.match(/^(?:(.+?)(?:年|ねん))?(?:(.+?)(?:月|がつ))?(.*)$/);if(!m)return null;
 if(m[1]){const y=/^\d+$/.test(m[1])?+m[1]:srNum(m[1],l);if(y!==null&&y>=100)r.y=y}
 if(m[2]){const mo=srNum(m[2],l);if(mo!==null&&mo>=1&&mo<=12)r.m=mo}
 let d=m[3];if(d){if(l=='zh')d=d.replace(/[号號日]$/,'');else{if(SRJAD[d]!=null)r.d=SRJAD[d];else d=d.replace(/(日|にち)$/,'')}
  if(r.d===undefined){const dv=dn(d);if(dv!==undefined)r.d=dv}}
 return (r.d!==undefined||r.m!==undefined||r.y!==undefined||r.wd!==undefined)?r:null}
/* srDateEq(heard, target, ignoreMissing): tiap bidang yang ada di target harus cocok */
function srDateEq(a,b){if(!a||!b)return false;for(const k of ['d','m','y','wd']){if(b[k]!==undefined&&a[k]!==b[k])return false}return true}

/* ---------- Kecocokan fonetik longgar (Esperanto lewat pengenal Italia/Spanyol) ---------- */
function srPhon(s){s=srAsc(String(s||'').toLowerCase().replace(/ĉ/g,'c').replace(/ĝ/g,'g').replace(/ĥ/g,'h').replace(/ĵ/g,'j').replace(/ŝ/g,'s').replace(/ŭ/g,'u')).replace(/[^a-z\s]/g,'').replace(/\s+/g,'');
 s=s.replace(/x/g,'ks').replace(/qu/g,'k').replace(/ck/g,'k').replace(/ts|tz|z|c|q/g,'k').replace(/w/g,'v').replace(/[jy]/g,'i').replace(/h/g,'');
 return s.replace(/(.)\1+/g,'$1')}
function srLev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=[];for(let j=0;j<=n;j++)p[j]=j;for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]==b[j-1]?0:1));p=c}return p[n]}
function srPhonEq(a,b){const x=srPhon(a),y=srPhon(b);if(!x||!y)return false;if(x==y)return true;const L=Math.max(x.length,y.length);return srLev(x,y)<=(L<=4?1:2)}
/* srPhonPick(heard[], kandidat[]) → indeks terbaik atau -1 (jarak terkecil; seri → -1 bila ambigu) */
function srPhonPick(heard,cands){let best=-1,bd=99,tie=false;for(let i=0;i<cands.length;i++){const y=srPhon(cands[i]);let d=99;for(const h of heard){const x=srPhon(h);if(!x||!y)continue;const L=Math.max(x.length,y.length),dd=srLev(x,y);if(dd<=(L<=4?1:2))d=Math.min(d,dd)}
  if(d<bd){bd=d;best=i;tie=false}else if(d==bd&&d<99)tie=true}
 return tie&&bd>0?-1:best}

/* ---------- Penilaian: semua alternatif dicoba ---------- */
/* srJudgeNum(alts[], diharapkan:number, lang) → {ok, got, alt} */
function srJudgeNum(alts,exp,l,o){o=o||{};for(const a of alts||[]){let g=o.digits?srDigits(a,l):srNum(a,l);if(o.digits){if(g==String(exp))return {ok:true,got:g,alt:a};continue}
  if(g!==null&&Math.abs(g-exp)<1e-9)return {ok:true,got:g,alt:a}}
 /* eo lewat pengenal Italia: coba kecocokan fonetik terhadap bentuk tertulis */
 if(l=='eo'&&o.eoWords){const pk=srPhonPick(alts||[],o.eoWords);if(pk>=0)return {ok:true,got:exp,alt:alts[0],phon:true}}
 const g0=(alts&&alts.length)?(o.digits?srDigits(alts[0],l):srNum(alts[0],l)):null;return {ok:false,got:g0,alt:(alts||[])[0]}}
function srJudgeTime(alts,exp,l,strict){for(const a of alts||[]){const g=srTime(a,l);if(g&&srTimeEq(g,exp,strict))return {ok:true,got:g,alt:a}}return {ok:false,got:alts&&alts.length?srTime(alts[0],l):null,alt:(alts||[])[0]}}
function srJudgeDate(alts,exp,l){for(const a of alts||[]){const g=srDate(a,l);if(g&&srDateEq(g,exp))return {ok:true,got:g,alt:a}}return {ok:false,got:alts&&alts.length?srDate(alts[0],l):null,alt:(alts||[])[0]}}
/* ketik: sama seperti ucapan — teks diperlakukan sebagai alternatif tunggal */
function srFmtTime(t){return t?String(t.h).padStart(2,'0')+':'+String(t.m).padStart(2,'0'):'—'}

/* ---------- Pengaturan suara (layar kecil di hub) ---------- */
let srOpenF=0;function srIsOpen(){return !!srOpenF}
let srTest={st:'',msg:'',heard:''};
function srSet(k,v){S.o[k]=v}
function srSettingsView(){const sup=srSupported(),eo=srEoMode(),auto=S.o.srAuto!==0;
 const opt=(v,t)=>`<button class="chip${eo==v?' on':''}" data-a=ggxsr data-v=eo data-k=${v}>${t}</button>`;
 return `<div class=gxbar><button class=gxback data-a=ggxsrx aria-label="Kembali">‹ Games</button><b>🎤 Pengaturan suara</b><span></span></div>
 <div class=gxhero><b>${sup?'Pengenal suara tersedia':'Pengenal suara tidak tersedia'}</b><small>${sup?'Dipakai oleh semua game suara. Pengenal browser butuh internet dan izin mikrofon.':'Browser ini belum mendukung. Semua game suara otomatis memakai mode ⌨ Ketik jawaban.'}</small></div>
 <div class=gxcard style="display:block"><b>Uji mikrofon</b><p><small>Ucapkan "satu dua tiga" dalam bahasa yang dipilih.</small></p>
 <div class=gxtools>${['zh','ja','de','nl','en','eo'].map(l=>`<button class=chip data-a=ggxsr data-v=test data-k=${l}${sup?'':' disabled'}>🎤 ${l.toUpperCase()}</button>`).join('')}</div>
 ${srTest.st?`<p><small>${esc(srTest.msg)}</small></p>`:''}${srTest.heard?`<p><b>Terdengar:</b> ${esc(srTest.heard)}</p>`:''}</div>
 <div class=gxcard style="display:block"><b>Esperanto</b><p><small>Chrome belum punya model Esperanto di semua perangkat. “Otomatis” mencoba eo lebih dulu, lalu pengenal Italia dengan pencocokan fonetik.</small></p>
 <div class=gxtools>${opt('auto','Otomatis')}${opt('it','Italia (it)')}${opt('es','Spanyol (es)')}${opt('off','Matikan')}</div></div>
 <div class=gxcard style="display:block"><b>Kirim otomatis</b><p><small>Jawaban langsung dinilai setelah kamu selesai bicara.</small></p>
 <div class=gxtools><button class="chip${auto?' on':''}" data-a=ggxsr data-v=auto data-k=1>Nyala</button><button class="chip${auto?'':' on'}" data-a=ggxsr data-v=auto data-k=0>Mati (konfirmasi dulu)</button></div></div>`}
/* srAct(a,x,k) → true bila ditangani (render ulang oleh pemanggil) */
function srAct(a,x,k){if(a=='ggxsrx'){srStop();srTest={st:'',msg:'',heard:''};srOpenF=0;return true}
 if(a=='ggxsro'){srOpenF=1;return true}
 if(a!='ggxsr')return false;
 if(x=='eo'){S.o.srEo=k;srEoFell=false}
 else if(x=='auto'){S.o.srAuto=+k}
 else if(x=='test'){srTest={st:'on',msg:'Mendengarkan… ucapkan sesuatu.',heard:''};if(typeof render=='function')render();
  srStart({lang:k,onResult:al=>{srTest={st:'ok',msg:'Terdengar dengan baik.',heard:al[0]||''};if(typeof render=='function')render()},onError:(c,m)=>{srTest={st:'err',msg:m,heard:''};if(typeof render=='function')render()},onEnd:()=>{}});return false}
 return true}

/* ============ Harga (item 5): srPrice / srJudgePrice / srFmtPrice ============
   srPrice(teks,l) → jumlah dalam SEPERRATUS satuan utama (2,50 € → 250; 一块五 → 150; 1.280円 → 128000) atau null.
   Menerima digit & simbol (€ $ £ ¥), kata (zwei Euro fünfzig, two fifty, twee euro vijftig, du eŭroj kvindek),
   serta zh 块/毛/分 (一块五 = 1,50; 三块二毛五 = 3,25) dan ja 円. */
const SRPX={en:{mj:'dollars?|bucks?|euros?|pounds?|quid|yuan',mn:'cents?|pence|pennies|penny'},de:{mj:'euros?|dollars?|franken',mn:'cents?|ct'},nl:{mj:"euro['’]?s?|dollars?|gulden",mn:'cents?|ct'},eo:{mj:'euroj?n?|dolaroj?n?',mn:'cendoj?n?|centimoj?n?'}};
function srPrNum(s,l){s=String(s||'').replace(/[^\p{L}\p{N}.,'\s-]/gu,' ').trim();if(!s)return null;
 if(/^\d+([.,]\d+)?$/.test(s))return parseFloat(s.replace(',','.'));
 return srNum(s,l)}
function srPrSplit(txt,l){const w=String(txt||'').trim().split(/\s+/);if(w.length<2)return null;
 for(let i=1;i<w.length;i++){const a=srPrNum(w.slice(0,i).join(' '),l),b=srPrNum(w.slice(i).join(' '),l);
  if(a!=null&&b!=null&&Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=1&&b<=99)return a*100+b}return null}
function srPriceZh(t){const DG={'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
 t=t.replace(/[¥￥]/g,' \u0001 ').replace(/rmb|cny|人民币|钱|整|共|是/g,' ').replace(/块|元|圆/g,'\u0001').replace(/毛|角/g,'\u0003').replace(/分/g,'\u0004');
 const P=s=>{s=String(s||'').trim();if(!s)return null;if(/^\d+(\.\d+)?$/.test(s))return +s;return srNum(s,'zh')};
 const it=[],re=/([^\u0001-\u0004]*)([\u0001-\u0004]|$)/g;let m;while((m=re.exec(t))){if(!m[0])break;it.push([m[1].trim(),m[2]]);if(!m[2])break}
 if(!it.length)return null;
 if(it.length==2&&it[0][0]==''&&it[0][1]=='\u0001'&&!it[1][1]){const a=P(it[1][0]);return a==null?null:Math.round(a*100)}
 let y=null,j=null,f=null,any=false;
 for(const [n,k] of it){
  if(k=='\u0001'){const a=P(n);if(a==null)return null;y=a;any=true}
  else if(k=='\u0003'){const a=P(n);if(a==null)return null;j=a;any=true}
  else if(k=='\u0004'){const a=P(n.replace(/^零/,''));if(a==null)return null;f=a;any=true}
  else if(n){const ch=[...n];
   if(y==null&&j==null&&f==null){const a=P(n);if(a==null)return null;y=a;any=true}
   else if(y!=null&&j==null&&f==null){
    if(ch[0]=='零'&&ch.length>1){const a=P(n.slice(1));if(a==null)return null;f=a}
    else if(ch.every(c=>c in DG||/\d/.test(c))&&ch.length<=2){const d=ch.map(c=>c in DG?DG[c]:+c);j=d[0];if(d.length>1)f=d[1]}
    else{const a=P(n);if(a==null)return null;j=a}}
   else if(j!=null&&f==null){const a=P(n);if(a==null)return null;f=a}
   else return null}}
 if(!any)return null;return Math.round((y||0)*100)+(j||0)*10+(f||0)}
function srPriceJa(t){t=t.replace(/[¥￥]/g,' ').replace(/円|えん|エン|yen|です|税込み?|税抜き?|ぜいこみ/g,' ').replace(/(\d),(?=\d{3})/g,'$1').trim();
 const n=/^\d+(\.\d+)?$/.test(t)?+t:srNum(t,'ja');return n==null?null:Math.round(n*100)}
function srPrice(t,l){t=String(t||'').toLowerCase().replace(/ŭ/g,'u').replace(/\u00a0/g,' ');if(l=='zh')return srPriceZh(t);if(l=='ja')return srPriceJa(t);
 const R=SRPX[l];if(!R)return null;
 t=(l=='de'||l=='nl')?t.replace(/(\d)\.(?=\d{3}(\D|$))/g,'$1'):t.replace(/(\d),(?=\d{3}(\D|$))/g,'$1');
 t=t.replace(/(\d)\s*p(?![a-z])/g,'$1 \u0002 ').replace(/[€$£¥]/g,' \u0001 ');
 t=t.replace(new RegExp('(?<![a-z])(?:'+R.mj+')(?![a-z])','g'),' \u0001 ').replace(new RegExp('(?<![a-z])(?:'+R.mn+')(?![a-z])','g'),' \u0002 ');
 t=t.replace(/(?<![a-z])(?:and|und|en|kaj|plus)(?![a-z])/g,' ').replace(/(?<![a-z])a\s+(?=\u0001)/g,'one ').replace(/\s+/g,' ');
 const mk=(t.match(/[\u0001\u0002]/g)||[]).map(c=>c=='\u0001'?'J':'N').join(''),sg=t.split(/[\u0001\u0002]/).map(x=>x.trim());
 const P=s=>srPrNum(s,l);
 if(!mk){const n=P(sg[0]);if(n!=null)return Math.round(n*100);return srPrSplit(sg[0],l)}
 if(mk=='J'){if(sg[0]){const a=P(sg[0]);if(a==null)return null;if(!sg[1])return Math.round(a*100);const b=P(sg[1]);return b!=null&&Number.isInteger(b)&&b>=0&&b<=99?Math.round(a*100)+b:null}
  const a=P(sg[1]);if(a!=null)return Math.round(a*100);return srPrSplit(sg[1],l)}
 if(mk=='N'){const n=P(sg[0]);return n==null?null:Math.round(n)}
 if(mk=='JN'||mk=='JJ'&&false){const a=P(sg[0]),b=P(sg[1]);if(a==null||b==null||b>99)return null;return Math.round(a*100)+Math.round(b)}
 return null}
function srFmtPrice(v,l){if(v==null)return '—';return l=='ja'?(v%100?(v/100).toFixed(2):String(v/100)):(v/100).toFixed(2)}
function srJudgePrice(alts,v,l,o){o=o||{};for(const a of alts||[]){const p=srPrice(a,l);if(p===v)return{ok:true,got:srFmtPrice(p,l),alt:a}}
 if(l=='eo'&&o.eoWords&&typeof srPhonPick=='function'&&srPhonPick(alts||[],o.eoWords)>=0)return{ok:true,got:srFmtPrice(v,l),alt:(alts||[])[0]};
 let g=null;for(const a of alts||[]){const p=srPrice(a,l);if(p!=null){g=srFmtPrice(p,l);break}}return{ok:false,got:g}}

/* ---- Shadowing (7.76): kemiripan ucapan terhadap kalimat target ---- */
const SRCJK=l=>l=='zh'||l=='ja';
function srShNorm(s,l){s=String(s==null?'':s).normalize('NFKC').toLowerCase().replace(/ß/g,'ss');
 if(l=='ja')s=s.replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
 if(SRCJK(l))return s.replace(/[\s\p{P}\p{S}]/gu,'');
 return s.replace(/[’‘`´]/g,"'").replace(/'/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
function srShUnits(s,l){const n=srShNorm(s,l);if(!n)return[];if(SRCJK(l))return Array.from(n);return n.split(' ').map(w=>l=='eo'?(srPhon(w)||w):w)}
function srShEq(a,b,l){if(a===b)return 1;if(SRCJK(l))return 0;const m=Math.max(a.length,b.length);if(m<4)return 0;return srLev(a,b)<=(m<=6?1:2)?.5:0}
function srShDist(A,B,l){const m=A.length,n=B.length;let p=[];for(let j=0;j<=n;j++)p[j]=j;
 for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++){const e=srShEq(A[i-1],B[j-1],l);c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(e==1?0:e?.5:1))}p=c}return p[n]}
function srSim(a,b,l){const A=srShUnits(a,l),B=srShUnits(b,l);if(!A.length||!B.length)return 0;
 const w=1-srShDist(A,B,l)/Math.max(A.length,B.length);
 if(SRCJK(l))return Math.max(0,Math.round(w*100));
 const x=A.join(''),y=B.join(''),c=1-srLev(x,y)/Math.max(x.length,y.length);
 return Math.max(0,Math.round((w*.55+c*.45)*100))}
/* selisih: bagian target dengan status s: 1 cocok, 0 terlewat/salah, 2 tanda baca; extra = kata terdengar yang tidak ada di target */
function srDiff(target,heard,l){target=String(target||'');const cj=SRCJK(l);
 const toks=cj?Array.from(target):target.split(/\s+/).filter(Boolean);
 const nu=toks.map(t=>{const u=srShUnits(t,l);return cj?(u[0]||''):(u.join('')||'')});
 const H=srShUnits(heard,l),m=toks.length,n=H.length;
 const D=[];for(let i=0;i<=m;i++){D[i]=new Array(n+1).fill(0)}
 const eq=(i,j)=>nu[i]&&srShEq(nu[i],H[j],l);
 for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)D[i][j]=eq(i,j)?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
 const parts=[],used=new Set();let i=0,j=0;
 while(i<m){if(!nu[i]){parts.push({t:toks[i],s:2});i++;continue}
  if(j<n&&eq(i,j)&&D[i][j]==D[i+1][j+1]+1){parts.push({t:toks[i],s:1});used.add(j);i++;j++}
  else if(j<n&&D[i][j+1]>=D[i+1][j]&&D[i][j]==D[i][j+1]){j++}
  else{parts.push({t:toks[i],s:0});i++}}
 const extra=H.filter((_,k)=>!used.has(k));return{parts,extra,cj}}
function srJudgeSim(alts,target,l,thr){thr=thr||80;let best={sim:0,alt:''};for(const a of alts||[]){const s=srSim(target,a,l);if(s>best.sim)best={sim:s,alt:a}}
 return{ok:best.sim>=thr,got:{sim:best.sim,alt:best.alt,thr},alt:best.alt}}
