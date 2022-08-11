'use strict';
feather.replace();

const API_KEY = '51603b0aaddd43259ef95639220908';
const loader = document.querySelector('.loader');
const locationButton = document.querySelector('.location-button');
const locationForm = document.querySelector('.location-form');
const locationInput = document.querySelector('.location-input');
const locationText = document.querySelector('.location');
const locationMessage = document.querySelector('.location-message');
const weatherContainer = document.querySelector('.weather-container');
const weatherTemperature = document.querySelector('.weather-temp');
const weatherDescription = document.querySelector('.weather-desc');
const dateContainer = document.querySelector('.date-container');
const dateWeekday = document.querySelector('.date-dayname');
const dateFullDate = document.querySelector('.date-day');

startApp();

locationButton.addEventListener('click', function () {
	this.hidden = true;
	locationForm.hidden = false;
});

document.body.addEventListener('click', e => {
	if (e.target.tagName === 'BODY') {
		locationButton.hidden = false;
		locationForm.hidden = true;
	}
});

locationForm.addEventListener('submit', function (e) {
	e.preventDefault();
	loaderSwitch();
	locationForm.hidden = true;
	locationButton.hidden = false;

	getWeather(locationInput.value).then(weather => renderWeather(weather));
	locationInput.value = '';
});

async function getWeather(city) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
	);

	if (response.ok) {
		const weather = await response.json();
		locationMessage.textContent = '';
		return weather;
	} else {
		let timeout;
		clearTimeout(timeout);
		locationMessage.textContent = 'Try to enter again';
		loaderSwitch();
	}
}

function startApp() {
	renderDate();
	navigator.geolocation.getCurrentPosition(location => {
		fetch(
			`https://nominatim.openstreetmap.org/reverse?format=jsonv2
			&lat=${location.coords.latitude}
			&lon=${location.coords.longitude}`
		)
			.then(res => res.json())
			.then(data => {
				getWeather(data.address.city).then(weather => renderWeather(weather));
			});
	});
}

function createIcon(description) {
	document.querySelector('.weather-icon').remove();
	const icon = document.createElement('img');
	icon.classList.add('weather-icon');
	if (description.includes('cloud') || description.includes('overcast')) {
		icon.src = './images/cloud.svg';
	} else if (description.includes('thunder')) {
		icon.src = './images/thunder.svg';
	} else if (description.includes('rain')) {
		icon.src = './images/rain.svg';
	} else {
		icon.src = './images/sun.svg';
	}
	return icon;
}

function loaderSwitch() {
	weatherContainer.classList.toggle('hidden');
	dateContainer.classList.toggle('hidden');
	loader.classList.toggle('hidden');
}

function renderWeather(weather) {
	const { temp_c: temp } = weather.current;
	const { text: description } = weather.current.condition;
	let { name: cityName, country } = weather.location;

	switch (country) {
		case 'United Kingdom':
			country = 'UK';
			break;
		case 'United States of America':
			country = 'USA';
			break;
		case 'Соединенные Штаты Америки':
			country = 'США';
			break;
	}

	let icon = createIcon(description.toLowerCase());
	weatherContainer.prepend(icon);
	locationText.textContent = `${cityName}, ${country}`;
	weatherTemperature.textContent = `${temp}°C`;
	weatherDescription.textContent = description;

	loaderSwitch();
}

function renderDate() {
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const weekDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	const date = new Date();
	const weekDay = weekDays[date.getDay()];
	const fullDate =
		String(date.getDate()).padStart(2, '0') +
		' ' +
		monthNames[date.getMonth()] +
		' ' +
		String(date.getFullYear());

	dateWeekday.textContent = weekDay;
	dateFullDate.textContent = fullDate;
}
