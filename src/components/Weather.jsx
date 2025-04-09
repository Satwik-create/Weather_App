import React, { useEffect, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [error, setError] = useState('');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }

  const search = async (city) => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message || 'City not found');
        setWeatherData(null);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon
      });
      setError('');
    } catch (error) {
      setError('Failed to fetch weather data. Try again later.');
      setWeatherData(null);
    }
  }

  useEffect(() => {
    search('Delhi'); // Default city on load
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search'
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(cityInput)}
        />
        <img src={search_icon} alt='Search' onClick={() => search(cityInput)} style={{ cursor: 'pointer' }} />
      </div>

      {error && <p className='error'>{error}</p>}

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="weather icon" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
