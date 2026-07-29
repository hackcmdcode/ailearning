const http = require('http');

const pages = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/what-is-artificial-intelligence.html',
  '/machine-learning-vs-deep-learning.html',
  '/how-neural-networks-work.html',
  '/what-is-a-large-language-model.html',
  '/how-chatgpt-claude-gemini-work.html',
  '/prompt-engineering-complete-guide.html',
  '/ai-agents-explained.html',
  '/computer-vision-basics.html',
  '/natural-language-processing-explained.html',
  '/generative-ai-vs-traditional-ai.html',
  '/ai-ethics-and-bias.html',
  '/how-to-start-a-career-in-ai.html',
  '/best-ai-tools-for-beginners.html',
  '/ai-in-everyday-life.html',
  '/future-of-ai-trends-to-watch.html',
  '/glossary-of-ai-terms.html',
  '/ai-robotics-and-automation.html',
  '/style.css',
  '/main.js',
  '/ads.js',
  '/sw.js',
  '/sitemap.xml',
  '/robots.txt'
];

console.log('=== Monetag & Website HTTP Live Verification ===\n');

let passed = 0;
let failed = 0;

function fetchUrl(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        const kb = (size / 1024).toFixed(2);
        if (res.statusCode === 200) {
          console.log(`[PASS 200 OK] ${urlPath} | Size: ${kb} KB | Content-Type: ${res.headers['content-type']}`);
          passed++;
        } else {
          console.error(`[FAIL ${res.statusCode}] ${urlPath}`);
          failed++;
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`[ERROR] ${urlPath} -> ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function runTests() {
  for (const page of pages) {
    await fetchUrl(page);
  }

  console.log(`\n========================================`);
  console.log(`Live Verification Complete: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
  process.exit(0);
}

runTests();
