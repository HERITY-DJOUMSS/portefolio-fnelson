/* FN_SEC Portfolio — script.js v7.0 — FULL ROBUST & SECURE */

var BIN_ID = "TON_BIN_ID_ICI"; // TON BIN ID ICI (Public)
var JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + BIN_ID + '/latest';
var LS_KEY = 'fn_portfolio_data';

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    
    // 1. Chargement immédiat (Cache Local) pour éviter le blanc
    var cached = localStorage.getItem(LS_KEY);
    if(cached) renderAll(JSON.parse(cached));

    // 2. Synchro Cloud (Sans clé car le Bin est mis en Public)
    fetch(JSONBIN_URL, { headers: { 'X-Bin-Meta': 'false' } })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        renderAll(data);
        updateStatus(true);
    })
    .catch(() => updateStatus(false));
});

/* ── RENDU DE TOUTES LES SECTIONS ── */
function renderAll(d) {
    if(!d) return;

    // Profil & Hero
    if(d.profile) {
        setT('hero-name', d.profile.firstname + " " + d.profile.name);
        setT('hero-title', d.profile.title);
        var img = document.getElementById('profile-img');
        if(img && d.profile.photo) img.src = d.profile.photo;
    }

    // Bug 2 Fix : Rendu de la Vie Académique (Stages & Études)
    renderExperience(d.experiences);

    // Compétences
    var cGrid = document.getElementById('competences-grid');
    if(cGrid && d.competences) {
        cGrid.innerHTML = d.competences.map(cat => `
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
    var pGrid = document.getElementById('projects-grid');
    if(pGrid && d.projects) {
        pGrid.innerHTML = d.projects.map(p => `
            <div class="project-card reveal">
                <div class="proj-img"><img src="${p.image || ''}"></div>
                <div class="proj-content">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <a href="${p.link}" target="_blank" class="proj-link">Détails</a>
                </div>
            </div>
        `).join('');
    }

    // Bug 3 Fix : On relance l'observateur APRES le rendu du HTML
    setTimeout(initReveal, 100);
}

/* ── FOCUS : VIE ACADÉMIQUE (Bug 2) ── */
function renderExperience(exp) {
    var cont = document.getElementById('exp-content');
    if(!cont || !exp) return;

    // On génère le HTML des deux onglets
    var html = `
        <div class="exp-tabs">
            <button class="exp-tab active" onclick="switchTab('stages')">Stages & Pro</button>
            <button class="exp-tab" onclick="switchTab('etudes')">Parcours Académique</button>
        </div>
        <div id="tab-stages" class="tab-pane active">
            ${(exp.stages || []).map(s => `<div class="exp-item"><h4>${s.role}</h4><p>${s.company}</p><span>${s.date}</span></div>`).join('')}
        </div>
        <div id="tab-etudes" class="tab-pane">
            ${(exp.academique || []).map(e => `<div class="exp-item"><h4>${e.diploma}</h4><p>${e.school}</p><span>${e.date}</span></div>`).join('')}
        </div>
    `;
    cont.innerHTML = html;
}

// Fonction de switch globale (attachée à window pour être accessible)
window.switchTab = function(type) {
    document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById('tab-' + type).classList.add('active');
};

/* ── RÉSOLUTIONS DES BUGS RESTANTS ── */

function initReveal() {
    var observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si l'élément est visible ou si la section est vide mais doit apparaître
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05 });
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
        // Sécurité Bug 3 : Si l'élément est déjà dans le viewport au chargement
        if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
}

function initMenu() {
    var b = document.getElementById('burgerBtn'), s = document.getElementById('sidebar'), o = document.getElementById('sidebarOverlay');
    if(!b) return;
    var toggle = () => { [b,s,o].forEach(el => el && el.classList.toggle('active')); };
    b.onclick = toggle;
    if(o) o.onclick = toggle;
    document.querySelectorAll('.side-nav a').forEach(a => a.onclick = toggle);
}

function setT(id, txt) { 
    var e = document.getElementById(id); 
    if(e) e.textContent = txt; 
}

function updateStatus(live) {
    var s = document.getElementById('syncStatus');
    if(s) {
        s.innerHTML = live ? '● LIVE' : '● LOCAL';
        s.style.color = live ? 'var(--cyan)' : 'var(--red)';
    }
}
