#!/usr/bin/env python3
"""Daftar ringkas kartu yang BELUM dikerjakan: python3 tools/gsb_next.py zh "HSK 1" [jumlah=10]
Menampilkan #indeks | judul | pola | contoh (dipotong) mulai dari kartu pertama yang belum ada di sumber."""
import sys,os,re,subprocess
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang,lv=sys.argv[1:3];n=int(sys.argv[3]) if len(sys.argv)>3 else 10
f=os.path.join(R,'tools','gsb_src','%s_%s.txt'%(lang,lv.replace(' ','')))
last=-1
if os.path.exists(f):
    for l in open(f,encoding='utf8'):
        m=re.match(r'#(\d+)',l)
        if m:last=max(last,int(m.group(1)))
a=last+1
print('terakhir selesai: #%d -> lanjut dari #%d'%(last,a))
out=subprocess.run(['node','tools/gcl_cards.js',lang,lv,str(a),str(a+n-1)],cwd=R,capture_output=True,text=True).stdout
for l in out.splitlines(): print(l[:150])
