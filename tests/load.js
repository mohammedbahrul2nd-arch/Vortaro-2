/* Pemuat uji: gabungkan data.js + games.js + gamedata.js + games2.js dalam vm dengan stub UI. Pakai: const V=require('./load.js') */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},gg:{},gxd:null};
const ctx={console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,
 esc:s=>String(s),ik:(a,b)=>b+':'+a,fcCalc:(c,sc)=>({t:2,d:0,i:1}),fcDay:t=>Math.floor(t/864e5),fcFmt:x=>''+x,fcFmtD:x=>''+x,fcInfo0:()=>'',
 dtag:()=>'',spk:()=>'',say:()=>{},buzz:()=>{},ggMin:a=>a[0],ggQ:()=>({L:[],R:[],N:[],ah:[],nL:0,rL:0}),ggGenAct:()=>{},ggGenSet:()=>{},ggGenView:()=>'',document:{},window:{},navigator:{},scrollTo:()=>{}};
vm.createContext(ctx);
const src=J('data.js')+'\n'+J('games.js')+'\n'+J('gamedata.js')+'\n'+J('gamedata2.js')+'\n'+J('gamedata3.js')+'\n'+J('games2.js')+'\n;this.X={DTV,DTU,DTM,DTR,DTA,DTUP,DTX,DTG,dtAll,dtMake,dtCells,dtFull,PHV,PHM,phAll,phMake,phCells,phPtOpts,phArOpts,phFull,FR_DE,FR_NL,DEFR,DEPLF,NLFRO,NLFRP,NLFRS,NLFRZ,NLFR,frPick,FRB,DEPLM,NLPLM,D,S,zcAns,zcMake,zcAll,zcPool,ZCT,ZCN,ZCL,ZCV,ZCTN,zcRes,GXO,ggAll,deCells,nlCells,deMake,nlMake,gxNext,gxItems,gxScore,plDeAll,plNlAll,dePlPool,nlPlPool,dePlDer,nlPlDer,dePlDat,dePlUm,deGen,DEGSRC,dePool,PLDE_SRC,PLNL_SRC,DEPLM,NLPLM,DEPLP,NLPLP,plAmb,gxEq,gxFinish:typeof gxFinish!="undefined"?gxFinish:null};';
vm.runInContext(src,ctx,{filename:'bundle.js'});
module.exports=ctx.X;
