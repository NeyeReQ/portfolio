(async function(){
  const type = document.body.dataset.portfolioType;
  const lang = function(){ return window.NeyeR ? window.NeyeR.lang : 'pl'; };
  const $ = function(selector, parent){ return (parent || document).querySelector(selector); };
  const filters = $('#categoryFilters');
  const grid = $('#projectGrid');
  const count = $('#projectCount');
  let data = { categories: { graphics: [], video: [] }, projects: [] };
  let active = 'all';

  const text = function(value){
    if (typeof value === 'string') return value;
    return value && (value[lang()] || value.pl || value.en) || '';
  };
  const translations = function(){ return window.NeyeR && window.NeyeR.translations[lang()] || {}; };
  const esc = function(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  };
  const asset = function(source){ return source ? String(source).replace(/^\.\//, '') : ''; };

  try {
    const response = await fetch('portfolio-data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    data = await response.json();
    if (!data.categories || !Array.isArray(data.categories[type])) throw new Error('Nieprawidłowy format danych portfolio.');
    if (!Array.isArray(data.projects)) data.projects = [];
  } catch (error) {
    grid.innerHTML = '<div class="project-empty reveal"><span class="empty-mark">!</span><h2>Nie udało się wczytać portfolio</h2><p>Sprawdź plik portfolio-data.json i uruchom stronę przez GitHub Pages lub serwer lokalny.</p></div>';
    console.error('NeyeR portfolio data:', error);
    return;
  }

  function renderFilters(){
    const tr = translations();
    filters.innerHTML = '';
    const list = [{ id: 'all', title: tr.allCategories || 'Wszystkie' }].concat(
      data.categories[type].map(function(category){
        return { id: category.id, title: text(category.title) };
      })
    );

    list.forEach(function(item){
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-filter' + (active === item.id ? ' active' : '');
      button.textContent = item.title;
      button.setAttribute('aria-pressed', String(active === item.id));
      button.addEventListener('click', function(){
        active = item.id;
        renderFilters();
        renderProjects();
      });
      filters.append(button);
    });
  }

  function mediaMarkup(project){
    const preview = asset(project.image || project.thumbnail);
    if (preview) return '<img src="' + esc(preview) + '" alt="' + esc(text(project.title)) + '" loading="lazy" draggable="false">';
    if (project.video) return '<div class="project-placeholder project-placeholder-video"><span>▶</span><small>VIDEO / PREVIEW</small></div>';
    return '<div class="project-placeholder"><span>N/R</span><small>NEYER VISUAL STUDY</small></div>';
  }

  function renderProjects(){
    const tr = translations();
    const categories = data.categories[type] || [];
    const categoryMap = Object.fromEntries(categories.map(function(category){ return [category.id, category]; }));
    const items = data.projects.filter(function(project){
      return project.type === type && (active === 'all' || project.category === active);
    });

    count.textContent = String(items.length).padStart(2, '0') + ' / ' + String(categories.length).padStart(2, '0');

    if (!items.length) {
      const category = active === 'all' ? null : categoryMap[active];
      grid.innerHTML = '<div class="project-empty reveal"><span class="empty-mark">✳</span><h2>' +
        esc(category ? text(category.title) : tr.emptyTitle || 'Ta galeria czeka na Twoje realizacje') +
        '</h2><p>' + esc(tr.emptyText || 'W tej kategorii nie ma jeszcze opublikowanych prac.') + '</p></div>';
      return;
    }

    grid.innerHTML = '';
    items.forEach(function(project, index){
      const card = document.createElement('a');
      card.className = 'project-card reveal';
      card.href = 'project.html?id=' + encodeURIComponent(project.id);
      card.setAttribute('aria-label', (tr.projectOpen || 'Otwórz projekt') + ': ' + text(project.title));

      const media = document.createElement('div');
      media.className = 'project-card-media';
      media.innerHTML = mediaMarkup(project);
      if (project.video) {
        const play = document.createElement('span');
        play.className = 'project-card-play';
        play.textContent = '▶';
        media.append(play);
      }

      const body = document.createElement('div');
      body.className = 'project-card-body';
      const heading = document.createElement('strong');
      heading.textContent = text(project.title);
      const meta = document.createElement('span');
      meta.textContent = (text(categoryMap[project.category] && categoryMap[project.category].title) || '') +
        (project.year ? ' · ' + project.year : '');
      const action = document.createElement('span');
      action.className = 'project-card-cta';
      action.textContent = (tr.projectOpen || 'Otwórz projekt') + ' ↗';
      body.append(heading, meta, action);
      card.append(media, body);
      card.style.setProperty('--card-order', String(index));
      card.dataset.delay = String(Math.min(index * 85, 425));
      grid.append(card);
    });
    if (window.NeyeR) {
      window.NeyeR.refreshTypewriterTargets(grid);
      window.NeyeR.observeRevealTargets(grid);
    }
  }

  document.addEventListener('contextmenu', function(event){
    if (event.target.closest('.project-card-media img')) event.preventDefault();
  });
  document.addEventListener('dragstart', function(event){
    if (event.target.closest('.project-card-media img')) event.preventDefault();
  });

  renderFilters();
  renderProjects();
  document.addEventListener('neyer:language', function(){
    renderFilters();
    renderProjects();
  });
})();