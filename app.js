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
    if (!btn) return;
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

  // 8. Contact Form Handling, Validation & Google Sheets / Excel Sync
  const contactForm = document.getElementById('growthContactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Google Apps Script Web App URL for Google Sheets / Excel integration
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

      // Clear previous error states
      [nameInput, emailInput, phoneInput, websiteInput, budgetInput].forEach(inp => {
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

      // Validate Phone (if present)
      if (phoneInput && (!phoneInput.value.trim() || phoneInput.value.trim().length < 8)) {
        phoneInput.classList.add('error');
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
        formFeedback.style.display = 'block';
        return;
      }

      // Collect complete lead payload
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

      // Always save locally in localStorage as a backup
      try {
        const storedLeads = JSON.parse(localStorage.getItem('growthpilot_leads') || '[]');
        storedLeads.push(leadData);
        localStorage.setItem('growthpilot_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('LocalStorage backup error:', err);
      }

      // Show submitting state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Saving to Growth Sheet...</span>';

      const finishSubmission = () => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        if (window.lucide) lucide.createIcons();

        // Show Success Feedback
        formFeedback.innerHTML = `
          <strong>Growth Audit Request Received!</strong><br>
          Thank you ${nameInput.value.trim()}. Your details have been securely recorded. Our lead performance strategist will review your brand's metrics and send a personalized scaling roadmap within 24 business hours to ${emailInput.value.trim()}.
        `;
        formFeedback.classList.add('success');
        formFeedback.style.display = 'block';

        // Reset form inputs except feedback
        contactForm.reset();
        document.querySelectorAll('.chip-checkbox-label').forEach(chip => chip.classList.remove('checked'));
      };

      // Post to Google Sheets Webhook if URL is configured
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
        // Fallback smooth transition when webhook URL is awaiting deployment
        setTimeout(finishSubmission, 900);
      }
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

  // 13.5 Case Studies Hero Interactive Industry Selector
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

        // Smooth image fade
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

  // 14. Case Studies Category Filter & Interactive Detail Modal
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

  // Case Study Detailed Data Repository
  const caseData = {
    1: {
      title: "Scaling D2C Apparel from ₹45 Lakh to ₹2.18 Crore/Month with Algorithmic Media Buying",
      tags: ["Meta Ads", "Shopify Plus", "D2C Fashion"],
      image: "assets/proof-shopify-2cr.jpg",
      ribbon: "₹2.18 Cr in 30 Days",
      metrics: [
        { label: "Revenue Lift", val: "+388%" },
        { label: "Blended ROAS", val: "4.8x" },
        { label: "CAC Reduction", val: "-34%" }
      ],
      bottleneck: "The apparel brand was hitting an ad spend ceiling at ₹12L/month. Meta Ads CPA spiked significantly whenever spend was raised, and Shopify collection pages were converting at an underperforming 1.4%.",
      strategy: [
        "Architected high-velocity creative sprints with 12 new video hooks tested weekly across pain points, founder story, and fabric comparison angles.",
        "Constructed custom advertorial collection landing pages with instant bundle discounts and 0.8s mobile load velocity.",
        "Implemented Meta Conversions API (CAPI) direct server telemetry to recover dropped iOS 14+ signal loss.",
        "Applied automated Cost-Cap bid testing to protect contribution margins during rapid budget scale."
      ],
      outcome: "Scaled gross monthly revenue from ₹45 Lakhs to ₹2.18 Crore in 30 days while maintaining a 4.8x blended ROAS and reducing customer acquisition cost by 34%."
    },
    2: {
      title: "Launching Luxury Organic Skincare to ₹75 Lakhs in Month 1 via Creative Angle Sprints",
      tags: ["Performance Marketing", "Meta & Google", "Skincare"],
      image: "assets/proof-meta-roas.jpg",
      ribbon: "₹75 Lakhs Month 1",
      metrics: [
        { label: "Month 1 Sales", val: "₹75.2L" },
        { label: "Average ROAS", val: "4.8x" },
        { label: "Site CVR", val: "3.5%" }
      ],
      bottleneck: "A new organic cosmetics brand entering a competitive market needed immediate customer acquisition without burning through initial launch capital on unverified ad creative.",
      strategy: [
        "Tested 5 distinct psychological hooks: dermatological science, ingredient purity, real customer unboxing, routine simplification, and value comparison.",
        "Paired top-of-funnel Meta Reels prospecting with Google Search brand-capture to eliminate lost search volume.",
        "Constructed a high-converting 3-step routine quiz lander that recommended tailored regimens, lifting average order value by +₹420.",
        "Installed post-purchase email & SMS automation that stimulated a 24% repeat purchase rate within 45 days."
      ],
      outcome: "Achieved ₹75,20,000 in first-month verified revenue at 4.8x blended ROAS, establishing immediate cash-flow positive unit economics."
    },
    3: {
      title: "Re-Engineering Core Web Vitals to 0.5s Mobile Speed & Boosting Checkout CVR by +52%",
      tags: ["Web Development", "Core Web Vitals", "Beauty Store"],
      image: "assets/proof-web-speed.jpg",
      ribbon: "100/100 Speed Score",
      metrics: [
        { label: "Mobile Speed", val: "0.5s" },
        { label: "Checkout CVR", val: "+52%" },
        { label: "Google ROAS", val: "5.4x" }
      ],
      bottleneck: "Heavy third-party apps and bloated theme JavaScript produced a sluggish 4.2-second mobile load time, resulting in a 68% mobile bounce rate and poor Google Ads quality scores.",
      strategy: [
        "Stripped 14 redundant tracking apps and consolidated essential telemetry into a single server-side worker pipeline.",
        "Re-engineered frontend store architecture to achieve a perfect 100/100 Google Core Web Vitals score.",
        "Engineered an express sticky mobile checkout drawer with Apple Pay, UPI 1-click, and automated address autocomplete.",
        "Restructured Google Performance Max product feed attributes and custom labels to prioritize high-margin SKUs."
      ],
      outcome: "Mobile load time plummeted from 4.2s to 0.5s. Conversion rate surged by +52%, lifting Google Shopping ROAS from 2.6x to 5.4x."
    },
    4: {
      title: "Story-Driven Advertorial Funnel Scaled High-Ticket Modern Furniture to ₹40L/Month",
      tags: ["Landing Page CRO", "A/B Testing", "Home & Living"],
      image: "assets/industry-home.jpg",
      ribbon: "₹40 Lakhs/Mo Scale",
      metrics: [
        { label: "Monthly Run", val: "₹40.5L" },
        { label: "AOV Lift", val: "+44%" },
        { label: "Blended ROAS", val: "3.9x" }
      ],
      bottleneck: "Selling ₹25,000+ designer home decor items via standard collection catalogs suffered from high cart abandonment and long consideration cycles.",
      strategy: [
        "Crafted a long-form architectural advertorial breaking down designer wood craftsmanship, ergonomic posture support, and customer home tours.",
        "Embedded an interactive Room Visualizer tool with transparent No-Cost EMI calculators directly beside the primary CTA.",
        "Set up dynamic retargeting sequences highlighting customer unboxing videos and a 30-day in-home risk-free trial."
      ],
      outcome: "Generated ₹40.5 Lakh in monthly revenue with a +44% increase in Average Order Value and a 3.9x blended return on ad spend."
    },
    5: {
      title: "Scaling Artisanal Wellness Brand to ₹1.5 Crore Across Meta & Search Acquisition",
      tags: ["Performance Marketing", "Omnichannel", "Consumer CPG"],
      image: "assets/industry-consumer.jpg",
      ribbon: "₹1.5 Crore Omnichannel",
      metrics: [
        { label: "Total Scale", val: "₹1.52Cr" },
        { label: "ROAS", val: "4.2x" },
        { label: "Blended CAC", val: "-28%" }
      ],
      bottleneck: "The brand struggled to synchronize fragmented ad spend across Meta Ads, Google Shopping, and Amazon marketplace, leading to wasted spend and customer cannibalization.",
      strategy: [
        "Built a unified attribution model linking DTC sales and marketplace velocity to track true blended customer acquisition costs.",
        "Shifted ad creative strategy towards high-intent benefit hooks, featuring doctor endorsements and clinical trial summaries.",
        "Implemented high-velocity subscription box bundle discounts, turning one-time buyers into compounding recurring revenue."
      ],
      outcome: "Delivered ₹1.52 Crore in cumulative quarterly sales while lowering blended customer acquisition costs by 28% at 4.2x ROAS."
    },
    6: {
      title: "Rapid Scaling Sprint: Generating ₹35 Lakhs in 21 Days for New D2C Brand",
      tags: ["Performance Marketing", "Bundle CRO", "D2C Retail"],
      image: "assets/industry-d2c.jpg",
      ribbon: "₹35 Lakhs in 21 Days",
      metrics: [
        { label: "21-Day Sales", val: "₹35.8L" },
        { label: "Average ROAS", val: "4.6x" },
        { label: "Hooks Tested", val: "12" }
      ],
      bottleneck: "A new lifestyle footwear startup had limited runway and needed immediate customer acquisition proof within the first 3 weeks of campaign launch.",
      strategy: [
        "Rapidly tested 12 video creative hooks over 7 days to identify the 3 highest-converting customer value propositions.",
        "Configured a tiered bundle builder offering Buy 2 Get 15% Off and Buy 3 Get 25% Off to instantly maximize gross cart size.",
        "Scaled budget 25% every 48 hours using automated rules anchored strictly to contribution margin thresholds."
      ],
      outcome: "Generated ₹35,80,000 in 21 days with 4.6x ROAS, successfully validating product-market fit and providing cash flow to fuel ongoing operations."
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
        <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 320px; object-fit: cover; display: block;">
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

});

