/**
 * T91 DESIGNS STUDIO - INTERACTIVE ENGINE
 * Handlers for Sticky Nav, Mobile Drawer, Before/After Slider,
 * Multi-Step Lead Qualification, Case Study Modal, and FAQs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initHeroSlider();
  initPortfolioFilters();
  initBeforeAfterSlider();
  initLeadForm();
  initFaqAccordion();
  initCaseStudyModal();
});

/* 1. STICKY HEADER GLASSMORPHISM ON SCROLL */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. MOBILE DRAWER MENU */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* 3. HERO SLIDER AUTO-TRANSITION */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  let currentIdx = 0;
  setInterval(() => {
    slides[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slides.length;
    slides[currentIdx].classList.add('active');
  }, 5500);
}

/* 4. PORTFOLIO CATEGORY FILTER */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. INTERACTIVE BEFORE / AFTER SLIDER */
function initBeforeAfterSlider() {
  const containers = document.querySelectorAll('.before-after-container');

  containers.forEach(container => {
    const beforeWrap = container.querySelector('.before-img-wrap');
    const handle = container.querySelector('.before-after-slider-handle');
    let isDown = false;

    if (!beforeWrap || !handle) return;

    const moveSlider = (e) => {
      const rect = container.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = pageX - rect.left;

      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      beforeWrap.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    };

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      moveSlider(e);
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      moveSlider(e);
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
      isDown = true;
      moveSlider(e);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      moveSlider(e);
    }, { passive: true });
  });
}

