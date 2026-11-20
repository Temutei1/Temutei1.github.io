// Offline-Speicher. Der Name ändert sich automatisch mit jeder App-Änderung.
var C="gymtrack-45a355f336",SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
// Seiten: erst Netz (max. 3 s), sonst gespeicherte Version. Rest: gespeichert, im Hintergrund erneuern.
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 function store(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res}
 if(r.mode==="navigate"){
  e.respondWith(new Promise(function(ok){var done=false;
   function fall(){caches.match(r,{ignoreSearch:true}).then(function(h){return h||caches.match("index.html")}).then(function(h){if(!done){done=true;ok(h||Response.error())}})}
   var t=setTimeout(fall,3000);
   fetch(r,{cache:"no-cache"}).then(function(res){clearTimeout(t);if(!done){done=true;ok(store(res))}}).catch(function(){clearTimeout(t);fall()})}));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
  var net=fetch(r).then(store).catch(function(){return hit});return hit||net}))});
