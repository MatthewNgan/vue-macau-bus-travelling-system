const staticCacheName = 'site-static#b0.3.8.3';
const dynamicCacheName = 'site-dynamic#11';
const assets = [
    '/',
    '/index.html',
    '/script.js',
    '/style.css',
    '/images/icons/logo.png',
    '/images/icons/rounded-logo.png',
    '/images/icons/blue-bus-icon.png',
    '/images/icons/orange-bus-icon.png',
    '/images/icons/bus-stop-inList.png',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/vue@3.0.5/dist/vue.global.prod.js',
];
self.addEventListener('install', e => {
    // console.log('ServiceWorker has been installed');
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});
self.addEventListener('activate', e => {
    // console.log('ServiceWorker has been activated');
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName && key !== "mapbox-tiles")
                .map(key => caches.delete(key))
            )
        })
    );
});
self.addEventListener('fetch', e => {
    // console.log('Fetch event', e)
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    if (e.request.url.indexOf("dsat.gov.mo") == -1 && e.request.url.indexOf("mapbox") == -1) cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    )
});
