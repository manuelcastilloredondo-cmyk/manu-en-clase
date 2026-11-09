// Manu en clase: permite instalar la web como app y abrirla sin conexión (última versión vista).
const CACHE='manuenclase-app-v1';
const SHELL=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/favicon.png','/logo-96.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('manuenclase-app-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin||u.pathname.startsWith('/ia/'))return;
  // Red primero (siempre la versión nueva); si no hay conexión, la copia guardada.
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/'))));
});
