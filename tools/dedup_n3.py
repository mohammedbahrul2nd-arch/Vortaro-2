#!/usr/bin/env python3
"""Hapus duplikasi kosakata N3 yang sudah ada di N4/N5 (v7.111.0).

Duplikat = entri ja level N3 yang teks Jepangnya (NFKC, tanpa spasi) sama persis dengan entri ja level N4 atau N5
(boleh beda konsep). Yang dihapus selalu entri N3; entri N4/N5 tidak disentuh.

Keluaran:
  docs/js/data.js        entri N3 duplikat dihapus; konsep yang jadi kosong dibuang; indeks entri ja bergeser
  docs/js/gsk-ja-N3.js   kunci kalimat bawaan ikut dipetakan (kalimat entri yang dihapus dipindah ke kartu N4/N5-nya)
  docs/js/dedup-n3.js    tabel pemetaan kunci kartu LAMA -> BARU + fungsi migrasi progres pengguna (ddMig)
Sekali jalan: bila docs/js/dedup-n3.js sudah ada, skrip berhenti (pemetaan harus dihitung dari data LAMA).
Pakai: python3 tools/dedup_n3.py [--dry]"""
import json,re,sys,os,unicodedata,collections
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY='--dry' in sys.argv
JS=os.path.join(ROOT,'docs','js')
OUT=os.path.join(JS,'dedup-n3.js')
if os.path.exists(OUT) and not DRY: sys.exit('dedup-n3.js sudah ada: migrasi sudah pernah dibuat (hapus manual hanya bila ingin mengulang dari data lama).')
dp=os.path.join(JS,'data.js');s=open(dp,encoding='utf-8').read()
i0=s.find('"C":[')+4;C,i1=json.JSONDecoder().raw_decode(s,i0)
nz=lambda t:re.sub(r'\s+','',unicodedata.normalize('NFKC',t).strip())
key=lambda n,j:C[n][0]+'@ja'+('~%d'%j if j>0 else '')
low=collections.defaultdict(list)
for n,c in enumerate(C):
    for j,e in enumerate(c[3].get('ja',[])):
        if e[3] in('N4','N5'): low[nz(e[0])].append((n,j))
rm={}   # (n,j) N3 duplikat -> [(n,j) target]
for n,c in enumerate(C):
    for j,e in enumerate(c[3].get('ja',[])):
        if e[3]=='N3' and nz(e[0]) in low: rm[(n,j)]=low[nz(e[0])]
# indeks baru entri yang bertahan
newidx={};gone=set()   # gone = indeks konsep yang tak punya entri sama sekali lagi
for n,c in enumerate(C):
    ja=c[3].get('ja',[])
    if not ja: continue
    k=0
    for j,e in enumerate(ja):
        if (n,j) in rm: continue
        newidx[(n,j)]=k;k+=1
    if k==0 and len(c[3])==1: gone.add(n)
mv={key(*a):[key(t[0],newidx[t]) for t in v] for a,v in rm.items()}
rn={key(n,j):key(n,k) for (n,j),k in newidx.items() if k!=j}
cm={C[n][0]:sorted({C[t[0]][0] for a in rm if a[0]==n for t in rm[a]}) for n in gone}
# --- tulis data.js
D=[]
for n,c in enumerate(C):
    if n in gone: continue
    ja=c[3].get('ja')
    if ja:
        keep=[e for j,e in enumerate(ja) if (n,j) not in rm]
        if keep: c[3]['ja']=keep
        else: del c[3]['ja']
    D.append(c)
print('entri N3 dihapus',len(rm),'| konsep dibuang',len(gone),'| kunci dipetakan',len(mv),'| kunci bergeser',len(rn),'| target ganda',sum(len(v)>1 for v in mv.values()))
lv=collections.Counter(e[3] for c in D for e in c[3].get('ja',[]))
print('ja per level sesudah:',dict(lv))
# --- GSK
gp=os.path.join(JS,'gsk-ja-N3.js');g=open(gp,encoding='utf-8').read()
GSK={}
class _G:
    pass
body=g[g.index('Object.assign(GSK,')+len('Object.assign(GSK,'):g.rindex('});')+1]
GSK=json.loads(body)
new={};moved=0
for k,v in GSK.items():
    if k in mv: continue
    nk=rn.get(k,k)
    assert nk not in new,('tabrakan GSK',k,nk)
    new[nk]=list(v)
for k,v in GSK.items():
    if k not in mv: continue
    for t in mv[k]:
        a=new.setdefault(t,[]);moved+=1
        for x in v:
            if x not in a: a.append(x)
print('GSK: kunci',len(GSK),'->',len(new),'| kalimat',sum(map(len,GSK.values())),'->',sum(map(len,new.values())),'| dipindah ke N4/N5:',moved,'kunci')
# --- pastikan semua kunci tujuan ada di data baru
ids={c[0]:c for c in D}
def exists(k):
    cid,_,rest=k.partition('@ja');j=int(rest[1:]) if rest else 0
    return cid in ids and j<len(ids[cid][3].get('ja',[]))
bad=[k for k in list(new)+[t for v in mv.values() for t in v]+list(rn.values()) if not exists(k)]
assert not bad,bad[:5]
if DRY: sys.exit(0)
seg=json.dumps(D,separators=(',',':'),ensure_ascii=False)
open(dp,'w',encoding='utf-8').write(s[:i0]+seg+s[i1:])
hd=g[:g.index('Object.assign(GSK,')]
open(gp,'w',encoding='utf-8').write(hd+'Object.assign(GSK,{\n'+',\n'.join(json.dumps(k,ensure_ascii=False)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in new.items())+'\n});\n')
tpl=open(os.path.join(ROOT,'tools','dedup_n3_tpl.js'),encoding='utf-8').read()
tab=json.dumps({'mv':mv,'rn':rn,'cm':cm},ensure_ascii=False,separators=(',',':'))
open(OUT,'w',encoding='utf-8').write(tpl.replace('/*TABEL*/',tab))
print('selesai')
