/* FN_SEC Portfolio — script.js v5.0 — JSONBin Backend */

var JSONBIN_URL = 'https://api.jsonbin.io/v3/b/';
var LS_KEY = 'fn_portfolio_data';
var LS_CFG = 'fn_cloud_cfg';

/* ── DEFAULTS ── */
var DEF = {
  password:"Admin@2025", n8n_webhook:"",
  profile:{photo:null,name:"DJOUMESSI TATSIFANG",firstname:"Fredy Nelson",title:"FUTUR Ingénieur Cybersécurité",location:"France",accroche:"Passionné par la cybersécurité et la protection des systèmes d'information. Orienté Cloud et No-Code."},
  apropos:{paragraphes:["Bonjour, je suis <strong>Fredy Nelson DJOUMESSI TATSIFANG</strong>, étudiant en ingénierie à l'ESAIP, spécialisé en cybersécurité.","Mon objectif est de contribuer à la sécurisation des infrastructures numériques à travers des approches rigoureuses.","Passionné par l'automatisation No-Code avec n8n, Make et les architectures Cloud."],photos:[]},
  infos:{nom:"Fredy Nelson DJOUMESSI",email:"fndjoumessi@gmail.com",tel:"+33 7 58 59 62 75",location:"France",formation:"ESAIP école d'ingénieur saint barthélemy anjou",specialite:"Cybersécurité"},
  competences:[
    {id:"s1",category:"Sécurité Offensive",icon:"fas fa-crosshairs",skills:[{name:"Pentesting",level:85},{name:"Kali Linux / Metasploit",level:80},{name:"CTF / Exploitation",level:75}]},
    {id:"s2",category:"Cloud & DevOps",icon:"fas fa-cloud",skills:[{name:"AWS / Azure",level:70},{name:"Docker",level:65},{name:"CI/CD",level:60}]},
    {id:"s3",category:"No-Code & Automatisation",icon:"fas fa-robot",skills:[{name:"n8n",level:90},{name:"Make (Integromat)",level:85},{name:"Waha / WhatsApp API",level:80}]},
    {id:"s4",category:"Réseau & Système",icon:"fas fa-network-wired",skills:[{name:"TCP/IP / Protocoles",level:85},{name:"Linux / Windows Server",level:80},{name:"Active Directory",level:65}]}
  ],
  certifications:[{name:"TryHackMe",icon:"fas fa-trophy"},{name:"HackTheBox",icon:"fas fa-box"}],
  experiences:{stages:[],academique:[]},
  projects:[],
  interets:[
    {icon:"fas fa-robot",title:"No-Code & Automatisation",desc:"Je crée des systèmes automatisés avec n8n, Make pendant mon temps libre."},
    {icon:"fas fa-futbol",title:"Football",desc:"Passionné de football, je joue régulièrement en équipe."},
    {icon:"fas fa-plane",title:"Voyages",desc:"Explorer de nouveaux pays est une de mes grandes passions."},
    {icon:"fas fa-cloud",title:"Cloud Computing",desc:"Veille constante sur AWS, Azure et les architectures modernes."}
  ]
};

/* ── CONFIG CLOUD ── */
function getCfg(){try{return JSON.parse(localStorage.getItem(LS_CFG)||'{}')}catch(e){return {}}}

/* ── DONNÉES ── */
function getData(){
  try{
    var r=localStorage.getItem(LS_KEY);
    if(!r) return JSON.parse(JSON.stringify(DEF));
    var s=JSON.parse(r), b=JSON.parse(JSON.stringify(DEF));
    for(var k in s){if(s.hasOwnProperty(k))b[k]=s[k];}
    return b;
  }catch(e){return JSON.parse(JSON.stringify(DEF));}
}

/* ── FETCH DEPUIS JSONBIN ── */
function fetchFromCloud(cb){
  var cfg=getCfg();
  if(!cfg.binId||!cfg.apiKey){if(cb)cb(getData());return;}
  fetch(JSONBIN_URL+cfg.binId+'/latest',{headers:{'X-Master-Key':cfg.apiKey}})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(json){
      if(json&&json.record&&Object.keys(json.record).length>0){
        try{localStorage.setItem(LS_KEY,JSON.stringify(json.record));}catch(e){}
        if(cb)cb(json.record);
      } else {if(cb)cb(getData());}
    })
    .catch(function(){if(cb)cb(getData());});
}

/* ── STATUS INDICATEUR ── */
function setStatus(ok){
  var el=document.getElementById('syncStatus');
  if(!el)return;
  el.textContent=ok?'● LIVE':'● LOCAL';
  el.style.color=ok?'var(--green)':'var(--cyan)';
}

