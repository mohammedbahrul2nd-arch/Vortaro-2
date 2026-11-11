/* Game suara — jam & tanggal (dt_zh … dt_eo). Murni, tanpa DOM. Pakai mesin games3.js; didaftarkan ke VG. Awalan global jt/JT. */
const JTID={mo:['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],wd:['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']};
const JTMON={zh:[],ja:[],de:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],nl:['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],en:['January','February','March','April','May','June','July','August','September','October','November','December'],eo:['januaro','februaro','marto','aprilo','majo','junio','julio','aŭgusto','septembro','oktobro','novembro','decembro']};
const JTWD={zh:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],ja:['月曜日','火曜日','水曜日','木曜日','金曜日','土曜日','日曜日'],de:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],nl:['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'],en:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],eo:['lundo','mardo','merkredo','ĵaŭdo','vendredo','sabato','dimanĉo']};
for(let i=1;i<=12;i++){JTMON.zh.push(zhW(i)+'月');JTMON.ja.push(jaN(i)+'月')}
const JTM={h:'Jam penuh',hm:'Jam + menit',qh:'Kuartal & setengah',h24:'Format 24 jam',dt:'Tanggal',wdd:'Hari + tanggal',mo:'Bulan',yr:'Tanggal + tahun',both:'Jam & tanggal sekaligus'};
const JTDIR={A:'Dengar → ketik/ucapkan',B:'Lihat → ucapkan'};
const JTTT={
 zh:'点 = jam, 两点 (bukan 二点) untuk 2. Menit: 15 = 一刻, 30 = 半, 45 = 三刻 (atau 差一刻…点); 3:05 = 三点零五分 (零 menandai puluhan kosong). Keterangan waktu: 凌晨 / 上午 / 中午 / 下午 / 晚上.',
 ja:'4時 = よじ, 7時 = しちじ, 9時 = くじ. 分: ふん / ぷん (1, 3, 4, 6, 8, 10 → ぷん; 2, 5, 7, 9 → ふん). 半 (はん) = :30. 午前 = pagi, 午後 = siang/sore.',
 de:'halb drei = 2:30 (setengah MENUJU tiga!). Viertel nach / Viertel vor, zehn nach, zwanzig vor. Resmi (24 jam): vierzehn Uhr dreißig.',
 nl:'half drie = 2:30 (setengah MENUJU tiga!). kwart over / kwart voor; 2:20 = tien voor half drie; 2:40 = tien over half drie. Resmi: veertien uur dertig.',
 en:'past / to: quarter past two, half past two (= 2:30), twenty to three. Digital: two oh five (2:05), fourteen thirty (14:30), fourteen hundred (14:00).',
 eo:'la dua kaj duono = 2:30; kvarono antaŭ la tria = 2:45; 5 menit: la dua kaj kvin. Resmi: la dek-kvara horo kaj tridek minutoj.'};
const JTTD={
 zh:'Urutan besar → kecil: tahun 年, bulan 月, tanggal 号 (lisan) / 日 (tulis), lalu 星期. Tahun digit demi digit: 二零二六年.',
 ja:'日: 1 ついたち, 2 ふつか, 3 みっか, 4 よっか, 5 いつか, 6 むいか, 7 なのか, 8 ようか, 9 ここのか, 10 とおか, 14 じゅうよっか, 20 はつか, 24 にじゅうよっか; bulan: 4 しがつ, 7 しちがつ, 9 くがつ.',
 de:'Tanggal pakai bilangan ordinal: der fünfte März (1. erste, 3. dritte, 7. siebte, 8. achte; 20.+ -ste). Tahun: zweitausendsechsundzwanzig.',
 nl:'Tanggal pakai bilangan pokok: vijf maart (juga de vijfde maart). Hari lebih dulu: donderdag vijf maart. Tahun: tweeduizend zesentwintig.',
 en:'AS: March fifth. Inggris: the fifth of March. Ordinal: first, second, third, fifth, twelfth, twentieth. Tahun: twenty twenty-six.',
 eo:'la kvina de marto (ordinal -a, bulan berakhiran -o). Hari: lundo, mardo, merkredo, ĵaŭdo, vendredo, sabato, dimanĉo.'};
