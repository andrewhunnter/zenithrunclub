document.addEventListener('DOMContentLoaded', function() {

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