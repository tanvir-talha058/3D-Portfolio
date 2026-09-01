/* ==========================================================================
   Main Application & Interactivity Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Typing Animation
  const typedSpan = document.querySelector('.hero-typed-text');
  if (typedSpan) {
    const roles = [
      "AI / ML Engineer",
      "Multilingual RAG Specialist",
      "Computer Vision Researcher",
      "FinTech AI Architect",
      "Full-Stack ML Developer"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typedSpan.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        typedSpan.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 1800; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // 2. Navbar Scroll Effect & Scrollspy
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-menu-btn');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-open');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('mobile-open')) {
        navbar.classList.remove('mobile-open');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy
    let current = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Skills Matrix Filtering
  const skillFilterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;

      skillCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Projects Showcase Filtering
  const projectFilterBtns = document.querySelectorAll('.projects-filter-nav .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Projects Database & Modal Logic
  const projectData = {
    "crimemap": {
      title: "CrimeMap BD",
      badge: "Geospatial AI & Analytics",
      year: "2024 – 2026",
      tech: ["Python", "Flask", "PostgreSQL", "JavaScript", "Leaflet.js", "Vercel", "Supabase"],
      summary: "Bilingual, responsive dashboard featuring geospatial mapping, dynamic filtering, and automated classification of 15+ Bangladeshi news sources across 64 districts.",
      details: [
        "Built with parallel HTTP fetching achieving 32x speed improvement and NLP-based event deduplication across multiple regional portals.",
        "Interactive geospatial dashboard with Leaflet.js clustering, dynamic heatmaps, and Chart.js analytical trends.",
        "Serverless deployment on Vercel + Supabase with sub-100ms API response times across Bangladesh.",
        "Achieved 91 passing automated unit/integration tests covering API routes, text classification pipelines, and event clustering logic."
      ],
      metrics: "32x Speedup • 64 Districts Mapped • 91 Automated Tests • <100ms Latency"
    },
    "levi": {
      title: "Automation Tool for Levi Strauss & Co.",
      badge: "Enterprise Automation",
      year: "2024 – 2025",
      tech: ["Python", "Selenium", "Tkinter", "Excel/Pandas"],
      summary: "Interactive desktop automation application designed for Levi Strauss & Co. to upload complex spreadsheets and auto-fill web enterprise forms with dynamic field mapping.",
      details: [
        "Engineered a resilient Selenium WebDriver framework capable of handling dynamic DOM states, nested iframes, and AJAX validation.",
        "Designed an interactive Tkinter UI allowing non-technical operators to load spreadsheets, map custom schemas, and monitor real-time execution logs.",
        "Eliminated hours of repetitive manual data entry, reducing human input error rates to virtually zero."
      ],
      metrics: "100% Data Accuracy • 80%+ Time Saved in Bulk Form Entry"
    },
    "agrokart": {
      title: "AgroKart BD — Cross-Platform Marketplace",
      badge: "Mobile & Web Ecosystem",
      year: "2024 – 2025",
      tech: ["Flutter", "Dart", "Firebase", "PHP", "SQL", "HTML/CSS/JS"],
      summary: "Full-stack mobile and web marketplace enabling direct trade between local agricultural producers/farmers and retail consumers.",
      details: [
        "Developed cross-platform mobile app in Flutter with smooth animations and intuitive multilingual interfaces.",
        "Built responsive web portal, real-time Firebase authentication, and robust PHP/SQL backend for order and inventory management.",
        "Integrated live price feeds, category-based product discovery, secure shopping cart, and transaction tracking."
      ],
      metrics: "Full-Stack Mobile + Web • Real-Time Order Management"
    },
    "edubuddy": {
      title: "Edu-Buddy — AI Student Assistant",
      badge: "Voice AI & NLP",
      year: "2023 – 2024",
      tech: ["Python", "SpeechRecognition", "Google TTS", "SQLite", "Tkinter"],
      summary: "Voice-activated intelligent desktop assistant designed to manage student schedules, study reminders, and provide swift access to educational resources.",
      details: [
        "Engineered modular natural language intent parsing and dialogue flow for conversational interaction.",
        "Integrated bi-directional speech recognition and text-to-speech audio pipelines for low-latency desktop execution.",
        "Local SQLite database ensures instant lookup of schedules, deadlines, and task priorities."
      ],
      metrics: "Hands-Free Voice AI • Modular Dialog Flow Engine"
    },
    "gesturemouse": {
      title: "Hand Gesture Virtual Mouse",
      badge: "Computer Vision & HCI",
      year: "2023 – 2024",
      tech: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
      summary: "Real-time gesture-controlled virtual mouse enabling smooth cursor navigation, clicking, scrolling, and dragging via webcam hand landmark tracking.",
      details: [
        "Leveraged Google MediaPipe 21 3D-landmark hand tracking with custom trigonometric angle calculations for robust gesture discrimination.",
        "Optimized frame processing pipeline using OpenCV to achieve 60+ FPS responsive tracking on standard consumer webcams.",
        "Integrated PyAutoGUI for jitter-free cursor smoothing, drag-and-drop, and dynamic multi-finger gestures."
      ],
      metrics: "60+ FPS Real-time Tracking • 0-Hardware Extra Cost (Standard Webcams)"
    },
    "taskmanager": {
      title: "Cross-Platform Task Manager & Optimizer",
      badge: "System Optimization & Utilities",
      year: "2023 – 2024",
      tech: ["Python", "psutil", "Tkinter"],
      summary: "Lightweight cross-platform system utility to monitor processes, analyze CPU/RAM utilization, and safely optimize device performance.",
      details: [
        "Live memory, CPU core, and active thread telemetry utilizing Python's psutil library.",
        "Engineered safe termination protocols and background cache-cleaning algorithms that boosted overall device responsiveness by 10-12%.",
        "Clean, responsive Tkinter graphical interface with dark-mode dashboard styling."
      ],
      metrics: "10-12% System Performance Boost • Zero Overhead"
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Open modal handler
  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.project;
      const data = projectData[projectId];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <span class="project-badge">${data.badge}</span>
          <span class="mono" style="color: var(--text-dim); font-size: 0.85rem;">${data.year}</span>
        </div>
        <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;" class="gradient-text">${data.title}</h2>
        <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.6;">${data.summary}</p>
        
        <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan);">
          <i class="fas fa-chart-line" style="margin-right: 0.5rem;"></i> <strong>Key Impact:</strong> ${data.metrics}
        </div>

        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-main);">Architectural & Engineering Highlights</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${data.details.map(item => `
            <li style="position: relative; padding-left: 1.4rem; font-size: 0.92rem; color: var(--text-muted); line-height: 1.55;">
              <span style="position: absolute; left: 0; color: var(--cyan);">▹</span> ${item}
            </li>
          `).join('')}
        </ul>

        <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
          <h4 style="font-size: 0.85rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.6rem;">Technologies Utilized</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;

      if (typeof projectModal.showModal === 'function') {
        projectModal.showModal();
      } else {
        projectModal.setAttribute('open', '');
      }
    });
  });

  // Close modal handler
  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      projectModal.close();
    });

    // Light-dismiss fallback for modern web guidelines
    projectModal.addEventListener('click', (e) => {
      if (e.target !== projectModal) return;
      const rect = projectModal.getBoundingClientRect();
      const isInside = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        projectModal.close();
      }
    });
  }

  // 6. Toast Notification Utility
  window.showToast = function (message, icon = 'fas fa-check-circle') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}" style="color: var(--cyan);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // 7. Citation Copy Handlers
  document.querySelectorAll('.copy-citation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.dataset.citation;
      navigator.clipboard.writeText(citation).then(() => {
        window.showToast("Citation copied to clipboard!", "fas fa-quote-right");
      });
    });
  });

  // 8. Direct Email Copy Handler
  const emailCopyBtn = document.getElementById('copy-email-btn');
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText("tanvirahmed123000@gmail.com").then(() => {
        window.showToast("Email copied: tanvirahmed123000@gmail.com", "fas fa-envelope");
      });
    });
  }

  // 9. Contact Form Simulation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Transmitting...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Dispatched!`;
        window.showToast("Thank you Tanvir will get back to you shortly!", "fas fa-paper-plane");
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1000);
    });
  }
});