const JTPY=[['凌晨','língchén'],['上午','shàngwǔ'],['中午','zhōngwǔ'],['下午','xiàwǔ'],['晚上','wǎnshang'],['星期','xīngqī'],['一刻','yí kè'],['三刻','sān kè'],['差','chà'],['半','bàn'],['分','fēn'],['整','zhěng'],['月','yuè'],['号','hào'],['日','rì'],['年','nián'],['点','diǎn'],['零','líng'],['一','yī'],['二','èr'],['三','sān'],['四','sì'],['五','wǔ'],['六','liù'],['七','qī'],['八','bā'],['九','jiǔ'],['十','shí'],['两','liǎng']];
function jtPy(s){let r=[],i=0;while(i<s.length){const z=JTPY.find(p=>s.startsWith(p[0],i));if(z){r.push(z[1]);i+=z[0].length}else i++}return r.join(' ')}
const jtH12=h=>h%12||12;
/* ---- kana Jepang ---- */
const JAHU=['','いち','に','さん','よ','ご','ろく','しち','はち','く'],JAMU=['','いっ','に','さん','よん','ご','ろっ','なな','はっ','きゅう'],JAMT=['','じゅっ','にじゅっ','さんじゅっ','よんじゅっ','ごじゅっ'];
function jaHK(h){if(h==0)return 'れい';if(h<10)return JAHU[h];return (h<20?'じゅう':JAHU[h/10|0]+'じゅう')+JAHU[h%10]}
function jaMK(m){if(m==0)return '';const t=m/10|0,u=m%10;if(u==0)return JAMT[t]+'ぷん';const pre=t==0?'':(t==1?'じゅう':JAHU[t]+'じゅう');return pre+JAMU[u]+([1,3,4,6,8].includes(u)?'ぷん':'ふん')}
const JADAY={1:'ついたち',2:'ふつか',3:'みっか',4:'よっか',5:'いつか',6:'むいか',7:'なのか',8:'ようか',9:'ここのか',10:'とおか',14:'じゅうよっか',20:'はつか',24:'にじゅうよっか'};
function jaDK(d){if(JADAY[d])return JADAY[d];const t=d/10|0,u=d%10;return (t==0?'':t==1?'じゅう':JAHU[t]+'じゅう')+(u?JAHU[u]:'')+'にち'}
const JAMOK=['','いち','に','さん','し','ご','ろく','しち','はち','く','じゅう','じゅういち','じゅうに'],JAWK=['げつようび','かようび','すいようび','もくようび','きんようび','どようび','にちようび'];
/* ---- jam: kembalikan {say,words,sub} ---- */
function jtZh(h,m,st){const f=st=='f',hh=f?h:jtH12(h),hz=hh==2?'两':vgW(hh,'zh'),pre=f?'':(h<6?'凌晨':h<12?'上午':h==12?'中午':h<18?'下午':'晚上');let w;
 if(f)w=hz+'点'+(m?(m<10?'零':'')+vgW(m,'zh')+'分':'整');
 else if(m==45&&h!=12&&h!=0&&Math.random()<.4){const nx=jtH12(h)%12+1;w='差一刻'+(nx==2?'两':vgW(nx,'zh'))+'点'}
 else w=hz+'点'+(m==0?'':m==15?'一刻':m==30?'半':m==45?'三刻':(m<10?'零':'')+vgW(m,'zh')+'分');
 w=pre+w;return {say:w,words:w,sub:jtPy(w)}}
function jtJa(h,m,st){const f=st=='f',hh=f?h:jtH12(h),pre=f?'':(h<12?'午前':'午後'),kp=f?'':(h<12?'ごぜん':'ごご');
 const w=pre+vgW(hh,'ja')+'時'+(m==0?'':m==30&&!f?'半':vgW(m,'ja')+'分'),k=kp+jaHK(hh)+'じ'+(m==0?'':m==30&&!f?'はん':jaMK(m));
 return {say:k,words:w,sub:k}}
function jtDe(h,m,st){const f=st=='f',hh=f?h:jtH12(h),nx=jtH12(hh)%12+1,W=x=>vgW(x,'de'),HU=x=>(x==1?'ein':W(x))+' Uhr',HN=x=>x==1?'eins':W(x);let w;
 const exact={5:'fünf nach '+HN(hh),10:'zehn nach '+HN(hh),15:'Viertel nach '+HN(hh),20:'zwanzig nach '+HN(hh),25:'fünf vor halb '+HN(nx),30:'halb '+HN(nx),35:'fünf nach halb '+HN(nx),40:'zwanzig vor '+HN(nx),45:'Viertel vor '+HN(nx),50:'zehn vor '+HN(nx),55:'fünf vor '+HN(nx)};
 if(m==0)w=HU(hh);else if(!f&&exact[m])w=exact[m];else w=HU(hh)+' '+W(m);return {say:w,words:w,sub:''}}
