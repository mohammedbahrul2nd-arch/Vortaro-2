/* Game suara & hitung — mesin tampilan bersama (angka, jam & tanggal, harga, shadowing, penghitung).
   Dipakai bersama kerangka games2.js: soal disimpan di gxQ, hasil di gxRes, jadwal SRS di S.gg[q.k].
   Aksi berawalan ggxv… (lihat vgAct). Definisi game ada di VG (gamedata4.js dst.). */
const vgIs=g=>!!VG[g];
const vgDef=g=>VG[g]?JSON.parse(JSON.stringify(VG[g].def)):null;
let vgS={};
const vgRr=()=>{try{if(typeof save=='function')save();if(typeof render=='function')render()}catch(e){}};
function vgNoVoice(l){try{return typeof ttsVoice=='function'&&typeof VZ!='undefined'&&VZ.length>0&&!ttsVoice(l).v}catch(e){return false}}
function vgInp(g){const l=VG[g].lg,o=GXO(g);return srSupported()&&o.inp!='t'&&!(l=='eo'&&srEoMode()=='off')?'v':'t'}
function vgNext(g){const items=VG[g].cells(GXO(g));gxFree=0;if(!items.length)return null;const q=gxQueue(g,items);let it=gxPickQ(q,items),r=null,t=0;
 while(it&&!r&&t++<6){r=VG[g].make(it);if(!r)it=gxRnd(items)}
 if(r){r.g=g;r.k=it.k;r.q={n:Math.min(q.N.length,q.nL),r:Math.min(q.R.length,q.rL),l:q.L.length};r.peek=(vgNoVoice(r.L)&&r.dir=='A')||!!r.showTxt}
 vgS={};return r}
function vgFinish(ok){const q=gxQ,g=q.g,st=gxStat(g),sc=ok?3:1,c=S.gg[q.k],had=c&&c.t;let nx='';
 if(!gxFree){const n=fcCalc(c,sc,Date.now(),true);n.gn=((c&&c.gn)|0)+1;n.go=((c&&c.go)|0)+(ok?1:0);S.gg[q.k]=n;if(!had)st.n++;else if(c.t==2)st.r++;nx=n.t==2?fcFmtD(n.i):fcFmt(n.d-Date.now())}
 st.a++;if(ok)st.ok++;gxSes.n++;if(ok){gxSes.ok++;gxSes.st++;gxSes.best=Math.max(gxSes.best,gxSes.st)}else gxSes.st=0;
 gxRes={sc,next:nx,free:gxFree};buzz(ok?10:[16,40,16])}
function vgSubmit(alts,how){const q=gxQ;if(!q||gxRes)return;srStop();alts=(alts||[]).map(String).filter(z=>z.trim());
 let r={ok:false,got:null};if(alts.length){try{r=q.judge(alts,how)||r}catch(e){r={ok:false,got:null}}}
 vgFinish(!!r.ok);gxRes.heard=alts[0]||'';gxRes.all=alts;gxRes.got=r.got;gxRes.how=how||'';gxRes.skip=!alts.length;vgS={};vgRr()}
function vgMic(){const q=gxQ;if(!q||gxRes)return;if(vgS.on){srStop();vgS={q};return}
 try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
 vgS={on:1,msg:'Mendengarkan… ucapkan sekarang.',q};
 const h=srStart({lang:q.L,alts:5,
  onResult:al=>{if(gxQ!==q||gxRes)return;vgS.on=0;if(S.o.srAuto===0){vgS.pend=al;vgS.msg='';vgRr()}else vgSubmit(al,'voice')},
  onError:(c,m)=>{if(gxQ!==q)return;if(c=='eo-fallback'){vgS.msg=m;vgRr();return}vgS.on=0;vgS.msg=m;if(c=='unsupported'||c=='not-allowed'||c=='service-not-allowed'||c=='audio-capture')vgS.typ=1;vgRr()},
  onEnd:()=>{if(gxQ===q&&vgS.q===q&&vgS.on){vgS.on=0;vgRr()}}});
 if(!h&&vgS.on){vgS.on=0;vgS.typ=1}}
