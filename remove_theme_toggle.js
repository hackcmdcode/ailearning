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

let updatedCount = 0;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Regex matching any variation of the theme toggle button
    const newContent = content.replace(/<button class="theme-toggle"[^>]*>.*?<\/button>\s*/g, '');
    if (content !== newContent) {
      fs.writeFileSync(f, newContent, 'utf8');
      updatedCount++;
      console.log(`Updated ${f}: Removed theme toggle button.`);
    }
  }
});

console.log(`\nTheme toggle button removed from ${updatedCount} files.`);