function jtNl(h,m,st){const f=st=='f',hh=f?h:jtH12(h),nx=jtH12(hh)%12+1,W=x=>vgW(x,'nl');let w;
 const exact={5:'vijf over '+W(hh),10:'tien over '+W(hh),15:'kwart over '+W(hh),20:'tien voor half '+W(nx),25:'vijf voor half '+W(nx),30:'half '+W(nx),35:'vijf over half '+W(nx),40:'tien over half '+W(nx),45:'kwart voor '+W(nx),50:'tien voor '+W(nx),55:'vijf voor '+W(nx)};
 if(m==0)w=W(hh)+' uur';else if(!f&&exact[m])w=exact[m];else w=W(hh)+' uur '+W(m);return {say:w,words:w,sub:''}}
function jtEn(h,m,st){const f=st=='f',hh=f?h:jtH12(h),nx=jtH12(hh)%12+1,W=x=>vgW(x,'en');let w;
 const exact={5:'five past '+W(hh),10:'ten past '+W(hh),15:'quarter past '+W(hh),20:'twenty past '+W(hh),25:'twenty-five past '+W(hh),30:'half past '+W(hh),35:'twenty-five to '+W(nx),40:'twenty to '+W(nx),45:'quarter to '+W(nx),50:'ten to '+W(nx),55:'five to '+W(nx)};
 if(f)w=m==0?W(hh)+' hundred':W(hh)+' '+(m<10?'oh ':'')+W(m);
 else if(m==0)w=W(hh)+" o'clock";else if(exact[m]&&Math.random()<.8)w=exact[m];else w=W(hh)+' '+(m<10?'oh ':'')+W(m);
 return {say:w,words:w,sub:''}}
function jtEo(h,m,st){const f=st=='f',hh=f?h:jtH12(h),nx=jtH12(hh)%12+1,O=x=>vgOrd(x,'eo'),W=x=>vgW(x,'eo');let w;
 if(f)w='la '+O(hh)+' horo'+(m?' kaj '+W(m)+' minutoj':'');
 else if(m==0)w='la '+O(hh);else if(m==15)w='la '+O(hh)+' kaj kvarono';else if(m==30)w='la '+O(hh)+' kaj duono';else if(m==45)w='kvarono antaŭ la '+O(nx);
 else if(m>30&&m%5==0)w=W(60-m)+' minutoj antaŭ la '+O(nx);else w='la '+O(hh)+' kaj '+W(m);
 return {say:w,words:w,sub:''}}
function jtSay(h,m,l,st){return l=='zh'?jtZh(h,m,st):l=='ja'?jtJa(h,m,st):l=='de'?jtDe(h,m,st):l=='nl'?jtNl(h,m,st):l=='en'?jtEn(h,m,st):jtEo(h,m,st)}
/* ---- tanggal ---- */
const jtWdIso=(y,m,d)=>(new Date(Date.UTC(y,m-1,d)).getUTCDay()+6)%7+1;
const jtDim=(y,m)=>new Date(Date.UTC(y,m,0)).getUTCDate();
function jtDateSay(o,l){/* o:{y?,m?,d?,wd?,full} → {say,words,sub} */
 const {y,m,d,wd}=o,MN=m?JTMON[l][m-1]:'',WN=wd?JTWD[l][wd-1]:'';let w='',k='';
 if(l=='zh'){w=(y?vgYear(y,'zh')+'年':'')+(m?MN:'')+(d?vgW(d,'zh')+'号':'')+WN;return {say:w,words:w,sub:jtPy(w)}}
 if(l=='ja'){w=(y?vgYear(y,'ja')+'年':'')+(m?MN:'')+(d?vgW(d,'ja')+'日':'')+WN;
  k=(y?jaK(y)+'ねん':'')+(m?JAMOK[m]+'がつ':'')+(d?jaDK(d):'')+(wd?JAWK[wd-1]:'');
  return {say:k,words:w,sub:k}}
 if(l=='de'){w=(WN?WN+', ':'')+(d?'der '+vgOrd(d,'de')+' ':'')+MN+(y?' '+vgYear(y,'de'):'');return {say:w.trim(),words:w.trim(),sub:''}}
 if(l=='nl'){w=(WN?WN+' ':'')+(d?vgW(d,'nl')+' ':'')+MN+(y?' '+vgYear(y,'nl'):'');return {say:w.trim(),words:w.trim(),sub:''}}
 if(l=='en'){const uk=o.uk;w=(WN?WN+', ':'')+(uk&&d?'the '+vgOrd(d,'en')+' of '+MN:(MN?MN+' ':'')+(d?vgOrd(d,'en'):''))+(y?' '+vgYear(y,'en'):'');return {say:w.trim(),words:w.trim(),sub:''}}
 w=(WN?WN+', ':'')+(d?'la '+vgOrd(d,'eo')+' de ':'')+MN+(y?' de '+vgYear(y,'eo'):'');return {say:w.trim(),words:w.trim(),sub:''}}
