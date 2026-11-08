const V=require('./load.js');const assert=require('assert');
const {S,GXO,zcAns,zcMake,zcAll,ZCT,gxScore,zcRes}=V;
let n=0;const T=(c,m)=>{assert(c,m);n++};
const all=zcAll(),by=k=>all.find(x=>x.k==k);
// 1 kunci ZCT valid
for(const k in ZCT){if(k[0]=='#')continue;const [z,c]=k.split(':'),x=all.find(a=>a.t=='n'&&a.zh==z);T(x&&x.cl.includes(c),'ZCT tak cocok '+k);T('ld'.includes(ZCT[k]),'tingkat '+k)}
// 2 mode penerimaan
const o=GXO('zcl'),x=by('zc|铅笔');
o.acc='l';let A=zcAns(x);T(A.ok.join()=='支'&&A.soft.join()=='枝','铅笔 default');
o.acc='a';A=zcAns(x);T(A.ok.length==2&&!A.soft.length,'semua');
o.acc='b';const r=by('zc|人');A=zcAns(r);T(A.ok.join()=='个,位'&&A.soft.join()=='口','人 ketat');
o.acc='l';A=zcAns(r);T(A.ok.length==3,'人 lazim');
// 3 skor: ketat, memilih lisan tidak salah, tidak wajib
o.acc='b';let q=zcMake(r);q.sel=[new Set(['个','位'])];T(gxScore(q)==3,'baku saja = 3');
q.sel=[new Set(['个','位','口'])];T(gxScore(q)==3,'lisan tidak dihitung salah');
q.sel=[new Set(['个','位','杯'])];T(gxScore(q)==1,'salah tetap salah');
q.sel=[new Set(['个'])];T(gxScore(q)==2,'kurang = sebagian');
// 4 override
o.acc='l';o.ov={'zc|人':{rej:['口'],add:['张']}};A=zcAns(r);T(!A.all.some(a=>a.c=='口')&&A.tier['张']=='u'&&A.ok.includes('张'),'override');
o.ov={'zc|人':{rej:['个','位','口'],add:[]}};A=zcAns(r);T(A.ok.length>=1,'penolakan semua dijaga');
o.ov={};
// 5 acak 3000 soal: opsi memuat semua jawaban, tanpa undefined
for(const m of['b','l','a']){o.acc=m;for(let i=0;i<1000;i++){const it=all[i%all.length];q=zcMake(it);const b=q.blanks[0];T(b.ok.length>0,'ok kosong '+it.k);for(const c of q.A.all.map(a=>a.c))T(b.opts.includes(c),'opsi hilang');T(new Set(b.opts).size==b.opts.length,'opsi ganda');
 q.sel=[new Set(b.ok)];T(gxScore(q)==3,'skor sempurna');const h=zcRes(q);T(!/undefined|NaN/.test(h),'undefined di hasil '+it.k)}}
console.log('test_zcl OK',n,'asersi');
