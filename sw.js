// sw.js - Service Worker untuk tetap jalan meski browser ditutup

self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('SW installed');
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('SW activated');
});

// Periodik sync (setiap 15 menit)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'keep-alive') {
        event.waitUntil(keepAlive());
    }
});

async function keepAlive() {
    const SERVER = "https://reversion-exert-gloomily.ngrok-free.dev"; // GANTI DENGAN LINK NGROK KAMU
    
    try {
        await fetch(SERVER + '/ping', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ from: 'service-worker', timestamp: Date.now() })
        });
        console.log('Keep-alive ping sent');
    } catch(e) {
        console.log('Ping failed');
    }
}

// Coba daftarkan periodic sync
async function registerPeriodicSync() {
    if ('periodicSync' in registration) {
        try {
            await registration.periodicSync.register('keep-alive', {
                minInterval: 15 * 60 * 1000 // setiap 15 menit
            });
            console.log('Periodic sync registered');
        } catch(e) {
            console.log('Periodic sync failed:', e);
        }
    }
}

registerPeriodicSync();
