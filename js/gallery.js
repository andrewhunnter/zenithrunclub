document.addEventListener('DOMContentLoaded', function() {
     // Explicit image paths for each carousel
     const gainesvilleImages = [
        '/images//gnv/gnv-1.jpeg',
        '/images/gnv/gnv-2.jpeg',
    ];

    const miamiImages = [
        '/images/miami/deering.jpeg',
        '/images/miami/deering-2.jpeg',
    ];

    // Initialize gallery grid
    function initGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="Run Club Event" class="gallery-image">
                <div class="gallery-info">
                    <span class="gallery-date">${item.date}</span>
                    <a href="${item.driveLink}" target="_blank" class="drive-link">
                        View Album <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Initialize carousel
    function initCarousel(images, trackClass) {
        const track = document.querySelector(`.${trackClass}`);
        if (!track) return;

        // Add images to carousel
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${image}" alt="Run Club Event ${index + 1}">`;
            track.appendChild(slide);
        });

        // Carousel navigation
        const carousel = track.closest('.carousel');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        let currentIndex = 0;
        const slideWidth = 330; // slide width + margin

        function updateCarousel() {
            const maxTranslate = -(track.children.length * slideWidth - carousel.offsetWidth);
            let translateX = -currentIndex * slideWidth;
            translateX = Math.max(maxTranslate, Math.min(0, translateX));
            track.style.transform = `translateX(${translateX}px)`;

            // Update button states
            prevBtn.disabled = translateX >= 0;
            nextBtn.disabled = translateX <= maxTranslate;
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        }

        prevBtn?.addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        nextBtn?.addEventListener('click', () => {
            const maxIndex = Math.ceil((track.children.length * slideWidth - carousel.offsetWidth) / slideWidth);
            currentIndex = Math.min(currentIndex + 1, maxIndex);
            updateCarousel();
        });

        // Initial update
        updateCarousel();
    }

    // Calendar initialization
    function initCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;

        // Sample events data - you can modify this with your actual events
        const events = {
            '2024-10-05': { title: 'Morning Run', link: '#' },
            '2024-10-07': { title: 'Trail Run', link: '#' },
            '2024-10-16': { title: 'Group Run', link: '#' },
            '2024-10-22': { title: 'Marathon', link: '#' }
        };

        const date = new Date(2024, 9); // October 2024
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
            const dateString = `2024-10-${day.toString().padStart(2, '0')}`;
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

    // Initialize everything
    function init() {
        initGallery();
        initCarousel(gainesvilleImages, 'gainesville-track');
        initCarousel(miamiImages, 'miami-track');
        initCalendar();
    }

    // Start the application
    init();
});