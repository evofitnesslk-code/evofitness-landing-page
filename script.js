// ===================================
// EVO FITNESS (PVT) LTD - OPTIMIZED JAVASCRIPT
// High performance, 60/120fps smooth animations, zero layout thrashing
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Preloader Handling & Hero Entrance ---
  const preloader = document.getElementById('preloader');
  let triggerAutoPlay = null;

  function hidePreloader() {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      document.body.classList.add('page-loaded');
      if (typeof triggerAutoPlay === 'function') {
        triggerAutoPlay();
      }
    }
  }

  // Hide the splash as soon as the first hero image and fonts are ready (short minimum so it
  // never flashes), with a hard cap so a slow asset can never keep users waiting.
  const splashStart = performance.now();
  const MIN_SPLASH = 300, MAX_SPLASH = 1800;
  const heroReady = new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = 'Img/b1.webp';
  });
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([heroReady, fontsReady]).then(() => {
    setTimeout(hidePreloader, Math.max(0, MIN_SPLASH - (performance.now() - splashStart)));
  });
  setTimeout(hidePreloader, MAX_SPLASH);

  // --- Fast DOM Selections ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const backBtn = document.getElementById('back-to-top');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // --- High-Performance Scroll Handling (rAF Throttled) ---
  let isScrolling = false;
  let lastScrollY = window.scrollY;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        // Toggle navbar scrolled state
        if (lastScrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Toggle back to top button
        if (backBtn) {
          if (lastScrollY > 350) {
            backBtn.classList.add('show');
          } else {
            backBtn.classList.remove('show');
          }
        }

        isScrolling = false;
      });
      isScrolling = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state check

  // --- Active Nav Link on Scroll via IntersectionObserver (Zero Layout Thrashing) ---
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // --- Mobile Hamburger Navigation ---
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Hero Slider with Smooth Transitions & Hardware Acceleration ---
  const heroSlider = document.getElementById('hero-slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const btnNext = document.getElementById('slider-next');
  const btnPrev = document.getElementById('slider-prev');

  if (slides.length > 0) {
    let currentSlide = 0;
    let sliderInterval = null;

    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoPlay() {
      if (sliderInterval) clearInterval(sliderInterval);
      sliderInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 3000);
    }

    triggerAutoPlay = startAutoPlay;

    function resetAutoPlay() {
      startAutoPlay();
    }

    if (document.body.classList.contains('page-loaded')) {
      startAutoPlay();
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoPlay();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoPlay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
    });

    if (heroSlider) {
      // Pause slider on hover for desktop
      heroSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
      heroSlider.addEventListener('mouseleave', () => startAutoPlay());

      // Touch swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;

      heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            goToSlide(currentSlide + 1); // swipe left
          } else {
            goToSlide(currentSlide - 1); // swipe right
          }
          resetAutoPlay();
        }
      }, { passive: true });
    }

    startAutoPlay();
  }

  // --- Smooth Stats Counter with requestAnimationFrame & Easing ---
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    function frame(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo function for a silky feel
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);
      el.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(frame);
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll(
    '.why-card, .highlight-card, .amenity-card, .gallery-card, .team-card, .blog-card, .testi-card, .about-img-wrap, .about-content, .info-item, .corp-benefit, .membership-cta-box, .contact-whatsapp-box'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    // Stats Bar observer
    const statsBar = document.getElementById('stats-bar');
    const counters = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    if (statsBar && counters.length > 0) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            counters.forEach(c => animateCounter(c));
            statsObserver.unobserve(statsBar);
          }
        });
      }, { threshold: 0.3 });

      statsObserver.observe(statsBar);
    }
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.stat-num').forEach(c => animateCounter(c));
  }

  // --- 3D Coverflow Gallery Showcase (Exact Design Matching Image) ---
  const gallerySection = document.getElementById('gallery');
  const coverflowStage = document.getElementById('coverflow-stage');
  const coverflowCards = Array.from(document.querySelectorAll('.coverflow-card'));
  const coverflowPrevBtn = document.getElementById('coverflow-prev');
  const coverflowNextBtn = document.getElementById('coverflow-next');
  const coverflowCounter = document.getElementById('coverflow-counter');
  const coverflowDots = document.getElementById('coverflow-dots');

  // Lightbox elements
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSpinner = document.getElementById('lightbox-spinner');
  const lightboxFilmstrip = document.getElementById('lightbox-filmstrip');

  if (coverflowStage && coverflowCards.length > 0) {
    let currentFilter = 'all';
    let activeIndex = 0; // index within visibleCards
    let autoplayTimer = null;
    let isPointerDown = false;
    let hasMoved = false;
    let dragStartX = 0;
    let dragCurrentX = 0;

    // Collect data for all cards
    const allCardsData = coverflowCards.map((card, idx) => {
      const img = card.querySelector('.coverflow-img');
      const title = card.getAttribute('data-title') || 'EVO Fitness';
      const category = card.getAttribute('data-category') || 'all';
      const fullSrc = img ? (img.getAttribute('data-full') || img.src) : '';
      const thumbSrc = img ? img.src : '';
      return {
        cardElement: card,
        index: idx,
        title,
        category,
        fullSrc,
        thumbSrc
      };
    });

    function getVisibleCards() {
      if (currentFilter === 'all') {
        return allCardsData;
      }
      return allCardsData.filter(item => item.category === currentFilter);
    }

    // Calculate responsive metrics based on viewport width
    function getMetrics() {
      const width = window.innerWidth;
      if (width > 1200) {
        return {
          step1: 240,
          step2: 450,
          scale1: 0.86,
          scale2: 0.72,
          z1: -70,
          z2: -150,
          rot1: 5,
          rot2: 8
        };
      } else if (width > 768) {
        return {
          step1: 195,
          step2: 360,
          scale1: 0.84,
          scale2: 0.68,
          z1: -60,
          z2: -130,
          rot1: 4,
          rot2: 7
        };
      } else if (width > 480) {
        return {
          step1: 130,
          step2: 235,
          scale1: 0.82,
          scale2: 0.64,
          z1: -50,
          z2: -110,
          rot1: 3,
          rot2: 5
        };
      } else {
        return {
          step1: 95,
          step2: 170,
          scale1: 0.80,
          scale2: 0.62,
          z1: -40,
          z2: -90,
          rot1: 2,
          rot2: 4
        };
      }
    }

    // Render Dots pagination
    function renderDots() {
      if (!coverflowDots) return;
      const visible = getVisibleCards();
      coverflowDots.innerHTML = '';
      visible.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `coverflow-dot ${idx === activeIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(idx);
        });
        coverflowDots.appendChild(dot);
      });
    }

    function updateDots() {
      if (!coverflowDots) return;
      const dots = coverflowDots.querySelectorAll('.coverflow-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }

    function updateCounter() {
      const visible = getVisibleCards();
      if (coverflowCounter && visible.length > 0) {
        const current = String(activeIndex + 1).padStart(2, '0');
        const total = String(visible.length).padStart(2, '0');
        coverflowCounter.textContent = `${current} / ${total}`;
      }
    }

    // Position cards in 3D Coverflow
    function updateCoverflowPositions() {
      const visible = getVisibleCards();
      const N = visible.length;
      const m = getMetrics();

      // Reset any cards not visible in current filter
      allCardsData.forEach(item => {
        if (!visible.includes(item)) {
          item.cardElement.style.opacity = '0';
          item.cardElement.style.pointerEvents = 'none';
          item.cardElement.style.transform = 'translate3d(0, 0, -400px) scale(0.3)';
          item.cardElement.classList.remove('is-active');
        }
      });

      visible.forEach((item, k) => {
        const el = item.cardElement;
        let diff = k - activeIndex;

        // Circular shortest path wrap
        if (N > 2) {
          while (diff > N / 2) diff -= N;
          while (diff < -N / 2) diff += N;
        }

        if (diff === 0) {
          // Center active card
          el.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
          el.style.zIndex = '20';
          el.style.opacity = '1';
          el.style.filter = 'brightness(1)';
          el.style.pointerEvents = 'auto';
          el.classList.add('is-active');
        } else if (diff === 1) {
          // Near Right
          el.style.transform = `translate3d(${m.step1}px, 0, ${m.z1}px) scale(${m.scale1}) rotateY(-${m.rot1}deg)`;
          el.style.zIndex = '15';
          el.style.opacity = '0.9';
          el.style.filter = 'brightness(0.72)';
          el.style.pointerEvents = 'auto';
          el.classList.remove('is-active');
        } else if (diff === -1) {
          // Near Left
          el.style.transform = `translate3d(-${m.step1}px, 0, ${m.z1}px) scale(${m.scale1}) rotateY(${m.rot1}deg)`;
          el.style.zIndex = '15';
          el.style.opacity = '0.9';
          el.style.filter = 'brightness(0.72)';
          el.style.pointerEvents = 'auto';
          el.classList.remove('is-active');
        } else if (diff === 2) {
          // Far Right
          el.style.transform = `translate3d(${m.step2}px, 0, ${m.z2}px) scale(${m.scale2}) rotateY(-${m.rot2}deg)`;
          el.style.zIndex = '10';
          el.style.opacity = '0.65';
          el.style.filter = 'brightness(0.5)';
          el.style.pointerEvents = 'auto';
          el.classList.remove('is-active');
        } else if (diff === -2) {
          // Far Left
          el.style.transform = `translate3d(-${m.step2}px, 0, ${m.z2}px) scale(${m.scale2}) rotateY(${m.rot2}deg)`;
          el.style.zIndex = '10';
          el.style.opacity = '0.65';
          el.style.filter = 'brightness(0.5)';
          el.style.pointerEvents = 'auto';
          el.classList.remove('is-active');
        } else {
          // Hidden outer cards
          const dir = Math.sign(diff) || 1;
          el.style.transform = `translate3d(${dir * (m.step2 + 200)}px, 0, -280px) scale(0.5)`;
          el.style.zIndex = '1';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.classList.remove('is-active');
        }
      });

      updateDots();
      updateCounter();
    }

    function goToSlide(newIndex) {
      const visible = getVisibleCards();
      if (visible.length === 0) return;
      activeIndex = (newIndex + visible.length) % visible.length;
      updateCoverflowPositions();
    }

    function nextSlide() {
      goToSlide(activeIndex + 1);
    }

    function prevSlide() {
      goToSlide(activeIndex - 1);
    }

    // Autoplay logic
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, 4500);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    coverflowStage.addEventListener('mouseenter', stopAutoplay);
    coverflowStage.addEventListener('mouseleave', startAutoplay);

    // Navigation buttons
    if (coverflowPrevBtn) {
      coverflowPrevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
      });
    }
    if (coverflowNextBtn) {
      coverflowNextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
      });
    }

    // Card click events
    allCardsData.forEach(item => {
      const card = item.cardElement;
      const expandBtn = card.querySelector('.coverflow-action-btn');

      if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(item);
        });
      }

      card.addEventListener('click', () => {
        if (hasMoved) return;
        const visible = getVisibleCards();
        const cardIndex = visible.indexOf(item);
        if (cardIndex === -1) return;

        if (cardIndex === activeIndex) {
          // Active center card clicked: open lightbox
          openLightbox(item);
        } else {
          // Rotate clicked side card into center
          goToSlide(cardIndex);
        }
      });
    });

    // Touch & Mouse Drag / Swipe
    function onPointerDown(e) {
      isPointerDown = true;
      hasMoved = false;
      dragStartX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      dragCurrentX = dragStartX;
      stopAutoplay();
    }

    function onPointerMove(e) {
      if (!isPointerDown) return;
      dragCurrentX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      const dist = dragCurrentX - dragStartX;
      if (Math.abs(dist) > 8) {
        hasMoved = true;
      }
    }

    function onPointerUp() {
      if (!isPointerDown) return;
      isPointerDown = false;
      const dist = dragCurrentX - dragStartX;
      if (Math.abs(dist) > 40) {
        if (dist > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      setTimeout(() => {
        hasMoved = false;
      }, 50);
    }

    coverflowStage.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    coverflowStage.addEventListener('touchstart', onPointerDown, { passive: true });
    coverflowStage.addEventListener('touchmove', onPointerMove, { passive: true });
    coverflowStage.addEventListener('touchend', onPointerUp, { passive: true });


    // Window resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCoverflowPositions, 100);
    });

    // Initial setup
    renderDots();
    updateCoverflowPositions();
    startAutoplay();

    // Lightbox modal logic synchronized with current visible items
    let currentLightboxIndex = 0;

    function renderFilmstrip() {
      if (!lightboxFilmstrip) return;
      const visibleList = getVisibleCards();
      lightboxFilmstrip.innerHTML = '';

      visibleList.forEach((item, i) => {
        const thumb = document.createElement('div');
        thumb.className = `filmstrip-thumb ${i === currentLightboxIndex ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${item.thumbSrc}" alt="${item.title}" loading="lazy" />`;
        thumb.addEventListener('click', () => {
          updateLightboxContent(i, true);
        });
        lightboxFilmstrip.appendChild(thumb);
      });
    }

    function updateFilmstripHighlight() {
      if (!lightboxFilmstrip) return;
      const thumbs = lightboxFilmstrip.querySelectorAll('.filmstrip-thumb');
      thumbs.forEach((thumb, i) => {
        const isActive = (i === currentLightboxIndex);
        thumb.classList.toggle('active', isActive);
        if (isActive) {
          thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }

    function updateLightboxContent(itemIndex, smoothTransition = false) {
      const visibleList = getVisibleCards();
      if (visibleList.length === 0) return;

      currentLightboxIndex = (itemIndex + visibleList.length) % visibleList.length;
      const currentItem = visibleList[currentLightboxIndex];

      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${visibleList.length}`;
      }
      if (lightboxTitle) {
        lightboxTitle.textContent = currentItem.title;
      }

      if (lightboxImg) {
        if (lightboxSpinner) lightboxSpinner.classList.add('show');
        if (smoothTransition) {
          lightboxImg.style.opacity = '0';
          lightboxImg.style.transform = 'scale(0.96)';
        }

        const tempImg = new Image();
        tempImg.onload = () => {
          lightboxImg.src = currentItem.fullSrc;
          lightboxImg.alt = currentItem.title;
          if (lightboxSpinner) lightboxSpinner.classList.remove('show');
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'scale(1)';
        };
        tempImg.src = currentItem.fullSrc;
      }

      updateFilmstripHighlight();

      // Preload next and prev images
      const nextIdx = (currentLightboxIndex + 1) % visibleList.length;
      const prevIdx = (currentLightboxIndex - 1 + visibleList.length) % visibleList.length;
      const nextImg = new Image();
      nextImg.src = visibleList[nextIdx].fullSrc;
      const prevImg = new Image();
      prevImg.src = visibleList[prevIdx].fullSrc;
    }

    function openLightbox(itemData) {
      stopAutoplay();
      const visibleList = getVisibleCards();
      const targetIndex = visibleList.indexOf(itemData);
      currentLightboxIndex = targetIndex !== -1 ? targetIndex : 0;

      renderFilmstrip();
      updateLightboxContent(currentLightboxIndex, false);

      if (galleryLightbox) {
        galleryLightbox.classList.add('active');
        galleryLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      if (galleryLightbox) {
        galleryLightbox.classList.remove('active');
        galleryLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      startAutoplay();
    }

    function showLightboxPrev() {
      updateLightboxContent(currentLightboxIndex - 1, true);
    }

    function showLightboxNext() {
      updateLightboxContent(currentLightboxIndex + 1, true);
    }

    // Lightbox navigation events
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showLightboxPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showLightboxNext);

    // Keyboard support for both lightbox and coverflow
    window.addEventListener('keydown', (e) => {
      if (galleryLightbox && galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          showLightboxPrev();
        } else if (e.key === 'ArrowRight') {
          showLightboxNext();
        }
      } else {
        // If gallery is in viewport, allow arrow keys to navigate
        const rect = gallerySection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
          } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
          }
        }
      }
    });

    // Touch swipe support inside lightbox
    let lbTouchStartX = 0;
    let lbTouchEndX = 0;
    if (galleryLightbox) {
      galleryLightbox.addEventListener('touchstart', (e) => {
        lbTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      galleryLightbox.addEventListener('touchend', (e) => {
        lbTouchEndX = e.changedTouches[0].screenX;
        const diff = lbTouchStartX - lbTouchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            showLightboxNext();
          } else {
            showLightboxPrev();
          }
        }
      }, { passive: true });
    }
  }

  // --- Back to Top Smooth Scroll ---
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- WhatsApp Contact Link Hub ---
  const waTextarea = document.getElementById('wa-custom-msg');
  const waSendBtn = document.getElementById('btn-whatsapp-send');
  const waChips = document.querySelectorAll('.wa-chip');
  const waPhoneNumber = '94710509253';

  function updateWaLink() {
    if (waTextarea && waSendBtn) {
      const text = waTextarea.value.trim() || 'Hi EVO Fitness, I would like to get more information.';
      waSendBtn.href = `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(text)}`;
    }
  }

  if (waChips.length > 0 && waTextarea && waSendBtn) {
    waChips.forEach(chip => {
      chip.addEventListener('click', () => {
        waChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        waTextarea.value = chip.getAttribute('data-msg');
        updateWaLink();
      });
    });

    waTextarea.addEventListener('input', updateWaLink, { passive: true });
  }

  // --- Smooth Scroll For All Anchor Links with Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- BMI Calculator with Real-Time Feedback ---
  const bmiCalcBtn = document.getElementById('bmi-calc-btn');
  const bmiHeightInput = document.getElementById('bmi-height');
  const bmiWeightInput = document.getElementById('bmi-weight');

  function calculateBMI() {
    const heightCm = parseFloat(bmiHeightInput?.value);
    const weightKg = parseFloat(bmiWeightInput?.value);
    const scoreVal = document.getElementById('bmi-score-value');
    const statusText = document.getElementById('bmi-status-text');
    const pointer = document.getElementById('bmi-pointer');
    const adviceText = document.getElementById('bmi-advice-text');

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return;

    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    if (scoreVal) scoreVal.textContent = bmi;

    let status = '';
    let advice = '';
    let percentage = 0;

    if (bmi < 18.5) {
      status = 'UNDERWEIGHT';
      advice = 'You are underweight. Our trainers can help you build lean muscle mass with customized strength training and high-protein nutrition guidance.';
      percentage = Math.max(5, (bmi / 18.5) * 25);
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      status = 'NORMAL WEIGHT';
      advice = 'Your BMI is in the healthy optimal range! Maintain your strength, fitness, and vitality with our custom workout and functional training programs.';
      percentage = 25 + ((bmi - 18.5) / 6.4) * 25;
    } else if (bmi >= 25 && bmi <= 29.9) {
      status = 'OVERWEIGHT';
      advice = 'You are in the overweight range. Our cardio, group fitness sessions, and personal training will help you shed fat and achieve peak fitness.';
      percentage = 50 + ((bmi - 25) / 4.9) * 25;
    } else {
      status = 'OBESE';
      advice = 'Your BMI indicates obesity. We recommend our specialized weight management & body transformation package to safely transform your health and body.';
      percentage = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
    }

    if (statusText) statusText.textContent = status;
    if (adviceText) adviceText.textContent = advice;
    if (pointer) pointer.style.left = `${percentage}%`;
  }

  if (bmiCalcBtn) bmiCalcBtn.addEventListener('click', calculateBMI);
  if (bmiHeightInput) bmiHeightInput.addEventListener('input', calculateBMI, { passive: true });
  if (bmiWeightInput) bmiWeightInput.addEventListener('input', calculateBMI, { passive: true });
});
