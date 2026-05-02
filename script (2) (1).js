/* ============================================================
   PORTFOLIO FN_SEC — script.js v3.0 (STABLE)
   ============================================================ */

/* ─── DEFAULT DATA ─── */
const DEFAULT_DATA = {
  password: "Admin@2025", n8n_webhook: "",
  profile: {
    photo: null, name: "DJOUMESSI TATSIFANG", firstname: "Fredy Nelson",
    title: "Ingénieur Cybersécurité", location: "France",
    accroche: "Passionné par la cybersécurité et la protection des systèmes d'information. Orienté sécurité offensive, Cloud et automatisation No-Code."
  },
  apropos: {
    paragraphes: [
      "Bonjour, je suis <strong>Fredy Nelson DJOUMESSI TATSIFANG</strong>, étudiant en ingénierie à l'ESAIP, spécialisé en cybersécurité.",
      "Mon objectif est de contribuer à la sécurisation des infrastructures numériques à travers des approches rigoureuses et une veille technologique constante.",
      "Passionné également par l'automatisation No-Code avec n8n, Make et les architectures Cloud."
    ],
    photos: []
  },
  infos: {
    nom: "Fredy Nelson DJOUMESSI", email: "fndjoumessi@gmail.com",
    tel: "+33 7 58 59 62 75", location: "France",
    formation: "ESAIP école d'ingénieur saint barthélemy anjou",
    specialite: "Cybersécurité"
  },
  competences: [
    { id:"sec-off", category:"Sécurité Offensive", icon:"fas fa-crosshairs",
      skills:[{name:"Pentesting",level:85},{name:"Kali Linux / Metasploit",level:80},{name:"CTF / Exploitation",level:75}]},
    { id:"cloud", category:"Cloud & DevOps", icon:"fas fa-cloud",
      skills:[{name:"AWS / Azure",level:70},{name:"Docker / Conteneurs",level:65},{name:"CI/CD Pipelines",level:60}]},
    { id:"nocode", category:"No-Code & Automatisation", icon:"fas fa-robot",
      skills:[{name:"n8n",level:90},{name:"Make (Integromat)",level:85},{name:"Waha / WhatsApp API",level:80}]},
    { id:"reseau", category:"Réseau & Système", icon:"fas fa-network-wired",
      skills:[{name:"TCP/IP / Protocoles",level:85},{name:"Linux / Windows Server",level:80},{name:"Active Directory",level:65}]}
  ],
  certifications: [
    {name:"TryHackMe",icon:"fas fa-trophy"},
    {name:"HackTheBox",icon:"fas fa-box"},
    {name:"[Certif 3]",icon:"fas fa-certificate"}
  ],
  experiences: { stages: [], academique: [] },
  projects: [],
  interets: [
    {icon:"fas fa-robot",title:"No-Code & Automatisation",desc:"Je crée des systèmes automatisés avec n8n, Make et d'autres outils no-code pendant mon temps libre."},
    {icon:"fas fa-futbol",title:"Football",desc:"Passionné de football, je suis l'actualité sportive et joue régulièrement en équipe."},
    {icon:"fas fa-plane",title:"Voyages",desc:"Explorer de nouveaux pays et cultures est une de mes grandes passions."},
    {icon:"fas fa-cloud",title:"Cloud Computing",desc:"Veille constante sur AWS, Azure, GCP et les architectures modernes."}
  ],
  contact: {
    linkedin: "https://www.linkedin.com/in/fredy-nelson-djoumessi-181375394",
    github: "https://github.com/HERITY-DJOUMSS"
  }
};

