// The homepage intentionally stays static: the two portfolio areas open separate pages.

/* Subtle cursor-driven movement for the Start hero background and artwork. */
(function(){
  const hero = document.querySelector('.hero');
  const artwork = document.querySelector('.hero-art');
  const scene = document.querySelector('.hero-art-scene');
  if (!hero || !artwork || !scene) return;

  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  function applyTilt(){
    frame = 0;
    const backgroundRotateX = (-targetY * 1.15).toFixed(2);
    const backgroundRotateY = (targetX * 1.45).toFixed(2);
    const artworkRotateX = (-targetY * 1.8).toFixed(2);
    const artworkRotateY = (targetX * 2.4).toFixed(2);

    hero.style.setProperty('--hero-bg-rotate-x', backgroundRotateX + 'deg');
    hero.style.setProperty('--hero-bg-rotate-y', backgroundRotateY + 'deg');
    scene.style.setProperty('--hero-art-rotate-x', artworkRotateX + 'deg');
    scene.style.setProperty('--hero-art-rotate-y', artworkRotateY + 'deg');
  }

  hero.addEventListener('pointermove', function(event){
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const bounds = hero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
    if (!frame) frame = window.requestAnimationFrame(applyTilt);
  });

  hero.addEventListener('pointerleave', function(){
    targetX = 0;
    targetY = 0;
    if (!frame) frame = window.requestAnimationFrame(applyTilt);
  });
})();