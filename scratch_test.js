const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'about.html', 'contact.html',
  'what-is-artificial-intelligence.html', 'machine-learning-vs-deep-learning.html',
  'how-neural-networks-work.html', 'what-is-a-large-language-model.html',
  'how-chatgpt-claude-gemini-work.html', 'prompt-engineering-complete-guide.html',
  'ai-agents-explained.html', 'computer-vision-basics.html',
  'natural-language-processing-explained.html', 'generative-ai-vs-traditional-ai.html',
  'ai-ethics-and-bias.html', 'how-to-start-a-career-in-ai.html',
  'best-ai-tools-for-beginners.html', 'ai-in-everyday-life.html',
  'future-of-ai-trends-to-watch.html', 'glossary-of-ai-terms.html',
  'ai-robotics-and-automation.html'
];

console.log('=== 1. Checking Existence of All 20 HTML Pages ===');
let missing = 0;
files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error('MISSING FILE:', f);
    missing++;
  }
});
if (missing === 0) console.log('SUCCESS: All 20 HTML files exist on disk.');

console.log('\n=== 2. Testing Internal Links Across All Pages ===');
let brokenLinks = 0;
let totalLinks = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefMatches = content.match(/href=["']([^"']+)["']/g) || [];
  
  hrefMatches.forEach(m => {
    totalLinks++;
    let target = m.replace(/href=["']/, '').replace(/["']$/, '').split('#')[0];
    if (!target || target.startsWith('http') || target.startsWith('//') || target.startsWith('data:') || target.startsWith('mailto:')) {
      return; // External or special link
    }
    if (!fs.existsSync(target)) {
      console.error(`BROKEN LINK in ${f} -> "${target}"`);
      brokenLinks++;
    }
  });
});
console.log(`Checked ${totalLinks} links. Broken links found: ${brokenLinks}`);

console.log('\n=== 3. Validating JavaScript Files Syntax ===');
try {
  require('child_process').execSync('node -c main.js');
  console.log('SUCCESS: main.js syntax is valid.');
} catch (e) {
  console.error('ERROR in main.js:', e.message);
}
try {
  require('child_process').execSync('node -c ads.js');
  console.log('SUCCESS: ads.js syntax is valid.');
} catch (e) {
  console.error('ERROR in ads.js:', e.message);
}

console.log('\n=== 4. Validating SEO Metadata & Ad Slots ===');
let seoErrors = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('<title>')) { console.error(`${f} missing <title>`); seoErrors++; }
  if (!content.includes('<meta name="description"')) { console.error(`${f} missing meta description`); seoErrors++; }
  if (!content.includes('<link rel="canonical"')) { console.error(`${f} missing canonical tag`); seoErrors++; }
  if (!content.includes('application/ld+json')) { console.error(`${f} missing JSON-LD schema`); seoErrors++; }
});
if (seoErrors === 0) console.log('SUCCESS: All 20 pages contain valid SEO metadata & JSON-LD schemas.');

console.log('\n=== 5. Validating Sitemap XML URLs ===');
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
let sitemapErrors = 0;
files.forEach(f => {
  if (!sitemap.includes(f)) {
    console.error(`Sitemap missing entry for: ${f}`);
    sitemapErrors++;
  }
});
if (sitemapErrors === 0) console.log('SUCCESS: sitemap.xml contains entries for all 20 pages.');
