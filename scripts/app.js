document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const printBtn = document.getElementById('print-btn');

    // Canvas Setup
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];

    // ==========================================
    // CONFIGURACIÓN DEL EFECTO DE PUNTOS (CANVAS)
    // ==========================================

    // Distancia entre puntos (menor número = más puntos)
    const spacing = 20;

    // Radio del efecto "linterna" alrededor del ratón
    const mouseRadius = 55;

    let rgbColor = '74, 144, 226'; // Color inicial (se actualiza al cambiar tema)

    // ==========================================

    // Mouse State
    const mouse = { x: -1000, y: -1000 };

    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
        updateDotColor(currentTheme);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateIcon('dark');
            updateDotColor('dark');
        }
    }

    // Resize Handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initDots();
    }
    window.addEventListener('resize', resize);

    // Dot Class
    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;

            // TAMAÑO DE LOS PUNTOS
            this.size = 1.0; // Tamaño base normal

            // VISIBILIDAD DE LOS PUNTOS
            // Cambia este valor entre 0.0 y 1.0
            // 0.05 = muy sutil, 0.2 = muy visible
            this.baseAlpha = 0.2;

            this.alpha = this.baseAlpha;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.fillStyle = `rgba(${rgbColor}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Interaction logic
            if (distance < mouseRadius) {
                // Calculate intensity based on proximity
                let intensity = 1 - (distance / mouseRadius);

                // EFECTO AL PASAR EL RATÓN
                // Multiplicador de tamaño (2 + intensity * X)
                this.size = 2 + (intensity * 2);

                // Opacidad máxima al pasar el ratón (0.8 = 80% visible)
                this.alpha = 20 + (intensity * 0.2);
            } else {
                // Return to base state
                this.size = 1.5;
                this.alpha = this.baseAlpha;

                // Return to base position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            this.draw();
        }
    }

    function initDots() {
        dots = [];
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push(new Dot(x, y));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < dots.length; i++) {
            dots[i].update();
        }
        requestAnimationFrame(animate);
    }

    // Initialize Canvas
    resize();
    animate();

    // Mouse Move Event
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;

        // Keep existing CSS variable logic for cards
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);

        const cards = document.querySelectorAll('.education-card, .skill-category, .timeline-item');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = x - rect.left;
            const cardY = y - rect.top;
            card.style.setProperty('--card-mouse-x', `${cardX}px`);
            card.style.setProperty('--card-mouse-y', `${cardY}px`);
        });
    });

    // Theme Toggle Logic
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');

        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateIcon('light');
            updateDotColor('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateIcon('dark');
            updateDotColor('dark');
        }
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    function updateDotColor(theme) {
        if (theme === 'dark') {
            rgbColor = '255, 255, 255'; // White for dark mode
        } else {
            rgbColor = '74, 144, 226'; // Blue for light mode
        }
    }

    // Print Functionality
    printBtn.addEventListener('click', () => {
        window.print();
    });
});
