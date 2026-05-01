const apikey = "ca978441b5bd9a9d38ad6ea9ccaf55b6";

    const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    const searchBox = document.querySelector(".search input");
    const searchButton = document.querySelector(".search button");

    const errorMsg = document.querySelector(".error");
    const loader = document.querySelector(".loader");

    const weatherIcon = document.querySelector(".weather-icon");

    const canvas = document.getElementById("rainCanvas");
    const ctx = canvas.getContext("2d");

    const rainSound = document.getElementById("rainSound");


    canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rainDrops = [];

// create raindrops
for(let i = 0; i < 150; i++){
    rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 4
    });
}

function drawRain(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(isRaining){
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1;

        for(let i = 0; i < rainDrops.length; i++){
            let drop = rainDrops[i];

            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;

            if(drop.y > canvas.height){
                drop.y = -20;
                drop.x = Math.random() * canvas.width;
            }
        }
    }

    requestAnimationFrame(drawRain);
}

    async function checkweather(city) {

        loader.style.display = "block";

        const response = await fetch(apiurl + city + `&appid=${apikey}`);

        const data = await response.json();

        loader.style.display = "none";

        if (response.status == 404) {

            errorMsg.innerHTML = "City not found";
            errorMsg.style.display = "block";
            return;

        }

        errorMsg.style.display = "none";

        updateUI(data);

    }

    function updateUI(data) {

        document.querySelector(".city").innerHTML = data.name;

        document.querySelector(".temp").innerHTML =
            Math.round(data.main.temp) + "°C";

        document.querySelector(".humidity h5").innerHTML =
            data.main.humidity + "%";

        document.querySelector(".wind h5").innerHTML =
            data.wind.speed + " km/h";

        changeIcon(data.weather[0].main);
        changeBackground(data.weather[0].main);
        handleSound(data.weather[0].main);
        const weather = data.weather[0].main;

    showWeatherText(weather);   // text
    handleSound(weather);       // sound
    toggleRain(weather);        // animation

    }


    function changeIcon(weather) {

        if (weather == "Clouds") {
            weatherIcon.src = "images/cloud.png";
        }

        else if (weather == "Clear") {
            weatherIcon.src = "images/sunny.png";
        }

        else if (weather == "Rain") {
            weatherIcon.src = "images/rainy.png";
        }

        else if (weather == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }

        else if (weather == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        else if (weather == "snow") {
            weatherIcon.src = "images/snow.png";
        }

    }

    function showWeatherText(weather){
    const status = document.querySelector(".weather-status");

    if(weather === "Rain"){
        status.innerText = "🌧️ Rainy";
    }
    else if(weather === "Clear"){
        status.innerText = "☀️ Sunny";
    }
    else if(weather === "Clouds"){
        status.innerText = "☁️ Cloudy";
    }
    else if(weather === "Drizzle"){
        status.innerText = "🌦️ Light Rain";
    }
    else if(weather === "Mist"){
        status.innerText = "🌫️ Misty";
    }
    else{
        status.innerText = weather;
    }
}

    function changeBackground(weather) {

        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        if (weather == "Clear") {
            document.body.style.backgroundImage = "url(images/sunny.jpg)";
        }

        else if (weather == "Clouds") {
            document.body.style.backgroundImage = "url(images/cloudy.jpg)";
        }

        else if (weather == "Rain") {
            document.body.style.backgroundImage = "url(images/rainy.jpg)";
        }

        else if (weather == "Snow") {
            document.body.style.backgroundImage = "url(images/snow.jpg)";
        }
        else if (weather == "Drizzle") {
            document.body.style.backgroundImage = "url(images/drizzle.jpg)";
        }
        else if (weather == "Mist") {
            document.body.style.backgroundImage = "url(images/mist.jpg)";
        }
    }

    async function getLocationWeather(lat, lon) {

        loader.style.display = "block";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`
        );

        const data = await response.json();

        loader.style.display = "none";

        updateUI(data);

    }

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {

            getLocationWeather(
                position.coords.latitude,
                position.coords.longitude
            );

        });

    }

    searchButton.addEventListener("click", () => {

        if (searchBox.value == "") {

            errorMsg.innerHTML = "Please enter a city name";
            errorMsg.style.display = "block";

        } else {

            checkweather(searchBox.value);

        }

    });

    searchBox.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            if (searchBox.value == "") {

                errorMsg.innerHTML = "Please enter a city name";
                errorMsg.style.display = "block";

            } else {

                checkweather(searchBox.value);

            }

        }

    });

    const locationBtn = document.querySelector(".location-btn");

    locationBtn.addEventListener("click", () => {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    getLocationWeather(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                },

                () => {
                    alert("Please enable location permission");
                }

            );

        }

    });


function handleSound(weather){
    if(weather === "Rain" || weather === "Drizzle"){
        rainSound.volume = 1;
        rainSound.play().catch(()=>{});
    } else {
        rainSound.pause();
        rainSound.currentTime = 0;
    }
}
