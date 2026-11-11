(() => {
  const $=id=>document.getElementById(id);
  let root=null,data={categories:{graphics:[],video:[]},projects:[]};
  let fileSequence=0;
  const status=$('status');
  const say=(message,kind='')=>{status.textContent=message;status.className=`admin-status ${kind}`;};
  const slugify=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').toLowerCase().replace(/ł/g,'l').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'nowa-kategoria';
  const safeName=value=>slugify(value).replace(/-/g,'_');
  const txt=value=>typeof value==='string'?value:(value?.pl||value?.en||'');
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function counts(){ $('categoryCount').textContent=data.categories.graphics.length+data.categories.video.length; $('projectCount').textContent=data.projects.length; }
  function render(){
    counts();
    const categoryList=$('categoryList');categoryList.innerHTML='';
    ['graphics','video'].forEach(type=>{
      data.categories[type].forEach(cat=>{
        const row=document.createElement('div');row.className='admin-list-item';
        const info=document.createElement('div');info.innerHTML=`<strong>${escapeHtml(txt(cat.title))}</strong><small>${type==='graphics'?'GRAFIKA':'MONTAŻ'} / ${escapeHtml(cat.id)}</small>`;
        const actions=document.createElement('div');actions.className='admin-list-actions';
        const del=document.createElement('button');del.type='button';del.className='admin-button danger';del.textContent='Usuń kategorię';del.addEventListener('click',()=>deleteCategory(type,cat.id));actions.append(del);row.append(info,actions);categoryList.append(row);
      });
    });
    if(!categoryList.children.length)categoryList.innerHTML='<p class="admin-muted">Brak kategorii.</p>';
    const projectList=$('projectList');projectList.innerHTML='';
    data.projects.forEach(project=>{
      const category=data.categories[project.type]?.find(c=>c.id===project.category);
      const row=document.createElement('div');row.className='admin-list-item';
      const info=document.createElement('div');info.innerHTML=`<strong>${escapeHtml(txt(project.title))}</strong><small>${project.type==='graphics'?'GRAFIKA':'MONTAŻ'} / ${escapeHtml(txt(category?.title)||project.category)}${project.year?` / ${project.year}`:''}</small>`;
      const actions=document.createElement('div');actions.className='admin-list-actions';
      const del=document.createElement('button');del.type='button';del.className='admin-button danger';del.textContent='Usuń pracę';del.addEventListener('click',()=>deleteProject(project.id));actions.append(del);row.append(info,actions);projectList.append(row);
    });
    if(!projectList.children.length)projectList.innerHTML='<p class="admin-muted">Brak opublikowanych prac.</p>';
    fillProjectCategories();
  }
  function fillProjectCategories(){
    const type=$('projectType').value;const select=$('projectCategory');select.innerHTML='';
    (data.categories[type]||[]).forEach(cat=>{const option=document.createElement('option');option.value=cat.id;option.textContent=txt(cat.title);select.append(option);});
    if(!select.options.length){const option=document.createElement('option');option.value='';option.textContent='Najpierw dodaj kategorię';select.append(option);}
  }
  async function ensureAssetsDir(){const assets=await root.getDirectoryHandle('assets',{create:true});return assets.getDirectoryHandle('projects',{create:true});}
  async function saveFile(file,prefix){
    if(!file)return '';
    const folder=await ensureAssetsDir();const ext=(file.name.match(/\.[a-z0-9]{1,8}$/i)||[''])[0].toLowerCase()|| (file.type.startsWith('video/')?'.mp4':'.png');
    const fileName=`${safeName(prefix)}-${Date.now()}-${++fileSequence}${ext}`;
    const handle=await folder.getFileHandle(fileName,{create:true});const writable=await handle.createWritable();await writable.write(file);await writable.close();
    return `assets/projects/${fileName}`;
  }
  async function saveData(){
    if(!root){say('Najpierw wybierz folder projektu.','error');return false;}
    try{const handle=await root.getFileHandle('portfolio-data.json',{create:true});const writable=await handle.createWritable();await writable.write(JSON.stringify(data,null,2)+'\n');await writable.close();render();say('Zapisano portfolio-data.json w wybranym folderze. Aby zmiany pojawiły się online, wykonaj Commit i Push w GitHub Desktop.','ok');return true;}
    catch(error){console.error(error);say(`Nie udało się zapisać plików: ${error.message}`,'error');return false;}
  }
  $('connectFolder').addEventListener('click',async()=>{
    if(!('showDirectoryPicker'in window)){say('Ta przeglądarka nie obsługuje bezpiecznego wyboru folderu. Otwórz panel w Chrome lub Edge przez HTTPS (GitHub Pages).','error');return;}
    try{
      root=await window.showDirectoryPicker({mode:'readwrite'});
      await root.getFileHandle('index.html');
      const fileHandle=await root.getFileHandle('portfolio-data.json');const file=await fileHandle.getFile();const parsed=JSON.parse(await file.text());
      if(!parsed.categories||!Array.isArray(parsed.categories.graphics)||!Array.isArray(parsed.categories.video)||!Array.isArray(parsed.projects))throw new Error('Nieprawidłowa struktura portfolio-data.json.');
      data=parsed;render();say(`Połączono z folderem „${root.name}”. Dane są edytowane lokalnie — nic nie zostało wysłane na serwer.`,'ok');
    }catch(error){root=null;console.error(error);if(error.name==='AbortError'){say('Anulowano wybór folderu.');return;}say(`Nie udało się otworzyć folderu. Wskaż główny katalog projektu z index.html i portfolio-data.json. Szczegóły: ${error.message}`,'error');}
  });
  $('categoryTitlePl').addEventListener('input',()=>{$('categoryId').value=slugify($('categoryTitlePl').value);});
  $('projectType').addEventListener('change',fillProjectCategories);
  $('categoryForm').addEventListener('submit',async event=>{
    event.preventDefault();if(!root){say('Najpierw wybierz folder projektu.','error');return;}
    const type=$('categoryType').value,titlePl=$('categoryTitlePl').value.trim(),titleEn=$('categoryTitleEn').value.trim();
    const id=slugify(titlePl);if(data.categories[type].some(c=>c.id===id)||Object.values(data.categories).flat().some(c=>c.id===id)){say('Kategoria o takim identyfikatorze już istnieje. Zmień jej nazwę.','error');return;}
    data.categories[type].push({id,title:{pl:titlePl,en:titleEn},description:{pl:$('categoryDescPl').value.trim(),en:$('categoryDescEn').value.trim()}});
    event.target.reset();$('categoryId').value='';render();await saveData();
  });
  $('projectForm').addEventListener('submit',async event=>{
    event.preventDefault();if(!root){say('Najpierw wybierz folder projektu.','error');return;}
    const type=$('projectType').value,category=$('projectCategory').value;if(!category){say('Wybierz kategorię lub najpierw dodaj nową.','error');return;}
    const media=$('projectMedia').files[0],thumbnail=$('projectThumbnail').files[0];
    if(media&&media.size>100*1024*1024){say('Ten plik ma ponad 100 MB. Zmniejsz go przed dodaniem — duże filmy szybko powiększają repozytorium i mogą utrudniać publikację.','error');return;}
    try{
      const title={pl:$('projectTitlePl').value.trim(),en:$('projectTitleEn').value.trim()};
      const prefix=title.pl||title.en||'project';const project={id:crypto.randomUUID(),type,category,title,description:{pl:$('projectDescPl').value.trim(),en:$('projectDescEn').value.trim()},year:$('projectYear').value.trim()};
      if(media){const path=await saveFile(media,prefix);if(media.type.startsWith('video/'))project.video=path;else project.image=path;}
      if(thumbnail)project.image=await saveFile(thumbnail,`${prefix}-thumbnail`);
      data.projects.unshift(project);await saveData();event.target.reset();$('projectYear').value=String(new Date().getFullYear());fillProjectCategories();
    }catch(error){console.error(error);say(`Nie udało się dodać pracy: ${error.message}`,'error');}
  });
  async function deleteProject(id){if(!confirm('Usunąć tę pracę z portfolio? Plik multimedialny pozostanie w folderze assets/projects.'))return;data.projects=data.projects.filter(p=>p.id!==id);await saveData();}
  async function deleteCategory(type,id){const cat=data.categories[type].find(c=>c.id===id);if(!cat)return;const number=data.projects.filter(p=>p.type===type&&p.category===id).length;if(!confirm(`Usunąć kategorię „${txt(cat.title)}” oraz ${number} przypisanych prac? Pliki multimedialne pozostaną w folderze.`))return;data.categories[type]=data.categories[type].filter(c=>c.id!==id);data.projects=data.projects.filter(p=>!(p.type===type&&p.category===id));await saveData();}
  fillProjectCategories();
})();
