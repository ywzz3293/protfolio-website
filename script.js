/* ============================================
   HAMBURGER MENU
   ============================================ */
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

/* ============================================
   DARK MODE TOGGLE
   ============================================ */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons(theme);
})();

function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcons(next);
    });
  });
});

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
const typewriterPhrases = [
  '6+ Years in Backend Systems',
  'C++11 / 14 / 17 / 20 Specialist',
  'AI Workflow Automation @ OpenText',
  'Performance-Driven Engineering',
  'Multi-Platform C++ Development',
];

let twIndex = 0;
let twChar = 0;
let twDeleting = false;

function typewriterTick() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrase = typewriterPhrases[twIndex];

  if (!twDeleting) {
    el.textContent = phrase.substring(0, ++twChar);
    if (twChar === phrase.length) {
      twDeleting = true;
      setTimeout(typewriterTick, 1800);
      return;
    }
  } else {
    el.textContent = phrase.substring(0, --twChar);
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % typewriterPhrases.length;
      setTimeout(typewriterTick, 400);
      return;
    }
  }
  setTimeout(typewriterTick, twDeleting ? 45 : 75);
}

/* ============================================
   SCROLL FADE-IN (IntersectionObserver)
   ============================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

/* ============================================
   RENDER EXPERIENCE TIMELINE
   ============================================ */
async function renderExperience() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  try {
    const res = await fetch('./data/experience.json');
    const jobs = await res.json();

    container.innerHTML = jobs.map((job, i) => `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-period">${escHtml(job.period)}</div>
          <div class="timeline-role">${escHtml(job.role)}</div>
          <div class="timeline-company">${escHtml(job.company)} &mdash; ${escHtml(job.location)}</div>
          <ul class="timeline-highlights">
            ${job.highlights.map(h => `<li>${escHtml(h)}</li>`).join('')}
          </ul>
          <div class="timeline-tags">
            ${job.tags.map(t => `<span class="skill-tag">${escHtml(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Observe newly added elements
    document.querySelectorAll('#timeline-container .fade-in').forEach(el => {
      scrollObserver.observe(el);
    });
  } catch (e) {
    console.warn('Could not load experience data:', e);
  }
}

/* ============================================
   RENDER SKILLS
   ============================================ */
async function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  try {
    const res = await fetch('./data/skills.json');
    const skills = await res.json();

    container.innerHTML = Object.entries(skills).map(([category, tags]) => `
      <div class="skills-category fade-in">
        <div class="skills-category-title">${escHtml(category)}</div>
        <div class="skills-tags">
          ${tags.map(t => `<span class="skill-tag">${escHtml(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    document.querySelectorAll('#skills-container .fade-in').forEach(el => {
      scrollObserver.observe(el);
    });
  } catch (e) {
    console.warn('Could not load skills data:', e);
  }
}

/* ============================================
   RENDER PROJECTS
   ============================================ */
async function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const res = await fetch('./data/projects.json');
    const projects = await res.json();

    container.innerHTML = projects.map(p => {
      const badgeHtml = p.badge ? `<span class="ai-badge">${escHtml(p.badge)}</span>` : '';
      const githubBtn = p.github
        ? `<button class="btn btn-color-2 project-btn" onclick="window.open('${p.github}','_blank')">GitHub</button>`
        : '';
      const demoBtn = p.demo
        ? `<button class="btn btn-color-1 project-btn" onclick="window.open('${p.demo}','_blank')">Live Demo</button>`
        : '';

      return `
        <div class="project-card fade-in">
          <div class="project-card-header">
            <div class="project-card-title">${escHtml(p.title)}</div>
            ${badgeHtml}
          </div>
          <p class="project-card-desc">${escHtml(p.description)}</p>
          <div class="project-card-tags">
            ${p.tags.map(t => `<span class="skill-tag">${escHtml(t)}</span>`).join('')}
          </div>
          ${(githubBtn || demoBtn) ? `<div class="project-card-btns">${githubBtn}${demoBtn}</div>` : ''}
        </div>
      `;
    }).join('');

    document.querySelectorAll('#projects-container .fade-in').forEach(el => {
      scrollObserver.observe(el);
    });
  } catch (e) {
    console.warn('Could not load projects data:', e);
  }
}

/* ============================================
   SECURITY: HTML ESCAPE HELPER
   ============================================ */
function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================
   SHARED OBSERVER (for dynamically added elements)
   ============================================ */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initBackToTop();
  typewriterTick();
  renderExperience();
  renderSkills();
  renderProjects();
});
