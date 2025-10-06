const CACHE_NAME = "epub-cache";

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        )
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/read/remote")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(event.request).then((resp) => {
                    if (resp) {
                        return resp;
                    }
                    return fetch(event.request).then((response) => {
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                })
            )
        );
    }
});