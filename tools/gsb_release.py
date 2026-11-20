#!/usr/bin/env python3
"""SATU perintah untuk menutup batch (hemat token):
  python3 tools/gsb_release.py "<ringkasan batch>" [versi]
Melakukan: build semua bahasa (galat -> berhenti) · naikkan VERSION sw.js (patch+1 bila versi tak diberi) · tambah CHANGELOG
(otomatis memuat progres & kartu <15 kalimat) · jalankan semua tes (hanya tampilkan yang GAGAL) · tulis PROMPT_LANJUTAN_<v>.md dari
tools/prompt_tpl.md + tools/gsb_lessons.md + progres otomatis · hapus prompt lama · zip ../vortaro-pwa-<v>.zip · salin ke /home/claude/out."""
import sys,os,re,glob,subprocess,shutil
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
summ=sys.argv[1];sw=open('docs/sw.js',encoding='utf8').read()
cur=re.search(r"VERSION\s*=\s*['\"]([\d.]+)",sw).group(1)
new=sys.argv[2] if len(sys.argv)>2 else '.'.join(cur.split('.')[:2]+[str(int(cur.split('.')[2])+1)])
b=subprocess.run(['python3','tools/gsb_build.py'],capture_output=True,text=True);o=b.stdout+b.stderr
if re.search(r'^\s*!',o,re.M): print('\n'.join(l for l in o.splitlines() if '!' in l[:4] or 'galat' in l));sys.exit('GALAT build — perbaiki dulu')
# progres
prog=[];short=[];tot=0
for f in sorted(glob.glob('tools/gsb_src/*.txt')):
    c=None;cnt={}
    for l in open(f,encoding='utf8'):
        m=re.match(r'#(\d+)',l)
        if m:c=int(m.group(1));cnt[c]=0
        elif l.strip() and c is not None and '|' in l: cnt[c]+=1
    if not cnt: continue
    name=os.path.basename(f)[:-4];n=sum(cnt.values());tot+=n
    full=sum(1 for v in cnt.values() if v>=15);sh=['#%d=%d'%(k,v) for k,v in sorted(cnt.items()) if v<15]
    prog.append('%s: kartu #0–#%d selesai (%d kartu, %d kalimat, %d penuh 15). Lanjut dari #%d.'%(name,max(cnt),len(cnt),n,full,max(cnt)+1))
    short.append('%s <15: %s'%(name,', '.join(sh) if sh else '-'))
sw=re.sub(r"(VERSION\s*=\s*['\"])[\d.]+",r"\g<1>"+new,sw,1);open('docs/sw.js','w',encoding='utf8').write(sw)
ch=open('CHANGELOG.md',encoding='utf8').read()
open('CHANGELOG.md','w',encoding='utf8').write('## %s\n- %s\n- Progres: %s\n- Kartu <15 kalimat (natural, memakai Pustaka sebagai pelengkap): %s\n\n'%(new,summ,' | '.join(prog),' | '.join(short))+ch)
bad=[]
for t in sorted(glob.glob('tests/test_*.js')):
    r=subprocess.run(['node',t],capture_output=True,text=True)
    if 'GAGAL' in r.stdout+r.stderr or r.returncode: bad.append(t)
if bad: print('TES GAGAL:',bad);sys.exit(1)
tpl=open('tools/prompt_tpl.md',encoding='utf8').read();les=open('tools/gsb_lessons.md',encoding='utf8').read()
for f in glob.glob('PROMPT_LANJUTAN_*.md'): os.remove(f)
pf='PROMPT_LANJUTAN_%s.md'%new
open(pf,'w',encoding='utf8').write(tpl.replace('{{VER}}',new).replace('{{PROGRES}}','\n'.join('- '+x for x in prog)).replace('{{PENDEK}}','\n'.join('- '+x for x in short)).replace('{{PELAJARAN}}',les))
os.chdir('..');z='vortaro-pwa-%s.zip'%new
for f in glob.glob('vortaro-pwa-*.zip'): os.remove(f)
subprocess.run(['zip','-qr',z,'vortaro','-x','*/__pycache__/*'],check=True)
os.makedirs('/home/claude/out',exist_ok=True)
for f in glob.glob('/home/claude/out/*'): os.remove(f)
shutil.copy(z,'/home/claude/out/');shutil.copy('vortaro/'+pf,'/home/claude/out/')
print('OK versi',new,'| total kalimat',tot,'| kirim: /home/claude/out/'+z,'dan /home/claude/out/'+pf)
