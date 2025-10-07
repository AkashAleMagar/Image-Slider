(() => {
    const slider = document.querySelector('.slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');
    const autoplayInterval = parseInt(slider.dataset.autoplayInterval, 10) || 3000;

    let index = 0;
    let timer = null;
    let isPlaying = true;
    let startX = 0;

    // Build indicators
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => { goTo(i); });
        dotsContainer.appendChild(btn);
    });

    const dots = Array.from(dotsContainer.children);

    function update() {
        slider.style.transform = `translateX(${ -index * 100 }%)`;
        dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    }

    function next() { index = (index + 1) % slides.length; update(); }
    function prev() { index = (index - 1 + slides.length) % slides.length; update(); }
    function goTo(i) { index = (i + slides.length) % slides.length; update(); }

    prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
    nextBtn.addEventListener('click', () => { next(); resetTimer(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
        if (e.key === 'ArrowRight') { next(); resetTimer(); }
        if (e.key === ' ' || e.key === 'Spacebar') { // toggle play/pause on space
            e.preventDefault(); togglePlay();
        }
    });

    // Touch events for swipe
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; pause(); });
    slider.addEventListener('touchend', (e) => {
        const dx = (e.changedTouches[0].clientX - startX);
        if (Math.abs(dx) > 40) {
            if (dx > 0) prev(); else next();
        }
        resetTimer();
    });

    // Pause on hover/focus
    ['mouseenter', 'focusin'].forEach(evt => {
        slider.addEventListener(evt, pause);
        prevBtn.addEventListener(evt, pause);
        nextBtn.addEventListener(evt, pause);
        dotsContainer.addEventListener(evt, pause);
    });
    ['mouseleave', 'focusout'].forEach(evt => {
        slider.addEventListener(evt, resume);
        prevBtn.addEventListener(evt, resume);
        nextBtn.addEventListener(evt, resume);
        dotsContainer.addEventListener(evt, resume);
    });

    function play() { if (!timer) timer = setInterval(next, autoplayInterval); isPlaying = true; }
    function pause() { if (timer) { clearInterval(timer); timer = null; } isPlaying = false; }
    function resetTimer() { pause(); play(); }
    function togglePlay() { if (isPlaying) pause(); else play(); }

    // Start autoplay
    play();

    // Initial render
    update();

    // Expose for debugging (optional)
    window.__slider = { next, prev, goTo, pause, play, isPlaying };
})();
