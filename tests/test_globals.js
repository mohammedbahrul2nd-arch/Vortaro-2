/* Deteksi deklarasi global ganda antar berkas JS seperti browser: semua berkas dijalankan berurutan di SATU konteks vm.
   Galat lain (stub kurang) diabaikan; yang dilaporkan hanya 'has already been declared'. node tests/test_globals.js */
const fs=require('fs'),path=require('path'),vm=require('vm');const dir=path.join(__dirname,'..','docs','js');
const idx=fs.readFileSync(path.join(__dirname,'..','docs','index.html'),'utf8');
const files=[...idx.matchAll(/<script src="js\/([^"]+)"/g)].map(m=>m[1]).filter(f=>f!='data.js').concat(['app.js']);
const noop=new Proxy(function(){},{get:(t,k)=>k==Symbol.toPrimitive?()=>'':noop,apply:()=>noop,construct:()=>noop,set:()=>true});
const ctx=vm.createContext({console:{log(){},warn(){},error(){}},document:noop,window:noop,navigator:noop,localStorage:noop,indexedDB:noop,setTimeout:()=>0,setInterval:()=>0,clearTimeout(){},addEventListener(){},BroadcastChannel:function(){return noop},Notification:noop,matchMedia:()=>noop,requestAnimationFrame:()=>0,speechSynthesis:noop,location:noop});
let bad=0;
for(const f of files){try{vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),ctx,{filename:f})}catch(e){if(/already been declared/.test(e.message)){bad++;console.log(`GANDA di ${f}: ${e.message}`)}}}
console.log(bad?bad+' bentrok':'tidak ada deklarasi global ganda ('+files.length+' berkas)');process.exit(bad?1:0);
