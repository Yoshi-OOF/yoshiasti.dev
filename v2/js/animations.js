// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Setup ScrollTrigger defaults
    ScrollTrigger.defaults({
        toggleActions: "play none none none",
        once: true
    });

    // Animate reveal elements
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%"
                }
            }
        );
    });

    // Animate skill cards with stagger
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.05,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card.closest('.skills-grid'),
                    start: "top 70%"
                }
            }
        );
    });

    // Animate project cards with rotation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 20, rotation: 2 },
            {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.7,
                delay: i * 0.1,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: card.closest('.projects-grid'),
                    start: "top 70%"
                }
            }
        );
    });

    // Micro-interactions
    // Hover effects for buttons
    gsap.utils.toArray('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    // Dark mode transition
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            gsap.to('body', {
                backgroundColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--dark-bg').trim(),
                color: getComputedStyle(document.documentElement)
                    .getPropertyValue('--text-light').trim(),
                duration: 0.5,
                ease: "power2.inOut"
            });
        });
    }
});