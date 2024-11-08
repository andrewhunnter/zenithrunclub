document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent background scrolling
    });

    // Close menu when nav links are clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
  
    // Particle Animation Setup
    const particleCanvas = document.createElement('canvas');
    const ctx = particleCanvas.getContext('2d');
    const vantaContainer = document.getElementById('vanta-container');
    particleCanvas.style.position = 'absolute';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    vantaContainer.appendChild(particleCanvas);

    // Utility functions
    const deg = (a) => Math.PI / 180 * a;
    const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));
    
    // Perlin noise implementation
    const noise = (function() {
        const permutation = new Array(256).fill(0).map((_, i) => i);
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
        }
        const p = [...permutation, ...permutation];
        
        return function(x, y, z) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
            
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
            
            const u = fade(x);
            const v = fade(y);
            const w = fade(z);
            
            const A = p[X]+Y;
            const AA = p[A]+Z;
            const AB = p[A+1]+Z;
            const B = p[X+1]+Y;
            const BA = p[B]+Z;
            const BB = p[B+1]+Z;
            
            return lerp(w, lerp(v, lerp(u,
                grad(p[AA], x, y, z),
                grad(p[BA], x-1, y, z)),
                lerp(u,
                    grad(p[AB], x, y-1, z),
                    grad(p[BB], x-1, y-1, z))),
                lerp(v, lerp(u,
                    grad(p[AA+1], x, y, z-1),
                    grad(p[BA+1], x-1, y, z-1)),
                    lerp(u,
                        grad(p[AB+1], x, y-1, z-1),
                        grad(p[BB+1], x-1, y-1, z-1))));
        };
        
        function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
        function lerp(t, a, b) { return a + t * (b - a); }
        function grad(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }
    })();

    // Animation options
    const opt = {
        particles: window.innerWidth / 500 ? 800 : 400,
        noiseScale: 0.002,
        angle: Math.PI / 180 * -90,
        baseColor: '#E319B4',
        strokeWeight: 1.2,  // Increased from 0.8 to 1.2 for more visibility
        tail: 92,  // Slightly reduced tail to make lines stand out more
        speed: 0.8,
        flowStrength: 0.6,
        particleSpeedRange: {
            min: 0.5,
            max: 1.2
        }
    };

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.lx = x;
            this.ly = y;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.speed = Math.random() * 
                (opt.particleSpeedRange.max - opt.particleSpeedRange.min) + 
                opt.particleSpeedRange.min;
            this.alpha = Math.random() * 0.4 + 0.4;  // Increased alpha range from (0.2-0.5) to (0.4-0.8)
        }

        update(width, height, time) {
            this.follow(time);
            
            this.vx += this.ax * opt.flowStrength;
            this.vy += this.ay * opt.flowStrength;
            
            this.vx = this.vx * 0.99;
            this.vy = this.vy * 0.99;
            
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.speed) {
                this.vx = (this.vx / speed) * this.speed;
                this.vy = (this.vy / speed) * this.speed;
            }
            
            this.x += this.vx * opt.speed;
            this.y += this.vy * opt.speed;
            this.ax = 0;
            this.ay = 0;
            
            this.edges(width, height);
        }
        
        follow(time) {
            const angle = noise(
                this.x * opt.noiseScale, 
                this.y * opt.noiseScale, 
                time * opt.noiseScale * 0.2
            ) * Math.PI * 2 + opt.angle;
            
            this.ax += Math.cos(angle) * 0.1;
            this.ay += Math.sin(angle) * 0.1;
        }
        
        edges(width, height) {
            if (this.x < 0) {
                this.x = width;
                this.lx = this.x;
            }
            if (this.x > width) {
                this.x = 0;
                this.lx = this.x;
            }
            if (this.y < 0) {
                this.y = height;
                this.ly = this.y;
            }
            if (this.y > height) {
                this.y = 0;
                this.ly = this.y;
            }
        }
        
        render(ctx) {
            const color = opt.baseColor;
            // Add a multiplier to make the alpha value higher while keeping variation
            const alphaHex = Math.floor((this.alpha * 1.2) * 255).toString(16).padStart(2, '0');
            ctx.strokeStyle = `${color}${alphaHex}`;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.lx, this.ly);
            ctx.stroke();
            this.lx = this.x;
            this.ly = this.y;
        }
    }

    const Particles = [];
    let time = 0;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;

        if (deltaTime > frameInterval) {
            lastTime = currentTime - (deltaTime % frameInterval);
            time += 0.1;
            
            ctx.fillStyle = `rgba(0, 0, 0, ${(100 - opt.tail) / 100})`;
            ctx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            for (const p of Particles) {
                p.update(particleCanvas.width, particleCanvas.height, time);
                p.render(ctx);
            }
        }
        
        requestAnimationFrame(animate);
    }

    function setupParticles() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        ctx.lineWidth = opt.strokeWeight;
        
        Particles.length = 0;
        
        for (let i = 0; i < opt.particles; i++) {
            Particles.push(new Particle(
                Math.random() * particleCanvas.width,
                Math.random() * particleCanvas.height
            ));
        }
    }

    setupParticles();
    requestAnimationFrame(animate);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            setupParticles();
        }, 250);
    });

   
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoSlideInterval;

    function updateCarousel() {
        carouselContainer.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            // Reset auto-slide timer
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Add hover pause functionality
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Start auto-sliding
    startAutoSlide();
    
    const locations = [
        { 
            name: 'gainesville', 
            lat: 29.6516, 
            lon: -82.3248, 
            zoom: 13,
            nextRunDate: new Date('2024-11-10T08:00:00').getTime()
        },
        { 
            name: 'miami', 
            lat: 25.6714, 
            lon: -80.2726, 
            zoom: 13,
            nextRunDate: new Date('2024-11-10T08:00:00').getTime()
        }
    ];

    locations.forEach(location => {
        const daysRing = document.querySelector(`#countdown-${location.name} .days-ring`);
        const hoursRing = document.querySelector(`#countdown-${location.name} .hours-ring`);
        const minutesRing = document.querySelector(`#countdown-${location.name} .minutes-ring`);
        const daysValue = document.querySelector(`#countdown-${location.name} .days-value`);
        const hoursValue = document.querySelector(`#countdown-${location.name} .hours-value`);
        const minutesValue = document.querySelector(`#countdown-${location.name} .minutes-value`);

        const circumference = 2 * Math.PI * 54; // Assuming the radius is 54
        daysRing.style.strokeDasharray = circumference;
        hoursRing.style.strokeDasharray = circumference;
        minutesRing.style.strokeDasharray = circumference;

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = location.nextRunDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            daysValue.textContent = days.toString().padStart(2, '0');
            hoursValue.textContent = hours.toString().padStart(2, '0');
            minutesValue.textContent = minutes.toString().padStart(2, '0');

            const daysOffset = circumference - (days / 365) * circumference;
            const hoursOffset = circumference - (hours / 24) * circumference;
            const minutesOffset = circumference - (minutes / 60) * circumference;

            daysRing.style.strokeDashoffset = daysOffset;
            hoursRing.style.strokeDashoffset = hoursOffset;
            minutesRing.style.strokeDashoffset = minutesOffset;

            if (distance < 0) {
                clearInterval(countdownTimer);
                daysValue.textContent = '00';
                hoursValue.textContent = '00';
                minutesValue.textContent = '00';
                daysRing.style.strokeDashoffset = circumference;
                hoursRing.style.strokeDashoffset = circumference;
                minutesRing.style.strokeDashoffset = circumference;
            }
        }

        const countdownTimer = setInterval(updateCountdown, 1000);
        updateCountdown();

        // Initialize Leaflet map
        const map = L.map(`map-${location.name}`, {
            center: [location.lat, location.lon],
            zoom: location.zoom,
            zoomControl: false,
            attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        L.control.attribution({
            position: 'bottomright'
        }).addTo(map);

        // Add a marker for the run location
        L.marker([location.lat, location.lon]).addTo(map)
            .bindPopup(`${location.name.charAt(0).toUpperCase() + location.name.slice(1)} Run Location`)
            .openPopup();

        // Force a resize of the map after a short delay
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });

      // Initialize Calendar
    function initCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;

        // Sample events data
        const events = {
            '2024-11-28': { title: 'TURKEY TROT', link: 'https://www.turkeytrotmiami.com/?gad_source=1&gbraid=0AAAAADGxGX1-pli_Qk87XNYmXFRoQDbd2' }
        };

        const date = new Date(2024, 10); // October 2024
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day inactive';
            calendarDays.appendChild(dayElement);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            const dateSpan = document.createElement('span');
            dateSpan.textContent = day;
            dayElement.appendChild(dateSpan);

            // Check if there's an event on this day
            const dateString = `2024-11-${day.toString().padStart(2, '0')}`;
            if (events[dateString]) {
                const eventLink = document.createElement('a');
                eventLink.href = events[dateString].link;
                eventLink.className = 'event-link';
                eventLink.textContent = events[dateString].title;
                dayElement.appendChild(eventLink);
            }

            calendarDays.appendChild(dayElement);
        }
    }

    // Initialize the application
    function init() {
        initCalendar();
    }

    init();
});