/* ─── DATA MANAGEMENT ─── */
function getData() {
  try {
    const raw = localStorage.getItem('fn_portfolio_data');
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const stored = JSON.parse(raw);
    // Merge superficiel pour les clés manquantes
    const merged = JSON.parse(JSON.stringify(DEFAULT_DATA));
    Object.keys(stored).forEach(k => { merged[k] = stored[k]; });
    return merged;
  } catch(e) {
    console.warn('getData error, using defaults:', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function getCloudConfig() {
  try { return JSON.parse(localStorage.getItem('fn_cloud_config') || '{}'); }
  catch(e) { return {}; }
}

async function syncFromCloud() {
  try {
    const cfg = getCloudConfig();
    if (!cfg.binId || !cfg.apiKey) return;
    const res = await fetch('https://api.jsonbin.io/v3/b/' + cfg.binId + '/latest', {
      headers: { 'X-Master-Key': cfg.apiKey }
    });
    if (!res.ok) return;
    const json = await res.json();
    if (json.record && typeof json.record === 'object') {
      localStorage.setItem('fn_portfolio_data', JSON.stringify(json.record));
      renderAll();
    }
  } catch(e) { /* pas de cloud configuré, pas grave */ }
}

/* ─── MATRIX RAIN ─── */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*[]{}|<>/\\';
  const fs = 13;
  let drops = [];
  function initDrops() { drops = Array(Math.floor(canvas.width / fs)).fill(1); }
  initDrops();
  window.addEventListener('resize', initDrops);
  setInterval(function() {
    ctx.fillStyle = 'rgba(5,9,8,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fs + 'px Share Tech Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = 'rgba(0,' + (Math.floor(Math.random()*100)+155) + ',65,' + (Math.random()*0.5+0.2) + ')';
      ctx.fillText(c, i * fs, drops[i] * fs);
      if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 40);
})();

/* ─── TYPING EFFECT ─── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = ['Ingénieur Cybersécurité','Expert No-Code & n8n','Cloud Security Enthusiast','CTF Player & Pentester'];
  let pi = 0, ci = 0, del = false;
  function tick() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ci + 1); ci++;
      if (ci === cur.length) { del = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = cur.slice(0, ci - 1); ci--;
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, del ? 55 : 100);
  }
  tick();
})();

/* ─── NAVBAR SCROLL ─── */
window.addEventListener('scroll', function() {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── BURGER / SIDEBAR ─── */
(function initSidebar() {
  const burger = document.getElementById('burgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('sidebarClose');
  if (!burger || !sidebar) return;

  function open() { sidebar.classList.add('open'); overlay.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { sidebar.classList.remove('open'); overlay.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; }
  burger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);
  document.querySelectorAll('.sidebar-link').forEach(function(l) { l.addEventListener('click', close); });
})();

/* ─── ACTIVE SIDEBAR LINK ─── */
(function initSidebarActive() {
  const links = document.querySelectorAll('.sidebar-link');
  if (!links.length) return;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(function(l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  document.querySelectorAll('section[id]').forEach(function(s) { obs.observe(s); });
})();

/* ─── EXP TABS ─── (appelé à chaque render pour re-attacher les listeners) ─── */
function initExpTabs() {
  document.querySelectorAll('.exp-tab').forEach(function(tab) {
    tab.onclick = function() {
      document.querySelectorAll('.exp-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.exp-content').forEach(function(c) { c.classList.remove('active'); });
      tab.classList.add('active');
      const content = document.getElementById('tab-' + tab.dataset.tab);
      if (content) content.classList.add('active');
    };
  });
}

/* ─── STARS AVIS ─── */
(function initStars() {
  const stars = document.querySelectorAll('.star');
  const feedback = document.getElementById('starsFeedback');
  const noteInput = document.getElementById('noteInput');
  if (!stars.length) return;
  const msgs = ['','À améliorer','Peut mieux faire','Bien','Très bien !','Excellent ! 🔥'];
  stars.forEach(function(star) {
    star.addEventListener('mouseover', function() {
      const v = +star.dataset.val;
      stars.forEach(function(s) { s.classList.toggle('active', +s.dataset.val <= v); });
      if (feedback) feedback.textContent = msgs[v];
    });
    star.addEventListener('click', function() {
      const v = +star.dataset.val;
      if (noteInput) noteInput.value = v;
      stars.forEach(function(s) { s.classList.toggle('active', +s.dataset.val <= v); });
      if (feedback) feedback.textContent = '✓ Note : ' + v + '/5 — ' + msgs[v];
    });
  });
  const row = document.getElementById('starsRow');
  if (row) row.addEventListener('mouseleave', function() {
    if (!noteInput || !noteInput.value || noteInput.value === '0') {
      stars.forEach(function(s) { s.classList.remove('active'); });
      if (feedback) feedback.textContent = '';
    }
  });
})();

/* ─── AVIS FORM ─── */
(function initAvisForm() {
  const form = document.getElementById('avisForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const d = getData();
    if (!d.n8n_webhook) {
      const errEl = document.getElementById('formError');
      if (errEl) errEl.style.display = 'flex';
      return;
    }
    const noteInput = document.getElementById('noteInput');
    const payload = {
      nom: form.nom.value, email: form.email ? form.email.value : '',
      message: form.message.value, note: noteInput ? noteInput.value : '0',
      date: new Date().toLocaleString('fr-FR'), source: window.location.href
    };
    try {
      await fetch(d.n8n_webhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), mode:'no-cors' });
      form.style.display = 'none';
      const ok = document.getElementById('formSuccess');
      if (ok) ok.style.display = 'flex';
    } catch(err) {
      const errEl = document.getElementById('formError');
      if (errEl) errEl.style.display = 'flex';
    }
  });
})();

/* ─── BACK TO TOP ─── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() { btn.classList.toggle('visible', window.scrollY > 400); });
  btn.addEventListener('click', function() { window.scrollTo({ top:0, behavior:'smooth' }); });
})();

/* ─── PROJECT MODAL ─── */
let currentSteps = [], currentStepIdx = 0;

window.openProjectModal = function(projId) {
  const d = getData();
  const proj = d.projects.find(function(p) { return p.id === projId; });
  if (!proj) return;
  const get = function(id) { return document.getElementById(id); };
  if (get('projModalId')) get('projModalId').textContent = '// ' + proj.name.toUpperCase();
  if (get('projModalTitle')) get('projModalTitle').textContent = proj.name;
  if (get('projModalStatus')) get('projModalStatus').textContent = proj.status || 'COMPLETED';
  if (get('projModalDesc')) get('projModalDesc').textContent = proj.description;
  if (get('projModalTags')) get('projModalTags').innerHTML = (proj.tags||[]).map(function(t) { return '<span class="proj-tag">' + t + '</span>'; }).join('');
  const coverEl = get('projModalCover');
  if (coverEl) coverEl.innerHTML = proj.cover
    ? '<img src="' + proj.cover + '" alt="' + proj.name + '" style="width:100%;height:100%;object-fit:cover"/>'
    : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--green3);font-size:3rem"><i class="' + (proj.icon||'fas fa-code') + '"></i></div>';
  const linksEl = get('projModalLinks');
  if (linksEl) {
    let links = '';
    if (proj.github) links += '<a href="' + proj.github + '" target="_blank" class="proj-link"><i class="fab fa-github"></i> Code</a>';
    if (proj.demo)   links += '<a href="' + proj.demo + '" target="_blank" class="proj-link proj-link-cyan"><i class="fas fa-external-link-alt"></i> Demo</a>';
    linksEl.innerHTML = links;
  }
  currentSteps = proj.steps || [];
  currentStepIdx = 0;
  const stepsSection = get('stepsSection');
  if (stepsSection) stepsSection.style.display = currentSteps.length ? 'block' : 'none';
  if (currentSteps.length) renderStep();
  const modalOverlay = get('projModalOverlay');
  if (modalOverlay) modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function renderStep() {
  if (!currentSteps.length) return;
  const step = currentSteps[currentStepIdx];
  const counter = document.getElementById('stepCounter');
  const display = document.getElementById('stepDisplay');
  const dots = document.getElementById('stepsDots');
  const prev = document.getElementById('stepPrev');
  const next = document.getElementById('stepNext');
  if (counter) counter.textContent = (currentStepIdx+1) + ' / ' + currentSteps.length;
  if (display) display.innerHTML =
    (step.image ? '<div class="step-image-wrap"><img src="' + step.image + '" alt="' + (step.title||'') + '" class="step-image"/></div>' : '') +
    '<div class="step-content">' +
    (step.title ? '<div class="step-title"><i class="fas fa-chevron-right"></i> ' + step.title + '</div>' : '') +
    '<div class="step-caption">' + (step.caption||'') + '</div>' +
    '</div>';
  if (dots) dots.innerHTML = currentSteps.map(function(_,i) {
    return '<div class="step-dot ' + (i===currentStepIdx?'active':'') + '" onclick="goToStep(' + i + ')"></div>';
  }).join('');
  if (prev) prev.disabled = currentStepIdx === 0;
  if (next) next.disabled = currentStepIdx === currentSteps.length - 1;
}

window.goToStep = function(idx) { currentStepIdx = idx; renderStep(); };

(function initModal() {
  const prev = document.getElementById('stepPrev');
  const next = document.getElementById('stepNext');
  const closeBtn = document.getElementById('projModalClose');
  const overlay = document.getElementById('projModalOverlay');
  if (prev) prev.addEventListener('click', function() { if (currentStepIdx > 0) { currentStepIdx--; renderStep(); } });
  if (next) next.addEventListener('click', function() { if (currentStepIdx < currentSteps.length-1) { currentStepIdx++; renderStep(); } });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) {
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentStepIdx > 0) { currentStepIdx--; renderStep(); }
    if (e.key === 'ArrowRight' && currentStepIdx < currentSteps.length-1) { currentStepIdx++; renderStep(); }
  });
})();
function closeModal() {
  const overlay = document.getElementById('projModalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── RENDER HERO ─── */
function renderHero(d) {
  const p = d.profile || {};
  function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val || ''; }
  set('hero-name', p.name);
  set('hero-firstname', p.firstname);
  set('photo-name', p.name);
  set('photo-role', p.title);
  set('photo-loc', p.location);
  const nameEl = document.getElementById('hero-name');
  if (nameEl) nameEl.setAttribute('data-text', p.name || '');
  const pc = document.getElementById('hero-photo-container');
  if (pc && p.photo) {
    pc.innerHTML = '<img src="' + p.photo + '" alt="Photo" class="hero-photo"/><div class="photo-border-anim"></div>';
  }
  // Stats
  const sp = document.getElementById('stat-projets');
  const sc = document.getElementById('stat-certifs');
  if (sp) sp.textContent = (d.projects || []).length;
  if (sc) sc.textContent = (d.certifications || []).length;
  // Visiteur counter (toujours fonctionnel)
  const vc = document.getElementById('visitorCount');
  if (vc) {
    try {
      let cnt = parseInt(localStorage.getItem('fn_visit_count') || '0');
      if (!sessionStorage.getItem('fn_visited')) {
        cnt++;
        localStorage.setItem('fn_visit_count', cnt);
        sessionStorage.setItem('fn_visited', '1');
      }
      vc.textContent = cnt;
    } catch(e) { vc.textContent = '—'; }
  }
}

/* ─── RENDER À PROPOS ─── */
function renderApropos(d) {
  const ap = d.apropos || {};
  const inf = d.infos || {};
  const tc = document.getElementById('apropos-text-container');
  if (tc) {
    const paras = ap.paragraphes || [];
    tc.innerHTML = paras.map(function(p) { return '<p class="apropos-p">' + p + '</p>'; }).join('');
  }
  const phc = document.getElementById('apropos-photos-container');
  if (phc && ap.photos && ap.photos.length) {
    phc.innerHTML = ap.photos.map(function(ph) {
      return '<div class="apropos-photo-item"><img src="' + ph.src + '" alt="' + (ph.caption||'') + '" class="apropos-photo"/><div class="apropos-photo-caption">' + (ph.caption||'') + '</div></div>';
    }).join('');
  }
  const ig = document.getElementById('info-grid-container');
  if (ig) ig.innerHTML =
    '<div class="info-item"><i class="fas fa-user"></i><div><div class="info-label">NOM</div><div class="info-val">' + (inf.nom||'—') + '</div></div></div>' +
    '<div class="info-item"><i class="fas fa-envelope"></i><div><div class="info-label">EMAIL</div><div class="info-val">' + (inf.email||'—') + '</div></div></div>' +
    '<div class="info-item"><i class="fas fa-phone"></i><div><div class="info-label">TÉL.</div><div class="info-val">' + (inf.tel||'—') + '</div></div></div>' +
    '<div class="info-item"><i class="fas fa-map-marker-alt"></i><div><div class="info-label">LOCALISATION</div><div class="info-val">' + (inf.location||'—') + '</div></div></div>' +
    '<div class="info-item"><i class="fas fa-graduation-cap"></i><div><div class="info-label">FORMATION</div><div class="info-val">' + (inf.formation||'—') + '</div></div></div>' +
    '<div class="info-item"><i class="fas fa-shield-alt"></i><div><div class="info-label">SPÉCIALITÉ</div><div class="info-val">' + (inf.specialite||'—') + '</div></div></div>';
}

/* ─── RENDER COMPÉTENCES ─── */
function renderCompetences(d) {
  const container = document.getElementById('skills-container');
  if (!container) return;
  const competences = d.competences || [];
  container.innerHTML = competences.map(function(cat) {
    return '<div class="skill-category">' +
      '<div class="skill-cat-title"><i class="' + cat.icon + '"></i> ' + cat.category + '</div>' +
      '<div class="skill-list">' +
      (cat.skills||[]).map(function(s) {
        return '<div class="skill-item">' +
          '<div class="skill-info"><span>' + s.name + '</span><span class="skill-pct">' + s.level + '%</span></div>' +
          '<div class="skill-bar"><div class="skill-fill" style="--w:' + s.level + '%"></div></div>' +
          '</div>';
      }).join('') +
      '</div></div>';
  }).join('');
  const certGrid = document.getElementById('certifs-grid');
  if (certGrid) {
    const certs = d.certifications || [];
    certGrid.innerHTML = certs.map(function(c) {
      return '<div class="certif-badge"><i class="' + (c.icon||'fas fa-certificate') + '"></i> ' + c.name + '</div>';
    }).join('');
  }
}

/* ─── RENDER EXPÉRIENCES ─── */
function renderExperiences(d) {
  const exp = d.experiences || { stages:[], academique:[] };
  const stagesEl = document.getElementById('stages-timeline');
  const acadEl   = document.getElementById('academique-timeline');
  if (stagesEl) {
    if (!exp.stages || !exp.stages.length) {
      stagesEl.innerHTML = '<div class="no-content-msg"><i class="fas fa-briefcase"></i><p>Ajoute tes stages depuis l\'interface admin.</p></div>';
    } else {
      stagesEl.innerHTML = exp.stages.map(function(e) {
        return '<div class="tl-item"><div class="tl-date">' + (e.date||'') + '</div>' +
          '<div class="tl-card"><div class="tl-card-top"><div class="tl-title">' + (e.title||'') + '</div><div class="tl-badge">STAGE</div></div>' +
          '<div class="tl-company"><i class="fas fa-building"></i> ' + (e.company||'') + ' · ' + (e.location||'') + '</div>' +
          '<div class="tl-desc">' + (e.description||'') + '</div>' +
          (e.tags&&e.tags.length ? '<div class="tl-tags">' + e.tags.map(function(t){return '<span class="tl-tag">'+t+'</span>';}).join('') + '</div>' : '') +
          '</div></div>';
      }).join('');
    }
  }
  if (acadEl) {
    if (!exp.academique || !exp.academique.length) {
      acadEl.innerHTML = '<div class="no-content-msg"><i class="fas fa-graduation-cap"></i><p>Ajoute ta formation depuis l\'interface admin.</p></div>';
    } else {
      acadEl.innerHTML = exp.academique.map(function(e) {
        return '<div class="tl-item"><div class="tl-date">' + (e.date||'') + '</div>' +
          '<div class="tl-card"><div class="tl-card-top"><div class="tl-title">' + (e.title||'') + '</div><div class="tl-badge tl-badge-cyan">DIPLÔME</div></div>' +
          '<div class="tl-company"><i class="fas fa-university"></i> ' + (e.institution||'') + ' · ' + (e.location||'') + '</div>' +
          '<div class="tl-desc">' + (e.description||'') + '</div>' +
          '</div></div>';
      }).join('');
    }
  }
  // Ré-attacher les tabs après render
  initExpTabs();
}

/* ─── RENDER PROJETS ─── */
const CARD_COLORS = ['', 'proj-card-red', 'proj-card-cyan', 'proj-card-purple'];
function renderProjects(d) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  const projects = d.projects || [];
  if (!projects.length) {
    grid.innerHTML = '<div class="no-content-msg"><i class="fas fa-folder-open"></i><p>Aucun projet.<br>Connecte-toi à l\'interface admin pour en ajouter.</p></div>';
    return;
  }
  grid.innerHTML = projects.map(function(proj, i) {
    return '<div class="proj-card ' + (CARD_COLORS[i % CARD_COLORS.length]||'') + '" onclick="openProjectModal(\'' + proj.id + '\')">' +
      (proj.cover ? '<div class="proj-cover" style="background-image:url(\'' + proj.cover + '\')"></div>' : '') +
      '<div class="proj-header"><div class="proj-id">// PROJ_' + String(i+1).padStart(3,'0') + '</div>' +
      '<div class="proj-status ' + (proj.status==='ACTIVE'?'proj-status-red':'') + '">' + (proj.status||'COMPLETED') + '</div></div>' +
      '<div class="proj-icon"><i class="' + (proj.icon||'fas fa-code') + '"></i></div>' +
      '<h3 class="proj-title">' + proj.name + '</h3>' +
      '<p class="proj-desc">' + proj.description + '</p>' +
      (proj.tags&&proj.tags.length ? '<div class="proj-tags">' + proj.tags.map(function(t){return '<span class="proj-tag">'+t+'</span>';}).join('') + '</div>' : '') +
      '<div class="proj-cta"><span class="proj-cta-btn"><i class="fas fa-eye"></i> Voir le projet</span></div>' +
      '</div>';
  }).join('');
}

/* ─── RENDER CENTRES D'INTÉRÊT ─── */
function renderInterets(d) {
  const grid = document.getElementById('interets-grid');
  if (!grid) return;
  const interets = d.interets || [];
  grid.innerHTML = interets.map(function(item) {
    return '<div class="interet-card">' +
      '<div class="interet-icon"><i class="' + item.icon + '"></i></div>' +
      '<div class="interet-title">' + item.title + '</div>' +
      '<div class="interet-desc">' + item.desc + '</div>' +
      '</div>';
  }).join('');
}

/* ─── FOOTER YEAR ─── */
(function() { const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); })();

