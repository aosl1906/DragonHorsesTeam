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
                
                // Change card image if data-image is provided
                const newImg = btn.getAttribute('data-image');
                if (newImg) {
                    const cardImg = container.querySelector('.style-card-img');
                    if (cardImg) {
                        cardImg.src = newImg;
                    }
                }
            });
        });
    });
    
    
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
    const revealItems = document.querySelectorAll('.about-info-card, .about-facts-card, .about-activities-card, .style-card, .calendar-day-card, .team-card, .join-form-container');
    
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
    // 7. MULTI-STEP APPLICATIONS FORM VALIDATION & LOGIC
    // ==========================================================================
    const form = document.getElementById('apply-form');
    const formSteps = document.querySelectorAll('.form-step-content');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLine = document.getElementById('progress-line');
    
    const successMessage = document.getElementById('success-message');
    const userSummary = document.getElementById('user-summary');
    const closeSuccessBtn = document.getElementById('btn-success-close');
    
    let currentStep = 1;
    
    // Update progress bar UI
    function updateProgress() {
        // Steps styling
        progressSteps.forEach((step, idx) => {
            const stepNum = idx + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Progress line scaling
        const percentage = ((currentStep - 1) / (progressSteps.length - 1)) * 100;
        progressLine.style.setProperty('--progress-width', `${percentage}%`);
        
        // CSS hack for line fill: set width on a pseudoclass via JS variable or direct stylesheet edit
        // We will directly style the width of the progress-line's ::before using JS style variables:
        const progressLineBefore = document.styleSheets[0];
        // Alternatively, an easier way is to set custom CSS property
        progressLine.style.setProperty('--width', `${percentage}%`);
    }
    
    // Get all input fields in a specific step
    function getFieldsInStep(stepNum) {
        const stepContainer = document.getElementById(`step-${stepNum}`);
        return stepContainer.querySelectorAll('input[required], select[required], textarea[required]');
    }
    
    // Validate a specific input field
    function validateField(field) {
        const group = field.closest('.form-group') || field.parentElement;
        let isValid = true;
        
        if (field.type === 'checkbox') {
            isValid = field.checked;
        } else if (field.type === 'radio') {
            const radioGroup = field.closest('.form-group');
            const radios = radioGroup.querySelectorAll('input[type="radio"]');
            isValid = Array.from(radios).some(r => r.checked);
        } else {
            isValid = field.value.trim() !== '';
            
            // Age validation rule
            if (field.id === 'age' && isValid) {
                const val = parseInt(field.value);
                isValid = !isNaN(val) && val >= 10 && val <= 99;
            }
        }
        
        if (isValid) {
            group.classList.remove('has-error');
        } else {
            group.classList.add('has-error');
        }
        
        return isValid;
    }
    
    // Validate all fields in the current step
    function validateCurrentStep() {
        const fields = getFieldsInStep(currentStep);
        let stepIsValid = true;
        
        fields.forEach(field => {
            const fieldIsValid = validateField(field);
            if (!fieldIsValid) {
                stepIsValid = false;
            }
        });
        
        return stepIsValid;
    }
    
    // Listen to real-time input changes to remove error stylings dynamically
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                const group = input.closest('.form-group');
                if (input.value.trim() !== '') {
                    group.classList.remove('has-error');
                }
            }
        });
        
        input.addEventListener('change', () => {
            const group = input.closest('.form-group');
            validateField(input);
        });
    });
    
    // Next buttons handler
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                const currentContainer = document.getElementById(`step-${currentStep}`);
                const nextContainer = document.getElementById(`step-${currentStep + 1}`);
                
                // Smooth transition: Slide out current
                currentContainer.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                
                setTimeout(() => {
                    currentContainer.classList.remove('active');
                    nextContainer.classList.add('active');
                    nextContainer.style.animation = 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                    currentStep++;
                    updateProgress();
                }, 280);
            } else {
                // Focus on first error element
                const firstError = document.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
                if (firstError) firstError.focus();
            }
        });
    });
    
    // Prev buttons handler
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentContainer = document.getElementById(`step-${currentStep}`);
            const prevContainer = document.getElementById(`step-${currentStep - 1}`);
            
            // Slide out reverse
            currentContainer.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse';
            
            setTimeout(() => {
                currentContainer.classList.remove('active');
                prevContainer.classList.add('active');
                prevContainer.style.animation = 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse';
                currentStep--;
                updateProgress();
            }, 280);
        });
    });
    
    // Submit Form Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateCurrentStep()) {
            // Gathering Form Information
            const fullName = document.getElementById('fullname').value;
            const age = document.getElementById('age').value;
            const discord = document.getElementById('discord').value;
            const ssoName = document.getElementById('sso-name').value;
            const ssoLevel = document.getElementById('sso-level').value;
            const hasHorseVal = form.querySelector('input[name="has_horse"]:checked').value;
            
            let hasHorseText = "Ja";
            if (hasHorseVal === 'soon') hasHorseText = "Demnächst";
            if (hasHorseVal === 'no') hasHorseText = "Nein (braucht Star Coins)";
            
            // Populating visual summary
            userSummary.innerHTML = `
                <h4>Deine Bewerbungsdaten</h4>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">SSO-Name:</span>
                        <span class="summary-value">${ssoName}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Charakterlevel:</span>
                        <span class="summary-value">${ssoLevel}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Discord Tag:</span>
                        <span class="summary-value">${discord}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Alter / RL-Name:</span>
                        <span class="summary-value">${age} Jahre (${fullName})</span>
                    </div>
                    <div class="summary-item" style="grid-column: span 2;">
                        <span class="summary-label">Club-Pferd vorhanden?</span>
                        <span class="summary-value">${hasHorseText}</span>
                    </div>
                </div>
            `;
            
            // Get position of submit button for confetti/sparks explosion
            const btnSubmit = document.getElementById('btn-submit');
            const rect = btnSubmit.getBoundingClientRect();
            const posX = rect.left + rect.width / 2;
            const posY = rect.top + rect.height / 2;
            
            // Trigger Particle Explosion!
            triggerSparkBurst(posX, posY);
            
            // Hide Form & show Success Screen
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Set all progress steps to completed
            progressSteps.forEach(step => {
                step.classList.remove('active');
                step.classList.add('completed');
            });
            progressLine.style.setProperty('--width', '100%');
            
            // Stagger multiple explosions around the screen for extra WoW factor!
            setTimeout(() => triggerSparkBurst(canvas.width / 4, canvas.height / 3), 400);
            setTimeout(() => triggerSparkBurst(canvas.width * 3/4, canvas.height / 3), 700);
            setTimeout(() => triggerSparkBurst(canvas.width / 2, canvas.height * 2/3), 1000);
            
            // Scroll smoothly to form section top so applicant sees success message
            document.getElementById('join').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Close / Reset Success Button
    closeSuccessBtn.addEventListener('click', () => {
        // Reset form inputs
        form.reset();
        
        // Remove error stylings
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
        });
        
        // Return to step 1
        currentStep = 1;
        formSteps.forEach(step => step.classList.remove('active'));
        document.getElementById('step-1').classList.add('active');
        
        // Show form & Hide success
        form.style.display = 'block';
        successMessage.style.display = 'none';
        
        updateProgress();
        
        // Scroll to hero
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    });
});
