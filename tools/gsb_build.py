#!/usr/bin/env python3
"""Generator KALIMAT BAWAAN kartu grammar (GSB): python3 tools/gsb_build.py [lang ...]
Sumber: tools/gsb_src/<lang>_<level>.txt  (mis. zh_HSK1.txt)
  #<indeks kartu pada daftar D.G bahasa+level itu, mulai 0> judul (komentar)   <- awal blok kartu (node tests/gcl_report.js --list zh "HSK 1")
  kalimat | arti Indonesia | potongan kunci | sorotan Indonesia
  - zh: kalimat boleh dipisah spasi per kata (pinyin otomatis dari kamus data; override 咱们{zánmen}); disimpan TANPA spasi.
  - ja: kolom 5 = romaji (opsional).  de/nl/en/eo: tanpa romanisasi.
  - kunci: potongan terpendek yang utuh dari kalimat (SATU jawaban wajar); pola terpisah: 'A … B'. Harus muncul TEPAT SEKALI.
  - sorotan: potongan di kolom arti (salin persis, huruf besar/kecil bebas); pola terpisah 'A … B'; '-' bila tak ada padanan.
  Maks 15 kalimat per kartu (GSBN). >=15 -> kartu tidak memakai Pustaka lagi.
Keluaran: docs/js/gsb-<lang>-<level>.js  + sinkron daftar <script> di docs/index.html dan SHELL di docs/sw.js.
"""
import sys,os,re,json,glob
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import gcl_build as G
ROOT=G.ROOT;N=15
CJ=('zh','ja')
def cnt_once(t,k,cj):
    if cj: return t.count(k)
    return len(re.findall(r'(?<![^\W_])'+re.escape(k)+r'(?![^\W_])',t,re.I))
def parts(s): return [x.strip() for x in re.split(r'\s*(?:…|\.\.\.)\s*',s) if x.strip()]
def find_in(text,ps,cj,ci=False):
    t=text.lower() if ci else text;p=0
    for x in ps:
        x=x.lower() if ci else x
        i=t.find(x,p)
        if i<0: return False
        p=i+len(x)
    return True
def build(lang,dmp,files):
    out={};errs=[];warn=[];total=0
    cards=dmp['cards'][lang]
    for f in files:
        lv=re.match(r'^%s_(.+)\.txt$'%lang,os.path.basename(f)).group(1)
        lvc=[c for c in cards if c[1].replace(' ','')==lv]
        cur=None;seen={}
        for ln,raw in enumerate(open(f,encoding='utf8'),1):
            raw=raw.rstrip('\n')
            if not raw.strip(): continue
            m=re.match(r'^#(\d+)\b',raw)
            if m:
                i=int(m.group(1))
                if i>=len(lvc): errs.append('%s:%d indeks kartu %d di luar %d'%(os.path.basename(f),ln,i,len(lvc)));cur=None;continue
                cur=lvc[i][0];out.setdefault(cur,[]);continue
            if raw.startswith('#') or raw.startswith('//'): continue
            ctx='%s:%d'%(os.path.basename(f),ln)
            if cur is None: errs.append(ctx+' baris tanpa kartu');continue
            c=[x.strip() for x in raw.split('|')]
            if len(c)<4: errs.append(ctx+' kurang kolom (kalimat | arti | kunci | sorotan)');continue
            sent,arti,key,hl=c[0],c[1],c[2],c[3];rom=c[4] if len(c)>4 else ''
            flat=re.sub(r'\{[^}]*\}','',sent)
            t=re.sub(r'\s+','',flat) if lang in CJ else re.sub(r'\s+',' ',flat).strip()
            kp=[re.sub(r'\s+','',x) if lang in CJ else x for x in parts(key)]
            if not re.search(r'[。！？.!?]$',t): errs.append(ctx+' kalimat tidak berakhir tanda baca akhir')
            if lang=='zh' and re.search(r'[A-Za-z]',t): errs.append(ctx+' huruf Latin di kalimat zh')
            if not kp: errs.append(ctx+' kunci kosong');continue
            ok=True;p=0
            for x in kp:
                if cnt_once(t,x,lang in CJ)!=1: errs.append(ctx+' kunci %r muncul %d kali (harus 1)'%(x,cnt_once(t,x,lang in CJ)));ok=False;break
                j=t.find(x) if lang in CJ else (re.search(r'(?<![^\W_])'+re.escape(x)+r'(?![^\W_])',t,re.I).start())
                if j<p: errs.append(ctx+' urutan bagian kunci salah');ok=False;break
                p=j+len(x)
            if not ok: continue
            if hl!='-' :
                hp=parts(hl)
                if not hp or not find_in(arti,hp,False,True): errs.append(ctx+' sorotan %r tidak ada di arti'%hl);continue
            else: hl=''
            n=len(re.sub(r'\s+','',t)) if lang in CJ else len(re.findall(r'\w+',t))
            lim=(5,70,16) if lang in CJ else (4,32,6)
            bl=0
            for x in kp:
                w=len(x) if lang in CJ else len(re.findall(r'\w+',x));bl+=w
                if w>lim[2]: warn.append(ctx+' potongan kunci terlalu panjang untuk soal rumpang')
            if len(kp)>3 or n<lim[0] or n>lim[1] or bl>n*.5: warn.append(ctx+' tidak lolos syarat soal rumpang (panjang %d, kunci %d)'%(n,bl))
            nk=t.lower()
            if nk in seen: errs.append(ctx+' kalimat ganda = baris %d (ganti kalimat ini)'%seen[nk]);continue
            seen[nk]=ln
            if lang=='zh': rom=G.pin_tokens(sent,dmp['pin'],errs,ctx)
            if len(out[cur])>=N: errs.append(ctx+' lebih dari %d kalimat untuk kartu ini'%N);continue
            out[cur].append([t,rom,arti,'…'.join(kp) if False else (' … '.join(kp) if len(kp)>1 else kp[0]),hl]);total+=1
    return out,errs,warn,total
