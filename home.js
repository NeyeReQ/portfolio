// Subtle perspective response for the photographic background in the Start section.
(function(){
  const hero = document.querySelector('#home.hero');
  if (!hero) return;

  const canHover = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reducedMotion) return;

  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  function applyTilt(){
    frame = 0;
    hero.style.setProperty('--hero-bg-rotate-x', (-targetY * 2.2).toFixed(2) + 'deg');
    hero.style.setProperty('--hero-bg-rotate-y', (targetX * 3.1).toFixed(2) + 'deg');
    hero.style.setProperty('--glitch-x', (targetX * 7).toFixed(2) + 'px');
    hero.style.setProperty('--glitch-y', (targetY * 5).toFixed(2) + 'px');
    hero.style.setProperty('--glitch-anchor-x', (50 + targetX * 17).toFixed(2) + '%');
    hero.style.setProperty('--glitch-anchor-y', (50 + targetY * 15).toFixed(2) + '%');
  }

  function scheduleTilt(){
    if (!frame) frame = window.requestAnimationFrame(applyTilt);
  }

  hero.addEventListener('pointermove', function(event){
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const bounds = hero.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
    scheduleTilt();
  });

  function resetTilt(){
    targetX = 0;
    targetY = 0;
    scheduleTilt();
  }

  hero.addEventListener('pointerleave', resetTilt);
  hero.addEventListener('pointercancel', resetTilt);
})();
