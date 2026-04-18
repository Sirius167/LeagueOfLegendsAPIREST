
const API_VERSION  = '16.8.1';
const API_BASE     = `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}`;
const IMG_BASE     = `${API_BASE}/img/champion`;
const CHAMPIONS_URL = `${API_BASE}/data/es_ES/champion.json`;


const STAT_MAX = {
  hp: 1200, attackdamage: 100, armor: 60, spellblock: 55,
  movespeed: 360, attackspeed: 1.1
};


let allChampions  = [];   
let filtered      = [];   
let activeTag     = 'all';
let searchQuery   = '';
let sortKey       = 'name-asc';


const grid         = document.getElementById('championGrid');
const searchInput  = document.getElementById('searchInput');
const clearBtn     = document.getElementById('clearSearch');
const tagFilters   = document.getElementById('tagFilters');
const sortSelect   = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');


const overlay      = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');


async function fetchChampions() {
  try {
    grid.innerHTML = buildSkeletons(16);

    const response = await fetch(CHAMPIONS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    allChampions = Object.values(json.data);

    applyFiltersAndRender();
  } catch (err) {
    console.error('Error al consultar la API de Riot:', err);
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>No se pudo conectar con la API de Riot Games.</p>
        <p style="font-size:0.78rem;margin-top:8px;opacity:0.6">
          Verifica tu conexión a internet e intenta recargar la página.
        </p>
      </div>`;
    resultsCount.textContent = 'Error al cargar campeones';
  }
}

function buildSkeletons(n) {
  return Array.from({ length: n }, () => `
    <div class="champion-card" style="pointer-events:none">
      <div class="card-img-wrap" style="background:linear-gradient(135deg,#0D1A2E,#091426)">
        <div style="width:100%;height:100%;background:linear-gradient(90deg,#111C2E 25%,#1C3050 50%,#111C2E 75%);
             background-size:200% 100%;animation:shimmer 1.5s infinite;"></div>
      </div>
      <div class="card-body">
        <div style="height:14px;background:#1C3050;border-radius:3px;margin-bottom:8px;"></div>
        <div style="height:10px;background:#111C2E;border-radius:3px;width:70%;"></div>
      </div>
    </div>`).join('') + `
  <style>
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>`;
}

function applyFiltersAndRender() {
  filtered = activeTag === 'all'
    ? [...allChampions]
    : allChampions.filter(c => c.tags && c.tags.includes(activeTag));

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => {
    switch (sortKey) {
      case 'name-asc':    return a.name.localeCompare(b.name);
      case 'name-desc':   return b.name.localeCompare(a.name);
      case 'hp-desc':     return (b.stats?.hp || 0) - (a.stats?.hp || 0);
      case 'attack-desc': return (b.info?.attack || 0) - (a.info?.attack || 0);
      default:            return 0;
    }
  });

  renderGrid(filtered);
  resultsCount.textContent = `${filtered.length} campeón${filtered.length !== 1 ? 'es' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
}

function renderGrid(champions) {
  if (champions.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Sin resultados para tu búsqueda.</p>
      </div>`;
    return;
  }

  grid.innerHTML = champions.map((champ, idx) => buildCard(champ, idx)).join('');

  grid.querySelectorAll('.champion-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

function buildCard(champ, idx) {
  const imgUrl    = `${IMG_BASE}/${champ.id}.png`;
  const firstTag  = champ.tags?.[0] || '';
  const atkPct    = Math.round(((champ.info?.attack   || 0) / 10) * 100);
  const defPct    = Math.round(((champ.info?.defense  || 0) / 10) * 100);
  const magPct    = Math.round(((champ.info?.magic    || 0) / 10) * 100);
  const delay     = (idx % 12) * 0.04;

  return `
  <div class="champion-card"
       data-id="${champ.id}"
       style="animation-delay:${delay}s">
    <div class="card-img-wrap">
      <img
        src="${imgUrl}"
        alt="${champ.name}"
        loading="lazy"
        onerror="this.src='https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/profileicon/29.png'"
      />
      <span class="card-tag-pill tag-${firstTag}">${firstTag || '?'}</span>
    </div>
    <div class="card-body">
      <div class="card-name" title="${champ.name}">${champ.name}</div>
      <div class="card-title" title="${champ.title}">${champ.title}</div>
      <div class="card-mini-stats">
        <div class="mini-stat-row">
          <span class="mini-stat-label">ATK</span>
          <div class="mini-track"><div class="mini-fill atk" style="width:${atkPct}%"></div></div>
        </div>
        <div class="mini-stat-row">
          <span class="mini-stat-label">DEF</span>
          <div class="mini-track"><div class="mini-fill def" style="width:${defPct}%"></div></div>
        </div>
        <div class="mini-stat-row">
          <span class="mini-stat-label">MAG</span>
          <div class="mini-track"><div class="mini-fill mag" style="width:${magPct}%"></div></div>
        </div>
      </div>
    </div>
    <div class="card-cta">VER DETALLES ▸</div>
  </div>`;
}

function openModal(champId) {
  const champ = allChampions.find(c => c.id === champId);
  if (!champ) return;

  const s = champ.stats || {};
  const info = champ.info || {};

  document.getElementById('modalImg').src = `${IMG_BASE}/${champ.id}.png`;
  document.getElementById('modalImg').onerror = function () {
    this.src = `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}/img/profileicon/29.png`;
  };
  document.getElementById('modalName').textContent    = champ.name;
  document.getElementById('modalTitle').textContent   = champ.title;
  document.getElementById('modalResource').textContent = `Recurso: ${champ.partype || 'N/A'}`;

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = (champ.tags || []).map(t =>
    `<span class="modal-tag-chip tag-${t}">${t}</span>`
  ).join('');

  document.getElementById('modalBlurb').textContent = champ.blurb || '';

  document.getElementById('mHP').textContent    = s.hp    ?? '—';
  document.getElementById('mAD').textContent    = s.attackdamage ?? '—';
  document.getElementById('mArmor').textContent = s.armor ?? '—';
  document.getElementById('mMR').textContent    = s.spellblock ?? '—';
  document.getElementById('mMS').textContent    = s.movespeed  ?? '—';
  document.getElementById('mAS').textContent    = s.attackspeed?.toFixed(3) ?? '—';


  ['barHP','barAD','barArmor','barMR','barMS','barAS',
   'rAttack','rDefense','rMagic','rDifficulty'].forEach(id => {
    document.getElementById(id).style.width = '0%';
  });


  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    setTimeout(() => {
      setBar('barHP',    s.hp,           STAT_MAX.hp);
      setBar('barAD',    s.attackdamage, STAT_MAX.attackdamage);
      setBar('barArmor', s.armor,        STAT_MAX.armor);
      setBar('barMR',    s.spellblock,   STAT_MAX.spellblock);
      setBar('barMS',    s.movespeed,    STAT_MAX.movespeed);
      setBar('barAS',    s.attackspeed,  STAT_MAX.attackspeed);

      setBar('rAttack',     info.attack,     10);
      setBar('rDefense',    info.defense,    10);
      setBar('rMagic',      info.magic,      10);
      setBar('rDifficulty', info.difficulty, 10);
    }, 100);
  });
}

function setBar(id, value, max) {
  const el = document.getElementById(id);
  if (!el || value == null) return;
  el.style.width = `${Math.min(100, Math.round((value / max) * 100))}%`;
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}



searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  clearBtn.classList.toggle('visible', searchQuery.length > 0);
  applyFiltersAndRender();
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearBtn.classList.remove('visible');
  applyFiltersAndRender();
  searchInput.focus();
});

tagFilters.addEventListener('click', e => {
  const btn = e.target.closest('.tag-btn');
  if (!btn) return;
  tagFilters.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeTag = btn.dataset.tag;
  applyFiltersAndRender();
});

sortSelect.addEventListener('change', () => {
  sortKey = sortSelect.value;
  applyFiltersAndRender();
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

fetchChampions();