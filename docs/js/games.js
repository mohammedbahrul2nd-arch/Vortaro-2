/* ===== Games (v7.8): Tebak gender noun — Jerman (der/die/das) & Belanda (de/het). SRS terpisah dari flashcard utama (S.gg). ===== */
const GGL={de:{a:['der','die','das'],re:/^((?:der|die|das)(?:\/(?:der|die|das))*)(\s+)(.+)$/i,n:'Jerman'},nl:{a:['de','het'],re:/^((?:de|het)(?:\/(?:de|het))*)(\s+)(.+)$/i,n:'Belanda'}};
const ggO=()=>{const o=S.o;if(!S.gg)S.gg={};if(!S.ggd)S.ggd={d:-1,n:0,r:0,x:0};if(!GGL[o.ggl])o.ggl='de';if(!o.ggvs||typeof o.ggvs!='object')o.ggvs={};if(o.ggn==null)o.ggn=10;if(o.ggr==null)o.ggr=200;return o};
let ggC={},ggCur=null,ggRes=null,ggUn=0;
function ggAll(L){if(ggC[L])return ggC[L];const g=GGL[L],out=[];
 for(const c of D.C){if(c[1]!='N')continue;const e=(c[3][L]||[])[0];if(!e)continue;const m=String(e[0]).trim().match(g.re);if(!m||m[1].includes('/'))continue;out.push({k:ik(c[0],L),b:c[0],c,e,art:m[1].toLowerCase(),w:m[3],lv:e[3]||''})}
 return ggC[L]=out}
const ggLv=L=>{const l=D.L.find(x=>x[0]==L);return l?l[4]:[]};
function ggPool(L){const o=ggO(),v=o.ggvs[L]||[];return ggAll(L).filter(x=>(!v.length||v.includes(x.lv))&&!(S.gg[x.k]&&S.gg[x.k].z))}
function ggRoll(){const d=fcDay(Date.now());if(S.ggd.d!==d)S.ggd={d,n:0,r:0,x:0}}
function ggQ(){ggRoll();const o=ggO(),now=Date.now(),td=fcDay(now),sd=S.ggd,L=[],R=[],N=[],ah=[];
 for(const x of ggPool(o.ggl)){const c=S.gg[x.k];if(!c||!c.t){N.push(x);continue}
  if(c.t==2){if(c.d<=td)R.push(x)}else if(c.d<=now)L.push(x);else if(c.d<=now+12e5)ah.push(x)}
 return{L,R,N,ah,nL:Math.max(0,o.ggn+(sd.x|0)-sd.n),rL:Math.max(0,o.ggr-sd.r)}}
const ggMin=a=>a.reduce((x,y)=>S.gg[x.k].d<=S.gg[y.k].d?x:y);
function ggPick(q){if(q.L.length)return ggMin(q.L);const nn=Math.min(q.N.length,q.nL),rr=Math.min(q.R.length,q.rL);
 const pn=()=>q.N[Math.random()*q.N.length|0],pr=()=>q.R[Math.random()*q.R.length|0];
 if(nn&&rr)return Math.random()<nn/(nn+rr)?pn():pr();if(rr)return pr();if(nn)return pn();if(q.ah.length)return ggMin(q.ah);return null}
function ggAns(art){if(!ggCur||ggRes)return;const o=ggO(),x=ggCur,ok=art==x.art,c=S.gg[x.k],had=c&&c.t;ggRoll();
 const n=fcCalc(c,ok?3:1,Date.now(),true);n.gn=((c&&c.gn)|0)+1;n.go=((c&&c.go)|0)+(ok?1:0);n.gl=ok?1:0;S.gg[x.k]=n;
 if(!had)S.ggd.n++;else if(c.t==2)S.ggd.r++;
 ggRes={ok,pick:art,next:n.t==2?fcFmtD(n.i):fcFmt(n.d-Date.now())};buzz(ok?10:[16,40,16])}
function ggGenAct(a,x,k){const o=ggO();
 if(a=='ggans')ggAns(x);
 else if(a=='ggnext'){ggCur=null;ggRes=null}
 else if(a=='gglang'){if(GGL[x]){o.ggl=x;ggCur=null;ggRes=null}}
 else if(a=='gglv'){const v=(o.ggvs[o.ggl]||[]).slice(),i=v.indexOf(x);i<0?v.push(x):v.splice(i,1);o.ggvs[o.ggl]=v;ggCur=null;ggRes=null}
 else if(a=='gglvall'){o.ggvs[o.ggl]=[];ggCur=null;ggRes=null}
 else if(a=='ggmore')S.ggd.x=(S.ggd.x|0)+10
 else if(a=='ggsay'){say(x,o.ggl)}
 else if(a=='ggrst'){if(confirm('Hapus semua jadwal game Tebak gender?')){S.gg={};S.ggd={d:-1,n:0,r:0,x:0};ggCur=null;ggRes=null}}}