/* ── MATRIX ── */
(function(){
  var c=document.getElementById('matrix-canvas');if(!c)return;
  var ctx=c.getContext('2d');
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  var ch='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*[]{}|',fs=13,drops=[];
  function init(){drops=[];for(var i=0;i<Math.floor(c.width/fs);i++)drops.push(1);}
  init();window.addEventListener('resize',init);
  setInterval(function(){
    ctx.fillStyle='rgba(5,9,8,0.05)';ctx.fillRect(0,0,c.width,c.height);
    ctx.font=fs+'px monospace';
    for(var i=0;i<drops.length;i++){
      ctx.fillStyle='rgba(0,'+(Math.floor(Math.random()*100)+155)+',65,'+(Math.random()*0.4+0.1)+')';
      ctx.fillText(ch[Math.floor(Math.random()*ch.length)],i*fs,drops[i]*fs);
      if(drops[i]*fs>c.height&&Math.random()>0.975)drops[i]=0;
      drops[i]++;
    }
  },40);
})();

/* ── TYPING ── */
(function(){
  var el=document.getElementById('typingText');if(!el)return;
  var ph=['FUTUR Ingénieur Cybersécurité','Expert No-Code & n8n','Cloud Security Enthusiast','CTF Player & Pentester'];
  var pi=0,ci=0,del=false;
  function tick(){
    var cur=ph[pi];
    if(!del){el.textContent=cur.slice(0,ci+1);ci++;if(ci===cur.length){del=true;setTimeout(tick,2000);return;}}
    else{el.textContent=cur.slice(0,ci-1);ci--;if(ci===0){del=false;pi=(pi+1)%ph.length;}}
    setTimeout(tick,del?55:100);
  }
  tick();
})();

/* ── NAVBAR ── */
window.addEventListener('scroll',function(){
  var n=document.getElementById('navbar');if(n)n.classList.toggle('scrolled',window.scrollY>50);
});

/* ── SIDEBAR ── */
(function(){
  var b=document.getElementById('burgerBtn'),s=document.getElementById('sidebar'),o=document.getElementById('sidebarOverlay'),x=document.getElementById('sidebarClose');
  if(!b||!s)return;
  function open(){s.classList.add('open');o&&o.classList.add('open');b.classList.add('open');document.body.style.overflow='hidden';}
  function close(){s.classList.remove('open');o&&o.classList.remove('open');b.classList.remove('open');document.body.style.overflow='';}
  b.addEventListener('click',open);
  x&&x.addEventListener('click',close);
  o&&o.addEventListener('click',close);
  document.querySelectorAll('.sidebar-link').forEach(function(l){l.addEventListener('click',close);});
  // Active link on scroll
  var links=document.querySelectorAll('.sidebar-link');
  if(links.length&&window.IntersectionObserver){
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting)links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id);});
      });
    },{rootMargin:'-40% 0px -60% 0px'}).observe.call(null);
    document.querySelectorAll('section[id]').forEach(function(sec){
      new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting)links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id);});
        });
      },{rootMargin:'-40% 0px -60% 0px'}).observe(sec);
    });
  }
})();

/* ── EXP TABS ── */
function initTabs(){
  document.querySelectorAll('.exp-tab').forEach(function(t){
    t.onclick=function(){
      document.querySelectorAll('.exp-tab').forEach(function(x){x.classList.remove('active');});
      document.querySelectorAll('.exp-content').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active');
      var c=document.getElementById('tab-'+t.dataset.tab);if(c)c.classList.add('active');
    };
  });
}

/* ── STARS ── */
(function(){
  var stars=document.querySelectorAll('.star'),fb=document.getElementById('starsFeedback'),ni=document.getElementById('noteInput');
  if(!stars.length)return;
  var msgs=['','À améliorer','Peut mieux faire','Bien','Très bien !','Excellent !'];
  stars.forEach(function(s){
    s.addEventListener('mouseover',function(){var v=+s.dataset.val;stars.forEach(function(x){x.classList.toggle('active',+x.dataset.val<=v);});if(fb)fb.textContent=msgs[v];});
    s.addEventListener('click',function(){var v=+s.dataset.val;if(ni)ni.value=v;stars.forEach(function(x){x.classList.toggle('active',+x.dataset.val<=v);});if(fb)fb.textContent='✓ '+v+'/5';});
  });
  var row=document.getElementById('starsRow');
  if(row)row.addEventListener('mouseleave',function(){if(!ni||!ni.value||ni.value==='0'){stars.forEach(function(s){s.classList.remove('active');});if(fb)fb.textContent='';}});
})();

