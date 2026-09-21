import { config } from '../../config/env.js';

// In-memory cache for weather data
const weatherCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Realistic simulated weather engine based on coordinates and month
const generateSimulatedWeather = (city, country, lat, lon) => {
  const currentMonth = new Date().getMonth(); // 0 - 11
  let tempC = 22;
  let condition = 'Partly Cloudy';
  let icon = 'cloud-sun';
  let humidity = 65;
  let windSpeed = 12;

  // Approximate climate by latitude
  if (lat < -5 && lat > -15) {
    // Tropical (e.g. Bali)
    tempC = 28 + Math.round(Math.sin(Date.now() / 100000) * 3);
    condition = 'Tropical Warmth';
    icon = 'sun';
    humidity = 78;
    windSpeed = 10;
  } else if (lat > 45 && lat < 55) {
    // Temperate / Alpine (e.g. Paris, Zermatt, Banff)
    const isWinter = currentMonth >= 11 || currentMonth <= 2;
    const isSummer = currentMonth >= 5 && currentMonth <= 8;
    if (isWinter) {
      tempC = lat > 50 ? -2 : 5;
      condition = 'Crisp & Snowy';
      icon = 'snowflake';
    } else if (isSummer) {
      tempC = 24;
      condition = 'Sunny & Pleasant';
      icon = 'sun';
    } else {
      tempC = 16;
      condition = 'Mild Breeze';
      icon = 'cloud-sun';
    }
    humidity = 55;
    windSpeed = 14;
  } else if (lat > 30 && lat <= 45) {
    // Mediterranean / Subtropical (e.g. Santorini, Kyoto, Rome)
    tempC = 22;
    condition = 'Clear Mediterranean Skies';
    icon = 'sun';
    humidity = 50;
    windSpeed = 16;
  } else if (lat <= -30) {
    // Southern Hemisphere (e.g. Cape Town)
    tempC = 20;
    condition = 'Coastal Breeze';
    icon = 'wind';
    humidity = 60;
    windSpeed = 22;
  }

  return {
    source: 'simulated_climate',
    city,
    country,
    temperatureC: tempC,
    temperatureF: Math.round((tempC * 9) / 5 + 32),
    condition,
    icon,
    humidity: `${humidity}%`,
    windSpeed: `${windSpeed} km/h`,
    feelsLikeC: tempC - 1,
    forecast: [
      { day: 'Tomorrow', tempC: tempC + 1, condition: 'Partly Sunny' },
      { day: 'In 2 Days', tempC: tempC - 1, condition: 'Clear Sky' },
      { day: 'In 3 Days', tempC: tempC, condition: 'Mild Breeze' },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

export const fetchWeatherForDestination = async (destination) => {
  const cacheKey = destination.slug;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // If OpenWeatherMap API key is provided, attempt live fetch
  if (config.openWeatherApiKey && destination.latitude && destination.longitude) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${destination.latitude}&lon=${destination.longitude}&units=metric&appid=${config.openWeatherApiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Weather HTTP status ${response.status}`);
      const data = await response.json();

      const weatherResult = {
        source: 'openweathermap_live',
        city: data.name || destination.name,
        country: destination.country,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round((data.main.temp * 9) / 5 + 32),
        condition: data.weather[0]?.main || 'Clear',
        description: data.weather[0]?.description || 'Clear sky',
        icon: data.weather[0]?.icon || '01d',
        humidity: `${data.main.humidity}%`,
        windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
        feelsLikeC: Math.round(data.main.feels_like),
        lastUpdated: new Date().toISOString(),
      };

      weatherCache.set(cacheKey, {
        timestamp: Date.now(),
        data: weatherResult,
      });

      return weatherResult;
    } catch (err) {
      console.warn(`OpenWeatherMap API request failed for ${destination.name}: ${err.message}. Falling back to simulation.`);
    }
  }

  // Fallback to rich dynamic simulated weather
  const simulated = generateSimulatedWeather(
    destination.name,
    destination.country,
    destination.latitude || 0,
    destination.longitude || 0
  );

  weatherCache.set(cacheKey, {
    timestamp: Date.now(),
    data: simulated,
  });

  return simulated;
};
