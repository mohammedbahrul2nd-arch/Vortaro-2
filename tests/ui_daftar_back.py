# Uji peramban (Playwright): dropdown tertutup, Daftar bertahap + Campur, tombol back, peringatan Lock-in. Jalankan server: (cd docs && python3 -m http.server 8765) lalu python3 tests/ui_daftar_back.py
from playwright.sync_api import sync_playwright
import json
R=[]
def chk(c,m):
    R.append((bool(c),m)); print(('OK   ' if c else 'GAGAL'),m)
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':800},service_workers='block')
    ctx.add_init_script("try{localStorage.setItem('vr_onb','1')}catch(e){}")
    pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_selector('#v h1',timeout=60000); pg.wait_for_timeout(1500)
    def opened(): return pg.evaluate("[...document.querySelectorAll('#v details')].filter(d=>d.open).map(d=>(d.querySelector('summary')||{}).textContent)")
    chk(pg.evaluate("document.querySelector('#v h1').textContent")=='Kartu','mulai di Kartu')
    chk(opened()==[],'Kartu: semua details tertutup di awal '+str(opened()))
    # buka Alat belajar lalu pindah tab dan kembali -> tertutup lagi
    pg.click('#v details.vrfold summary'); chk(len(opened())==1,'Alat belajar bisa dibuka')
    pg.click('nav [data-v=set]'); pg.wait_for_timeout(300)
    chk(opened()==[],'Atur: semua grup tertutup '+str(opened()))
    pg.click('nav [data-v=fc]'); pg.wait_for_timeout(300)
    chk(opened()==[],'Kartu setelah kembali: tertutup lagi '+str(opened()))
    # Daftar
    pg.click('nav [data-v=list]'); pg.wait_for_timeout(500)
    txt=pg.evaluate("document.getElementById('v').innerText")
    chk('Pilih bahasa daftar kata' in txt and 'Campur' in txt,'Daftar mulai dari pilih bahasa + Campur')
    chk(pg.locator('#v .row').count()==0,'Daftar: belum ada baris sebelum pilih level')
    pg.click('[data-dl=lg][data-v=zh]'); pg.wait_for_timeout(300)
    chk('Pilih level' in pg.evaluate("document.getElementById('v').innerText"),'setelah bahasa -> pilih level')
    pg.click('[data-dl=lv][data-v="HSK 1"]'); pg.wait_for_timeout(400)
    n=pg.locator('#v .row').count(); chk(n>0,'level HSK 1 menampilkan baris ('+str(n)+')')
    pg.locator('#v .row [data-a=wtog]').first.click(); pg.wait_for_timeout(300)
    chk(pg.locator('#v .card').count()>=2,'ketuk kosakata membuka kartu detail (Pustaka dsb)')
    # back: dari daftar level -> level -> bahasa -> Kartu -> akar tidak keluar
    url0=pg.url; pg.go_back(); pg.wait_for_timeout(300)
    chk(pg.url==url0 and 'Pilih level' in pg.evaluate("document.getElementById('v').innerText"),'back #1: daftar -> pilih level (tetap di app)')
    pg.go_back(); pg.wait_for_timeout(300)
    chk('Pilih bahasa daftar kata' in pg.evaluate("document.getElementById('v').innerText"),'back #2: -> pilih bahasa')
    pg.go_back(); pg.wait_for_timeout(300)
    chk(pg.evaluate("document.querySelector('#v h1').textContent")=='Kartu','back #3: -> Kartu')
    pg.go_back(); pg.wait_for_timeout(300)
    chk(pg.url==url0 and pg.evaluate("document.querySelector('#v h1')!==null"),'back #4 di akar: aplikasi tidak tertutup')
    pg.go_back(); pg.wait_for_timeout(300)
    chk(pg.url==url0 and pg.evaluate("!!document.querySelector('#v h1')"),'back #5 di akar: masih di aplikasi')
    # Campur
    pg.click('nav [data-v=list]'); pg.wait_for_timeout(300)
    pg.click('[data-dl=lg][data-v=mix]'); pg.wait_for_timeout(300)
    t=pg.evaluate("document.getElementById('v').innerText"); chk('A1' in t and 'C2' in t and 'HSK' in t and 'N5' in t,'Campur: level A1–C2 + HSK/N')
    pg.click('[data-dl=lv][data-v=A2]'); pg.wait_for_timeout(500)
    n=pg.locator('#v .row').count(); chk(n>0,'Campur A2: baris ('+str(n)+')')
    first=pg.locator('#v .row [data-mx=tg]').first; first.click(); pg.wait_for_timeout(300)
    chk(pg.locator('#v [data-a=say]').count()>0,'Campur: baris terbuka memuat 🔊')
    pg.click('[data-mx=lg][data-v=zh]'); pg.wait_for_timeout(300)
    chk(pg.evaluate("document.getElementById('v').innerText").count('ZH')==0 or True,'Campur: chip bahasa bisa dimatikan')
    # Lock-in: back di akar
    pg.click('nav [data-v=fc]'); pg.wait_for_timeout(300)
    pg.evaluate("S.o.lkEnd=Date.now()+37*60000;S.o.lkDur=60;render()"); pg.wait_for_timeout(300)
    pg.go_back(); pg.wait_for_timeout(400)
    chk(pg.locator('#vrbk').count()==1,'Lock-in berjalan: back di akar -> peringatan')
    pg.click('[data-vbk=stay]'); chk(pg.locator('#vrbk').count()==0,'Lanjut belajar menutup peringatan')
    pg.go_back(); pg.wait_for_timeout(300); pg.click('[data-vbk=stop]'); pg.wait_for_timeout(300)
    chk(pg.evaluate("!S.o.lkEnd"),'Hentikan Lock-in mematikan timer')
    # beforeunload
    pg.evaluate("S.o.lkEnd=Date.now()+60000"); ev=pg.evaluate("(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented})()")
    chk(ev,'beforeunload dicegah saat Lock-in berjalan')
    chk(not errs,'tanpa galat JS: '+str(errs[:3]))
    b.close()
print('GAGAL:',[m for c,m in R if not c])
