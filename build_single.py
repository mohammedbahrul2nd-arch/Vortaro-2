#!/usr/bin/env python3
"""Bangun HTML tunggal: python3 build_single.py 7.21.0 out.html  (inline css + semua js; app.js sebagai text/plain #vr-app)"""
import sys,re
ver,out=sys.argv[1],sys.argv[2]
rd=lambda p:open('docs/'+p,encoding='utf8').read()
esc=lambda s:s.replace('</script','<\\/script')
idx=rd('index.html')
order=re.findall(r'<script src="js/([^"]+)"></script>',idx)
head=('<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 '<meta name="theme-color" content="#1f3a5f"><title>Vortaro v%s</title>\n<meta name="description" content="Vortaro — flashcard kosakata dengan pengingat hafalan">\n'
 '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-title" content="Vortaro"><meta name="apple-mobile-web-app-status-bar-style" content="default">\n<style>')%ver
skl=re.search(r'<main id="v">.*?</main>',idx,re.S).group(0)
h=[head,rd('css/app.css'),rd('css/ui.css'),'</style></head><body>'+skl+'<nav id="n"></nav>\n']
for f in order: h.append('<script>'+esc(rd('js/'+f))+'\n</script>\n')
h.append('<script>'+esc(rd('js/ui.js'))+'\n</script>\n')
h.append('<script type="text/plain" id="vr-app">'+esc(rd('js/app.js'))+'\n</script>\n')
h.append("<script>/* 7.29.2: vr-app kini SEBELUM skrip ini + tunggu DOM selesai (sebelumnya balapan: boot selesai sebelum #vr-app terurai -> null.textContent) */\nconst vrGo=()=>VRS.boot(typeof SK!='undefined'?SK:undefined).then(()=>{const e=document.getElementById('vr-app');if(!e)throw new Error('vr-app tidak ada (HTML terpotong?)');const s=document.createElement('script');s.textContent=e.textContent;document.body.appendChild(s)}).catch(vrFatal);\nif(document.readyState==='loading')document.addEventListener('DOMContentLoaded',vrGo);else vrGo()</script></body></html>\n")
open(out,'w',encoding='utf8').write(''.join(h));print(out,sum(map(len,h))//1024,'KB; skrip:',order)