function jtDateShow(y,m,d,wd,withY){return JTID.wd[wd-1]+', '+d+' '+JTID.mo[m-1]+(withY?' '+y:'')}
/* ---- HTML ---- */
function jtClock(h,m){const a=(h%12+m/60)*30,b=m*6;let t='';for(let i=0;i<12;i++){const r=i*30*Math.PI/180,x1=50+Math.sin(r)*40,y1=50-Math.cos(r)*40,x2=50+Math.sin(r)*(i%3?43:37),y2=50-Math.cos(r)*(i%3?43:37);t+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="${i%3?1:2}"/>`}
 [['12',50,22],['3',78,53],['6',50,84],['9',22,53]].forEach(z=>{t+=`<text x="${z[1]}" y="${z[2]}" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor">${z[0]}</text>`});
 return `<div class=vgclkw><svg class=vgclk viewBox="0 0 100 100" role=img aria-label="Jam analog"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="2.5"/>${t}<line x1="50" y1="50" x2="50" y2="29" stroke="currentColor" stroke-width="4" stroke-linecap="round" transform="rotate(${a.toFixed(1)} 50 50)"/><line x1="50" y1="50" x2="50" y2="14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" transform="rotate(${b} 50 50)"/><circle cx="50" cy="50" r="3" fill="currentColor"/></svg></div>`}
function jtCal(y,m,d){const f=jtWdIso(y,m,1),n=jtDim(y,m);let h=`<div class=vgcal><div class=vgcalt>${JTID.mo[m-1]} ${y}</div><div class=vgcalg>`+['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((x,i)=>`<b${i>4?' class=we':''}>${x}</b>`).join('');
 for(let i=1;i<f;i++)h+='<i></i>';for(let i=1;i<=n;i++)h+=`<span${i==d?' class=on':''}>${i}</span>`;return h+'</div></div>'}
/* ---- penilai ---- */
function jtOkT(a,e,l,strict){return srJudgeTime(a,e,l,strict).ok}
function jtDnum(a,l){const m=String(a).match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})(?:\s*[\/.\-]\s*(\d{2,4}))?/);if(!m)return null;const g={},ord=(l=='en'||l=='zh'||l=='ja')?[m[1],m[2]]:[m[2],m[1]];g.m=+ord[0];g.d=+ord[1];if(m[3])g.y=+m[3]<100?2000+ +m[3]:+m[3];if(g.m>12||g.d>31)return null;
 const rest=String(a).replace(m[0],' ').trim();if(rest){let w=srDate(rest,l);if(w&&w.wd)g.wd=w.wd;else if(l!='zh'&&l!='ja'){const t=srAsc(rest.toLowerCase().replace(/ß/g,'ss').replace(/[.,]/g,'')).trim(),i=t.length>=2?JTWD[l].findIndex(x=>srAsc(x.toLowerCase()).startsWith(t)):-1;if(i>=0)g.wd=i+1}}return g}
function jtOkD(a,e,l){for(const z of a||[]){const g=srDate(z,l);if(g&&srDateEq(g,e))return true;
  if(l=='ja'&&e.y!==undefined){const ym=String(z).replace(/\s+/g,'').match(/^(.+?)年/);if(ym){const y=jaStrict(ym[1]),g2=srDate(String(z).replace(/\s+/g,'').replace(ym[0],''),l);if(y!==null&&g2){g2.y=y;if(srDateEq(g2,e))return true}}}const n=jtDnum(z,l);if(n&&srDateEq(n,e))return true;
  if(e.m!==undefined&&e.d===undefined&&e.y===undefined&&e.wd===undefined&&/^\d{1,2}$/.test(String(z).trim())&&+String(z).trim()==e.m)return true}return false}
