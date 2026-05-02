/* ============================================================
   PORTFOLIO FN_SEC — script.js v2.0
   Dynamic rendering from localStorage
   ============================================================ */

/* ─── DEFAULT DATA ─── */
const DEFAULT_DATA = {
  password: "Admin@2025",
  n8n_webhook: "",
  profile: {
    photo: null,
    name: "DJOUMESSI TATSIFANG",
    firstname: "Fredy Nelson",
    title: "Ingénieur Cybersécurité",
    location: "France",
    accroche: "Passionné par la cybersécurité et la protection des systèmes d'information. Orienté sécurité offensive, Cloud et automatisation No-Code."
  },
  apropos: {
    paragraphes: [
      "Bonjour, je suis <strong>Fredy Nelson DJOUMESSI TATSIFANG</strong>, étudiant en ingénierie spécialisé en cybersécurité. Passionné par la protection des systèmes d'information, l'analyse des menaces et les techniques offensives et défensives.",
      "Mon objectif est de contribuer à la sécurisation des infrastructures numériques à travers des approches rigoureuses et une veille technologique constante.",
      "[Ajoute ici tes infos complémentaires depuis l'interface admin...]"
    ],
    photos: []
  },
  infos: {
    nom: "Fredy Nelson DJOUMESSI",
    email: "fndjoumessi@gmail.com",
    tel: "+33 7 58 59 62 75",
    location: "France",
    formation: "[Ton école / diplôme]",
    specialite: "Cybersécurité"
  },
  competences: [
    {
      id: "sec-off", category: "Sécurité Offensive", icon: "fas fa-crosshairs",
      skills: [
        { name: "Pentesting", level: 85 },
        { name: "Kali Linux / Metasploit", level: 80 },
        { name: "CTF / Exploitation", level: 75 }
      ]
    },
    {
      id: "cloud", category: "Cloud & DevOps", icon: "fas fa-cloud",
      skills: [
        { name: "AWS / Azure", level: 70 },
        { name: "Docker / Conteneurs", level: 65 },
        { name: "CI/CD Pipelines", level: 60 }
      ]
    },
    {
      id: "nocode", category: "No-Code & Automatisation", icon: "fas fa-robot",
      skills: [
        { name: "n8n", level: 90 },
        { name: "Make (Integromat)", level: 85 },
        { name: "Waha / WhatsApp API", level: 80 }
      ]
    },
    {
      id: "reseau", category: "Réseau & Système", icon: "fas fa-network-wired",
      skills: [
        { name: "TCP/IP / Protocoles", level: 85 },
        { name: "Linux / Windows Server", level: 80 },
        { name: "Active Directory", level: 65 }
      ]
    }
  ],
  certifications: [
    { name: "TryHackMe", icon: "fas fa-trophy" },
    { name: "HackTheBox", icon: "fas fa-box" },
    { name: "[Certif 3]", icon: "fas fa-certificate" }
  ],
  experiences: { stages: [], academique: [] },
  projects: [],
  interets: [
    { icon: "fas fa-robot",  title: "No-Code & Automatisation", desc: "Je passe mon temps libre à créer des systèmes automatisés avec n8n, Make et d'autres outils no-code. C'est ma vraie passion." },
    { icon: "fas fa-futbol", title: "Football", desc: "Passionné de football, je suis de près l'actualité sportive et aime jouer en équipe." },
    { icon: "fas fa-plane",  title: "Voyages", desc: "Explorer de nouveaux pays et cultures est une de mes grandes passions." },
    { icon: "fas fa-cloud",  title: "Cloud Computing", desc: "Veille constante sur les nouveautés cloud (AWS, Azure, GCP) et les architectures modernes." }
  ],
  contact: {
    linkedin: "https://www.linkedin.com/in/fredy-nelson-djoumessi-181375394",
    github: "https://github.com/HERITY-DJOUMSS"
  }
};

/* ─── DATA MANAGEMENT ─── */
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else { target[key] = source[key]; }
  }
  return target;
}

function getCloudConfig() {
  try { return JSON.parse(localStorage.getItem('fn_cloud_config') || '{}'); }
  catch(e) { return {}; }
}

