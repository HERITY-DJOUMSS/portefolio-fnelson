/* =========================================================
   PORTFOLIO FN_SEC — script.js v8.0 — VERSION OMNIBUS
   Fusion complète : Fonctions Claude + Sync Cloud Sécurisée
   ========================================================= */

/** 1. CONFIGURATION & CONSTANTES **/
const BIN_ID = "69f7b799aaba882197692858"; 
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
const LS_KEY = 'fn_portfolio_data';

const DEF = {
    password: "Admin@2025",
    profile: { photo: null, name: "DJOUMESSI", firstname: "Fredy Nelson", title: "FUTUR Ingénieur Cybersécurité", location: "France" },
    experiences: { stages: [], academique: [] },
    projects: [],
    competences: [],
    certifications: [],
    interets: [],
    visitor_count: 0
};

/** 2. INITIALISATION AU CHARGEMENT **/
document.addEventListener('DOMContentLoaded', () => {
    initMatrixEffect(); // Effet visuel de fond
    initMenu();         // Menu Burger
    initVisitorCounter();
    
    // Chargement immédiat (Cache)
    const cached = localStorage.getItem(LS_KEY);
    if (cached) renderAll(JSON.parse(cached));

    // Synchronisation Cloud (Sans clé car Bin Public)
    fetch(JSONBIN_URL, { headers: { 'X-Bin-Meta': 'false' } })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            localStorage.setItem(LS_KEY, JSON.stringify(data));
            renderAll(data);
            updateStatus(true);
        })
        .catch(() => updateStatus(false));
});

/** 3. RENDU GLOBAL DE L'INTERFACE **/
function renderAll(d) {
    if (!d) return;

    // --- HERO & IDENTITÉ ---
    setText('hero-name', `${d.profile.firstname || ''} ${d.profile.name || ''}`);
    setText('hero-title', d.profile.title || '');
    const pImg = document.getElementById('profile-img');
    if (pImg && d.profile.photo) pImg.src = d.profile.photo;

    // --- COMPÉTENCES ---
    const cGrid = document.getElementById('competences-grid');
    if (cGrid && d.competences) {
        cGrid.innerHTML = d.competences.map(cat => `
            <div class="comp-card reveal">
                <div class="comp-header"><i class="${cat.icon}"></i> <h3>${cat.category}</h3></div>
                ${(cat.skills || []).map(s => `
                    <div class="skill-item">
                        <span>${s.name}</span>
                        <div class="skill-bar"><div class="skill-progress" style="width:${s.level}%"></div></div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // --- PROJETS (Avec système de modale Claude) ---
    const pGrid = document.getElementById('projects-grid');
    if (pGrid && d.projects) {
        pGrid.innerHTML = d.projects.map((p, idx) => `
            <div class="project-card reveal" onclick="openProjectModal(${idx})">
                <div class="proj-img"><img src="${p.image || ''}" alt=""></div>
                <div class="proj-content">
                    <div class="proj-id">#0${idx + 1}</div>
                    <h3>${p.title}</h3>
                    <p>${p.desc ? p.desc.substring(0, 80) : ''}...</p>
                    <div class="proj-tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
                </div>
            </div>
        `).join('');
    }

    // --- VIE ACADÉMIQUE (Bug 2 Fix) ---
    renderExperienceSection(d.experiences);

    // --- INTÉRÊTS ---
    const iGrid = document.getElementById('interets-grid');
    if (iGrid && d.interets) {
        iGrid.innerHTML = d.interets.map(i => `
            <div class="interet-card reveal">
                <i class="${i.icon}"></i>
                <h4>${i.title}</h4>
                <p>${i.desc}</p>
            </div>
        `).join('');
    }

    // Relance les animations
    setTimeout(initReveal, 300);
}

/** 4. FONCTIONNALITÉS EXPÉRIENCES (TABS) **/
function renderExperienceSection(exp) {
    const container = document.getElementById('exp-content');
    if (!container || !exp) return;

    container.innerHTML = `
        <div class="exp-tabs">
            <button class="exp-tab active" data-tab="stages">Stages & Pro</button>
            <button class="exp-tab" data-tab="etudes">Cursus Académique</button>
        </div>
        <div id="pane-stages" class="tab-pane active">
            ${(exp.stages || []).length ? exp.stages.map(s => `
                <div class="exp-item">
                    <div class="exp-date">${s.date || ''}</div>
                    <div class="exp-info"><h4>${s.role}</h4><h5>${s.company}</h5></div>
                </div>`).join('') : '<p class="empty">Aucune donnée</p>'}
        </div>
        <div id="pane-etudes" class="tab-pane">
            ${(exp.academique || []).length ? exp.academique.map(e => `
                <div class="exp-item">
                    <div class="exp-date">${e.date || ''}</div>
                    <div class="exp-info"><h4>${e.diploma}</h4><h5>${e.school}</h5></div>
                </div>`).join('') : '<p class="empty">Aucune donnée</p>'}
        </div>
    `;

    container.querySelectorAll('.exp-tab').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.exp-tab, .tab-pane').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`pane-${btn.dataset.tab}`).classList.add('active');
        };
    });
}

