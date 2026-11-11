(function(){
  const translations={
    pl:{
      navHome:'Start',navAbout:'Kim jestem?',navWork:'Moje prace',navContact:'Kontakt',headerCta:'Zobacz portfolio',
      heroEyebrow:'Niezależny twórca wizualny',heroLine1:'Twórca',heroLine2:'z',heroLine3:'Pasją',heroDescription:'Projektuję grafiki, które przyciągają uwagę, i montuję filmy, które zatrzymują ją na dłużej. Łączę estetykę z pomysłem, dbając o każdy detal.',heroButton:'Poznaj moje prace',heroSecondary:'Dowiedz się więcej',heroStatus:'Grafika komputerowa & montaż wideo',scrollLabel:'PRZEWIŃ, ABY POZNAĆ WIĘCEJ',heroBottomNote:'Każdy projekt zaczyna się od pomysłu.',
      aboutEyebrow:'Kilka słów o mnie',aboutTitle:'Kim jestem',aboutSide:'Kreatywność spotyka\nsię z precyzją.',aboutBody:'Nazywam się NeyeR. Od kilku lat zajmuję się projektowaniem grafiki komputerowej oraz montażem materiałów wideo. W swojej pracy łączę kreatywne podejście z dbałością o detale i spójność wizualną. Ukończyłem technikum na kierunku technik grafiki i poligrafii cyfrowej. Posiadam certyfikaty potwierdzające kwalifikacje PGF.04 i PGF.05, uzyskane po zdaniu egzaminów zawodowych, a także dyplom zawodowy w tym kierunku. Posługuję się językiem angielskim na poziomie średnio zaawansowanym.',
      credential1:'Przygotowywanie oraz wykonywanie prac graficznych i publikacji cyfrowych. Obejmuje opracowywanie materiałów graficznych, przygotowanie ich do druku oraz publikacji elektronicznych.',credential2:'Drukowanie cyfrowe i obróbka druków. Obejmuje przygotowanie, realizację i kontrolę procesów drukowania cyfrowego oraz obróbkę wydrukowanych materiałów.',diplomaTitle:'DYPLOM ZAWODOWY',credential3:'Potwierdza uzyskanie kwalifikacji w zawodzie technik grafiki i poligrafii cyfrowej.',credentialsSource:'Oficjalny opis kwalifikacji ↗',englishLabel:'Język angielski',englishLevel:'Poziom średnio zaawansowany',
      workEyebrow:'Wybrane obszary twórczości',workTitle:'Moje',workTitleAccent:'prace',workIntro:'Wybierz obszar twórczości i przejdź do osobnej galerii z kategoriami.',graphics:'Grafika',video:'Montaż',graphicsSub:'Projektowanie, kompozycja, identyfikacja wizualna',videoSub:'Montaż wideo, animacja i opowiadanie obrazem',
      contactEyebrow:'Porozmawiajmy o projekcie',contactTitle:'Kontakt',contactIntro:'Masz pomysł na grafikę lub materiał wideo? Napisz do mnie.',emailLabel:'Adres e-mail',contactHint:'Kliknij wybraną pozycję, aby skopiować dane kontaktowe.',copyEmail:'Skopiowano adres e-mail.',copyDiscord:'Skopiowano nazwę użytkownika Discord.',copyError:'Nie udało się skopiować. Zaznacz i skopiuj tekst ręcznie.',footerStatement:'Dobre projekty zostają w pamięci.',backTop:'Wróć na górę',rights:'WSZELKIE PRAWA ZASTRZEŻONE.',copyrightNotice:'Projekty ukazane na stronie objęte są prawami autorskimi i nie zezwalam na wykorzystywanie ich we wszelkich projektach.',
      filterLabel:'WYBIERZ KATEGORIĘ',pageGraphics:'Grafika',pageEditing:'Montaż',pageIntroGraphics:'Projekty graficzne — od koncepcji i kompozycji po gotowe materiały wizualne.',pageIntroEditing:'Materiały wideo, animacje i montaż — zobacz wybrane realizacje.',backToWork:'Wróć do portfolio',allCategories:'Wszystkie',emptyTitle:'Ta galeria czeka na Twoje realizacje',emptyText:'W tej kategorii nie ma jeszcze opublikowanych prac.',projectOpen:'Otwórz projekt',noMedia:'Podgląd wkrótce',videoPlay:'Odtwórz materiał',
      categoryNames:{'3d':'Grafika 3D',banner:'Banery',overlay:'Overlay',avatars:'Awatary',thumbnails:'Miniaturki i plakaty',header:'Nagłówki',photo:'Przeróbka zdjęcia na ilustrację',logo:'Logo',episodes:'Odcinki',inserts:'Wstawki',animations:'Animacje',transitions:'Przejścia'},categoryDescriptions:{'3d':'Modele, sceny i wizualizacje 3D',banner:'Banery i grafiki promocyjne',overlay:'Oprawa streamów i transmisji',avatars:'Awatary i zdjęcia profilowe',thumbnails:'Miniatury wideo i plakaty',header:'Grafiki nagłówkowe i grafiki w tle',photo:'Artystyczne transformacje fotografii',logo:'Znaki graficzne i identyfikacja',episodes:'Montaż pełnych materiałów wideo',inserts:'Krótkie wstawki i segmenty',animations:'Animacje i motion design',transitions:'Przejścia i efekty montażowe'}
    },
    en:{
      navHome:'Home',navAbout:'About me',navWork:'My work',navContact:'Contact',headerCta:'View portfolio',
      heroEyebrow:'Independent visual creator',heroLine1:'Creator',heroLine2:'with',heroLine3:'Passion',heroDescription:'I create graphics that draw attention and edit videos that keep viewers engaged. I combine aesthetics with ideas, paying attention to every detail.',heroButton:'Explore my work',heroSecondary:'Discover more',heroStatus:'Graphic design & video editing',scrollLabel:'SCROLL TO DISCOVER MORE',heroBottomNote:'Every project starts with an idea.',
      aboutEyebrow:'A few words about me',aboutTitle:'Who am I',aboutSide:'Where creativity meets\nprecision.',aboutBody:'My name is NeyeR. I have been working in computer graphic design and video editing for several years, combining a creative approach with attention to detail and visual consistency. I graduated from a technical secondary school with a specialisation in Digital Graphics and Printing. My professional qualifications are confirmed by the PGF.04 and PGF.05 certificates, obtained after passing the relevant vocational examinations, as well as a diploma in this field. I have an intermediate level of English.',
      credential1:'Preparing and producing graphic work and digital publications. This includes developing graphic assets and preparing them for print and digital publishing.',credential2:'Digital printing and print finishing. This qualification covers the preparation, execution and control of digital printing processes and the finishing of printed materials.',diplomaTitle:'VOCATIONAL DIPLOMA',credential3:'Confirms vocational qualifications as a Digital Graphics and Printing Technician.',credentialsSource:'Official qualification overview ↗',englishLabel:'English language',englishLevel:'Intermediate level',
      workEyebrow:'Selected creative disciplines',workTitle:'My',workTitleAccent:'work',workIntro:'Choose a creative discipline to open its dedicated gallery and browse its categories.',graphics:'Graphics',video:'Video Editing',graphicsSub:'Design, composition and visual identity',videoSub:'Video editing, animation and visual storytelling',
      contactEyebrow:'Let’s discuss your project',contactTitle:'Contact',contactIntro:'Have an idea for a graphic or video? Get in touch.',emailLabel:'Email address',contactHint:'Click an item to copy the contact details.',copyEmail:'Email address copied.',copyDiscord:'Discord username copied.',copyError:'Could not copy. Please select and copy the text manually.',footerStatement:'Great work stays with you.',backTop:'Back to top',rights:'ALL RIGHTS RESERVED.',copyrightNotice:'Projects displayed on this website are protected by copyright. Their use in any other project is not permitted.',
      filterLabel:'CHOOSE A CATEGORY',pageGraphics:'Graphics',pageEditing:'Video Editing',pageIntroGraphics:'Graphic design projects — from concepts and composition to finished visual assets.',pageIntroEditing:'Video, animation and editing — explore selected projects.',backToWork:'Back to portfolio',allCategories:'All',emptyTitle:'This gallery is waiting for your work',emptyText:'There are no published projects in this category yet.',projectOpen:'Open project',noMedia:'Preview coming soon',videoPlay:'Play video',
      categoryNames:{'3d':'3D Graphics',banner:'Banners',overlay:'Overlays',avatars:'Avatars',thumbnails:'Thumbnails & Posters',header:'Headers',photo:'Photo to Illustration',logo:'Logos',episodes:'Episodes',inserts:'Video Inserts',animations:'Animations',transitions:'Transitions'},categoryDescriptions:{'3d':'3D models, scenes and visualisations',banner:'Promotional banners and graphics',overlay:'Stream and broadcast visual packages',avatars:'Avatars and profile pictures',thumbnails:'Video thumbnails and posters',header:'Header graphics and background artwork',photo:'Artistic photo transformations',logo:'Graphic marks and visual identity',episodes:'Full-length video editing',inserts:'Short inserts and video segments',animations:'Animation and motion design',transitions:'Transitions and editing effects'}
    }
  };
  let lang='pl';
  try{lang=localStorage.getItem('neyer-language')==='en'?'en':'pl';}catch(_){ }
  const $=(s,p=document)=>p.querySelector(s), queryAll=(s,p=document)=>[...p.querySelectorAll(s)];

  // Warm, rounded UI sounds generated locally with Web Audio.
  const soundableSelector='a[href],button:not(:disabled),[role="button"]';
  let uiAudioContext=null;
  let lastHoverSoundAt=0;

  function playUiSound(kind){
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    if(!uiAudioContext){
      try{uiAudioContext=new AudioContextClass();}catch(_){return;}
    }

    const context=uiAudioContext;
    const play=()=>{
      if(context.state!=='running')return;
      const now=context.currentTime;
      const isHover=kind==='hover';
      // Lower, warmer intervals replace the thin high-pitched beeps.
      const notes=isHover
        ? [{frequency:523.25,level:.024,duration:.16,delay:0},{frequency:659.25,level:.014,duration:.19,delay:.045}]
        : [{frequency:392.00,level:.040,duration:.22,delay:0},{frequency:493.88,level:.027,duration:.24,delay:.018},{frequency:587.33,level:.018,duration:.20,delay:.036}];

      notes.forEach(note=>{
        const start=now+note.delay;
        const oscillator=context.createOscillator();
        const envelope=context.createGain();
        oscillator.type='sine';
        oscillator.frequency.setValueAtTime(note.frequency*1.012,start);
        oscillator.frequency.exponentialRampToValueAtTime(note.frequency,start+.075);
        envelope.gain.setValueAtTime(.0001,start);
        envelope.gain.exponentialRampToValueAtTime(note.level,start+.012);
        envelope.gain.exponentialRampToValueAtTime(note.level*.48,start+.075);
        envelope.gain.exponentialRampToValueAtTime(.0001,start+note.duration);
        oscillator.connect(envelope);
        envelope.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start+note.duration+.03);
      });
    };

    if(context.state==='suspended'){
      context.resume().then(play).catch(()=>{});
    }else{
      play();
    }
  }

  document.addEventListener('pointerover',event=>{
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(!target||(event.relatedTarget instanceof Node&&target.contains(event.relatedTarget)))return;
    const now=Date.now();
    if(now-lastHoverSoundAt<170)return;
    lastHoverSoundAt=now;
    playUiSound('hover');
  },true);

  // Play before navigation so the click sound is not cut off by page loading.
  document.addEventListener('pointerdown',event=>{
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(target)playUiSound('click');
  },true);

  // Keyboard activation does not produce pointerdown.
  document.addEventListener('click',event=>{
    if(event.detail!==0)return;
    const target=event.target instanceof Element?event.target.closest(soundableSelector):null;
    if(target)playUiSound('click');
  },true);

  function applyLanguage(){
    const t=translations[lang];document.documentElement.lang=lang;
    if($('title')) { const pageType=document.body.dataset.portfolioType; $('title').textContent=pageType?(pageType==='graphics'?`NeyeR — ${t.pageGraphics}`:`NeyeR — ${t.pageEditing}`):'NeyeR — Visual Designer & Video Editor'; }
    queryAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(t[key]!==undefined)el.textContent=t[key];});
    const side=$('.section-side-note');if(side)side.innerHTML=t.aboutSide.replace('\n','<br>');
    queryAll('.lang-option').forEach(el=>el.classList.toggle('selected',el.dataset.lang===lang));
    const sw=$('#langSwitch');if(sw)sw.setAttribute('aria-label',lang==='pl'?'Switch language to English':'Przełącz język na polski');
    const m=$('#mainNav');if(m)m.setAttribute('aria-label',lang==='pl'?'Główna nawigacja':'Main navigation');
    document.dispatchEvent(new CustomEvent('neyer:language',{detail:{lang,translations:t}}));
  }
  const sw=$('#langSwitch');if(sw)sw.addEventListener('click',()=>{lang=lang==='pl'?'en':'pl';try{localStorage.setItem('neyer-language',lang);}catch(_){ }applyLanguage();});
  const menu=$('#menuToggle'),nav=$('#mainNav');
  if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);});queryAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');}));}
  applyLanguage();window.NeyeR={get lang(){return lang;},get translations(){return translations;},applyLanguage};
  // Add staggered scroll entrances to individual cards, not only their parent sections.
  const staggerTargets=queryAll('#about .credential-card, #contact .contact-card');
  staggerTargets.forEach((el,index)=>{
    if(!el.classList.contains('reveal'))el.classList.add('reveal');
    if(!el.dataset.delay)el.dataset.delay=String((index%5)*85+40);
  });
  const reveals=queryAll('.reveal');
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }),{threshold:.14,rootMargin:'0px 0px -7% 0px'});
    reveals.forEach(el=>{
      if(el.dataset.delay)el.style.setProperty('--delay',`${el.dataset.delay}ms`);
      io.observe(el);
    });
  }else{
    reveals.forEach(el=>el.classList.add('is-visible'));
  }
  const progress=$('#scrollProgress');if(progress)window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?window.scrollY/max*100:0}%`;},{passive:true});
  const year=$('#year');if(year)year.textContent=new Date().getFullYear();
  async function copy(value){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true;}}catch(_){ }try{const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();return ok;}catch(_){return false;}}
  let toastTimer;function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
  queryAll('.contact-card').forEach(btn=>btn.addEventListener('click',async()=>{const ok=await copy(btn.dataset.copy);const t=translations[lang];toast(ok?(btn.dataset.copyKind==='email'?t.copyEmail:t.copyDiscord):t.copyError);}));
  const sections=queryAll('main section[id]');if(sections.length&&'IntersectionObserver'in window){const navIO=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){queryAll('.nav-link').forEach(link=>{const href=link.getAttribute('href');if(href&&href.startsWith('#'))link.classList.toggle('active',href===`#${entry.target.id}`);});}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>navIO.observe(s));}
})();
