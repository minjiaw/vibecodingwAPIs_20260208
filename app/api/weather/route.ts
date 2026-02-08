import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather condition emoji mapping
const getWeatherIcon = (weatherCode: number, isNight: boolean): string => {
  if (weatherCode >= 200 && weatherCode < 300) return '⛈️'; // Thunderstorm
  if (weatherCode >= 300 && weatherCode < 400) return '🌧️'; // Drizzle
  if (weatherCode >= 500 && weatherCode < 600) return '🌧️'; // Rain
  if (weatherCode >= 600 && weatherCode < 700) return '❄️'; // Snow
  if (weatherCode >= 700 && weatherCode < 800) return '🌫️'; // Atmosphere (fog, mist, etc.)
  if (weatherCode === 800) return isNight ? '🌙' : '☀️'; // Clear
  if (weatherCode === 801) return '⛅'; // Few clouds
  if (weatherCode > 801) return '☁️'; // Clouds
  return '☀️';
};

// Convert timestamp to time string (using local timezone)
const formatTime = (timestamp: number, timezoneOffset: number): string => {
  // Create date from UTC timestamp, then adjust for timezone
  const localMs = (timestamp * 1000) + (timezoneOffset * 1000);
  const date = new Date(localMs);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${period}`;
};

// Format day name
const formatDay = (timestamp: number, timezoneOffset: number, index: number): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const localMs = (timestamp * 1000) + (timezoneOffset * 1000);
  const date = new Date(localMs);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getUTCDay()];
};

// Format date
const formatDate = (timestamp: number, timezoneOffset: number): string => {
  const localMs = (timestamp * 1000) + (timezoneOffset * 1000);
  const date = new Date(localMs);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
};

// Get local date string for grouping
const getLocalDateKey = (timestamp: number, timezoneOffset: number): string => {
  const localMs = (timestamp * 1000) + (timezoneOffset * 1000);
  const date = new Date(localMs);
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  // Check if API key is configured
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured', fallback: true },
      { status: 503 }
    );
  }

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch current weather and forecast data
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=imperial`),
      fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=imperial`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    const timezoneOffset = currentData.timezone; // Offset in seconds from UTC
    const currentTime = Date.now() / 1000;
    const isNight = currentTime < currentData.sys.sunrise || currentTime > currentData.sys.sunset;

    // Process hourly forecast (next 12 entries from 3-hour intervals)
    const hourlyForecasts = forecastData.list.slice(0, 12).map((item: any, index: number) => ({
      time: index === 0 ? 'Now' : formatTime(item.dt, timezoneOffset),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: getWeatherIcon(item.weather[0].id, false),
      precipitation: Math.round((item.pop || 0) * 100)
    }));

    // Process daily forecast (next 5-7 days)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const dateKey = getLocalDateKey(item.dt, timezoneOffset);
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          temps: [item.main.temp],
          conditions: [item.weather[0]],
          timestamp: item.dt
        });
      } else {
        const existing = dailyMap.get(dateKey);
        existing.temps.push(item.main.temp);
        existing.conditions.push(item.weather[0]);
      }
    });

    const dailyForecasts = Array.from(dailyMap.values()).slice(0, 7).map((day: any, index: number) => {
      const high = Math.round(Math.max(...day.temps));
      const low = Math.round(Math.min(...day.temps));
      // Pick the midday condition for the day's representative weather
      const middayIndex = Math.floor(day.conditions.length / 2);
      const mainCondition = day.conditions[middayIndex];
      
      return {
        day: formatDay(day.timestamp, timezoneOffset, index),
        date: formatDate(day.timestamp, timezoneOffset),
        high,
        low,
        condition: mainCondition.main,
        icon: getWeatherIcon(mainCondition.id, false),
        description: mainCondition.description
      };
    });

    // Get today's high/low from forecast if available
    const todayKey = getLocalDateKey(currentTime, timezoneOffset);
    const todayForecast = dailyMap.get(todayKey);
    const todayHigh = todayForecast ? Math.round(Math.max(...todayForecast.temps)) : Math.round(currentData.main.temp);
    const todayLow = todayForecast ? Math.round(Math.min(...todayForecast.temps)) : Math.round(currentData.main.temp);

    // Wind direction from degrees
    const getWindDirection = (deg: number): string => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[Math.round(deg / 45) % 8];
    };

    // UV index rating
    const getUVRating = (uvi: number): string => {
      if (uvi < 3) return 'Low';
      if (uvi < 6) return 'Moderate';
      if (uvi < 8) return 'High';
      if (uvi < 11) return 'Very High';
      return 'Extreme';
    };

    // Format sunrise/sunset times
    const formatSunTime = (timestamp: number): string => {
      const localMs = (timestamp * 1000) + (timezoneOffset * 1000);
      const date = new Date(localMs);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    };

    // Determine pressure trend (simplified - would need historical data for accurate trend)
    const pressureTrend = currentData.main.pressure > 1013 ? 'rising' : 
                         currentData.main.pressure < 1013 ? 'falling' : 'steady';

    const weatherData = {
      location: currentData.name,
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        icon: getWeatherIcon(currentData.weather[0].id, isNight),
        feelsLike: Math.round(currentData.main.feels_like),
        high: todayHigh,
        low: todayLow
      },
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      details: {
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed),
        windDirection: getWindDirection(currentData.wind.deg),
        uvIndex: 5, // OpenWeatherMap free tier doesn't include UV - would need separate call or One Call API
        uvRating: getUVRating(5),
        visibility: Math.round(currentData.visibility / 1609.34), // Convert meters to miles
        pressure: currentData.main.pressure,
        pressureTrend,
        sunrise: formatSunTime(currentData.sys.sunrise),
        sunset: formatSunTime(currentData.sys.sunset)
      }
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', fallback: true },
      { status: 500 }
    );
  }
}