/* 6. MULTI-STEP LEAD QUALIFICATION FORM */
function initLeadForm() {
  const form = document.getElementById('consultation-lead-form');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const stepNodes = document.querySelectorAll('.step-indicator-node');
  const nextBtns = form.querySelectorAll('.btn-next-step');
  const prevBtns = form.querySelectorAll('.btn-prev-step');
  let currentStep = 0;

  const updateSteps = () => {
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx === currentStep);
    });

    stepNodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx === currentStep) {
        node.classList.add('active');
      } else if (idx < currentStep) {
        node.classList.add('completed');
      }
    });
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validate inputs in current step
      const activeStepEl = steps[currentStep];
      const requiredInputs = activeStepEl.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#EA5834';
          isValid = false;
        } else {
          input.style.borderColor = 'rgba(26, 62, 53, 0.12)';
        }
      });

      // Radios validation if any in step
      const radioGroups = {};
      activeStepEl.querySelectorAll('input[type="radio"][required]').forEach(r => {
        radioGroups[r.name] = true;
      });
      for (const name in radioGroups) {
        const checked = activeStepEl.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          isValid = false;
          alert('Please select an option to continue.');
          return;
        }
      }

      if (!isValid) return;

      if (currentStep < steps.length - 1) {
        currentStep++;
        updateSteps();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateSteps();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Instant Lead Confirmation UX
    const leadFormCard = document.querySelector('.lead-form-card');
    if (leadFormCard) {
      leadFormCard.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="width: 70px; height: 70px; background: #EA5834; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">✓</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--color-forest); margin-bottom: 0.75rem;">Consultation Confirmed, ${data.fullName || 'Valued Client'}!</h3>
          <p style="color: var(--color-muted); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">Our Senior Pune Design Lead, <strong>Sohan Joshi</strong>, will reach out to you within 2 business hours on <strong>${data.mobile || '+91'}</strong> to schedule your site audit in ${data.propertyArea || 'Pune'}.</p>
          <div style="background: var(--color-sand); padding: 1.25rem; border-radius: 4px; display: inline-block; text-align: left; margin-bottom: 2rem; font-size: 0.88rem;">
            <div><strong>Contact Person:</strong> Sohan Joshi (+91 7507633133)</div>
            <div><strong>Location:</strong> ${data.propertyArea || 'Pune'}</div>
            <div><strong>Scope:</strong> ${data.serviceRequired || 'Full Turnkey'}</div>
            <div><strong>Configuration:</strong> ${data.propertyConfig || '3BHK/4BHK'}</div>
            <div><strong>Allocated Budget:</strong> ${data.budgetRange || 'Flexible'}</div>
          </div>
          <div>
            <a href="https://wa.me/917507633133?text=Hello%20Sohan%20Joshi%20(T91%20Designs%20Studio)%2C%20I%20just%20submitted%20a%20consultation%20request%20for%20my%20${encodeURIComponent(data.propertyConfig || 'home')}%20in%20${encodeURIComponent(data.propertyArea || 'Pune')}." target="_blank" class="btn btn-primary" style="gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.983.54 1.811.79 2.796.79 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.776-5.768-5.776zm0 10.428c-.887 0-1.638-.24-2.349-.661l-.168-.1-1.744.457.466-1.7-.11-.176a4.673 4.673 0 0 1-.722-2.482c0-2.584 2.102-4.686 4.687-4.686 2.584 0 4.686 2.102 4.686 4.686 0 2.585-2.102 4.662-4.746 4.662z"/></svg>
              Chat with Sohan Joshi on WhatsApp
            </a>
          </div>
        </div>
      `;
    }
  });
}

/* 7. FAQ ACCORDION */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // close all others
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 8. CASE STUDY MODAL */
const caseStudiesData = {
  koregaon: {
    title: '4BHK Ultra-Luxury Penthouse',
    location: 'Boat Club Road / Koregaon Park, Pune',
    area: '4,250 sq. ft.',
    timeline: '16 Weeks',
    scope: 'Complete Turnkey Civil & Interior Styling',
    description: 'Designed for a high-profile industrialist family in Pune, this penthouse harmonizes understated quiet luxury with Pune’s natural sunlight. Incorporating acoustic ceiling treatments, Italian Statuario marble, fluted walnut paneling, and an automated bioclimatic terrace garden overlooking the Mula-Mutha river.',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    materials: ['Italian Statuario Marble', 'American Walnut Veneer', 'Custom Brass Lighting Fixtures', 'Acoustic Fluted Panels']
  },
  baner: {
    title: 'Modern Minimalist Villa',
    location: 'Baner Hills, Pune',
    area: '5,800 sq. ft.',
    timeline: '24 Weeks',
    scope: 'Turnkey Architectural Renovation & Interiors',
    description: 'An architectural overhaul transforming a dated concrete villa into an open, climate-responsive sanctuary. Large sliding glass fenestrations, double-height living areas with cross-ventilation designed specifically for Pune breezy evenings, and Vaastu-aligned central courtyard geometry.',
    beforeImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    materials: ['Microcement Flooring', 'Teakwood Joinery', 'Powder-coated Thermal-break Aluminum', 'Terracotta Louvers']
  },
  kalyani: {
    title: 'Boutique Creative Workspace',
    location: 'Kalyani Nagar, Pune',
    area: '3,400 sq. ft.',
    timeline: '10 Weeks',
    scope: 'Commercial Interior Execution & Ergonomics',
    description: 'A forward-thinking executive hub tailored for a Pune-based venture capital firm. Features acoustic privacy pods, bespoke raw terrazzo conference tables, warm 2700K indirect mood illumination, and biophilic moss walls.',
    beforeImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    materials: ['Custom Terrazzo Slabs', 'Black Powdered Mild Steel', 'Acoustic PET Felt baffles', 'Natural Oak Accents']
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openTriggers = document.querySelectorAll('.open-case-study');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project') || 'koregaon';
      const data = caseStudiesData[projectKey];

      if (!data) return;

      const titleEl = modal.querySelector('.modal-project-title');
      const locEl = modal.querySelector('.modal-project-loc');
      const areaEl = modal.querySelector('.modal-project-area');
      const timeEl = modal.querySelector('.modal-project-time');
      const scopeEl = modal.querySelector('.modal-project-scope');
      const descEl = modal.querySelector('.modal-project-desc');
      const matListEl = modal.querySelector('.modal-project-materials');
      const beforeImgEl = modal.querySelector('.modal-before-img');
      const afterImgEl = modal.querySelector('.modal-after-img');

      if (titleEl) titleEl.textContent = data.title;
      if (locEl) locEl.textContent = data.location;
      if (areaEl) areaEl.textContent = data.area;
      if (timeEl) timeEl.textContent = data.timeline;
      if (scopeEl) scopeEl.textContent = data.scope;
      if (descEl) descEl.textContent = data.description;
      if (beforeImgEl) beforeImgEl.src = data.beforeImg;
      if (afterImgEl) afterImgEl.src = data.afterImg;

      if (matListEl) {
        matListEl.innerHTML = data.materials.map(m => `<li><span style="color:#EA5834;">•</span> ${m}</li>`).join('');
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}
