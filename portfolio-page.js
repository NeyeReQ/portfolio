(async function(){
  const type = document.body.dataset.portfolioType;
  const lang = function(){ return window.NeyeR ? window.NeyeR.lang : 'pl'; };
  const $ = function(selector, parent){ return (parent || document).querySelector(selector); };
  const filters = $('#categoryFilters');
  const grid = $('#projectGrid');
  const count = $('#projectCount');
  const searchInput = $('#portfolioSearch');
  const searchClear = $('#portfolioSearchClear');
  const searchLabel = $('#portfolioSearchLabel');
  const searchHint = $('#portfolioSearchHint');
  let data = { categories: { graphics: [], video: [] }, projects: [] };
  // Empty selection means that all categories are visible.
  let activeCategories = new Set();
  let searchQuery = '';

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
  const categoryIdsFor = function(project){
    return Array.isArray(project.categories) && project.categories.length
      ? project.categories
      : (project.category ? [project.category] : []);
  };
  const normalizeSearch = function(value){
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\\u0300-\\u036f]/g, '')
      .replace(/ł/g, 'l')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  };
  const searchableTextFor = function(project, categoryMap){
    const parts = [];
    const collect = function(value, key){
      if (value == null || key === 'id' || key === 'publishedAt') return;
      if (Array.isArray(value)) {
        value.forEach(function(item){ collect(item, key); });
      } else if (typeof value === 'object') {
        Object.keys(value).forEach(function(childKey){
          collect(value[childKey], childKey);
        });
      } else {
        parts.push(String(value));
      }
    };
    collect(project, '');
    categoryIdsFor(project).forEach(function(categoryId){
      const category = categoryMap[categoryId];
      parts.push(categoryId);
      if (category) {
        collect(category.title, 'title');
        collect(category.description, 'description');
      }
    });
    return normalizeSearch(parts.join(' '));
  };
  function updateSearchLanguage(){
    if (!searchInput) return;
    const english = lang() === 'en';
    if (searchLabel) searchLabel.textContent = english ? 'SEARCH PROJECTS' : 'SZUKAJ REALIZACJI';
    if (searchHint) searchHint.textContent = english
      ? 'Search titles, descriptions and assigned categories'
      : 'Przeszukuje tytuły, opisy i przypisane kategorie.';
    searchInput.placeholder = english
      ? 'Search for a topic, project or keyword...'
      : 'Wyszukaj temat, projekt lub słowo kluczowe...';
    searchInput.setAttribute('aria-label', english ? 'Search projects by topic' : 'Szukaj realizacji według tematu');
    if (searchClear) {
      searchClear.setAttribute('aria-label', english ? 'Clear search' : 'Wyczyść wyszukiwanie');
      searchClear.title = english ? 'Clear search' : 'Wyczyść wyszukiwanie';
    }
  }

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
      const selected = item.id === 'all'
        ? activeCategories.size === 0
        : activeCategories.has(item.id);
      button.className = 'gallery-filter' + (selected ? ' active' : '');
      button.textContent = item.title;
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', function(){
        if (item.id === 'all') {
          activeCategories.clear();
        } else {
          if (activeCategories.has(item.id)) activeCategories.delete(item.id);
          else activeCategories.add(item.id);
        }
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
    const searchTokens = normalizeSearch(searchQuery).split(' ').filter(Boolean);
    const items = data.projects.filter(function(project){
      if (project.type !== type) return false;
      const matchesCategory = activeCategories.size === 0 ||
        Array.from(activeCategories).some(function(categoryId){
          return categoryIdsFor(project).includes(categoryId);
        });
      if (!matchesCategory) return false;
      if (!searchTokens.length) return true;
      const searchable = searchableTextFor(project, categoryMap);
      return searchTokens.every(function(token){ return searchable.includes(token); });
    });

    count.textContent = String(items.length).padStart(2, '0') + ' / ' + String(categories.length).padStart(2, '0');

    if (!items.length) {
      const selectedIds = Array.from(activeCategories);
      const hasSearch = Boolean(normalizeSearch(searchQuery));
      const emptyHeading = hasSearch
        ? (lang() === 'en' ? 'No matching projects found' : 'Brak wyników wyszukiwania')
        : (selectedIds.length === 1
          ? text(categoryMap[selectedIds[0]] && categoryMap[selectedIds[0]].title)
          : (selectedIds.length > 1
            ? (lang() === 'en' ? 'Selected categories' : 'Wybrane kategorie')
            : (tr.emptyTitle || 'Ta galeria czeka na Twoje realizacje')));
      const emptyCopy = hasSearch
        ? (lang() === 'en'
          ? 'No projects match “' + searchQuery.trim() + '”. Try another phrase or change the category filters.'
          : 'Nie znaleziono prac pasujących do „' + searchQuery.trim() + '”. Spróbuj innej frazy lub zmień filtry kategorii.')
        : (tr.emptyText || 'W tej kategorii nie ma jeszcze opublikowanych prac.');
      grid.innerHTML = '<div class="project-empty reveal"><span class="empty-mark">✳</span><h2>' +
        esc(emptyHeading) +
        '</h2><p>' + esc(emptyCopy) + '</p></div>';
      if (window.NeyeR) {
        window.NeyeR.refreshTypewriterTargets(grid);
        window.NeyeR.observeRevealTargets(grid);
      }
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
      const projectCategoryNames = categoryIdsFor(project)
        .map(function(categoryId){ return text(categoryMap[categoryId] && categoryMap[categoryId].title); })
        .filter(Boolean);
      meta.textContent = projectCategoryNames.join(' / ') +
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

  if (searchInput) {
    searchInput.addEventListener('input', function(){
      searchQuery = searchInput.value;
      if (searchClear) searchClear.hidden = !searchQuery;
      renderProjects();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', function(){
      searchInput.value = '';
      searchQuery = '';
      searchClear.hidden = true;
      searchInput.focus();
      renderProjects();
    });
  }

  document.addEventListener('contextmenu', function(event){
    if (event.target.closest('.project-card-media img')) event.preventDefault();
  });
  document.addEventListener('dragstart', function(event){
    if (event.target.closest('.project-card-media img')) event.preventDefault();
  });

  updateSearchLanguage();
  renderFilters();
  renderProjects();
  document.addEventListener('neyer:language', function(){
    updateSearchLanguage();
    renderFilters();
    renderProjects();
  });
})();