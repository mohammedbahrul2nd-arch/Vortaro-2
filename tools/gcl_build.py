#!/usr/bin/env python3
"""Generator bank GCX: python3 tools/gcl_build.py [lang ...]
Sumber ringkas: tools/gcl_src/<lang>_<level>.txt  (mis. zh_HSK1.txt, de_A1.txt)
  #<indeks kartu pada daftar D.G bahasa+level itu, mulai 0> judul kartu (komentar)   <- awal blok kartu
  kalimat dengan ___ | jawaban | terjemah Indonesia | petunjuk | [pengecoh terlarang a~b]
  jawaban: alternatif dipisah ~ (yang pertama = utama); beberapa celah dipisah ;  (mis. 不但~不仅;而且~也)
  zh: kalimat dipisah spasi per kata (gaya data); pinyin dibuat otomatis dari kamus data; override: 咱们{zánmen}
  ja: romaji/kana tulis manual di kolom 5 sebagai  romaji   (kolom ke-5), pengecoh di kolom 6
Keluaran: docs/js/gamedata15.js (zh), 16 (ja), 17 (de), 18 (en), 19 (nl), 20 (eo) -> Object.assign(GCX,{...})
"""
import sys,os,re,json,subprocess,glob
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT={'zh':'gamedata15.js','ja':'gamedata16.js','de':'gamedata17.js','en':'gamedata18.js','nl':'gamedata19.js','eo':'gamedata20.js'}
LVSORT={'zh':['HSK1','HSK2','HSK3','HSK4','HSK5'],'ja':['N5','N4','N3','N2','N1'],'de':['A1','A2','B1','B2','C1'],'en':['A1','A2','B1','B2','C1','C2'],'nl':['A1','A2','B1','B2','C1','C2'],'eo':['A1','A2','B1','B2','C1','C2']}
PUN='，。！？、：；“”‘’（）…—,.!?:;"\'()'
BAD=re.compile(r'undefined|\bnull\b|\bNaN\b|\[object')
PIN_EXTRA={'号楼':'hàolóu','不一会儿':'bùyíhuìr','什么的':'shénmede','玩':'wán','照相':'zhàoxiàng','一会儿':'yíhuìr','妹妹':'mèimei','姐姐':'jiějie','爸爸':'bàba','零':'líng','第':'dì','们':'men','地':'de','得':'de','的':'de','了':'le','都':'dōu','还':'hái','觉得':'juéde','睡觉':'shuìjiào','没':'méi','哪':'nǎ','几':'jǐ','什么':'shénme','一起':'yìqǐ','一边':'yìbiān','一块儿':'yíkuàir','早点儿':'zǎodiǎnr','玩儿':'wánr','事':'shì','把':'bǎ','钥匙':'yàoshi','有点儿':'yǒudiǎnr','点儿':'diǎnr','一点儿':'yìdiǎnr','李':'lǐ','画儿':'huàr','照相机':'zhàoxiàngjī','玫瑰':'méigui','奇怪':'qíguài','欧洲':'Ōuzhōu','并':'bìng','机':'jī','觉':'jiào','第一':'dìyī','里':'li','南':'nán','个个':'gègè','活儿':'huór','难怪':'nánguài','怪':'guài','鸟儿':'niǎor','瓶子':'píngzi','灰尘':'huīchén'}  # koreksi/kamus tambahan (menimpa hasil otomatis)
def dump():
    r=subprocess.run(['node',os.path.join(ROOT,'tools','gcl_dump.js')],capture_output=True,text=True,check=True,cwd=ROOT)
    d=json.loads(r.stdout);d['pin'].update(PIN_EXTRA);return d
def pin_tokens(s,pin,errs,ctx):
    out=[]
    s=re.sub(r'([^\s{}'+re.escape(PUN)+r']+(?:\{[^}]*\})?)',r' \1 ',re.sub(r'(\{[^}]*\})',lambda m:m.group(1).replace(' ','\u0001'),s))
    for tok in s.split():
        tok=tok.replace('\u0001',' ')
        m=re.match(r'^(.*?)\{([^}]+)\}$',tok)
        if m: out.append(m.group(2));continue
        lead=re.match('^['+re.escape(PUN)+']*',tok).group(0);tr=re.search('['+re.escape(PUN)+']*$',tok).group(0)
        core=tok[len(lead):len(tok)-len(tr)] if len(tok)>len(lead)+len(tr) else ''
        if not core: out.append(tok);continue
        segs=[];i=0
        if core in pin: segs=[pin[core]]
        else:
            while i<len(core):
                for j in range(len(core),i,-1):
                    if core[i:j] in pin: segs.append(pin[core[i:j]]);i=j;break
                else:
                    if re.match(r'[A-Za-z0-9]',core[i]): segs.append(core[i]);i+=1
                    else: errs.append('pinyin? %r di %s'%(core[i:],ctx));segs.append('?');i=len(core)
        out.append(lead+''.join(segs)+tr)
    r=' '.join(out)
    for a,b in {'，':',','。':'.','！':'!','？':'?','、':',','：':':','；':';','“':'"','”':'"'}.items(): r=r.replace(a,b)
    r=re.sub(r'\s+([,.!?:;])',r'\1',r)
    for k,c in enumerate(r):
        if c.isalpha(): r=r[:k]+c.upper()+r[k+1:];break
    return r
