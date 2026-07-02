/* ==========================================================================
   MUSIC.JS
   Handles: background music autoplay-after-interaction, floating music
   control (play/pause/mute), and the "Our Song" modal player.
   ========================================================================== */

const MusicModule = (() => {

  let bgMusic, isMuted = false;

  function init() {
    bgMusic = document.getElementById('bg-music');
    const toggle = document.getElementById('music-toggle');
    const panel = document.getElementById('music-control');
    const playBtn = document.getElementById('music-play');
    const pauseBtn = document.getElementById('music-pause');
    const muteBtn = document.getElementById('music-mute');
    const icon = document.getElementById('music-icon');

    // Toggle the small control panel (play/pause/mute)
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    playBtn.addEventListener('click', () => {
      bgMusic.play().catch(() => {});
      icon.innerHTML = '&#9835;';
    });

    pauseBtn.addEventListener('click', () => {
      bgMusic.pause();
    });

    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      bgMusic.muted = isMuted;
      muteBtn.style.opacity = isMuted ? '0.5' : '1';
    });

  }

  /* Attempt to start music after the very first user interaction,
     satisfying browser autoplay policies. */
  function enableAutoplayAfterInteraction() {
    const start = () => {
      if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.55;
        bgMusic.play().catch(() => {
          /* Playback may still fail silently if no track has been provided yet */
        });
      }
      document.removeEventListener('click', start);
      document.removeEventListener('keydown', start);
      document.removeEventListener('touchstart', start);
    };
    document.addEventListener('click', start, { once: true });
    document.addEventListener('keydown', start, { once: true });
    document.addEventListener('touchstart', start, { once: true });
  }

  return { init, enableAutoplayAfterInteraction };
})();
