/* ==========================================================================
   FLOWERS.JS
   Handles: opening bloom animation, ambient falling petals,
   floating hearts, sparkles, bokeh lights, and cursor petal bursts.
   ========================================================================== */

const FlowersModule = (() => {

  /* ---- Utility ---- */
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* Simple inline SVG peony used for the blooming flowers */
  function peonySVG(size, hue) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          ${Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45;
            return `<ellipse cx="50" cy="28" rx="14" ry="22" fill="${hue}"
                     transform="rotate(${angle} 50 50)" opacity="0.9" />`;
          }).join('')}
          <circle cx="50" cy="50" r="10" fill="#F3C7DA" opacity="0.95" />
          <circle cx="50" cy="50" r="5" fill="#D4AF37" opacity="0.9" />
        </g>
      </svg>
    `;
  }

  const peonyHues = ['#F8D7E8', '#EFB8D4', '#E8A6C8', '#FBEAF2', '#E191B8'];

  /* ======================================================================
     OPENING BLOOM SEQUENCE
     ====================================================================== */
  function runOpeningBloom(onComplete) {
    const petalField = document.getElementById('petal-field');
    const flowerField = document.getElementById('flower-field');
    const bloomScreen = document.getElementById('bloom-screen');

    let petalInterval, flowerInterval;
    const totalDuration = 14000; // within the 10-15s spec, extended slightly for a fuller bloom

    /* Phase 1 (0s - 4s): petals only drifting down, spawned thickly */
    petalInterval = setInterval(() => {
      spawnPetal(petalField, true);
      spawnPetal(petalField, true);
    }, 90);

    /* Phase 2 (2s - 12s): full peony flowers bloom densely from random spots */
    setTimeout(() => {
      flowerInterval = setInterval(() => {
        spawnBloomingPeony(flowerField);
        spawnBloomingPeony(flowerField);
      }, 130);
    }, 2000);

    /* Phase 3 (~12.5s): stop spawning, let last flowers settle */
    setTimeout(() => {
      clearInterval(petalInterval);
      clearInterval(flowerInterval);
    }, 12500);

    /* Phase 4 (~13.5s): curtain-part the flowers apart, reveal envelope */
    setTimeout(() => {
      partCurtain(bloomScreen, onComplete);
    }, 13500);
  }

  function spawnPetal(container, gentle) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const startX = rand(0, window.innerWidth);
    const drift = rand(-80, 80);
    const size = rand(10, 20);
    const duration = rand(6, 11);
    const hue = peonyHues[Math.floor(rand(0, peonyHues.length))];

    petal.style.left = `${startX}px`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`;
    petal.style.background = `radial-gradient(circle at 30% 30%, #fff, ${hue})`;
    petal.style.setProperty('--drift-end', `${drift}px`);
    petal.style.animation = `petal-fall ${duration}s ease-in forwards`;

    container.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  function spawnBloomingPeony(container) {
    const flower = document.createElement('div');
    flower.className = 'peony';
    const size = rand(60, 170);
    const left = rand(-5, 95);
    const top = rand(-5, 90);
    const hue = peonyHues[Math.floor(rand(0, peonyHues.length))];
    const bloomDuration = rand(1.4, 2.2);
    const floatDuration = rand(4, 7);

    flower.style.left = `${left}vw`;
    flower.style.top = `${top}vh`;
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.innerHTML = peonySVG(size, hue);
    flower.style.animation =
      `peony-bloom ${bloomDuration}s cubic-bezier(0.22,1,0.36,1) forwards,
       peony-float ${floatDuration}s ease-in-out ${bloomDuration}s infinite`;

    container.appendChild(flower);
  }

  function partCurtain(bloomScreen, onComplete) {
    const flowerField = document.getElementById('flower-field');
    const petalField = document.getElementById('petal-field');
    const hint = document.getElementById('bloom-hint');

    if (hint) hint.style.display = 'none';

    // Split children into two halves — left curtain and right curtain
    const allFlowers = Array.from(flowerField.children);
    allFlowers.forEach((el, i) => {
      const goLeft = i % 2 === 0;
      el.style.transition = 'transform 1.4s cubic-bezier(0.65,0,0.35,1), opacity 1.4s ease';
      el.style.animation = 'none';
      requestAnimationFrame(() => {
        el.style.transform = goLeft ? 'translateX(-120vw)' : 'translateX(120vw)';
        el.style.opacity = '0';
      });
    });

    petalField.style.transition = 'opacity 1s ease';
    petalField.style.opacity = '0';

    setTimeout(() => {
      bloomScreen.style.transition = 'opacity 1s ease';
      bloomScreen.style.opacity = '0';
      setTimeout(() => {
        bloomScreen.classList.add('hidden');
        if (onComplete) onComplete();
      }, 1000);
    }, 1500);
  }

  /* ======================================================================
     AMBIENT BACKGROUND LOOPS (run forever, subtle)
     ====================================================================== */
  function startAmbientPetals() {
    const container = document.getElementById('ambient-petals');
    setInterval(() => {
      if (document.hidden) return;
      spawnPetal(container, false);
    }, 550);

    /* Occasional small peony drifting through, for a fuller, more floral feel */
    setInterval(() => {
      if (document.hidden) return;
      spawnDriftingPeony(container);
    }, 3800);
  }

  function spawnDriftingPeony(container) {
    const flower = document.createElement('div');
    flower.className = 'peony';
    const size = rand(36, 64);
    const hue = peonyHues[Math.floor(rand(0, peonyHues.length))];
    const duration = rand(10, 16);
    const drift = rand(-60, 60);

    flower.style.left = `${rand(0, 100)}vw`;
    flower.style.top = '-10vh';
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.style.opacity = '0.85';
    flower.innerHTML = peonySVG(size, hue);
    flower.style.setProperty('--drift-end', `${drift}px`);
    flower.style.animation = `petal-fall ${duration}s ease-in-out forwards`;

    container.appendChild(flower);
    setTimeout(() => flower.remove(), duration * 1000 + 200);
  }

  function startFloatingHearts() {
    const container = document.getElementById('ambient-hearts');
    setInterval(() => {
      if (document.hidden) return;
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '&#10084;';
      heart.style.left = `${rand(5, 95)}vw`;
      heart.style.bottom = '0px';
      const duration = rand(9, 14);
      heart.style.animation = `heart-rise ${duration}s ease-in forwards`;
      container.appendChild(heart);
      setTimeout(() => heart.remove(), duration * 1000 + 200);
    }, 3200);
  }

  function startSparkles() {
    const container = document.getElementById('sparkles');
    setInterval(() => {
      if (document.hidden) return;
      const dot = document.createElement('div');
      dot.className = 'sparkle-dot';
      dot.style.left = `${rand(0, 100)}vw`;
      dot.style.top = `${rand(0, 100)}vh`;
      const duration = rand(2, 4);
      dot.style.animation = `twinkle ${duration}s ease-in-out`;
      container.appendChild(dot);
      setTimeout(() => dot.remove(), duration * 1000);
    }, 650);
  }

  function startBokeh() {
    const container = document.getElementById('bokeh');
    const count = 10;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'bokeh-dot';
      const size = rand(40, 120);
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${rand(0, 100)}vw`;
      dot.style.top = `${rand(0, 100)}vh`;
      dot.style.animation = `bokeh-drift ${rand(10, 18)}s ease-in-out infinite`;
      dot.style.animationDelay = `${rand(0, 6)}s`;
      container.appendChild(dot);
    }
  }

  /* ======================================================================
     CURSOR FLOWER + CLICK PETAL BURST
     ====================================================================== */
  function initCursorEffects() {
    const cursor = document.getElementById('cursor-flower');
    if (!cursor) return;

    window.addEventListener('pointermove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    window.addEventListener('pointerdown', (e) => {
      burstPetals(e.clientX, e.clientY);
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      setTimeout(() => { cursor.style.transform = 'translate(-50%, -50%) scale(1)'; }, 150);
    });
  }

  function burstPetals(x, y) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.width = '8px';
      p.style.height = '10px';
      const angle = rand(0, Math.PI * 2);
      const dist = rand(30, 70);
      p.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
      p.style.animation = 'petal-burst 0.7s ease-out forwards';
      p.style.position = 'fixed';
      p.style.zIndex = '9998';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 750);
    }
  }

  return {
    runOpeningBloom,
    startAmbientPetals,
    startFloatingHearts,
    startSparkles,
    startBokeh,
    initCursorEffects
  };
})();
