// MÜJDE AUTO Service Worker
const CACHE_NAME = 'mujde-auto-v1.0.0';
const STATIC_CACHE = 'mujde-auto-static-v1.0.0';
const DYNAMIC_CACHE = 'mujde-auto-dynamic-v1.0.0';

// Files to cache
const STATIC_FILES = [
    '/',
    '/index.html',
    '/about.html',
    '/contact.html',
    '/css/style.css',
    '/js/script.js',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Images to cache
const IMAGE_FILES = [
    '/görseller/bmw320i.jpg',
    '/görseller/mercedes.jpg',
    '/görseller/audia4.jpg',
    '/görseller/passat3.jpg',
    '/görseller/tesla.jpg',
    '/görseller/opelastra.jpg',
    '/görseller/fiat.png',
    '/görseller/clio.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                // Filter out external URLs in local development
                const localStaticFiles = STATIC_FILES.filter(url => {
                    if (self.location.protocol === 'file:') {
                        return url.startsWith('/') || url.startsWith('./');
                    }
                    return true;
                });
                return cache.addAll(localStaticFiles);
            })
            .then(() => {
                return caches.open(DYNAMIC_CACHE);
            })
            .then((cache) => {
                console.log('Caching images');
                return cache.addAll(IMAGE_FILES);
            })
            .then(() => {
                console.log('Service Worker installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.log('Service Worker install completed (some external resources may not be cached in local development):', error.message);
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

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests in local development
    if (self.location.protocol === 'file:' && url.protocol !== 'file:') {
        return;
    }

    // Handle different types of requests
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        // HTML files - network first, fallback to cache
        event.respondWith(networkFirst(request, STATIC_CACHE));
    } else if (url.pathname.includes('/görseller/') || url.pathname.includes('.jpg') || url.pathname.includes('.png')) {
        // Images - cache first, fallback to network
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    } else if (url.pathname.includes('.css') || url.pathname.includes('.js')) {
        // CSS/JS files - cache first, fallback to network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else {
        // Other requests - network first, fallback to cache
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
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        // Return a fallback response for images
        if (request.destination === 'image') {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Resim Yüklenemedi</text></svg>',
                {
                    headers: { 'Content-Type': 'image/svg+xml' }
                }
            );
        }
        throw error;
    }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(syncFormData());
    }
});

async function syncFormData() {
    try {
        const formData = await getFormDataFromIndexedDB();
        if (formData) {
            // Only sync if we're on a real server
            if (self.location.protocol === 'file:') {
                console.log('Service Worker: Running in local development, skipping form sync');
                return;
            }
            
            // Send form data to server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                await clearFormDataFromIndexedDB();
                console.log('Form data synced successfully');
            }
        }
    } catch (error) {
        console.log('Form sync failed (expected in local development):', error.message);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'MÜJDE AUTO\'dan yeni bir bildirim!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Araçları İncele',
                icon: '/favicon.svg'
            },
            {
                action: 'contact',
                title: 'İletişim',
                icon: '/favicon.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('MÜJDE AUTO', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#vehicles')
        );
    } else if (event.action === 'contact') {
        event.waitUntil(
            clients.openWindow('/contact.html')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// IndexedDB helpers for offline form storage
async function getFormDataFromIndexedDB() {
    // Implementation would depend on your IndexedDB setup
    return null;
}

async function clearFormDataFromIndexedDB() {
    // Implementation would depend on your IndexedDB setup
} 