function getData() {
  try {
    const raw = localStorage.getItem('fn_portfolio_data');
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), JSON.parse(raw));
  } catch (e) { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}

/* Sync depuis JSONBin.io (multi-appareils) */
async function syncFromCloud() {
  const cfg = getCloudConfig();
  if (!cfg.binId || !cfg.apiKey) return;
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/' + cfg.binId + '/latest', {
      headers: { 'X-Master-Key': cfg.apiKey }
    });
    if (!res.ok) return;
    const json = await res.json();
    const data = json.record;
    if (data && typeof data === 'object') {
      localStorage.setItem('fn_portfolio_data', JSON.stringify(data));
      renderAll();
    }
  } catch(e) { console.warn('Sync cloud echoue, utilisation localStorage.'); }
}

/* ─── MATRIX RAIN ─── */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*[]{}|<>/\\ΨΩΔΠλβ∀∃';
const fontSize = 13;
let drops = Array(Math.floor(window.innerWidth / fontSize)).fill(1);
window.addEventListener('resize', () => { drops = Array(Math.floor(window.innerWidth / fontSize)).fill(1); });
function drawMatrix() {
  ctx.fillStyle = 'rgba(5,9,8,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px 'Share Tech Mono',monospace`;
  drops.forEach((drop, i) => {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillStyle = `rgba(0,${Math.floor(Math.random()*100+155)},65,${Math.random()*0.5+0.2})`;
    ctx.fillText(char, i * fontSize, drop * fontSize);
    if (drop * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 40);

/* ─── TYPING EFFECT ─── */
const phrases = ['Ingénieur Cybersécurité','Expert No-Code & n8n','Cloud Security Enthusiast','CTF Player & Pentester','Automatisation & DevOps'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');
function typeEffect() {
  const cur = phrases[phraseIdx];
  if (!deleting) {
    typingEl.textContent = cur.slice(0, charIdx + 1); charIdx++;
    if (charIdx === cur.length) { deleting = true; setTimeout(typeEffect, 2000); return; }
  } else {
    typingEl.textContent = cur.slice(0, charIdx - 1); charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeEffect, deleting ? 55 : 100);
}
typeEffect();

/* ─── NAVBAR ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

/* ─── BURGER / SIDEBAR ─── */
const burgerBtn = document.getElementById('burgerBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const openSidebar = () => { sidebar.classList.add('open'); overlay.classList.add('open'); burgerBtn.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); burgerBtn.classList.remove('open'); document.body.style.overflow = ''; };
burgerBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar-link').forEach(l => l.addEventListener('click', closeSidebar));

/* ─── ACTIVE SIDEBAR LINK ─── */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -60% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ─── EXP TABS ─── */
document.querySelectorAll('.exp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.exp-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ─── STARS RATING ─── */
const stars = document.querySelectorAll('.star');
const starsFeedback = document.getElementById('starsFeedback');
const noteInput = document.getElementById('noteInput');
const starMsgs = ['', 'À améliorer', 'Peut mieux faire', 'Bien', 'Très bien !', 'Excellent ! 🔥'];
stars.forEach(star => {
  star.addEventListener('mouseover', () => { const v = +star.dataset.val; stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= v)); starsFeedback.textContent = starMsgs[v]; });
  star.addEventListener('click', () => { const v = +star.dataset.val; noteInput.value = v; stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= v)); starsFeedback.textContent = '✓ Note : ' + v + '/5 — ' + starMsgs[v]; });
});
document.getElementById('starsRow').addEventListener('mouseleave', () => { if (!noteInput.value || noteInput.value === '0') { stars.forEach(s => s.classList.remove('active')); starsFeedback.textContent = ''; } });

/* ─── AVIS FORM (n8n webhook) ─── */
document.getElementById('avisForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = getData();
  const webhook = d.n8n_webhook;
  if (!webhook) { document.getElementById('formError').style.display = 'flex'; return; }
  const form = e.target;
  const payload = {
    nom: form.nom.value,
    email: form.email?.value || '',
    message: form.message.value,
    note: noteInput.value,
    date: new Date().toLocaleString('fr-FR'),
    source: window.location.href
  };
  try {
    await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), mode: 'no-cors' });
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'flex';
  } catch (err) { document.getElementById('formError').style.display = 'flex'; }
});