function ggGenSet(i,el){const o=ggO(),f=i.slice(3),v=parseInt(el.value);if(isFinite(v)&&(f=='n'||f=='r'))o['gg'+f]=Math.max(0,Math.min(9999,v));ggCur=null;ggRes=null}
const ggCls=a=>({der:'m',die:'f',das:'n',de:'m',het:'n'}[a]||'');
function ggGenView(){const o=ggO(),L=o.ggl,q=ggQ();
 if(ggCur&&(!ggPool(L).includes(ggCur)&&!ggRes||ggCur.k.split('@')[1]!=L)){ggCur=null;ggRes=null}
 if(!ggCur){ggCur=ggPick(q);ggRes=null}
 const lvs=ggLv(L),sel=o.ggvs[L]||[],nn=Math.min(q.N.length,q.nL),rr=Math.min(q.R.length,q.rL),ln=q.L.length;
 let h=`<div class=deckbar role=tablist>${Object.keys(GGL).map(l=>`<button role=tab class="${l==L?'on':''}" data-a=gglang data-v=${l}><span>${GGL[l].n}</span><small>${ggAll(l).length.toLocaleString('id-ID')} kata benda</small></button>`).join('')}</div>`+
  `${dtag('ggf')}<summary><span>Filter &amp; pengaturan</span>${sel.length?`<em class=cnt>${sel.length} level</em>`:''}</summary><div class=card><small>Level</small><div class=chips><button class="chip${sel.length?'':' on'}" data-a=gglvall>Semua</button>${lvs.map(v=>`<button class="chip${sel.includes(v)?' on':''}" data-a=gglv data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`+
  `<label class=fcl><span>Kata baru per hari</span><input type=number inputmode=numeric data-i=gg_n value="${o.ggn}" min=0 max=9999></label><label class=fcl><span>Maks. ulasan per hari</span><input type=number inputmode=numeric data-i=gg_r value="${o.ggr}" min=0 max=9999></label><div class=btns><button data-a=ggrst>Reset jadwal game</button></div></div></details>`+
  `<div class=fcc><span class=k1><b>${nn}</b><small>Baru</small></span><span class=k2><b>${ln}</b><small>Belajar</small></span><span class=k3><b>${rr}</b><small>Ulas</small></span></div>`;
 if(!ggCur){h+=`<div class="card empty"><b>${ggPool(L).length?'Selesai untuk saat ini 🎉':'Tidak ada kata'}</b>${ggPool(L).length?`Hari ini: ${S.ggd.n} baru · ${S.ggd.r} ulasan`:'Ubah filter level.'}${q.N.length?`<div class=btns><button data-a=ggmore>+10 kata baru</button></div>`:''}</div>`;return h}
 const x=ggCur,r=ggRes,A=GGL[L].a;
 h+=`<div class="card ggc"><div class=hd><span>${GGL[L].n}${x.lv?' · '+esc(x.lv):''}</span><span>${S.gg[x.k]&&S.gg[x.k].t?esc(fcInfo0(S.gg[x.k])):'Baru'}</span></div><div class=ggw>${r?`<span class="gga ${ggCls(x.art)}">${esc(x.art)}</span> `:'<span class=ggq>?</span> '}${esc(x.w)}${spk(r?x.art+' '+x.w:x.w,L)}</div><div class=ggm>${esc(x.c[2])}</div>`+
  `<div class="ggb n${A.length}">${A.map(a=>`<button class="ggo ${ggCls(a)}${r&&a==x.art?' ok':''}${r&&a==r.pick&&!r.ok?' bad':''}" data-a=ggans data-v=${a}${r?' disabled':''}>${a}</button>`).join('')}</div>`+
  (r?`<div class="ggr ${r.ok?'ok':'bad'}"><b>${r.ok?'✓ Benar':'✗ Salah'}</b> — ${esc(x.art+' '+x.w)}<small>Muncul lagi: ${esc(r.next)}</small>${x.e[2]?`<div class=ex>${esc(x.e[2])}</div>`:''}</div><div class=dock><button class=pri data-a=ggnext>Lanjut</button></div>`:'')+`</div>`;
 return h}
/* hasil game tampil di sisi jawaban flashcard utama */
function ggInfo(k){const L=lang(k);if(!GGL[L])return'';const x=ggAll(L).find(z=>z.k==k);if(!x)return'';const c=S.gg&&S.gg[k],td=fcDay(Date.now());
 let st;if(!c||!c.t)st='belum dimainkan';else{const d=c.t==2?c.d-td:0;st=c.t==2?`Ulas · ${c.i} hr · ${d<=0?'hari ini':d==1?'besok':'+'+d+' hr'}`:'Belajar'}
 const acc=c&&c.gn?` · ${c.go|0}/${c.gn} benar`:'';
 return `<div class=ggi><span>🎮 Tebak gender</span><b>${esc(x.art)}</b><small>${st}${acc}</small></div>`}
