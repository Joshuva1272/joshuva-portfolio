document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 0. CUSTOM CURSOR LOGIC (Professional & Fun)
    // ==========================================
    
    // 1. Inject Cursor HTML
    const cursorHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-outline"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', cursorHTML);

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // 2. Movement Logic
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with a smooth lag (animation)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // 3. Hover Interactions (Fun Effect)
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // ==========================================
    // 1. FLUID BACKGROUND ANIMATION (CANVAS)
    // ==========================================
    const canvas = document.getElementById('fluid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80)
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#66fcf1';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
                }
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1; 
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#66fcf1';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = 'rgba(102, 252, 241,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = ((canvas.height/80) * (canvas.height/80));
            init();
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        init();
        animate();
    }

    // ==========================================
    // 2. EXPERIENCE TOGGLE
    // ==========================================
    const toggleBtn = document.getElementById('toggleInternships');
    const internshipSection = document.getElementById('internship-section');

    if (toggleBtn && internshipSection) {
        toggleBtn.addEventListener('click', () => {
            if (internshipSection.style.display === 'block') {
                internshipSection.style.display = 'none';
                toggleBtn.innerText = 'View Internships & Industrial Training';
            } else {
                internshipSection.style.display = 'block';
                toggleBtn.innerText = 'Hide Internships';
                internshipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ==========================================
    // 3. GENERAL ANIMATIONS
    // ==========================================
    const mainContent = document.querySelector('main');
    if(mainContent) mainContent.style.opacity = '1';

    const heroTitle = document.getElementById('typewriter');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerText += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); 
            }
        }
        setTimeout(typeWriter, 500); 
    }

    const items = document.querySelectorAll('.card, .timeline-item');
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); 
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
});