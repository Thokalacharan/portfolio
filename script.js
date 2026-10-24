/**
 * THOKALA CHARAN - PORTFOLIO INTERACTIVITY SCRIPT
 * Lightweight, Vanilla JavaScript | Performance & Accessibility Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Elements Cache
    // -------------------------------------------------------------------------
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast-notification');
    const contactForm = document.getElementById('quick-contact-form');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const counterElements = document.querySelectorAll('[data-counter]');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -------------------------------------------------------------------------
    // 2. Navigation Scroll State & Back-to-Top Button
    // -------------------------------------------------------------------------
    let isScrolling = false;

    const handleWindowScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Sticky header styling
        if (scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll-to-top button visibility
        if (scrollY > 400) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }

        // Update active navigation link on scroll
        updateActiveNavLink(scrollY);
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleWindowScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Initial check on load
    handleWindowScroll();

    // Scroll to Top action
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. Active Nav Link (Scroll Spy)
    // -------------------------------------------------------------------------
    function updateActiveNavLink(scrollY) {
        const headerOffset = 140;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If near bottom of page, highlight contact
        if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
            currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. Mobile Navigation Menu Toggle & Accessibility
    // -------------------------------------------------------------------------
    function toggleMobileMenu(open) {
        const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');

        if (shouldOpen) {
            navMenu.classList.add('open');
            drawerBackdrop.classList.add('active');
            menuToggle.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            navMenu.classList.remove('open');
            drawerBackdrop.classList.remove('active');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMobileMenu());
    }

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu(false);
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMobileMenu(false);
        }
    });

    // -------------------------------------------------------------------------
    // 5. Smooth Anchor Scrolling with Proper Header Offset
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = 75;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // Update focus for screen readers
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. Intersection Observer for Scroll Reveals
    // -------------------------------------------------------------------------
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for no-observer or reduced-motion
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // -------------------------------------------------------------------------
    // 7. Counter Animation for Highlight Metrics
    // -------------------------------------------------------------------------
    const animateCounters = (element, targetValue) => {
        const isDecimal = targetValue % 1 !== 0;
        const duration = 1600;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * targetValue;

            if (isDecimal) {
                element.textContent = currentVal.toFixed(2);
            } else {
                element.textContent = Math.floor(currentVal);
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = isDecimal ? targetValue.toFixed(2) : targetValue;
            }
        };

        requestAnimationFrame(updateNumber);
    };

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const target = parseFloat(entry.target.dataset.counter);
                    if (!isNaN(target)) {
                        animateCounters(entry.target, target);
                        entry.target.dataset.animated = 'true';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counterElements.forEach(el => counterObserver.observe(el));
    } else {
        counterElements.forEach(el => {
            el.textContent = el.dataset.counter;
        });
    }

    // -------------------------------------------------------------------------
    // 8. One-Click Copy for Email Address
    // -------------------------------------------------------------------------
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'thokalacharan68@gmail.com';
            let copied = false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(email);
                    copied = true;
                } catch (err) {
                    console.warn('Clipboard writeText failed, falling back:', err);
                }
            }

            if (!copied) {
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = email;
                tempTextArea.style.position = 'fixed';
                tempTextArea.style.opacity = '0';
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                try {
                    copied = document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy error:', err);
                }
                document.body.removeChild(tempTextArea);
            }

            if (copied && toast) {
                toast.classList.add('show');
                copyEmailBtn.innerHTML = '<i class="fas fa-check text-success"></i> <span class="copy-text">Copied!</span>';
                
                setTimeout(() => {
                    toast.classList.remove('show');
                    copyEmailBtn.innerHTML = '<i class="far fa-copy"></i> <span class="copy-text">Copy</span>';
                }, 2500);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 9. Quick Email Form Handler (Constructs Mailto Link)
    // -------------------------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('sender-name').value.trim();
            const subject = document.getElementById('sender-subject').value.trim();
            const message = document.getElementById('sender-message').value.trim();

            const emailTo = 'thokalacharan68@gmail.com';
            const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
            const encodedBody = encodeURIComponent(`Sender Name: ${name}\n\nMessage:\n${message}\n\nSent from Portfolio Website`);

            const mailtoUrl = `mailto:${emailTo}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open user's email client
            window.location.href = mailtoUrl;

            // Optional visual confirmation
            const submitBtn = document.getElementById('form-submit-btn');
            if (submitBtn) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Opening Email Client...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 10. Console Greeting & Debug Info
    // -------------------------------------------------------------------------
    console.log(
        '%c Thokala Charan %c Portfolio Loaded Successfully ',
        'background: #38bdf8; color: #000; font-weight: bold; border-radius: 3px 0 0 3px; padding: 2px 6px;',
        'background: #0f172a; color: #38bdf8; font-weight: bold; border-radius: 0 3px 3px 0; padding: 2px 6px;'
    );
});