function vgAct(a,x,k){const g=gxCur,q=gxQ;
 if(a=='ggxvsay'&&q){if(q.play)q.play();else say(q.say,q.L);return true}
 if(a=='ggxvslow'&&q&&q.slow){q.slow();return true}
 if(a=='ggxvself'&&q&&!gxRes){vgSubmit([k=='ok'?'ok':'no'],'self');return true}
 if(a=='ggxvagain'&&q&&gxRes){gxRes=null;gxFree=1;q.played=0;vgS={q};return true}
 if(a=='ggxvmic'){vgMic();return true}
 if(a=='ggxvsend'&&q&&!gxRes){const el=document.getElementById('vgin');const v=el?el.value:'';if(!v.trim()){toast('Isi jawaban dulu, atau pilih “Tidak tahu”.');return true}vgSubmit([v],'type');return true}
 if(a=='ggxvskip'&&q&&!gxRes){vgSubmit([],'skip');return true}
 if(a=='ggxvpeek'&&q){q.peek=!q.peek;return true}
 if(a=='ggxvtyp'){vgS.typ=!vgS.typ;return true}
 if(a=='ggxvok'&&q&&!gxRes&&vgS.pend){vgSubmit(vgS.pend,'voice');return true}
 if(a=='ggxvretry'&&q&&!gxRes){vgS={q};vgMic();return true}
 if(a=='ggxvset'&&g&&vgIs(g)){const o=GXO(g);o[x]=k;gxQ=null;gxRes=null;return true}
 return false}
function vgSettings(g){const o=GXO(g),d=VG[g],sup=srSupported();
 let h=`${dtag('gxs_'+g)}<summary><span>Pengaturan game</span></summary><div class=card>`;
 h+=gxChips(d.modeLbl||'Tingkat / jenis soal',Object.keys(d.modes),o.modes,'modes',d.modes);h+=d.extra?d.extra(g,o):'';
 const dn=d.dirs||{A:'Dengar → angka',B:'Lihat → ucapkan'};
 if(!d.noDir)h+=`<small>Arah soal</small><div class=chips>${[['A',dn.A],['B',dn.B],['M','Campur']].map(z=>`<button class="chip${o.dir==z[0]?' on':''}" data-a=ggxvset data-v=dir data-k=${z[0]}>${esc(z[1])}</button>`).join('')}</div>`;
 h+=`<small>Cara menjawab</small><div class=chips><button class="chip${o.inp!='t'?' on':''}" data-a=ggxvset data-v=inp data-k=v${sup?'':' disabled'}>🎤 Ucapkan</button><button class="chip${o.inp=='t'?' on':''}" data-a=ggxvset data-v=inp data-k=t>⌨ Ketik</button></div>`;
 if(!sup)h+=`<small>Browser ini belum mendukung pengenalan suara, jadi mode ⌨ Ketik aktif otomatis.</small>`;
 else if(d.lg=='eo')h+=`<small>Esperanto memakai pengenal cadangan; atur di 🎤 Suara pada daftar game.</small>`;
 h+=`<label class=fcl><span>Soal baru per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:n value="${o.n}" min=0 max=9999></label><label class=fcl><span>Maks. ulasan per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:r value="${o.r}" min=0 max=9999></label><div class=btns><button data-a=ggxrst>Reset jadwal game</button></div></div></details>`;return h}
function vgAns(q,r){const k=q.key||{};const sh=q.dir=='B'||!q.show?'':`<div class=vgbig2>${esc(q.show)}</div>`;
 return `${sh}<div class=gxex1>${spk(q.say,q.L)} <b>${esc(k.main||q.words)}</b></div>${k.sub?`<div class=vgsub>${esc(k.sub)}</div>`:''}${k.tip?`<div class=gxnote>💡 ${esc(k.tip)}</div>`:''}${q.ansHtml||''}${q.resHtml?q.resHtml(r):''}`}
