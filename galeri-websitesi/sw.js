// MÜJDE AUTO Service Worker
const CACHE_NAME = 'mujde-auto-v1.0.0';
const STATIC_CACHE = 'mujde-auto-static-v1.0.0';
const DYNAMIC_CACHE = 'mujde-auto-dynamic-v1.0.0';

// Files to cache
const STATIC_FILES = [
    './',
    './index.html',
    './about.html',
    './contact.html',
    './css/style.css',
    './js/script.js',
    './favicon.svg',
    './apple-touch-icon.png',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Images to cache
const IMAGE_FILES = [
    './img/bmw320i.jpg',
    './img/mercedes.jpg',
    './img/audia4.jpg',
    './img/passat3.jpg',
    './img/tesla.jpg',
    './img/opelastra.jpg',
    './img/fiat.png',
    './img/clio.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                const localStaticFiles = STATIC_FILES.filter(url => {
                    if (self.location.protocol === 'file:') {
                        return url.startsWith('/') || url.startsWith('./');
                    }
                    return true;
                });
                return cache.addAll(localStaticFiles);
            })
            .then(() => caches.open(DYNAMIC_CACHE))
            .then((cache) => {
                console.log('Caching images');
                return cache.addAll(IMAGE_FILES);
            })
            .then(() => {
                console.log('Service Worker installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.log('Service Worker install warning:', error.message);
                return self.skipWaiting();
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (self.location.protocol === 'file:' && url.protocol !== 'file:') {
        return;
    }

    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(networkFirst(request, STATIC_CACHE));
    } else if (url.pathname.includes('/görseller/') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.png')) {
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    } else if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Network first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        throw error;
    }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        if (request.destination === 'image') {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Resim Yüklenemedi</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        throw error;
    }
}

// Background sync (offline form storage, no backend)
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(syncFormData());
    }
});

async function syncFormData() {
    try {
        const formData = await getFormDataFromIndexedDB();
        if (formData) {
            console.log("Form sync (offline log):", formData);
            await clearFormDataFromIndexedDB();
        }
    } catch (error) {
        console.log('Form sync skipped:', error.message);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'MÜJDE AUTO\'dan yeni bir bildirim!',
        icon: './favicon.svg',
        badge: './favicon.svg',
        vibrate: [100, 50, 100],
        data: { dateOfArrival: Date.now(), primaryKey: 1 },
        actions: [
            { action: 'explore', title: 'Araçları İncele', icon: '/favicon.svg' },
            { action: 'contact', title: 'İletişim', icon: '/favicon.svg' }
        ]
    };
    event.waitUntil(self.registration.showNotification('MÜJDE AUTO', options));
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(clients.openWindow('/#vehicles'));
    } else if (event.action === 'contact') {
        event.waitUntil(clients.openWindow('/contact.html'));
    } else {
        event.waitUntil(clients.openWindow('/'));
    }
});

// IndexedDB helpers (placeholder)
async function getFormDataFromIndexedDB() {
    return null;
}
async function clearFormDataFromIndexedDB() {
    return;
}
