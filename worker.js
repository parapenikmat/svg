addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1q2INeaaWzVK1M4nM0Vj9gjV7X02Pm5xUzLU3_homI8M/values/A1:E40000?key=AIzaSyBPUGct21N4inGdO2wKhNyX8ewZqneCxag';
const baseURL = 'https://yourdomain.com'; // Ganti dengan domain Anda

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    
    if (url.pathname === '/sitemap.xml') {
      const posts = await fetchPosts();
      const sitemap = generateSitemap(posts);
      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    return new Response('Halaman tidak ditemukan', { status: 404 });

  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500
    });
  }
}

async function fetchPosts() {
  const response = await fetch(API_URL);
  const data = await response.json();
  const posts = data.values;

  // Mengacak dan memilih 1000 postingan
  return shuffle(posts).slice(0, 1000);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateSitemap(posts) {
  const lastmod = new Date().toISOString();
  const urlEntries = posts.map(post => {
    const [title, , , , link] = post;
    return `
    <url>
        <loc>${baseURL}/post/${link}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
  }).join('');

  return `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlEntries}
  </urlset>`;
}
