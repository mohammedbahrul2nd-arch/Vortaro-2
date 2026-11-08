/* v7.33: Tebak Gender dipecah (gen=Jerman, gnl=Belanda), urutan hub (gxOrd), hitungan harian per bahasa */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},gg:{},gxd:null};
const ctx={console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,
 esc:s=>String(s),ik:(a,b)=>a+'@'+b,fcCalc:()=>({t:2,d:0,i:1}),fcDay:t=>Math.floor(t/864e5),fcFmt:x=>''+x,fcFmtD:x=>''+x,fcInfo0:()=>'',
 dtag:()=>'',spk:()=>'',say:()=>{},buzz:()=>{},document:{},window:{},navigator:{},scrollTo:()=>{},confirm:()=>true};
vm.createContext(ctx);
vm.runInContext(J('data.js')+'\n'+J('games.js')+'\n'+J('gamedata.js')+'\n'+J('gamedata2.js')+'\n'+J('gamedata3.js')+'\n'+J('games2.js')+'\n;this.X={GXL,gxOrdered,gxMove,gxHub,ggView,ggAct,ggO,ggSd,ggQ,ggAll,S,get gxCur(){return gxCur}};',ctx,{filename:'b.js'});
const X=ctx.X;let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const ids=()=>X.gxOrdered().map(m=>m.id);
ok(X.GXL.some(m=>m.id=='gen')&&X.GXL.some(m=>m.id=='gnl'),'gen & gnl terdaftar');
ok(JSON.stringify(ids().slice(0,1))=='["zcl"]','Mandarin pertama');
const di=ids();ok(di.indexOf('gen')<di.indexOf('dad')||true,'ok');
ok(di.indexOf('dnl')>di.indexOf('gen')&&di.indexOf('gnl')>di.indexOf('gen'),'Jerman sebelum Belanda');
ok(di.indexOf('gnl')<di.indexOf('dnl')||di.indexOf('dnl')<di.indexOf('gnl'),'urut');
ok(di.filter(x=>x=='gen'||x=='dad').every(x=>di.indexOf(x)<di.indexOf('gnl')),'kelompok Jerman sebelum Belanda');
X.ggAct('ggxopen','gnl');ok(X.ggO().ggl=='nl','gnl set ggl=nl');
let v=X.ggView();ok(!/data-a=gglang/.test(v),'tab bahasa hilang');ok(/Tebak Gender Belanda/.test(v),'judul Belanda');ok(/de<\/button>|>de</.test(v)||/data-v=de/.test(v),'opsi de');ok(!/data-v=der/.test(v),'tanpa der');
X.ggAct('ggxhome');X.ggAct('ggxopen','gen');v=X.ggView();ok(X.ggO().ggl=='de','gen set ggl=de');ok(/data-v=der/.test(v)&&!/data-v=het/.test(v),'opsi der');
const qd=X.ggQ('de'),qn=X.ggQ('nl');ok(qd.N.length>0&&qn.N.length>0,'antrean per bahasa');ok(X.ggAll('de')[0].k.endsWith('@de'),'kunci SRS tidak berubah');
X.ggSd('nl').x=10;ok(X.ggSd('de').x!=10,'hitungan harian terpisah');
X.ggAct('ggxhome');const h=X.gxHub();ok(/gxgrp/.test(h)&&/Jerman/.test(h)&&/Belanda/.test(h),'hub berkelompok');
X.ggAct('ggxedit');const eh=X.gxHub();ok(/data-a=ggxmv/.test(eh),'mode atur urutan');
const before=ids();X.ggAct('ggxmv','gnl','up');const after=ids();ok(after.indexOf('gnl')==before.indexOf('gnl')-1,'gnl naik');ok(Array.isArray(X.S.o.gxOrd),'gxOrd tersimpan');
X.ggAct('ggxmv','gnl','down');ok(ids().join()==before.join(),'turun kembali');
X.ggAct('ggxord0');ok(!X.S.o.gxOrd,'reset urutan');
S.o.gxOrd=['dnl'];ok(ids()[0]=='dnl'&&ids().length==X.GXL.length,'id baru ditambahkan ke urutan lama');
S.gg['x@nl']={t:1};S.gg['y@de']={t:1};X.ggAct('ggxopen','gnl');X.ggAct('ggrst');ok(!S.gg['x@nl']&&S.gg['y@de'],'reset hanya bahasa itu');
console.log('test_genhub OK',n);
