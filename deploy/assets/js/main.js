/* =============================================
   ФЕНІКС — Реабілітаційний Центр
   main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.querySelector('i').className = 'ti ti-moon';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      // Update icon
      const icon = themeToggle.querySelector('i');
      icon.className = isDark ? 'ti ti-moon' : 'ti ti-sun-filled';
    });
  }

  // ── FLOATING PARTICLES ──────────────────────
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    // Reduce particles on mobile for better performance
    const particleCount = window.innerWidth <= 768 ? 12 : 25;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left              = Math.random() * 100 + '%';
      p.style.width             = (Math.random() * 4 + 1) + 'px';
      p.style.height            = p.style.width;
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay    = (Math.random() * 8) + 's';
      p.style.opacity           = Math.random() * 0.5;
      particleContainer.appendChild(p);
    }
  }

  // ── LAZY-LOAD BACKGROUND IMAGES ─────────────
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.style.backgroundImage = `url('${img.dataset.src}')`;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, { rootMargin: '50px' });

  // Observe all elements with lazy-load class
  document.querySelectorAll('[data-src]').forEach(el => {
    imageObserver.observe(el);
  });

  // ── SMOOTH LOGO SCROLL ANIMATION ────────────
  const navbar       = document.getElementById('navbar');
  const navLogo      = document.getElementById('navLogo');
  const heroLogo     = document.getElementById('heroLogo');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroSection  = document.getElementById('hero');

  if (heroLogo && navLogo && heroSection) {
    // Drive transforms via JS — remove CSS transitions
    heroLogo.style.transition = 'none';
    navLogo.style.transition  = 'none';

    let measured = false;
    let targetX = 0, targetY = 0, targetScale = 0;

    function measureTargets() {
      navLogo.style.opacity   = '1';
      navLogo.style.transform = 'none';

      const navImg   = navLogo.querySelector('img');
      const heroImg  = heroLogo.querySelector('img');
      const navImgR  = navImg.getBoundingClientRect();
      const heroImgR = heroImg.getBoundingClientRect();

      navLogo.style.opacity = '0';

      // nav-logo is position:fixed → viewport coords are always correct
      const navCX = navImgR.left + navImgR.width  / 2;
      const navCY = navImgR.top  + navImgR.height / 2;

      // hero-logo is in page flow → add scrollY so measurement is
      // scroll-position-independent (fixes wrong direction after scroll restore)
      const heroCX = heroImgR.left + heroImgR.width  / 2;
      const heroCY = heroImgR.top  + window.scrollY + heroImgR.height / 2;

      targetX     = navCX - heroCX;
      targetY     = navCY - heroCY;
      targetScale = navImgR.width / heroImgR.width;
      measured    = true;
    }

    function smoothstep(x) {
      x = Math.max(0, Math.min(1, x));
      return x * x * (3 - 2 * x);
    }

    let ticking = false;

    function updateScroll() {
      if (!measured) measureTargets();

      const scrollY = window.scrollY;
      const zone    = heroSection.offsetHeight * 0.55;
      const raw     = Math.max(0, Math.min(1, scrollY / zone));
      const t       = smoothstep(raw);

      // Hero logo interpolates toward nav target
      heroLogo.style.transform = `translate(${targetX * t}px, ${targetY * t}px) scale(${1 + (targetScale - 1) * t})`;
      heroLogo.style.opacity   = t > 0.88 ? 0 : 1;

      // Nav logo fades in at the tail of the animation
      const navT = smoothstep(Math.max(0, (raw - 0.55) / 0.45));
      navLogo.style.opacity   = navT;
      navLogo.style.transform = `scale(${0.65 + 0.35 * navT})`;

      if (raw > 0.15) navbar.classList.add('scrolled');
      else            navbar.classList.remove('scrolled');

      heroSubtitle.style.opacity = 1 - smoothstep(raw / 0.28);

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
    });
    window.addEventListener('resize', () => { measured = false; });
    updateScroll();

    // ── NAV LOGO SMOOTH SCROLL ──────────────────
    navLogo.addEventListener('click', e => {
      e.preventDefault();
      isScrolling = true;
      animateScrollTo(0);
    });
  } else if (navLogo) {
    // На about.html просто показуємо логотип
    navLogo.style.opacity = '1';
    navLogo.style.transform = 'scale(1)';
  }

  // ── SCROLL HELPERS (shared: snap-scroll, scroll-to-top, burger) ─
  let isScrolling = false;
  let rafId       = null;

  function easeInOutQuart(t) {
    return t < 0.5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2,4)/2;
  }

  function sectionTop(el) {
    return Math.round(el.getBoundingClientRect().top + window.scrollY);
  }

  function navOffset() { return navbar.offsetHeight; }

  function animateScrollTo(target) {
    const start    = window.scrollY;
    const distance = target - start;
    const duration = Math.min(1000, Math.max(550, Math.abs(distance) * 0.45));
    let   t0       = null;

    cancelAnimationFrame(rafId);

    function step(ts) {
      if (!t0) t0 = ts;
      const prog = Math.min((ts - t0) / duration, 1);
      window.scrollTo(0, start + distance * easeInOutQuart(prog));
      if (prog < 1) rafId = requestAnimationFrame(step);
      else          isScrolling = false;
    }
    rafId = requestAnimationFrame(step);
  }

  // ── SMOOTH SECTION SCROLL-SNAP ───────────────
  if (heroSection) {
    const sections = Array.from(document.querySelectorAll(
      '#hero, #why-us, #services, #program, #activity, #specialists, #branches, #contact'
    ));

  function findTarget(dir) {
    const cy = window.scrollY;
    if (dir > 0) {
      for (const s of sections) {
        const top = sectionTop(s) - navOffset();
        if (top > cy + 50) return top;
      }
    } else {
      let best = null;
      for (const s of sections) {
        const top = sectionTop(s) - navOffset();
        if (top < cy - 50) best = top;
      }
      return best;
    }
    return null;
  }

  // Wheel — snap only when leaving hero downward
  let wheelAcc = 0, wheelTimer = null;

  window.addEventListener('wheel', (e) => {
    const inHero = window.scrollY < heroSection.offsetHeight * 0.85;
    const dir    = e.deltaY > 0 ? 1 : -1;

    if (!inHero || dir < 0) return; // normal scroll everywhere else

    wheelAcc += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAcc = 0; }, 100);

    if (Math.abs(wheelAcc) < 60) return;
    if (isScrolling) { e.preventDefault(); return; }

    const target = findTarget(1);
    if (target === null) return;

    e.preventDefault();
    wheelAcc    = 0;
    isScrolling = true;
    animateScrollTo(target);
  }, { passive: false });

  // Touch — snap only on desktop (not mobile/touch-primary devices)
  let touchY0 = null;
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window && window.innerWidth < 1024);

  window.addEventListener('touchstart', e => {
    touchY0 = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', e => {
    if (touchY0 === null || isScrolling || isMobile()) return;
    const dy = touchY0 - e.changedTouches[0].clientY;
    touchY0  = null;
    if (Math.abs(dy) < 45) return;

    const inHero = window.scrollY < heroSection.offsetHeight * 0.85;
    if (!inHero || dy < 0) return;

    const target = findTarget(1);
    if (target === null) return;
    isScrolling = true;
    animateScrollTo(target);
  }, { passive: true });
  }

  // ── SCROLL TO TOP ───────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      animateScrollTo(0);
    });
  }

  // ── BURGER MENU ─────────────────────────────
  const burger  = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      navMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        burger.classList.remove('open');
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');

        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          isScrolling = true;
          animateScrollTo(sectionTop(target) - navOffset());
        }
      });
    });
  }

  // ── REVEAL ON SCROLL ────────────────────────
  const reveals  = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
    { threshold: 0.12 }
  );
  reveals.forEach(el => observer.observe(el));

  // ── FORM SUBMIT ─────────────────────────────
  // ── CONTACT FORM SUBMISSION ─────────────────
  // Credentials are now handled securely on the backend (server.js)
  // The frontend only calls /api/contact endpoint

  const form   = document.querySelector('.contact-form');
  const submit = document.querySelector('.form-submit');

  async function sendContactForm(name, phone, city, message) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        message: message.trim(),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send form');
    }
    return res.json();
  }

  if (form && submit) {
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const cityInput = document.getElementById('contactCity');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const cityError = document.getElementById('city-error');

    // Set input constraints for edge case handling
    nameInput.maxLength = 100;
    cityInput.maxLength = 50;
    messageInput.maxLength = 500;

    // Validation rules
    const validations = {
      name: (val) => {
        if (!val.trim()) return 'Введіть ваше ім\'я';
        if (val.trim().length < 2) return 'Ім\'я має бути мінімум 2 символи';
        if (val.trim().length > 100) return 'Ім\'я занадто довге (макс. 100 символів)';
        return null;
      },
      phone: (val) => {
        if (!val.trim()) return 'Введіть номер телефону';
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10) return 'Номер повинен містити мінімум 10 цифр';
        if (digits.length > 15) return 'Номер занадто довгий';
        return null;
      },
      city: (val) => {
        if (!val.trim()) return 'Вкажіть ваше місто';
        if (val.trim().length < 2) return 'Назва міста занадто коротка';
        if (val.trim().length > 50) return 'Назва міста занадто довга (макс. 50 символів)';
        return null;
      },
      message: (val) => {
        if (val && val.trim().length > 500) return 'Повідомлення занадто довге (макс. 500 символів)';
        return null;
      }
    };

    // Show error and style field
    function showError(inputEl, errorEl, message) {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      inputEl.classList.add('error');
    }

    // Clear error and style
    function clearError(inputEl, errorEl) {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      inputEl.classList.remove('error');
    }

    // Clear errors on input
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    phoneInput.addEventListener('input', () => clearError(phoneInput, phoneError));
    cityInput.addEventListener('input', () => clearError(cityInput, cityError));
    messageInput.addEventListener('input', () => {
      clearError(messageInput, messageInput.nextElementSibling);
      // Update character count in hint
      const hint = document.getElementById('message-hint');
      if (hint) hint.textContent = `${messageInput.value.length} / 500 символів`;
    });

    function setBtn(text, state = '', disabled = false) {
      submit.textContent = text;
      submit.classList.remove('form-submit--pending', 'form-submit--success', 'form-submit--error');
      if (state) submit.classList.add(`form-submit--${state}`);
      submit.disabled = disabled;
    }

    submit.addEventListener('click', async e => {
      e.preventDefault();

      // Validate all fields
      let isValid = true;

      const nameVal = nameInput.value;
      const nameErr = validations.name(nameVal);
      if (nameErr) {
        showError(nameInput, nameError, nameErr);
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      const phoneVal = phoneInput.value;
      const phoneErr = validations.phone(phoneVal);
      if (phoneErr) {
        showError(phoneInput, phoneError, phoneErr);
        isValid = false;
      } else {
        clearError(phoneInput, phoneError);
      }

      const cityVal = cityInput.value;
      const cityErr = validations.city(cityVal);
      if (cityErr) {
        showError(cityInput, cityError, cityErr);
        isValid = false;
      } else {
        clearError(cityInput, cityError);
      }

      const messageVal = messageInput.value;
      const messageErr = validations.message(messageVal);
      if (messageErr) {
        const msgError = messageInput.nextElementSibling;
        showError(messageInput, msgError, messageErr);
        isValid = false;
      } else {
        const msgError = messageInput.nextElementSibling;
        clearError(messageInput, msgError);
      }

      if (!isValid) {
        setBtn('Виправте помилки', 'error', true);
        setTimeout(() => setBtn('Залишити заявку →', '', false), 2500);
        return;
      }

      setBtn('Надсилаємо...', 'pending', true);

      try {
        await sendContactForm(nameVal, phoneVal, cityVal, messageVal);
        setBtn('✓ Заявку прийнято! Ми зателефонуємо', 'success', true);
        nameInput.value = '';
        phoneInput.value = '';
        cityInput.value = '';
        messageInput.value = '';
        document.getElementById('message-hint').textContent = '0 / 500 символів';
        clearError(nameInput, nameError);
        clearError(phoneInput, phoneError);
        clearError(cityInput, cityError);
        setTimeout(() => setBtn('Залишити заявку →', '', false), 5000);
      } catch (err) {
        setBtn('Помилка. Зателефонуйте нам напряму', 'error', true);
        setTimeout(() => setBtn('Залишити заявку →', '', false), 4000);
      }
    });
  }


  // ── GALLERY SCROLL SYNC ──────────────────────
  const galleryStrip = document.getElementById('galleryStrip');
  const captionItems = document.querySelectorAll('.gallery-caption-item');
  const galleryImgs  = document.querySelectorAll('.gallery-img');

  if (galleryStrip) {
    const wrap = galleryStrip.parentElement;

    // Drag-to-scroll
    let isDragging = false, dragStartX = 0, scrollStartX = 0;

    wrap.addEventListener('mousedown', e => {
      isDragging  = true;
      dragStartX  = e.pageX - wrap.offsetLeft;
      scrollStartX = wrap.scrollLeft;
      wrap.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      wrap.style.cursor = 'grab';
    });
    wrap.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      wrap.scrollLeft = scrollStartX - (e.pageX - wrap.offsetLeft - dragStartX);
    });

    // Wheel-scroll on hover (mouse wheel Y + trackpad X/Y)
    wrap.addEventListener('wheel', e => {
      e.preventDefault();
      wrap.scrollLeft += e.deltaX || e.deltaY;
    }, { passive: false });

    let currentGroup = 0;

    function setGroup(g) {
      if (g === currentGroup) return;
      currentGroup = g;

      // Fade caption
      captionItems.forEach(item => {
        item.classList.toggle('active', parseInt(item.dataset.group) === g);
      });

      // Dim photos
      galleryImgs.forEach(img => {
        img.classList.toggle('dimmed', parseInt(img.dataset.group) !== g);
      });
    }

    wrap.addEventListener('scroll', () => {
      const wrapMidX = wrap.getBoundingClientRect().left + wrap.offsetWidth / 2;
      let activeGroup = 0, minDist = Infinity;

      galleryImgs.forEach(img => {
        const r   = img.getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const d   = Math.abs(mid - wrapMidX);
        if (d < minDist) { minDist = d; activeGroup = parseInt(img.dataset.group); }
      });

      setGroup(activeGroup);
    });

    // Init
    galleryImgs.forEach(img => {
      if (parseInt(img.dataset.group) !== 0) img.classList.add('dimmed');
    });
  }

  // ── PHOTO MODAL VIEWER ──────────────────────
  const photoModal = document.getElementById('photoModal');
  const photoModalImage = document.getElementById('photoModalImage');
  const photoModalCounter = document.getElementById('photoModalCounter');
  const photoModalClose = document.getElementById('photoModalClose');
  const photoModalPrev = document.getElementById('photoModalPrev');
  const photoModalNext = document.getElementById('photoModalNext');

  if (photoModal && galleryImgs.length > 0) {
    let currentPhotoIndex = 0;
    let allPhotos = Array.from(galleryImgs).map(img => img.querySelector('img').src);
    let lastFocusedElement = null;

    // Open modal on gallery image click
    galleryImgs.forEach((galleryImg, index) => {
      const img = galleryImg.querySelector('img');
      img.style.cursor = 'pointer';

      function openModal() {
        lastFocusedElement = document.activeElement;
        currentPhotoIndex = index;
        showPhoto();
        photoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => photoModalClose.focus());
      }

      // Desktop click
      galleryImg.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
      });

      // Mobile tap
      let tapStartX = 0, tapStartY = 0;
      galleryImg.addEventListener('touchstart', (e) => {
        tapStartX = e.touches[0].clientX;
        tapStartY = e.touches[0].clientY;
      }, { passive: true });

      galleryImg.addEventListener('touchend', (e) => {
        const tapEndX = e.changedTouches[0].clientX;
        const tapEndY = e.changedTouches[0].clientY;
        const distX = Math.abs(tapEndX - tapStartX);
        const distY = Math.abs(tapEndY - tapStartY);

        // Only open if it's a tap (minimal movement)
        if (distX < 20 && distY < 20) {
          openModal();
        }
      }, { passive: true });
    });

    function showPhoto() {
      if (allPhotos.length === 0) return;
      photoModalImage.src = allPhotos[currentPhotoIndex];
      photoModalImage.alt = Array.from(galleryImgs)[currentPhotoIndex].querySelector('img').alt || 'Фото';
      photoModalCounter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
    }

    function nextPhoto() {
      currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
      showPhoto();
    }

    function prevPhoto() {
      currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
      showPhoto();
    }

    function closeModal() {
      photoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocusedElement) { lastFocusedElement.focus(); lastFocusedElement = null; }
    }

    // Event listeners
    photoModalNext.addEventListener('click', nextPhoto);
    photoModalPrev.addEventListener('click', prevPhoto);
    photoModalClose.addEventListener('click', closeModal);

    // Close on background click
    photoModal.addEventListener('click', e => {
      if (e.target === photoModal) closeModal();
    });

    // Keyboard navigation + focus trap
    document.addEventListener('keydown', e => {
      if (!photoModal.classList.contains('active')) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusables = [photoModalPrev, photoModalClose, photoModalNext];
        const idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey
          ? focusables[(idx - 1 + focusables.length) % focusables.length]
          : focusables[(idx + 1) % focusables.length];
        next.focus();
      }
    });

    // Swipe navigation on mobile
    let swipeStartX = 0;
    photoModal.addEventListener('touchstart', (e) => {
      if (e.target === photoModal) return;
      swipeStartX = e.touches[0].clientX;
    }, { passive: true });

    photoModal.addEventListener('touchend', (e) => {
      const swipeEndX = e.changedTouches[0].clientX;
      const diff = swipeStartX - swipeEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextPhoto();
        else prevPhoto();
      }
    }, { passive: true });
  }

  // ── ABOUT.HTML SIDEBAR ACTIVE LINK ──────────────
  const docSidebar = document.getElementById('docSidebar');
  if (docSidebar) {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight;

    // Collapsible groups toggle
    docSidebar.querySelectorAll('.doc-sidebar-toggle').forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        const group = toggle.getAttribute('data-group');
        const subitems = docSidebar.querySelector(`.doc-sidebar-subitems[data-group="${group}"]`);

        toggle.classList.toggle('collapsed');
        subitems.classList.toggle('hidden');

        // Update ARIA attributes for accessibility
        const isExpanded = !toggle.classList.contains('collapsed');
        toggle.setAttribute('aria-expanded', isExpanded);
        subitems.setAttribute('aria-hidden', !isExpanded);
      });
    });

    function updateActiveSection() {
      const scrollY = window.scrollY;
      const threshold = navbarHeight + 50;

      let activeId = null;
      let maxOffset = -1;

      const allElements = document.querySelectorAll('.doc-section, .doc-subsection');

      allElements.forEach(el => {
        const elTop = el.offsetTop;
        if (scrollY + threshold >= elTop && elTop > maxOffset) {
          maxOffset = elTop;
          activeId = el.id;
        }
      });

      // Деактивуємо ВСЕ
      docSidebar.querySelectorAll('.doc-sidebar-item.active').forEach(item => {
        item.classList.remove('active');
      });

      // Активуємо ТІЛЬКИ один
      if (activeId) {
        const activeLink = docSidebar.querySelector(`a[href="#${activeId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');

          const group = activeLink.closest('.doc-sidebar-group');
          if (group) {
            const toggle = group.querySelector('.doc-sidebar-toggle');
            const subitems = group.querySelector('.doc-sidebar-subitems');
            if (toggle && subitems) {
              toggle.classList.remove('collapsed');
              subitems.classList.remove('hidden');
              toggle.setAttribute('aria-expanded', 'true');
              subitems.setAttribute('aria-hidden', 'false');
            }
          }
        }
      }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  // ── ACTIVITY GROUP GALLERY SCROLL ──────────────────
  // Photo modal functions (only on pages with modal)
  if (photoModal) {
    let currentGalleryPhotos = [];
    let currentGalleryAlts = [];
    let currentPhotoIndex = 0;
    let lastFocusedEl = null;

    function showPhoto() {
      if (currentGalleryPhotos.length === 0) return;
      photoModalImage.src = currentGalleryPhotos[currentPhotoIndex];
      photoModalImage.alt = currentGalleryAlts[currentPhotoIndex] || 'Фото';
      photoModalCounter.textContent = `${currentPhotoIndex + 1} / ${currentGalleryPhotos.length}`;
    }

    function nextPhoto() {
      currentPhotoIndex = (currentPhotoIndex + 1) % currentGalleryPhotos.length;
      showPhoto();
    }

    function prevPhoto() {
      currentPhotoIndex = (currentPhotoIndex - 1 + currentGalleryPhotos.length) % currentGalleryPhotos.length;
      showPhoto();
    }

    // Initialize all doc-gallery strips
    const docGalleryWraps = document.querySelectorAll('.doc-gallery-strip-wrap');
    docGalleryWraps.forEach((docGalleryWrap, wrapIdx) => {
      const docGalleryStrip = docGalleryWrap.querySelector('.doc-gallery-strip');
      if (!docGalleryStrip) return;
      const docGalleryImgs = docGalleryStrip.querySelectorAll('.doc-gallery-img');

      // Drag-to-scroll
      let isDragging = false, dragStartX = 0, scrollStartX = 0;

      docGalleryWrap.addEventListener('mousedown', e => {
        isDragging = true;
        dragStartX = e.pageX - docGalleryWrap.offsetLeft;
        scrollStartX = docGalleryWrap.scrollLeft;
        docGalleryWrap.style.cursor = 'grabbing';
      });
      window.addEventListener('mouseup', () => {
        isDragging = false;
        docGalleryWrap.style.cursor = 'grab';
      });
      docGalleryWrap.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        docGalleryWrap.scrollLeft = scrollStartX - (e.pageX - docGalleryWrap.offsetLeft - dragStartX);
      });

      // Wheel-scroll on hover
      docGalleryWrap.addEventListener('wheel', e => {
        e.preventDefault();
        docGalleryWrap.scrollLeft += e.deltaX || e.deltaY;
      }, { passive: false });

      // Photo viewer modal
      const allDocPhotos = Array.from(docGalleryImgs).map(el => el.querySelector('img').src);
      const allDocAlts   = Array.from(docGalleryImgs).map(el => el.querySelector('img').alt || 'Фото');

      // Open modal on image click
      docGalleryImgs.forEach((el, index) => {
        el.addEventListener('click', (e) => {
          if (isDragging) return;
          lastFocusedEl = document.activeElement;
          currentGalleryPhotos = allDocPhotos;
          currentGalleryAlts = allDocAlts;
          currentPhotoIndex = index;
          showPhoto();
          photoModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          requestAnimationFrame(() => document.getElementById('photoModalClose').focus());
        });
      });
    });

    // Modal button handlers
    document.getElementById('photoModalNext').addEventListener('click', nextPhoto);
    document.getElementById('photoModalPrev').addEventListener('click', prevPhoto);
    document.getElementById('photoModalClose').addEventListener('click', () => {
      photoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocusedEl) { lastFocusedEl.focus(); lastFocusedEl = null; }
    });

    // Keyboard navigation + focus trap
    document.addEventListener('keydown', e => {
      if (!photoModal.classList.contains('active')) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') {
        photoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocusedEl) { lastFocusedEl.focus(); lastFocusedEl = null; }
      }
      if (e.key === 'Tab') {
        const mc = document.getElementById('photoModalClose');
        const mp = document.getElementById('photoModalPrev');
        const mn = document.getElementById('photoModalNext');
        const focusables = [mp, mc, mn];
        const idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey
          ? focusables[(idx - 1 + focusables.length) % focusables.length]
          : focusables[(idx + 1) % focusables.length];
        next.focus();
      }
    });

    // Swipe navigation
    let swipeStartX = 0;
    photoModal.addEventListener('touchstart', (e) => {
      if (e.target === photoModal) return;
      swipeStartX = e.touches[0].clientX;
    }, { passive: true });

    photoModal.addEventListener('touchend', (e) => {
      const swipeEndX = e.changedTouches[0].clientX;
      const diff = swipeStartX - swipeEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextPhoto();
        else prevPhoto();
      }
    }, { passive: true });
  }

});
