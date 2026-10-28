/* Vortaro service worker — offline + pengingat latar belakang */
const VERSION='7.4.0',CACHE='vortaro-'+VERSION;
importScripts('js/vr-core.js');
const SHELL=['./','index.html','css/app.css','js/data.js','js/ai-class.js','js/pustaka.js','js/gram.js','js/vr-core.js','js/reminder.js','js/app.js','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('vortaro-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* stale-while-revalidate: cepat & offline, lalu diperbarui diam-diam */
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE),key=new Request(u.origin+u.pathname),hit=await c.match(key);
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return(await net)||new Response('Offline',{status:503});
 })());
});
const show=m=>{try{self.navigator.setAppBadge&&m.n>0&&self.navigator.setAppBadge(m.n)}catch(e){}return self.registration.showNotification(m.title,{body:m.body,icon:'icons/icon-192.png',tag:'vortaro-reminder',data:{url:'./?tab=fc'},actions:[{action:'study',title:'Mulai belajar'},{action:'later',title:'Nanti'}]})};
self.addEventListener('periodicsync',e=>{if(e.tag==='vortaro-reminder')e.waitUntil(VR.check(show))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('notificationclick',e=>{
 e.notification.close();if(e.action==='later')return;
 e.waitUntil((async()=>{
  const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const c of cs){if('focus'in c){await c.focus();c.postMessage({go:'fc'});return}}
  await self.clients.openWindow(new URL((e.notification.data&&e.notification.data.url)||'./?tab=fc',self.registration.scope).href);
 })());
});
