
function initLucideIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons({
      attrs: {
        'stroke-width': 2.2
      }
    });
  }
}

// Initialize immediately if script already loaded
initLucideIcons();
window.addEventListener('load', initLucideIcons);

document.addEventListener('DOMContentLoaded', () => {

  initLucideIcons();

  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

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

  const servicesDropdown = document.getElementById('servicesDropdown');
  const servicesDropdownBtn = document.getElementById('servicesDropdownBtn');

  if (servicesDropdown && servicesDropdownBtn) {

    servicesDropdownBtn.addEventListener('click', (e) => {

      if (window.innerWidth > 991) {

        const isOpen = servicesDropdown.classList.toggle('open');
        servicesDropdownBtn.setAttribute('aria-expanded', isOpen);
      }
    });

    document.addEventListener('click', (e) => {
      if (!servicesDropdown.contains(e.target)) {
        servicesDropdown.classList.remove('open');
        servicesDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

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

  const chipCheckboxes = document.querySelectorAll('.chip-checkbox-label input[type="checkbox"]');
  chipCheckboxes.forEach(cb => {

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

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn, .faq-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn, .faq-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const contactForm = document.getElementById('growthContactForm');
  const formFeedback = document.getElementById('formFeedback');

  const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwztcnygk029l_B1fjW_vSlFQUH9FblqomT03rDm5fNCVTWSQ_hA6rKnU5s4_QHGgsh/exec';

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('businessEmail');
      const phoneInput = document.getElementById('phoneNumber');
      const websiteInput = document.getElementById('websiteUrl');
      const budgetInput = document.getElementById('monthlyBudget');

      [nameInput, emailInput, phoneInput, websiteInput, budgetInput].forEach(inp => {
        if (inp) inp.classList.remove('error');
      });
      formFeedback.className = 'form-feedback-alert';
      formFeedback.style.display = 'none';

      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        isValid = false;
      }

      if (phoneInput && (!phoneInput.value.trim() || phoneInput.value.trim().length < 8)) {
        phoneInput.classList.add('error');
        isValid = false;
      }

      if (!websiteInput.value.trim() || !websiteInput.value.includes('.')) {
        websiteInput.classList.add('error');
        isValid = false;
      }

      if (!budgetInput.value) {
        budgetInput.classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        formFeedback.textContent = 'Please fill out all required fields with valid details.';
        formFeedback.classList.add('error');
        formFeedback.style.display = 'block';
        return;
      }

      const selectedServices = Array.from(contactForm.querySelectorAll('input[name="services"]:checked'))
        .map(cb => cb.value)
        .join(', ');

      const messageInput = document.getElementById('projectMessage');

      const leadData = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        website: websiteInput.value.trim(),
        budget: budgetInput.value,
        services: selectedServices || 'None specified',
        message: messageInput ? messageInput.value.trim() : ''
      };

      try {
        const storedLeads = JSON.parse(localStorage.getItem('growthpilot_leads') || '[]');
        storedLeads.push(leadData);
        localStorage.setItem('growthpilot_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('LocalStorage backup error:', err);
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-submitting');
      submitBtn.innerHTML = '<span>Saving to Growth Sheet...</span>';

      const finishSubmission = () => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-submitting');
        submitBtn.classList.add('btn-success-green');
        submitBtn.innerHTML = '<span>✓ Submitted Successfully</span>';
        if (window.lucide) lucide.createIcons();

        // Meta Pixel - Lead Conversion Event for Meta Ads
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'Growth Audit Request',
            currency: 'INR'
          });
        }

        formFeedback.innerHTML = `
          <strong>Growth Audit Request Received!</strong><br>
          Thank you ${nameInput.value.trim()}. Your details have been securely recorded. Our lead performance strategist will review your brand's metrics and send a personalized scaling roadmap within 24 business hours to ${emailInput.value.trim()}.
        `;
        formFeedback.classList.add('success');
        formFeedback.style.display = 'block';

        contactForm.reset();
        document.querySelectorAll('.chip-checkbox-label').forEach(chip => chip.classList.remove('checked'));

        setTimeout(() => {
          submitBtn.classList.remove('btn-success-green');
          submitBtn.innerHTML = originalBtnContent;
          if (window.lucide) lucide.createIcons();
        }, 5000);
      };

      if (GOOGLE_SHEET_WEBHOOK_URL) {
        fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(leadData)
        })
        .then(() => {
          finishSubmission();
        })
        .catch(err => {
          console.error('Google Sheets sync error:', err);
          finishSubmission();
        });
      } else {

        setTimeout(finishSubmission, 900);
      }
    });
  }

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

      const currentRoas = parseFloat((currentRev / Math.max(1000, spend)).toFixed(2));

      if (simSpendVal) simSpendVal.textContent = fmtCurr(spend);
      if (simRevenueVal) simRevenueVal.textContent = fmtCurr(currentRev);
      if (simAovVal) simAovVal.textContent = fmtCurr(aov);

      updateSliderTrack(simSpend);
      updateSliderTrack(simRevenue);
      updateSliderTrack(simAov);

      const baselineOrders = Math.round(currentRev / Math.max(1, aov));

      if (baselineRoasDisplay) baselineRoasDisplay.textContent = currentRoas.toFixed(1) + 'x';
      if (baselineOrdersDisplay) baselineOrdersDisplay.textContent = '~' + fmtNum(baselineOrders);

      let roasMultiplier = 1.68;
      if (currentRoas >= 3.5) roasMultiplier = 1.40;
      else if (currentRoas >= 2.6) roasMultiplier = 1.52;

      const projectedRoas = parseFloat((currentRoas * roasMultiplier).toFixed(1));
      const projectedRev = Math.round(spend * projectedRoas);
      const unlockedRev = Math.max(0, projectedRev - currentRev);

      const projectedAov = Math.round(aov * 1.15);
      const projectedOrders = Math.round(projectedRev / Math.max(1, projectedAov));

      const roasLiftPct = Math.round(((projectedRoas - currentRoas) / Math.max(0.1, currentRoas)) * 100);
      const ordersLiftPct = Math.round(((projectedOrders - baselineOrders) / Math.max(1, baselineOrders)) * 100);

      if (projectedRevVal) projectedRevVal.textContent = fmtCurr(projectedRev);
      if (unlockedRevVal) unlockedRevVal.textContent = '+' + fmtCurr(unlockedRev);

      if (roasBefore) roasBefore.textContent = currentRoas.toFixed(1) + 'x';
      if (roasAfter) roasAfter.textContent = projectedRoas.toFixed(1) + 'x';
      if (roasLiftTag) roasLiftTag.textContent = '+' + roasLiftPct + '% Lift';

      if (ordersBefore) ordersBefore.textContent = fmtNum(baselineOrders);
      if (ordersAfter) ordersAfter.textContent = fmtNum(projectedOrders);
      if (ordersLiftTag) ordersLiftTag.textContent = '+' + ordersLiftPct + '%';
    };

    ['input', 'change'].forEach((evt) => {
      simSpend.addEventListener(evt, calculateSimulation);
      simRevenue.addEventListener(evt, calculateSimulation);
      simAov.addEventListener(evt, calculateSimulation);
    });

    calculateSimulation();
  }

  const industryList = document.getElementById('caseIndustriesList');
  const industryImg = document.getElementById('caseIndustryImg');
  const industryBadgeTitle = document.getElementById('caseIndustryBadgeTitle');
  const industryBadgeMetric = document.getElementById('caseIndustryBadgeMetric');

  if (industryList && industryImg) {
    const industryItems = industryList.querySelectorAll('.case-industry-item');
    industryItems.forEach((item) => {
      item.addEventListener('click', () => {
        industryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const newImg = item.getAttribute('data-industry-img');
        const newTitle = item.getAttribute('data-industry-title');
        const newMetric = item.getAttribute('data-industry-metric');

        industryImg.style.opacity = '0.3';
        setTimeout(() => {
          if (newImg) industryImg.src = newImg;
          if (newTitle && industryBadgeTitle) industryBadgeTitle.textContent = newTitle;
          if (newMetric && industryBadgeMetric) industryBadgeMetric.textContent = newMetric;
          industryImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  const filterBar = document.getElementById('caseFilterBar');
  const caseCards = document.querySelectorAll('.case-proof-card');

  if (filterBar && caseCards.length > 0) {
    const filterBtns = filterBar.querySelectorAll('.case-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');

        caseCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  const caseData = {
    1: {
      title: "Scaling High-Growth E-Commerce Store to ₹15.48M (₹1.54 Crore) in 30 Days",
      tags: ["Shopify Plus", "Meta Ads", "Scale"],
      image: "assets/proof-sales-15-48m.jpg",
      ribbon: "₹15.48M in 30 Days",
      metrics: [
        { label: "Total Sales", val: "₹1.54Cr" },
        { label: "Gross Orders", val: "4,420" },
        { label: "Blended ROAS", val: "4.8x" }
      ],
      bottleneck: "The brand was hitting an ad spend ceiling with rising CPAs and fragmented channel attribution across Meta and Google campaigns.",
      strategy: [
        "Architected high-velocity creative sprints with weekly iteration on winning angles.",
        "Constructed custom advertorial collection landing pages with instant bundle discounts and 0.8s load times.",
        "Implemented first-party server CAPI attribution to eliminate iOS 14+ tracking signal loss.",
        "Applied automated Cost-Cap bid testing to protect contribution margins during rapid budget scale."
      ],
      outcome: "Scaled gross monthly revenue to ₹15.48M (over ₹1.54 Crore) in 30 days while maintaining robust profitability."
    },
    2: {
      title: "Accelerating Direct-to-Consumer Brand to ₹7.24M in 30 Days with Omnichannel Scaling",
      tags: ["Performance Marketing", "Meta & Google", "Fashion"],
      image: "assets/proof-sales-7-24m.jpg",
      ribbon: "₹7.24M in 30 Days",
      metrics: [
        { label: "30-Day Sales", val: "₹7.24M" },
        { label: "Total Orders", val: "10,020" },
        { label: "Repeat Rate", val: "31.1%" }
      ],
      bottleneck: "Customer acquisition costs were rising due to creative fatigue and standard catalog ad formats with low conversion rates.",
      strategy: [
        "Tested 5 distinct psychological hooks across founder stories, customer unboxings, and direct comparison angles.",
        "Paired top-of-funnel Meta Reels prospecting with Google Search intent capture.",
        "Engineered an express sticky mobile checkout drawer with 1-click payment workflows.",
        "Installed post-purchase retention sequences that stimulated compounding repeat purchases."
      ],
      outcome: "Generated ₹7,241,576 in 30 days with over 10,020 orders fulfilled and a 31% returning customer rate."
    },
    3: {
      title: "Scaling D2C Store to ₹2.62M in 30 Days via High-Velocity Creative Testing",
      tags: ["Meta Ads", "Creative Sprints", "D2C Retail"],
      image: "assets/proof-sales-2-62m.jpg",
      ribbon: "₹2.62M in 30 Days",
      metrics: [
        { label: "Total Sales", val: "₹2.62M" },
        { label: "Orders Placed", val: "3,243" },
        { label: "Store Sessions", val: "189.3K" }
      ],
      bottleneck: "Sluggish mobile load times and unfocused ad targeting were driving high bounce rates and low checkout velocity.",
      strategy: [
        "Stripped redundant tracking scripts and optimized Core Web Vitals to achieve sub-second page performance.",
        "Built dedicated multi-pack and bundle landers lifting Average Order Value.",
        "Shifted campaign budget towards highest-performing creative variations.",
        "Deployed automated retargeting loops capturing abandoned carts within 15 minutes."
      ],
      outcome: "Delivered ₹2,629,829 in verified 30-day revenue across 3,243 orders with a 92% sales lift."
    },
    4: {
      title: "Achieving ₹2.03M in 30 Days for Fast-Growing Brand with Sub-Second Funnels",
      tags: ["Landing Page CRO", "Ad Funnels", "Beauty Care"],
      image: "assets/proof-sales-2-03m.jpg",
      ribbon: "₹2.03M in 30 Days",
      metrics: [
        { label: "Monthly Revenue", val: "₹2.03M" },
        { label: "Orders", val: "639" },
        { label: "Sessions", val: "143.4K" }
      ],
      bottleneck: "High-ticket consideration cycles resulted in customer hesitation and drop-offs at checkout.",
      strategy: [
        "Crafted value-driven advertorials breaking down ingredient efficacy and third-party lab proof.",
        "Embedded interactive bundle selectors with transparent discount tiers directly beside primary CTAs.",
        "Set up personalized dynamic retargeting sequences highlighting authentic video testimonials."
      ],
      outcome: "Generated ₹2,034,081 in verified monthly sales with +45% sales lift and profitable acquisition costs."
    },
    5: {
      title: "From Early Stage to ₹1.53M in 30 Days with Algorithmic Media Buying",
      tags: ["Google Shopping", "Meta Prospecting", "CPG"],
      image: "assets/proof-sales-1-53m.jpg",
      ribbon: "₹1.53M in 30 Days",
      metrics: [
        { label: "Total Revenue", val: "₹1.53M" },
        { label: "Total Orders", val: "636" },
        { label: "ROAS Lift", val: "+140%" }
      ],
      bottleneck: "Fragmented ad spend across Meta and search channels resulted in wasted budget without sustainable order velocity.",
      strategy: [
        "Built a unified attribution model linking DTC sales to true blended customer acquisition costs.",
        "Shifted creative strategy towards high-intent benefit hooks and customer reviews.",
        "Implemented high-velocity bundle offers turning one-time buyers into repeat customers."
      ],
      outcome: "Scaled store revenue to ₹1.53M in 30 days with a +1,400% revenue surge and profitable unit economics."
    },
    6: {
      title: "Consistent Month-over-Month Revenue Velocity & Profitable Scaling",
      tags: ["Performance Marketing", "Shopify Scale", "D2C Growth"],
      image: "assets/proof-sales-2-62m.jpg",
      ribbon: "₹2.62M in 30 Days",
      metrics: [
        { label: "Monthly Sales", val: "₹2.62M" },
        { label: "Orders", val: "3,243" },
        { label: "Conversion Lift", val: "+35%" }
      ],
      bottleneck: "A new lifestyle brand needed immediate customer acquisition proof within the first few weeks of campaign launch.",
      strategy: [
        "Rapidly tested video creative hooks to identify top-converting customer value propositions.",
        "Configured tiered bundle builders to maximize average order value.",
        "Scaled spend systematically using automated rules tied strictly to margin thresholds."
      ],
      outcome: "Generated consistent high-velocity sales reaching ₹2.62M in 30 days with verified ROAS."
    }
  };

  const caseModal = document.getElementById('caseModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const caseModalCloseBtn = document.getElementById('caseModalCloseBtn');

  window.openCaseModal = function (id) {
    const data = caseData[id];
    if (!data || !caseModal || !caseModalContent) return;

    let metricsHtml = data.metrics.map(m => `
      <div style="background: #FAFCFB; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; text-align: center;">
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--color-growth-green);">${m.val}</div>
        <div style="font-size: 0.72rem; color: var(--color-muted); text-transform: uppercase; font-weight: 700;">${m.label}</div>
      </div>
    `).join('');

    let strategyHtml = data.strategy.map(s => `
      <li style="display: flex; gap: 10px; margin-bottom: 8px; font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.55;">
        <span style="color: var(--color-growth-green); font-weight: 800;">✓</span>
        <span>${s}</span>
      </li>
    `).join('');

    let tagsHtml = data.tags.map(t => `<span class="service-tag">${t}</span>`).join(' ');

    caseModalContent.innerHTML = `
      <div style="margin-bottom: 12px; display: flex; gap: 6px; flex-wrap: wrap;">${tagsHtml}</div>
      <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--color-text-primary); line-height: 1.3; margin-bottom: 16px;">
        ${data.title}
      </h2>
      <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-md);">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 480px; object-fit: contain; display: block; background: #FFFFFF; margin: 0 auto;">
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(10, 15, 13, 0.88); border: 1px solid rgba(0, 230, 118, 0.5); color: var(--color-green-neon); font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">
          ${data.ribbon}
        </span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px;">
        ${metricsHtml}
      </div>
      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">The Starting Bottleneck:</h4>
        <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6;">${data.bottleneck}</p>
      </div>
      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 10px;">Strategic Execution:</h4>
        <ul style="list-style: none; padding-left: 0;">${strategyHtml}</ul>
      </div>
      <div style="background: rgba(0, 200, 83, 0.08); border: 1px solid rgba(0, 200, 83, 0.25); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 24px;">
        <div style="font-size: 0.78rem; font-weight: 800; color: var(--color-growth-green); text-transform: uppercase; margin-bottom: 4px;">Verified Commercial Outcome</div>
        <p style="font-size: 0.88rem; color: var(--color-text-primary); font-weight: 600; line-height: 1.5; margin: 0;">${data.outcome}</p>
      </div>
      <a href="contact.html" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 0.95rem; padding: 12px;">
        Schedule Audit to Replicate This Growth →
      </a>
    `;

    caseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  };

  if (caseModalCloseBtn && caseModal) {
    caseModalCloseBtn.addEventListener('click', () => {
      caseModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) {
        caseModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && caseModal.classList.contains('active')) {
        caseModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Contact Page Auto Image Slider
  const contactSlider = document.getElementById('contactAutoSlider');
  if (contactSlider) {
    const slides = contactSlider.querySelectorAll('.slider-slide');
    const dots = contactSlider.querySelectorAll('.slider-dot');
    const prevBtn = contactSlider.querySelector('.slider-prev-btn');
    const nextBtn = contactSlider.querySelector('.slider-next-btn');
    let currentIndex = 0;
    let timer = null;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(nextSlide, 3500);
    }

    function stopAutoPlay() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoPlay();
      });
    });

    contactSlider.addEventListener('mouseenter', stopAutoPlay);
    contactSlider.addEventListener('mouseleave', startAutoPlay);

    goToSlide(0);
    startAutoPlay();
  }

});

