/* 
  AI Academy - Core Interactive & Automation Engine
  Handles Navigation, Reading Progress Bar, Web Share API, Copy Link, TOC Scroll-Spy & Automated Driver Mode
*/

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initMobileMenu();
  initDropdown();
  initTocScrollSpy();
  initShareButtons();
  initAutomatedSimulation();
});

/* 1. Reading Progress Bar */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('show');
    const isExpanded = navLinks.classList.contains('show');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    toggleBtn.innerHTML = isExpanded ? '&#215;' : '&#9776;';
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
      navLinks.classList.remove('show');
      toggleBtn.innerHTML = '&#9776;';
    }
  });
}

/* 3. Navigation Dropdown Toggle */
function initDropdown() {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (!dropdownToggle || !dropdownMenu) return;

  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });
}

/* 4. Table of Contents Scroll-Spy */
function initTocScrollSpy() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (tocLinks.length === 0) return;

  const headings = Array.from(tocLinks).map(link => {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  if (headings.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    headings.forEach(heading => {
      if (scrollPos >= heading.offsetTop) {
        currentId = heading.id;
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* 5. Social Share Buttons & Copy Link Toast */
function initShareButtons() {
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.getAttribute('data-share');
      const url = window.location.href;
      const title = document.title;

      if (type === 'native' && navigator.share) {
        e.preventDefault();
        navigator.share({ title, url }).catch(() => {});
      } else if (type === 'copy') {
        e.preventDefault();
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy link');
        });
      }
    });
  });
}

/* 6. Automated Usage Engine (Auto-Pilot / Bot Mode) */
function initAutomatedSimulation() {
  // Create badge container dynamically
  const badge = document.createElement('div');
  badge.id = 'autopilot-badge';
  badge.innerHTML = `<span class="pulsing-dot"></span> <span>Auto-Pilot Mode Active</span>`;
  document.body.appendChild(badge);

  // Check URL parameters for ?auto=true or ?automate=1
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auto') === 'true' || urlParams.get('automate') === '1') {
    startAutoPilot();
  }

  // Expose global window API for headless browser scripts (Playwright, Puppeteer, Selenium)
  window.startAutoPilot = startAutoPilot;
  window.stopAutoPilot = stopAutoPilot;
}

let autoPilotTimer = null;

function startAutoPilot(intervalMs = 2500) {
  const badge = document.getElementById('autopilot-badge');
  if (badge) badge.classList.add('active');

  showToast('Automated simulation driver started');

  // Step 1: Smooth scroll down page
  let currentScroll = 0;
  const scrollInterval = setInterval(() => {
    currentScroll += 300;
    window.scrollTo({ top: currentScroll, behavior: 'smooth' });

    if (currentScroll >= document.documentElement.scrollHeight - window.innerHeight) {
      clearInterval(scrollInterval);
      
      // Step 2: Automatically click next article button after reaching end
      setTimeout(() => {
        const continueBtn = document.querySelector('.continue-btn');
        const cardLink = document.querySelector('.articles-grid .card');
        
        if (continueBtn) {
          showToast('Auto-navigating to next guide...');
          const nextHref = continueBtn.getAttribute('href');
          if (nextHref) {
            window.location.href = `${nextHref}?auto=true`;
          }
        } else if (cardLink) {
          const firstCardHref = cardLink.getAttribute('href');
          if (firstCardHref) {
            window.location.href = `${firstCardHref}?auto=true`;
          }
        }
      }, 2000);
    }
  }, 800);
}

function stopAutoPilot() {
  const badge = document.getElementById('autopilot-badge');
  if (badge) badge.classList.remove('active');
  if (autoPilotTimer) clearInterval(autoPilotTimer);
  showToast('Auto-pilot simulation stopped');
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
