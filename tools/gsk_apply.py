#!/usr/bin/env python3
"""Gabungkan kosakata N3 (tools/gsk_src/kosakata_N3_gabungan_clean.csv) ke docs/js/data.js (D.C, bahasa ja, level N3)
dan tulis KALIMAT BAWAAN kosakata ke docs/js/gsk-ja-N3.js (GSK, kunci kartu = <konsep>@ja[~indeks]).
Aturan: tanpa duplikasi (dicek dari teks Jepangnya saja); bila entri sudah ada di database, kalimat bawaan CSV dipasang pada entri itu
(entri yang punya kalimat bawaan yang dipakai), tidak ada entri baru. Idempoten: dijalankan ulang tidak menambah entri.
Pakai: python3 tools/gsk_apply.py [--dry]"""
import csv,re,json,sys,os,unicodedata,collections
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY='--dry' in sys.argv
rows=list(csv.reader(open(os.path.join(ROOT,'tools','gsk_src','kosakata_N3_gabungan_clean.csv'),encoding='utf-8-sig')))[1:]
dp=os.path.join(ROOT,'docs','js','data.js');s=open(dp,encoding='utf-8').read()
i0=s.find('"C":[')+4;C,i1=json.JSONDecoder().raw_decode(s,i0)
def nz(t): return re.sub(r'\s+','',unicodedata.normalize('NFKC',t).strip())
def forms(t):
    t=nz(t);o={t}
    o.add(re.sub(r'[()]','',t));o.add(re.sub(r'\([^)]*\)','',t))
    return {x for x in o if x}
def vlist(t): return [v for v in re.split(r'[／/]',t) if nz(v)]
PART=re.compile(r'[一-鿿ァ-ヶー々][をがにでは]')
def pure(t): return len(vlist(t))>1 and not any(PART.search(nz(v)) for v in vlist(t))
LV={'N3':0,'N2':1,'N4':2,'N5':3}
dbf=collections.defaultdict(list)   # bentuk -> [(ci,idx)]
cid={c[0]:n for n,c in enumerate(C)}
for n,c in enumerate(C):
    for j,e in enumerate(c[3].get('ja',[])):
        for f in forms(e[0]): dbf[f].append((n,j))
        for v in vlist(e[0]):
            for f in forms(v): dbf[f].append((n,j))
def toks(t): return set(re.findall(r'[a-z0-9]+',t.lower()))
def posmap(jen,ja,arti):
    if jen.startswith('Verba'): return 'V'
    if jen.startswith('Adjektiva'): return 'A'
    if jen.startswith('Nomina') or jen.startswith('Pronomina'): return 'N'
    if jen=='Frasa':
        j=nz(ja.split('／')[0])
        if re.search(r'(る|う|く|ぐ|す|つ|ぬ|ぶ|む|ない|ている|てある|ます)$',j): return 'V'
        return 'O'
    return 'O'
def cap(t): return t[:1].upper()+t[1:]
add={}      # (ci,idx) -> kalimat
newc=[];st=collections.Counter();log=[]
for r in rows:
    no,ja,rom,jen,arti,ctx=r[:6];sents=[]
    for x in r[6:]:
        x=x.strip()
        if x and x not in sents: sents.append(x)
    cand=set()
    for f in forms(ja): cand.update(dbf.get(f,[]))
    if not cand and pure(ja):
        for v in vlist(ja):
            for f in forms(v): cand.update(dbf.get(f,[]))
    if cand:
        T=toks(arti)
        def sc(p):
            n,j=p;e=C[n][3]['ja'][j];return (LV.get(e[3],9),-len(T&toks(C[n][0].split(':',1)[1].replace('~',' '))),n,j)
        best=sorted(cand,key=sc)[0]
        st['cocok_db']+=1
        if sents:
            a=add.setdefault(best,[])
            for x in sents:
                if x not in a: a.append(x)
            st['cocok_db_berkalimat']+=1
        continue
    P=posmap(jen,ja,arti);a=arti.strip().replace(';','~')
    cidn=P+':'+a.lower();w=' / '.join(v.strip() for v in vlist(ja))
    e=[w,rom.strip(),sents[0] if sents else '','N3']+([ctx.strip()] if ctx.strip() else [])
    if cidn in cid: n=cid[cidn];st['gabung_konsep']+=1
    else:
        C.append([cidn,P,cap(a),{}]);n=len(C)-1;cid[cidn]=n;st['konsep_baru']+=1
    C[n][3].setdefault('ja',[]).append(e);j=len(C[n][3]['ja'])-1
    for f in forms(w): dbf[f].append((n,j))
    st['entri_baru']+=1
    if sents: add[(n,j)]=sents;st['baru_berkalimat']+=1
for f in sorted(os.listdir(os.path.join(ROOT,'docs','js'))): pass
out={}
for (n,j),a in sorted(add.items()):
    out[C[n][0]+'@ja'+('~%d'%j if j>0 else '')]=a
print(dict(st),'kunci GSK',len(out),'kalimat',sum(len(v) for v in out.values()))
if DRY: sys.exit(0)
seg=json.dumps(C,separators=(',',':'),ensure_ascii=False)
open(dp,'w',encoding='utf-8').write(s[:i0]+seg+s[i1:])
hd='/* Kalimat bawaan KOSAKATA (ja N3) — DIBUAT oleh tools/gsk_apply.py dari tools/gsk_src/kosakata_N3_gabungan_clean.csv; jangan edit manual. Kunci = kartu kosakata (<konsep>@ja[~indeks]); nilai = daftar kalimat (tanpa terjemahan/sorotan: sorotan dihitung otomatis). */\nObject.assign(GSK,{\n'
body=',\n'.join(json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in out.items())
open(os.path.join(ROOT,'docs','js','gsk-ja-N3.js'),'w',encoding='utf-8').write(hd+body+'\n});\n')