/* ─── BACK TO TOP ─── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });

/* ─── RENDER HERO ─── */
function renderHero(d) {
  const p = d.profile;
  // Nom / prénom
  document.getElementById('hero-name').textContent = p.name;
  document.getElementById('hero-name').setAttribute('data-text', p.name);
  document.getElementById('hero-firstname').textContent = p.firstname;
  document.getElementById('photo-name').textContent = p.name;
  document.getElementById('photo-role').textContent = p.title;
  document.getElementById('photo-loc').textContent = p.location;
  // Photo
  const photoContainer = document.getElementById('hero-photo-container');
  if (p.photo) {
    photoContainer.innerHTML = `<img src="${p.photo}" alt="Photo de ${p.firstname}" class="hero-photo"/><div class="photo-border-anim"></div>`;
  }
  // Stats
  document.getElementById('stat-projets').textContent = d.projects.length;
  document.getElementById('stat-certifs').textContent = d.certifications.length;
  // Visiteur counter
  let cnt = parseInt(localStorage.getItem('fn_visit_count') || '0') + 1;
  localStorage.setItem('fn_visit_count', cnt);
  document.getElementById('visitorCount').textContent = cnt;
}

/* ─── RENDER À PROPOS ─── */
function renderApropos(d) {
  // Paragraphes
  const textContainer = document.getElementById('apropos-text-container');
  textContainer.innerHTML = d.apropos.paragraphes.map(p => `<p class="apropos-p">${p}</p>`).join('');
  // Photos avec légendes
  const photosContainer = document.getElementById('apropos-photos-container');
  if (d.apropos.photos && d.apropos.photos.length > 0) {
    photosContainer.innerHTML = d.apropos.photos.map(ph => `
      <div class="apropos-photo-item reveal">
        <img src="${ph.src}" alt="${ph.caption}" class="apropos-photo"/>
        <div class="apropos-photo-caption">${ph.caption}</div>
      </div>
    `).join('');
  }
  // Info grid
  const infoGrid = document.getElementById('info-grid-container');
  const inf = d.infos;
  infoGrid.innerHTML = `
    <div class="info-item reveal"><i class="fas fa-user"></i><div><div class="info-label">NOM</div><div class="info-val">${inf.nom}</div></div></div>
    <div class="info-item reveal"><i class="fas fa-envelope"></i><div><div class="info-label">EMAIL</div><div class="info-val">${inf.email}</div></div></div>
    <div class="info-item reveal"><i class="fas fa-phone"></i><div><div class="info-label">TÉL.</div><div class="info-val">${inf.tel}</div></div></div>
    <div class="info-item reveal"><i class="fas fa-map-marker-alt"></i><div><div class="info-label">LOCALISATION</div><div class="info-val">${inf.location}</div></div></div>
    <div class="info-item reveal"><i class="fas fa-graduation-cap"></i><div><div class="info-label">FORMATION</div><div class="info-val">${inf.formation}</div></div></div>
    <div class="info-item reveal"><i class="fas fa-shield-alt"></i><div><div class="info-label">SPÉCIALITÉ</div><div class="info-val">${inf.specialite}</div></div></div>
  `;
}

