(() => {
  const $ = id => document.getElementById(id);
  const emptyData = () => ({ categories: { graphics: [], video: [] }, projects: [] });
  let root = null;
  let data = emptyData();
  let publishedData = null;
  let fileSequence = 0;
  let saving = false;
  let toastTimer = null;
  let githubToken = null;
  let stagedFiles = [];
  let editingProjectId = null;
  let pendingNewProjectId = null;
  let publishScreenTimer = null;
  let pendingPublishCheck = null;
  const githubOwner = "NeyeReQ";
  const githubRepo = "portfolio";
  const githubBranch = "main";

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

  function setPublishProgress(value, message, detail) {
    const percent = Math.max(0, Math.min(100, Math.round(value)));
    const fill = $('publishBarFill');
    const label = $('publishPercent');
    const copy = $('publishMessage');
    const stage = $('publishStage');
    const bar = $('publishProgressBar');
    if (fill) fill.style.width = percent + '%';
    if (label) label.textContent = percent + '%';
    if (copy && message) copy.textContent = message;
    if (stage && detail !== undefined) stage.textContent = detail;
    if (bar) bar.setAttribute('aria-valuenow', String(percent));
  }

  function showPublishScreen(actionLabel) {
    if (publishScreenTimer) window.clearTimeout(publishScreenTimer);
    const screen = $('publishScreen');
    screen.hidden = false;
    screen.classList.remove('is-complete', 'is-error');
    $('publishTitle').textContent = 'Zapisujemy zmiany';
    $('publishRetry').hidden = true;
    $('publishRetry').disabled = false;
    $('publishClose').hidden = true;
    setPublishProgress(3, 'Przygotowujemy zmiany do zapisu…', actionLabel || 'Przygotowanie');
    requestAnimationFrame(() => screen.classList.add('is-visible'));
  }

  function hidePublishScreen() {
    if (publishScreenTimer) {
      window.clearTimeout(publishScreenTimer);
      publishScreenTimer = null;
    }
    const screen = $('publishScreen');
    screen.classList.remove('is-visible', 'is-complete', 'is-error');
    screen.hidden = true;
    pendingPublishCheck = null;
  }

  function completePublishScreen(message, detail) {
    $('publishScreen').classList.remove('is-error');
    $('publishScreen').classList.add('is-complete');
    $('publishTitle').textContent = 'Gotowe!';
    setPublishProgress(100, message || 'Wszystkie zmiany są już dostępne.', detail || 'Zakończono');
    $('publishRetry').hidden = true;
    $('publishClose').hidden = false;
    $('publishClose').textContent = 'Zamknij';
    pendingPublishCheck = null;
    publishScreenTimer = window.setTimeout(hidePublishScreen, 1300);
  }

  function failPublishScreen(message, canRetry) {
    $('publishScreen').classList.add('is-error');
    $('publishTitle').textContent = canRetry ? 'Publikacja jeszcze trwa' : 'Nie udało się zapisać zmian';
    $('publishMessage').textContent = message;
    $('publishStage').textContent = canRetry
      ? 'Zmiany są zapisane w GitHubie. Strona jeszcze ich nie udostępniła.'
      : 'Możesz zamknąć to okno i sprawdzić komunikat w panelu.';
    $('publishRetry').hidden = !canRetry;
    $('publishRetry').disabled = false;
    $('publishClose').hidden = false;
    $('publishClose').textContent = 'Zamknij';
  }

  async function verifyPublicPortfolio(commitSha, assetPaths) {
    const expected = JSON.stringify(data);
    const query = 'publish-check=' + encodeURIComponent(commitSha);
    const response = await fetch('portfolio-data.json?' + query, { cache: 'no-store' });
    if (!response.ok) return false;
    let liveData;
    try { liveData = await response.json(); }
    catch (_) { return false; }
    if (JSON.stringify(liveData) !== expected) return false;
    for (const path of assetPaths || []) {
      const assetResponse = await fetch(path + '?' + query, { method: 'HEAD', cache: 'no-store' });
      if (!assetResponse.ok) return false;
    }
    return true;
  }

  async function waitForPublicPortfolio(commitSha, assetPaths) {
    const maxAttempts = 60;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      setPublishProgress(
        Math.min(96, 80 + Math.round((attempt / maxAttempts) * 16)),
        'Czekamy, aż strona udostępni najnowszą wersję…',
        'Weryfikacja publikacji ' + (attempt + 1) + '/' + maxAttempts
      );
      try {
        if (await verifyPublicPortfolio(commitSha, assetPaths)) {
          setPublishProgress(98, 'Sprawdzamy dostępność wszystkich plików…', 'Kontrola danych i multimediów');
          return true;
        }
      } catch (error) {
        console.warn('Portfolio publication check:', error);
      }
      await new Promise(resolve => window.setTimeout(resolve, 2000));
    }
    const error = new Error('Zmiany zapisano w GitHubie, ale publiczna strona nie udostępniła ich jeszcze w ciągu 2 minut. Możesz ponowić sprawdzanie.');
    error.commitPushed = true;
    throw error;
  }

  $('publishRetry').addEventListener('click', async () => {
    if (!pendingPublishCheck) return;
    const check = pendingPublishCheck;
    $('publishRetry').disabled = true;
    $('publishScreen').classList.remove('is-error');
    $('publishTitle').textContent = 'Sprawdzamy publikację';
    setPublishProgress(96, 'Ponownie sprawdzamy publiczną wersję strony…', 'Weryfikacja');
    try {
      await check();
      completePublishScreen('Wszystkie zmiany są już dostępne na stronie.', 'Opublikowano i zweryfikowano');
      say('Potwierdzono: zmiany i pliki są już dostępne na publicznej stronie.', 'ok');
    } catch (error) {
      failPublishScreen(error.message, true);
    }
  });

  $('publishClose').addEventListener('click', hidePublishScreen);
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
  const formatPublishedAt = value => {
    if (!value) return 'Data publikacji nieznana';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Data publikacji nieznana';
    return new Intl.DateTimeFormat('pl-PL', {
      timeZone: 'Europe/Warsaw',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(date);
  };
  const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
  const cloneData = () => JSON.parse(JSON.stringify(data));

  // Fine-grained token is held in this page's memory only.
  async function githubApi(path, options = {}, token = githubToken) {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
    if (token) headers.Authorization = "Bearer " + token;
    const request = { method: options.method || "GET", headers: headers };
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      request.body = JSON.stringify(options.body);
    }
    const response = await fetch("https://api.github.com" + path, request);
    const raw = await response.text();
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; }
    catch (_) { payload = { message: raw }; }
    if (!response.ok) {
      throw new Error(payload.message || ("GitHub API returned HTTP " + response.status));
    }
    return payload;
  }

  function decodeBase64Utf8(value) {
    const binary = atob(String(value || "").replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function fileToBase64(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  async function connectGitHub() {
    const field = $("githubToken");
    const token = field ? field.value.trim() : "";
    if (field) field.value = "";
    if (!token) {
      say("Wklej Fine-grained token z uprawnieniem Contents: Read and write.", "error");
      showToast("Brakuje tokenu GitHub.", "error");
      return;
    }

    say("Sprawdzam dostęp do NeyeReQ/portfolio…");
    try {
      const repo = await githubApi("/repos/" + githubOwner + "/" + githubRepo, {}, token);
      if (repo.full_name !== githubOwner + "/" + githubRepo) {
        throw new Error("Token nie wskazuje właściwego repozytorium.");
      }
      if (repo.permissions && repo.permissions.push === false) {
        throw new Error("Token nie ma uprawnienia zapisu do repozytorium.");
      }

      const file = await githubApi(
        "/repos/" + githubOwner + "/" + githubRepo + "/contents/portfolio-data.json?ref=" + githubBranch,
        {},
        token
      );
      const parsed = validateData(JSON.parse(decodeBase64Utf8(file.content)));
      githubToken = token;
      root = null;
      stagedFiles = [];
      data = parsed;
      publishedData = cloneData();
      render();
      say("Połączono z GitHubem. Nowe prace i zmiany będą publikowane bezpośrednio w gałęzi main.", "ok");
      showToast("Połączono z GitHubem. Możesz publikować prace.");
    } catch (error) {
      githubToken = null;
      console.error(error);
      say("Nie udało się połączyć z GitHubem: " + error.message, "error");
      showToast("Nie udało się połączyć z GitHubem.", "error");
    }
  }

  function disconnectGitHub() {
    githubToken = null;
    stagedFiles = [];
    if (publishedData) data = JSON.parse(JSON.stringify(publishedData));
    render();
    say("Odłączono GitHub. Połącz ponownie GitHub lub wybierz lokalny folder projektu.");
    showToast("Odłączono GitHub.");
  }

  async function publishToGitHub(actionLabel) {
    const apiRoot = "/repos/" + githubOwner + "/" + githubRepo;
    const ref = await githubApi(apiRoot + "/git/ref/heads/" + githubBranch);
    const parentSha = ref.object.sha;
    const parent = await githubApi(apiRoot + "/git/commits/" + parentSha);
    const treeEntries = [];

    for (let index = 0; index < stagedFiles.length; index++) {
      const item = stagedFiles[index];
      const uploadProgress = 20 + Math.round(((index + 1) / stagedFiles.length) * 38);
      setPublishProgress(uploadProgress, 'Wysyłamy multimedia do GitHuba…',
        'Przesyłanie pliku ' + (index + 1) + '/' + stagedFiles.length);
      const blob = await githubApi(apiRoot + "/git/blobs", {
        method: "POST",
        body: { content: await fileToBase64(item.file), encoding: "base64" }
      });
      treeEntries.push({ path: item.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    if (pendingNewProjectId) {
      const pendingProject = data.projects.find(item => item.id === pendingNewProjectId);
      if (pendingProject && !pendingProject.publishedAt) pendingProject.publishedAt = new Date().toISOString();
    }
    setPublishProgress(62, 'Zapisujemy listę realizacji…', 'Przygotowanie danych portfolio');

    const dataBlob = await githubApi(apiRoot + "/git/blobs", {
      method: "POST",
      body: { content: JSON.stringify(data, null, 2) + "\n", encoding: "utf-8" }
    });
    treeEntries.push({ path: "portfolio-data.json", mode: "100644", type: "blob", sha: dataBlob.sha });

    setPublishProgress(68, 'Przygotowujemy kompletną wersję portfolio…', 'Budowanie zestawu plików');
    const tree = await githubApi(apiRoot + "/git/trees", {
      method: "POST",
      body: { base_tree: parent.tree.sha, tree: treeEntries }
    });
    setPublishProgress(72, 'Zapisujemy wersję portfolio…', 'Tworzenie commita');
    const commit = await githubApi(apiRoot + "/git/commits", {
      method: "POST",
      body: {
        message: "Publish portfolio update: " + (actionLabel || "content"),
        tree: tree.sha,
        parents: [parentSha]
      }
    });

    // The manifest and media files are committed together.
    // force:false prevents overwriting concurrent changes.
    setPublishProgress(76, 'Wysyłamy gotową wersję do publikacji…', 'Aktualizacja gałęzi main');
    await githubApi(apiRoot + "/git/refs/heads/" + githubBranch, {
      method: "PATCH",
      body: { sha: commit.sha, force: false }
    });

    const assetPaths = stagedFiles.map(item => item.path);
    stagedFiles = [];
    publishedData = cloneData();
    return { ...commit, assetPaths };
  }


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
      projectSubmit.textContent = editingProjectId ? 'Zapisz zmiany pracy' : '+ Dodaj pracę i zapisz';
      projectSubmit.title = !projectCategories.length
        ? 'Najpierw dodaj kategorię w wybranej sekcji.'
        : (saving ? 'Trwa zapisywanie zmian.' : '');
    }
    const cancelEdit = $('cancelProjectEdit');
    if (cancelEdit) cancelEdit.hidden = !editingProjectId;
    const projectHeading = $('projectFormHeading');
    if (projectHeading) projectHeading.textContent = editingProjectId
      ? '03 / Edytuj realizację'
      : '03 / Dodaj realizację';

    const categoryOptions = $('projectCategoryOptions');
    if (categoryOptions) categoryOptions.querySelectorAll('input[name="projectCategories"]').forEach(input => {
      input.disabled = saving || !projectCategories.length;
    });

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

  function selectedProjectCategoryIds() {
    return Array.from(document.querySelectorAll('#projectCategoryOptions input[name="projectCategories"]:checked'))
      .map(input => input.value);
  }

  function projectCategoryIds(project) {
    return Array.isArray(project.categories) && project.categories.length
      ? project.categories
      : (project.category ? [project.category] : []);
  }

  function projectCategoryNames(project) {
    const list = data.categories[project.type] || [];
    return projectCategoryIds(project)
      .map(id => list.find(category => category.id === id))
      .filter(Boolean)
      .map(category => txt(category.title) || category.id);
  }

  function fillProjectCategories(selectedIds) {
    const type = $('projectType').value;
    const container = $('projectCategoryOptions');
    const categories = data.categories[type] || [];
    const previous = selectedIds === undefined ? selectedProjectCategoryIds() : selectedIds;
    const valid = (Array.isArray(previous) ? previous : []).filter(id =>
      categories.some(category => category.id === id)
    );
    const selected = valid.length ? [...new Set(valid)] : (categories.length ? [categories[0].id] : []);

    container.innerHTML = '';
    if (!categories.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-muted';
      empty.textContent = type === 'graphics'
        ? 'Brak kategorii w sekcji Grafika. Najpierw dodaj kategorię.'
        : 'Brak kategorii w sekcji Montaż. Najpierw dodaj kategorię.';
      container.append(empty);
    } else {
      categories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'admin-category-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'projectCategories';
        checkbox.value = category.id;
        checkbox.checked = selected.includes(category.id);
        checkbox.addEventListener('change', updateEditingControls);
        const name = document.createElement('span');
        name.textContent = txt(category.title) || category.id;
        label.append(checkbox, name);
        container.append(label);
      });
    }
    updateEditingControls();
  }

  function resetProjectForm() {
    editingProjectId = null;
    $('projectForm').reset();
    $('projectYear').value = String(new Date().getFullYear());
    $('projectCurrentMedia').textContent = 'Nie wybrano pracy do edycji.';
    fillProjectCategories();
    updateEditingControls();
  }

  function editProject(id) {
    const project = data.projects.find(item => item.id === id);
    if (!project) {
      say('Nie znaleziono tej pracy. Odśwież listę i spróbuj ponownie.', 'error');
      return;
    }
    editingProjectId = id;
    $('projectType').value = project.type;
    fillProjectCategories(projectCategoryIds(project));
    $('projectTitlePl').value = project.title && (project.title.pl || project.title.en) || '';
    $('projectTitleEn').value = project.title && (project.title.en || project.title.pl) || '';
    $('projectDescPl').value = project.description && (project.description.pl || project.description.en) || '';
    $('projectDescEn').value = project.description && (project.description.en || project.description.pl) || '';
    $('projectYear').value = project.year || '';
    $('projectMedia').value = '';
    $('projectThumbnail').value = '';
    const current = [];
    if (project.video) current.push('Wideo: ' + project.video);
    if (project.image) current.push('Grafika / miniatura: ' + project.image);
    $('projectCurrentMedia').textContent = current.length
      ? 'Aktualne pliki: ' + current.join(' · ') + '. Wybierz nowy plik tylko wtedy, gdy chcesz go zastąpić; puste pole pozostawi obecny plik.'
      : 'Ta praca nie ma przypisanego pliku. Wybierz plik, aby go dodać.';
    updateEditingControls();
    $('projectPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    $('projectTitlePl').focus({ preventScroll: true });
    say('Edytujesz „' + (project.title && (project.title.pl || project.title.en) || 'pracę') +
      '”. Zmiany zostaną opublikowane po kliknięciu Zapisz zmiany pracy.', 'ok');
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
      const categoryNames = projectCategoryNames(project);
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + escapeHtml(txt(project.title)) + '</strong><small>' +
        (project.type === 'graphics' ? 'GRAFIKA' : 'MONTAŻ') + ' / ' +
        escapeHtml(categoryNames.join(', ') || project.category || '—') +
        (project.year ? ' / ' + escapeHtml(project.year) : '') + '</small>' +
        '<small class="admin-published-at">OPUBLIKOWANO / ' +
        escapeHtml(formatPublishedAt(project.publishedAt)) + '</small>';
      const actions = document.createElement('div');
      actions.className = 'admin-list-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'admin-button';
      edit.textContent = editingProjectId === project.id ? 'Edytujesz' : 'Edytuj';
      edit.addEventListener('click', () => editProject(project.id));

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'admin-button danger';
      del.textContent = 'Usuń pracę';
      del.addEventListener('click', () => deleteProject(project.id));
      actions.append(edit, del);
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
    const ext = (file.name.match(/\.[a-z0-9]{1,8}$/i) || [''])[0].toLowerCase() ||
      (file.type.startsWith('video/') ? '.mp4' : '.png');
    const fileName = safeName(prefix) + '-' + Date.now() + '-' + (++fileSequence) + ext;
    const path = 'assets/projects/' + fileName;

    if (githubToken) {
      stagedFiles.push({ path: path, file: file });
      return path;
    }
    if (!root) throw new Error('Najpierw połącz GitHub lub wybierz lokalny folder projektu.');

    const folder = await ensureAssetsDir();
    const handle = await folder.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    try {
      await writable.write(file);
      await writable.close();
    } catch (error) {
      try { await writable.abort(); } catch (_) {}
      throw error;
    }
    return path;
  }

  async function saveData(actionLabel) {
    if (!root && !githubToken) {
      say('Najpierw połącz GitHub lub wybierz lokalny folder projektu.', 'error');
      showToast('Najpierw wybierz sposób publikowania.', 'error');
      return false;
    }

    saving = true;
    updateEditingControls();
    showPublishScreen(actionLabel || 'Zapisywanie');
    let writable = null;
    try {
      if (githubToken) {
        setPublishProgress(12, 'Łączymy się z GitHubem…', 'Połączenie z repozytorium');
        const commit = await publishToGitHub(actionLabel);
        setPublishProgress(78, 'Pliki wysłane. Czekamy na publikację strony…', 'Commit ' + commit.sha.slice(0, 7));
        const check = () => waitForPublicPortfolio(commit.sha, commit.assetPaths);
        try {
          await check();
          completePublishScreen('Praca i wszystkie zmiany są już widoczne na stronie.', 'Opublikowano i zweryfikowano');
          say('Potwierdzono: zmiany i pliki są już dostępne na publicznej stronie.', 'ok');
          showToast('Zmiany opublikowane i sprawdzone na stronie.');
        } catch (error) {
          if (!error.commitPushed) throw error;
          pendingPublishCheck = check;
          failPublishScreen(error.message, true);
          say(error.message, 'error');
          showToast('Zmiany zapisane w GitHubie; strona jeszcze je publikuje.');
        }
        return true;
      }

      if (pendingNewProjectId) {
        const pendingProject = data.projects.find(item => item.id === pendingNewProjectId);
        if (pendingProject && !pendingProject.publishedAt) pendingProject.publishedAt = new Date().toISOString();
      }
      setPublishProgress(30, 'Zapisujemy plik portfolio-data.json…', 'Zapis lokalny');
      const handle = await root.getFileHandle('portfolio-data.json', { create: true });
      writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2) + '\n');
      await writable.close();
      writable = null;

      setPublishProgress(82, 'Weryfikujemy zapisane dane…', 'Kontrola pliku na komputerze');
      const savedFile = await handle.getFile();
      const savedData = JSON.parse(await savedFile.text());
      if (JSON.stringify(savedData) !== JSON.stringify(data)) {
        throw new Error('Zapisany plik różni się od danych w panelu.');
      }

      pendingNewProjectId = null;
      completePublishScreen(
        'Zmiany zostały zapisane w wybranym folderze.',
        'Zapis lokalny — publikacja online wymaga Commit i Push'
      );
      say('Zapisano lokalnie' + (actionLabel ? ' — ' + actionLabel : '') +
        '. Aby opublikować, wykonaj Commit i Push w GitHub Desktop.', 'ok');
      showToast('Zmiany zapisane lokalnie. Pamiętaj o Commit i Push.');
      return true;
    } catch (error) {
      if (writable) {
        try { await writable.abort(); } catch (_) {}
      }
      console.error(error);
      const hint = /fast.forward|not a fast forward|update is not a fast forward/i.test(error.message)
        ? ' Gałąź main zmieniła się od połączenia. Odśwież panel i połącz GitHub ponownie.'
        : '';
      failPublishScreen(error.message + hint, false);
      say('Nie udało się opublikować zmiany: ' + error.message + hint, 'error');
      showToast('Nie udało się opublikować zmiany.', 'error');
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
      // The initial public-page fetch must not overwrite a newer folder or GitHub connection.
      if (githubToken || root) return;
      data = parsed;
      publishedData = cloneData();
      render();
      const total = data.categories.graphics.length + data.categories.video.length;
      say('Wczytano opublikowane portfolio. Połącz GitHub, aby publikować bezpośrednio, lub wybierz lokalny folder projektu.', 'ok');
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
      githubToken = null;
      stagedFiles = [];
      if ($('githubToken')) $('githubToken').value = '';
      data = parsed;
      render();
      say('Połączono lokalny folder „' + root.name +
        '”. Zmiany zapisują się na komputerze; publikacja wymaga Commit i Push w GitHub Desktop.', 'ok');
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

  $('connectGitHub').addEventListener('click', connectGitHub);
  $('disconnectGitHub').addEventListener('click', disconnectGitHub);

  $('categoryTitlePl').addEventListener('input', () => {
    $('categoryId').value = slugify($('categoryTitlePl').value);
  });
  $('projectType').addEventListener('change', fillProjectCategories);

  $('categoryForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!root && !githubToken) {
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

  $('cancelProjectEdit').addEventListener('click', () => {
    resetProjectForm();
    render();
    say('Anulowano edycję. Żadna zmiana nie została opublikowana.');
  });

  $('projectForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!root && !githubToken) {
      say('Najpierw wybierz folder projektu.', 'error');
      showToast('Najpierw podłącz folder projektu.', 'error');
      return;
    }

    const type = $('projectType').value;
    const selectedCategories = selectedProjectCategoryIds();
    if (!selectedCategories.length) {
      say('Zaznacz co najmniej jedną kategorię dla tej realizacji.', 'error');
      showToast('Zaznacz co najmniej jedną kategorię.', 'error');
      return;
    }

    const media = $('projectMedia').files[0];
    const thumbnail = $('projectThumbnail').files[0];
    if ((media && media.size > 100 * 1024 * 1024) ||
        (thumbnail && thumbnail.size > 100 * 1024 * 1024)) {
      say('Jeden z wybranych plików przekracza 100 MB. Zmniejsz go przed dodaniem.', 'error');
      showToast('Plik przekracza limit 100 MB.', 'error');
      return;
    }

    const previous = cloneData();
    const previousStagedCount = stagedFiles.length;
    const wasEditing = Boolean(editingProjectId);
    try {
      const existing = wasEditing
        ? data.projects.find(item => item.id === editingProjectId)
        : null;
      if (wasEditing && !existing) {
        throw new Error('Nie znaleziono edytowanej pracy. Odśwież panel i spróbuj ponownie.');
      }

      const title = {
        pl: $('projectTitlePl').value.trim(),
        en: $('projectTitleEn').value.trim()
      };
      const project = existing ? {
        ...existing,
        type: type,
        category: selectedCategories[0],
        categories: selectedCategories,
        title: title,
        description: {
          pl: $('projectDescPl').value.trim(),
          en: $('projectDescEn').value.trim()
        },
        year: $('projectYear').value.trim()
      } : {
        id: window.crypto && crypto.randomUUID ? crypto.randomUUID() :
          'project-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
        type: type,
        category: selectedCategories[0],
        categories: selectedCategories,
        title: title,
        description: {
          pl: $('projectDescPl').value.trim(),
          en: $('projectDescEn').value.trim()
        },
        year: $('projectYear').value.trim()
      };

      const prefix = title.pl || title.en || 'project';
      if (media) {
        const path = await saveFile(media, prefix);
        if (media.type.startsWith('video/')) {
          project.video = path;
        } else {
          project.image = path;
          delete project.video;
        }
      }
      if (thumbnail) project.image = await saveFile(thumbnail, prefix + '-thumbnail');

      if (existing) {
        const index = data.projects.findIndex(item => item.id === existing.id);
        data.projects[index] = project;
      } else {
        data.projects.unshift(project);
        pendingNewProjectId = project.id;
      }

      const saved = await saveData(wasEditing ? 'zaktualizowano projekt' : 'dodano projekt');
      if (saved) {
        pendingNewProjectId = null;
        resetProjectForm();
        render();
        say(wasEditing ? 'Zapisano i opublikowano zmiany pracy.' : 'Dodano i opublikowano nową pracę.', 'ok');
      } else {
        pendingNewProjectId = null;
        data = previous;
        stagedFiles.splice(previousStagedCount);
        render();
      }
    } catch (error) {
      pendingNewProjectId = null;
      data = previous;
      stagedFiles.splice(previousStagedCount);
      render();
      console.error(error);
      say('Nie udało się zapisać pracy: ' + error.message, 'error');
      showToast('Nie udało się zapisać pracy.', 'error');
    }
  });

  async function deleteProject(id) {
    if (!root && !githubToken) {
      say('Najpierw wybierz folder projektu.', 'error');
      return;
    }
    const project = data.projects.find(item => item.id === id);
    if (editingProjectId === id) resetProjectForm();
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
    if (!root && !githubToken) {
      say('Najpierw wybierz folder projektu.', 'error');
      return;
    }
    const cat = data.categories[type].find(item => item.id === id);
    if (!cat) return;
    const affected = data.projects.filter(project =>
      project.type === type && projectCategoryIds(project).includes(id)
    );
    const removedCompletely = affected.filter(project =>
      projectCategoryIds(project).filter(categoryId => categoryId !== id).length === 0
    ).length;
    if (!confirm('Usunąć kategorię „' + txt(cat.title) + '”? Zostanie ona odpięta od ' +
        affected.length + ' realizacji, a całkowicie usuniętych zostanie ' + removedCompletely +
        '. Pozostałe przypisania kategorii zostaną zachowane. Pliki multimedialne pozostaną w folderze.')) return;

    const previous = cloneData();
    data.categories[type] = data.categories[type].filter(item => item.id !== id);
    data.projects = data.projects.flatMap(project => {
      if (project.type !== type) return [project];
      const remaining = projectCategoryIds(project).filter(categoryId => categoryId !== id);
      if (!remaining.length) return [];
      return [{ ...project, categories: remaining, category: remaining[0] }];
    });
    const saved = await saveData('usunięto kategorię');
    if (!saved) {
      data = previous;
      render();
    }
  }

  render();
  loadPublishedData();
})();