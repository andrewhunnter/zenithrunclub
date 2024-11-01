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
    
    VANTA.FOG({
        el: "#vanta-container",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 100.00,
        minWidth: 100.00,
        highlightColor: 0xff80a4,
        midtoneColor: 0x0,
        lowlightColor: 0xff76c6,
        baseColor: 0x0,
        blurFactor: 0.6,
        speed: 0.7,
        zoom: 0.5
    });
    
    const locations = [
        { 
            name: 'gainesville', 
            lat: 29.6516, 
            lon: -82.3248, 
            zoom: 13,
            nextRunDate: new Date('2024-11-03T08:00:00').getTime()
        },
        { 
            name: 'miami', 
            lat: 25.6714, 
            lon: -80.2726, 
            zoom: 13,
            nextRunDate: new Date('2024-11-03T08:00:00').getTime()
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

    function populateEvents() {
        const eventsContainer = document.querySelector('.events-container');
        
        if (!eventsContainer) return;
    
        const events = [
          {
            name: "Summer Solstice Run",
            date: "June 21, 2024",
            time: "6:00 PM",
            location: "Depot Park, Gainesville",
            distance: "5K",
            discountCode: "SOLSTICE2024"
          },
          {
            name: "Miami Beach Sunset Run",
            date: "July 15, 2024",
            time: "7:30 PM",
            location: "South Beach, Miami",
            distance: "10K",
          },
          {
            name: "Gator Trail Challenge",
            date: "August 3, 2024",
            time: "8:00 AM",
            location: "San Felasco Hammock Preserve",
            distance: "Half Marathon",
          }
        ];
    
        events.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
          eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <span class="event-date">${event.date}</span>
            <div class="event-details">
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Distance:</strong> ${event.distance}</p>
            </div>
            <a href="#" class="register-button">Register Now</a>
          `;
          eventsContainer.appendChild(eventCard);
        });
      }
    
      // Call the populateEvents function
      populateEvents();
});