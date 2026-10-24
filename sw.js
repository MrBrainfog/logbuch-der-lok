// Logbuch der Lok – Offline-Speicher für die App-Dateien
const VER="lok-2026.10.24-0943";
const CORE=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","pdf.js","pdf.worker.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("lok-")&&k!==VER&&k!=="lok-fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function timeout(ms){return new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms))}
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.hostname==="fonts.googleapis.com"||url.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("lok-fonts").then(async c=>{const hit=await c.match(req);const net=fetch(req).then(r=>{if(r.ok||r.type==="opaque")c.put(req,r.clone());return r}).catch(()=>hit);return hit||net}));return}
  if(url.origin!==self.location.origin)return;
  const isPage=req.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith("/index.html");
  if(isPage){
    e.respondWith((async()=>{const c=await caches.open(VER);
      try{const r=await Promise.race([fetch(req,{cache:"no-store"}),timeout(4000)]);if(r.ok)c.put("index.html",r.clone());return r}
      catch{return (await c.match("index.html"))||(await c.match("./"))||Response.error()}})());return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(VER).then(c=>c.put(req,cl))}return r})));
});
