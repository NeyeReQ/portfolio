(function(){
  const translations={
    pl:{
      navHome:'Start',navAbout:'Kim jestem?',navTools:'W czym pracuję?',navWork:'Moje prace',navContact:'Kontakt',headerCta:'Zobacz portfolio',
      heroEyebrow:'Niezależny twórca wizualny',heroLine1:'Twórca',heroLine2:'z',heroLine3:'Pasją',heroDescription:'Projektuję grafiki, które przyciągają uwagę, i montuję filmy, które zatrzymują ją na dłużej. Łączę estetykę z pomysłem, dbając o każdy detal.',heroButton:'Poznaj moje prace',heroSecondary:'Dowiedz się więcej',heroStatus:'Grafika komputerowa & montaż wideo',scrollLabel:'PRZEWIŃ, ABY POZNAĆ WIĘCEJ',heroBottomNote:'Każdy projekt zaczyna się od pomysłu.',
      aboutEyebrow:'Kilka słów o mnie',aboutTitle:'Kim jestem',aboutSide:'Kreatywność spotyka\nsię z precyzją.',aboutBody:'Nazywam się NeyeR. Od kilku lat zajmuję się projektowaniem grafiki komputerowej oraz montażem materiałów wideo. W swojej pracy łączę kreatywne podejście z dbałością o detale i spójność wizualną. Ukończyłem technikum na kierunku technik grafiki i poligrafii cyfrowej. Posiadam certyfikaty potwierdzające kwalifikacje PGF.04 i PGF.05, uzyskane po zdaniu egzaminów zawodowych, a także dyplom zawodowy w tym kierunku. Posługuję się językiem angielskim na poziomie średnio zaawansowanym.',
      credential1:'Przygotowywanie oraz wykonywanie prac graficznych i publikacji cyfrowych. Obejmuje opracowywanie materiałów graficznych, przygotowanie ich do druku oraz publikacji elektronicznych.',credential2:'Drukowanie cyfrowe i obróbka druków. Obejmuje przygotowanie, realizację i kontrolę procesów drukowania cyfrowego oraz obróbkę wydrukowanych materiałów.',diplomaTitle:'DYPLOM ZAWODOWY',credential3:'Potwierdza uzyskanie kwalifikacji w zawodzie technik grafiki i poligrafii cyfrowej.',credentialsSource:'Oficjalny opis kwalifikacji ↗',diplomaBadge:'DOKUMENT POTWIERDZAJĄCY KWALIFIKACJE',englishLabel:'Język angielski',englishLevel:'Poziom średnio zaawansowany',languageScale:'POZIOM',
      toolsEyebrow:'Mój zestaw narzędzi',toolsTitle:'W czym',toolsTitleAccent:'pracuję',toolsIntro:'Programy, w których projektuję, montuję i tworzę wizualizacje.',toolBlenderDesc:'Modelowanie, materiały i wizualizacje 3D.',toolPhotoshopDesc:'Retusz, fotomontaż i grafika rastrowa.',toolIllustratorDesc:'Grafika wektorowa, logotypy i ilustracje.',toolPremiereDesc:'Montaż materiałów wideo, kolor i dźwięk.',toolAfterEffectsDesc:'Animacja, efekty wizualne i compositing.',
      workEyebrow:'Wybrane obszary twórczości',workTitle:'Moje',workTitleAccent:'prace',workIntro:'Wybierz obszar twórczości i przejdź do osobnej galerii z kategoriami.',graphics:'Grafika',video:'Montaż',graphicsSub:'Projektowanie, kompozycja, identyfikacja wizualna',videoSub:'Montaż wideo, animacja i opowiadanie obrazem',
      contactEyebrow:'Porozmawiajmy o projekcie',contactTitle:'Kontakt',contactIntro:'Masz pomysł na grafikę lub materiał wideo? Napisz do mnie.',emailLabel:'Adres e-mail',contactHint:'Kliknij wybraną pozycję, aby skopiować dane kontaktowe.',copyEmail:'Skopiowano adres e-mail.',copyDiscord:'Skopiowano nazwę użytkownika Discord.',copyError:'Nie udało się skopiować. Zaznacz i skopiuj tekst ręcznie.',footerStatement:'Dobre projekty zostają w pamięci.',backTop:'Wróć na górę',rights:'WSZELKIE PRAWA ZASTRZEŻONE.',copyrightNotice:'Projekty ukazane na stronie objęte są prawami autorskimi i nie zezwalam na wykorzystywanie ich we wszelkich projektach.',
      filterLabel:'WYBIERZ KATEGORIĘ',pageGraphics:'Grafika',pageEditing:'Montaż',pageIntroGraphics:'Projekty graficzne — od koncepcji i kompozycji po gotowe materiały wizualne.',pageIntroEditing:'Materiały wideo, animacje i montaż — zobacz wybrane realizacje.',backToWork:'Wróć do portfolio',allCategories:'Wszystkie',emptyTitle:'Ta galeria czeka na Twoje realizacje',emptyText:'W tej kategorii nie ma jeszcze opublikowanych prac.',projectOpen:'Otwórz projekt',noMedia:'Podgląd wkrótce',videoPlay:'Odtwórz materiał',
      categoryNames:{'3d':'Grafika 3D',banner:'Banery',overlay:'Overlay',avatars:'Awatary',thumbnails:'Miniaturki i plakaty',header:'Nagłówki',photo:'Przeróbka zdjęcia na ilustrację',logo:'Logo',episodes:'Odcinki',inserts:'Wstawki',animations:'Animacje',transitions:'Przejścia'},categoryDescriptions:{'3d':'Modele, sceny i wizualizacje 3D',banner:'Banery i grafiki promocyjne',overlay:'Oprawa streamów i transmisji',avatars:'Awatary i zdjęcia profilowe',thumbnails:'Miniatury wideo i plakaty',header:'Grafiki nagłówkowe i grafiki w tle',photo:'Artystyczne transformacje fotografii',logo:'Znaki graficzne i identyfikacja',episodes:'Montaż pełnych materiałów wideo',inserts:'Krótkie wstawki i segmenty',animations:'Animacje i motion design',transitions:'Przejścia i efekty montażowe'}
    },
    en:{
      navHome:'Home',navAbout:'About me',navTools:'Software',navWork:'My work',navContact:'Contact',headerCta:'View portfolio',
      heroEyebrow:'Independent visual creator',heroLine1:'Creator',heroLine2:'with',heroLine3:'Passion',heroDescription:'I create graphics that draw attention and edit videos that keep viewers engaged. I combine aesthetics with ideas, paying attention to every detail.',heroButton:'Explore my work',heroSecondary:'Discover more',heroStatus:'Graphic design & video editing',scrollLabel:'SCROLL TO DISCOVER MORE',heroBottomNote:'Every project starts with an idea.',
      aboutEyebrow:'A few words about me',aboutTitle:'Who am I',aboutSide:'Where creativity meets\nprecision.',aboutBody:'My name is NeyeR. I have been working in computer graphic design and video editing for several years, combining a creative approach with attention to detail and visual consistency. I graduated from a technical secondary school with a specialisation in Digital Graphics and Printing. My professional qualifications are confirmed by the PGF.04 and PGF.05 certificates, obtained after passing the relevant vocational examinations, as well as a diploma in this field. I have an intermediate level of English.',
      credential1:'Preparing and producing graphic work and digital publications. This includes developing graphic assets and preparing them for print and digital publishing.',credential2:'Digital printing and print finishing. This qualification covers the preparation, execution and control of digital printing processes and the finishing of printed materials.',diplomaTitle:'VOCATIONAL DIPLOMA',credential3:'Confirms vocational qualifications as a Digital Graphics and Printing Technician.',credentialsSource:'Official qualification overview ↗',diplomaBadge:'OFFICIAL VOCATIONAL QUALIFICATION',englishLabel:'English language',englishLevel:'Intermediate level',languageScale:'LEVEL',
      toolsEyebrow:'Creative toolkit',toolsTitle:'Software',toolsTitleAccent:'I use',toolsIntro:'The tools I use to design, edit and bring visual ideas to life.',toolBlenderDesc:'3D modeling, materials and visualisation.',toolPhotoshopDesc:'Retouching, compositing and raster graphics.',toolIllustratorDesc:'Vector graphics, logos and illustrations.',toolPremiereDesc:'Video editing, colour grading and sound.',toolAfterEffectsDesc:'Animation, visual effects and compositing.',
      workEyebrow:'Selected creative disciplines',workTitle:'My',workTitleAccent:'work',workIntro:'Choose a creative discipline to open its dedicated gallery and browse its categories.',graphics:'Graphics',video:'Video Editing',graphicsSub:'Design, composition and visual identity',videoSub:'Video editing, animation and visual storytelling',
      contactEyebrow:'Let’s discuss your project',contactTitle:'Contact',contactIntro:'Have an idea for a graphic or video? Get in touch.',emailLabel:'Email address',contactHint:'Click an item to copy the contact details.',copyEmail:'Email address copied.',copyDiscord:'Discord username copied.',copyError:'Could not copy. Please select and copy the text manually.',footerStatement:'Great work stays with you.',backTop:'Back to top',rights:'ALL RIGHTS RESERVED.',copyrightNotice:'Projects displayed on this website are protected by copyright. Their use in any other project is not permitted.',
      filterLabel:'CHOOSE A CATEGORY',pageGraphics:'Graphics',pageEditing:'Video Editing',pageIntroGraphics:'Graphic design projects — from concepts and composition to finished visual assets.',pageIntroEditing:'Video, animation and editing — explore selected projects.',backToWork:'Back to portfolio',allCategories:'All',emptyTitle:'This gallery is waiting for your work',emptyText:'There are no published projects in this category yet.',projectOpen:'Open project',noMedia:'Preview coming soon',videoPlay:'Play video',
      categoryNames:{'3d':'3D Graphics',banner:'Banners',overlay:'Overlays',avatars:'Avatars',thumbnails:'Thumbnails & Posters',header:'Headers',photo:'Photo to Illustration',logo:'Logos',episodes:'Episodes',inserts:'Video Inserts',animations:'Animations',transitions:'Transitions'},categoryDescriptions:{'3d':'3D models, scenes and visualisations',banner:'Promotional banners and graphics',overlay:'Stream and broadcast visual packages',avatars:'Avatars and profile pictures',thumbnails:'Video thumbnails and posters',header:'Header graphics and background artwork',photo:'Artistic photo transformations',logo:'Graphic marks and visual identity',episodes:'Full-length video editing',inserts:'Short inserts and video segments',animations:'Animation and motion design',transitions:'Transitions and editing effects'}
    }
  };
  let lang='pl';
  try{lang=localStorage.getItem('neyer-language')==='en'?'en':'pl';}catch(_){ }
  const $=(s,p=document)=>p.querySelector(s), queryAll=(s,p=document)=>[...p.querySelectorAll(s)];

  // Consistent, soft UI ticks for every interactive control and hoverable card.
  const soundableSelector=[
    'a[href]','button:not(:disabled)','input:not(:disabled)','select:not(:disabled)',
    'textarea:not(:disabled)','summary','[role="button"]','[role="link"]','[role="tab"]',
    '[tabindex]:not([tabindex="-1"])','.credential-card','.tool-card','.portfolio-choice',
    '.contact-card','.project-card','.gallery-card','.main-tab','.subtab','.gallery-filter'
  ].join(',');
  const metalSurfaceSelector=[
    'a[href]:not(.brand)','button:not(:disabled)','summary','[role="button"]','[role="link"]','[role="tab"]',
    '.credential-card','.tool-card','.contact-card','.project-card',
    '.gallery-card','.main-tab','.subtab','.gallery-filter'
  ].join(',');
  let uiAudioContext=null;
  let uiNoiseBuffer=null;
  let uiMasterGain=null;
  const lastHoverByTarget=new WeakMap();

  function getUiNoiseBuffer(context){
    if(uiNoiseBuffer)return uiNoiseBuffer;
    const length=Math.ceil(context.sampleRate*.08);
    const buffer=context.createBuffer(1,length,context.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<length;i++){
      const fade=1-(i/length);
      data[i]=(Math.random()*2-1)*fade;
    }
    uiNoiseBuffer=buffer;
    return buffer;
  }

  function playUiSound(kind){
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    if(!uiAudioContext){
      try{uiAudioContext=new AudioContextClass();}catch(_){return;}
    }
    const context=uiAudioContext;
    const play=()=>{
      if(context.state!=='running')return;
      if(!uiMasterGain){
        uiMasterGain=context.createGain();
        uiMasterGain.gain.value=.82;
        uiMasterGain.connect(context.destination);
      }
      const now=context.currentTime;
      const hover=kind==='hover';
      const duration=hover ? .052 : .067;

      // Identical peak levels for hover and click; pitch and decay provide the distinction.
      const tone=context.createOscillator();
      const toneEnvelope=context.createGain();
      const toneFilter=context.createBiquadFilter();
      tone.type='triangle';
      tone.frequency.setValueAtTime(hover ? 1080 : 900,now);
      tone.frequency.exponentialRampToValueAtTime(hover ? 790 : 610,now+duration);
      toneFilter.type='lowpass';
      toneFilter.frequency.setValueAtTime(2600,now);
      toneFilter.Q.setValueAtTime(.55,now);
      toneEnvelope.gain.setValueAtTime(.0001,now);
      toneEnvelope.gain.exponentialRampToValueAtTime(.022,now+.003);
      toneEnvelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
      tone.connect(toneFilter);
      toneFilter.connect(toneEnvelope);
      toneEnvelope.connect(uiMasterGain);
      tone.start(now);
      tone.stop(now+duration+.012);

      // A tiny filtered transient adds a familiar tactile button tick.
      const noise=context.createBufferSource();
      const noiseFilter=context.createBiquadFilter();
      const noiseEnvelope=context.createGain();
      noise.buffer=getUiNoiseBuffer(context);
      noiseFilter.type='bandpass';
      noiseFilter.frequency.setValueAtTime(hover ? 1750 : 1420,now);
      noiseFilter.Q.setValueAtTime(.9,now);
      noiseEnvelope.gain.setValueAtTime(.0001,now);
      noiseEnvelope.gain.exponentialRampToValueAtTime(.0105,now+.002);
      noiseEnvelope.gain.exponentialRampToValueAtTime(.0001,now+(hover ? .021 : .028));
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseEnvelope);
      noiseEnvelope.connect(uiMasterGain);
      noise.start(now);
      noise.stop(now+.035);
    };
    if(context.state==='suspended'){
      context.resume().then(play).catch(()=>{});
    }else{
      play();
    }
  }

  // Add one shared silver light-sweep layer to static and dynamically-created surfaces.
  function decorateMetalSurface(element){
    if(!(element instanceof Element)||!element.matches(metalSurfaceSelector))return;
    element.classList.add('ui-metal-hover');
    const hasSheen=Array.from(element.children).some(child=>child.classList.contains('ui-metal-sheen'));
    if(!hasSheen){
      const sheen=document.createElement('span');
      sheen.className='ui-metal-sheen';
      sheen.setAttribute('aria-hidden','true');
      element.append(sheen);
    }
  }
  function decorateMetalSurfaces(root){
    if(!(root instanceof Element||root instanceof Document))return;
    decorateMetalSurface(root);
    root.querySelectorAll(metalSurfaceSelector).forEach(decorateMetalSurface);
  }
  decorateMetalSurfaces(document.body);
  if('MutationObserver'in window&&document.body){
    const surfaceObserver=new MutationObserver(records=>{
      records.forEach(record=>record.addedNodes.forEach(node=>{
        if(node instanceof Element)decorateMetalSurfaces(node);
      }));
    });
    surfaceObserver.observe(document.body,{childList:true,subtree:true});
  }

  document.addEventListener('pointerover',event=>{
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(!target||(event.relatedTarget instanceof Node&&target.contains(event.relatedTarget)))return;
    const now=Date.now();
    const previous=lastHoverByTarget.get(target)||0;
    if(now-previous<100)return;
    lastHoverByTarget.set(target,now);
    playUiSound('hover');
  },true);

  // Play on primary-pointer press so navigation does not cut off the click sound.
  document.addEventListener('pointerdown',event=>{
    if(event.button!==0||!event.isPrimary)return;
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(target)playUiSound('click');
  },true);

  // Keyboard activation does not produce pointerdown.
  document.addEventListener('click',event=>{
    if(event.detail!==0)return;
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(target)playUiSound('click');
  },true);

  const typewriterSelector=[
    '.hero-title','.hero-description','.hero .eyebrow [data-i18n]',
    '.section-heading h2','.section-heading .eyebrow [data-i18n]','.section-side-note',
    '.about-layout-single .about-paragraph','.credential-label','.language-label','.language-value',
    '.work-intro','.tool-card-copy p','.choice-bottom small','.contact-hint',
    '.subpage-heading h1','.subpage-heading p','.subpage-heading .eyebrow [data-i18n]',
    '.back-link [data-i18n]','.project-card-body strong',
    '.project-card-body>span:not(.project-card-cta)',
    '.project-empty h2','.project-empty p',
    '.case-title','.case-section-heading h2','.case-gallery-heading h2',
    '.case-related-topline h2','.case-editorial-copy h2','#storyTitle',
    '.case-project-description','.case-editorial-copy p',
    '.case-section-aside','.case-gallery-heading>p','.case-related-topline>p',
    '.case-facts-heading','.case-story-label','.case-section-kicker',
    '.case-fact-copy dt','.case-fact-copy dd',
    '.case-related-empty strong','.case-related-empty p',
    '.case-gallery-item figcaption'
  ].join(',');

  function refreshTypewriterTargets(root=document){
    const elements=[];
    if(root instanceof Element && root.matches(typewriterSelector))elements.push(root);
    elements.push(...queryAll(typewriterSelector,root));
    elements.forEach(element=>{
      element.querySelectorAll('.typewriter-char').forEach(span=>{
        span.replaceWith(document.createTextNode(span.textContent||''));
      });
      element.normalize();

      const totalCharacters=Array.from(element.textContent||'').filter(character=>character.trim()!=='').length;
      element.classList.remove('typewriter-target');

      // Long paragraphs are revealed as one block. Per-letter spans are reserved
      // for concise copy so a long page does not create thousands of animated nodes.
      if(!totalCharacters || totalCharacters>110) return;

      const characterInterval=Math.min(12,850/totalCharacters);
      let characterIndex=0;
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      const textNodes=[];
      while(walker.nextNode())textNodes.push(walker.currentNode);
      textNodes.forEach(node=>{
        let accentLetterIndex=0;
        const value=node.nodeValue||'';
        if(!value.trim())return;
        const fragment=document.createDocumentFragment();
        for(const character of value){
          if(character.trim()===''){
            fragment.append(document.createTextNode(character));
          }else{
            const span=document.createElement('span');
            span.className='typewriter-char';
            const accent=node.parentElement?.closest('.title-accent');
            if(accent){
              const shades=['#a5f4e8','#93eee2','#78e7dc','#84dfe2','#91d5eb','#a0c9f5','#b2b7ff'];
              span.style.setProperty('--letter-accent',shades[accentLetterIndex%shades.length]);
              accentLetterIndex++;
            }
            span.textContent=character;
            span.style.animationDelay=(characterIndex*characterInterval).toFixed(0)+'ms';
            characterIndex++;
            fragment.append(span);
          }
        }
        node.parentNode?.replaceChild(fragment,node);
      });
      element.classList.add('typewriter-target');
    });
  }
  document.addEventListener('neyer:language',()=>refreshTypewriterTargets());

  function observeRevealTargets(root=document){
    const selector='.reveal,.case-reveal';
    const targets=[];
    if(root instanceof Element && root.matches(selector))targets.push(root);
    targets.push(...queryAll(selector,root));
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion || !('IntersectionObserver' in window)){
      targets.forEach(element=>element.classList.add('is-visible'));
      return;
    }
    if(!window.__neyerRevealObserver){
      window.__neyerRevealObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting)entry.target.classList.add('is-visible');
          else entry.target.classList.remove('is-visible');
        });
      },{threshold:0,rootMargin:'10% 0px 10% 0px'});
    }
    targets.forEach(element=>{
      if(element.dataset.revealObserved==='true')return;
      element.dataset.revealObserved='true';
      if(element.classList.contains('reveal')){
        if(element.dataset.delay)element.style.setProperty('--delay',element.dataset.delay+'ms');
        element.classList.add('reveal-pending');
      }
      window.__neyerRevealObserver.observe(element);
    });
  }

  function applyLanguage(){
    const t=translations[lang]||translations.pl;
    document.documentElement.lang=lang;
    const pageType=document.body?.dataset.portfolioType;
    const title=$('title');
    if(title && !document.body?.hasAttribute('data-project-page')){
      title.textContent=pageType
        ? 'NeyeR — '+(pageType==='graphics'?t.pageGraphics:t.pageEditing)
        : 'NeyeR — Visual Designer & Video Editor';
    }
    queryAll('[data-i18n]').forEach(element=>{
      const key=element.dataset.i18n;
      if(Object.prototype.hasOwnProperty.call(t,key))element.textContent=t[key];
    });
    const side=$('.section-side-note');
    if(side)side.innerHTML=String(t.aboutSide||'').split(String.fromCharCode(10)).join('<br>');
    queryAll('.lang-switch').forEach(button=>{
      button.querySelectorAll('.lang-option').forEach(option=>option.classList.toggle('selected',option.dataset.lang===lang));
      button.setAttribute('aria-label',lang==='pl'?'Switch language to English':'Przełącz język na polski');
      button.setAttribute('aria-pressed',String(lang==='en'));
    });
    const mainNav=$('#mainNav');
    if(mainNav)mainNav.setAttribute('aria-label',lang==='pl'?'Główna nawigacja':'Main navigation');
    const menuToggle=$('#menuToggle');
    if(menuToggle)menuToggle.setAttribute('aria-label',lang==='pl'?'Otwórz menu':'Open menu');
    document.dispatchEvent(new CustomEvent('neyer:language',{detail:{lang,translations:t}}));
  }

  queryAll('.lang-switch').forEach(button=>button.addEventListener('click',()=>{
    lang=lang==='pl'?'en':'pl';
    try{localStorage.setItem('neyer-language',lang);}catch(_){}
    applyLanguage();
  }));
  const menu=$('#menuToggle');
  const nav=$('#mainNav');
  if(menu&&nav){
    menu.addEventListener('click',()=>{
      const open=menu.getAttribute('aria-expanded')!=='true';
      menu.setAttribute('aria-expanded',String(open));
      nav.classList.toggle('open',open);
      document.body.classList.toggle('menu-open',open);
    });
    queryAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      document.body.classList.remove('menu-open');
    }));
  }

  applyLanguage();
  window.NeyeR={
    get lang(){return lang;},
    get translations(){return translations;},
    applyLanguage,
    refreshTypewriterTargets,
    observeRevealTargets
  };
  ['#about .credential-card','#tools .tool-card','#contact .contact-card'].forEach(selector=>{
    queryAll(selector).forEach((el,index)=>{
      if(!el.classList.contains('reveal'))el.classList.add('reveal');
      if(!el.dataset.delay)el.dataset.delay=String(65+index*105);
    });
  });
  observeRevealTargets(document);
  const progress=$('#scrollProgress');if(progress)window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?window.scrollY/max*100:0}%`;},{passive:true});
  // The footer control should always return to the document's true top,
  // rather than relying on anchor alignment around the sticky header.
  queryAll('.back-top').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  }));
  const year=$('#year');if(year)year.textContent=new Date().getFullYear();
  async function copy(value){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true;}}catch(_){ }try{const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();return ok;}catch(_){return false;}}
  let toastTimer;function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
  queryAll('.contact-card').forEach(btn=>btn.addEventListener('click',async()=>{const ok=await copy(btn.dataset.copy);const t=translations[lang];toast(ok?(btn.dataset.copyKind==='email'?t.copyEmail:t.copyDiscord):t.copyError);}));
  const sections=queryAll('main section[id]');if(sections.length&&'IntersectionObserver'in window){const navIO=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){queryAll('.nav-link').forEach(link=>{const href=link.getAttribute('href');if(href&&href.startsWith('#'))link.classList.toggle('active',href===`#${entry.target.id}`);});}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>navIO.observe(s));}
})();
