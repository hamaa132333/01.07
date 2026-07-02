/* ==========================================================================
   SCRIPT.JS
   Main controller: boots the opening bloom, wires up ambient effects,
   countdown timer, rotating love quotes, memory gallery lightbox,
   and the final full-screen surprise with a beating particle heart.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     EASY-EDIT SETTINGS
     ------------------------------------------------------------------ */
  // Set this to the date the two of you got together (YYYY, MM-1, DD, HH, MM, SS)
  const ANNIVERSARY_DATE = new Date(2020, 5, 14, 18, 0, 0); // June 14, 2020, 6:00 PM

  const LOVE_QUOTES = [
    "In all the world, there is no heart for me like yours.",
    "You are my today and all of my tomorrows.",
    "I love you not only for what you are, but for what I am when I am with you.",
    "Every love story is beautiful, but ours is my favorite.",
    "You had me at hello.",
    "With you, I've found the home I never knew I was looking for.",
    "I choose you, and I'll choose you over and over. Without pause, without a doubt, in a heartbeat."
  ];

  /* ------------------------------------------------------------------
     OPENING BLOOM → MAIN CONTENT
     ------------------------------------------------------------------ */
  const bloomScreen = document.getElementById('bloom-screen');
  const mainContent = document.getElementById('main-content');

  const beginExperience = () => {
    bloomScreen.removeEventListener('click', beginExperience);
    MusicModule.enableAutoplayAfterInteraction();

    FlowersModule.runOpeningBloom(() => {
      mainContent.classList.add('revealed');
      startAmbientEffects();
    });
  };

  bloomScreen.addEventListener('click', beginExperience);

  function startAmbientEffects() {
    FlowersModule.startAmbientPetals();
    FlowersModule.startFloatingHearts();
    FlowersModule.startSparkles();
    FlowersModule.startBokeh();
  }

  // Ambient effects that don't depend on the bloom (bokeh under the bloom
  // screen too) can start immediately for a magical feel from second one.
  FlowersModule.startBokeh();
  FlowersModule.initCursorEffects();

  /* ------------------------------------------------------------------
     ENVELOPE + LETTER + MUSIC MODULES
     ------------------------------------------------------------------ */
  EnvelopeModule.init();
  MusicModule.init();

  /* ------------------------------------------------------------------
     COUNTDOWN TIMER
     ------------------------------------------------------------------ */
  function updateCountdown() {
    const now = new Date();
    let years, months, days, hours, minutes, seconds;

    let diffMs = now - ANNIVERSARY_DATE;
    if (diffMs < 0) diffMs = 0;

    // Calendar-accurate breakdown (years/months) then remainder in ms
    let start = new Date(ANNIVERSARY_DATE);
    years = now.getFullYear() - start.getFullYear();
    months = now.getMonth() - start.getMonth();
    days = now.getDate() - start.getDate();
    hours = now.getHours() - start.getHours();
    minutes = now.getMinutes() - start.getMinutes();
    seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    setText('cd-years', Math.max(years, 0));
    setText('cd-months', Math.max(months, 0));
    setText('cd-days', Math.max(days, 0));
    setText('cd-hours', Math.max(hours, 0));
    setText('cd-minutes', Math.max(minutes, 0));
    setText('cd-seconds', Math.max(seconds, 0));
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------
     ROTATING LOVE QUOTES (every 20 seconds)
     ------------------------------------------------------------------ */
  const quoteEl = document.getElementById('love-quote');
  let quoteIndex = 0;

  function showQuote() {
    quoteEl.style.animation = 'none';
    void quoteEl.offsetWidth; // reflow to restart animation
    quoteEl.textContent = LOVE_QUOTES[quoteIndex % LOVE_QUOTES.length];
    quoteEl.style.animation = 'fade-rise 6s ease-in-out forwards';
    quoteIndex++;
  }

  showQuote();
  setInterval(showQuote, 20000);

  /* ------------------------------------------------------------------
     MEMORY GALLERY LIGHTBOX
     ------------------------------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.remove('hidden');
    });
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });

  /* ------------------------------------------------------------------
     FINAL SURPRISE
     ------------------------------------------------------------------ */
  const finalBtn = document.getElementById('final-surprise-btn');
  const finalOverlay = document.getElementById('final-surprise');
  const finalClose = document.getElementById('final-close');
  let heartAnimationHandle = null;

  finalBtn.addEventListener('click', () => {
    finalOverlay.classList.remove('hidden');
    spawnFinalStars();
    spawnFinalPetals();
    heartAnimationHandle = startBeatingHeart();
  });

  finalClose.addEventListener('click', () => {
    finalOverlay.classList.add('hidden');
    if (heartAnimationHandle) heartAnimationHandle.stop();
    document.getElementById('final-stars').innerHTML = '';
    document.getElementById('final-petals').innerHTML = '';
  });

  function spawnFinalStars() {
    const container = document.getElementById('final-stars');
    container.innerHTML = '';
    const count = 120;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star-dot';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animation = `star-twinkle ${2 + Math.random() * 3}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);
    }
  }

  function spawnFinalPetals() {
    const container = document.getElementById('final-petals');
    container.innerHTML = '';
    let count = 0;
    const maxPetals = 90; // "thousands" implied visually via density + motion, kept performant
    const interval = setInterval(() => {
      if (!finalOverlay || finalOverlay.classList.contains('hidden') || count >= maxPetals) {
        clearInterval(interval);
        return;
      }
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = 8 + Math.random() * 14;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.2}px`;
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.setProperty('--drift-end', `${(Math.random() - 0.5) * 160}px`);
      const duration = 6 + Math.random() * 8;
      petal.style.animation = `petal-fall ${duration}s linear forwards`;
      container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000 + 200);
      count++;
    }, 160);
  }

  /* Particle heart on canvas, gently "beating" via scale pulsing */
  function startBeatingHeart() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let particles = [];
    let rafId;
    let t = 0;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth = window.innerWidth;
      height = canvas.clientHeight = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Generate points along a parametric heart curve
    function heartPoint(angle) {
      const x = 16 * Math.pow(Math.sin(angle), 3);
      const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
      return { x, y };
    }

    const particleCount = 260;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const jitter = Math.random() * 0.9 + 0.1;
      const p = heartPoint(angle);
      particles.push({
        baseX: p.x * jitter,
        baseY: -p.y * jitter,
        offset: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2.2
      });
    }

    function draw() {
      t += 0.02;
      const beat = 1 + Math.sin(t * 2.4) * 0.045 + (Math.sin(t * 2.4 * 2) > 0.85 ? 0.03 : 0);
      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width, height) / 34 * beat;
      const cx = width / 2;
      const cy = height / 2 + 10;

      ctx.save();
      particles.forEach(p => {
        const flicker = 0.6 + Math.sin(t * 3 + p.offset) * 0.4;
        const x = cx + p.baseX * scale;
        const y = cy + p.baseY * scale;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 205, 122, ${0.4 + flicker * 0.5})`;
        ctx.shadowColor = 'rgba(233, 205, 122, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return {
      stop() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        ctx.clearRect(0, 0, width, height);
      }
    };
  }

});
