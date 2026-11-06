// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');

// ========================================
// Mobile Navigation Toggle
// ========================================
function updateNavA11y() {
    if (!navToggle || !navMenu) return;
    const isOpen = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    updateNavA11y();
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            updateNavA11y();
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navbar && navMenu && navToggle && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        updateNavA11y();
    }
});

// ========================================
// Active Nav Link Highlighting (per page)
// ========================================
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========================================
// Smooth Scroll for In-Page Anchor Links
// ========================================
function smoothScroll(targetId) {
    if (!targetId || targetId === '#') return;
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle same-page anchor links (e.g. #home, #contact on the current page)
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        smoothScroll(href);
    });
});

// ========================================
// Navbar Scroll Effect
// ========================================
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ========================================
// Scroll to Top Button
// ========================================
function handleScrollTopVisibility() {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Scroll Event Listeners
// ========================================
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleNavbarScroll();
            handleScrollTopVisibility();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .test-card, .location-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// WhatsApp Button Click Handler
// ========================================
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', function(e) {
        console.log('WhatsApp button clicked');
    });
}

// ========================================
// Contact Form Handling
// ========================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!formIsValid()) return;

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const company = formData.get('company');
        const service = formData.get('service');
        const employees = formData.get('employees');
        const message = formData.get('message');

        // Create WhatsApp message
        let whatsappMessage = `Hello Sister Martinah,\n\n`;
        whatsappMessage += `I would like to inquire about occupational health screening.\n\n`;
        whatsappMessage += `*Name:* ${name}\n`;
        whatsappMessage += `*Phone:* ${phone}\n`;
        whatsappMessage += `*Email:* ${email}\n`;
        if (company) whatsappMessage += `*Company:* ${company}\n`;
        whatsappMessage += `*Service Required:* ${service}\n`;
        if (employees) whatsappMessage += `*Number of Employees:* ${employees}\n`;
        whatsappMessage += `*Message:* ${message}\n`;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        window.open(`https://wa.me/27604962901?text=${encodedMessage}`, '_blank');

        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';

        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.style.display = 'none';
        }, 5000);
    });

    function setFieldError(field, message) {
        const group = field.closest('.form-group');
        if (!group) return;
        let errorEl = group.querySelector('.field-error');
        field.setAttribute('aria-invalid', 'true');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.setAttribute('role', 'alert');
            group.appendChild(errorEl);
        }
        const uniqueId = `error-${field.id || Math.random().toString(36).slice(2)}`;
        errorEl.id = uniqueId;
        field.setAttribute('aria-describedby', uniqueId);
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    function clearFieldError(field) {
        const group = field.closest('.form-group');
        if (!group) return;
        const errorEl = group.querySelector('.field-error');
        field.removeAttribute('aria-invalid');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }

    function formIsValid() {
        let valid = true;
        contactForm.querySelectorAll('[required]').forEach(field => {
            clearFieldError(field);
            if (!field.value.trim()) {
                const label = field.closest('.form-group')?.querySelector('label')?.textContent.replace('*', '').trim() || 'This field';
                setFieldError(field, `${label} is required.`);
                valid = false;
            }
        });

        const emailField = contactForm.querySelector('#email');
        if (emailField && emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value.trim())) {
                setFieldError(emailField, 'Please enter a valid email address.');
                valid = false;
            }
        }

        if (!valid) {
            const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return false;
        }
        return true;
    }

    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        updateNavA11y();
    }
});

// ========================================
// Window Resize Handler
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            updateNavA11y();
        }
    }, 250);
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    handleNavbarScroll();
    handleScrollTopVisibility();

    document.body.classList.add('loaded');

    console.log('Kalafong Health & Training - Website Loaded Successfully');
});

// ========================================
// Performance: Throttle scroll events
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.removeEventListener('scroll', onScroll);
window.addEventListener('scroll', throttle(onScroll, 100));

// ========================================
// Lazy Load Images (if needed)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}