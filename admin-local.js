(() => {
  const $ = id => document.getElementById(id);
  const emptyData = () => ({ categories: { graphics: [], video: [] }, projects: [] });
  let root = null;
  let data = emptyData();
  let publishedData = null;
  let fileSequence = 0;
  let saving = false;
  let toastTimer = null;

  const status = $('status');
  const say = (message, kind = '') => {
    if (!status) return;
    status.textContent = message;
    status.className = 'admin-status ' + kind;
  };

  const toastNode = document.createElement('div');
  toastNode.id = 'adminToast';
  toastNode.className = 'admin-toast';
  toastNode.setAttribute('role', 'status');
  toastNode.setAttribute('aria-live', 'polite');
  toastNode.setAttribute('aria-atomic', 'true');
  document.body.append(toastNode);

  const toastStyle = document.createElement('style');
  toastStyle.textContent =
    '.admin-toast{position:fixed;right:22px;bottom:22px;z-index:9999;max-width:min(420px,calc(100vw - 32px));padding:14px 18px;border:1px solid rgba(114,234,217,.55);background:#101d29;color:#a6fff1;box-shadow:0 14px 44px rgba(0,0,0,.35);font:700 11px Manrope,Arial,sans-serif;line-height:1.6;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}.admin-toast.show{opacity:1;transform:translateY(0)}.admin-toast.error{border-color:rgba(255,120,130,.6);color:#ffb0b5}@media(max-width:650px){.admin-toast{left:16px;right:16px;bottom:16px;max-width:none}}';
  document.head.append(toastStyle);

  function showToast(message, kind = 'ok') {
    toastNode.textContent = message;
    toastNode.className = 'admin-toast show' + (kind === 'error' ? ' error' : '');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastNode.classList.remove('show');
    }, 2800);
  }

  const slugify = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'nowa-kategoria';
  const safeName = value => slugify(value).replace(/-/g, '_');
  const txt = value => typeof value === 'string' ? value : (value && (value.pl || value.en)) || '';
  const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const cloneData = () => JSON.parse(JSON.stringify(data));

  function validateData(value) {
    if (!value || !value.categories ||
        !Array.isArray(value.categories.graphics) ||
        !Array.isArray(value.categories.video) ||
        !Array.isArray(value.projects)) {
      throw new Error('Nieprawidłowa struktura portfolio-data.json.');
    }
    return value;
  }

  function updateEditingControls() {
    const categorySubmit = $('categoryForm') && $('categoryForm').querySelector('[type="submit"]');
    const projectSubmit = $('projectForm') && $('projectForm').querySelector('[type="submit"]');
    const projectCategories = data.categories[$('projectType').value] || [];

    // Keep actions clickable before folder selection so the user gets an explanation
    // instead of a disabled cursor. Actual writes are still guarded in submit/delete handlers.
    if (categorySubmit) {
      categorySubmit.disabled = saving;
      categorySubmit.title = saving ? 'Trwa zapisywanie zmian.' : '';
    }
    if (projectSubmit) {
      projectSubmit.disabled = saving || !projectCategories.length;
      projectSubmit.title = !projectCategories.length
        ? 'Najpierw dodaj kategorię w wybranej sekcji.'
        : (saving ? 'Trwa zapisywanie zmian.' : '');
    }

    const categorySelect = $('projectCategory');
    if (categorySelect) categorySelect.disabled = !projectCategories.length;

    document.querySelectorAll('.admin-list-actions button').forEach(button => {
      button.disabled = saving;
      if (saving) button.title = 'Trwa zapisywanie zmian.';
      else button.removeAttribute('title');
    });
  }

  function counts() {
    $('categoryCount').textContent = data.categories.graphics.length + data.categories.video.length;
    $('projectCount').textContent = data.projects.length;
  }

  function fillProjectCategories() {
    const type = $('projectType').value;
    const select = $('projectCategory');
    const previous = select.value;
    const categories = data.categories[type] || [];
    select.innerHTML = '';

    if (categories.length) {
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = txt(cat.title) || cat.id;
        select.append(option);
      });
      select.value = categories.some(cat => cat.id === previous) ? previous : categories[0].id;
    } else {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = type === 'graphics'
        ? 'Brak kategorii w sekcji Grafika'
        : 'Brak kategorii w sekcji Montaż';
      select.append(option);
    }
    updateEditingControls();
  }

  function render() {
    counts();

    const categoryList = $('categoryList');
    categoryList.innerHTML = '';
    ['graphics', 'video'].forEach(type => {
      (data.categories[type] || []).forEach(cat => {
        const row = document.createElement('div');
        row.className = 'admin-list-item';
        const info = document.createElement('div');
        info.innerHTML = '<strong>' + escapeHtml(txt(cat.title)) + '</strong><small>' +
          (type === 'graphics' ? 'GRAFIKA' : 'MONTAŻ') + ' / ' + escapeHtml(cat.id) + '</small>';
        const actions = document.createElement('div');
        actions.className = 'admin-list-actions';
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'admin-button danger';
        del.textContent = 'Usuń kategorię';
        del.addEventListener('click', () => deleteCategory(type, cat.id));
        actions.append(del);
        row.append(info, actions);
        categoryList.append(row);
      });
    });
    if (!categoryList.children.length) {
      categoryList.innerHTML = '<p class="admin-muted">Brak kategorii.</p>';
    }

    const projectList = $('projectList');
    projectList.innerHTML = '';
    data.projects.forEach(project => {
      const category = data.categories[project.type] && data.categories[project.type].find(c => c.id === project.category);
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + escapeHtml(txt(project.title)) + '</strong><small>' +
        (project.type === 'graphics' ? 'GRAFIKA' : 'MONTAŻ') + ' / ' +
        escapeHtml(txt(category && category.title) || project.category) +
        (project.year ? ' / ' + escapeHtml(project.year) : '') + '</small>';
      const actions = document.createElement('div');
      actions.className = 'admin-list-actions';
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'admin-button danger';
      del.textContent = 'Usuń pracę';
      del.addEventListener('click', () => deleteProject(project.id));
      actions.append(del);
      row.append(info, actions);
      projectList.append(row);
    });
    if (!projectList.children.length) {
      projectList.innerHTML = '<p class="admin-muted">Brak opublikowanych prac.</p>';
    }

    fillProjectCategories();
    updateEditingControls();
  }

  async function ensureAssetsDir() {
    const assets = await root.getDirectoryHandle('assets', { create: true });
    return assets.getDirectoryHandle('projects', { create: true });
  }

  async function saveFile(file, prefix) {
    if (!file) return '';
    const folder = await ensureAssetsDir();
    const ext = (file.name.match(/\.[a-z0-9]{1,8}$/i) || [''])[0].toLowerCase() ||
      (file.type.startsWith('video/') ? '.mp4' : '.png');
    const fileName = safeName(prefix) + '-' + Date.now() + '-' + (++fileSequence) + ext;
    const handle = await folder.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    try {
      await writable.write(file);
      await writable.close();
    } catch (error) {
      try { await writable.abort(); } catch (_) {}
      throw error;
    }
    return 'assets/projects/' + fileName;
  }

  async function saveData(actionLabel) {
    if (!root) {
      say('Najpierw wybierz folder projektu, aby móc zapisywać zmiany.', 'error');
      showToast('Nie zapisano — najpierw podłącz folder projektu.', 'error');
      return false;
    }

    saving = true;
    updateEditingControls();
    let writable = null;
    try {
      const handle = await root.getFileHandle('portfolio-data.json', { create: true });
      writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2) + '\n');
      await writable.close();
      writable = null;

      render();
      const message = 'Zapisano zmianę' + (actionLabel ? ' — ' + actionLabel : '') +
        '. Zmiana jest w lokalnym folderze; aby opublikować ją online, wykonaj Commit i Push w GitHub Desktop.';
      say(message, 'ok');
      showToast('Zapisano zmianę' + (actionLabel ? ' — ' + actionLabel + '.' : '.'), 'ok');
      return true;
    } catch (error) {
      if (writable) {
        try { await writable.abort(); } catch (_) {}
      }
      console.error(error);
      say('Nie udało się zapisać plików: ' + error.message, 'error');
      showToast('Nie udało się zapisać zmiany.', 'error');
      return false;
    } finally {
      saving = false;
      updateEditingControls();
    }
  }

  async function loadPublishedData() {
    try {
      const response = await fetch('portfolio-data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const parsed = validateData(await response.json());
      data = parsed;
      publishedData = cloneData();
      render();
      const total = data.categories.graphics.length + data.categories.video.length;
      say('Wczytano dane opublikowanej strony: ' + total +
        ' kategorii. Wybierz folder projektu, aby włączyć edycję i zapisywanie.', 'ok');
    } catch (error) {
      console.error(error);
      say('Nie udało się automatycznie wczytać kategorii ze strony. Wybierz folder projektu, aby wczytać portfolio-data.json. Szczegóły: ' +
        error.message, 'error');
    }
  }

  $('connectFolder').addEventListener('click', async () => {
    if (!('showDirectoryPicker' in window)) {
      say('Ta przeglądarka nie obsługuje bezpiecznego wyboru folderu. Otwórz panel w Chrome lub Edge przez HTTPS (GitHub Pages).', 'error');
      showToast('Wymagany jest Chrome lub Edge.', 'error');
      return;
    }
    try {
      const selectedRoot = await window.showDirectoryPicker({ mode: 'readwrite' });
      await selectedRoot.getFileHandle('index.html');
      const fileHandle = await selectedRoot.getFileHandle('portfolio-data.json');
      const file = await fileHandle.getFile();
      const parsed = validateData(JSON.parse(await file.text()));

      root = selectedRoot;
      data = parsed;
      render();
      say('Połączono z folderem „' + root.name +
        '”. Możesz teraz dodawać i usuwać kategorie oraz prace. Zapis odbywa się lokalnie.', 'ok');
      showToast('Połączono folder projektu.');
    } catch (error) {
      root = null;
      render();
      console.error(error);
      if (error.name === 'AbortError') {
        say('Anulowano wybór folderu.');
        return;
      }
      say('Nie udało się otworzyć folderu. Wskaż główny katalog projektu z index.html i portfolio-data.json. Szczegóły: ' +
        error.message, 'error');
      showToast('Nie udało się połączyć folderu.', 'error');
    }
  });

  $('categoryTitlePl').addEventListener('input', () => {
    $('categoryId').value = slugify($('categoryTitlePl').value);
  });
  $('projectType').addEventListener('change', fillProjectCategories);

  $('categoryForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!root) {
      say('Najpierw wybierz folder projektu.', 'error');
      showToast('Najpierw podłącz folder projektu.', 'error');
      return;
    }

    const type = $('categoryType').value;
    const titlePl = $('categoryTitlePl').value.trim();
    const titleEn = $('categoryTitleEn').value.trim();
    const id = slugify(titlePl);

    if ((data.categories[type] || []).some(c => c.id === id) ||
        Object.values(data.categories).flat().some(c => c.id === id)) {
      say('Kategoria o takim identyfikatorze już istnieje. Zmień jej nazwę.', 'error');
      showToast('Taka kategoria już istnieje.', 'error');
      return;
    }

    const previous = cloneData();
    data.categories[type].push({
      id: id,
      title: { pl: titlePl, en: titleEn },
      description: {
        pl: $('categoryDescPl').value.trim(),
        en: $('categoryDescEn').value.trim()
      }
    });

    $('projectType').value = type;
    fillProjectCategories();
    const saved = await saveData('dodano kategorię');
    if (saved) {
      event.target.reset();
      $('categoryId').value = '';
    } else {
      data = previous;
      render();
    }
  });

  $('projectForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!root) {
      say('Najpierw wybierz folder projektu.', 'error');
      showToast('Najpierw podłącz folder projektu.', 'error');
      return;
    }

    const type = $('projectType').value;
    const category = $('projectCategory').value;
    if (!category) {
      say('W wybranej sekcji nie ma jeszcze kategorii. Dodaj kategorię w tej samej sekcji.', 'error');
      showToast('Wybierz istniejącą kategorię.', 'error');
      return;
    }

    const media = $('projectMedia').files[0];
    const thumbnail = $('projectThumbnail').files[0];
    if (media && media.size > 100 * 1024 * 1024) {
      say('Ten plik ma ponad 100 MB. Zmniejsz go przed dodaniem — duże filmy szybko powiększają repozytorium i mogą utrudniać publikację.', 'error');
      showToast('Plik przekracza limit 100 MB.', 'error');
      return;
    }

    const previous = cloneData();
    try {
      const title = {
        pl: $('projectTitlePl').value.trim(),
        en: $('projectTitleEn').value.trim()
      };
      const prefix = title.pl || title.en || 'project';
      const project = {
        id: window.crypto && crypto.randomUUID ? crypto.randomUUID() :
          'project-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
        type: type,
        category: category,
        title: title,
        description: {
          pl: $('projectDescPl').value.trim(),
          en: $('projectDescEn').value.trim()
        },
        year: $('projectYear').value.trim()
      };

      if (media) {
        const path = await saveFile(media, prefix);
        if (media.type.startsWith('video/')) project.video = path;
        else project.image = path;
      }
      if (thumbnail) project.image = await saveFile(thumbnail, prefix + '-thumbnail');

      data.projects.unshift(project);
      const saved = await saveData('dodano projekt');
      if (saved) {
        event.target.reset();
        $('projectYear').value = String(new Date().getFullYear());
        fillProjectCategories();
      } else {
        data = previous;
        render();
      }
    } catch (error) {
      data = previous;
      render();
      console.error(error);
      say('Nie udało się dodać pracy: ' + error.message, 'error');
      showToast('Nie udało się dodać projektu.', 'error');
    }
  });

  async function deleteProject(id) {
    if (!root) {
      say('Najpierw wybierz folder projektu.', 'error');
      return;
    }
    const project = data.projects.find(item => item.id === id);
    if (!project || !confirm('Usunąć tę pracę z portfolio? Plik multimedialny pozostanie w folderze assets/projects.')) return;
    const previous = cloneData();
    data.projects = data.projects.filter(item => item.id !== id);
    const saved = await saveData('usunięto projekt');
    if (!saved) {
      data = previous;
      render();
    }
  }

  async function deleteCategory(type, id) {
    if (!root) {
      say('Najpierw wybierz folder projektu.', 'error');
      return;
    }
    const cat = data.categories[type].find(item => item.id === id);
    if (!cat) return;
    const number = data.projects.filter(project => project.type === type && project.category === id).length;
    if (!confirm('Usunąć kategorię „' + txt(cat.title) + '” oraz ' + number +
        ' przypisanych prac? Pliki multimedialne pozostaną w folderze.')) return;

    const previous = cloneData();
    data.categories[type] = data.categories[type].filter(item => item.id !== id);
    data.projects = data.projects.filter(project => !(project.type === type && project.category === id));
    const saved = await saveData('usunięto kategorię');
    if (!saved) {
      data = previous;
      render();
    }
  }

  render();
  loadPublishedData();
})();