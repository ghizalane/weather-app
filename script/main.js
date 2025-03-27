const input =document.getElementById('query');

input.addEventListener('keydown', function(e) {
    if(e.keyCode == 13) {
        const value = e.target.value;
        fetchData(value);
    }
})

function setData(data) { 
    const current = data.current;
    const forecast = data.forecast;
    const location = data.location;

    // City conditions
    const iconImg = document.querySelector('.weather-status .icon');
    const condition = document.querySelector('.weather-status .condition p');
    const city = document.querySelector('.city');
    const temp = document.querySelector('.temper');

    temp.textContent = current.temp_c; 
    city.innerHTML = `<h3> ${location.name}</h3>`;
    iconImg.innerHTML = `<img src=${current.condition.icon} alt='weather condition icon'>`;
    condition.textContent = current.condition.text;

    // Detailed conditions
    const humidity = document.getElementById('humidity');
    const airPressure = document.getElementById('air_pre');
    const rain = document.getElementById('rain');
    const wind = document.getElementById('wind');

    humidity.textContent = current.humidity;
    airPressure.textContent = current.pressure_mb;
    wind.textContent = current.wind_kph;
    rain.textContent = current.cloud;

    // Daily conditions
    const day = document.querySelector('.day');
    const date = new Date().toString().split(' ').slice(1, 2);
    const container = document.getElementById('cards');

    day.textContent = date;

    // Generate cards dynamically
    const list = forecast.forecastday[0].hour.map((oneHour) => {
        return (`
            <div class="card">
                <div class="time"><span>${oneHour.time}</span></div>
                <div class="degree"><span id='degree-calc'>${Math.round(oneHour.temp_c)}</span>°C</div>
                <div class="up-to">feels like <span>${oneHour.feelslike_c}</span>°C</div>
            </div>
        `);
    }).join('');
    container.innerHTML = list;

    // Initialize carousel functionality
    initializeCarousel(container);
}
function fetchData(query) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=3a7dc66b91bc44a695e151042212905&q=${query}`)
    .then(response => response.json())
    .then(data => setData(data));
}


window.addEventListener('load',function(){
    fetchData('Tokyo');
})
// cards swap
function initializeCarousel(container) {
    const cards = container.querySelectorAll('.card');
    let count = 0;

    // Ensure there are cards before proceeding
    if (cards.length === 0) return;

    // Create left and right buttons dynamically
    const leftBtn = document.createElement('button');
    leftBtn.classList.add('left');
    leftBtn.innerHTML = `<img src="images/left-arrow.svg" alt="Left">`;

    const rightBtn = document.createElement('button');
    rightBtn.classList.add('right');
    rightBtn.innerHTML = `<img src="images/right-arrow.png" alt="Right">`;

    // Append buttons to the container
    container.parentElement.insertBefore(leftBtn, container);
    container.parentElement.appendChild(rightBtn);

    // Add event listeners for the buttons
    leftBtn.addEventListener('click', () => moveCarousel(-1));
    rightBtn.addEventListener('click', () => moveCarousel(1));

    // Disable left button initially
    leftBtn.setAttribute('disabled', 'disabled');

    function moveCarousel(direction) {
        const cardWidth = cards[0].clientWidth;
        const visibleCards = Math.floor(container.clientWidth / cardWidth);

        // Update count based on direction
        count += direction;

        // Clamp count to prevent out-of-bounds scrolling
        count = Math.max(0, Math.min(count, cards.length - visibleCards));

        // Scroll the cards container
        container.scrollTo({
            left: count * cardWidth,
            behavior: 'smooth',
        });

        // Enable/disable buttons based on count
        if (count === 0) {
            leftBtn.setAttribute('disabled', 'disabled');
        } else {
            leftBtn.removeAttribute('disabled');
        }

        if (count >= cards.length - visibleCards) {
            rightBtn.setAttribute('disabled', 'disabled');
        } else {
            rightBtn.removeAttribute('disabled');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    // Toggle the menu on button click
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    // Close the menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('open');
        }
    });
});