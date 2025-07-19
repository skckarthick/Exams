const CACHE_NAME = 'exam-prep-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/css/main.css',
  '/src/css/home.css',
  '/src/css/Quiz.css',
  '/src/css/dashboard.css',
  '/src/js/pages/home.js',
  '/src/js/pages/Quiz.js',
  '/src/js/pages/dashboard.js',
  '/src/js/components/header.js',
  '/src/js/components/footer.js',
  '/questions/Assistant Registrar.json',
  '/questions/Admin Officer.json',
  '/questions/General Awareness and Current Affairs.json',
  '/questions/Quantitative Aptitudes and Reasoning.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});