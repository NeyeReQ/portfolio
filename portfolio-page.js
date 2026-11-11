(async function(){
  const type=document.body.dataset.portfolioType;
  const lang=()=>window.NeyeR?.lang||'pl';
  const $=(s,p=document)=>p.querySelector(s);
  const filters=$('#categoryFilters'),grid=$('#projectGrid'),count=$('#projectCount');
  let data={categories:{graphics:[],video:[]},projects:[]};
  let active='all';
  const text=(value)=>typeof value==='string'?value:(value?.[lang()]||value?.pl||value?.en||'');
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t=()=>window.NeyeR?.translations?.[lang()]||{};
  const asset=(src)=>src?String(src).replace(/^\.\//,''):'';

  try{
    const response=await fetch('portfolio-data.json',{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    data=await response.json();
    if(!data.categories||!Array.isArray(data.categories[type]))throw new Error('Nieprawidłowy format danych portfolio.');
    if(!Array.isArray(data.projects))data.projects=[];
  }catch(error){
    grid.innerHTML=`<div class="project-empty"><span class="empty-mark">!</span><h2>Nie udało się wczytać portfolio</h2><p>Sprawdź plik portfolio-data.json i uruchom stronę przez GitHub Pages lub serwer lokalny.</p></div>`;
    console.error('NeyeR portfolio data:',error);return;
  }

  function renderFilters(){
    const tr=t();filters.innerHTML='';
    const list=[{id:'all',title:tr.allCategories||'Wszystkie'},...data.categories[type].map(c=>({id:c.id,title:text(c.title)}))];
    list.forEach(item=>{
      const button=document.createElement('button');button.type='button';button.className=`gallery-filter${active===item.id?' active':''}`;button.textContent=item.title;button.setAttribute('aria-pressed',String(active===item.id));
      button.addEventListener('click',()=>{active=item.id;renderFilters();renderProjects();});filters.append(button);
    });
  }
  function mediaMarkup(project){
    const preview=asset(project.image||project.thumbnail);
    if(preview)return `<img src="${esc(preview)}" alt="${esc(text(project.title))}" loading="lazy">`;
    if(project.video)return `<div class="project-placeholder project-placeholder-video"><span>▶</span><small>VIDEO / PREVIEW</small></div>`;
    return `<div class="project-placeholder"><span>N/R</span><small>NEYER VISUAL STUDY</small></div>`;
  }
  function openProject(project){
    const modal=$('#mediaModal'),content=$('#modalContent');if(!modal||!content)return;
    content.innerHTML='';
    if(project.video){const video=document.createElement('video');video.src=asset(project.video);if(project.image||project.thumbnail)video.poster=asset(project.image||project.thumbnail);video.controls=true;video.autoplay=true;video.playsInline=true;content.append(video);}
    else if(project.image||project.thumbnail){const img=document.createElement('img');img.src=asset(project.image||project.thumbnail);img.alt=text(project.title);content.append(img);}
    else {const placeholder=document.createElement('div');placeholder.className='project-placeholder modal-placeholder';placeholder.textContent='N/R';content.append(placeholder);}
    const title=document.createElement('h2');title.textContent=text(project.title);content.append(title);
    const description=text(project.description);if(description){const p=document.createElement('p');p.textContent=description;content.append(p);}
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
  }
  function closeModal(){const modal=$('#mediaModal'),content=$('#modalContent');if(!modal)return;const video=content?.querySelector('video');if(video)video.pause();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
  function renderProjects(){
    const tr=t();const cats=data.categories[type]||[];const catMap=Object.fromEntries(cats.map(c=>[c.id,c]));
    const items=data.projects.filter(p=>p.type===type&&(active==='all'||p.category===active));
    count.textContent=`${String(items.length).padStart(2,'0')} / ${String(cats.length).padStart(2,'0')}`;
    if(!items.length){
      const category=active==='all'?null:catMap[active];
      grid.innerHTML=`<div class="project-empty"><span class="empty-mark">✳</span><h2>${esc(category?text(category.title):tr.emptyTitle||'Ta galeria czeka na Twoje realizacje')}</h2><p>${esc(tr.emptyText||'W tej kategorii nie ma jeszcze opublikowanych prac.')}</p></div>`;return;
    }
    grid.innerHTML='';
    items.forEach(project=>{
      const card=document.createElement('button');card.type='button';card.className='project-card';card.setAttribute('aria-label',`${tr.projectOpen||'Otwórz projekt'}: ${text(project.title)}`);
      const media=document.createElement('div');media.className='project-card-media';media.innerHTML=mediaMarkup(project);
      if(project.video){const play=document.createElement('span');play.className='project-card-play';play.textContent='▶';media.append(play);}
      const body=document.createElement('div');body.className='project-card-body';
      const heading=document.createElement('strong');heading.textContent=text(project.title);
      const meta=document.createElement('span');meta.textContent=`${text(catMap[project.category]?.title)||''}${project.year?` · ${project.year}`:''}`;
      body.append(heading,meta);card.append(media,body);card.addEventListener('click',()=>openProject(project));grid.append(card);
    });
  }
  renderFilters();renderProjects();
  document.addEventListener('neyer:language',()=>{renderFilters();renderProjects();});
  $('#mediaModal')?.addEventListener('click',e=>{if(e.target.id==='mediaModal'||e.target.classList.contains('modal-close'))closeModal();});
  $('.modal-close')?.addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
})();
