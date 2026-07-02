/* ==========================================================================
   ENVELOPE.JS
   Handles: envelope open interaction, letter reveal, and
   typewriter text animation for the love letter.
   ========================================================================== */

const EnvelopeModule = (() => {

  function init() {
    const envelope = document.getElementById('envelope');
    const letterScene = document.getElementById('letter-scene');
    const closeBtn = document.getElementById('close-letter');

    if (!envelope) return;

    const open = () => {
      if (envelope.classList.contains('opened')) return;
      envelope.classList.add('opened');

      setTimeout(() => {
        letterScene.classList.remove('hidden');
        typewriterLetter();
      }, 700);
    };

    envelope.addEventListener('click', open);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    closeBtn.addEventListener('click', () => {
      letterScene.classList.add('hidden');
    });
  }

  /* Typewriter effect: reveals each letter-line character by character */
  function typewriterLetter() {
    const lines = document.querySelectorAll('.letter-line');
    const signature = document.querySelector('.letter-signature');
    let lineIndex = 0;

    // Reset content in case reopened
    lines.forEach(line => { line.textContent = ''; });
    if (signature) signature.classList.remove('show');

    function typeLine() {
      if (lineIndex >= lines.length) {
        if (signature) signature.classList.add('show');
        return;
      }
      const line = lines[lineIndex];
      const fullText = line.getAttribute('data-text') || '';
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex <= fullText.length) {
          line.textContent = fullText.slice(0, charIndex);
          charIndex++;
          // Slight speed variance for a natural handwriting feel
          const delay = 18 + Math.random() * 14;
          setTimeout(typeChar, delay);
        } else {
          lineIndex++;
          setTimeout(typeLine, 350);
        }
      };
      typeChar();
    }

    typeLine();
  }

  return { init };
})();
