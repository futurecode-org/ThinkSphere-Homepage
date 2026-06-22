/**
 * ThinkSphere - Apple Style Website Interactions
 * ================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initSmoothScroll();
    initMarkdownLoader();
});

/**
 * Navigation functionality
 * - Mobile menu toggle
 * - Active state on scroll
 * - Transparent to solid transition
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
    
    // Navbar background on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(251, 251, 253, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.background = 'rgba(251, 251, 253, 0.72)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Scroll-triggered fade-in animations
 * Uses Intersection Observer for performance
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements that need fade-in
    const fadeElements = document.querySelectorAll('.about-card, .team-card, .feature-item, .stat-item, .contact-item');
    
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Stagger animation for grid items
    const grids = document.querySelectorAll('.about-grid, .team-grid, .features-grid');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

/**
 * Counter animation for stats
 * Animates numbers counting up when visible
 */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                animateCounter(target, 0, countTo, 2000);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

/**
 * Animate a number counting up
 * @param {HTMLElement} element - The element to animate
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (range * easeProgress));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax effect for hero background orbs
 * Subtle movement based on scroll position
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.hero-background .gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
    });
});

/**
 * Hide scroll indicator when user scrolls past hero
 */
window.addEventListener('scroll', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }
});

/**
 * Markdown Loader
 * Loads and renders Markdown content from team-rules.md
 */
function initMarkdownLoader() {
    const markdownContainer = document.getElementById('markdown-content');
    if (!markdownContainer) return;
    
    // Try to load the Markdown file
    fetch('team-rules.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载团队管理规则文件');
            }
            return response.text();
        })
        .then(markdownText => {
            // Parse Markdown to HTML using marked.js
            if (typeof marked !== 'undefined') {
                const htmlContent = marked.parse(markdownText);
                markdownContainer.innerHTML = htmlContent;
                
                // Add fade-in animation to the content
                markdownContainer.classList.add('fade-in');
                setTimeout(() => {
                    markdownContainer.classList.add('visible');
                }, 100);
            } else {
                // Fallback: display raw text with simple formatting
                markdownContainer.innerHTML = formatMarkdownFallback(markdownText);
            }
        })
        .catch(error => {
            console.error('加载 Markdown 失败:', error);
            markdownContainer.innerHTML = `
                <div class="rules-error">
                    <svg class="rules-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>暂时无法加载团队管理规则</p>
                    <p style="font-size: 13px; margin-top: 8px;">请检查 team-rules.md 文件是否存在</p>
                </div>
            `;
        });
}

/**
 * Fallback Markdown formatter (when marked.js is not available)
 * Provides basic formatting for headers, lists, and emphasis
 */
function formatMarkdownFallback(text) {
    let html = text
        // Escape HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Headers
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Horizontal rules
        .replace(/^---$/gim, '<hr>')
        // Lists (basic)
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    return `<div style="line-height: 1.8; color: var(--color-text-secondary);">${html}</div>`;
}

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--color-text-primary);
    }
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);