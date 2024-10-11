'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "e64ddae27a35561f47b0b68e73f251ba",
"assets/AssetManifest.bin.json": "bc6028e9e1a3d5e902bb9ac8fb94e0f5",
"assets/AssetManifest.json": "e865075e6486956ba15aa22d4d167d05",
"assets/assets/data/data_en.json": "60bf64b458e812732739d3520cb16dc1",
"assets/assets/images/logo_1000x1000.png": "b6be93b13e662f53a3a56b4fa3f53930",
"assets/assets/images/tutorial/labels_de.png": "59be9b207fc95102fcb0e59f34c038da",
"assets/assets/images/tutorial/labels_en.png": "3b4ecd121cda8e23d7d13097fa2fefcb",
"assets/assets/images/tutorial/languages.png": "04ead0fd88ce4a646af175e4f7211161",
"assets/assets/images/tutorial/select_article_without_label_de.png": "4cecdcb5cbf63ae3ccb5ca43d7c7d924",
"assets/assets/images/tutorial/select_article_without_label_en.png": "841c2790f04b3942c872dc5cb860c4ab",
"assets/assets/images/tutorial/select_article_with_label_de.png": "6336678a4075dbc67f5f10ce59a66f2f",
"assets/assets/images/tutorial/select_article_with_label_en.png": "4f013c156f181dc5e16b47f0d1fe968e",
"assets/assets/images/tutorial/select_labels_de.png": "aae746f9255061115657ee99b87f809a",
"assets/assets/images/tutorial/select_labels_en.png": "2a7548394968052f0b8a5c84fd645a6c",
"assets/assets/images/tutorial/title_selection_without_labels_de.png": "3e1dc11a99f477fb8744903ca5e44604",
"assets/assets/images/tutorial/title_selection_without_labels_en.png": "37ceaaf094b1cd886e3174544521b9a8",
"assets/assets/images/tutorial/title_selection_with_labels_de.png": "cf3e21ab39cd6fbd409184bc24d39822",
"assets/assets/images/tutorial/title_selection_with_labels_en.png": "c60f790da973196e0a9dfe960d742605",
"assets/assets/translations/de.json": "77f08e7862201ba4b7e6e89a87a65e7c",
"assets/assets/translations/en.json": "b994694167d1d9f51bdad83162de6382",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1e5bb534ddc3f2712ba3dabad5df12c0",
"assets/images/logo_1000x1000.png": "b6be93b13e662f53a3a56b4fa3f53930",
"assets/NOTICES": "d6f17a0df5111958f19d60d19eab1199",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "4fadc92f7701ce7e0bd059c36c9d6ad5",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "37c606ce4b13019b2ef2b05b5bb38242",
"icons/Icon-512.png": "c34b479357c72fa8a10e361a1d814d6e",
"icons/Icon-maskable-192.png": "37c606ce4b13019b2ef2b05b5bb38242",
"icons/Icon-maskable-512.png": "c34b479357c72fa8a10e361a1d814d6e",
"index.html": "7d4a27dcc229b9b894b49c58684d4ec9",
"/": "7d4a27dcc229b9b894b49c58684d4ec9",
"main.dart.js": "1da61f78fc7b318b8539ca4270cbacb2",
"manifest.json": "25878510700558dfa0524579223cd2f0",
"version.json": "5c25c531bf892ddf47059b5d5c5ffee6"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
