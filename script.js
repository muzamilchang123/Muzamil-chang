document.addEventListener('DOMContentLoaded', () => {
    // Canvas Particle Background
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let w, h, particles;
    let mouse = { x: null, y: null };

    const particleConfig = {
        count: 80,
        radius: 2,
        distance: 120, // max distance to connect
        color: 'rgba(0, 242, 234, 0.5)', // Cyan accent
        lineColor: 'rgba(0, 242, 234,'
    };

    function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        createParticles();
    }

    function createParticles() {
        particles = [];
        for(let i = 0; i < particleConfig.count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * particleConfig.radius + 1
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        
        // Update and draw particles
        for(let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if(p.x < 0 || p.x > w) p.vx *= -1;
            if(p.y < 0 || p.y > h) p.vy *= -1;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = particleConfig.color;
            ctx.fill();

            // Connect lines
            for(let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);

                if(dist < particleConfig.distance) {
                    ctx.beginPath();
                    // Opacity based on distance
                    const opacity = 1 - (dist / particleConfig.distance);
                    ctx.strokeStyle = particleConfig.lineColor + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if(mouse.x != null) {
                let distMouse = Math.sqrt((p.x - mouse.x)**2 + (p.y - mouse.y)**2);
                if(distMouse < 150) {
                    ctx.beginPath();
                    const opacity = 1 - (distMouse / 150);
                    ctx.strokeStyle = 'rgba(255, 0, 85,' + opacity + ')'; // Secondary accent color near mouse
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    // Event Listeners
    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    initCanvas();
    animateParticles();

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
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

    // Initial styles for sections to be hidden
    const sections = document.querySelectorAll('.section, .hero-content');
    sections.forEach(section => {
        section.classList.add('fade-section');
        observer.observe(section);
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Typing Effect for Hero
    const heroText = document.querySelector('.animate-text');
    if(heroText) {
        const text = heroText.innerText;
        heroText.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Speed of typing
            }
        }
        // Start typing after a brief delay
        setTimeout(typeWriter, 500);
    }

    // 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.glass-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Remove Preloader (Robus Failsafe)
    const removePreloader = () => {
        const preloader = document.getElementById('preloader');
        if(preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            
            // EMERGENCY: Force all sections to be visible
            const allSections = document.querySelectorAll('.section, .hero-content');
            allSections.forEach(s => s.classList.add('visible'));
        }
    };

    window.addEventListener('load', () => {
        setTimeout(removePreloader, 1000);
    });
    
    // Failsafe: Force remove after 3.5 seconds max
    setTimeout(removePreloader, 3500);

    // Glitch Effect Trigger
    const logoText = document.querySelector('.glow-text');
    setInterval(() => {
        logoText.classList.add('glitch-active');
        setTimeout(() => {
            logoText.classList.remove('glitch-active');
        }, 200);
    }, 5000);

    // Timeline Animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if(index % 2 === 0) {
            item.classList.add('slide-left');
        } else {
            item.classList.add('slide-right');
        }
        observer.observe(item);
    });

    // Active Navigation Highlight
    const sectionsAll = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sectionsAll.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Number Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let currentCount = 0;
                const updateCounter = () => {
                    currentCount += increment;
                    if(currentCount < target) {
                        counter.innerText = Math.ceil(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // Mouse Trail Effect
    const trailColor = 'rgba(0, 242, 234, 0.5)';
    const trailSize = 10;
    const trailLen = 20;
    let trail = [];
    
    // Create elements for trail
    /*
    // Simple canvas trail is handled by existing animateParticles connected to mouse.
    // Let's add a custom div-based trail for more "glitch" feel if requested, 
    // but the canvas particle connection is arguably cleaner.
    // Instead, let's enhance the particle mouse interactive radius.
    */
    // (Existing particle logic covers the "network" trail. No new code needed to avoid clutter)

});