/* ── AVIS ── */
(function(){
  var form=document.getElementById('avisForm');if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var d=getData();if(!d.n8n_webhook){var err=document.getElementById('formError');if(err)err.style.display='flex';return;}
    var ni=document.getElementById('noteInput');
    fetch(d.n8n_webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nom:form.nom.value,email:form.email?form.email.value:'',message:form.message.value,note:ni?ni.value:'0',date:new Date().toLocaleString('fr-FR')}),mode:'no-cors'})
      .then(function(){form.style.display='none';var ok=document.getElementById('formSuccess');if(ok)ok.style.display='flex';})
      .catch(function(){var err=document.getElementById('formError');if(err)err.style.display='flex';});
  });
})();

/* ── BACK TO TOP ── */
(function(){
  var btn=document.getElementById('backToTop');if(!btn)return;
  window.addEventListener('scroll',function(){btn.classList.toggle('visible',window.scrollY>400);});
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();

/* ── MODAL PROJET ── */
var curSteps=[],curIdx=0;
window.openProjectModal=function(id){
  var d=getData(),proj=null;
  for(var i=0;i<d.projects.length;i++){if(d.projects[i].id===id){proj=d.projects[i];break;}}
  if(!proj)return;
  function g(x){return document.getElementById(x);}
  if(g('projModalId'))g('projModalId').textContent='// '+proj.name.toUpperCase();
  if(g('projModalTitle'))g('projModalTitle').textContent=proj.name;
  if(g('projModalStatus'))g('projModalStatus').textContent=proj.status||'COMPLETED';
  if(g('projModalDesc'))g('projModalDesc').textContent=proj.description;
  if(g('projModalTags'))g('projModalTags').innerHTML=(proj.tags||[]).map(function(t){return'<span class="proj-tag">'+t+'</span>';}).join('');
  var cv=g('projModalCover');
  if(cv)cv.innerHTML=proj.cover?'<img src="'+proj.cover+'" style="width:100%;height:100%;object-fit:cover"/>'
    :'<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:var(--green3)"><i class="'+(proj.icon||'fas fa-code')+'"></i></div>';
  var lk=g('projModalLinks');
  if(lk){var h='';if(proj.github)h+='<a href="'+proj.github+'" target="_blank" class="proj-link"><i class="fab fa-github"></i> Code</a>';if(proj.demo)h+='<a href="'+proj.demo+'" target="_blank" class="proj-link proj-link-cyan"><i class="fas fa-external-link-alt"></i> Demo</a>';lk.innerHTML=h;}
  curSteps=proj.steps||[];curIdx=0;
  var ss=g('stepsSection');if(ss)ss.style.display=curSteps.length?'block':'none';
  if(curSteps.length)renderStep();
  var ov=g('projModalOverlay');if(ov)ov.classList.add('open');
  document.body.style.overflow='hidden';
};
function renderStep(){
  if(!curSteps.length)return;
  var s=curSteps[curIdx];
  var ctr=document.getElementById('stepCounter');if(ctr)ctr.textContent=(curIdx+1)+' / '+curSteps.length;
  var d=document.getElementById('stepDisplay');
  if(d)d.innerHTML=(s.image?'<div class="step-image-wrap"><img src="'+s.image+'" class="step-image"/></div>':'')+'<div class="step-content">'+(s.title?'<div class="step-title"><i class="fas fa-chevron-right"></i> '+s.title+'</div>':'')+'<div class="step-caption">'+(s.caption||'')+'</div></div>';
  var dots=document.getElementById('stepsDots');
  if(dots)dots.innerHTML=curSteps.map(function(_,i){return'<div class="step-dot'+(i===curIdx?' active':'')+'" onclick="goToStep('+i+')"></div>';}).join('');
  var pv=document.getElementById('stepPrev'),nx=document.getElementById('stepNext');
  if(pv)pv.disabled=curIdx===0;if(nx)nx.disabled=curIdx===curSteps.length-1;
}
window.goToStep=function(i){curIdx=i;renderStep();};
function closeModal(){var o=document.getElementById('projModalOverlay');if(o)o.classList.remove('open');document.body.style.overflow='';}
(function(){
  var pv=document.getElementById('stepPrev'),nx=document.getElementById('stepNext');
  var cb=document.getElementById('projModalClose'),ov=document.getElementById('projModalOverlay');
  if(pv)pv.addEventListener('click',function(){if(curIdx>0){curIdx--;renderStep();}});
  if(nx)nx.addEventListener('click',function(){if(curIdx<curSteps.length-1){curIdx++;renderStep();}});
  if(cb)cb.addEventListener('click',closeModal);
  if(ov)ov.addEventListener('click',function(e){if(e.target===ov)closeModal();});
  document.addEventListener('keydown',function(e){
    var o=document.getElementById('projModalOverlay');if(!o||!o.classList.contains('open'))return;
    if(e.key==='Escape')closeModal();
    if(e.key==='ArrowLeft'&&curIdx>0){curIdx--;renderStep();}
    if(e.key==='ArrowRight'&&curIdx<curSteps.length-1){curIdx++;renderStep();}
  });
})();

/* ── RENDERS ── */
function renderHero(d){
  var p=d.profile||{};
  function set(id,v){var el=document.getElementById(id);if(el)el.textContent=v||'';}
  set('hero-name',p.name);set('hero-firstname',p.firstname);
  set('photo-name',p.name);set('photo-role',p.title);set('photo-loc',p.location);
  var ne=document.getElementById('hero-name');if(ne)ne.setAttribute('data-text',p.name||'');
  var pc=document.getElementById('hero-photo-container');
  if(pc&&p.photo)pc.innerHTML='<img src="'+p.photo+'" alt="Photo" class="hero-photo"/><div class="photo-border-anim"></div>';
  var sp=document.getElementById('stat-projets');if(sp)sp.textContent=(d.projects||[]).length;
  var sc=document.getElementById('stat-certifs');if(sc)sc.textContent=(d.certifications||[]).length;
  var vc=document.getElementById('visitorCount');
  if(vc){try{var cnt=parseInt(localStorage.getItem('fn_visits')||'0');if(!sessionStorage.getItem('fn_v')){cnt++;localStorage.setItem('fn_visits',cnt);sessionStorage.setItem('fn_v','1');}vc.textContent=cnt;}catch(e){vc.textContent='—';}}
}

function renderApropos(d){
  var ap=d.apropos||{},inf=d.infos||{};
  var tc=document.getElementById('apropos-text-container');
  if(tc)tc.innerHTML=(ap.paragraphes||[]).map(function(p){return'<p class="apropos-p">'+p+'</p>';}).join('');
  var pc=document.getElementById('apropos-photos-container');
  if(pc&&ap.photos&&ap.photos.length)pc.innerHTML=ap.photos.map(function(ph){return'<div class="apropos-photo-item"><img src="'+ph.src+'" class="apropos-photo"/><div class="apropos-photo-caption">'+(ph.caption||'')+'</div></div>';}).join('');
  var ig=document.getElementById('info-grid-container');
  if(ig)ig.innerHTML=
    '<div class="info-item"><i class="fas fa-user"></i><div><div class="info-label">NOM</div><div class="info-val">'+(inf.nom||'—')+'</div></div></div>'+
    '<div class="info-item"><i class="fas fa-envelope"></i><div><div class="info-label">EMAIL</div><div class="info-val">'+(inf.email||'—')+'</div></div></div>'+
    '<div class="info-item"><i class="fas fa-phone"></i><div><div class="info-label">TÉL.</div><div class="info-val">'+(inf.tel||'—')+'</div></div></div>'+
    '<div class="info-item"><i class="fas fa-map-marker-alt"></i><div><div class="info-label">LOCALISATION</div><div class="info-val">'+(inf.location||'—')+'</div></div></div>'+
    '<div class="info-item"><i class="fas fa-graduation-cap"></i><div><div class="info-label">FORMATION</div><div class="info-val">'+(inf.formation||'—')+'</div></div></div>'+
    '<div class="info-item"><i class="fas fa-shield-alt"></i><div><div class="info-label">SPÉCIALITÉ</div><div class="info-val">'+(inf.specialite||'—')+'</div></div></div>';
}

function renderCompetences(d){
  var c=document.getElementById('skills-container');
  if(c)c.innerHTML=(d.competences||[]).map(function(cat){
    return'<div class="skill-category"><div class="skill-cat-title"><i class="'+cat.icon+'"></i> '+cat.category+'</div><div class="skill-list">'+
      (cat.skills||[]).map(function(s){return'<div class="skill-item"><div class="skill-info"><span>'+s.name+'</span><span class="skill-pct">'+s.level+'%</span></div><div class="skill-bar"><div class="skill-fill" style="--w:'+s.level+'%"></div></div></div>';}).join('')+
      '</div></div>';
  }).join('');
  var cg=document.getElementById('certifs-grid');
  if(cg)cg.innerHTML=(d.certifications||[]).map(function(c){return'<div class="certif-badge"><i class="'+(c.icon||'fas fa-certificate')+'"></i> '+c.name+'</div>';}).join('');
}

function renderExperiences(d){
  var exp=d.experiences||{stages:[],academique:[]};
  function tl(e,badge,bc){
    return'<div class="tl-item"><div class="tl-date">'+(e.date||'')+'</div><div class="tl-card"><div class="tl-card-top"><div class="tl-title">'+(e.title||'')+'</div><div class="tl-badge '+(bc||'')+'">'+badge+'</div></div>'+
      '<div class="tl-company"><i class="fas fa-building"></i> '+(e.company||e.institution||'')+' · '+(e.location||'')+'</div>'+
      '<div class="tl-desc">'+(e.description||'')+'</div>'+
      (e.tags&&e.tags.length?'<div class="tl-tags">'+e.tags.map(function(t){return'<span class="tl-tag">'+t+'</span>';}).join('')+'</div>':'')+
      '</div></div>';
  }
  var no='<div class="no-content-msg"><i class="fas fa-folder-open"></i><p>Aucun élément. Ajoute depuis l\'interface admin.</p></div>';
  var st=document.getElementById('stages-timeline');
  if(st)st.innerHTML=(exp.stages&&exp.stages.length)?exp.stages.map(function(e){return tl(e,'STAGE','');}).join(''):no;
  var at=document.getElementById('academique-timeline');
  if(at)at.innerHTML=(exp.academique&&exp.academique.length)?exp.academique.map(function(e){return tl(e,'DIPLÔME','tl-badge-cyan');}).join(''):no;
  initTabs();
}

function renderProjects(d){
  var g=document.getElementById('projects-grid');if(!g)return;
  var colors=['','proj-card-red','proj-card-cyan','proj-card-purple'];
  if(!d.projects||!d.projects.length){g.innerHTML='<div class="no-content-msg"><i class="fas fa-folder-open"></i><p>Aucun projet. Connecte-toi à l\'interface admin pour en ajouter.</p></div>';return;}
  g.innerHTML=d.projects.map(function(proj,i){
    return'<div class="proj-card '+(colors[i%colors.length]||'')+'" onclick="openProjectModal(\''+proj.id+'\')">'+(proj.cover?'<div class="proj-cover" style="background-image:url(\''+proj.cover+'\')"></div>':'')+
      '<div class="proj-header"><div class="proj-id">// PROJ_'+String(i+1).padStart(3,'0')+'</div><div class="proj-status '+(proj.status==='ACTIVE'?'proj-status-red':'')+'">'+(proj.status||'COMPLETED')+'</div></div>'+
      '<div class="proj-icon"><i class="'+(proj.icon||'fas fa-code')+'"></i></div><h3 class="proj-title">'+proj.name+'</h3><p class="proj-desc">'+proj.description+'</p>'+
      (proj.tags&&proj.tags.length?'<div class="proj-tags">'+proj.tags.map(function(t){return'<span class="proj-tag">'+t+'</span>';}).join('')+'</div>':'')+
      '<div class="proj-cta"><span class="proj-cta-btn"><i class="fas fa-eye"></i> Voir le projet</span></div></div>';
  }).join('');
}

function renderInterets(d){
  var g=document.getElementById('interets-grid');
  if(g)g.innerHTML=(d.interets||[]).map(function(it){return'<div class="interet-card"><div class="interet-icon"><i class="'+it.icon+'"></i></div><div class="interet-title">'+it.title+'</div><div class="interet-desc">'+it.desc+'</div></div>';}).join('');
}

/* ── RENDER ALL ── */
function renderAll(d){
  if(!d)d=getData();
  try{renderHero(d);}catch(e){console.error('Hero:',e);}
  try{renderApropos(d);}catch(e){console.error('Apropos:',e);}
  try{renderCompetences(d);}catch(e){console.error('Comp:',e);}
  try{renderExperiences(d);}catch(e){console.error('Exp:',e);}
  try{renderProjects(d);}catch(e){console.error('Proj:',e);}
  try{renderInterets(d);}catch(e){console.error('Int:',e);}
}

/* ── FOOTER ── */
(function(){var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();})();

/* ── INIT ── */
// 1. Render immédiat depuis localStorage (rapide)
renderAll(getData());
setStatus(false);

// 2. Fetch depuis JSONBin (données fraîches)
fetchFromCloud(function(d){
  renderAll(d);
  var cfg=getCfg();
  setStatus(!!(cfg.binId&&cfg.apiKey));
});

// 3. Auto-refresh depuis JSONBin toutes les 30 secondes
setInterval(function(){
  fetchFromCloud(function(d){renderAll(d);});
},30000);

// 4. Refresh depuis localStorage quand focus (même onglet)
window.addEventListener('focus',function(){renderAll(getData());});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')fetchFromCloud(function(d){renderAll(d);});});
