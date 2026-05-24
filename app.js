/* ==========================================================================
   APP.JS - INTERACTIVE LOGIC (Dragon Horses Team)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. FIRE PARTICLES CANVAS ENGINE
    // ==========================================================================
    const canvas = document.getElementById('fire-particles');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let explosionArray = [];
    const maxParticles = 60;
    
    // Set Canvas Size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle Class
    class Particle {
        constructor(isExplosion = false, x = 0, y = 0) {
            this.isExplosion = isExplosion;
            this.reset(isExplosion, x, y);
        }
        
        reset(isExplosion, x, y) {
            if (isExplosion) {
                this.x = x;
                this.y = y;
                // Explode outwards in all directions
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed - Math.random() * 2; // slight upward drift
                this.size = Math.random() * 5 + 3;
                this.color = this.getRandomColor(true);
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            } else {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = -(Math.random() * 1.5 + 0.5);
                this.size = Math.random() * 3 + 1;
                this.color = this.getRandomColor(false);
                this.alpha = Math.random() * 0.5 + 0.3;
                this.decay = Math.random() * 0.002 + 0.001;
            }
        }
        
        getRandomColor(isExplosion) {
            // Hot orange, bright red, gold/amber colors
            const hues = [12, 25, 38, 48]; // Red, Orange, Amber, Gold
            const randomHue = hues[Math.floor(Math.random() * hues.length)];
            const saturation = 100;
            const lightness = isExplosion ? Math.random() * 30 + 55 : Math.random() * 20 + 50; // Brighter for explosion
            return `hsla(${randomHue}, ${saturation}%, ${lightness}%, `;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.isExplosion) {
                this.vy += 0.04; // gravity pull down slightly
                this.alpha -= this.decay;
                if (this.size > 0.1) this.size -= 0.05;
            } else {
                this.alpha -= this.decay;
                // Float slightly to side
                this.vx += (Math.random() - 0.5) * 0.05;
            }
            
            // Re-spawn regular particles, delete explosion ones
            if (this.alpha <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0) {
                if (this.isExplosion) {
                    return false; // mark for deletion
                } else {
                    this.reset(false);
                }
            }
            return true;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            
            // Add a soft glow effect to particles
            ctx.shadowBlur = this.isExplosion ? this.size * 2.5 : this.size * 2;
            ctx.shadowColor = this.color.replace('rgba', 'rgb').split(',').slice(0, 3).join(',') + ')';
            
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize Particles
    function initParticles() {
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle(false));
        }
    }
    initParticles();
    
    // Trigger Explosion Spark effect (for form submission success!)
    function triggerSparkBurst(x, y) {
        explosionArray = [];
        for (let i = 0; i < 80; i++) {
            explosionArray.push(new Particle(true, x, y));
        }
    }
    
    // Particle Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw normal background sparks
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw explosion sparks if active
        if (explosionArray.length > 0) {
            explosionArray = explosionArray.filter(particle => {
                const isActive = particle.update();
                if (isActive) particle.draw();
                return isActive;
            });
        }
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    
    // ==========================================================================
    // 2. HEADER & MENU NAVIGATION EFFECTS
    // ==========================================================================
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll event for shrinking navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Navigation active state highlight on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // triggers when section fills middle of viewport
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    
    // ==========================================================================
    // 3. RESPONSIVE MOBILE HAMBURGER MENU
    // ==========================================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    
    // ==========================================================================
    // 4. CLUB STYLE TABS (Independent tab containers)
    // ==========================================================================
    const tabContainers = document.querySelectorAll('.style-card');
    
    tabContainers.forEach(container => {
        const tabBtns = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Toggle buttons state in this container only
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Toggle contents state in this container only
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('id') === `${targetTab}-tab`) {
                        content.classList.add('active');
                    }
                });
                
                // Change card image if data-image is provided with a smooth fade/scale transition
                const newImg = btn.getAttribute('data-image');
                if (newImg) {
                    const cardImg = container.querySelector('.style-card-img');
                    if (cardImg) {
                        cardImg.style.opacity = '0.3';
                        cardImg.style.transform = 'scale(0.98)';
                        
                        setTimeout(() => {
                            cardImg.src = newImg;
                            
                            setTimeout(() => {
                                cardImg.style.opacity = '1';
                                cardImg.style.transform = 'scale(1)';
                            }, 50);
                        }, 150);
                    }
                }
            });
        });
    });
    
    // ==========================================================================
    // 4b. SPECIFIC HORSE CARD GALLERY & SLIDER ENGINE
    // ==========================================================================
    const horseGalleryContainer = document.getElementById('horse-gallery-container');
    const horseDisplayImg = document.getElementById('horse-display-img');
    const galleryPrevBtn = document.getElementById('gallery-prev-btn');
    const galleryNextBtn = document.getElementById('gallery-next-btn');
    const galleryDotsContainer = document.getElementById('gallery-dots');
    
    // Horse Images Mapping
    const horseImages = {
        'sr-horse': ['assets/Pferd_SR_1.JPG'],
        'nsr-horse': ['assets/Pferd_nSR_1.png', 'assets/Pferd_nSR_2.png']
    };
    
    let currentHorseTab = 'sr-horse';
    let currentHorseImgIndex = 0;
    
    function updateHorseGallery() {
        const images = horseImages[currentHorseTab];
        
        // Add premium fade out effect
        if (horseDisplayImg) {
            horseDisplayImg.style.opacity = '0.3';
            horseDisplayImg.style.transform = 'scale(0.98)';
        }
        
        setTimeout(() => {
            // Update source
            if (horseDisplayImg) {
                horseDisplayImg.src = images[currentHorseImgIndex];
            }
            
            // Fade in and scale back up
            setTimeout(() => {
                if (horseDisplayImg) {
                    horseDisplayImg.style.opacity = '1';
                    horseDisplayImg.style.transform = 'scale(1)';
                }
            }, 50);
        }, 150);
        
        // Handle gallery layout controls depending on number of images
        if (images.length > 1) {
            if (horseGalleryContainer) {
                horseGalleryContainer.classList.add('has-gallery');
            }
            
            // Re-render dots
            if (galleryDotsContainer) {
                galleryDotsContainer.innerHTML = images.map((_, index) => 
                    `<span class="dot ${index === currentHorseImgIndex ? 'active' : ''}" data-index="${index}"></span>`
                ).join('');
                
                // Add click events to new dots
                const dots = galleryDotsContainer.querySelectorAll('.dot');
                dots.forEach(dot => {
                    dot.addEventListener('click', () => {
                        const targetIndex = parseInt(dot.getAttribute('data-index'));
                        if (targetIndex !== currentHorseImgIndex) {
                            currentHorseImgIndex = targetIndex;
                            updateHorseGallery();
                        }
                    });
                });
            }
        } else {
            if (horseGalleryContainer) {
                horseGalleryContainer.classList.remove('has-gallery');
            }
        }
    }
    
    // Add specific listener for horse card tab buttons to override or run alongside the generic tabs
    const horseCard = document.querySelector('.horse-card');
    if (horseCard) {
        const horseTabBtns = horseCard.querySelectorAll('.tab-btn');
        horseTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedTab = btn.getAttribute('data-tab');
                if (selectedTab !== currentHorseTab) {
                    currentHorseTab = selectedTab;
                    currentHorseImgIndex = 0;
                    updateHorseGallery();
                }
            });
        });
    }
    
    // Prev / Next button listeners
    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click triggers
            const images = horseImages[currentHorseTab];
            if (images.length > 1) {
                currentHorseImgIndex = (currentHorseImgIndex - 1 + images.length) % images.length;
                updateHorseGallery();
            }
        });
    }
    
    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click triggers
            const images = horseImages[currentHorseTab];
            if (images.length > 1) {
                currentHorseImgIndex = (currentHorseImgIndex + 1) % images.length;
                updateHorseGallery();
            }
        });
    }
    
    // Initial update to ensure correct files are loaded on startup
    updateHorseGallery();
    
    
    
    // ==========================================================================
    // 5. WEEKLY SCHEDULE FILTER SYSTEM
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dayCards = document.querySelectorAll('.calendar-day-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Switch active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            dayCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset card transition
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('filtered-out');
                        
                        // Small staggered delay for visual elegance
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('filtered-out');
                    }
                }, 300);
            });
        });
    });
    
    
    // ==========================================================================
    // 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const revealItems = document.querySelectorAll('.about-info-card, .about-facts-card, .about-activities-card, .style-card, .calendar-day-card, .team-card');
    
    revealItems.forEach(item => {
        item.classList.add('reveal-item');
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay based on index/layout
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index % 3 * 100); // 100ms staggering
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    });
    
    revealItems.forEach(item => {
        revealObserver.observe(item);
    });
    


    // ==========================================================================
    // 8. BACKGROUND VIDEO AUDIO TOGGLE
    // ==========================================================================
    const heroVideo = document.querySelector('.hero-video');
    const audioToggle = document.querySelector('.video-audio-toggle');
    const soundIcon = audioToggle?.querySelector('.sound-icon');
    
    if (heroVideo && audioToggle) {
        audioToggle.addEventListener('click', () => {
            // Toggle muted status
            heroVideo.muted = !heroVideo.muted;
            
            if (heroVideo.muted) {
                // Muted state
                audioToggle.classList.remove('unmuted');
                audioToggle.setAttribute('aria-label', 'Ton einschalten');
                audioToggle.setAttribute('title', 'Ton einschalten');
                if (soundIcon) {
                    soundIcon.className = 'fa-solid fa-volume-xmark sound-icon';
                }
            } else {
                // Unmuted state
                audioToggle.classList.add('unmuted');
                audioToggle.setAttribute('aria-label', 'Ton stummschalten');
                audioToggle.setAttribute('title', 'Ton stummschalten');
                if (soundIcon) {
                    soundIcon.className = 'fa-solid fa-volume-high sound-icon';
                }
                
                // Try playing in case browser paused it
                heroVideo.play().catch(err => {
                    console.log("Audio playback was blocked or failed:", err);
                });
            }
        });
    }
});
