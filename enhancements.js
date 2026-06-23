/* ============================================
   DUBAI BARBEARIA — ENHANCEMENTS JS
   All interactive features: intro, cursor,
   particles, easter egg, counters, lightbox
============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ════════════════════════════════════════════
    //  1. CUSTOM CURSOR (scissors icon)
    // ════════════════════════════════════════════
    const cursorEl = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (cursorEl && cursorDot && window.matchMedia('(hover: hover)').matches) {
        document.body.classList.add('cursor-active');
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorEl.style.opacity = '1';
        });

        // Smooth cursor follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            dotX += (mouseX - dotX) * 0.25;
            dotY += (mouseY - dotY) * 0.25;

            cursorEl.style.left = cursorX + 'px';
            cursorEl.style.top = cursorY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover state on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .service-card, .flip-card, .barbeiro-card, .professional-card, .booking-item-btn, .date-btn, .time-slot-btn, .tab-btn, input');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                if (cursorEl.querySelector('svg')) {
                    cursorEl.querySelector('svg').style.transform = 'scale(1.3) rotate(15deg)';
                }
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                if (cursorEl.querySelector('svg')) {
                    cursorEl.querySelector('svg').style.transform = 'scale(1) rotate(0)';
                }
            });
        });
    }


    // ════════════════════════════════════════════
    //  2. INTRO SCREEN
    // ════════════════════════════════════════════
    const introScreen = document.getElementById('intro-screen');
    const enterBtn = document.getElementById('enter-btn');

    if (introScreen) {
        document.body.classList.add('intro-active');
        document.body.style.overflow = 'hidden';

        // Intro particles
        const introCanvas = document.getElementById('intro-canvas');
        if (introCanvas) {
            const ictx = introCanvas.getContext('2d');
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;

            const introParticles = [];
            for (let i = 0; i < 60; i++) {
                introParticles.push({
                    x: Math.random() * introCanvas.width,
                    y: Math.random() * introCanvas.height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }

            let introAnimId;
            function animateIntroParticles() {
                ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
                introParticles.forEach(p => {
                    ictx.beginPath();
                    ictx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ictx.fillStyle = `rgba(197, 160, 89, ${p.alpha})`;
                    ictx.fill();

                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > introCanvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > introCanvas.height) p.vy *= -1;
                });
                introAnimId = requestAnimationFrame(animateIntroParticles);
            }
            animateIntroParticles();
        }
    }

    // Enter site
    window.enterSite = function () {
        if (introScreen) {
            introScreen.classList.add('hidden');
            document.body.classList.remove('intro-active');
            document.body.style.overflow = '';
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 900);
        }
    };

    if (enterBtn) {
        enterBtn.addEventListener('click', window.enterSite);
    }


    // ════════════════════════════════════════════
    //  3. GOLDEN PARTICLES (Hero background)
    // ════════════════════════════════════════════
    const heroCanvas = document.getElementById('hero-particles-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let heroW, heroH;

        function resizeHeroCanvas() {
            const hero = heroCanvas.parentElement;
            heroW = hero.offsetWidth;
            heroH = hero.offsetHeight;
            heroCanvas.width = heroW;
            heroCanvas.height = heroH;
        }
        resizeHeroCanvas();
        window.addEventListener('resize', resizeHeroCanvas);

        const particles = [];
        const PARTICLE_COUNT = 45;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * heroW,
                y: Math.random() * heroH,
                r: Math.random() * 2.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.4 - 0.1,
                alpha: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2
            });
        }

        function drawHeroParticles() {
            ctx.clearRect(0, 0, heroW, heroH);
            particles.forEach(p => {
                p.pulse += 0.02;
                const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 160, 89, ${Math.max(0, pulseAlpha)})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 160, 89, ${Math.max(0, pulseAlpha * 0.15)})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.y < -10) { p.y = heroH + 10; p.x = Math.random() * heroW; }
                if (p.x < -10) p.x = heroW + 10;
                if (p.x > heroW + 10) p.x = -10;
            });
            requestAnimationFrame(drawHeroParticles);
        }
        drawHeroParticles();
    }


    // ════════════════════════════════════════════
    //  4. EASTER EGG (3 clicks on logo)
    // ════════════════════════════════════════════
    const easterOverlay = document.getElementById('easter-egg-overlay');
    const logoElement = document.querySelector('.logo');
    let logoClickCount = 0;
    let logoClickTimer = null;

    if (logoElement && easterOverlay) {
        logoElement.addEventListener('click', (e) => {
            logoClickCount++;
            clearTimeout(logoClickTimer);

            if (logoClickCount >= 3) {
                logoClickCount = 0;
                e.preventDefault();
                activateEasterEgg();
            } else {
                logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1500);
            }
        });
    }

    function activateEasterEgg() {
        if (!easterOverlay) return;
        easterOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Falling golden razors/stars
        const easterCanvas = document.getElementById('easter-canvas');
        if (easterCanvas) {
            const ectx = easterCanvas.getContext('2d');
            easterCanvas.width = window.innerWidth;
            easterCanvas.height = window.innerHeight;

            const fallingItems = [];
            const symbols = ['✦', '✂', '♛', '◈', '★', '⬥'];

            for (let i = 0; i < 50; i++) {
                fallingItems.push({
                    x: Math.random() * easterCanvas.width,
                    y: -Math.random() * easterCanvas.height,
                    vy: Math.random() * 3 + 1,
                    vx: (Math.random() - 0.5) * 1.5,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 4,
                    symbol: symbols[Math.floor(Math.random() * symbols.length)],
                    size: Math.random() * 18 + 12,
                    alpha: Math.random() * 0.6 + 0.3
                });
            }

            let easterAnimId;
            function animateEaster() {
                ectx.clearRect(0, 0, easterCanvas.width, easterCanvas.height);
                fallingItems.forEach(item => {
                    ectx.save();
                    ectx.translate(item.x, item.y);
                    ectx.rotate(item.rotation * Math.PI / 180);
                    ectx.font = `${item.size}px serif`;
                    ectx.fillStyle = `rgba(197, 160, 89, ${item.alpha})`;
                    ectx.textAlign = 'center';
                    ectx.fillText(item.symbol, 0, 0);
                    ectx.restore();

                    item.y += item.vy;
                    item.x += item.vx;
                    item.rotation += item.rotationSpeed;

                    if (item.y > easterCanvas.height + 50) {
                        item.y = -50;
                        item.x = Math.random() * easterCanvas.width;
                    }
                });
                easterAnimId = requestAnimationFrame(animateEaster);
            }
            animateEaster();

            // Store animId for cleanup
            easterOverlay._animId = easterAnimId;
        }
    }

    window.closeEasterEgg = function () {
        if (!easterOverlay) return;
        easterOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (easterOverlay._animId) {
            cancelAnimationFrame(easterOverlay._animId);
        }
    };

    // Click outside to close
    if (easterOverlay) {
        easterOverlay.addEventListener('click', (e) => {
            if (e.target === easterOverlay || e.target.id === 'easter-canvas') {
                window.closeEasterEgg();
            }
        });
    }


    // ════════════════════════════════════════════
    //  5. ANIMATED COUNTERS (Intersection Observer)
    // ════════════════════════════════════════════
    const contadorNums = document.querySelectorAll('.contador-num');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = current.toLocaleString('pt-BR') + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    }

    if (contadorNums.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        contadorNums.forEach(el => counterObserver.observe(el));
    }


    // ════════════════════════════════════════════
    //  6. LIGHTBOX (for gallery)
    // ════════════════════════════════════════════
    const lightbox = document.getElementById('lightbox-overlay');

    window.openLightbox = function (cardEl, title) {
        if (!lightbox) return;
        const img = cardEl.querySelector('.flip-front img');
        const lightboxImg = lightbox.querySelector('#lightbox-img');
        const lightboxCaption = lightbox.querySelector('#lightbox-caption');

        if (img && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = title || '';
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = title || '';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) window.closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                window.closeLightbox();
            }
            if (e.key === 'Escape' && easterOverlay && easterOverlay.classList.contains('active')) {
                window.closeEasterEgg();
            }
        });
    }


    // ════════════════════════════════════════════
    //  7. BARBEIRO "AGENDAR COM ELE" → scroll to booking
    // ════════════════════════════════════════════
    window.scrollToBooking = function (barberName) {
        const section = document.getElementById('agendar');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };


    // ════════════════════════════════════════════
    //  8. REVEAL ANIMATIONS FOR NEW SECTIONS
    // ════════════════════════════════════════════
    // Re-observe new elements that were added after initial observation
    const newRevealEls = document.querySelectorAll('#equipe .reveal, #equipe .reveal-left, #equipe .reveal-right, #galeria .reveal, #galeria .reveal-left, #contadores .reveal');
    if (newRevealEls.length > 0) {
        const newRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    newRevealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        newRevealEls.forEach(el => newRevealObserver.observe(el));
    }

});