function jtJudgeT(alts,e,l,strict,words){const r=srJudgeTime(alts,e,l,strict);if(r.ok)return {ok:true,got:srFmtTime(r.got)};
 if(l=='eo'&&words&&srPhonPick(alts||[],words)>=0)return {ok:true,got:srFmtTime(e),phon:true};return {ok:false,got:r.got?srFmtTime(r.got):null}}
function jtGotD(g){return g?[g.y,g.m,g.d].filter(x=>x!==undefined).join('/')+(g.wd?' ('+JTID.wd[g.wd-1]+')':''):null}
function jtJudgeD(alts,e,l,words){if(jtOkD(alts,e,l))return {ok:true,got:jtGotD(e)};
 if(l=='eo'&&words&&srPhonPick(alts||[],words)>=0)return {ok:true,got:jtGotD(e),phon:true};
 const g=alts&&alts.length?(srDate(alts[0],l)||jtDnum(alts[0],l)):null;return {ok:false,got:jtGotD(g)}}
function jtJudgeBoth(alts,e,l,words){for(const a0 of alts||[]){const t=String(a0).trim(),cj=l=='zh'||l=='ja',u=cj?[...t.replace(/\s+/g,'')]:t.split(/\s+/),j=cj?'':' ';
  const tm=t.match(/\d{1,2}\s*[:：]\s*\d{2}(?:\s*[ap]\.?\s?m\.?)?/i);
  if(tm&&jtOkT([tm[0]],e.t,l,false)&&jtOkD([t.replace(tm[0],' ')],e.d,l))return {ok:true,got:srFmtTime(e.t)+' · '+jtGotD(e.d)};
  for(let i=1;i<u.length;i++){const L=u.slice(0,i).join(j),R=u.slice(i).join(j);
   if(jtOkD([L],e.d,l)&&jtOkT([R],e.t,l,false)||jtOkT([L],e.t,l,false)&&jtOkD([R],e.d,l))return {ok:true,got:srFmtTime(e.t)+' · '+jtGotD(e.d)}}}
 if(l=='eo'&&words&&srPhonPick(alts||[],words)>=0)return {ok:true,got:'',phon:true};
 return {ok:false,got:alts&&alts.length?alts[0]:null}}
/* ---- soal ---- */
const pad2=n=>String(n).padStart(2,'0');
function jtPickTime(lv,l){let h,m=0;const cj=l=='zh'||l=='ja';
 if(lv=='h24'){h=vgRi(13,23);m=Math.random()<.5?0:vgRi(0,11)*5}
 else{h=cj?vgRi(0,23):vgRi(1,12);
  if(lv=='hm'){do m=vgRi(1,59);while(m%15==0&&Math.random()<.7)}
  else if(lv=='qh'){m=Math.random()<.7?vgPick([15,30,45]):vgRi(1,11)*5}
  else if(lv=='both'){m=vgRi(0,11)*5}}
 return {h,m}}
