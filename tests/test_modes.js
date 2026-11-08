/* A4: uji semua sel soal Jerman/Belanda (semua mode x kasus): tanpa error, tanpa undefined/NaN. node tests/test_modes.js */
const X=require('./load.js');let fail=0,tot=0,nul=0;const ok=(c,m)=>{if(!c){fail++;if(fail<15)console.log('GAGAL:',m)}};
const bad=s=>/undefined|NaN|\[object|null/.test(s);
function chk(q,tag){tot++;if(!q){nul++;return}const s=JSON.stringify(q.blanks||q)+JSON.stringify(q.full||'')+JSON.stringify(q.expl||'');ok(!bad(s),tag+' '+s.slice(0,160))}
const cs=(typeof X.deCells=='function'?X.deCells({n:6,r:200,modes:['ad','ai','jd','ji','mx','an','pa','pj','pf','pd'],cases:['Nom','Akk','Dat','Gen'],lv:[]}):[]);
ok(cs.length>0,'deCells kosong');
for(const c of cs)for(let i=0;i<60;i++){let q;try{q=X.deMake(c)}catch(e){ok(0,'THROW de '+JSON.stringify(c).slice(0,80)+e.message);continue}chk(q,'de '+JSON.stringify(c).slice(0,60))}
const nc=(typeof X.nlCells=='function'?X.nlCells({n:4,r:200,modes:['art','dem','adj','pla','pld','plf'],lv:[]}):[]);
console.log('sel DE',cs.length,'sel NL',nc.length);
for(const c of nc)for(let i=0;i<60;i++){let q;try{q=X.nlMake(c)}catch(e){ok(0,'THROW nl '+JSON.stringify(c).slice(0,80)+e.message);continue}chk(q,'nl '+JSON.stringify(c).slice(0,60))}
console.log('soal',tot,'null',nul,'gagal',fail);process.exit(fail?1:0);
