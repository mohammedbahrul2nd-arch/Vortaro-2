# Tambah kolom romaji ke berkas mentah ja (4 kolom): pip install --break-system-packages cutlet unidic-lite; python3 -I tools/gsb_rom.py mentah.txt > hasil.txt
import sys,re,cutlet
k=cutlet.Cutlet();k.use_foreign_spelling=False
def rom(s):
    r=k.romaji(s).strip()
    r=re.sub(r'\bwo\b','o',r)
    for a,b in (('ou','ō'),('oo','ō'),('uu','ū'),('ee','ē'),('aa','ā')): r=r.replace(a,b)
    r=r.replace('aruiha','aruiwa')
    return r[0].lower()+r[1:] if r else r
for l in open(sys.argv[1],encoding='utf8'):
    l=l.rstrip('\n')
    if l.startswith('#') or not l.strip(): print(l);continue
    p=[x.strip() for x in l.split('|')]
    print(' | '.join(p[:4]+[rom(p[0])]))