function jtRandDate(withY){const y=withY?vgRi(1950,2035):vgRi(2024,2031),m=vgRi(1,12),d=vgRi(1,jtDim(y,m));return {y,m,d,wd:jtWdIso(y,m,d)}}
function jtMake(c){const l=c.l,lv=c.lv,dir=c.dir,q={L:l,dir,cell:JTM[lv]+' · '+(dir=='A'?'dengar':'lihat')+' → '+(dir=='A'?'ketik/ucapkan':'ucapkan')};
 const tipT=JTTT[l],tipD=JTTD[l];
 if(lv=='h'||lv=='hm'||lv=='qh'||lv=='h24'){const {h,m}=jtPickTime(lv,l),f=lv=='h24',cj=l=='zh'||l=='ja',s=jtSay(h,m,l,f?'f':'c'),H=cj||f?h:jtH12(h);
  const e={h:H,m,amb:!(cj||f)};q.exp=e;q.say=s.say;q.words=s.words;q.hn='jamnya';q.kind='time';q.ph='mis. 14:30';q.inm='text';
  q.show=cj&&!f?pad2(h)+':'+pad2(m):f?pad2(h)+':'+pad2(m):jtH12(h)+':'+pad2(m);
  if(dir=='B'&&!f&&Math.random()<.5){q.html=jtClock(h,m);q.noBig=true}
  q.ansHtml=jtClock(h,m);q.key={main:s.words,sub:s.sub,tip:tipT,x:''};
  q.judge=a=>jtJudgeT(a,e,l,f,[s.say,s.words]);return q}
 if(lv=='both'){const {h,m}=jtPickTime('both',l),dd=jtRandDate(false),cj=l=='zh'||l=='ja',s=jtSay(h,m,l,'c'),ds=jtDateSay({m:dd.m,d:dd.d,wd:dd.wd,uk:Math.random()<.4},l);
  const conn={de:'um ',nl:'om ',en:'at ',eo:'je ',zh:'',ja:''}[l],sep=cj?'':', ';
  const e={t:{h:cj?h:jtH12(h),m,amb:!cj},d:{m:dd.m,d:dd.d,wd:dd.wd}};
  q.exp=e;q.say=ds.say+sep+conn+s.say;q.words=ds.words+sep+conn+s.words;q.hn='jam & tanggalnya';q.kind='both';q.ph='mis. 5/3 14:30';q.inm='text';
  q.show=jtDateShow(dd.y,dd.m,dd.d,dd.wd,false)+' · '+(cj?pad2(h)+':'+pad2(m):jtH12(h)+':'+pad2(m));
  q.ansHtml=jtClock(h,m)+jtCal(dd.y,dd.m,dd.d);q.key={main:q.words,sub:(ds.sub&&s.sub)?ds.sub+' · '+s.sub:'',tip:tipD+' '+tipT,x:''};
  q.judge=a=>jtJudgeBoth(a,e,l,[q.say,q.words]);return q}
 if(lv=='mo'){const m=vgRi(1,12),s=jtDateSay({m},l),e={m};q.exp=e;q.say=s.say;q.words=s.words;q.hn='nomor bulannya';q.kind='mo';q.ph='nomor bulan 1–12';q.inm='numeric';
  q.show=JTID.mo[m-1]+' (bulan ke-'+m+')';q.ansHtml=jtCal(2026,m,0);q.key={main:s.words,sub:s.sub,tip:tipD,x:''};q.judge=a=>jtJudgeD(a,e,l,[s.say,s.words]);return q}
 /* dt, wdd, yr */
 const dd=jtRandDate(lv=='yr'),uk=Math.random()<.4,o=lv=='dt'?{m:dd.m,d:dd.d,uk}:lv=='wdd'?{m:dd.m,d:dd.d,wd:dd.wd,uk}:{y:dd.y,m:dd.m,d:dd.d,uk},s=jtDateSay(o,l);
 const e=lv=='dt'?{m:dd.m,d:dd.d}:lv=='wdd'?{wd:dd.wd,m:dd.m,d:dd.d}:{y:dd.y,m:dd.m,d:dd.d};
 q.exp=e;q.say=s.say;q.words=s.words;q.hn=lv=='wdd'?'hari & tanggalnya':'tanggalnya';q.kind='date';q.ph=(l=='en'||l=='zh'||l=='ja')?'mis. 3/5 = bulan/hari':'mis. 5/3 = hari/bulan';q.inm='text';
 q.show=lv=='dt'?dd.d+' '+JTID.mo[dd.m-1]:jtDateShow(dd.y,dd.m,dd.d,dd.wd,lv=='yr');
 if(dir=='B')q.html=jtCal(dd.y,dd.m,dd.d);q.ansHtml=jtCal(dd.y,dd.m,dd.d);
 q.key={main:s.words,sub:s.sub,tip:tipD,x:''};q.judge=a=>jtJudgeD(a,e,l,[s.say,s.words]);return q}
function jtCells(l,o){const cs=[];for(const lv of o.modes)for(const dir of (o.dir=='M'?['A','B']:[o.dir]))cs.push({k:'jt|'+l+'|'+lv+'|'+dir,l,lv,dir});return cs}
VGLG.forEach(l=>{VG['dt_'+l]={lg:l,pre:'jt|'+l+'|',modes:JTM,dirs:JTDIR,def:{n:10,r:200,modes:['h','hm','qh','dt'],dir:'M',inp:'v'},cells:o=>jtCells(l,o),make:c=>jtMake(c)}});
