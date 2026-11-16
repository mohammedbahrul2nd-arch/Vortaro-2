const V=require('./load.js');let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
for(const l of ['zh','ja','de','nl','en','eo']){const pool=V.shPool(l),b=pool.filter(x=>x.s=='b'),raw=V.SHB[l].split('\n').filter(Boolean);
 T(raw.every(z=>z.split('|').length==3),l+' format');T(b.length>=raw.length-6&&b.length>=80,l+' bawaan '+b.length+'/'+raw.length);
 const lv=new Set(b.map(x=>x.lv));T(lv.size>=3,l+' level '+[...lv]);T(new Set(b.map(x=>x.c)).size>=2,l+' kelas panjang');
 const o=V.GXO('shd_'+l);o.src='b';o.modes=['s','m','l'];o.lv='';const c=V.gxItems('shd_'+l);T(c.length==b.length,l+' sumber Bawaan terfilter '+c.length);o.src='a'}
console.log('test_shb',n,'cek');
