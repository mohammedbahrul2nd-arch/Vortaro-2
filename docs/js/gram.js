/* =============================================================================================
   gram.js — v7.4  Penghubung kartu ⇄ Pustaka yang lebih akurat
   1. TAG dari AI (grammar & bentuk kata kerja) — dikonfirmasi dengan mencocokkan potongan teks ke kalimat
   2. Kata kerja/kata sifat Jepang: konjugator berlabel (て・た・意向・使役・受身 …) dari kosakata kartu
   3. Grammar Jepang: pola dengan slot (V-て + …) diverifikasi lewat bentuk kata kerja; partikel 1 huruf tidak
      lagi menandai semua kalimat
   4. Grammar Mandarin: hanzi + pinyin (suku kata) + kata kunci Indonesia
   5. Grammar Jerman/Belanda: deteksi fitur struktural (Perfekt, Präteritum, Passiv, Futur, Konjunktiv II,
      trennbar, zu-Infinitiv, Nebensatz, …) memakai bentuk kata kerja dari kartu verbmu
   6. 5 contoh dari Pustaka saat kartu dibuka
   ============================================================================================= */
const GM_VER='7.4.0',GM_AT='2026-10-28T06:20:00+07:00';
const gmB={n:0};
const gmNorm=s=>String(s||'').toLowerCase().normalize('NFC').replace(/[〜～~\s()（）「」『』\[\]【】\/／・…*+,，、.。:：;；!！?？"'’`\-–—]/g,'');
const gmHan=ch=>/[\u3400-\u9fff]/.test(ch);

/* ---------- 1. TAG dari AI ---------- */
const GM_TAGHEAD=/^\s*(?:={2,}\s*)?(?:TAG|TAGS)(?:\s+(?:GRAMMAR|TATA\s*BAHASA))?(?:\s*(?:&|DAN|\+|\/)\s*(?:KATA\s*KERJA|VERB|BENTUK(?:\s+KATA)?))?\s*(?:={2,})?\s*:?\s*$/i;
function gmSplitTag(t){const lines=String(t).split('\n');const i=lines.findIndex(l=>GM_TAGHEAD.test(l.trim()));if(i<0)return{body:t,tag:''};
 let j=lines.length;for(let k=i+1;k<lines.length;k++){const l=lines[k];if(libHead(l)||/^\s*(?:daftar\s+)?(?:kartu\s+)?pembentuk\b[^\n]{0,45}$/i.test(l)){j=k;break}}
 return{body:lines.slice(0,i).concat(lines.slice(j)).join('\n'),tag:lines.slice(i+1,j).join('\n')}}
const GM_IDRES=[LIBID,LIBIDP,LIBID1,LIBID1P];
function gmItems(ln){const r=[];for(const it of ln.split(/\s*[;；|｜]\s*/)){const m=it.trim().match(/^(G\d*|V|K)\s*[:：=]\s*(.+)$/i);if(m)r.push({c:m[1].toUpperCase(),v:m[2].trim()})}return r}
function gmTagLines(tag){const out=[],leg={};
 for(let ln of String(tag).split('\n')){ln=ln.trim();if(!ln)continue;
  const m=ln.match(/^(G\d+)\s*[=：:]\s*(.+)$/i);if(m&&!/^[\[【(（]/.test(ln)){leg[m[1].toUpperCase()]=m[2].trim();continue}
  let key='';for(const re of GM_IDRES){const mm=ln.match(re);if(mm){key=(re===LIBID||re===LIBIDP)?mm[1]+'.'+mm[2]:mm[1];ln=ln.slice(mm[0].length);break}}
  if(key)out.push({key,items:gmItems(ln)})}
 return{leg,lines:out}}
/* judul kartu grammar -> kunci kartu */
const GMTK={};
const gmLvN=s=>String(s||'').replace(/\s+/g,'').toUpperCase();
function gmTitleMap(L){if(GMTK[L])return GMTK[L];const m=new Map(),add=(t,k)=>{t=gmNorm(t);if(!t)return;if(!m.has(t))m.set(t,[]);if(!m.get(t).includes(k))m.get(t).push(k)};
 for(const g of D.G){if(g[1]!=L)continue;const t=String(g[4]||'');add(t,g[0]);add(t.replace(/[（(][^)）]*[)）]/g,''),g[0]);for(const a of t.split(/\s*[\/／]\s*/))add(a.replace(/[（(][^)）]*[)）]/g,''),g[0])}
 return GMTK[L]=m}
function gmTitleKeys(title,L,lv){let t=String(title||'').trim(),lvm=t.match(/\s*[(\[（·]\s*(N[1-5]|HSK\s*\d|[ABC][12])\s*[)\]）]?\s*$/i);
 if(lvm){lv=lv||lvm[1];t=t.slice(0,lvm.index)}
 const m=gmTitleMap(L),n=gmNorm(t);if(!n)return[];let c=m.get(n)||[];
 if(!c.length){const alt=gmNorm(t.replace(/[（(][^)）]*[)）]/g,''));c=m.get(alt)||[]}
 if(!c.length&&n.length>=3){for(const [k,v] of m)if(k.startsWith(n)||(k.length>=4&&n.startsWith(k))){c=v;break}}
 if(lv&&c.length>1){const f=c.filter(k=>gmLvN(GK[k][2])==gmLvN(lv));if(f.length)c=f}
 return c.slice(0,3)}
/* lemma -> kunci kartu kosakata */
const GMWM={};
function gmWordMap(L){if(GMWM[L])return GMWM[L];const m=new Map();
 for(const c of D.C){const es=c[3][L];if(!es)continue;for(const e of es){let w=libLow(libC1(e[0])).replace(/^(?:der|die|das|de|het|sich|zich)\s+/,'');if(L=='ja'||L=='zh')w=w.replace(/\s+/g,'');if(!w)continue;const k=ik(c[0],L);if(!m.has(w))m.set(w,[]);if(!m.get(w).includes(k))m.get(w).push(k)}}
 return GMWM[L]=m}
const gmWordKey=(w,L)=>{w=libLow(libC1(w)).replace(/^(?:der|die|das|de|het|sich|zich)\s+/,'');if(L=='ja'||L=='zh')w=w.replace(/\s+/g,'');return(gmWordMap(L).get(w)||[])[0]||''};
/* potongan teks harus muncul di kalimat */
function gmSurfOk(f,s,L){s=String(s||'').trim();if(!s)return true;
 const parts=s.split(/\s*(?:…|\.{3}|⋯)\s*/).filter(Boolean);
 if(L=='ja'||L=='zh'){const t=String(f).replace(/\s+/g,'');let p=0;for(const x of parts){const q=x.replace(/\s+/g,'');const i=t.indexOf(q,p);if(i<0)return false;p=i+q.length}return true}
 const t=' '+libTok(f,L).join(' ')+' ';let p=0;for(const x of parts){const q=' '+libTok(x,L).join(' ')+' ';const i=t.indexOf(q,p);if(i<0)return false;p=i+q.length-1}return true}
/* keluarkan tag per kalimat: kembalikan {map:{key:[tag]},drop,unres} */
function gmResolveTags(tag,L,sentOf){const P=gmTagLines(tag),map={};let drop=0,unres=0,n=0;
 for(const ln of P.lines){const f=sentOf(ln.key);if(f==null)continue;
  for(const it of ln.items){
   if(it.c=='V'||it.c=='K'){const sp=it.v.split(/\s*(?:>|→|->|=>|＞)\s*/);let lem=sp[0].trim(),s=(sp[1]||sp[0]).trim(),fm='';
    const fmm=s.match(/\s*[（(]([^()（）]+)[)）]\s*$/);if(fmm){fm=fmm[1].trim();s=s.slice(0,fmm.index).trim()}
    if(!fm&&sp[2])fm=sp[2].trim();
    if(!gmSurfOk(f,s,L)){drop++;continue}
    (map[ln.key]=map[ln.key]||[]).push({t:'v',k:gmWordKey(lem,L),n:lem,s,f:fm});n++;continue}
   let title='',s='',keys=[];
   if(/^G\d+$/.test(it.c)){title=P.leg[it.c]||'';s=it.v;keys=title?gmTitleKeys(title,L):[]}
   else{const mm=it.v.match(/^(.*?)\s*(?:＝|=)\s*(.+)$/);if(mm){title=mm[1].trim();s=mm[2].trim()}else{title=it.v;s=''}keys=gmTitleKeys(title,L)}
   s=s.replace(/\s*[（(][^()（）]*[)）]\s*$/,'').trim();
   if(!gmSurfOk(f,s,L)){drop++;continue}
   if(!keys.length){unres++;(map[ln.key]=map[ln.key]||[]).push({t:'g',k:'',n:title||it.v,s});continue}
   keys.forEach(k=>{(map[ln.key]=map[ln.key]||[]).push({t:'g',k,n:GK[k][4],s});n++})}}
 return{map,drop,unres,n}}
/* pasang ke hasil parser (ps atau sents) */
function gmApplyTags(r,tag,L){if(!tag||!tag.trim())return;let res;
 if(r.sents){const idx=new Map();r.sents.forEach((s,i)=>{if(s.n)idx.set(String(s.n),i)});
  res=gmResolveTags(tag,L,key=>idx.has(key)?r.sents[idx.get(key)].f:null);
  for(const k in res.map)r.sents[idx.get(k)].tg=res.map[k]}
 else if(r.ps){const idx=new Map();r.ps.forEach((p,pi)=>(p.ks||[]).forEach((k,si)=>{if(k&&!idx.has(k))idx.set(k,[pi,si])}));
  res=gmResolveTags(tag,L,key=>idx.has(key)?r.ps[idx.get(key)[0]].f[idx.get(key)[1]]:null);
  for(const k in res.map){const [pi,si]=idx.get(k),p=r.ps[pi];if(!p.tg)p.tg=p.f.map(()=>0);p.tg[si]=res.map[k]}}
 r.warn=r.warn||[];
 if(res.n)r.tagN=res.n;
 if(res.drop)r.warn.push(res.drop+' tag dibuang karena potongan teksnya tidak ada di kalimat (kemungkinan salah ketik/halusinasi AI).');
 if(res.unres)r.warn.push(res.unres+' tag grammar tidak cocok dengan kartu mana pun (tetap disimpan sebagai catatan).');
 if(!res.n&&!res.unres&&!res.drop)r.warn.push('Blok TAG ditemukan tetapi tidak ada baris bernomor yang cocok.')}

/* ---------- 2. Jepang: konjugator berlabel dari kosakata kartu ---------- */
const GMJR={'う':['わ','い','う','え','お'],'く':['か','き','く','け','こ'],'ぐ':['が','ぎ','ぐ','げ','ご'],'す':['さ','し','す','せ','そ'],'つ':['た','ち','つ','て','と'],'ぬ':['な','に','ぬ','ね','の'],'ぶ':['ば','び','ぶ','べ','ぼ'],'む':['ま','み','む','め','も'],'る':['ら','り','る','れ','ろ']};
/* kata kerja ~る golongan 1 (godan) yang berbentuk seperti golongan 2 */
const GMJ_GK=['帰る','返る','入る','走る','切る','知る','要る','限る','減る','蹴る','参る','喋る','滑る','握る','散る','焦る','湿る','捻る','練る','照る','陥る','遮る','罵る','翻る','覆る','嘲る','煎る','炒る','混じる','交じる','弄る','蘇る','甦る'];
const GMJ_GKANA=new Set(['はいる','はしる','しる','かぎる','へる','ける','まいる','しゃべる','すべる','にぎる','ちる','あせる']);
const GMJ_BOTH=new Set(['かえる','きる']);
const GMJF={dict:'辞書形',masu:'ます形',stem:'連用形',nai:'ない形',naistem:'ず形',te:'て形',ta:'た形',tari:'たり形',tara:'たら形',ba:'ば形',ou:'意向形',imp:'命令形',tai:'たい形',pot:'可能形',pass:'受身形',caus:'使役形',cpass:'使役受身形',Ai:'い形容詞',ku:'〜く',kunai:'〜くない',katta:'〜かった',kute:'〜くて',kereba:'〜ければ',sa:'〜さ',sou:'〜そう',Ana:'な形容詞',na:'〜な',ni:'〜に',de:'〜で',da:'〜だ/じゃない'};
const GMJFI={dict:'bentuk kamus',masu:'sopan (〜ます)',stem:'akar-ます',nai:'negatif',naistem:'akar-ない/ず',te:'bentuk-te',ta:'lampau',tari:'〜たり',tara:'〜たら (jika)',ba:'jika (〜ば)',ou:'ajakan/niat (〜よう)',imp:'perintah',tai:'ingin (〜たい)',pot:'potensial (bisa)',pass:'pasif',caus:'kausatif (menyuruh)',cpass:'kausatif-pasif',sa:'kata benda (〜さ)',sou:'tampaknya (〜そう)'};
const gmFormName=f=>String(f).split('+').map(x=>GMJF[x]||x).join(' + ');
const gmFormId=f=>String(f).split('+').map(x=>GMJFI[x]).filter(Boolean).join(' + ');
function gmJaCls(base,kana){
 if(/する$/.test(base)||/為る$/.test(base))return['suru'];
 if(/(?:来る|^くる|[てで]くる)$/.test(base))return['kuru'];
 const last=base.slice(-1);if(last!='る')return GMJR[last]?['godan']:[];
 if(GMJ_GK.some(w=>base.endsWith(w)))return['godan'];
 const kn=/^[ぁ-ゟー]+$/.test(base)?base:(kana||'');
 if(GMJ_BOTH.has(base)||GMJ_BOTH.has(kn))return['ichi','godan'];
 if(GMJ_GKANA.has(base)||(!/[㐀-鿿]/.test(base)&&GMJ_GKANA.has(kn)))return['godan'];
 const pen=(kn||base).slice(-2,-1);
 if(/[㐀-鿿]/.test(base)&&!kn){return base.length==2&&'見着居出寝似煮得経干射'.includes(base[0])?['ichi']:['godan','ichi']}
 return 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ'.includes(pen)?['ichi']:['godan']}
function gmIchi(base){const S=base.slice(0,-1);return{dict:[base],masu:[S+'ます',S+'ません',S+'ました',S+'ませんでした',S+'ましょう'],stem:[S],nai:[S+'ない',S+'なかった',S+'なく',S+'なくて',S+'なければ',S+'ないで'],naistem:[S],te:[S+'て'],ta:[S+'た'],tari:[S+'たり'],tara:[S+'たら'],ba:[S+'れば'],ou:[S+'よう'],imp:[S+'ろ',S+'よ'],tai:[S+'たい',S+'たかった',S+'たくない',S+'たく']}}
function gmGodan(base){const last=base.slice(-1),S=base.slice(0,-1),r=GMJR[last];if(!r)return null;const[a,i,u,e,o]=r;
 let te,ta;if('うつる'.includes(last)){te='って';ta='った'}else if('ぬぶむ'.includes(last)){te='んで';ta='んだ'}else if(last=='く'){te='いて';ta='いた'}else if(last=='ぐ'){te='いで';ta='いだ'}else{te='して';ta='した'}
 if(/(?:行く|いく)$/.test(base)){te='って';ta='った'}
 return{dict:[base],masu:[S+i+'ます',S+i+'ません',S+i+'ました',S+i+'ませんでした',S+i+'ましょう'],stem:[S+i],nai:[S+a+'ない',S+a+'なかった',S+a+'なく',S+a+'なくて',S+a+'なければ',S+a+'ないで'],naistem:[S+a],te:[S+te],ta:[S+ta],tari:[S+ta+'り'],tara:[S+ta+'ら'],ba:[S+e+'ば'],ou:[S+o+'う'],imp:[S+e],tai:[S+i+'たい',S+i+'たかった',S+i+'たくない',S+i+'たく']}}
function gmSuru(base){const P=base.slice(0,-2);return{dict:[base],masu:[P+'します',P+'しません',P+'しました',P+'しませんでした',P+'しましょう'],stem:[P+'し'],nai:[P+'しない',P+'しなかった',P+'しなく',P+'しなくて',P+'しなければ',P+'しないで'],naistem:[P+'せ',P+'し'],te:[P+'して'],ta:[P+'した'],tari:[P+'したり'],tara:[P+'したら'],ba:[P+'すれば'],ou:[P+'しよう'],imp:[P+'しろ',P+'せよ'],tai:[P+'したい',P+'したかった',P+'したくない',P+'したく']}}
function gmKuru(base){const P=base.slice(0,-2),kj=/来る$/.test(base),k=kj?'来':'き',ko=kj?'来':'こ',ku=kj?'来':'く';
 return{dict:[base],masu:[P+k+'ます',P+k+'ません',P+k+'ました',P+k+'ませんでした',P+k+'ましょう'],stem:[P+k],nai:[P+ko+'ない',P+ko+'なかった',P+ko+'なく',P+ko+'なくて',P+ko+'なければ',P+ko+'ないで'],naistem:[P+ko],te:[P+k+'て'],ta:[P+k+'た'],tari:[P+k+'たり'],tara:[P+k+'たら'],ba:[P+ku+'れば'],ou:[P+ko+'よう'],imp:[P+(kj?'来い':'こい')],tai:[P+k+'たい',P+k+'たかった',P+k+'たくない',P+k+'たく']}}
function gmDeriv(base,cls){const last=base.slice(-1),S=base.slice(0,-1);
 if(cls=='ichi')return{pot:S+'られる',pass:S+'られる',caus:S+'させる',cpass:S+'させられる'};
 if(cls=='godan'){const r=GMJR[last];if(!r)return{};return{pot:S+r[3]+'る',pass:S+r[0]+'れる',caus:S+r[0]+'せる',cpass:S+r[0]+'せられる'}}
 if(cls=='suru'){const P=base.slice(0,-2);return{pot:P+'できる',pass:P+'される',caus:P+'させる',cpass:P+'させられる'}}
 if(cls=='kuru'){const P=base.slice(0,-2),k=/来る$/.test(base)?'来':'こ';return{pot:P+k+'られる',pass:P+k+'られる',caus:P+k+'させる',cpass:P+k+'させられる'}}
 return{}}
const GMJ={built:0,idx:new Map(),sets:{},lem:new Map()};
function gmJaBuild(){if(GMJ.built)return GMJ;GMJ.built=1;const idx=GMJ.idx,sets=GMJ.sets;
 const addSet=(t,s)=>{(sets[t]||(sets[t]=new Set())).add(s)};
 const addIdx=(s,k,f,lem)=>{if(s.length<2)return;if(!/[㐀-鿿]/.test(s)&&s.length<3)return;let a=idx.get(s);if(!a){a=[];idx.set(s,a)}if(!a.some(x=>x.k==k&&x.f==f))a.push({k,f,lem})};
 const put=(forms,pre,key,lem)=>{for(const t in forms)for(const s of forms[t]){addSet(t,s);addIdx(s,key,pre?pre+'+'+t:t,lem)}};
 for(const c of D.C){const es=c[3].ja;if(!es||!es.length||(c[1]!='V'&&c[1]!='A'))continue;const key=ik(c[0],'ja');
  for(const e of es){for(let alt of String(e[0]).split(/\s*[\/、]\s*/)){alt=alt.replace(/[（(][^)）]*[)）]/g,'').replace(/\s+/g,'').trim();if(!alt||/[～〜~…]/.test(alt))continue;
   (GMJ.lem.get(alt)||GMJ.lem.set(alt,[]).get(alt)).push(key);
   if(c[1]=='A'){gmJaAdj(alt,key,addSet,addIdx);continue}
   const kana=(libRomaji2Kana(e[1]||'')||[])[0]||'';
   for(const cls of gmJaCls(alt,kana)){
    const F=cls=='ichi'?gmIchi(alt):cls=='godan'?gmGodan(alt):cls=='suru'?gmSuru(alt):gmKuru(alt);if(!F)continue;
    put(F,'',key,alt);
    const dv=gmDeriv(alt,cls);for(const d in dv){const I=gmIchi(dv[d]);
     for(const t of['dict','masu','nai','te','ta','ba','tai']){for(const s of I[t]){addSet(t,s);addIdx(s,key,t=='dict'?d:d+'+'+t,alt)}}
     for(const t of['stem','naistem','tari','tara','ou','imp'])for(const s of I[t])addSet(t,s)}}}}}
 return GMJ}
function gmJaAdj(base,key,addSet,addIdx){const naI=['きれい','綺麗','奇麗','嫌い','きらい','大嫌い','だいきらい'];
 const isI=/い$/.test(base)&&!naI.some(x=>base.endsWith(x));
 const add=(t,s,pre)=>{addSet(pre||t,s);addIdx(s,key,t,base)};
 if(isI){let S=base.slice(0,-1);if(base=='いい')S='よ';
  addSet('Ai',base);addSet('Aistem',S);addIdx(base,key,'Ai',base);
  add('ku',S+'く','ku');add('kunai',S+'くない','kunai');add('katta',S+'かった','katta');add('kute',S+'くて','kute');add('kereba',S+'ければ','kereba');add('sa',S+'さ','sa');add('sou',S+'そう','sou');
  addSet('ta',S+'かった');addSet('te',S+'くて');addSet('nai',S+'くない');addSet('ba',S+'ければ')}
 else{addSet('Ana',base);addIdx(base,key,'Ana',base);add('na',base+'な','na');add('ni',base+'に','ni');add('sa',base+'さ','sa');add('da',base+'だった','da');add('da',base+'じゃない','da')}}
/* deteksi bentuk di satu kalimat (pencocokan terpanjang) */
function gmJaScan(s){gmJaBuild();const t=String(s||'').replace(/\s+/g,''),out=[],idx=GMJ.idx;
 for(let i=0;i<t.length;){let hit=null;for(let n=Math.min(14,t.length-i);n>=2;n--){const a=idx.get(t.substr(i,n));if(a){hit={s:t.substr(i,n),i,a};break}}
  if(hit){out.push(hit);i+=hit.s.length}else i++}
 return out}
/* teks sebelum posisi p berakhir dengan bentuk bertipe types? */
function gmJaBefore(flat,p,types){gmJaBuild();for(let k=1;k<=10&&k<=p;k++){const sub=flat.slice(p-k,p);for(const t of types){const st=GMJ.sets[t];if(st&&st.has(sub))return t}}return''}

/* ---------- 3. Spesifikasi & penilaian per kartu grammar ---------- */
/* tingkat: 3 = ditandai AI · 2 = pasti (terverifikasi) · 1 = perkiraan lemah · 0 = tidak cocok */
function gmRec(d,i){d.rc=d.rc||[];let r=d.rc[i];if(r)return r;const f=d.sents[i],flat=String(f).replace(/\s+/g,'');
 r=d.rc[i]={f,flat,r:(d.rs&&d.rs[i])||'',i:(d.is&&d.is[i])||'',tg:(d.tgs&&d.tgs[i])||null,L:d.L,d1:{flat,sents:[f]}};
 if(d.L!='ja'&&d.L!='zh'){const tk=libTok(f,d.L),cnt=new Map();tk.forEach(w=>cnt.set(w,(cnt.get(w)|0)+1));r.tk=tk;r.d1.cnt=cnt;r.d1.sT=[new Set(tk)]}
 return r}
function gmRaw(rec,key){const F=libForms(key);if(!F)return 0;let n=0;for(const a of F.alts)n+=libCount1(rec.d1,a);return n}
const GMS=new Map();
function gmSpec(key){if(GMS.has(key))return GMS.get(key);const g=GK[key];let sp=null;try{sp=g?gmBuild(g,key):null}catch(e){sp=null}GMS.set(key,sp);return sp}
function gmBuild(g,key){const L=g[1];if(L=='ja')return gmJaSpec(g,key);if(L=='zh')return gmZhSpec(g,key);if(L=='de'||L=='nl')return gmEuSpec(g,key);return{L,k:'raw'}}

/* --- Jepang --- */
const GMJ_CATRE=/(副词|短语|谓语|定语|状语|补语|主语|宾语|词语|量词|名词|动词|形容词|结构|类型|后缀|复句|副詞|名詞|動詞|形容詞)/;
const GMJ_PRE=[[/V[-‑ ]?(?:te|て)(?![a-z])/i,'te'],[/V[-‑ ]?tara/i,'tara'],[/V[-‑ ]?(?:ta|た)(?![a-z])/i,'ta'],[/V[-‑ ]?(?:nai|ない)[^+]*(?:buang|stem|akar)/i,'naistem'],[/V[-‑ ]?(?:nai|ない)(?![a-z])/i,'nai'],[/V[-‑ ]?masu[^+]*(?:buang|stem|akar)/i,'stem'],[/V[-‑ ]?(?:renyou|stem)/i,'stem'],[/V[-‑ ]?(?:ba|ば)(?![a-z])/i,'ba'],[/V[-‑ ]?(?:kamus|jisho|dict)/i,'dict'],[/V[-‑ ]?(?:ikou|ou\b|volisi)/i,'ou'],[/V[-‑ ]?(?:sase|kausatif)/i,'caus'],[/V[-‑ ]?(?:rare|pasif)/i,'pass'],[/V[-‑ ]?(?:potensial|kanou)/i,'pot'],[/Sifat[-‑ ]?i[^+]*(?:buang|stem|akar)/i,'Aistem'],[/(?:Sifat|Adj)[-‑ ]?i(?![a-z])/i,'Ai'],[/(?:Sifat|Adj)[-‑ ]?na(?![a-z])/i,'Ana'],[/V[-‑ ]?masu/i,'masu']];
const GMJ_VER=new Set(['te','ta','tara','nai','naistem','stem','ba','dict','ou','caus','pass','pot','Ai','Aistem','Ana','masu']);
const GMJ_GEN={te:/[てで]$/,ta:/[たた]$/,nai:/ない$/,ba:/[ばれ]$/,dict:/[うくぐすつぬぶむる]$/,ou:/[おこそとのほもよろ]う$|よう$/,stem:/[いきぎしじちにびみりえけげせてねべめれ]$/,masu:/ます$/};
const GMJ_FT={'意向形':['ou'],'受身形':['pass'],'られる':['pass','pot'],'させる':['caus','cpass'],'させられる':['cpass'],'可能形':['pot']};
/* kata kerja di ujung pola (と思う, にする, 慣れる …) -> semua bentuk konjugasinya */
function gmJaAlt(a){let m=a.match(/^(.*?)((?:[㐀-鿿][ぁ-ゟ]{0,3})[うくぐすつぬぶむる])$/)||a.match(/^(.*?)(する|いる|ある|なる|くる|おく|みる|いく|しまう|あげる|もらう|くれる|やる)$/);
 if(!m||!m[2]||a.length<2)return null;const pre=m[1],v=m[2],out=new Set();
 for(const cls of gmJaCls(v,'')){const F=cls=='ichi'?gmIchi(v):cls=='godan'?gmGodan(v):cls=='suru'?gmSuru(v):gmKuru(v);if(!F)continue;for(const t in F)for(const x of F[t])if((pre+x).length>=2)out.add(pre+x)}
 return out.size?[...out].sort((x,y)=>y.length-x.length):null}
function gmJaSpec(g,key){const ttl=String(g[4]||'').replace(/^[〜～~\s]+/,'').trim();if(GMJ_FT[ttl])return{L:'ja',k:'jaf',feats:GMJ_FT[ttl]};
 const pat=String(g[6]||''),title=String(g[4]||''),strip=t=>String(t).replace(/\([^)]*\)|（[^）]*）/g,' ');
 const isCat=r=>LIBGCAT.has(r)||/^[぀-ヿ㐀-鿿]{1,3}形$/.test(r)||(r.length>=3&&GMJ_CATRE.test(r));
 let src=pat,runs=libCjkRuns(src).filter(r=>!isCat(r));
 if(!runs.length&&!/[A-Za-z]/.test(strip(title))){src=title;runs=libCjkRuns(src).filter(r=>!isCat(r))}
 if(!runs.length)return{L:'ja',k:'none'};
 const ixo=src.indexOf(runs[0]),before=ixo>0?src.slice(0,ixo):'',seg=before.split(/\s*\+\s*/).filter(x=>x.trim()).pop()||'';
 const ver=[];if(src===pat)for(const [re,t] of GMJ_PRE)if(re.test(seg)&&!ver.includes(t)){ver.push(t);if(t=='te'||t=='ta'||t=='tara')break}
 const free=!ver.length||/Benda|Kalimat|Angka|Waktu|Satuan|Kata Ganti|Akhir|Nama|Pronomina|Bebas|\bN\b|\[|Sifat(?![-‑ ]?(?:i|na)\b)/i.test(seg)||/^\s*$/.test(seg);
 const all=runs.join(''),kanaOnly=!/[㐀-鿿]/.test(all),amb=all.length<=1?2:(all.length<=2&&kanaOnly)||(runs.length>=2&&kanaOnly&&all.length<=3&&runs.every(r=>r.length<=1))?1:0;
 return{L:'ja',k:'ja',a:runs[0],runs,ver,free,amb,alt:gmJaAlt(runs[0])}}
function gmJaPos(flat,sp){const P=[];for(const a of (sp.alt||[sp.a])){let p=flat.indexOf(a);while(p>=0){P.push(p);p=flat.indexOf(a,p+1)}}return P}
function gmJaLv(rec,sp,key){if(sp.k=='none')return 0;
 if(sp.k=='jaf'){const sc=rec.scan||(rec.scan=gmJaScan(rec.flat));return sc.some(h=>h.a.some(x=>sp.feats.includes(String(x.f).split('+')[0])))?2:0}
 const raw=gmRaw(rec,key),flat=rec.flat,P=gmJaPos(flat,sp);if(!raw&&!P.length)return 0;
 if(sp.ver.length&&P.length){let gen=0;for(const p of P){if(gmJaBefore(flat,p,sp.ver))return 2;if(sp.ver.some(t=>GMJ_GEN[t]&&GMJ_GEN[t].test(flat.slice(Math.max(0,p-6),p))))gen=1}
  if(!sp.free)return gen?1:0}
 else if(sp.ver.length&&!sp.free)return 0;
 return sp.amb==0?2:1}

/* --- Mandarin: hanzi + pinyin (suku kata) + kata kunci Indonesia --- */
const GMV_RE='aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
const GMSYL=new RegExp('(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?['+GMV_RE+']+(?:ng(?!['+GMV_RE+'])|n(?!['+GMV_RE+'])|r(?!['+GMV_RE+']))?','g');
function gmSyl(py){const out=[];for(const tk of String(py||'').toLowerCase().normalize('NFC').split(/[^a-zA-Z'üÜ'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+/)){if(!tk)continue;
  for(const part of tk.split("'")){const m=part.match(GMSYL);if(m)m.forEach(x=>out.push(x))}}return out}
const gmSylN=s=>s.replace(/bú/g,'bù').replace(/yí|yì/g,'yī').replace(/v/g,'ü');
function gmZhExpect(g,lit){const exp=new Map();for(const e of g[7]||[]){const ls=String(e).split('\n');if(ls.length<2)continue;
  const han=[...ls[0]].filter(gmHan),syl=gmSyl(ls[1]);if(!han.length||han.length!=syl.length)continue;const flat=han.join('');let p=flat.indexOf(lit);
  while(p>=0){const q=syl.slice(p,p+lit.length).map(gmSylN).join('|');exp.set(q,(exp.get(q)|0)+1);p=flat.indexOf(lit,p+1)}}return exp}
function gmKw(g){const cnt=new Map(),n=[];
 const toks=s=>libTok(s,'id').filter(w=>w.length>=4&&!LIBSWS.id.has(w)&&!LIBGSTOP.has(w));
 const ex=(g[7]||[]).map(e=>{const ls=String(e).split('\n');return ls.length>=3?ls[2]:(String(e).match(/[（(]([^()（）]+)[)）]\s*$/)||[])[1]||(ls.length==2&&!/[\u3400-\u9fff]/.test(ls[1])?ls[1]:'')}).filter(Boolean);
 ex.forEach(t=>new Set(toks(t)).forEach(w=>cnt.set(w,(cnt.get(w)|0)+1)));const need=Math.max(2,Math.ceil(ex.length*.5)),kw=new Set();
 for(const [w,c] of cnt)if(c>=need)kw.add(w);
 const q=[...String(g[5]||'').matchAll(/["“”']([^"“”']{3,20})["“”']/g)].map(m=>m[1]);q.forEach(t=>toks(t).forEach(w=>kw.add(w)));
 return kw}
const GMZ_DEF={'的':'de','地':'de','得':'de','了':'le','着':'zhe','过':'guo','吗':'ma','呢':'ne','吧':'ba','啊':'a','把':'bǎ','被':'bèi','不':'bù','没':'méi','在':'zài','是':'shì','有':'yǒu','很':'hěn','都':'dōu','也':'yě','就':'jiù','还':'hái','才':'cái','又':'yòu','再':'zài','会':'huì','能':'néng','可':'kě','要':'yào','想':'xiǎng','比':'bǐ','跟':'gēn','和':'hé','对':'duì','给':'gěi','让':'ràng','向':'xiàng','从':'cóng','到':'dào','像':'xiàng','最':'zuì','太':'tài','更':'gèng','几':'jǐ','个':'gè'};
function gmZhSpec(g,key){const F=libForms(key);if(!F)return{L:'zh',k:'none'};
 const pat=String(g[6]||''),title=String(g[4]||''),gl=t=>String(t).replace(/\([^)]*\)|（[^）]*）/g,' ');
 const isCat=r=>LIBGCAT.has(r)||(r.length>=3&&GMJ_CATRE.test(r));let runs=libCjkRuns(pat).filter(r=>!isCat(r));if(!runs.length&&!/[A-Za-z]/.test(gl(title)))runs=libCjkRuns(title).filter(r=>!isCat(r));
 const singles=runs.length>=1&&runs.length<=2&&runs.every(r=>r.length==1)&&!/[…⋯]|\.{3}/.test(pat),lits=singles?runs:[];
 const exp=new Map();for(const l of lits){const e=gmZhExpect(g,l);if(!e.size&&GMZ_DEF[l])e.set(GMZ_DEF[l],1);exp.set(l,e)}
 return{L:'zh',k:'zh',lits,lit:lits[0]||'',amb:lits.length?1:0,exp,kw:gmKw(g)}}
function gmZhLv(rec,sp,key){if(!gmRaw(rec,key))return 0;if(!sp.amb)return 2;
 const han=rec.han||(rec.han=[...rec.flat].filter(gmHan)),h=han.join('');let found=0;
 for(const l of sp.lits)if(h.includes(l))found=1;if(!found)return 1;
 if(rec.r){const syl=rec.syl||(rec.syl=gmSyl(rec.r).map(gmSylN));
  if(syl.length&&syl.length==han.length){let any=0;for(const l of sp.lits){const ex=sp.exp.get(l);if(!ex||!ex.size)continue;let p=h.indexOf(l);while(p>=0){any=1;if(ex.has(syl.slice(p,p+l.length).join('|')))return 2;p=h.indexOf(l,p+1)}}if(any)return 0}
  else{const j='|'+syl.join('|')+'|';for(const l of sp.lits){const ex=sp.exp.get(l);if(ex)for(const k of ex.keys())if(j.includes('|'+k+'|'))return 2}}}
 if(sp.kw.size&&rec.i&&libTok(rec.i,'id').some(w=>sp.kw.has(w)))return 2;
 return 1}

/* --- Jerman & Belanda: fitur struktural dari bentuk kata kerja kartumu --- */
const gmW=s=>new Set(s.split(/\s+/));
const GMDE={HAB:gmW('habe hast hat haben habt'),SEI:gmW('bin bist ist sind seid'),WER:gmW('werde wirst wird werden werdet'),WUR:gmW('wurde wurdest wurden wurdet'),WUE:gmW('würde würdest würden würdet'),
 KON:gmW('hätte hättest hätten hättet wäre wärst wären wärt könnte könntest könnten könntet müsste müsstest müssten müsstet dürfte dürftest dürften dürftet sollte solltest sollten solltet möchte möchtest möchten möchtet'),
 MOD:gmW('kann kannst können könnt muss musst müssen müsst will willst wollen wollt soll sollst sollen sollt darf darfst dürfen dürft mag magst mögen mögt möchte möchtest möchten möchtet'),
 PRA:gmW('war warst waren wart hatte hattest hatten hattet konnte konntest konnten konntet musste musstest mussten musstet wollte wolltest wollten wolltet sollte solltest sollten solltet durfte durftest durften durftet mochte mochtest mochten mochtet'),
 SUB:gmW('dass weil obwohl wenn als ob damit während bevor nachdem falls sodass indem seit seitdem bis sobald solange ehe obgleich'),
 AUX:{haben:'habe hast hat haben habt hatte hattest hatten hattet hätte hättest hätten hättet gehabt',sein:'bin bist ist sind seid war warst waren wart wäre wärst wären wärt gewesen',werden:'werde wirst wird werden werdet wurde wurdest wurden wurdet würde würdest würden würdet geworden worden',können:'kann kannst können könnt konnte konntest konnten konntet könnte könntest könnten könntet gekonnt',müssen:'muss musst müssen müsst musste musstest mussten musstet müsste müsstest müssten müsstet gemusst',wollen:'will willst wollen wollt wollte wolltest wollten wolltet gewollt',sollen:'soll sollst sollen sollt sollte solltest sollten solltet gesollt',dürfen:'darf darfst dürfen dürft durfte durftest durften durftet dürfte dürftest dürften dürftet gedurft',mögen:'mag magst mögen mögt mochte mochtest mochten mochtet möchte möchtest möchten möchtet gemocht'}};
const GMNL={HEB:gmW('heb hebt heeft hebben'),ZIJ:gmW('ben bent is zijn'),WOR:gmW('word wordt worden werd werden'),ZUL:gmW('zal zult zullen'),MOD:gmW('kan kunt kunnen moet moeten wil wilt willen mag mogen'),
 PRA:gmW('was waren had hadden kon konden moest moesten wilde wilden mocht mochten zou zouden'),SUB:gmW('dat omdat als terwijl hoewel toen voordat nadat zodat tenzij zolang sinds indien of'),
 AUX:{hebben:'heb hebt heeft hebben had hadden gehad',zijn:'ben bent is zijn was waren geweest',worden:'word wordt worden werd werden geworden',kunnen:'kan kunt kunnen kon konden gekund',willen:'wil wilt willen wilde wilden gewild',moeten:'moet moeten moest moesten gemoeten',mogen:'mag mogen mocht mochten gemogen',zullen:'zal zult zullen zou zouden'}};
const GM_PART=gmW('ab an auf aus bei ein mit nach vor weg zu zurück fest her hin los um über durch unter zusammen vorbei heraus herein hinaus hinein voraus vorüber empor op af aan uit in mee na om over toe voor terug samen door neer rond');
const GMV={};
function gmVerbK(L){if(GMV[L])return GMV[L];const X=L=='de'?DX:DXN,inf=new Map(),pp=new Map(),prt=new Map(),p3=new Map(),sep=[];
 if(X&&X.v)for(const raw in X.v){const info=String(X.v[raw]).split(' · ').map(x=>x.trim()),w=libLow(libC1(raw).replace(/^(?:sich|zich)\s+/i,''));if(!w||/\s/.test(w))continue;inf.set(w,raw);
  if(info.length>=2&&info[0]){const a=info[0].split(/\s+/),b=info[1].split(/\s+/),c=(info[2]||'').split(/\s+/),h3=libLow(a[0]),hr=libLow(b[0]),pw=libLow(c[c.length-1]||'');
   p3.set(h3,w);prt.set(hr,w);if(pw&&!/^(?:hat|ist|heeft|is|haben|sein|hebben|zijn)$/.test(pw))pp.set(pw,w);
   if(a.length>1&&GM_PART.has(libLow(a[a.length-1])))sep.push({inf:w,fin:h3,prt:hr,part:libLow(a[a.length-1])})}}
 return GMV[L]={inf,pp,prt,p3,sep}}
const GM_NOTPP=new Set(['gerät','gebärde','genug','gegen','gesund','gelb','gern','gerne','genau','gestern','gerade']);
const gmDePP=(t,K)=>K.pp.has(t)||(/^ge[a-zäöüß]{2,}t$/.test(t)&&!GM_NOTPP.has(t))||(/^(?:ab|an|auf|aus|bei|ein|mit|nach|vor|weg|zu|zurück|fest|her|hin|los)ge[a-zäöüß]{2,}t$/.test(t));
const gmNlVD=(t,K)=>K.pp.has(t)||(/^ge[a-zéëï]{2,}[dt]$/.test(t)&&!GM_NOTPP.has(t))||(/^(?:op|af|aan|uit|in|mee|na|om|over|toe|voor|weg|terug|samen)ge[a-zéëï]{2,}[dt]$/.test(t));
const GMNL_ANY=gmW('dat omdat terwijl hoewel voordat nadat zodat tenzij zolang indien');
function gmClauseVerbFinal(f,SUB,K,L,isPP){const vlike=e=>K.inf.has(e)||K.p3.has(e)||K.prt.has(e)||isPP(e,K)||(L=='de'?(GMDE.HAB.has(e)||GMDE.SEI.has(e)||GMDE.WER.has(e)||GMDE.MOD.has(e)||GMDE.PRA.has(e)||GMDE.KON.has(e)):(GMNL.HEB.has(e)||GMNL.ZIJ.has(e)||GMNL.WOR.has(e)||GMNL.MOD.has(e)||GMNL.PRA.has(e)))||/(?:t|en|te|ten|de|den)$/.test(e);
 for(const c of String(f).split(/[,;:.!?]/)){const tk=libTok(c,L);if(tk.length<3)continue;
  let j=SUB.has(tk[0])?0:-1;if(j<0&&L=='nl')j=tk.findIndex((w,i)=>i>0&&GMNL_ANY.has(w));
  if(j>=0&&tk.length-j>=3&&vlike(tk[tk.length-1]))return true}return false}
function gmEuFeat(rec,L){if(rec.fe)return rec.fe;const K=gmVerbK(L),T=rec.tk||[],S=new Set(T),has=s=>{for(const x of T)if(s.has(x))return true;return false},fe=new Set();
 const inf=T.some(t=>K.inf.has(t));
 if(L=='de'){const hab=has(GMDE.HAB)||['hatte','hattest','hatten','hattet'].some(x=>S.has(x)),sei=has(GMDE.SEI)||['war','warst','waren','wart'].some(x=>S.has(x)),wer=has(GMDE.WER),wur=has(GMDE.WUR),pp=T.some(t=>gmDePP(t,K)),pra=has(GMDE.PRA),hp=['hatte','hattest','hatten','hattet','war','warst','waren','wart'].some(x=>S.has(x));
  if(hab||sei){if(pp)fe.add(hp?'plus':'perfekt')}
  if((wer||wur||S.has('worden'))&&pp)fe.add('passiv');
  if(wer&&inf&&!pp)fe.add('futur');
  if((has(GMDE.WUE)&&inf)||has(GMDE.KON))fe.add('konj2');
  if((has(GMDE.MOD)||pra)&&inf)fe.add('modal');
  if(T.some(t=>K.prt.has(t))||pra||wur)fe.add('praet');
  if(K.sep.some(s=>S.has(s.fin)&&S.has(s.part))||K.sep.some(s=>S.has(s.prt)&&S.has(s.part)))fe.add('trenn');
  if(T.some((t,i)=>t=='zu'&&T[i+1]&&K.inf.has(T[i+1]))||T.some(t=>/^(?:ab|an|auf|aus|bei|ein|mit|nach|vor|weg|zu|zurück|fest|her|hin|los)zu[a-zäöüß]+en$/.test(t)))fe.add('zuinf');
  if(gmClauseVerbFinal(rec.f,GMDE.SUB,K,L,gmDePP))fe.add('neben');
  if(S.has('sich'))fe.add('refl')}
 else{const heb=has(GMNL.HEB),zij=has(GMNL.ZIJ),wor=has(GMNL.WOR),zul=has(GMNL.ZUL),vd=T.some(t=>gmNlVD(t,K)),pra=has(GMNL.PRA);
  if((heb||zij)&&vd)fe.add('perfect');
  if(wor&&vd)fe.add('passief');
  if(zul&&inf)fe.add('futur');
  if(T.some(t=>K.prt.has(t))||pra)fe.add('praet');
  if(has(GMNL.MOD)&&inf)fe.add('modal');
  if(K.sep.some(s=>(S.has(s.fin)||S.has(s.prt))&&S.has(s.part)))fe.add('trenn');
  if(S.has('om')&&S.has('te')&&inf)fe.add('omte');
  if(gmClauseVerbFinal(rec.f,GMNL.SUB,K,L,gmNlVD))fe.add('neben');
  if(S.has('zich'))fe.add('refl')}
 return rec.fe=fe}
const GMEU_F={
 de:[[/plusquamperfekt/,'plus'],[/passiv/,'passiv'],[/perfekt/,'perfekt'],[/pr[äa]teritum/,'praet'],[/futur/,'futur'],[/konjunktiv\s*ii/,'konj2'],[/trennbar/,'trenn'],[/modalverb/,'modal'],[/infinitiv|klausa tujuan/,'zuinf'],[/subordinatif|nebensatz/,'neben'],[/reflexiv/,'refl']],
 nl:[[/pasi[ef]|passie[f]/,'passief'],[/perfectum|kata bantu: (?:zijn|hebben)/,'perfect'],[/imperfectum/,'praet'],[/masa depan|toekomst/,'futur'],[/scheidbar/,'trenn'],[/\bom\b.{0,6}\bte\b|infinitif.*te/,'omte'],[/subordinatif|klausa anak|tak langsung/,'neben'],[/reflexi/,'refl'],[/kata kerja modal|modal/,'modal']]};
function gmEuSpec(g,key){const L=g[1],sec=String(g[3]||'').toLowerCase(),title=String(g[4]||'').toLowerCase();let feat='';
 if(sec!='preposisi')for(const [re,f] of GMEU_F[L])if(re.test(sec)||(L=='nl'&&re.test(title))){feat=f;break}
 if(!feat)return{L,k:'raw'};
 const AUX=(L=='de'?GMDE:GMNL).AUX,SUB=(L=='de'?GMDE:GMNL).SUB,req=new Set();
 for(const w of libTok(title,L)){for(const v in AUX)if(v==w||AUX[v].split(' ').includes(w)){AUX[v].split(' ').forEach(x=>req.add(x));req.add(v)}if(feat=='neben'&&SUB.has(w))req.add(w)}
 const K=gmVerbK(L);for(const w of libTok(title,L).slice(0,3)){if(K.inf.has(w)){req.add(w);for(const m of[K.pp,K.prt,K.p3])for(const [f,l] of m)if(l==w)req.add(f)}}
 return{L,k:'eu',feat,req:req.size?req:null}}
function gmEuLv(rec,sp){const fe=gmEuFeat(rec,sp.L);if(!fe.has(sp.feat))return 0;if(sp.req&&!rec.tk.some(t=>sp.req.has(t)))return 0;return 2}

/* --- penilai utama --- */
function gmLv(d,i,key){const rec=gmRec(d,i);
 if(rec.tg)for(const t of rec.tg)if(t.t=='g'&&t.k==key)return t.s?3:2;
 const sp=gmSpec(key);if(!sp||sp.k=='none')return 0;
 switch(sp.k){case'ja':case'jaf':return gmJaLv(rec,sp,key);case'zh':return gmZhLv(rec,sp,key);case'eu':return gmEuLv(rec,sp);default:return gmRaw(rec,key)?2:0}}
const gmMin=()=>S.o.gmMin==1?1:2;
function gmCount(d,key){let n=0;const m=gmMin();for(let i=0;i<d.sents.length;i++)if(gmLv(d,i,key)>=m)n++;return n}
/* rincian untuk tampilan analisis: {n3,n2,n1} */
function gmCountL(d,key){const r={n3:0,n2:0,n1:0};for(let i=0;i<d.sents.length;i++){const v=gmLv(d,i,key);if(v==3)r.n3++;else if(v==2)r.n2++;else if(v==1)r.n1++}return r}

/* ---------- 4. Pengelompokan bentuk kata kerja per teks ---------- */
const GMEU_L={inf:'Infinitiv',p3:'Präsens (3. Pers.)',prt:'Präteritum',pp:'Partizip II'};
const GMNL_L={inf:'Infinitief',p3:'Presens (3e pers.)',prt:'Imperfectum',pp:'Voltooid deelwoord'};
function gmVerbForms(it){const L=it.L,G=new Map(),seen=new Set();
 const add=(k,lem,form,s,ref)=>{const dk=ref+'|'+s;if(seen.has(dk))return;seen.add(dk);let g=G.get(k||'~'+lem);if(!g){g={k:k||'',lem,total:0,forms:new Map()};G.set(k||'~'+lem,g)}
  g.total++;let f=g.forms.get(form);if(!f){f={n:0,s:new Set()};g.forms.set(form,f)}f.n++;f.s.add(s)};
 let K=null;if(L=='de'||L=='nl')K=gmVerbK(L);
 it.ps.forEach((p,pi)=>p.f.forEach((f,si)=>{const ref=pi+'.'+si,tg=p.tg&&p.tg[si];
  if(tg)for(const t of tg)if(t.t=='v')add(t.k,t.n,t.f||'tag AI',t.s,ref);
  if(L=='ja'){for(const h of gmJaScan(f)){const a=h.a[0];if(a.f=='dict'||a.f=='Ai'||a.f=='Ana')continue;add(a.k,a.lem,gmFormName(a.f),h.s,ref)}}
  else if(K){const lab=L=='de'?GMEU_L:GMNL_L;for(const t of libTok(f,L)){
    if(K.pp.has(t))add(gmWordKey(K.pp.get(t),L),K.pp.get(t),lab.pp,t,ref);
    else if(K.prt.has(t)&&!K.inf.has(t))add(gmWordKey(K.prt.get(t),L),K.prt.get(t),lab.prt,t,ref);
    else if(K.p3.has(t)&&!K.inf.has(t))add(gmWordKey(K.p3.get(t),L),K.p3.get(t),lab.p3,t,ref)}}}));
 return[...G.values()].sort((a,b)=>b.total-a.total)}
function gmVerbView(it){if(it.L!='ja'&&it.L!='de'&&it.L!='nl')return'';const V=gmVerbForms(it);if(!V.length)return'';
 return`<div class=gsec style="margin-top:12px">Kata kerja yang berubah bentuk <small>(${V.length} kata kerja · dikelompokkan per kartu)</small></div><p class=gsub style="margin:2px 0 6px">${it.L=='ja'?'Bentuk て・た・ない・意向・使役・受身… dikenali dari kosakata kartumu (+ tag dari AI).':'Bentuk dikenali dari daftar bentuk di kartu verbmu (+ tag dari AI).'} Ketuk satu untuk mencari teks lain.</p>`+
  V.slice(0,12).map(g=>{const l=g.k?libLbl(g.k):{w:g.lem,r:'',m:''};
   return`<div class=row><div ${g.k?`data-a=libpick data-k="${esc(g.k)}"`:''}><b>${esc(l.w||g.lem)}</b> ${l.r?`<small>${esc(l.r)}</small>`:''}${l.m?` <small>${esc(l.m)}</small>`:''}<br>`+
   [...g.forms].map(([f,v])=>`<span class="gmf">${esc(f)}${it.L=='ja'&&GMJFI[f.split(' + ')[0]]?'':''} <i>${[...v.s].slice(0,3).map(esc).join('・')}</i>${v.n>1?' ×'+v.n:''}</span>`).join(' ')+`</div><span class=bdg>${g.total}×</span></div>`}).join('')}

/* ---------- 5. Tag AI: tampilan & penyorotan ---------- */
function gmTagChips(p,si){const tg=p.tg&&p.tg[si];if(!tg||!tg.length)return'';
 return`<div class=gmts>`+tg.map(t=>t.t=='g'?`<span class="gmt${t.k?' ok':''}" title="${t.k?'Grammar terhubung ke kartu':'Grammar tanpa kartu yang cocok'}">${esc(String(t.n).replace(/\s*[（(][^)）]*[)）]/g,'').slice(0,40))}${t.s?' <i>'+esc(t.s)+'</i>':''}</span>`:`<span class="gmt v">${esc(t.n)}${t.s&&t.s!=t.n?' → <i>'+esc(t.s)+'</i>':''}${t.f?' <em>'+esc(t.f)+'</em>':''}</span>`).join('')+`</div>`}
function gmHLS(f,sf,L){const rom=L=='ja'||L=='zh',t=rom?String(f).replace(/\s+/g,''):String(f),R=[];
 for(const s0 of sf){for(const part of String(s0).split(/\s*(?:…|\.{3})\s*/)){const s=rom?part.replace(/\s+/g,''):part;if(!s)continue;const hay=rom?t:t.toLowerCase(),nd=rom?s:s.toLowerCase();let i=hay.indexOf(nd);while(i>=0){R.push([i,i+nd.length]);i=hay.indexOf(nd,i+nd.length)}}}
 if(!R.length)return null;R.sort((a,b)=>a[0]-b[0]);const mg=[];R.forEach(r=>{const l=mg[mg.length-1];if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else mg.push(r.slice())});
 let h='',p=0;mg.forEach(r=>{h+=esc(t.slice(p,r[0]))+'<mark>'+esc(t.slice(r[0],r[1]))+'</mark>';p=r[1]});return h+esc(t.slice(p))}
/* tag grammar untuk kartu `key` pada kalimat bertag */
const gmTagSf=(tg,key)=>(tg||[]).filter(t=>t.t=='g'&&t.k==key&&t.s).map(t=>t.s);

/* ---------- 6. Contoh dari Pustaka saat kartu dibuka ---------- */
const GMEXC=new Map();
const gmSig=()=>S.lib.length+'/'+S.sl.length+'/'+gmB.n+'/'+(S.lib[0]?S.lib[0].c:0)+'/'+(S.sl[0]?S.sl[0].c:0)+'/'+gmMin();
function gmCollect(key){const L=libOfKey(key),isG=!!GK[key],m=gmMin(),out=[];
 const test=(d)=>{if(isG)return gmLv(d,0,key);return libCountKey(d,key)>0?2:0};
 for(const x of S.sl){if(x.L!=L)continue;const it=slPs(x),d=libSentDoc(it,0,0),lv=test(d);if(lv>=m)out.push({lv,f:x.f,r:x.r||'',i:x.i||'',t:'s',tg:x.tg||null,L})}
 for(const it of S.lib){if(it.L!=L)continue;it.ps.forEach((p,pi)=>p.f.forEach((f,si)=>{const d=libSentDoc(it,pi,si),lv=test(d);if(lv>=m)out.push({lv,f,r:p.a!==0&&p.r?p.r[si]||'':'',i:p.a!==0&&p.i?p.i[si]||'':'',t:libKind(it),tg:p.tg&&p.tg[si]||null,L,sp:p.sp&&p.sp[si]||''})}))}
 return out}
function gmPick(c,N){const seen=new Set(),sc=x=>x.lv*100+(x.i?12:0)+(x.r||x.L=='de'||x.L=='nl'||x.L=='eo'?4:0)-Math.abs(String(x.f).replace(/\s+/g,'').length-(x.L=='ja'||x.L=='zh'?14:60))*.4;
 return c.map(x=>({...x,s:sc(x)})).sort((a,b)=>b.s-a.s).filter(x=>{const k=String(x.f).replace(/\s+/g,'').toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).slice(0,N)}
const GMSRC={s:'🔤 Kalimat',r:'📖 Reading',l:'🎧 Listening',d:'💬 Dialog'};
function gmExamples(key,N){N=N||5;const sig=gmSig(),c=GMEXC.get(key);if(c&&c.sig==sig&&c.N==N)return c.v;
 let v={n:0,rows:[]};try{const all=gmCollect(key);v={n:all.length,rows:gmPick(all,N)}}catch(e){v={n:0,rows:[]}}
 GMEXC.set(key,{sig,N,v});return v}
/* 5 contoh diambil acak dari 10 kalimat berskor tertinggi; acak ulang tiap berpindah kartu, stabil selama kartu yang sama dirender ulang */
const gmRoll={key:'',sig:'',rows:[]};
function gmRollRows(key,v){const sig=gmSig();if(gmRoll.key==key&&gmRoll.sig==sig)return gmRoll.rows;
 const a=v.rows.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 gmRoll.key=key;gmRoll.sig=sig;gmRoll.rows=a.slice(0,5);return gmRoll.rows}
function gmExBlock(key){if(!key||(!S.lib.length&&!S.sl.length))return'';const v0=gmExamples(key,10);if(!v0.rows.length)return'';const v={n:v0.n,rows:gmRollRows(key,v0)};const L=libOfKey(key);
 return`<div class=gmx><div class=gsec style="margin-top:12px">📚 Contoh dari Pustakamu <small>(${v.rows.length}${v.n>v.rows.length?' dari '+v.n:''})</small></div>`+
  v.rows.map(x=>{const sf=GK[key]?gmTagSf(x.tg,key):[];const hl=(sf.length&&gmHLS(x.f,sf,L))||libHL(x.f,key,L);
   return`<div class=gmr><div class=eo>${x.sp?`<b class=spk>${esc(x.sp)}</b> `:''}${hl}${spk(x.f,L)}</div>${x.r?`<div class="r rom">${esc(x.r)}</div>`:''}${x.i?`<div class=idn>${esc(x.i)}</div>`:''}<small class=gmsrc>${GMSRC[x.t]||''}${x.lv==3?' · ✓ ditandai AI':x.lv==1?' · perkiraan':''}</small></div>`}).join('')+
  `<div class=btns style="margin-top:6px"><button class=mini data-a=libfind data-k="${esc(key)}">Lihat semua di Pustaka${v.n>v.rows.length?' ('+v.n+')':''}</button></div></div>`}

/* ---------- 7. Ekspor / impor: JSON progres dan JSON pustaka ---------- */
const gmP2=n=>String(n).padStart(2,'0');
const gmStamp=()=>{const d=new Date();return d.getFullYear()+'-'+gmP2(d.getMonth()+1)+'-'+gmP2(d.getDate())+'_'+gmP2(d.getHours())+gmP2(d.getMinutes())};
function gmDownload(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=name;document.body.appendChild(l);l.click();setTimeout(()=>{l.remove();URL.revokeObjectURL(u)},1500)}
const gmMeta=type=>({type,v:3,app:GM_VER,at:new Date().toISOString()});
function gmExpProgress(){const o={...gmMeta('vortaro-progress'),p:S.p,s:S.s,srs:S.srs,lg:S.lg,nw:S.nw,lt:S.lt,ed:S.ed,rd:S.rd,gmMin:S.o.gmMin==1?1:2};gmDownload('progres-kosakata_'+gmStamp()+'.json',o);return o}
function gmExpLibrary(){const o={...gmMeta('vortaro-library'),lib:S.lib,sl:S.sl};gmDownload('pustaka-kosakata_'+gmStamp()+'.json',o);return o}
function gmMergeLib(d){let a=0,b=0;
 if(Array.isArray(d.lib)){const m=new Map(S.lib.map(t=>[t.id,t]));d.lib.forEach(t=>{if(!t||!t.id||!Array.isArray(t.ps))return;const o=m.get(t.id);
   if(o){o.h=Math.max(o.h|0,t.h|0);o.r=Math.max(o.r|0,t.r|0);(t.ps||[]).forEach((p,k)=>{if(o.ps[k]&&!o.ps[k].tg&&p.tg)o.ps[k].tg=p.tg});if(!o.nt&&t.nt)o.nt=t.nt}
   else{S.lib.push(t);m.set(t.id,t);a++}});S.lib.sort((x,y)=>y.c-x.c)}
 if(Array.isArray(d.sl)){const m=new Map(S.sl.map(t=>[t.id,t])),seen=new Map(S.sl.map(t=>[t.L+'|'+t.f,t]));
  d.sl.forEach(t=>{if(!t||!t.id||!t.f)return;const o=m.get(t.id)||seen.get(t.L+'|'+t.f);if(o){o.d=Math.max(o.d|0,t.d|0);if(!o.tg&&t.tg)o.tg=t.tg}else{S.sl.push(t);m.set(t.id,t);seen.set(t.L+'|'+t.f,t);b++}});S.sl.sort((x,y)=>y.c-x.c)}
 return[a,b]}
function gmImpData(d){const out=[];
 const hasProg=['p','s','srs','lg','nw','rd','lt','ed'].some(k=>d[k]&&typeof d[k]=='object');
 if(hasProg){Object.assign(S.p,d.p||{});Object.assign(S.s,d.s||{});Object.assign(S.srs,d.srs||{});Object.assign(S.lg,d.lg||{});for(const x in(d.nw||{}))S.nw[x]=Object.assign(S.nw[x]||{},d.nw[x]);Object.assign(S.rd,d.rd||{});
  if(d.ed){for(const t of['g','v'])Object.assign(S.ed[t],d.ed[t]||{});edApplyAll()}
  migKeys([...new Set(S.f.map(x=>String(x).split(':')[0]))]);
  if(d.lt){const m=new Map();(S.lt.h||[]).concat(d.lt.h||[]).forEach(x=>m.set(x.t+'|'+x.s,x));S.lt.h=[...m.values()].sort((a,b)=>a.t-b.t).slice(-1000);sMig();Object.assign(S.lt.g,d.lt.g||{});Object.assign(S.lt.d,d.lt.d||{})}
  if(d.gmMin)S.o.gmMin=d.gmMin==1?1:2;out.push('progres')}
 if(Array.isArray(d.lib)||Array.isArray(d.sl)){const[a,b]=gmMergeLib(d);gmB.n++;if(typeof libDocs!='undefined'){libDocs.clear();libSD.clear();libAna.clear();libAnaG.clear()}GMEXC.clear();out.push('pustaka (+'+a+' teks, +'+b+' kalimat)')}
 return out}
function gmImpFiles(files){const fs=[...files];if(!fs.length)return;let done=[],bad=0;
 Promise.all(fs.map(f=>f.text().then(t=>{try{return JSON.parse(t)}catch(_){bad++;return null}}))).then(arr=>{
  try{arr.filter(Boolean).forEach(d=>gmImpData(d).forEach(x=>done.push(x)))}catch(e){bad++}
  save();render();toast(done.length?'Dipulihkan: '+done.join(' · ')+(bad?' · '+bad+' file tidak valid':''):'File tidak valid.')})}

/* ---------- 8. Info versi ---------- */
const GM_NEWS=['Dua file JSON terpisah: progres & pustaka (ekspor/impor).','Kartu grammar ⇄ Pustaka lebih akurat: tag dari AI, verifikasi bentuk kata kerja, pinyin, dan fitur struktural Jerman/Belanda.','Partikel 1 huruf (は・を・さ …) tidak lagi menandai semua kalimat.','Saat kartu dibuka: 5 contoh kalimat dari Pustakamu.','Pustaka: kata kerja berubah bentuk dikelompokkan per kartu.'];
function gmWhen(){const m=GM_AT.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/);if(!m)return GM_AT;const hr=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],bl=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],dt=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));
 return hr[dt.getUTCDay()]+', '+(+m[3])+' '+bl[+m[2]-1]+' '+m[1]+' · pukul '+m[4]+'.'+m[5]+' WIB'}