function vgView(g){if(!gxQ){gxQ=vgNext(g);gxRes=null}const q=gxQ;let h=gxHead(g)+vgSettings(g);
 if(!q)return h+`<div class="card empty"><b>Tidak ada soal</b>${VG[g].empty?esc(VG[g].empty(GXO(g))):'Pilih minimal satu tingkat pada pengaturan game.'}</div>`;
 h+=gxMeta(g,q);const r=gxRes,eff=vgInp(g),o=GXO(g);
 h+=`<div class="card gxc"><div class=hd><span>${esc(q.cell)}</span><span>${gxFree?'Latihan bebas':(S.gg[q.k]&&S.gg[q.k].t?esc(fcInfo0(S.gg[q.k])):'Baru')}</span></div>`;
 if(q.dir=='A'){h+=`<div class=vgp><button class=vgplay data-a=ggxvsay aria-label="Putar ulang">🔊</button><small>${eff=='v'?'Dengarkan, lalu ucapkan '+(q.hn||'angkanya')+'.':'Dengarkan, lalu ketik '+(q.hn||'angkanya')+'.'}</small></div>`;
  if(!r){h+=q.peek?`<div class=vgsub>${esc(q.words)}</div>`:'';h+=q.htmlA||'';h+=`<div class=btns><button class=chip data-a=ggxvpeek>${q.peek?'Sembunyikan teks':'Tampilkan teks'}</button></div>`}}
 else h+=`${q.noBig?'':`<div class=vgbig>${esc(q.show)}</div>`}${q.html||''}<small class=vgsm>${eff=='v'?'Ucapkan ':'Ketik '}bacaannya dalam bahasa ${esc(VGLN[q.L])}.</small>`;
 if(!r){const vs=vgS.q===q?vgS:{};
  if(q.self){h+=`<div class=vgmsg>Ucapkan kalimatnya dengan suara keras, lalu nilai sendiri.</div><div class=vgrow><button class=pri data-a=ggxvself data-k=ok>✓ Sudah sama</button><button class=chip data-a=ggxvself data-k=no>↻ Perlu ulang</button></div>`}
  else if(eff=='v'){h+=`<div class=vgrow><button class="pri vgmic${vs.on?' on':''}" data-a=ggxvmic>${vs.on?'● Mendengarkan… (ketuk untuk batal)':'🎤 Ucapkan'}</button></div>`;
   if(vs.pend)h+=`<div class=vgmsg>Terdengar: <b>${esc(vs.pend[0])}</b></div><div class=vgrow><button class=pri data-a=ggxvok>Kirim</button><button class=chip data-a=ggxvretry>🎤 Ulangi</button></div>`;
   if(vs.msg)h+=`<div class=vgmsg>${esc(vs.msg)}</div>`;
   h+=`<div class=vgrow><button class=chip data-a=ggxvtyp>⌨ Ketik jawaban</button></div>`}
  else h+=`<div class=vgmsg>${srSupported()?'Mode ketik.':'Pengenal suara tidak tersedia di browser ini — mode ketik aktif.'}</div>`;
  if(!q.self&&(eff=='t'||vs.typ))h+=`<div class=vgtype><input id=vgin type=text inputmode=${q.inm||(q.kind=='num'&&q.dir=='A'||q.kind=='digits'&&q.dir=='A'?'decimal':'text')} enterkeyhint=done autocomplete=off autocapitalize=off spellcheck=false lang=${q.L=='eo'?'eo':q.L} placeholder="${esc(q.ph||(q.dir=='A'?'Angka':'Bacaan'))}"><button class=pri data-a=ggxvsend>Kirim</button></div>`;
  h+=`<div class=vgrow><button class=chip data-a=ggxvskip>Tidak tahu</button></div>`;
  if(q.dir=='A'&&!q.played&&typeof canSay=='function'&&canSay()){q.played=1;setTimeout(()=>{if(gxQ===q&&!gxRes)q.play?q.play():say(q.say,q.L)},150)}}
 else{const sc=r.sc;
  const heard=r.skip?'<small>Dilewati.</small>':`<div class=gxex1>Kamu: <b>${esc(r.heard)}</b>${r.got!=null&&typeof r.got!='object'&&String(r.got)!=r.heard?` → dikenali <b>${esc(String(r.got))}</b>`:''}</div>`;
  h+=`<div class="ggr ${sc==3?'ok':'bad'}"><b>${sc==3?'✓ Benar':'✗ Belum tepat'}</b>${r.free?'<small>Latihan bebas (tidak mengubah jadwal)</small>':r.next?`<small>Muncul lagi: ${esc(r.next)}</small>`:''}${heard}${vgAns(q,r)}</div><div class=dock><button class=pri data-a=ggxnext>Lanjut</button></div>`}
 return h+`</div>`}
/* daftar di hub */
const VGIC={zh:'数',ja:'一二',de:'123',nl:'123',en:'123',eo:'123'};
VGLG.forEach(l=>{GXL.push({id:'num_'+l,ic:VGIC[l],t:'Menyebutkan nomor — '+VGLN[l],d:'Angka 0–juta, nomor telepon, tahun, desimal, pecahan, ordinal. Dengar → ucapkan, lihat → ucapkan.',tag:l.toUpperCase(),lg:l})});

/* Game 2: jam & tanggal */
VGLG.forEach(l=>{GXL.push({id:'dt_'+l,ic:'🕒',t:'Jam & tanggal — '+VGLN[l],d:'Jam penuh, menit, kuartal/setengah, format 24 jam, tanggal, hari, bulan, tahun. Jam analog & kalender mini. Dengar → jawab, lihat → ucapkan.',tag:l.toUpperCase(),lg:l})});

/* Game 5: penghitung Jepang 助数詞 (data: gamedata6.js) */
GXL.push({id:'jcn',ic:'数え',t:'Penghitung Jepang 助数詞',d:'本・枚・匹・杯・個… Bacaan 1–10 dan 何〜 dengan perubahan bunyi (いっぽん・さんぼん), benda → penggolong. Dengar/lihat → ucapkan atau ketik.',tag:'JA',lg:'ja'});