/* ─── RENDER COMPÉTENCES ─── */
function renderCompetences(d) {
  const container = document.getElementById('skills-container');
  container.innerHTML = d.competences.map(cat => `
    <div class="skill-category reveal">
      <div class="skill-cat-title"><i class="${cat.icon}"></i> ${cat.category}</div>
      <div class="skill-list">
        ${cat.skills.map(s => `
          <div class="skill-item">
            <div class="skill-info"><span>${s.name}</span><span class="skill-pct">${s.level}%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="--w:${s.level}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  // Certifications
  const certGrid = document.getElementById('certifs-grid');
  certGrid.innerHTML = d.certifications.map(c => `
    <div class="certif-badge reveal"><i class="${c.icon || 'fas fa-certificate'}"></i> ${c.name}</div>
  `).join('');
}

/* ─── RENDER EXPÉRIENCES ─── */
function renderExperiences(d) {
  const stagesEl = document.getElementById('stages-timeline');
  const acadEl = document.getElementById('academique-timeline');
  if (d.experiences.stages.length === 0) {
    stagesEl.innerHTML = `<div class="no-content-msg"><i class="fas fa-briefcase"></i><p>Ajoute tes stages depuis l'<a href="admin.html">interface admin</a>.</p></div>`;
  } else {
    stagesEl.innerHTML = d.experiences.stages.map(exp => `
      <div class="tl-item reveal">
        <div class="tl-date">${exp.date}</div>
        <div class="tl-card">
          <div class="tl-card-top"><div class="tl-title">${exp.title}</div><div class="tl-badge">STAGE</div></div>
          <div class="tl-company"><i class="fas fa-building"></i> ${exp.company} · ${exp.location}</div>
          <div class="tl-desc">${exp.description}</div>
          ${exp.tags && exp.tags.length ? `<div class="tl-tags">${exp.tags.map(t => `<span class="tl-tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    `).join('');
  }
  if (d.experiences.academique.length === 0) {
    acadEl.innerHTML = `<div class="no-content-msg"><i class="fas fa-graduation-cap"></i><p>Ajoute ta formation depuis l'<a href="admin.html">interface admin</a>.</p></div>`;
  } else {
    acadEl.innerHTML = d.experiences.academique.map(exp => `
      <div class="tl-item reveal">
        <div class="tl-date">${exp.date}</div>
        <div class="tl-card">
          <div class="tl-card-top"><div class="tl-title">${exp.title}</div><div class="tl-badge tl-badge-cyan">DIPLÔME</div></div>
          <div class="tl-company"><i class="fas fa-university"></i> ${exp.institution} · ${exp.location}</div>
          <div class="tl-desc">${exp.description}</div>
        </div>
      </div>
    `).join('');
  }
}

/* ─── RENDER PROJETS ─── */
const CARD_COLORS = ['', 'proj-card-red', 'proj-card-cyan', 'proj-card-purple'];
function renderProjects(d) {
  const grid = document.getElementById('projects-grid');
  if (d.projects.length === 0) {
    grid.innerHTML = `<div class="no-content-msg"><i class="fas fa-folder-open"></i><p>Aucun projet.<br>Connecte-toi à l'<a href="admin.html">interface admin</a> pour en ajouter.</p></div>`;
    return;
  }
  grid.innerHTML = d.projects.map((proj, i) => `
    <div class="proj-card ${CARD_COLORS[i % CARD_COLORS.length]}" onclick="openProjectModal('${proj.id}')">
      ${proj.cover ? `<div class="proj-cover" style="background-image:url('${proj.cover}')"></div>` : ''}
      <div class="proj-header">
        <div class="proj-id">// PROJ_${String(i+1).padStart(3,'0')}</div>
        <div class="proj-status ${proj.status === 'ACTIVE' ? 'proj-status-red' : ''}">${proj.status || 'COMPLETED'}</div>
      </div>
      <div class="proj-icon"><i class="${proj.icon || 'fas fa-code'}"></i></div>
      <h3 class="proj-title">${proj.name}</h3>
      <p class="proj-desc">${proj.description}</p>
      ${proj.tags && proj.tags.length ? `<div class="proj-tags">${proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>` : ''}
      <div class="proj-cta"><span class="proj-cta-btn"><i class="fas fa-eye"></i> Voir le projet</span></div>
    </div>
  `).join('');
}

/* ─── RENDER CENTRES D'INTÉRÊT ─── */
function renderInterets(d) {
  const grid = document.getElementById('interets-grid');
  grid.innerHTML = d.interets.map(item => `
    <div class="interet-card reveal">
      <div class="interet-icon"><i class="${item.icon}"></i></div>
      <div class="interet-title">${item.title}</div>
      <div class="interet-desc">${item.desc}</div>
    </div>
  `).join('');
}

/* ─── PROJECT MODAL ─── */
let currentSteps = [], currentStepIdx = 0;

function openProjectModal(projId) {
  const d = getData();
  const proj = d.projects.find(p => p.id === projId);
  if (!proj) return;
  document.getElementById('projModalId').textContent = `// ${proj.name.toUpperCase()}`;
  document.getElementById('projModalTitle').textContent = proj.name;
  document.getElementById('projModalStatus').textContent = proj.status || 'COMPLETED';
  document.getElementById('projModalDesc').textContent = proj.description;
  document.getElementById('projModalTags').innerHTML = (proj.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
  // Cover
  const coverEl = document.getElementById('projModalCover');
  coverEl.innerHTML = proj.cover
    ? `<img src="${proj.cover}" alt="${proj.name}" style="width:100%;height:100%;object-fit:cover"/>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--green3);font-size:3rem"><i class="${proj.icon || 'fas fa-code'}"></i></div>`;
  // Links
  const linksEl = document.getElementById('projModalLinks');
  let links = '';
  if (proj.github) links += `<a href="${proj.github}" target="_blank" class="proj-link"><i class="fab fa-github"></i> Code</a>`;
  if (proj.demo)   links += `<a href="${proj.demo}" target="_blank" class="proj-link proj-link-cyan"><i class="fas fa-external-link-alt"></i> Demo</a>`;
  linksEl.innerHTML = links;
  // Steps
  currentSteps = proj.steps || [];
  currentStepIdx = 0;
  const stepsSection = document.getElementById('stepsSection');
  if (currentSteps.length > 0) {
    stepsSection.style.display = 'block';
    renderStep();
  } else {
    stepsSection.style.display = 'none';
  }
  // Open modal
  document.getElementById('projModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderStep() {
  if (currentSteps.length === 0) return;
  const step = currentSteps[currentStepIdx];
  document.getElementById('stepCounter').textContent = `${currentStepIdx + 1} / ${currentSteps.length}`;
  document.getElementById('stepDisplay').innerHTML = `
    ${step.image ? `<div class="step-image-wrap"><img src="${step.image}" alt="${step.title || ''}" class="step-image"/></div>` : ''}
    <div class="step-content">
      ${step.title ? `<div class="step-title"><i class="fas fa-chevron-right"></i> ${step.title}</div>` : ''}
      <div class="step-caption">${step.caption || ''}</div>
    </div>
  `;
  // Dots
  const dots = document.getElementById('stepsDots');
  dots.innerHTML = currentSteps.map((_, i) => `<div class="step-dot ${i === currentStepIdx ? 'active' : ''}" onclick="goToStep(${i})"></div>`).join('');
  document.getElementById('stepPrev').disabled = currentStepIdx === 0;
  document.getElementById('stepNext').disabled = currentStepIdx === currentSteps.length - 1;
}

function goToStep(idx) { currentStepIdx = idx; renderStep(); }
document.getElementById('stepPrev').addEventListener('click', () => { if (currentStepIdx > 0) { currentStepIdx--; renderStep(); } });
document.getElementById('stepNext').addEventListener('click', () => { if (currentStepIdx < currentSteps.length - 1) { currentStepIdx++; renderStep(); } });

function closeProjectModal() {
  document.getElementById('projModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('projModalClose').addEventListener('click', closeProjectModal);
document.getElementById('projModalOverlay').addEventListener('click', (e) => { if (e.target === document.getElementById('projModalOverlay')) closeProjectModal(); });
// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('projModalOverlay').classList.contains('open')) return;
  if (e.key === 'Escape') closeProjectModal();
  if (e.key === 'ArrowLeft' && currentStepIdx > 0) { currentStepIdx--; renderStep(); }
  if (e.key === 'ArrowRight' && currentStepIdx < currentSteps.length - 1) { currentStepIdx++; renderStep(); }
});

/* ─── CARD TILT EFFECT ─── */
function addTilt() {
  document.querySelectorAll('.proj-card, .contact-card, .interet-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
      card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ─── SCROLL REVEAL OBSERVER ─── */
function observeReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ─── FOOTER YEAR ─── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── MAIN RENDER ─── */
function renderAll() {
  const d = getData();
  renderHero(d);
  renderApropos(d);
  renderCompetences(d);
  renderExperiences(d);
  renderProjects(d);
  renderInterets(d);
  setTimeout(() => { observeReveal(); addTilt(); }, 100);
}

// Initial render (localStorage d'abord, rapide)
renderAll();

// Puis sync depuis le cloud si configuré (remplace et re-render si données plus récentes)
syncFromCloud();

// Listen for updates from admin panel (same browser, another tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'fn_portfolio_data') renderAll();
});
