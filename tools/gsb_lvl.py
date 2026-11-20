#!/usr/bin/env python3
"""Cek tingkat kosakata zh pada sumber GSB (hemat token: hanya menampilkan kata di luar level kartu).
python3 tools/gsb_lvl.py [zh_HSK1.txt] [dari_baris]   -> daftar kata >level / tak dikenal + nomor baris pertama.
Kata dari kamus aplikasi (V.D.C) + semua kata yang sudah dipakai di baris sebelum <dari_baris> (korpus yang sudah disetujui). Kata campuran/angka diabaikan bila semua aksara <=level."""
import sys,os,re,json,subprocess,collections
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js="const V=require('./tests/load.js');const m={};for(const e of V.D.C){const z=(e[3]||{}).zh||[];for(const w of z){const l=+String(w[3]||'').replace(/\\D/g,'')||9;if(!(w[0] in m)||l<m[w[0]])m[w[0]]=l}}console.log(JSON.stringify(m))"
W=json.loads(subprocess.run(['node','-e',js],cwd=R,capture_output=True,text=True).stdout)
f=sys.argv[1] if len(sys.argv)>1 else 'zh_HSK1.txt'; start=int(sys.argv[2]) if len(sys.argv)>2 else 1
lv=int(re.search(r'HSK(\d)',f).group(1))
ch={}
for w,l in W.items():
    if len(w)==1: ch[w]=min(l,ch.get(w,9))
bad=collections.OrderedDict();seen=set()
for n,l in enumerate(open(os.path.join(R,'tools','gsb_src',f),encoding='utf8'),1):
    if l.startswith('#') or '|' not in l: continue
    s=re.sub(r'\{[^}]*\}','',l.split('|')[0])
    if n<start:
        seen.update(re.sub(r'[，。！？、：；“”（）,.!?]',' ',s).split());continue
    for t in re.sub(r'[，。！？、：；“”（）,.!?]',' ',s).split():
        t=t
        if not t: continue
        if W.get(t,9)<=lv or t in seen: continue
        if all(c in '一二三四五六七八九十百零两半' or ch.get(c,9)<=lv for c in t) and (len(t)>1): continue
        bad.setdefault(t,[W.get(t,'?'),[]])[1].append(n)
for t,(l,ns) in bad.items(): print('%s\tHSK%s\tx%d\tbaris %s'%(t,l,len(ns),','.join(map(str,ns[:3]))))
print('ok' if not bad else '%d kata di luar HSK%d'%(len(bad),lv))
