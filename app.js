/**
 * GrowthPilot — Interactive Functionality & UX Behaviors
 * Performance Marketing Agency
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons with bold premium stroke
  if (window.lucide) {
    lucide.createIcons({
      attrs: {
        'stroke-width': 2.2
      }
    });
  }

  // 2. Dynamic Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Sticky Navbar Blur & Shadow on Scroll
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');
  const navIcon = document.getElementById('navIcon');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileToggle.innerHTML = '<i data-lucide="x"></i>';
      } else {
        mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
      }
      if (window.lucide) lucide.createIcons();
    });

    // Close mobile menu on clicking any link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // 4b. Mega Menu Dropdown Click / Touch Support
  const servicesDropdown = document.getElementById('servicesDropdown');
  const servicesDropdownBtn = document.getElementById('servicesDropdownBtn');

  if (servicesDropdown && servicesDropdownBtn) {
    // On click or touch
    servicesDropdownBtn.addEventListener('click', (e) => {
      // If clicking directly on desktop without navigation
      if (window.innerWidth > 991) {
        // Allow hover on desktop, or click to toggle
        const isOpen = servicesDropdown.classList.toggle('open');
        servicesDropdownBtn.setAttribute('aria-expanded', isOpen);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!servicesDropdown.contains(e.target)) {
        servicesDropdown.classList.remove('open');
        servicesDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. Active Navbar Link on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // 6. Service Card CTA Clicks Auto-Select Form Checkbox
  const serviceCtas = document.querySelectorAll('.service-card-cta');
  serviceCtas.forEach(cta => {
    cta.addEventListener('click', (e) => {
      const serviceName = cta.getAttribute('data-service');
      if (serviceName) {
        const checkboxes = document.querySelectorAll('input[name="services"]');
        checkboxes.forEach(cb => {
          if (cb.value === serviceName) {
            cb.checked = true;
            cb.closest('.chip-checkbox-label').classList.add('checked');
          }
        });
      }
    });
  });

  // Checkbox Chip Visual State Sync
  const chipCheckboxes = document.querySelectorAll('.chip-checkbox-label input[type="checkbox"]');
  chipCheckboxes.forEach(cb => {
    // Initial state
    if (cb.checked) {
      cb.closest('.chip-checkbox-label').classList.add('checked');
    }
    cb.addEventListener('change', () => {
      if (cb.checked) {
        cb.closest('.chip-checkbox-label').classList.add('checked');
      } else {
        cb.closest('.chip-checkbox-label').classList.remove('checked');
      }
    });
  });

  // 7. FAQ Accordion Functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 8. Contact Form Handling & Validation
  const contactForm = document.getElementById('growthContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('businessEmail');
      const companyInput = document.getElementById('companyName');
      const websiteInput = document.getElementById('websiteUrl');
      const budgetInput = document.getElementById('monthlyBudget');

      // Clear previous error states
      [nameInput, emailInput, companyInput, websiteInput, budgetInput].forEach(inp => {
        if (inp) inp.classList.remove('error');
      });
      formFeedback.className = 'form-feedback-alert';
      formFeedback.style.display = 'none';

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        isValid = false;
      }

      // Validate Company
      if (!companyInput.value.trim()) {
        companyInput.classList.add('error');
        isValid = false;
      }

      // Validate Website
      if (!websiteInput.value.trim() || !websiteInput.value.includes('.')) {
        websiteInput.classList.add('error');
        isValid = false;
      }

      // Validate Budget
      if (!budgetInput.value) {
        budgetInput.classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        formFeedback.textContent = 'Please fill out all required fields with valid details.';
        formFeedback.classList.add('error');
        return;
      }

      // Valid: Simulate Submission with loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Analyzing Brand Parameters...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        if (window.lucide) lucide.createIcons();

        // Show Success Feedback
        formFeedback.innerHTML = `
          <strong>Growth Audit Request Received!</strong><br>
          Thank you ${nameInput.value.trim()}. Our lead performance strategist will review ${companyInput.value.trim()}'s metrics and send a personalized scaling roadmap within 24 business hours to ${emailInput.value.trim()}.
        `;
        formFeedback.classList.add('success');

        // Reset form inputs except feedback
        contactForm.reset();
        document.querySelectorAll('.chip-checkbox-label').forEach(chip => chip.classList.remove('checked'));
      }, 1200);
    });
  }

  // 9. Privacy Policy & Terms Modal
  const legalModal = document.getElementById('legalModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const privacyBtn = document.getElementById('privacyPolicyBtn');
  const termsBtn = document.getElementById('termsBtn');

  const openModal = (title, bodyHtml) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal.classList.contains('open')) {
      closeModal();
    }
  });

  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(
        'GrowthPilot Privacy Policy',
        `
        <p><strong>Effective Date:</strong> January 2026</p>
        <p style="margin-top: 12px;">GrowthPilot ("we", "our", or "us") respects your privacy. This policy outlines how we handle information gathered through our website and audit request forms.</p>
        <h4 style="color: #FFF; margin: 16px 0 8px 0;">Information Collection</h4>
        <p>We only collect information voluntarily provided by prospective clients (such as name, brand website, monthly ad budget, and contact email) exclusively to conduct marketing viability audits and schedule strategy sessions.</p>
        <h4 style="color: #FFF; margin: 16px 0 8px 0;">Data Protection</h4>
        <p>We do not sell, rent, or distribute client confidential business metrics or personal information to third parties. All submissions are stored encrypted and processed under industry standard security protocols.</p>
        `
      );
    });
  }

  if (termsBtn) {
    termsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(
        'GrowthPilot Terms & Conditions',
        `
        <p><strong>Last Updated:</strong> January 2026</p>
        <p style="margin-top: 12px;">Welcome to GrowthPilot. By accessing this website or scheduling an audit, you agree to the following conditions:</p>
        <h4 style="color: #FFF; margin: 16px 0 8px 0;">Performance Strategy</h4>
        <p>Growth audit recommendations are tailored assessments based on advertiser disclosures, historic market benchmarks, and platform algorithms. Actual returns depend on market demand, supply chain capacity, and product-market viability.</p>
        <h4 style="color: #FFF; margin: 16px 0 8px 0;">Intellectual Property</h4>
        <p>All creative methodologies, framework visualizations, and brand assets displayed on this website are the proprietary intellectual property of GrowthPilot.</p>
        `
      );
    });
  }

  // 10. Interactive Growth Simulator Engine
  const simSpend = document.getElementById('simSpend');
  const simRevenue = document.getElementById('simRevenue');
  const simAov = document.getElementById('simAov');

  if (simSpend && simRevenue && simAov) {
    const simSpendVal = document.getElementById('simSpendVal');
    const simRevenueVal = document.getElementById('simRevenueVal');
    const simAovVal = document.getElementById('simAovVal');
    const baselineRoasDisplay = document.getElementById('baselineRoasDisplay');
    const baselineOrdersDisplay = document.getElementById('baselineOrdersDisplay');

    const projectedRevVal = document.getElementById('projectedRevVal');
    const unlockedRevVal = document.getElementById('unlockedRevVal');
    const roasBefore = document.getElementById('roasBefore');
    const roasAfter = document.getElementById('roasAfter');
    const roasLiftTag = document.getElementById('roasLiftTag');
    const ordersBefore = document.getElementById('ordersBefore');
    const ordersAfter = document.getElementById('ordersAfter');
    const ordersLiftTag = document.getElementById('ordersLiftTag');

    const fmtCurr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
    const fmtNum = (n) => Math.round(n).toLocaleString('en-IN');

    const updateSliderTrack = (input) => {
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const val = parseFloat(input.value) || 0;
      const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
      input.style.background = `linear-gradient(to right, #00C853 0%, #00E676 ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`;
    };

    const calculateSimulation = () => {
      const spend = parseFloat(simSpend.value) || 150000;
      const currentRev = parseFloat(simRevenue.value) || 360000;
      const aov = parseFloat(simAov.value) || 1499;

      // Automatically calculate Current ROAS
      const currentRoas = parseFloat((currentRev / Math.max(1000, spend)).toFixed(2));

      // Update pills
      if (simSpendVal) simSpendVal.textContent = fmtCurr(spend);
      if (simRevenueVal) simRevenueVal.textContent = fmtCurr(currentRev);
      if (simAovVal) simAovVal.textContent = fmtCurr(aov);

      // Update slider gradient tracks
      updateSliderTrack(simSpend);
      updateSliderTrack(simRevenue);
      updateSliderTrack(simAov);

      // Baseline figures
      const baselineOrders = Math.round(currentRev / Math.max(1, aov));

      if (baselineRoasDisplay) baselineRoasDisplay.textContent = currentRoas.toFixed(1) + 'x';
      if (baselineOrdersDisplay) baselineOrdersDisplay.textContent = '~' + fmtNum(baselineOrders);

      // Full-funnel growth multipliers
      let roasMultiplier = 1.68;
      if (currentRoas >= 3.5) roasMultiplier = 1.40;
      else if (currentRoas >= 2.6) roasMultiplier = 1.52;

      const projectedRoas = parseFloat((currentRoas * roasMultiplier).toFixed(1));
      const projectedRev = Math.round(spend * projectedRoas);
      const unlockedRev = Math.max(0, projectedRev - currentRev);

      // 15% AOV lift via smart bundles & CRO checkout loops
      const projectedAov = Math.round(aov * 1.15);
      const projectedOrders = Math.round(projectedRev / Math.max(1, projectedAov));

      const roasLiftPct = Math.round(((projectedRoas - currentRoas) / Math.max(0.1, currentRoas)) * 100);
      const ordersLiftPct = Math.round(((projectedOrders - baselineOrders) / Math.max(1, baselineOrders)) * 100);

      // Update Result Elements
      if (projectedRevVal) projectedRevVal.textContent = fmtCurr(projectedRev);
      if (unlockedRevVal) unlockedRevVal.textContent = '+' + fmtCurr(unlockedRev);

      if (roasBefore) roasBefore.textContent = currentRoas.toFixed(1) + 'x';
      if (roasAfter) roasAfter.textContent = projectedRoas.toFixed(1) + 'x';
      if (roasLiftTag) roasLiftTag.textContent = '+' + roasLiftPct + '% Lift';

      if (ordersBefore) ordersBefore.textContent = fmtNum(baselineOrders);
      if (ordersAfter) ordersAfter.textContent = fmtNum(projectedOrders);
      if (ordersLiftTag) ordersLiftTag.textContent = '+' + ordersLiftPct + '%';
    };

    // Attach real-time input listeners
    ['input', 'change'].forEach((evt) => {
      simSpend.addEventListener(evt, calculateSimulation);
      simRevenue.addEventListener(evt, calculateSimulation);
      simAov.addEventListener(evt, calculateSimulation);
    });

    // Initial calculation on load
    calculateSimulation();
  }

});