def parse_answers(a,ngap):
    gaps=[[x.strip() for x in g.split('~') if x.strip()] for g in a.split(';')]
    if len(gaps)!=ngap: raise ValueError('jumlah celah %d != jawaban %d'%(ngap,len(gaps)))
    if any(not g for g in gaps): raise ValueError('jawaban kosong')
    return gaps[0] if ngap==1 else [g[0] if len(g)==1 else g for g in gaps]
def build(lang,dmp,files):
    cards=dmp['cards'][lang];pin=dmp['pin'];bank={};errs=[];nq=0
    for f in files:
        lv=re.match(r'^%s_(.+)\.txt$'%lang,os.path.basename(f)).group(1)
        lvn=lv.replace('HSK','HSK ')
        lst=[c for c in cards if c[1]==lvn]
        cur=None;seen=set()
        for ln,raw in enumerate(open(f,encoding='utf8'),1):
            raw=raw.rstrip('\n')
            if not raw.strip() or raw.startswith('//'): continue
            ctx='%s:%d'%(os.path.basename(f),ln)
            if raw.startswith('#'):
                m=re.match(r'^#(\d+)',raw)
                if not m: errs.append('baris # salah '+ctx);continue
                i=int(m.group(1))
                if i>=len(lst): errs.append('indeks kartu %d di luar %d %s'%(i,len(lst),ctx));cur=None;continue
                cur=lst[i][0];seen.add(i);bank.setdefault(cur,[]);continue
            if cur is None: errs.append('soal tanpa kartu '+ctx);continue
            p=[x.strip() for x in raw.split('|')]
            if len(p)<3: errs.append('kolom kurang '+ctx);continue
            sent,ans,tr=p[0],p[1],p[2];hint=p[3] if len(p)>3 else '';extra=p[4] if len(p)>4 else '';ban=p[5].split('~') if len(p)>5 and p[5] else []
            if lang=='zh': ban=extra.split('~') if extra else [];extra=''
            ng=sent.count('___')
            if ng<1: errs.append('tanpa ___ '+ctx);continue
            try: a=parse_answers(ans,ng)
            except Exception as e: errs.append('%s %s'%(e,ctx));continue
            disp=re.sub(r'\{[^}]*\}','',sent)
            gl=[a] if ng==1 else [g if isinstance(g,list) else [g] for g in a]
            filled=sent
            for g in gl: filled=filled.replace('___',g[0],1)
            if BAD.search(sent+tr+hint): errs.append('kata terlarang '+ctx)
            q=[disp,a,tr,hint]
            if lang=='zh': q.append(pin_tokens(filled,pin,errs,ctx))
            elif extra: q.append(extra)
            else: q.append('')
            if ban: q.append(ban)
            while q and q[-1]=='' : q.pop()
            bank[cur].append(q);nq+=1
        for i,c in enumerate(lst):
            if i not in seen: errs.append('kartu %d (%s) belum ada di %s'%(i,c[2],os.path.basename(f)))
    for k,v in bank.items():
        if len(v)<2: errs.append('kartu %s hanya %d soal'%(k,len(v)))
    return bank,errs,nq
def main():
    dmp=dump();langs=sys.argv[1:] or list(OUT)
    bad=0
    for lang in langs:
        files=sorted(glob.glob(os.path.join(ROOT,'tools','gcl_src',lang+'_*.txt')),key=lambda f:LVSORT[lang].index(re.match(r'^%s_(.+)\.txt$'%lang,os.path.basename(f)).group(1)) if re.match(r'^%s_(.+)\.txt$'%lang,os.path.basename(f)).group(1) in LVSORT[lang] else 99)
        if not files: continue
        bank,errs,nq=build(lang,dmp,files)
        for e in errs[:60]: print('  !',e)
        if errs: bad+=len(errs);print(lang,'GALAT',len(errs))
        body=',\n'.join(json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in bank.items())
        hdr='/* Bank soal Grammar Cloze (%s) — DIBUAT oleh tools/gcl_build.py dari tools/gcl_src/%s_*.txt; jangan edit manual. Format: lihat gamedata14.js */\n'%(lang,lang)
        open(os.path.join(ROOT,'docs','js',OUT[lang]),'w',encoding='utf8').write(hdr+'Object.assign(GCX,{\n'+body+'\n});\n')
        print(lang,len(bank),'kartu',nq,'soal ->',OUT[lang])
    sys.exit(1 if bad else 0)

if __name__=='__main__': main()
