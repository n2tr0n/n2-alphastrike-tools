// Specify the list of files to cache ---
// const cacheFiles = ['index.html', 'bv-calculator.html', 'gator.html', 'HitLocationTable.html', 'logo.png'];
const cacheFiles = ['index.html', 'gator.html', 'logo.png'];
const cacheName = 'v0.0.15';
// Event executed on install ---
self.addEventListener('install', event => {
  // Specify the files to cache
  caches.open(cacheName).then(cache => cache.addAll(cacheFiles));
});
// Event executed after installation ---
function deleteOldCache() {
  caches.keys().then( (keyList) => 
    Promise.all(
      keyList.map( (key) => {
        if( key === cacheName) {
        }
        else {
          return caches.delete( key);
        }
      })
    )
  )
}
self.addEventListener('activate', event => {
  // Delete old cache process
  event.waitUntil(deleteOldCache());
});
// fetch event
self.addEventListener('fetch', event => {
  // Return from cache if available ---
  event.respondWith(
    caches.match(event.request).then( (resp) => {
      return resp || fetch(event.request).then( (response) => {
        let responseClone = response.clone();
        caches.open(cacheName).then( (cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match('logo.png');
    }));
});