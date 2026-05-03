/* FN_SEC Portfolio — script.js v5.1 — REWROTE & FIXED */

var JSONBIN_URL = 'https://api.jsonbin.io/v3/b/';
var LS_KEY = 'fn_portfolio_data';
var LS_CFG = 'fn_cloud_cfg';

/* ── DEFAULTS ── */
var DEF = {
  password:"Admin@2025", n8n_webhook:"",
  profile:{photo:null,name:"DJOUMESSI TATSIFANG",firstname:"Fredy Nelson",title:"FUTUR Ingénieur Cybersécurité",location:"France",accroche:"Passionné par la cybersécurité et la protection des systèmes d'information."},
  apropos:{paragraphes:["Bonjour..."],photos:[]},
  infos:{nom:"Fredy Nelson DJOUMESSI",email:"fndjoumessi@gmail.com",tel:"+33 7 58 59 62 75",location:"France",formation:"ESAIP",specialite:"Cybersécurité"},
  competences:[],
  certifications:[],
  experiences:{stages:[],academique:[]},
  projects:[],
  interets:[]
};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    refreshPortfolio();
    
    // Tentative Cloud
    var cfg = getCfg();
    if(cfg.binId && cfg.apiKey) {
        fetchFromCloud(function(data) {
            renderAll(data);
            updateSyncStatus(true);
        });
    } else {
        renderAll(getData());
        updateSyncStatus(false);
    }
});

/* ── GESTION DU MENU (BUG CORRIGÉ) ── */
function initMenu() {
    var burger = document.getElementById('burgerBtn');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var links = document.querySelectorAll('.side-nav a');

    function toggleMenu() {
        burger.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if(burger) burger.onclick = toggleMenu;
    if(overlay) overlay.onclick = toggleMenu;

    links.forEach(function(link) {
        link.onclick = function() {
            toggleMenu();
            // Scroll fluide vers la section
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            return false;
        };
    });
}

/* ── LOGIQUE DE DONNÉES ── */
function getCfg(){try{return JSON.parse(localStorage.getItem(LS_CFG)||'{}')}catch(e){return {}}}

function getData(){
    try {
        var r = localStorage.getItem(LS_KEY);
        return r ? JSON.parse(r) : DEF;
    } catch(e) { return DEF; }
}

function updateSyncStatus(isLive) {
    var status = document.getElementById('syncStatus');
    if(!status) return;
    status.innerHTML = isLive ? '● LIVE (Cloud)' : '● LOCAL';
    status.style.color = isLive ? 'var(--cyan)' : 'var(--dim)';
}

function fetchFromCloud(cb){
    var cfg = getCfg();
    fetch(JSONBIN_URL + cfg.binId + '/latest', {
        headers: { 'X-Master-Key': cfg.apiKey, 'X-Bin-Meta': 'false' }
    })
    .then(r => r.json())
    .then(data => {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        cb(data);
    })
    .catch(() => cb(getData()));
}

/* ── RENDU GÉNÉRAL ── */
function renderAll(d) {
    if(!d) return;
    
    // Header & Bio
    setText('hero-name', d.profile.firstname + ' ' + d.profile.name);
    setText('hero-title', d.profile.title);
    
    // Photo de profil
    var img = document.getElementById('profile-img');
    if(img && d.profile.photo) img.src = d.profile.photo;

    // Compétences
    var compGrid = document.getElementById('competences-grid');
    if(compGrid && d.competences) {
        compGrid.innerHTML = d.competences.map(cat => `
            <div class="comp-card reveal">
                <div class="comp-header"><i class="${cat.icon}"></i> <h3>${cat.category}</h3></div>
                ${cat.skills.map(s => `
                    <div class="skill-item">
                        <span>${s.name}</span>
                        <div class="skill-bar"><div class="skill-progress" style="width:${s.level}%"></div></div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // Projets
    var projGrid = document.getElementById('projects-grid');
    if(projGrid && d.projects) {
        projGrid.innerHTML = d.projects.map(p => `
            <div class="project-card reveal">
                <div class="proj-img"><img src="${p.image || ''}" alt=""></div>
                <div class="proj-content">
                    <h3>${p.title}</h3>
                    <p>${p.desc.substring(0,100)}...</p>
                    <a href="${p.link}" target="_blank" class="proj-link">Consulter</a>
                </div>
            </div>
        `).join('');
    }

    // Ré-initialiser les animations de scroll
    initReveal();
}

function setText(id, txt) {
    var el = document.getElementById(id);
    if(el) el.textContent = txt;
}

function initReveal() {
    var observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function refreshPortfolio() {
    // Vérifie si les données changent dans un autre onglet
    window.addEventListener('storage', function(e) {
        if(e.key === LS_KEY) renderAll(getData());
    });
}