def sync(names):
    p=os.path.join(ROOT,'docs','index.html');s=open(p,encoding='utf8').read()
    tags=''.join('<script src="js/%s"></script>'%n for n in names)
    s=re.sub(r'(<script src="js/gsb-[^"]+"></script>)+','',s)
    a='<script src="js/ai-cloze.js"></script>';assert a in s
    s=s.replace(a,tags+a,1);open(p,'w',encoding='utf8').write(s)
    p=os.path.join(ROOT,'docs','sw.js');s=open(p,encoding='utf8').read()
    s=re.sub(r"'js/gsb-[^']+',","",s);a="'js/ai-cloze.js',";assert a in s
    s=s.replace(a,''.join("'js/%s',"%n for n in names)+a,1);open(p,'w',encoding='utf8').write(s)
def main():
    dmp=G.dump();langs=sys.argv[1:] or list(G.OUT);bad=0;names=[]
    for lang in langs:
        for f in sorted(glob.glob(os.path.join(ROOT,'tools','gsb_src',lang+'_*.txt'))):
            lv=re.match(r'^%s_(.+)\.txt$'%lang,os.path.basename(f)).group(1)
            bank,errs,warn,tot=build(lang,dmp,[f])
            for e in errs[:40]: print('  !',e)
            for w in warn[:20]: print('  ~',w)
            if errs: bad+=len(errs)
            full=sum(1 for v in bank.values() if len(v)>=N)
            body=',\n'.join(json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in bank.items() if v)
            fn='gsb-%s-%s.js'%(lang,lv)
            open(os.path.join(ROOT,'docs','js',fn),'w',encoding='utf8').write('/* Kalimat bawaan kartu grammar (%s %s) — DIBUAT oleh tools/gsb_build.py dari tools/gsb_src/%s_%s.txt; jangan edit manual. Baris: [kalimat, romanisasi, arti, kunci, sorotan Indonesia] */\nObject.assign(GSB,{\n%s\n});\n'%(lang,lv,lang,lv,body))
            print(fn,len([v for v in bank.values() if v]),'kartu (%d penuh=%d kalimat)'%(full,N),tot,'kalimat',len(errs),'galat')
    for fn in sorted(os.listdir(os.path.join(ROOT,'docs','js'))):
        if fn.startswith('gsb-'): names.append(fn)
    sync(names);sys.exit(1 if bad else 0)
if __name__=='__main__': main()
