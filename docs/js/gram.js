function rxLB(s,f){try{return new RegExp(s,f)}catch(e){return new RegExp(String(s).replace(/\(\?<[=!][^)]*\)/g,''),f)}}
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
const GM_VER='7.40.0',GM_AT='2026-11-08T17:45:00+07:00';
const gmB={n:0};
const gmNorm=s=>String(s||'').toLowerCase().normalize('NFC').replace(/[〜～~\s()（）「」『』\[\]【】\/／・…*+,，、.。:：;；!！?？"'’`\-–—]/g,'');
const gmHan=ch=>/[\u3400-\u9fff]/.test(ch);

/* ---------- 1. TAG dari AI ---------- */
const GM_TAGHEAD=/^\s*(?:={2,}\s*)?(?:TAG|TAGS)(?:\s+(?:GRAMMAR|TATA\s*BAHASA))?(?:\s*(?:&|DAN|\+|\/)\s*(?:KATA\s*KERJA|VERB|BENTUK(?:\s+KATA)?))?\s*(?:={2,})?\s*:?\s*$/i;
function gmSplitTag(t){const lines=String(t).split('\n');const i=lines.findIndex(l=>GM_TAGHEAD.test(l.trim()));if(i<0)return{body:t,tag:''};
 let j=lines.length;for(let k=i+1;k<lines.length;k++){const l=lines[k];if(libHead(l)||/^\s*(?:daftar\s+)?(?:kartu\s+)?pembentuk\b[^\n]{0,45}$/i.test(l)){j=k;break}}
 return{body:lines.slice(0,i).concat(lines.slice(j)).join('\n'),tag:lines.slice(i+1,j).join('\n')}}
const GM_IDRES=[LIBID,LIBIDP,LIBID1,LIBID1P];
function gmItems(ln){const r=[];r.bad=[];for(const it of ln.split(/\s*[;；|｜]\s*/)){const t=it.trim();if(!t)continue;const m=t.match(/^(G\d*|V|K)\s*[:：=]\s*(.+)$/i);if(m)r.push({c:m[1].toUpperCase(),v:m[2].trim()});else r.bad.push(t)}return r}
function gmTagLines(tag){const out=[],leg={};
 for(let ln of String(tag).split('\n')){ln=ln.trim();if(!ln)continue;
  const m=ln.match(/^(G\d+)\s*[=：:]\s*(.+)$/i);if(m&&!/^[\[【(（]/.test(ln)){leg[m[1].toUpperCase()]=m[2].trim();continue}
  let key='';for(const re of GM_IDRES){const mm=ln.match(re);if(mm){key=(re===LIBID||re===LIBIDP)?mm[1]+'.'+mm[2]:mm[1];ln=ln.slice(mm[0].length);break}}
  if(key)out.push({key,items:gmItems(ln),raw:ln.trim()})}
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
const gmWordKeys=(w,L)=>{w=libLow(libC1(w)).replace(/^(?:der|die|das|de|het|sich|zich)\s+/,'');if(L=='ja'||L=='zh')w=w.replace(/\s+/g,'');return gmWordMap(L).get(w)||[]};
const gmWordKey=(w,L)=>gmWordKeys(w,L)[0]||'';
/* potongan teks harus muncul di kalimat */
function gmSurfOk(f,s,L){s=String(s||'').trim();if(!s)return true;
 const parts=s.split(/\s*(?:…|\.{3}|⋯)\s*/).filter(Boolean);
 if(L=='ja'||L=='zh'){const t=String(f).replace(/\s+/g,'');let p=0;for(const x of parts){const q=x.replace(/\s+/g,'');const i=t.indexOf(q,p);if(i<0)return false;p=i+q.length}return true}
 const t=' '+libTok(f,L).join(' ')+' ';let p=0;for(const x of parts){const q=' '+libTok(x,L).join(' ')+' ';const i=t.indexOf(q,p);if(i<0)return false;p=i+q.length-1}return true}
/* keluarkan tag per kalimat: kembalikan {map:{key:[tag]},drop,unres} */
function gmResolveTags(tag,L,sentOf){const P=gmTagLines(tag),map={};let drop=0,unres=0,n=0;
 /* v7.29.0 (B5): daftar tag yang gagal masuk beserta alasannya */
 const fail=[],F=(key,kind,name,surface,reason)=>fail.push({key,kind,name:String(name||''),surface:String(surface||''),reason});
 const dsc=it=>{if(it.c=='V'||it.c=='K'){const sp=it.v.split(/\s*(?:>|→|->|=>|＞)\s*/);return{kind:it.c,name:sp[0].trim(),surface:(sp[1]||sp[0]).trim().replace(/\s*[（(][^()（）]+[)）]\s*$/,'')}}
  if(/^G\d+$/.test(it.c))return{kind:'G',name:P.leg[it.c]||it.c,surface:it.v.replace(/\s*[（(][^()（）]*[)）]\s*$/,'').trim()};
  const mm=it.v.match(/^(.*?)\s*(?:＝|=)\s*(.+)$/);return{kind:'G',name:mm?mm[1].trim():it.v,surface:mm?mm[2].trim().replace(/\s*[（(][^()（）]*[)）]\s*$/,''):''}};
 for(const ln of P.lines){const f=sentOf(ln.key),bad=ln.items.bad||[];
  if(f==null){for(const it of ln.items){const d=dsc(it);F(ln.key,d.kind,d.name,d.surface,'nomor kalimat tidak ada di teks yang ditempel')}
   bad.forEach(b=>F(ln.key,'?',b,'','nomor kalimat tidak ada di teks yang ditempel; format tag juga tidak dikenali'));
   if(!ln.items.length&&!bad.length)F(ln.key,'?',ln.raw,'','nomor kalimat tidak ada di teks dan baris tidak berisi tag yang dikenali');continue}
  bad.forEach(b=>F(ln.key,'?',b,'','format tag tidak dikenali (pakai V:lemma > potongan, atau G1:potongan)'));
  if(!ln.items.length&&!bad.length)F(ln.key,'?',ln.raw,'','baris tidak berisi tag yang dikenali');
  for(const it of ln.items){
   if(it.c=='V'||it.c=='K'){const sp=it.v.split(/\s*(?:>|→|->|=>|＞)\s*/);let lem=sp[0].trim(),s=(sp[1]||sp[0]).trim(),fm='';
    const fmm=s.match(/\s*[（(]([^()（）]+)[)）]\s*$/);if(fmm){fm=fmm[1].trim();s=s.slice(0,fmm.index).trim()}
    if(!fm&&sp[2])fm=sp[2].trim();
    if(!gmSurfOk(f,s,L)){drop++;F(ln.key,it.c,lem,s,'potongan teks tidak ada di kalimat');continue}
    let wks=gmWordKeys(lem,L);if(!wks.length)wks=gmWordKeys(s,L);const wk=wks[0]||'';if(!wk)F(ln.key,it.c,lem,s,'kartu kosakata tidak ditemukan (tag disimpan sebagai catatan tanpa tautan)');
    (map[ln.key]=map[ln.key]||[]).push({t:'v',k:wk,ks:wks.slice(0,8),n:lem,s,f:fm});n++;continue}
   let title='',s='',keys=[];
   if(/^G\d+$/.test(it.c)){title=P.leg[it.c]||'';s=it.v;keys=title?gmTitleKeys(title,L):[]}
   else{const mm=it.v.match(/^(.*?)\s*(?:＝|=)\s*(.+)$/);if(mm){title=mm[1].trim();s=mm[2].trim()}else{title=it.v;s=''}keys=gmTitleKeys(title,L)}
   s=s.replace(/\s*[（(][^()（）]*[)）]\s*$/,'').trim();
   if(!gmSurfOk(f,s,L)){drop++;F(ln.key,'G',title||it.v,s,'potongan teks tidak ada di kalimat');continue}
   if(!keys.length){unres++;F(ln.key,'G',title||it.c,s,/^G\d+$/.test(it.c)&&!title?'legenda '+it.c+' tidak ditemukan (baris "'+it.c+' = judul grammar")':'judul grammar tidak cocok dengan kartu mana pun');(map[ln.key]=map[ln.key]||[]).push({t:'g',k:'',n:title||it.v,s});continue}
   keys.forEach(k=>{(map[ln.key]=map[ln.key]||[]).push({t:'g',k,n:GK[k][4],s});n++})}}
 return{map,drop,unres,n,fail}}
/* pasang ke hasil parser (ps atau sents) */
function gmApplyTags(r,tag,L){if(!tag||!tag.trim())return;let res;
 if(r.sents){const idx=new Map();r.sents.forEach((s,i)=>{if(s.n)idx.set(String(s.n),i)});
  res=gmResolveTags(tag,L,key=>idx.has(key)?r.sents[idx.get(key)].f:null);
  for(const k in res.map)r.sents[idx.get(k)].tg=res.map[k]}
 else if(r.ps){const idx=new Map();r.ps.forEach((p,pi)=>(p.ks||[]).forEach((k,si)=>{if(k&&!idx.has(k))idx.set(k,[pi,si])}));
  res=gmResolveTags(tag,L,key=>idx.has(key)?r.ps[idx.get(key)[0]].f[idx.get(key)[1]]:null);
  for(const k in res.map){const [pi,si]=idx.get(k),p=r.ps[pi];if(!p.tg)p.tg=p.f.map(()=>0);p.tg[si]=res.map[k]}}
 r.warn=r.warn||[];r.fail=res.fail||[];
 if(res.n)r.tagN=res.n;
 if(res.drop)r.warn.push(res.drop+' tag dibuang karena potongan teksnya tidak ada di kalimat (kemungkinan salah ketik/halusinasi AI).');
 if(res.unres)r.warn.push(res.unres+' tag grammar tidak cocok dengan kartu mana pun (tetap disimpan sebagai catatan).');
 if(!res.n&&!res.unres&&!res.drop)r.warn.push('Blok TAG ditemukan tetapi tidak ada baris bernomor yang cocok.')}

/* ---------- v7.33: laporan kartu/grammar di prompt yang belum masuk (tanpa tag) ---------- */
/* ambil daftar kartu dari prompt Kelas AI Pustaka (bagian KARTU PRIORITAS / KARTU BARU): {k,kind:'V'|'G',name,gloss,lv} */
function gmPromptCards(prompt,L){const out=[],seen=new Set(),lines=String(prompt||'').split(/\r?\n/);let on=0,kind='';
 const gk=Object.values(GK).filter(g=>g[1]==L);let vc=null;
 const vcards=()=>vc||(vc=D.C.filter(c=>c[3][L]&&c[3][L].length));
 for(const raw of lines){const ln=raw.trim();
  if(/^KARTU (PRIORITAS|BARU)\b/.test(ln)){on=1;kind='';continue}
  if(on&&/^[A-ZÀ-Ý][A-ZÀ-Ý ]{4,}[:(]/.test(ln)&&!/^KARTU (PRIORITAS|BARU)/.test(ln)){on=0;continue}
  if(!on)continue;
  if(/^Kosakata\b/i.test(ln)){kind='V';continue}if(/^Grammar\b/i.test(ln)){kind='G';continue}
  const m=ln.match(/^[-•]\s+(.+)$/);if(!m||!kind)continue;let t=m[1].replace(/\s+—\s+[^—]*(?:contoh|muncul)[^—]*$/,'');
  if(kind=='G'){const gm=t.match(/^(.+?)\s+\[([^\]]+)\]/);if(!gm)continue;const ti=gm[1].trim(),g=gk.find(x=>x[4]==ti&&x[2]==gm[2])||gk.find(x=>x[4]==ti);if(g&&!seen.has(g[0])){seen.add(g[0]);out.push({k:g[0],kind:'G',name:g[4],lv:g[2]})}}
  else{const em=t.match(/^(.+?)\s+=\s+(.+?)\s+\[[^\]]*\]/);if(!em)continue;const head=em[1],gloss=em[2].trim(),w=head.split(' / ')[0].replace(/\s*[（(][^()（）]*[)）]\s*$/,'').trim();
   const cs=vcards().filter(c=>c[3][L].some(e=>e[0]==w)),c=cs.find(x=>x[2]==gloss)||cs[0];
   if(c){const k=ik(c[0],L);if(!seen.has(k)){seen.add(k);out.push({k,kind:'V',name:w,gloss:c[2]})}}}}
 return out}
/* r = hasil parser (sents / ps), prompt = teks prompt, raw = teks yang ditempel */
function gmTagReport(r,prompt,raw,L){const cards=gmPromptCards(prompt,L);if(!cards.length)return null;
 const tagged=new Map(),sents=[];
 const add=(tg,f,i)=>{sents.push(f||'');if(!tg)return;for(const t of tg){const ks=t.t=='v'?gmTagKeys(t):(t.k?[t.k]:[]);for(const k of ks){const a=tagged.get(k)||{n:0,v:0};a.n++;if(t.t!='v'||gmIdOk(i,k))a.v++;tagged.set(k,a)}}};
 if(r.sents)r.sents.forEach(s=>add(s.tg,s.f,s.i));
 else if(r.ps)r.ps.forEach(p=>p.f.forEach((f,si)=>add(p.tg&&p.tg[si],f,p.a!==0&&p.i?p.i[si]||'':'')));
 const skip=[];String(raw||'').split(/\r?\n/).forEach(l=>{const m=l.match(/Dilewati\s*[:：]\s*(.+)$/i);if(m)skip.push(m[1].trim())});
 const fl=r.fail||[],txt=sents.join('\n').toLowerCase(),res={n:cards.length,nS:sents.length,ok:0,unv:[],miss:[]};
 for(const c of cards){const a=tagged.get(c.k);
  if(a&&(c.kind=='G'||a.v>0)){res.ok++;continue}
  if(a){res.unv.push({...c,why:'ada tag V:, tetapi terjemahan Indonesia kalimat tidak memuat arti kartu ('+(c.gloss||'')+'), jadi belum terverifikasi'});continue}
  const key=x=>c.kind=='G'?gmTitleKeys(x.name,L).includes(c.k)||x.name==c.name:(x.kind=='V'||x.kind=='K')&&(gmWordKeys(x.name,L).includes(c.k)||gmWordKeys(x.surface,L).includes(c.k));
  const f=fl.find(x=>key(x)),nm=String(c.name).toLowerCase(),sk=skip.find(x=>x.toLowerCase().includes(nm));
  let why;
  if(f)why='tag ada tapi gagal (kalimat '+f.key+'): '+f.reason;
  else if(sk)why='dilewati oleh AI: '+sk.slice(0,120);
  else if(c.kind=='V'&&txt.includes(nm))why='kata tampak di kalimat tetapi tidak ada tag V: yang menunjuk kartu ini';
  else if(c.kind=='G')why='tidak ada tag grammar (G…) yang menunjuk grammar ini';
  else why='tidak ada kalimat dan tidak ada tag yang memuat kartu ini';
  res.miss.push({...c,why})}
 return res}
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
function gmBuild(g,key){const L=g[1];if(L=='ja')return gmJaSpec(g,key);if(L=='zh')return gmZhSpec(g,key);if(L=='de'||L=='nl')return gmEuSpec(g,key);if(L=='en')return gmEnSpec(g,key);return{L,k:'raw'}}

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
function gmVerbK(L){if(GMV[L])return GMV[L];if(L=='en')return GMV[L]=gmEnVerbK();const X=L=='de'?DX:DXN,inf=new Map(),pp=new Map(),prt=new Map(),p3=new Map(),sep=[];
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
function gmEuFeat(rec,L){if(L=='en')return gmEnFeat(rec);if(rec.fe)return rec.fe;const K=gmVerbK(L),T=rec.tk||[],S=new Set(T),has=s=>{for(const x of T)if(s.has(x))return true;return false},fe=new Set();
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
 if(L=='de'&&sec=='preposisi'){const m=String(g[4]||'').match(/^(an|auf|hinter|in|neben|über|unter|vor|zwischen)\s*\((akk|dativ)/i);if(m)return{L,k:'prep',p:m[1].toLowerCase(),cs:/^akk/i.test(m[2])?'a':'d'}}
 if(sec!='preposisi')for(const [re,f] of GMEU_F[L])if(re.test(sec)||(L=='nl'&&re.test(title))){feat=f;break}
 if(!feat)return{L,k:'raw'};
 const AUX=(L=='de'?GMDE:GMNL).AUX,SUB=(L=='de'?GMDE:GMNL).SUB,req=new Set();
 for(const w of libTok(title,L)){for(const v in AUX)if(v==w||AUX[v].split(' ').includes(w)){AUX[v].split(' ').forEach(x=>req.add(x));req.add(v)}if(feat=='neben'&&SUB.has(w))req.add(w)}
 const K=gmVerbK(L);for(const w of libTok(title,L).slice(0,3)){if(K.inf.has(w)){req.add(w);for(const m of[K.pp,K.prt,K.p3])for(const [f,l] of m)if(l==w)req.add(f)}}
 return{L,k:'eu',feat,req:req.size?req:null}}
/* v7.40: Wechselpräposition (an/auf/hinter/in/neben/über/unter/vor/zwischen) punya kartu Akkusativ & Dativ. Kasus ditentukan dari artikel/pronomen setelah preposisi; tanpa penentu (mis. "in Berlin") -> lv 1 (perkiraan), kasus berlawanan -> 0. */
const GMDE_AKK=new Set('die das einen eine ein meinen meine mein deinen deine dein seinen seine sein unseren unsere unser diesen diese dieses jeden jede jedes keinen keine kein mich dich'.split(' ')),
 GMDE_DAT=new Set('dem der einem einer meinem meiner deinem deiner seinem seiner unserem unserer diesem dieser jedem jeder keinem keiner im am vom zum beim zur mir dir ihm'.split(' '));
function gmPrepLv(rec,sp,key){if(!gmRaw(rec,key))return 0;const T=rec.tk||[];let seen='';
 for(let i=0;i<T.length;i++){if(T[i]!=sp.p)continue;for(let j=i+1;j<=i+3&&j<T.length;j++){const w=T[j];if(GMDE_AKK.has(w)){seen+='a';break}if(GMDE_DAT.has(w)){seen+='d';break}}}
 if(!seen&&T.includes('im')&&sp.p=='in')seen='d';
 if(!seen)return 1;return seen.includes(sp.cs)?2:0}
function gmEuLv(rec,sp){const fe=gmEuFeat(rec,sp.L);if(!fe.has(sp.feat))return 0;if(sp.req&&!rec.tk.some(t=>sp.req.has(t)))return 0;return 2}

/* ---- Inggris (v7.6): daftar bentuk kata kerja dari DXE.v ('3sg · past · participle · -ing') ---- */
const GMEN={BE:gmW('am is are was were be been being m s re'),MOD:gmW('can could may might must should would shall cannot ought'),REL:gmW('who whom whose which that where'),
 NOTING:gmW('something nothing anything everything morning evening during ceiling spring string bring sing king ring thing things wing swing sting cling fling sling wring darling sibling pudding wedding building painting clothing feeling meeting ending beginning')};
const GM_ENNOTPP=gmW('need indeed speed seed feed weed bleed breed proceed succeed exceed hundred red bed shed sacred naked wicked kindred embed');
function gmEnVerbK(){const inf=new Map(),pp=new Map(),prt=new Map(),p3=new Map(),ing=new Map();
 if(typeof DXE!='undefined'&&DXE&&DXE.v)for(const raw in DXE.v){const w=libLow(libC1(raw));if(!w||/\s/.test(w))continue;const f=String(DXE.v[raw]).split(' · ').map(x=>libLow(x.trim()));if(f.length<4)continue;inf.set(w,raw);
  p3.set(f[0],w);for(const a of f[1].split('/'))prt.set(a.trim(),w);for(const a of f[2].split('/'))pp.set(a.trim(),w);ing.set(f[3],w)}
 return{inf,pp,prt,p3,ing,sep:[]}}
const gmEnPP=(t,K)=>K.pp.has(t)||(/^[a-z]{3,}ed$/.test(t)&&!GM_ENNOTPP.has(t));
const gmEnIng=(t,K)=>K.ing.has(t)||(/^[a-z]{3,}ing$/.test(t)&&t.length>=5&&!GMEN.NOTING.has(t));
function gmEnFeat(rec){if(rec.fe)return rec.fe;const K=gmVerbK('en'),T=rec.tk||[],S=new Set(T),has=s=>{for(const x of T)if(s.has(x))return true;return false},fe=new Set();
 const be=has(GMEN.BE),pps=T.filter(t=>gmEnPP(t,K)),pp=pps.length>0,ppn=pps.some(t=>t!='been'),ing=T.some(t=>gmEnIng(t,K)),hv=S.has('have')||S.has('has')||S.has('ve'),hd=S.has('had')||(S.has('d')&&pp);
 if(hv&&pp&&!S.has('will')&&!S.has('ll')&&!S.has('would'))fe.add('pperf');if(hd&&pp)fe.add('plup');if(be&&ppn&&!(S.has('being')&&!S.has('is')&&!S.has('are')&&!S.has('was')&&!S.has('were')&&!S.has('be')&&!S.has('been')&&!S.has('am')))fe.add('pass');
 if(be&&ing)fe.add('prog');if(S.has('will')||S.has('ll')||S.has('shall')||(S.has('going')&&S.has('to')&&T.indexOf('to')==T.indexOf('going')+1))fe.add('fut');
 if(has(GMEN.MOD)||S.has('can')||S.has('won')||S.has('ca'))fe.add('modal');if(S.has('if')||S.has('wish')||S.has('unless'))fe.add('cond');
 if(T.some(t=>K.prt.has(t)&&!K.inf.has(t))||T.some(t=>/^[a-z]{3,}ed$/.test(t)&&!GM_ENNOTPP.has(t))){if(!(pp&&(hv||hd||be)))fe.add('past')}
 if(ing&&!be)fe.add('ger');if(T.some((t,i)=>t=='to'&&T[i+1]&&K.inf.has(T[i+1])))fe.add('toinf');if(has(GMEN.REL))fe.add('rel');
 return rec.fe=fe}
const GMEN_F=[[/past perfect|plusquam/,'plup'],[/present perfect|perfect continuous|have gotten/,'pperf'],[/pasif|passive|\bvoice\b/,'pass'],[/future|going to|will vs shall/,'fut'],[/conditional|\bwish\b|if only|subjunctive|were to/,'cond'],[/continuous|progressive/,'prog'],[/past simple|past tense/,'past'],[/gerund/,'ger'],[/infinitive/,'toinf'],[/relative|klausa relatif/,'rel'],[/^(?:can|could|may|might|must|should|would|shall|will|ought|need|dare)\b|modal/,'modal']];
function gmEnSpec(g,key){const title=String(g[4]||'').toLowerCase(),sec=String(g[3]||'').toLowerCase();let feat='';
 for(const [re,f] of GMEN_F)if(re.test(title)){feat=f;break}
 if(!feat&&/modal/.test(sec))feat='modal';
 if(!feat)return{L:'en',k:'raw'};const req=new Set();
 if(feat=='modal'){for(const m of title.match(/\b(?:can|could|may|might|must|should|would|shall|will|ought|need|dare)\b/g)||[])req.add(m);if(req.has('can'))req.add('cannot');if(req.has('will'))req.add('ll')}
 if(feat=='fut'&&/going to/.test(title))req.add('going');
 if(feat=='prog'){if(/past continuous/.test(title)){req.add('was');req.add('were')}else if(/present continuous/.test(title))['am','is','are','m','s','re'].forEach(x=>req.add(x))}
 return{L:'en',k:'eu',feat,req:req.size?req:null}}
/* --- penilai utama --- */
function gmLv(d,i,key){const rec=gmRec(d,i);
 if(rec.tg)for(const t of rec.tg)if(t.t=='g'&&t.k==key)return t.s?3:2;
 const sp=gmSpec(key);if(!sp||sp.k=='none')return 0;
 switch(sp.k){case'ja':case'jaf':return gmJaLv(rec,sp,key);case'zh':return gmZhLv(rec,sp,key);case'eu':return gmEuLv(rec,sp);case'prep':return gmPrepLv(rec,sp,key);default:return gmRaw(rec,key)?2:0}}
const gmMin=()=>S.o.gmMin==1?1:2;
function gmCount(d,key){let n=0;const m=gmMin();for(let i=0;i<d.sents.length;i++)if(gmLv(d,i,key)>=m)n++;return n}
/* rincian untuk tampilan analisis: {n3,n2,n1} */
function gmCountL(d,key){const r={n3:0,n2:0,n1:0};for(let i=0;i<d.sents.length;i++){const v=gmLv(d,i,key);if(v==3)r.n3++;else if(v==2)r.n2++;else if(v==1)r.n1++}return r}

/* ---------- 4. Pengelompokan bentuk kata kerja per teks ---------- */
const GMEU_L={inf:'Infinitiv',p3:'Präsens (3. Pers.)',prt:'Präteritum',pp:'Partizip II'};
const GMNL_L={inf:'Infinitief',p3:'Presens (3e pers.)',prt:'Imperfectum',pp:'Voltooid deelwoord'},GMEN_L={inf:'Infinitive',p3:'Present (3sg -s)',prt:'Past simple',pp:'Past participle',ing:'-ing form'};
function gmVerbForms(it){const L=it.L,G=new Map(),seen=new Set();
 const add=(k,lem,form,s,ref)=>{const dk=ref+'|'+s;if(seen.has(dk))return;seen.add(dk);let g=G.get(k||'~'+lem);if(!g){g={k:k||'',lem,total:0,forms:new Map()};G.set(k||'~'+lem,g)}
  g.total++;let f=g.forms.get(form);if(!f){f={n:0,s:new Set()};g.forms.set(form,f)}f.n++;f.s.add(s)};
 let K=null;if(L=='de'||L=='nl'||L=='en')K=gmVerbK(L);
 it.ps.forEach((p,pi)=>p.f.forEach((f,si)=>{const ref=pi+'.'+si,tg=p.tg&&p.tg[si];
  if(tg)for(const t of tg)if(t.t=='v')add(t.k,t.n,t.f||'tag AI',t.s,ref);
  if(L=='ja'){for(const h of gmJaScan(f)){const a=h.a[0];if(a.f=='dict'||a.f=='Ai'||a.f=='Ana')continue;add(a.k,a.lem,gmFormName(a.f),h.s,ref)}}
  else if(K){const lab=L=='de'?GMEU_L:L=='en'?GMEN_L:GMNL_L;for(const t of libTok(f,L)){
    if(L=='en'&&K.ing.has(t)&&!K.inf.has(t)&&!K.pp.has(t))add(gmWordKey(K.ing.get(t),L),K.ing.get(t),lab.ing,t,ref);
    else if(K.pp.has(t))add(gmWordKey(K.pp.get(t),L),K.pp.get(t),L=='en'&&K.prt.has(t)&&!K.inf.has(t)?lab.prt+' / participle':lab.pp,t,ref);
    else if(K.prt.has(t)&&!K.inf.has(t))add(gmWordKey(K.prt.get(t),L),K.prt.get(t),lab.prt,t,ref);
    else if(K.p3.has(t)&&!K.inf.has(t))add(gmWordKey(K.p3.get(t),L),K.p3.get(t),lab.p3,t,ref)}}}));
 return[...G.values()].sort((a,b)=>b.total-a.total)}
function gmVerbView(it){if(it.L!='ja'&&it.L!='de'&&it.L!='nl'&&it.L!='en')return'';const V=gmVerbForms(it);if(!V.length)return'';
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
/* v7.28.0 (B4): kosakata "terverifikasi" = kalimat punya tag V:/K: asli dari AI untuk kartu itu (t.k = base@lang). Selain itu = "terdeteksi otomatis" (pencocok libHL/libCountKey). */
const GMVER={sig:'',m:new Map()};
/* v7.30.0: terverifikasi = (1) kalimat punya tag V:/K: asli dari AI yang menunjuk kartu itu (t.k atau t.ks untuk homonim) DAN (2) terjemahan Indonesia kalimat itu memuat padanan arti kartu (gzvIdSpan). Dua-duanya harus cocok: mencegah salah-tag seperti 差す (payung) pada さすが. */
/* arti yang dicocokkan = arti kartu + kepala catatan entri bahasa itu (mis. "Meneteskan cairan: ..." -> "Meneteskan cairan") */
const gmGloss=key=>{const c=K[base(key)];if(!c)return'';const L=lang(key),ex=(c[3][L]||[]).map(e=>String(e[4]||'').split(/[:：。]/)[0].trim()).filter(x=>x&&x.split(/\s+/).length<=7);return[c[2]].concat(ex).join(' / ')};
const gmIdOk=(i,key)=>!!(i&&K[base(key)]&&gzvIdSpan(i,gmGloss(key),true));
const gmTagKeys=t=>{const r=[];if(t&&t.t=='v'){if(t.k)r.push(t.k);if(t.ks)for(const k of t.ks)if(k&&!r.includes(k))r.push(k)}return r};
const gmTagHit=(tg,key,i)=>!!(tg&&tg.some(t=>gmTagKeys(t).includes(key)))&&gmIdOk(i,key);
function gmVerMap(){const sig=gmSig();if(GMVER.sig==sig)return GMVER.m;const m=new Map();
 const add=(tg,i)=>{if(!tg)return;const s=new Set();for(const t of tg)for(const k of gmTagKeys(t))if(!s.has(k)&&gmIdOk(i,k))s.add(k);for(const k of s)m.set(k,(m.get(k)|0)+1)};
 for(const x of S.sl)add(x.tg,x.i);for(const it of S.lib)for(const p of it.ps)if(p.tg)p.tg.forEach((tg,si)=>add(tg,p.a!==0&&p.i?p.i[si]||'':''));
 GMVER.sig=sig;GMVER.m=m;return m}
const gmVerN=k=>GK[k]||!aiVk(k)?0:(gmVerMap().get(ik(base(k),lang(k)))|0);
const aiVk=k=>String(k).indexOf('@')>=0;
function gmVerFirst(a){if(!S.lib.length&&!S.sl.length)return a;if(!gmVerMap().size)return a;const v=[],o=[];a.forEach(k=>(gmVerN(k)>0?v:o).push(k));return v.concat(o)}
/* v7.40: kecocokan tag AI dengan ENTRI kartu. Tag {k:kartu,n:kata}. 1 = n sama dgn entri ini; -1 = n sama dgn entri LAIN di kartu yang sama; 0 = tak ada tag kartu / n tak dikenal. */
const gmEnN=s=>String(s||'').toLowerCase().normalize('NFC').replace(/^(?:der|die|das|de|het|een|ein|eine|to|sich|zich)\s+/,'').replace(/[\s~〜・･\-]/g,'');
function gmTagEnt(tg,key){if(!tg)return 0;const c=K[base(key)],es=c&&c[3][lang(key)];if(!es||es.length<2)return 1;const vk=ik(base(key),lang(key)),mine=gmEnN((es[ent(key)]||[])[0]),oth=new Set();es.forEach((e,j)=>{if(j!=ent(key))oth.add(gmEnN(e[0]))});let r=0;
 for(const t of tg){if(!gmTagKeys(t).includes(vk))continue;const n=gmEnN(t.n);if(n&&n==mine)return 1;if(n&&oth.has(n))r=-1}return r}
/* v7.40: entri zh/ja yang merupakan potongan entri saudara (听 ⊂ 听见/听到, 吊る ⊂ 吊るす): kemunculan di dalam entri saudara dibuang dulu sebelum dihitung. */
function gmSupSib(key){const L=lang(key);if(L!='ja'&&L!='zh')return null;const c=K[base(key)],es=c&&c[3][L];if(!es||es.length<2)return null;const me=ent(key),mw=String(es[me][0]||'').replace(/\(.*?\)/g,'').trim(),o=[];
 if(!mw)return null;es.forEach((e,j)=>{const w=String(e[0]||'').replace(/\(.*?\)/g,'').trim();if(j!=me&&w.length>mw.length&&w.includes(mw.replace(/[るうくぐすつぬぶむ]$/,'')))o.push(ik(base(key),L)+(j>0?'~'+j:''))});return o.length?o:null}
function gmStripSib(d,sib){const res=[];for(const k of sib){const F=libForms(k,true);if(F)for(const a of F.alts){if(a.re)res.push(a.re);(a.ord||[]).forEach(r=>res.push(r))}}
 if(!res.length)return d;const st=t=>{let x=String(t);for(const r of res){r.lastIndex=0;x=x.replace(r,'\u0000')}return x};return Object.assign({},d,{flat:st(d.flat),sents:d.sents.map(st),rs:[],rb:null})}
function gmCollect(key,E){const L=libOfKey(key),isG=!!GK[key],m=gmMin(),out=[];E=!!E&&!isG;const sup=E?gmSupSib(key):null;
 const vk=isG?'':ik(base(key),lang(key)),ver=(d,i)=>!isG&&gmTagHit(d.tgs&&d.tgs[0],vk,i)&&(!E||gmTagEnt(d.tgs[0],key)>=0),test=(d,i)=>{if(isG)return gmLv(d,0,key);if(E&&gmTagEnt(d.tgs&&d.tgs[0],key)<0)return 0;return ver(d,i)?3:libCountKey(sup?gmStripSib(d,sup):d,key,E)>0?2:0};
 for(const x of S.sl){if(x.L!=L)continue;const it=slPs(x),d=libSentDoc(it,0,0),lv=test(d,x.i||'');if(lv>=m)out.push({lv,f:x.f,r:x.r||'',i:x.i||'',t:'s',tg:x.tg||null,L,ver:ver(d,x.i||''),o:{t:'sl',id:x.id}})}
 for(const it of S.lib){if(it.L!=L)continue;it.ps.forEach((p,pi)=>p.f.forEach((f,si)=>{const d=libSentDoc(it,pi,si),ii=p.a!==0&&p.i?p.i[si]||'':'',lv=test(d,ii);if(lv>=m)out.push({lv,f,r:p.a!==0&&p.r?p.r[si]||'':'',i:p.a!==0&&p.i?p.i[si]||'':'',t:libKind(it),tg:p.tg&&p.tg[si]||null,L,sp:p.sp&&p.sp[si]||'',ver:ver(d,ii),o:{t:'lib',id:it.id,pi,si}})}))}
 return out}
function gmPick(c,N){const seen=new Set(),sc=x=>x.lv*100+(x.i?12:0)+(x.r||x.L=='de'||x.L=='nl'||x.L=='en'||x.L=='eo'?4:0)-Math.abs(String(x.f).replace(/\s+/g,'').length-(x.L=='ja'||x.L=='zh'?14:60))*.4;
 return c.map(x=>({...x,s:sc(x)})).sort((a,b)=>b.s-a.s).filter(x=>{const k=String(x.f).replace(/\s+/g,'').toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).slice(0,N)}
const GMSRC={s:'🔤 Kalimat',r:'📖 Reading',l:'🎧 Listening',d:'💬 Dialog'};
function gmExamples(key,N){N=N||5;const sig=gmSig(),c=GMEXC.get(key);if(c&&c.sig==sig&&c.N==N)return c.v;
 let v={n:0,rows:[]};try{const all=gmCollect(key,true);v={n:all.length,nv:all.filter(x=>x.ver).length,rows:gmPick(all,N)}}catch(e){v={n:0,rows:[]}}
 GMEXC.set(key,{sig,N,v});return v}
/* 5 contoh diambil acak dari 10 kalimat berskor tertinggi; acak ulang tiap berpindah kartu, stabil selama kartu yang sama dirender ulang */
const gmRoll={key:'',sig:'',rows:[]};
function gmRollRows(key,v){const sig=gmSig();if(gmRoll.key==key&&gmRoll.sig==sig)return gmRoll.rows;
 const a=v.rows.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 gmRoll.key=key;gmRoll.sig=sig;gmRoll.rows=a.slice(0,5);return gmRoll.rows}
function gmExBlock(key){if(!key||(!S.lib.length&&!S.sl.length))return'';const v0=gmExamples(key,10);if(!v0.rows.length)return'';const v={n:v0.n,nv:v0.nv|0,rows:gmRollRows(key,v0)};const L=libOfKey(key);
 return`<div class=gmx><div class=gsec style="margin-top:12px">📚 Contoh dari Pustakamu <small>(${v.rows.length}${v.n>v.rows.length?' dari '+v.n:''})</small>${GK[key]?'':`<br><small class=gmcnt>${v.nv} terverifikasi (bertag AI) · ${v.n-v.nv} terdeteksi otomatis</small>`}</div>`+
  v.rows.map((x,xi)=>{const sf=GK[key]?gmTagSf(x.tg,key):[];const hl=(sf.length&&gmHLS(x.f,sf,L))||libHL(x.f,key,L,true);
   return`<div class=gmr><button class=gmdel data-a=fcxdel data-k=\"${esc(key)}\" data-v=${xi} title=\"Hapus kalimat ini dari Pustaka\" aria-label=\"Hapus kalimat\">🗑</button><div class=eo>${x.sp?`<b class=spk>${esc(x.sp)}</b> `:''}${hl}${spk(x.f,L)}</div>${x.r?`<div class="r rom">${esc(x.r)}</div>`:''}${x.i?`<div class=idn>${esc(x.i)}</div>`:''}<small class=gmsrc>${GMSRC[x.t]||''}${GK[key]?(x.lv==3?' · ✓ ditandai AI':x.lv==1?' · perkiraan':''):(x.ver?' · ✓ terverifikasi':'')}</small></div>`}).join('')+
  `<div class=btns style="margin-top:6px"><button class=mini data-a=libfind data-k="${esc(key)}">Lihat semua di Pustaka${v.n>v.rows.length?' ('+v.n+')':''}</button></div></div>`}

/* v7.26.0 (B2): hapus satu kalimat contoh dari Pustaka lewat daftar contoh di flashcard */
function gmDelCaches(){GMVER.sig='';GMEXC.clear();gmRoll.key='';gmRoll.rows=[];GZP.c.clear();GZP.sig='';GZV.c.clear();GZV.sig='';
 libSD.clear();libDocs.clear();libAna.clear();libAnaG.clear()}
function gmDelSent(key,idx){const r=gmRoll.key==key?gmRoll.rows[idx]:null;if(!r||!r.o)return false;
 if(!confirm('Hapus kalimat ini dari Pustaka?\n\n'+String(r.f).slice(0,120)))return false;
 const o=r.o;let ok=false;
 if(o.t=='sl'){const n=S.sl.length;S.sl=S.sl.filter(y=>y.id!=o.id);ok=S.sl.length<n}
 else{const it=S.lib.find(t=>t.id==o.id);
  if(it){let pi=o.pi,si=o.si,p=it.ps[pi];
   if(!p||p.f[si]!==r.f){pi=-1;si=-1;it.ps.some((q,a)=>{const b=q.f.indexOf(r.f);if(b>=0){pi=a;si=b;return true}return false});p=it.ps[pi]}
   if(p&&si>=0){['f','r','i','tg','sp'].forEach(f=>{if(Array.isArray(p[f])&&si<p[f].length)p[f].splice(si,1)});
    if(!p.f.length)it.ps.splice(pi,1);
    if(!it.ps.length){S.lib=S.lib.filter(t=>t.id!=it.id);if(typeof libOpenId!='undefined'&&libOpenId==it.id)libOpenId=''}
    ok=true}}}
 if(!ok){toast('Kalimat tidak ditemukan di Pustaka.');gmDelCaches();return true}
 gmDelCaches();
 /* kartu yang sedang tampil tidak boleh memakai kalimat yang sudah dihapus */
 const c=GZP.cur;if(c&&c.k==key&&((c.row&&c.row.f===r.f)||(c.v&&c.v.f===r.f))){try{gzpRoll(key)}catch(e){GZP.cur={k:key,row:null,v:null}}}
 toast('Kalimat dihapus ✓');return true}

/* ---------- 6b. v7.17: soal rumpang kartu grammar dari Pustaka ----------
   Sumber: kalimat Pustaka (Kalimat, Reading, Listening, Dialog) yang terhubung ke kartu grammar lewat TAG AI (potongan kunci = jawaban)
   atau — khusus kartu leksikal (kata/pola/partikel) — lewat pencocok otomatis (penanda libHL). Kartu struktural (kala, pasif, bentuk kata kerja)
   hanya memakai kalimat bertag. Dipilih acak, tiap kali kartu muncul; sisi jawaban menampilkan kalimat yang sama dengan jawaban ditandai. */
const GZP={sig:'',c:new Map(),last:{},cur:{k:'',row:null}};
const gzpUn=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
function gzpParse(h){let t='',sp=[],m;const re=/<mark>([\s\S]*?)<\/mark>|<[^>]*>|[^<]+/g;
 while((m=re.exec(h))){if(m[1]!==undefined){const x=gzpUn(m[1]);sp.push([t.length,t.length+x.length]);t+=x}else if(m[0][0]!='<')t+=gzpUn(m[0])}
 const mg=[];for(const r of sp){if(r[1]<=r[0])continue;const l=mg[mg.length-1];if(l&&/^\s*$/.test(t.slice(l[1],r[0])))l[1]=r[1];else mg.push(r.slice())}
 return{t,sp:mg}}
const gzpN=(s,cj)=>cj?s.replace(/\s+/g,'').length:(s.match(/\p{L}+/gu)||[]).length;
function gzpOk(p,L,tagged){const cj=L=='ja'||L=='zh',t=p.t,len=gzpN(t,cj);
 if(!p.sp.length||p.sp.length>(tagged?3:2)||(cj?(len<5||len>70):(len<4||len>32)))return false;
 let bl=0;for(const[a,b]of p.sp){const n=gzpN(t.slice(a,b),cj);if(n==0||n>(cj?(tagged?16:10):(tagged?6:4)))return false;bl+=n}
 return bl<=len*.5}
/* jawaban pada kalimat bertag: potongan TAG dicari dengan batas kata (“in” bukan bagian dari “tuin”); pola terpisah “a … b” dicari berurutan */
function gzpFind(f,sf,L){const cj=L=='ja'||L=='zh',t=cj?String(f).replace(/\s+/g,''):String(f),R=[];
 for(const s0 of sf){const parts=String(s0).split(/\s*(?:…|\.{3}|⋯)\s*/).map(x=>cj?x.replace(/\s+/g,''):x.trim()).filter(Boolean);if(!parts.length)continue;
  const find=(x,from,all)=>{const o=[];
   if(cj){let i=t.indexOf(x,from);while(i>=0){o.push([i,i+x.length]);if(!all)break;i=t.indexOf(x,i+x.length)}}
   else{const re=rxLB('(?<![\\p{L}\\p{N}])'+libEsc(x).replace(/\s+/g,'\\s+')+'(?![\\p{L}\\p{N}])','giu');re.lastIndex=from;let m;while((m=re.exec(t))){o.push([m.index,m.index+m[0].length]);if(!all)break}}
   return o};
  if(parts.length==1){const a=find(parts[0],0,true);(a.length<=2?a:a.slice(0,1)).forEach(r=>R.push(r))}
  else{let p=0;const tmp=[];for(const x of parts){const a=find(x,p,false);if(!a.length){tmp.length=0;break}tmp.push(a[0]);p=a[0][1]}tmp.forEach(r=>R.push(r))}}
 if(!R.length)return null;R.sort((a,b)=>a[0]-b[0]);
 const mg=[];R.forEach(r=>{const l=mg[mg.length-1];if(l&&r[0]<l[1])l[1]=Math.max(l[1],r[1]);else mg.push(r.slice())});
 return{t,sp:mg}}
function gzpCands(g){const key=g[0],L=g[1],q=S.o.gzq=='tag'?'tag':'auto',sig=gmSig()+'|'+q;
 if(GZP.sig!=sig){GZP.sig=sig;GZP.c.clear()}
 let v=GZP.c.get(key);if(v)return v;v=[];
 try{const sp=gmSpec(key),lex=!!sp&&(sp.k=='raw'||sp.k=='zh'||sp.k=='ja'),seen=new Set();
  for(const x of gmCollect(key)){if(x.lv<2)continue;
   const sf=gmTagSf(x.tg,key);let p=sf.length?gzpFind(x.f,sf,L):null;const tagged=!!p;
   if(!p){if(!lex||q=='tag')continue;p=gzpParse(libHL(x.f,key,L))}
   if(!gzpOk(p,L,tagged))continue;
   const nk=p.t.replace(/\s+/g,'').toLowerCase();if(seen.has(nk))continue;seen.add(nk);
   v.push({k:key,L,t:p.t,sp:p.sp,i:x.i||'',r:x.r||'',f:x.f,src:x.t,o:x.o,lv:tagged?3:2,w:(tagged?3:1)*(x.i?2:1)})}}
 catch(e){v=[]}
 GZP.c.set(key,v);return v}
/* dipanggil sekali tiap kartu grammar muncul (lihat fcView) */
function gzpRoll(k){const g=GK[k],fm=S.o.fct||'rumpang',bi=fm=='biasa'||(fm=='campur'&&Math.random()<.5);GZP.cur={k,row:null,v:null,bi};if(bi)return;
 if(!g){try{GZP.cur.v=gzvPick(k)}catch(e){GZP.cur.v=null}return}
 if(typeof gzOn!='function'||!gzOn(g)||(S.o.gz||'cloze')!='cloze')return;
 const m=S.o.gzp||'pl';if(m=='off')return;
 let c;try{c=gzpCands(g)}catch(e){return}if(!c.length)return;
 if(m=='mix'&&Math.random()<.5)return;
 const last=GZP.last[k],pool=c.length>1?c.filter(x=>x.f!==last):c;let tw=0;pool.forEach(x=>tw+=x.w);
 let r=Math.random()*tw,pick=pool[0];for(const x of pool){r-=x.w;if(r<=0){pick=x;break}}
 GZP.last[k]=pick.f;GZP.cur.row=pick}
const gzpRow=k=>GZP.cur&&GZP.cur.k==k?GZP.cur.row:null;
/* ---------- 6c. v7.25: soal rumpang kartu KOSAKATA dari Pustaka (B1) ----------
   Sumber: kalimat Pustaka yang memuat kata kartu (gmCollect). Jerman/Belanda + kata benda: bagian kosong dimulai dari artikel
   (der/die/das/den/dem/des/ein.., de/het/een) lalu kata bendanya. Tanpa kalimat cocok -> tampilan kartu biasa. */
const GZV={sig:'',c:new Map(),last:{}};
const GZV_ART={de:/(?:^|[^\p{L}\p{N}])((?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\s+)$/iu,nl:/(?:^|[^\p{L}\p{N}])((?:de|het|een)\s+)$/iu};
function gzvExt(p,L,pos){if(pos!='N'||!GZV_ART[L])return p;
 const sp=p.sp.map(([a,b])=>{const m=p.t.slice(0,a).match(GZV_ART[L]);return m?[a-m[1].length,b]:[a,b]});
 return{t:p.t,sp}}
/* ---------- 6c-2. v7.30: penanda kata Indonesia di terjemahan kalimat ----------
   Arti kartu (K[..][2], mis. "Berlari / Berlari-lari") dicari di kalimat Indonesia dengan toleransi imbuhan (ber-, me-, di-, -kan, -i, -an, -nya ...).
   Dipakai agar sisi depan kartu rumpang menandai kata yang dicari di terjemahan, atau mengosongkannya (arah Indonesia). */
const IDSTOP=new Set('yang dan di ke dari untuk dengan pada itu ini ada adalah akan atau juga sudah telah saya aku kamu dia kami kita mereka tidak bukan lebih sangat sekali saja lagi oleh dalam sebagai karena jika bila agar supaya tetapi tapi namun masih belum dapat bisa harus mau ingin se'.split(' '));
const IDPRE=[['memper',''],['diper',''],['meng',''],['meng','k'],['meny','s'],['men',''],['men','t'],['mem',''],['mem','p'],['me',''],['peng',''],['peng','k'],['peny','s'],['pen',''],['pen','t'],['pem',''],['pem','p'],['pe',''],['ber',''],['bel',''],['be',''],['ter',''],['te',''],['di',''],['ke',''],['se',''],['per','']];
function idCands(w){w=String(w).toLowerCase();const A=new Set([w]),sf=(l)=>{for(const x of [...A])for(const t of l)if(x.length>t.length+2&&x.endsWith(t))A.add(x.slice(0,-t.length))};
 sf(['lah','kah','pun']);sf(['ku','mu','nya']);sf(['kan','an','i']);
 const B=new Set(A);for(const x of A)for(const[p,r]of IDPRE)if(x.startsWith(p)&&x.length-p.length>=3)B.add(r+x.slice(p.length));
 return B}
const idTok=t=>{const o=[],re=/\p{L}+(?:-\p{L}+)*/gu;let m;while((m=re.exec(t)))o.push({a:m.index,b:m.index+m[0].length,w:m[0].toLowerCase()});return o};
function idSame(x,y,strict){if(x==y)return true;if(strict)return false;
 const px=x.split('-'),py=y.split('-');let cx=new Set(),cy=new Set();px.forEach(w=>idCands(w).forEach(c=>cx.add(c)));py.forEach(w=>idCands(w).forEach(c=>cy.add(c)));
 for(const c of cx)if(c.length>=4&&cy.has(c))return true;return false}
function idAlts(gl){return String(gl||'').replace(/\([^)]*\)|\[[^\]]*\]/g,' ').split(/[\/~,;]|\batau\b/i).map(x=>x.trim().toLowerCase()).filter(x=>/\p{L}{2,}/u.test(x)).map(x=>(x.match(/\p{L}+(?:-\p{L}+)*/gu)||[])).filter(a=>a.length).sort((a,b)=>b.length-a.length)}
/* -> [[a,b]] posisi kata Indonesia yang cocok dengan arti kartu, atau null */
const IDGEN=new Set('menggunakan memakai melakukan membuat menjadi pergi datang mengambil memberi punya memiliki berada orang barang sesuatu hal'.split(' '));
function gzvIdSpan(txt,gloss,relax){if(!txt||!gloss)return null;const T=idTok(txt);if(!T.length)return null;const alts=idAlts(gloss);
 for(const strict of [true,false])for(const g of alts){const one=g.length==1,stop=one&&(IDSTOP.has(g[0])||g[0].length<4);if(strict==false&&stop)continue;
  for(let i=0;i+g.length<=T.length;i++){let ok=true;for(let j=0;j<g.length;j++){if(!idSame(T[i+j].w,g[j],strict)){ok=false;break}}
   if(ok)return[[T[i].a,T[i+g.length-1].b]]}}
 if(relax)for(const g of alts)if(g.length>1)for(const w of g){if(w.length<4||IDSTOP.has(w)||IDGEN.has(w))continue;for(let i=0;i<T.length;i++)if(idSame(T[i].w,w,false))return[[T[i].a,T[i].b]]}
 return null}
function gzvIdSeg(row,f){const t=row.i,sp=row.ix||[];let o='',l=0;sp.forEach(([a,b],i)=>{o+=esc(t.slice(l,a))+f(t.slice(a,b),i);l=b});return o+esc(t.slice(l))}
function gzvCands(k){const sig=gmSig();if(GZV.sig!=sig){GZV.sig=sig;GZV.c.clear()}
 let v=GZV.c.get(k);if(v)return v;v=[];
 try{const L=libOfKey(k),c=K[base(k)],pos=c&&c[1],gl=gmGloss(k),seen=new Set();
  for(const x of gmCollect(k,true)){if(x.lv<2)continue;
   let p=gzvExt(gzpParse(libHL(x.f,k,L,true)),L,pos);
   if(!gzpOk(p,L,false))continue;
   const nk=p.t.replace(/\s+/g,'').toLowerCase();if(seen.has(nk))continue;seen.add(nk);
   const tg=!!x.ver,ix=x.i?gzvIdSpan(x.i,gl,true):null;if(!ix)continue;/* 7.30: soal rumpang hanya dari kalimat yang terjemahan Indonesianya cocok dengan arti kartu (anti false-positive) */
   v.push({k,L,t:p.t,sp:p.sp,i:x.i||'',ix,r:x.r||'',f:x.f,src:x.t,o:x.o,lv:tg?3:2,ver:tg,tg,art:p.sp.some(([a,b])=>/\s/.test(p.t.slice(a,b))&&pos=='N'),w:(x.i?2:1)*(ix?2:1)*(tg?3:1)})}}
 catch(e){v=[]}
 GZV.c.set(k,v);return v}
/* arah soal (S.o.gzd): 'mix' = acak tiap kartu muncul · 'f' = kosongkan kata asing (kalimat Indonesia ditandai) · 'i' = kosongkan kata Indonesia (kalimat asing ditandai) */
function gzvPick(k){if((S.o.gz||'cloze')=='old'||(S.o.gzv||'on')=='off')return null;
 if(!S.lib.length&&!S.sl.length)return null;
 const c=gzvCands(k);if(!c.length)return null;
 const dm=S.o.gzd||'mix',last=GZV.last[k];let pool=c.length>1?c.filter(x=>x.f!==last):c;
 if(dm=='i'){const q=pool.filter(x=>x.ix);if(q.length)pool=q}
 let tw=0;pool.forEach(x=>tw+=x.w);
 let r=Math.random()*tw,pick=pool[0];for(const x of pool){r-=x.w;if(r<=0){pick=x;break}}
 GZV.last[k]=pick.f;
 const d=pick.ix&&(dm=='i'||(dm=='mix'&&Math.random()<.5))?'i':'f';
 return{...pick,d}}
const gzvRow=k=>GZP.cur&&GZP.cur.k==k?GZP.cur.v||null:null;
const gzvChip=(n,col)=>`<div class=fcp><span class=fch style="--lc:${col}">${esc(n)}</span></div>`;
const gzvLang=L=>{const l=(typeof D!='undefined'&&D.L||[]).find(x=>x[0]==L);return l?gzvChip(l[1],l[2]):''};
const gzvMean=row=>{const c=K[base(row.k)];return c?String(c[2]):''};
/* sisi depan: TIDAK memuat kata kartu itu sendiri (tidak ada kepala kartu di atas kalimat) */
function gzvFront(row){const L=row.L,m=gzvMean(row);
 if(row.d=='i'){
  return gzvChip('Indonesia','var(--a)')+`<div class="gzc gzen gzde">${gzvIdSeg(row,w=>gzpBox('id',[...w.replace(/\s/g,'')].length))}</div>`+
   `<div class="gzc gzfo ${gzpCls(L)}">${gzpSeg(row,w=>`<mark class=gzh>${esc(w)}</mark>`)}${spk(row.f,L)}</div>`+(row.r?`<div class="r rom">${esc(row.r)}</div>`:'')+
   `<div class=fchint><small>Isi kata Indonesia yang hilang (padanan kata yang ditandai) · 📚 soal dari Pustakamu</small></div>`}
 const idl=row.i?(row.ix?`<div class="gzm gzid">${gzvIdSeg(row,w=>`<mark class=gzh>${esc(w)}</mark>`)}</div>`:`<div class="gzm gzid">${esc(row.i)}</div><div class=gzm>🎯 Kata yang dicari: <b>${esc(m)}</b></div>`):`<div class=gzm>🎯 Arti kata yang dicari: <b>${esc(m)}</b></div>`;
 return gzvLang(L)+`<div class="gzc ${gzpCls(L)}">${gzpSeg(row,w=>gzpBox(L,[...w.replace(/\s/g,'')].length))}</div>`+idl+
  `<div class=fchint><small>Isi kata yang hilang${row.art?' (artikel + kata benda)':''} · 📚 soal dari Pustakamu</small></div>`}
function gzvAns(row){const L=row.L;
 if(row.d=='i'){const a=row.ix?row.i.slice(row.ix[0][0],row.ix[0][1]):gzvMean(row);return`<div class="gzc gzans">${esc(a)}</div>`}
 const w=row.t.slice(row.sp[0][0],row.sp[row.sp.length-1][1]),c=K[base(row.k)],es=(c&&c[3][L])||[],bw=x=>String(x).replace(/^(?:der|die|das|de|het|een|ein)\s+/i,'').toLowerCase(),
  e=es.find(e=>e[1]&&bw(e[0])&&w.toLowerCase().includes(bw(e[0])));
 return`<div class="gzc gzans ${gzpCls(L)}">${esc(w)}${spk(w,L)}${e&&e[1]?` <span class="r rom">${esc(e[1])}</span>`:''}</div>`}
function gzvBack(row){const L=row.L;
 return`<div class=gzps><small class=gzpl>📚 Soal dari Pustakamu · ${GMSRC[row.src]||''}${row.ver?' · ✓ terverifikasi':''}</small>${gzvAns(row)}<div class=\"gzc ${gzpCls(L)}\">${gzpSeg(row,w=>`<mark class=gzh>${esc(w)}</mark>`)}${spk(row.f,L)}</div>${row.r?`<div class="r rom">${esc(row.r)}</div>`:''}${row.i?`<div class=gzm>${row.ix?gzvIdSeg(row,w=>`<mark class=gzh>${esc(w)}</mark>`):esc(row.i)}</div>`:''}</div>`}
const gzpCls=L=>L=='ja'?'gzja':L=='zh'?'':'gzen gzde';
const gzpBox=(L,n)=>`<span class="gzb${L=='ja'||L=='zh'?'':' gze'}" style="--n:${n}">&nbsp;</span>`;
const gzpSeg=(row,f)=>{let o='',l=0;row.sp.forEach(([a,b],i)=>{o+=esc(row.t.slice(l,a))+f(row.t.slice(a,b),i);l=b});return o+esc(row.t.slice(l))};
/* samarkan jawaban pada teks fungsi (hanya node teks, bukan tag) */
function gzpMask(h,parts){const ps=[...new Set(parts.map(x=>String(x).trim()).filter(x=>x))].filter(x=>/[㐀-鿿぀-ヿ]/.test(x)||x.length>=3).sort((a,b)=>b.length-a.length);if(!h||!ps.length)return h;
 const cj=ps.filter(x=>/[㐀-鿿぀-ヿ]/.test(x)),la=ps.filter(x=>!/[㐀-鿿぀-ヿ]/.test(x)),alt=[];
 if(la.length)alt.push('(?<![\\p{L}\\p{N}])(?:'+la.map(libEsc).join('|')+')(?![\\p{L}\\p{N}])');if(cj.length)alt.push('(?:'+cj.map(libEsc).join('|')+')');
 const re=rxLB(alt.join('|'),'giu');
 return h.split(/(<[^>]*>)/).map(p=>p[0]=='<'?p:p.replace(re,m=>`<span class="gzb gze gzs" style="--n:${m.length}">&nbsp;</span>`)).join('')}
function gzpFront(g,row){const L=g[1],base=String(gzFront(g)),m=base.match(/^<div class="gzq[^"]*">[\s\S]*?<\/div>/),
  fn=m?gzpMask(m[0],row.sp.map(([a,b])=>row.t.slice(a,b))):'';
 return fn+`<div class="gzc ${gzpCls(L)}">${gzpSeg(row,(w)=>gzpBox(L,[...w.replace(/\s/g,'')].length))}</div>`+(row.i?`<div class=gzm>${esc(row.i)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya · 📚 soal dari Pustakamu</small></div>`}
function gzpBack(g,row){const L=g[1];
 return`<div class=gzps><small class=gzpl>📚 Soal dari Pustakamu · ${GMSRC[row.src]||''}${row.lv==3?' · ✓ ditandai AI':' · terdeteksi otomatis'}</small><div class="gzc ${gzpCls(L)}">${gzpSeg(row,w=>`<mark class=gzh>${esc(w)}</mark>`)}${spk(row.f,L)}</div>${row.i?`<div class=gzm>${esc(row.i)}</div>`:''}${row.r?`<div class="r rom">${esc(row.r)}</div>`:''}</div><hr>`}

/* ---------- 7. Ekspor / impor: JSON progres dan JSON pustaka ---------- */
const gmP2=n=>String(n).padStart(2,'0');
const gmStamp=()=>{const d=new Date();return d.getFullYear()+'-'+gmP2(d.getMonth()+1)+'-'+gmP2(d.getDate())+'_'+gmP2(d.getHours())+gmP2(d.getMinutes())};
function gmDownload(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=name;document.body.appendChild(l);l.click();setTimeout(()=>{l.remove();URL.revokeObjectURL(u)},1500)}
const gmMeta=type=>({type,v:3,app:GM_VER,at:new Date().toISOString()});
function gmExpProgress(){const o={...gmMeta('vortaro-progress'),p:S.p,s:S.s,srs:S.srs,lg:S.lg,nw:S.nw,lt:S.lt,ed:S.ed,rd:S.rd,gg:S.gg||{},ggd:S.ggd||null,gmMin:S.o.gmMin==1?1:2,sch:S.v||1,o:S.o,f:S.f,gf:S.gf,sd:S.sd,ses:S.ses,gs:S.gs};gmDownload('progres-kosakata_'+gmStamp()+'.json',o);return o}
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
 if(hasProg){{const nw=(o,n)=>!o||!o.t||((n.r|0)>(o.r|0));for(const k in(d.srs||{})){const n=d.srs[k],o=S.srs[k];if(nw(o,n)&&!(o&&o.z))S.srs[k]=n;else if(o&&o.z&&!o.t)S.srs[k]=Object.assign({},n,{z:1})}for(const k in(d.p||{}))if(!(S.srs[k]&&S.srs[k].t)||S.p[k]===undefined)S.p[k]=Math.max(S.p[k]|0,d.p[k]|0);for(const k in(d.s||{}))S.s[k]=d.s[k]}Object.assign(S.lg,d.lg||{});for(const x in(d.nw||{}))S.nw[x]=Object.assign(S.nw[x]||{},d.nw[x]);Object.assign(S.rd,d.rd||{});S.gg=Object.assign(S.gg||{},d.gg||{});
  if(d.ed){for(const t of['g','v'])Object.assign(S.ed[t],d.ed[t]||{});edApplyAll()}
  migKeys([...new Set(S.f.map(x=>String(x).split(':')[0]))]);
  {let unk=0;S.legacy2=S.legacy2||{};for(const bag of['p','s','srs'])for(const k of Object.keys(S[bag])){if(GK[k]||K[base(k)])continue;S.legacy2[bag+'|'+k]=S[bag][k];delete S[bag][k];unk++}if(unk)out.push('⚠ '+unk+' entri lama tidak dikenali (grammar yang sudah diganti, dilewati)')}
  if(d.ggd&&typeof d.ggd=='object'&&S.ggd&&d.ggd.d===S.ggd.d){for(const x of['n','r','x'])S.ggd[x]=Math.max(S.ggd[x]|0,d.ggd[x]|0);const dn=d.ggd.nl&&typeof d.ggd.nl=='object'?d.ggd.nl:null;if(dn){const sn=ggSd('nl');for(const x of['n','r','x'])sn[x]=Math.max(sn[x]|0,dn[x]|0)}}
  if(d.lt){const m=new Map();(S.lt.h||[]).concat(d.lt.h||[]).forEach(x=>m.set(x.t+'|'+x.s,x));S.lt.h=[...m.values()].sort((a,b)=>a.t-b.t).slice(-1000);sMig();Object.assign(S.lt.g,d.lt.g||{});Object.assign(S.lt.d,d.lt.d||{})}
  if(d.gmMin)S.o.gmMin=d.gmMin==1?1:2;
  if(d.sch>(S.v||1))alert('Berkas ini dibuat versi aplikasi yang lebih baru (skema '+d.sch+'). Sebagian data mungkin tidak dikenali.');
  if(d.sd&&d.sd.d===S.sd.d)for(const x of['n','r','x','y'])S.sd[x]=Math.max(S.sd[x]|0,d.sd[x]|0);
  if(d.ses&&typeof d.ses=='object')S.ses=Object.assign(S.ses||{},d.ses);if(d.gs>0)S.gs=Math.max(S.gs|0,d.gs|0);
  if(d.o&&typeof d.o=='object'&&confirm('Berkas ini memuat pengaturan. Terapkan pengaturan dari berkas? (OK = ya, Batal = pertahankan pengaturan sekarang)')){
   S.o=Object.assign(S.o,d.o);if(typeof SENS!='undefined')Object.assign(S.o,SENS);if(Array.isArray(d.f))S.f=d.f.slice();if(Array.isArray(d.gf))S.gf=d.gf.slice();out.push('pengaturan')}
  out.push('progres')}
 if(Array.isArray(d.lib)||Array.isArray(d.sl)){const[a,b]=gmMergeLib(d);gmB.n++;if(typeof libDocs!='undefined'){libDocs.clear();libSD.clear();libAna.clear();libAnaG.clear()}GMEXC.clear();out.push('pustaka (+'+a+' teks, +'+b+' kalimat)')}
 return out}
function gmImpFiles(files){const fs=[...files];if(!fs.length)return;let done=[],bad=0;
 VRS.backup(S,'pre');Promise.all(fs.map(f=>f.text().then(t=>{try{return JSON.parse(t)}catch(_){bad++;return null}}))).then(arr=>{
  try{arr.filter(Boolean).forEach(d=>gmImpData(d).forEach(x=>done.push(x)))}catch(e){bad++}
  save();render();toast(done.length?'Dipulihkan: '+done.join(' · ')+(bad?' · '+bad+' file tidak valid':''):'File tidak valid.')})}

/* ---------- 8. Info versi ---------- */
const GM_NEWS=["Perbaikan soal & contoh dari Pustaka: kalimat kini cocok dengan ENTRI kartu (mis. kartu 吊るす tidak lagi memanggil kalimat 掛ける, 听见 tidak memanggil 听); kartu grammar preposisi Jerman memeriksa Akkusativ/Dativ dari artikelnya.","Trennbare Verben Jerman: 30 verba untrennbar baru (kini 79) dan soal Pilih prefiks kini mencampur verba trennbar + untrennbar (prefiks terlepas di akhir klausa vs menempel pada verba). Pengecoh disaring agar tak pernah jadi jawaban benar kedua (mis. tidak ada \"um-\", \"er-\"+stellen).","Trennbare Verben Jerman bertambah 30 verba trennbar baru (abbiegen, aufessen, auffallen, einfallen, kennenlernen, weiterempfehlen, zusammenfassen, dst.): kini 150 verba trennbar + 49 untrennbar, total 946 kalimat contoh.","Trennbare Verben Jerman kini punya 5 kalimat contoh per verba trennbar dan 4 per verba untrennbar (total 796 kalimat): subjek, pertanyaan, dan perintah yang bervariasi.","Phrasal Verbs Inggris kini punya 5 kalimat contoh per phrasal verb (total 890 kalimat): bentuk lampau, pertanyaan, perintah, kalimat negatif, dan subjek yang bervariasi.","Game baru Trennbare Verben Jerman: 120 verba trennbar + 49 untrennbar, tiap verba punya 2–3 kalimat contoh. Soal: pilih prefiks, bentuk Perfekt, zu-Infinitiv, trennbar vs untrennbar.","Phrasal Verbs Inggris kini punya 3 kalimat contoh per phrasal verb (dipilih acak tiap soal, total 534 kalimat).","Game baru Phrasal Verbs Inggris (grup Inggris di hub Games): 178 phrasal verb dengan kalimat contoh + terjemahan Indonesia, dua jenis soal (pilih partikel, pilih arti), jadwal ulasan sendiri.","Game Tebak Gender dipecah jadi dua: Tebak Gender Jerman (der/die/das) dan Tebak Gender Belanda (de/het), masing-masing dengan hitungan harian sendiri.","Hub Games: urutan default per bahasa (Mandarin, Inggris, Jerman, Belanda) dan tombol “Atur urutan” (▲▼) yang tersimpan.","Kelas AI Pustaka menampilkan jumlah kosakata di level terpilih beserta yang sudah punya contoh terverifikasi.","Tempel banyak kalimat: ada kotak “Prompt yang dipakai” + laporan kartu/grammar yang belum masuk beserta alasannya.","Saat menempel output Kelas AI, tag yang gagal masuk kini ditampilkan sebagai daftar (nomor kalimat, kartu, potongan teks, dan alasannya), bukan hanya jumlahnya.","Kosakata di kalimat Pustaka kini dibedakan: ✓ terverifikasi (bertag AI) diprioritaskan; terdeteksi otomatis tetap dihitung dan dipakai. Hitungan tampil sebagai dua angka. Kartu baru yang terverifikasi muncul lebih dulu, dan kalimat terverifikasi lebih sering jadi soal rumpang.","Perbaikan Kelas AI: kartu yang baru muncul di flashcard (termasuk entri ke-2 dan yang belum diungkap) kini selalu masuk daftar kandidat.","Contoh kalimat Pustaka di flashcard kini punya tombol 🗑 per kalimat (dengan konfirmasi). Kalimat dihapus dari Pustaka dan tidak muncul lagi, termasuk sebagai soal rumpang.","Kartu kosakata kini punya soal kalimat rumpang dari Pustaka. Jerman/Belanda: bagian kosong dimulai dari artikel (der/die/das, de/het) lalu kata bendanya. Tanpa kalimat cocok, kartu tampil seperti biasa. Bisa dimatikan di Pengaturan flashcard.","Game Artikel & Akhiran Jerman/Belanda kini punya jauh lebih banyak kalimat soal (Jerman ≥33 per kasus, Belanda 53 bingkai), tidak berulang berturut-turut, dan penjelasan hasil menyebut alasan kasusnya (mis. mit + Dativ).","Uji headless semua game di hub Games (Tebak Gender, Penggolong, Artikel & Akhiran DE/NL) lolos tanpa error; tidak ada perubahan fitur.","Game Penggolong Mandarin: tiap jawaban kini punya tingkat (baku, lisan lazim, diperdebatkan). Pengaturan baru \"Penerimaan jawaban\" (Baku saja / Baku + lisan lazim / Semua); jawaban di luar tingkat tidak dihitung salah, hanya diberi label. Tombol 🚩 untuk menolak atau menambah jawaban pribadi.","Game Artikel & Akhiran Jerman: soal Genitiv kini memakai daftar kata terkurasi (n-Deklination seperti Junge→Jungen, Name→Namens; -es/-s yang pasti). Kata yang bentuknya tidak pasti dilewati, tidak ditebak.","Games Jerman & Belanda: soal bentuk jamak baru (artikel jamak, akhiran adjektiva jamak, bentuk jamak kata benda, Dativ jamak +n) dari daftar jamak terkurasi (460 kata Jerman, 444 Belanda); aktifkan lewat Pengaturan game → Jenis soal.","Penyimpanan lebih aman: dua tab Vortaro yang terbuka bersamaan kini saling menggabungkan progres (tidak lagi saling menimpa), ada cadangan harian otomatis (kemarin & dua hari lalu) plus cadangan sebelum Hapus/Impor, dan tombol Pulihkan dari cadangan di Atur → Penyimpanan. Ekspor progres kini ikut membawa pengaturan, filter, dan batas harian; impor berkas lama tetap aman.","Kosakata kini punya penjelasan konteks singkat (dari kolom baru di database): tampil di kartu saat jawaban dibuka dan di Daftar kosakata. Di sisi depan kartu, petunjuknya muncul (kata bahasa target disamarkan) bila beberapa kartu berarti sama atau satu kartu punya beberapa kata. Atur di Pengaturan flashcard → Petunjuk konteks.","Soal rumpang kartu grammar kini bisa diambil dari Pustaka: tiap kali kartu muncul, kalimat dipilih acak dari kalimat Pustakamu yang bertag grammar kartu itu (bagian kuncinya dikosongkan, arti Indonesia jadi petunjuk). Kalimat lama tanpa tag ikut dipakai bila pencocok otomatis yakin. Atur → Pengaturan flashcard → Sumber soal rumpang grammar.","Prompt Kelas AI isi Pustaka kini meminta kalimat yang pas untuk soal rumpang: potongan kunci per grammar, jawaban tunggal, minimal 3 kalimat per grammar prioritas.","Perbaikan: tombol Salin di Kelas AI berfungsi lagi; tab Reading/Listening/Dialog/Kalimat di Kelas AI dari flashcard kini memakai prompt yang sama dengan Kelas AI di Pustaka.","Kartu grammar Belanda (A1–C2, 380 kartu) kini memakai soal rumpang seperti Mandarin, Inggris, Jepang dan Jerman. Preposisi, kata kerja + preposisi (hanya preposisinya yang dikosongkan), konjungsi, partikel, kala, pasif dan posisi kata kerja: fungsi + kalimat contoh dengan kata kunci dikosongkan + arti. Kata kerja kuat, konjugasi, pronomen, komparatif, jamak dan daftar kata: soal sel tabel (mis. Imperfectum ik / hij ___).","Terjemahan Indonesia ditambahkan untuk 105 kalimat contoh Belanda yang dipakai sebagai soal.","Kartu grammar Jerman (A1–C1, 386 kartu) kini memakai soal rumpang seperti Mandarin, Inggris dan Jepang. Preposisi: fungsi + kalimat contoh dengan preposisinya dikosongkan + arti. Tabel konjugasi/deklinasi: soal sel tabel (mis. du ___).","Sisi jawaban: judul kecil → rumus/tabel (jawaban ditandai) → fungsi lengkap → kalimat contoh dengan kata kunci ditandai + tombol 🔊 + arti. Kontraksi (im = in dem) dikenali.","Atur → Pengaturan flashcard → Sisi depan kartu grammar: berlaku untuk Mandarin, Inggris, Jepang, Jerman dan Belanda."];
function gmWhen(){const m=GM_AT.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/);if(!m)return GM_AT;const hr=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],bl=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],dt=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));
 return hr[dt.getUTCDay()]+', '+(+m[3])+' '+bl[+m[2]-1]+' '+m[1]+' · pukul '+m[4]+'.'+m[5]+' WIB'}
function verCard(){return`<div class=card><div class=hd><span><b>Vortaro v${GM_VER}</b></span><span class=bdg>terbaru</span></div><small>Diperbarui ${gmWhen()}</small><ul style="margin:8px 0 0;padding-left:18px;font-size:.85rem;line-height:1.5">${GM_NEWS.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`}
function gmDataCard(){const nl=S.lib.length,ns=S.sl.length,nt=S.lib.reduce((a,t)=>a+t.ps.reduce((b,p)=>b+(p.tg?p.tg.filter(Boolean).length:0),0),0)+S.sl.filter(x=>x.tg&&x.tg.length).length;
 return`<div class=card><b>Cadangan data</b><div class=btns style="margin-top:0"><button class=pri data-a=expp>Ekspor progres (JSON)</button><button class=pri data-a=expl>Ekspor pustaka (JSON)</button></div><p class=gsub style="margin:6px 0 8px">Progres: ${Object.keys(S.p).length} kartu bertanda, ${S.lt.h.length} kalimat latihan · Pustaka: ${nl} teks, ${ns} kalimat, ${nt} kalimat bertag.</p><p><small>Impor cadangan</small><br><input type=file accept=.json multiple data-i=imp></p><button data-a=rst>Hapus semua progres</button></div>`}