function verCard(){return`<div class=card><div class=hd><span><b>Vortaro v${GM_VER}</b></span><span class=bdg>terbaru</span></div><small>Diperbarui ${gmWhen()}</small><ul style="margin:8px 0 0;padding-left:18px;font-size:.85rem;line-height:1.5">${GM_NEWS.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`}
function gmDataCard(){const nl=S.lib.length,ns=S.sl.length,nt=S.lib.reduce((a,t)=>a+t.ps.reduce((b,p)=>b+(p.tg?p.tg.filter(Boolean).length:0),0),0)+S.sl.filter(x=>x.tg&&x.tg.length).length;
 return`<div class=card><b>Cadangan data</b><p class=gsub style="margin:4px 0 8px">Dua file terpisah, bisa dipulihkan sendiri-sendiri atau sekaligus.</p><div class=btns style="margin-top:0"><button class=pri data-a=expp>Ekspor progres (JSON)</button><button class=pri data-a=expl>Ekspor pustaka (JSON)</button></div><p class=gsub style="margin:6px 0 8px">Progres: ${Object.keys(S.p).length} kartu bertanda, ${S.lt.h.length} kalimat latihan · Pustaka: ${nl} teks, ${ns} kalimat, ${nt} kalimat bertag.</p><p><small>Impor (boleh pilih beberapa file sekaligus, termasuk cadangan versi lama):</small><br><input type=file accept=.json multiple data-i=imp></p><button data-a=rst>Hapus semua progres</button></div>`}
