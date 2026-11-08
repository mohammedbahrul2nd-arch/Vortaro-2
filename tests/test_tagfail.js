/* B5: uji daftar tag Kelas AI yang gagal masuk (r.fail). Jalankan: node tests/test_tagfail.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={gmResolveTags,gmApplyTags,libFailHtml,gmCollect,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const {K}=X;let noun,art;
for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const w=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(w)){noun=w.replace(/^\S+\s+/,'');break}}}
const sent=`Ich sehe ${noun} im Park.`;
const tag=['G1 = ','G2 = Judul Tak Ada Sama Sekali',
 `[1] V: ${noun} > ${noun}; V: Xyzzyq > Xyzzyq; V: Xyzzyq > Park; G1: im Park; G2: im Park; kaputt`,
 '[9] V: Hund > Hund','[2] blabla'].join('\n');
const sents={1:sent,2:'Zweiter Satz.'};
const r=X.gmResolveTags(tag,'de',k=>sents[k]==null?null:sents[k]);
const by=re=>r.fail.filter(x=>re.test(x.reason));
ok(Array.isArray(r.fail),'r.fail ada');
ok(r.drop==1&&by(/potongan teks tidak ada/).length==1&&by(/potongan teks tidak ada/)[0].name=='Xyzzyq'&&by(/potongan teks tidak ada/)[0].key=='1','potongan tidak ada di kalimat');
const kk=by(/kartu kosakata tidak ditemukan/);ok(kk.length==1&&kk[0].kind=='V'&&kk[0].surface=='Park','kartu tidak ditemukan (tag tetap disimpan)');
ok(by(/legenda G1/).length==1,'legenda G tidak ada: '+JSON.stringify(by(/legenda/)));
ok(by(/judul grammar tidak cocok/).length==1,'judul grammar tidak cocok');
ok(by(/format tag tidak dikenali/).some(x=>x.name=='kaputt'&&x.key=='1')&&by(/format tag tidak dikenali/).some(x=>x.name=='blabla'&&x.key=='2'),'format baris salah');
ok(by(/nomor kalimat tidak ada/).length==1&&by(/nomor kalimat tidak ada/)[0].key=='9','nomor kalimat tidak ada');
ok(r.unres==2,'unres tetap dihitung: '+r.unres);
ok(r.fail.every(x=>x.key&&x.kind&&x.reason),'semua entri punya key/kind/reason');
/* tag yang sukses tidak masuk daftar gagal */
ok(!r.fail.some(x=>x.name==noun),'tag sukses tidak dilaporkan');
/* gmApplyTags: r.fail + peringatan angka */
const rs={sents:[{n:1,f:sent},{n:2,f:'Zweiter Satz.'}],warn:[]};X.gmApplyTags(rs,tag,'de');
ok(rs.fail.length==r.fail.length,'gmApplyTags mengisi r.fail');ok(rs.warn.some(w=>/dibuang/.test(w))&&rs.warn.some(w=>/tidak cocok dengan kartu/.test(w)),'peringatan angka dipertahankan');
/* tampilan */
const h=X.libFailHtml(rs.fail);ok(h.includes('kalimat <b>1</b>')&&h.includes('<details'),'HTML daftar');ok(!h.includes(' open'),'>5 item -> tertutup');
const h2=X.libFailHtml([{key:'3.1',kind:'V',name:'<img onerror=1>',surface:'x',reason:'a&b'}]);ok(h2.includes(' open')&&!h2.includes('<img')&&h2.includes('&lt;img'),'ter-escape & terbuka bila sedikit');
const big=Array.from({length:55},(_,i)=>({key:String(i),kind:'V',name:'n'+i,surface:'',reason:'r'}));ok(X.libFailHtml(big).includes('dan 15 lainnya'),'dibatasi 40 + sisa');
ok(X.libFailHtml([])===''&&X.libFailHtml(null)==='','kosong -> string kosong');
/* tanpa tag gagal: tidak ada daftar */
const r3=X.gmResolveTags('[1] V: '+noun+' > '+noun,'de',k=>sents[k]==null?null:sents[k]);ok(r3.fail.length==0,'tag bersih -> fail kosong: '+JSON.stringify(r3.fail));
console.log(fail?'ADA GAGAL '+fail:'test_tagfail: lolos');process.exit(fail?1:0);
