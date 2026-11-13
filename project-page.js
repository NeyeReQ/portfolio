(async function(){
  const $ = function(selector, parent){ return (parent || document).querySelector(selector); };
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let data = { categories: { graphics: [], video: [] }, projects: [] };
  let project = null;
  let category = null;

  const lang = function(){ return window.NeyeR ? window.NeyeR.lang : (document.documentElement.lang || 'pl'); };
  const copy = {
    pl: {
      back: 'Wróć do galerii', headerBack: 'Wróć do portfolio', eyebrow: 'WYBRANA REALIZACJA',
      asideLabel: 'WYBRANA REALIZACJA', asideCopy: 'Każdy projekt ma własną historię. To jej przestrzeń.',
      scroll: 'PRZEWIŃ, ABY ODKRYĆ WIĘCEJ', visualNote: 'WYBRANY PROJEKT / PEŁNA PREZENTACJA',
      overviewKicker: 'PROJECT OVERVIEW', overviewTitle: 'O projekcie', overviewAside: '',
      storyLabel: 'THE IDEA / ZAŁOŻENIE', storyTitle: 'Każdy detal ma znaczenie.', facts: 'INFORMACJE O PROJEKCIE',
      relatedKicker: 'KEEP EXPLORING', relatedTitle: 'Podobne projekty', relatedIntro: 'Kontynuuj przeglądanie wybranych realizacji.',
      relatedEmptyTitle: 'To na razie jedyna opublikowana realizacja w tej galerii.',
      relatedEmptyCopy: 'Gdy pojawią się kolejne projekty, automatycznie zobaczysz je właśnie tutaj.',
      relatedLink: 'Zobacz całą galerię', galleryKicker: 'VISUAL DETAILS', galleryTitle: 'Detale',
      galleryDescription: 'Dodatkowe kadry i ujęcia projektu.', category: 'Kategoria', discipline: 'Obszar',
      year: 'Rok', role: 'Rola', tools: 'Narzędzia', client: 'Klient', duration: 'Czas realizacji',
      format: 'Format', footer: 'Dobre projekty zostają w pamięci.', backTop: 'Wróć na górę',
      rights: 'WSZELKIE PRAWA ZASTRZEŻONE.',
      copyright: 'Projekty ukazane na stronie objęte są prawami autorskimi i nie zezwalam na wykorzystywanie ich we wszelkich projektach.',
      notFound: 'Nie znaleziono projektu', notFoundCopy: 'Ten projekt nie istnieje lub nie jest już dostępny w portfolio.',
      visualDesign: 'GRAFIKA / VISUAL DESIGN', motionFilm: 'MONTAŻ / MOTION & FILM',
      viewProject: 'Otwórz projekt', noOther: 'Nie ma jeszcze innych opublikowanych projektów w tej galerii.'
    },
    en: {
      back: 'Back to gallery', headerBack: 'Back to portfolio', eyebrow: 'SELECTED PROJECT',
      asideLabel: 'SELECTED WORK', asideCopy: 'Every project has a story. This is where it unfolds.',
      scroll: 'SCROLL TO DISCOVER MORE', visualNote: 'SELECTED PROJECT / FULL PRESENTATION',
      overviewKicker: 'PROJECT OVERVIEW', overviewTitle: 'About the project', overviewAside: '',
      storyLabel: 'THE IDEA / OVERVIEW', storyTitle: 'Every detail matters.', facts: 'PROJECT INFORMATION',
      relatedKicker: 'KEEP EXPLORING', relatedTitle: 'Similar projects', relatedIntro: 'Explore more selected work.',
      relatedEmptyTitle: 'This is currently the only published project in this gallery.',
      relatedEmptyCopy: 'New projects will automatically appear here as they are added.',
      relatedLink: 'Explore the full gallery', galleryKicker: 'VISUAL DETAILS', galleryTitle: 'Details',
      galleryDescription: 'Additional views and details from the project.', category: 'Category', discipline: 'Discipline',
      year: 'Year', role: 'Role', tools: 'Tools', client: 'Client', duration: 'Duration',
      format: 'Format', footer: 'Great work stays with you.', backTop: 'Back to top',
      rights: 'ALL RIGHTS RESERVED.',
      copyright: 'Projects displayed on this website are protected by copyright. Their use in any other project is not permitted.',
      notFound: 'Project not found', notFoundCopy: 'This project does not exist or is no longer available in the portfolio.',
      visualDesign: 'GRAPHICS / VISUAL DESIGN', motionFilm: 'VIDEO / MOTION & FILM',
      viewProject: 'Open project', noOther: 'There are no other published projects in this gallery yet.'
    }
  };

  const tr = function(){ return copy[lang()] || copy.pl; };
  const text = function(value){
    if (typeof value === 'string') return value;
    return value && (value[lang()] || value.pl || value.en) || '';
  };
  const esc = function(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  };
  const asset = function(value){ return value ? String(value).replace(/^\.\//, '') : ''; };
  const setText = function(selector, value){
    const element = $(selector);
    if (element) element.textContent = value == null ? '' : value;
  };

  function galleryPath(){
    return project && project.type === 'video' ? 'editing.html' : 'graphics.html';
  }

  function showError(){
    const labels = tr();
    document.title = 'NeyeR — ' + labels.notFound;
    setText('#projectTitle', labels.notFound);
    setText('#projectDescription', labels.notFoundCopy);
    setText('#caseEyebrow', 'NEYER / PROJECT ARCHIVE');
    setText('#caseBackText', labels.back);
    $('#caseBackLink').href = 'index.html#work';
    $('#caseVisual').classList.add('case-visual-error');
    const media = $('#projectMedia');
    media.innerHTML = '<div class="case-media-fallback"><span>?</span><small>PROJECT NOT AVAILABLE</small></div>';
    $('#relatedEmpty').hidden = true;
    $('#related').hidden = true;
    $('#caseMain').classList.add('case-loaded');
    document.querySelectorAll('.case-reveal').forEach(function(element){ element.classList.add('is-visible'); });
  }

  function buildMeta(){
    const labels = tr();
    const typeName = project.type === 'video' ? labels.motionFilm : labels.visualDesign;
    const categoryName = category ? text(category.title) : (project.category || '—');
    const values = [
      [labels.discipline, typeName],
      [labels.category, categoryName],
      [labels.year, project.year || '—']
    ];
    if (project.client) values.push([labels.client, text(project.client)]);
    if (project.role) values.push([labels.role, text(project.role)]);
    if (project.duration) values.push([labels.duration, text(project.duration)]);
    if (project.format) values.push([labels.format, text(project.format)]);
    if (project.tools) values.push([labels.tools, Array.isArray(project.tools) ? project.tools.map(text).join(' / ') : text(project.tools)]);

    const facts = $('#projectFacts');
    facts.innerHTML = '';
    values.forEach(function(entry, index){
      const row = document.createElement('div');
      row.className = 'case-fact-row';

      const number = document.createElement('span');
      number.className = 'case-fact-index';
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');

      const copy = document.createElement('div');
      copy.className = 'case-fact-copy';

      const dt = document.createElement('dt');
      dt.textContent = entry[0];
      const dd = document.createElement('dd');
      dd.textContent = entry[1];

      copy.append(dt, dd);
      row.append(number, copy);
      facts.append(row);
    });
  }

  function buildVisual(){
    const media = $('#projectMedia');
    const imageSource = asset(project.image || project.thumbnail || project.cover);
    const videoSource = asset(project.video);
    media.innerHTML = '';

    if (videoSource) {
      const video = document.createElement('video');
      video.src = videoSource;
      if (imageSource) video.poster = imageSource;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.controlsList = 'nodownload';
      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;
      video.setAttribute('aria-label', text(project.title));
      media.append(video);
    } else if (imageSource) {
      const image = document.createElement('img');
      image.src = imageSource;
      image.alt = text(project.alt || project.title);
      image.loading = 'eager';
      image.decoding = 'async';
      image.draggable = false;
      image.className = 'case-main-image';
      image.style.objectFit = project.fit === 'cover' ? 'cover' : 'contain';
      image.addEventListener('error', function(){
        media.innerHTML = '<div class="case-media-fallback"><span>✳</span><small>PREVIEW UNAVAILABLE</small></div>';
      }, { once: true });
      media.append(image);
    } else {
      media.innerHTML = '<div class="case-media-fallback"><span>✳</span><small>NEYER / VISUAL ARCHIVE</small></div>';
    }

    setText('#caseVisualKind', project.type === 'video' ? 'MOTION / FILM' : 'VISUAL DESIGN');
    setText('#caseVisualYear', project.year || '26');
    setText('#caseVisualCaption', (text(project.title) || 'PROJECT').toUpperCase());
  }

  function buildStory(){
    const labels = tr();
    const description = text(project.description).trim();
    const storyCard = $('.case-story-card');
    const storyLabel = $('#storyLabel');
    const storyIntro = $('#storyIntro');
    const storyRule = $('.case-story-rule');
    const overviewAside = $('#overviewAside');

    // The description field in the admin panel is the only copy shown in this section.
    if (storyCard) storyCard.hidden = !description;
    if (storyLabel) storyLabel.hidden = true;
    if (storyIntro) storyIntro.hidden = true;
    if (storyRule) storyRule.hidden = true;
    if (overviewAside) overviewAside.hidden = true;
    setText('#storyTitle', description);

    setText('#overviewKicker', labels.overviewKicker);
    setText('#overviewTitle', labels.overviewTitle);
    setText('#factsHeading', labels.facts);
  }

  function buildSections(){
    const sectionList = project.caseStudy && Array.isArray(project.caseStudy.sections)
      ? project.caseStudy.sections
      : (Array.isArray(project.sections) ? project.sections : []);
    const wrapper = $('#caseSections');
    const content = $('#caseSectionsContent');
    content.innerHTML = '';

    if (!sectionList.length) {
      wrapper.hidden = true;
      return;
    }

    wrapper.hidden = false;
    sectionList.forEach(function(section, index){
      const block = document.createElement('article');
      block.className = 'case-editorial-block case-reveal' + (index % 2 ? ' reverse' : '');
      const copyBlock = document.createElement('div');
      copyBlock.className = 'case-editorial-copy';
      const kicker = document.createElement('div');
      kicker.className = 'case-section-kicker';
      kicker.textContent = String(index + 2).padStart(2, '0') + ' / ' + (text(section.label) || 'PROJECT NOTES');
      const heading = document.createElement('h2');
      heading.textContent = text(section.title);
      const paragraph = document.createElement('p');
      paragraph.textContent = text(section.text || section.description);
      copyBlock.append(kicker, heading, paragraph);

      const imageSource = asset(section.image);
      if (imageSource) {
        const media = document.createElement('div');
        media.className = 'case-editorial-media';
        const image = document.createElement('img');
        image.src = imageSource;
        image.alt = text(section.alt || section.title);
        image.loading = 'lazy';
        image.draggable = false;
        media.append(image);
        block.append(copyBlock, media);
      } else {
        block.append(copyBlock);
      }
      content.append(block);
    });
  }

  function buildGallery(){
    const labels = tr();
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    const section = $('#caseGallerySection');
    const grid = $('#projectGallery');
    grid.innerHTML = '';
    if (!gallery.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    setText('#galleryKicker', labels.galleryKicker);
    setText('#galleryTitle', labels.galleryTitle);
    setText('#galleryDescription', labels.galleryDescription);
    gallery.forEach(function(item, index){
      const source = asset(typeof item === 'string' ? item : (item.image || item.src));
      if (!source) return;
      const figure = document.createElement('figure');
      figure.className = 'case-gallery-item case-reveal';
      const image = document.createElement('img');
      image.src = source;
      image.alt = typeof item === 'string' ? text(project.title) : text(item.alt || item.caption || project.title);
      image.loading = 'lazy';
      image.draggable = false;
      figure.append(image);
      const captionText = typeof item === 'string' ? '' : text(item.caption);
      if (captionText) {
        const caption = document.createElement('figcaption');
        caption.textContent = captionText;
        figure.append(caption);
      } else {
        const indexLabel = document.createElement('figcaption');
        indexLabel.textContent = 'DETAIL / ' + String(index + 1).padStart(2, '0');
        figure.append(indexLabel);
      }
      grid.append(figure);
    });
  }

  function buildRelated(){
    const labels = tr();
    const all = data.projects.filter(function(item){
      return item.id !== project.id && item.type === project.type;
    });
    all.sort(function(first, second){
      const firstMatch = first.category === project.category ? 0 : 1;
      const secondMatch = second.category === project.category ? 0 : 1;
      return firstMatch - secondMatch;
    });

    const related = all.slice(0, 3);
    const grid = $('#relatedProjects');
    const empty = $('#relatedEmpty');
    grid.innerHTML = '';
    setText('#relatedKicker', labels.relatedKicker);
    setText('#relatedTitle', labels.relatedTitle);
    setText('#relatedIntro', labels.relatedIntro);
    setText('#relatedEmptyTitle', all.length ? '' : labels.relatedEmptyTitle);
    setText('#relatedEmptyCopy', all.length ? '' : labels.noOther);
    setText('#relatedLinkText', labels.relatedLink);
    $('#relatedGalleryLink').href = galleryPath();

    if (!related.length) {
      empty.hidden = false;
      empty.classList.add('is-visible');
      return;
    }
    empty.hidden = true;

    related.forEach(function(item, index){
      const link = document.createElement('a');
      link.className = 'case-related-card case-reveal';
      link.href = 'project.html?id=' + encodeURIComponent(item.id);
      link.setAttribute('aria-label', labels.viewProject + ': ' + text(item.title));

      const preview = document.createElement('div');
      preview.className = 'case-related-media';
      const imageSource = asset(item.image || item.thumbnail);
      if (imageSource) {
        const image = document.createElement('img');
        image.src = imageSource;
        image.alt = text(item.title);
        image.loading = 'lazy';
        image.draggable = false;
        preview.append(image);
      } else {
        const fallback = document.createElement('span');
        fallback.className = 'case-related-placeholder';
        fallback.textContent = '✳';
        preview.append(fallback);
      }

      const copyBlock = document.createElement('div');
      copyBlock.className = 'case-related-card-copy';
      const meta = document.createElement('span');
      meta.textContent = (categoryNameFor(item) || item.type.toUpperCase()) + (item.year ? ' / ' + item.year : '');
      const title = document.createElement('strong');
      title.textContent = text(item.title);
      const arrow = document.createElement('span');
      arrow.className = 'case-related-arrow';
      arrow.textContent = '↗';
      copyBlock.append(meta, title);
      link.append(preview, copyBlock, arrow);
      link.style.setProperty('--related-order', String(index));
      grid.append(link);
    });
  }

  function categoryNameFor(item){
    const list = data.categories[item.type] || [];
    const match = list.find(function(entry){ return entry.id === item.category; });
    return match ? text(match.title) : '';
  }

  function applyLanguage(){
    if (!project) return;
    const labels = tr();
    document.documentElement.lang = lang();
    document.title = 'NeyeR — ' + text(project.title);
    setText('#headerBackText', labels.headerBack);
    setText('#caseBackText', labels.back);
    setText('#caseEyebrow', labels.eyebrow);
    setText('#caseAsideLabel', labels.asideLabel);
    setText('#caseAsideCopy', labels.asideCopy);
    setText('#caseScrollHint', labels.scroll);
    setText('#caseVisualNote', labels.visualNote);
    setText('#footerStatement', labels.footer);
    setText('#backTopText', labels.backTop);
    setText('#rightsText', labels.rights);
    setText('#copyrightNotice', labels.copyright);
    setText('#projectTitle', text(project.title));
    setText('#projectDescription', text(project.description || project.longDescription));
    $('#caseBackLink').href = galleryPath();
    $('#relatedGalleryLink').href = galleryPath();
    buildMeta();
    buildStory();
    buildSections();
    buildGallery();
    buildRelated();
    $('#caseMain').classList.add('case-loaded');
    refreshReveals();
  }

  function refreshReveals(){
    const elements = document.querySelectorAll('.case-reveal:not([data-case-observed])');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      elements.forEach(function(element){ element.classList.add('is-visible'); element.dataset.caseObserved = 'true'; });
      return;
    }
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(function(element){
      element.dataset.caseObserved = 'true';
      observer.observe(element);
    });
  }

  function setupVisualInteraction(){
    const visual = $('#caseVisual');
    const media = $('#projectMedia');
    if (!visual || !media || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    visual.addEventListener('pointermove', function(event){
      const rect = visual.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      visual.style.setProperty('--pointer-x', (x * 100).toFixed(1) + '%');
      visual.style.setProperty('--pointer-y', (y * 100).toFixed(1) + '%');
      const rotateY = ((x - 0.5) * 3.2).toFixed(2);
      const rotateX = ((0.5 - y) * 2.4).toFixed(2);
      media.style.transform = 'perspective(1500px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.008)';
    });
    visual.addEventListener('pointerleave', function(){
      visual.style.setProperty('--pointer-x', '50%');
      visual.style.setProperty('--pointer-y', '45%');
      media.style.transform = '';
    });
  }

  try {
    const response = await fetch('portfolio-data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    data = await response.json();
    if (!Array.isArray(data.projects)) data.projects = [];
    project = data.projects.find(function(item){ return item.id === projectId; }) || null;
    if (!project) {
      showError();
      document.addEventListener('neyer:language', showError);
      return;
    }
    const list = data.categories && data.categories[project.type] || [];
    category = list.find(function(item){ return item.id === project.category; }) || null;
    buildVisual();
    applyLanguage();
    setupVisualInteraction();
    document.addEventListener('neyer:language', applyLanguage);

    document.addEventListener('contextmenu', function(event){
      if (event.target.closest('.case-visual img, .case-gallery-item img, .case-editorial-media img')) event.preventDefault();
    });
    document.addEventListener('dragstart', function(event){
      if (event.target.closest('.case-visual img, .case-gallery-item img, .case-editorial-media img')) event.preventDefault();
    });
  } catch (error) {
    console.error('NeyeR project page:', error);
    showError();
  }
})();