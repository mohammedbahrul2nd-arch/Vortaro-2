/* Cetak data bantu untuk generator: node tools/gcl_dump.js -> JSON {cards:{lang:[[id,level,title,pola],...]}, pin:{kata:pinyin}} */
const V=require('../tests/load.js');
const cards={};for(const g of V.D.G){(cards[g[1]]||(cards[g[1]]=[])).push([g[0],g[2],g[4],String(g[6]||'').split('\n')[0]])}
const P='[，。！？、：；“”‘’（）…—,.!?:;"\'()]';const strip=s=>s.replace(new RegExp(P,'g'),'');
const cnt={};const add=(h,p)=>{h=strip(h).trim();p=strip(p).replace(/\s+/g,'').toLowerCase();if(!h||!p||/[a-z]{25}/.test(p))return;(cnt[h]||(cnt[h]={}))[p]=(cnt[h][p]||0)+1};
for(const c of V.D.C){const z=(c[3]||{}).zh;if(z)for(const e of z)if(e[0]&&e[1])add(e[0].replace(/[\s]/g,''),e[1])}
for(const g of V.D.G)if(g[1]=='zh')for(const ex of (g[7]||[])){const L=ex.split('\n');if(L.length<2)continue;const h=strip(L[0]).trim().split(/\s+/),p=strip(L[1]).trim().split(/\s+/);if(h.length==p.length)h.forEach((x,i)=>add(x,p[i]))}
const pin={};for(const h in cnt){pin[h]=Object.entries(cnt[h]).sort((a,b)=>b[1]-a[1])[0][0]}
console.log(JSON.stringify({cards,pin}));
