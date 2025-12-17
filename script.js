document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. CUSTOM CURSOR & HOVER ---
    const cursorHTML = `<div class="cursor-dot"></div><div class="cursor-outline"></div>`;
    document.body.insertAdjacentHTML('beforeend', cursorHTML);

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    });

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .card, .chart-card, .kpi-card, h1');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // --- 1. EASTER EGG: HACKER TEXT ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const hackerText = document.getElementById("hacker-text");

    if (hackerText) {
        const runHackerEffect = () => {
            let iteration = 0;
            let interval = setInterval(() => {
                hackerText.innerText = hackerText.innerText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) return hackerText.dataset.value[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
                if (iteration >= hackerText.dataset.value.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        };
        runHackerEffect();
        hackerText.onmouseover = runHackerEffect;
    }

    // --- 2. FLUID BACKGROUND ---
    const canvas = document.getElementById('fluid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let mouse = { x: null, y: null, radius: (canvas.height / 80) * (canvas.width / 80) };

        window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = '#66fcf1'; ctx.fill(); }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                let dx = mouse.x - this.x; let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
                }
                this.x += this.directionX; this.y += this.directionY; this.draw();
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
                particlesArray.push(new Particle(x, y, directionX, directionY, size, '#66fcf1'));
            }
        }
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) particlesArray[i].update();
            connect();
        }
        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        ctx.strokeStyle = 'rgba(102, 252, 241,' + (1 - (distance/20000)) + ')';
                        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }
        window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = ((canvas.height/80) * (canvas.height/80)); init(); });
        window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
        init(); animate();
    }

    // --- 3. DASHBOARD & UI ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200; 
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString(); 
            }
        };
        const counterObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) { updateCount(); counterObserver.disconnect(); }
        });
        counterObserver.observe(counter);
    });

    const toggleBtn = document.getElementById('toggleInternships');
    const internshipSection = document.getElementById('internship-section');
    if (toggleBtn && internshipSection) {
        toggleBtn.addEventListener('click', () => {
            if (internshipSection.style.display === 'block') { internshipSection.style.display = 'none'; toggleBtn.innerText = 'View Internships'; } 
            else { internshipSection.style.display = 'block'; toggleBtn.innerText = 'Hide Internships'; internshipSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    }

    const items = document.querySelectorAll('.card, .timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) { setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, index * 100); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    items.forEach(item => { item.style.opacity = '0'; item.style.transform = 'translateY(20px)'; item.style.transition = 'all 0.6s ease-out'; observer.observe(item); });

    // --- 4. CHARTS ---
    Chart.defaults.color = '#c5c6c7';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, color: '#c5c6c7' } } } };

    // 1. Radar Chart: Fixed Scale
    const ctxSkills = document.getElementById('skillsChart');
    if (ctxSkills) {
        new Chart(ctxSkills, {
            type: 'radar',
            data: {
                labels: ['Python', 'Storytelling', 'Machine Learning', 'SQL', 'Dashboarding', 'Strategy'],
                datasets: [{
                    label: 'Capability Index',
                    // Strategy (idx 5) and ML (idx 2) set to 70
                    data: [99, 97, 70, 98, 96, 70], 
                    backgroundColor: 'rgba(102, 252, 241, 0.25)', 
                    borderColor: '#66fcf1',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#66fcf1'
                }]
            },
            options: { 
                ...commonOptions, 
                scales: { 
                    r: { 
                        angleLines: { color: 'rgba(255,255,255,0.1)' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' }, 
                        pointLabels: { color: '#fff', font: { size: 11, weight: 'bold' } }, 
                        ticks: { display: false, backdropColor: 'transparent' },
                        // FIX: Explicitly set min to 0 so 70 is shown correctly, not as the floor
                        min: 0, 
                        max: 100 
                    } 
                }, 
                plugins: { legend: { display: false } } 
            }
        });
    }

    // 2. Line Chart
    const ctxImpact = document.getElementById('impactChart');
    if (ctxImpact) {
        new Chart(ctxImpact, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 (Forecast)', 'Q2 (Forecast)'],
                datasets: [{
                    label: 'Model Efficiency',
                    data: [85, 88, 92, 95, 98, 99],
                    borderColor: '#66fcf1',
                    backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,400); g.addColorStop(0, 'rgba(102,252,241,0.5)'); g.addColorStop(1, 'rgba(102,252,241,0.0)'); return g; },
                    fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#0b0c10', pointBorderColor: '#66fcf1'
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: false, suggestedMin: 80, suggestedMax: 100 } } }
        });
    }

    // 3. Doughnut Chart
    const ctxTools = document.getElementById('toolsChart');
    if (ctxTools) {
        new Chart(ctxTools, {
            type: 'doughnut',
            data: {
                labels: ['Python Ecosystem', 'SQL / Databases', 'Tableau / BI', 'Cloud / DevOps'],
                datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#66fcf1', '#45a29e', '#c5c6c7', '#1f2833'], borderWidth: 0 }]
            },
            options: { ...commonOptions, cutout: '70%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 20 } } } }
        });
    }
});