/* ─── TILT EFFECT ─── */
function addTilt() {
  document.querySelectorAll('.proj-card, .contact-card, .interet-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
      card.style.transform = 'perspective(600px) rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg) translateY(-3px)';
    });
    card.addEventListener('mouseleave', function() { card.style.transform = ''; });
  });
}

/* ─── MAIN RENDER ─── */
function renderAll() {
  const d = getData();
  try { renderHero(d); }        catch(e) { console.error('renderHero:', e); }
  try { renderApropos(d); }     catch(e) { console.error('renderApropos:', e); }
  try { renderCompetences(d); } catch(e) { console.error('renderCompetences:', e); }
  try { renderExperiences(d); } catch(e) { console.error('renderExperiences:', e); }
  try { renderProjects(d); }    catch(e) { console.error('renderProjects:', e); }
  try { renderInterets(d); }    catch(e) { console.error('renderInterets:', e); }
  setTimeout(function() { try { addTilt(); } catch(e) {} }, 100);
}

/* ─── LANCEMENT ─── */
renderAll();
syncFromCloud();

// Refresh quand on revient sur la page (depuis admin)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') renderAll();
});
window.addEventListener('focus', renderAll);

// Refresh si localStorage change (autre onglet)
window.addEventListener('storage', function(e) {
  if (e.key === 'fn_portfolio_data') renderAll();
});

// Refresh toutes les 2 secondes (filet de sécurité mobile)
setInterval(renderAll, 2000);