/** 5. SYSTÈME DE MODALE PROJET (Claude Spec) **/
window.openProjectModal = function(idx) {
    const d = JSON.parse(localStorage.getItem(LS_KEY));
    const p = d.projects[idx];
    if (!p) return;

    const modal = document.getElementById('projModal');
    const overlay = document.getElementById('projModalOverlay');
    
    document.getElementById('projModalTitle').textContent = p.title;
    document.getElementById('projModalDesc').textContent = p.desc;
    document.getElementById('projModalCover').style.backgroundImage = `url(${p.image || ''})`;
    
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
    document.getElementById('projModal').classList.remove('active');
    document.getElementById('projModalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
};

/** 6. UTILITAIRES & BUGS FIXES **/
function initMenu() {
    const b = document.getElementById('burgerBtn'), s = document.getElementById('sidebar'), o = document.getElementById('sidebarOverlay');
    const toggle = () => { [b, s, o].forEach(el => el && el.classList.toggle('active')); };
    if(b) b.onclick = toggle;
    if(o) o.onclick = toggle;
    document.querySelectorAll('.side-nav a').forEach(a => {
        a.onclick = () => {
            toggle();
            const target = document.querySelector(a.getAttribute('href'));
            if(target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        };
    });
}

function initReveal() {
    const obs = new IntersectionObserver(ents => {
        ents.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => {
        obs.observe(el);
        if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
}

function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('fn_v_count') || '0');
    count++;
    localStorage.setItem('fn_v_count', count);
    const el = document.getElementById('v_count');
    if(el) el.textContent = count.toString().padStart(5, '0');
}

function setText(id, t) { const el = document.getElementById(id); if(el) el.textContent = t; }

function updateStatus(live) {
    const st = document.getElementById('syncStatus');
    if(st) {
        st.innerHTML = live ? '● CLOUD LIVE' : '● LOCAL MODE';
        st.style.color = live ? 'var(--cyan)' : 'var(--red)';
    }
}

function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
    const chars = "01SEC-CYBER-FN-01";
    const drops = Array(Math.floor(w/20)).fill(1);
    function draw() {
        ctx.fillStyle = "rgba(5, 9, 8, 0.05)";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = "#00ff41";
        ctx.font = "15px monospace";
        drops.forEach((y, i) => {
            const text = chars[Math.floor(Math.random()*chars.length)];
            ctx.fillText(text, i*20, y*20);
            if(y*20 > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }
    setInterval(draw, 33);
}

// Global listeners
document.getElementById('projModalClose').onclick = closeProjectModal;
document.getElementById('projModalOverlay').onclick = closeProjectModal;
