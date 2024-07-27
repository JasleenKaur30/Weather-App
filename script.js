function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, () => {
            document.getElementById("body").style.filter = 'blur(0rem)';
        });
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getName(latitude, longitude)
}

async function getName(latitude, longitude) {
    var access_key = '2868a03a00fa977f7f1bf835f7b0c557'
    var url = `https://api.openweathermap.org/geo/1.0/reverse?lat=` + latitude + `&lon=` + longitude + `&limit=5&appid=` + access_key;
    var res = await fetch(url);
    var data = await res.json();
    var location = data[0].name.split(" ")[0];
    fetchData(location);
    document.getElementById("body").style.filter = 'blur(0rem)';
}

function findWeather() {
    var location = document.getElementById("search").value;
    fetchData(location)
}

async function fetchData(location) {
    var url = `https://api.weatherapi.com/v1/current.json?key=1c63857a8e0548f9a1a152750210909&q=` + location + `&aqi=yes`;
    var res = await fetch(url);
    var data = await res.json();
    if (res.status == 200) {
        setValues(data);
    } else {
        var tags = document.getElementsByClassName('reset');
        for (let index = 0; index < tags.length; index++) {
            tags.item(index).innerHTML = ""
        }
        document.getElementById("name").innerHTML = "Location not Found";
    }
}

function setValues(data) {
    var setter = document.getElementById("temp_c");
    setter.innerHTML = data.current.temp_c + `&#176`;

    setter = document.getElementById('name');
    setter.innerHTML = data.location.name;

    setter = document.getElementById("region");
    setter.innerHTML = `&nbsp;` + data.location.region + `, ` + data.location.country;
    setter = document.getElementById("feelslike_c");
    setter.innerHTML = `Feels like ` + data.current.feelslike_c + `&#176`;

    setter = document.getElementById("condition");
    setter.innerHTML = data.current.condition.text;

    setter = document.getElementById("cloud");
    setter.innerHTML = data.current.cloud + `%`;

    setter = document.getElementById("humidity");
    setter.innerHTML = data.current.humidity + `%`;

    setter = document.getElementById("wind_kph");
    setter.innerHTML = data.current.wind_kph + ` Km/h ` + data.current.wind_dir;

    setter = document.getElementById("gust_kph");
    setter.innerHTML = data.current.gust_kph + ` Km/h`;

    setter = document.getElementById("precip_mm");
    setter.innerHTML = data.current.precip_mm + `mm`;

    setter = document.getElementById("pressure_mb");
    setter.innerHTML = data.current.pressure_mb + `mb`;

    setter = document.getElementById("vis_km");
    setter.innerHTML = data.current.vis_km + ` KM`;

    setter = document.getElementById("uv");
    setter.innerHTML = data.current.uv + ` `;
}

function getWeather() {
    const apiKey = '2868a03a00fa977f7f1bf835f7b0c557';
    const city = document.getElementById('city').value;

    function updateBackground(description) {
        let backgroundUrl = '';

        if (description.includes('clear')) {
            backgroundUrl = 'url("https://i.gifer.com/XFbw.gif")';
        } else if (description.includes('cloud')) {
            backgroundUrl = 'url("https://www.adventurebikerider.com/wp-content/uploads/2017/10/tumblr_o27c7fByaO1tchrkco1_500.gif")';
        } else if (description.includes('rain')) {
            backgroundUrl = 'url("https://www.icegif.com/wp-content/uploads/2021/11/icegif-695.gif")';
        } else if (description.includes('snow')) {
            backgroundUrl = 'url("https://25.media.tumblr.com/tumblr_mb6jl8AUkU1rha1i6o1_500.gif")';
        } else {
            backgroundUrl = 'url("https://24.media.tumblr.com/88f9ca54815ef1e8a4ccd67a062e52a6/tumblr_mstqhzIrfc1s75c57o1_500.gif")';
        }

        document.body.style.backgroundImage = backgroundUrl;
    }

    function displayWeather(data) {
        const tempDivInfo = document.getElementById('temp-div');
        const weatherInfoDiv = document.getElementById('weather-info');
        const weatherIcon = document.getElementById('weather-icon');
        const hourlyForecastDiv = document.getElementById('hourly-forecast');

        // Clear previous content
        weatherInfoDiv.innerHTML = '';
        hourlyForecastDiv.innerHTML = '';
        tempDivInfo.innerHTML = '';

        if (data.cod === '404') {
            weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        } else {
            const cityName = data.name;
            const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            const temperatureHTML = `
                <p>${temperature}°C</p>
            `;

            const weatherHtml = `
                <p>${cityName}</p>
                <p>${description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${data.wind.speed} Km/h ${data.wind.deg}°</p>
                <p>Cloud: ${data.clouds.all}%</p>
                <p>Pressure: ${data.main.pressure} mb</p>
            `;

            tempDivInfo.innerHTML = temperatureHTML;
            weatherInfoDiv.innerHTML = weatherHtml;
            weatherIcon.src = iconUrl;
            weatherIcon.alt = description;

            showImage();
            updateBackground(description);
        }
    }

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
        });
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Temperature is already in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
