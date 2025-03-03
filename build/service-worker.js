



// const CACHE_NAME = "BSREM-cache-v1";
// const urlsToCache = [
//     "/",
//     "/index.html",
//     "/logo192.png",
//     "/logo512.png",
//     "/favicon.ico",
//     "/static/js/bundle.js"
// ];

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });



//   self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });

const CACHE_NAME = "BSREM-cache-v1"; // 🔄 Change version number when updating cache
const urlsToCache = [
    "/",
    "/index.html",
    "/logo192.png",
    "/logo512.png",
    "/favicon.ico",
    "/static/js/bundle.js"
];

// ✅ Install event - Cache files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Immediately activate new service worker
});

// ✅ Activate event - Remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of open pages immediately
});

// ✅ Fetch event - Use network first, then cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

