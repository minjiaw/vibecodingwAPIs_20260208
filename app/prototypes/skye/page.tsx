"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sofia_Sans_Condensed, IBM_Plex_Mono } from 'next/font/google';
import styles from './styles.module.css';

const sofiaSansCondensed = Sofia_Sans_Condensed({
    weight: '800',
    subsets: ['latin']
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '500', '600'],
    subsets: ['latin']
});

// TypeScript interfaces for weather data
interface HourlyForecast {
    time: string;
    temp: number;
    condition: string;
    icon: string;
    precipitation: number;
}

interface DailyForecast {
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    description: string;
}

interface WeatherDetails {
    humidity: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    uvRating: string;
    visibility: number;
    pressure: number;
    pressureTrend: 'rising' | 'falling' | 'steady';
    sunrise: string;
    sunset: string;
}

interface CurrentWeather {
    temp: number;
    condition: string;
    icon: string;
    feelsLike: number;
    high: number;
    low: number;
}

interface WeatherData {
    location: string;
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    details: WeatherDetails;
}

// Placeholder weather data for multiple cities
const WEATHER_DATA: Record<string, WeatherData> = {
    "San Francisco": {
        location: "San Francisco",
        current: {
            temp: 68,
            condition: "Partly cloudy",
            icon: "⛅",
            feelsLike: 65,
            high: 72,
            low: 58
        },
        hourly: [
            { time: "Now", temp: 68, condition: "Partly cloudy", icon: "⛅", precipitation: 0 },
            { time: "2PM", temp: 70, condition: "Partly cloudy", icon: "⛅", precipitation: 0 },
            { time: "3PM", temp: 71, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "4PM", temp: 72, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "5PM", temp: 70, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "6PM", temp: 67, condition: "Partly cloudy", icon: "⛅", precipitation: 10 },
            { time: "7PM", temp: 64, condition: "Cloudy", icon: "☁️", precipitation: 15 },
            { time: "8PM", temp: 62, condition: "Cloudy", icon: "☁️", precipitation: 20 },
            { time: "9PM", temp: 60, condition: "Cloudy", icon: "☁️", precipitation: 15 },
            { time: "10PM", temp: 59, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "11PM", temp: 58, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "12AM", temp: 57, condition: "Clear", icon: "🌙", precipitation: 0 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 72, low: 58, condition: "Partly cloudy", icon: "⛅", description: "Partly cloudy throughout the day" },
            { day: "Thursday", date: "Jan 9", high: 70, low: 56, condition: "Sunny", icon: "☀️", description: "Clear skies all day" },
            { day: "Friday", date: "Jan 10", high: 68, low: 54, condition: "Cloudy", icon: "☁️", description: "Mostly cloudy" },
            { day: "Saturday", date: "Jan 11", high: 65, low: 52, condition: "Rainy", icon: "🌧️", description: "Rain expected in the afternoon" },
            { day: "Sunday", date: "Jan 12", high: 64, low: 51, condition: "Rainy", icon: "🌧️", description: "Showers throughout the day" },
            { day: "Monday", date: "Jan 13", high: 67, low: 53, condition: "Partly cloudy", icon: "⛅", description: "Clearing up" },
            { day: "Tuesday", date: "Jan 14", high: 70, low: 55, condition: "Sunny", icon: "☀️", description: "Beautiful sunny day" }
        ],
        details: {
            humidity: 65,
            windSpeed: 8,
            windDirection: "NW",
            uvIndex: 6,
            uvRating: "High",
            visibility: 10,
            pressure: 1013,
            pressureTrend: "steady",
            sunrise: "7:24 AM",
            sunset: "5:18 PM"
        }
    },
    "New York": {
        location: "New York",
        current: {
            temp: 45,
            condition: "Cloudy",
            icon: "☁️",
            feelsLike: 38,
            high: 48,
            low: 35
        },
        hourly: [
            { time: "Now", temp: 45, condition: "Cloudy", icon: "☁️", precipitation: 20 },
            { time: "2PM", temp: 46, condition: "Cloudy", icon: "☁️", precipitation: 25 },
            { time: "3PM", temp: 47, condition: "Rainy", icon: "🌧️", precipitation: 60 },
            { time: "4PM", temp: 48, condition: "Rainy", icon: "🌧️", precipitation: 70 },
            { time: "5PM", temp: 46, condition: "Rainy", icon: "🌧️", precipitation: 65 },
            { time: "6PM", temp: 44, condition: "Rainy", icon: "🌧️", precipitation: 50 },
            { time: "7PM", temp: 42, condition: "Cloudy", icon: "☁️", precipitation: 30 },
            { time: "8PM", temp: 40, condition: "Cloudy", icon: "☁️", precipitation: 20 },
            { time: "9PM", temp: 39, condition: "Partly cloudy", icon: "⛅", precipitation: 10 },
            { time: "10PM", temp: 38, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "11PM", temp: 37, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "12AM", temp: 36, condition: "Clear", icon: "🌙", precipitation: 0 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 48, low: 35, condition: "Rainy", icon: "🌧️", description: "Rain in the afternoon" },
            { day: "Thursday", date: "Jan 9", high: 42, low: 30, condition: "Partly cloudy", icon: "⛅", description: "Clearing up" },
            { day: "Friday", date: "Jan 10", high: 40, low: 28, condition: "Sunny", icon: "☀️", description: "Cold but sunny" },
            { day: "Saturday", date: "Jan 11", high: 38, low: 26, condition: "Snowy", icon: "❄️", description: "Light snow expected" },
            { day: "Sunday", date: "Jan 12", high: 35, low: 24, condition: "Snowy", icon: "❄️", description: "Snow continuing" },
            { day: "Monday", date: "Jan 13", high: 36, low: 25, condition: "Cloudy", icon: "☁️", description: "Mostly cloudy" },
            { day: "Tuesday", date: "Jan 14", high: 40, low: 28, condition: "Partly cloudy", icon: "⛅", description: "Improving conditions" }
        ],
        details: {
            humidity: 78,
            windSpeed: 15,
            windDirection: "NE",
            uvIndex: 2,
            uvRating: "Low",
            visibility: 6,
            pressure: 1008,
            pressureTrend: "falling",
            sunrise: "7:20 AM",
            sunset: "4:55 PM"
        }
    },
    "Tokyo": {
        location: "Tokyo",
        current: {
            temp: 52,
            condition: "Clear",
            icon: "☀️",
            feelsLike: 50,
            high: 56,
            low: 44
        },
        hourly: [
            { time: "Now", temp: 52, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "2PM", temp: 54, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "3PM", temp: 55, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "4PM", temp: 56, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "5PM", temp: 54, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "6PM", temp: 52, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "7PM", temp: 50, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "8PM", temp: 48, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "9PM", temp: 47, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "10PM", temp: 46, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "11PM", temp: 45, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "12AM", temp: 44, condition: "Clear", icon: "🌙", precipitation: 0 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 56, low: 44, condition: "Sunny", icon: "☀️", description: "Beautiful clear day" },
            { day: "Thursday", date: "Jan 9", high: 57, low: 45, condition: "Sunny", icon: "☀️", description: "Another sunny day" },
            { day: "Friday", date: "Jan 10", high: 58, low: 46, condition: "Partly cloudy", icon: "⛅", description: "Mostly sunny" },
            { day: "Saturday", date: "Jan 11", high: 55, low: 44, condition: "Cloudy", icon: "☁️", description: "Clouds moving in" },
            { day: "Sunday", date: "Jan 12", high: 53, low: 42, condition: "Cloudy", icon: "☁️", description: "Overcast skies" },
            { day: "Monday", date: "Jan 13", high: 54, low: 43, condition: "Partly cloudy", icon: "⛅", description: "Partly cloudy" },
            { day: "Tuesday", date: "Jan 14", high: 56, low: 44, condition: "Sunny", icon: "☀️", description: "Clear and pleasant" }
        ],
        details: {
            humidity: 55,
            windSpeed: 6,
            windDirection: "E",
            uvIndex: 5,
            uvRating: "Moderate",
            visibility: 15,
            pressure: 1020,
            pressureTrend: "rising",
            sunrise: "6:51 AM",
            sunset: "4:38 PM"
        }
    },
    "London": {
        location: "London",
        current: {
            temp: 50,
            condition: "Rainy",
            icon: "🌧️",
            feelsLike: 44,
            high: 52,
            low: 42
        },
        hourly: [
            { time: "Now", temp: 50, condition: "Rainy", icon: "🌧️", precipitation: 75 },
            { time: "2PM", temp: 51, condition: "Rainy", icon: "🌧️", precipitation: 80 },
            { time: "3PM", temp: 51, condition: "Rainy", icon: "🌧️", precipitation: 85 },
            { time: "4PM", temp: 52, condition: "Rainy", icon: "🌧️", precipitation: 80 },
            { time: "5PM", temp: 51, condition: "Rainy", icon: "🌧️", precipitation: 70 },
            { time: "6PM", temp: 49, condition: "Cloudy", icon: "☁️", precipitation: 45 },
            { time: "7PM", temp: 48, condition: "Cloudy", icon: "☁️", precipitation: 30 },
            { time: "8PM", temp: 47, condition: "Cloudy", icon: "☁️", precipitation: 20 },
            { time: "9PM", temp: 46, condition: "Cloudy", icon: "☁️", precipitation: 15 },
            { time: "10PM", temp: 45, condition: "Cloudy", icon: "☁️", precipitation: 10 },
            { time: "11PM", temp: 44, condition: "Cloudy", icon: "☁️", precipitation: 10 },
            { time: "12AM", temp: 43, condition: "Cloudy", icon: "☁️", precipitation: 5 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 52, low: 42, condition: "Rainy", icon: "🌧️", description: "Heavy rain expected" },
            { day: "Thursday", date: "Jan 9", high: 50, low: 40, condition: "Cloudy", icon: "☁️", description: "Mostly cloudy" },
            { day: "Friday", date: "Jan 10", high: 48, low: 39, condition: "Rainy", icon: "🌧️", description: "Light rain" },
            { day: "Saturday", date: "Jan 11", high: 49, low: 40, condition: "Cloudy", icon: "☁️", description: "Overcast" },
            { day: "Sunday", date: "Jan 12", high: 51, low: 41, condition: "Partly cloudy", icon: "⛅", description: "Some sun breaks" },
            { day: "Monday", date: "Jan 13", high: 52, low: 42, condition: "Partly cloudy", icon: "⛅", description: "Partly cloudy" },
            { day: "Tuesday", date: "Jan 14", high: 53, low: 43, condition: "Cloudy", icon: "☁️", description: "Mostly cloudy" }
        ],
        details: {
            humidity: 85,
            windSpeed: 18,
            windDirection: "SW",
            uvIndex: 1,
            uvRating: "Low",
            visibility: 4,
            pressure: 998,
            pressureTrend: "falling",
            sunrise: "8:05 AM",
            sunset: "4:10 PM"
        }
    },
    "Paris": {
        location: "Paris",
        current: {
            temp: 55,
            condition: "Partly cloudy",
            icon: "⛅",
            feelsLike: 52,
            high: 58,
            low: 46
        },
        hourly: [
            { time: "Now", temp: 55, condition: "Partly cloudy", icon: "⛅", precipitation: 10 },
            { time: "2PM", temp: 56, condition: "Partly cloudy", icon: "⛅", precipitation: 10 },
            { time: "3PM", temp: 57, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "4PM", temp: 58, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "5PM", temp: 57, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "6PM", temp: 54, condition: "Partly cloudy", icon: "⛅", precipitation: 10 },
            { time: "7PM", temp: 52, condition: "Cloudy", icon: "☁️", precipitation: 15 },
            { time: "8PM", temp: 50, condition: "Cloudy", icon: "☁️", precipitation: 20 },
            { time: "9PM", temp: 49, condition: "Cloudy", icon: "☁️", precipitation: 15 },
            { time: "10PM", temp: 48, condition: "Cloudy", icon: "☁️", precipitation: 10 },
            { time: "11PM", temp: 47, condition: "Partly cloudy", icon: "⛅", precipitation: 5 },
            { time: "12AM", temp: 46, condition: "Clear", icon: "🌙", precipitation: 0 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 58, low: 46, condition: "Partly cloudy", icon: "⛅", description: "Mix of sun and clouds" },
            { day: "Thursday", date: "Jan 9", high: 57, low: 45, condition: "Sunny", icon: "☀️", description: "Mostly sunny" },
            { day: "Friday", date: "Jan 10", high: 56, low: 44, condition: "Partly cloudy", icon: "⛅", description: "Partly cloudy" },
            { day: "Saturday", date: "Jan 11", high: 54, low: 43, condition: "Cloudy", icon: "☁️", description: "Mostly cloudy" },
            { day: "Sunday", date: "Jan 12", high: 53, low: 42, condition: "Rainy", icon: "🌧️", description: "Light rain possible" },
            { day: "Monday", date: "Jan 13", high: 55, low: 44, condition: "Partly cloudy", icon: "⛅", description: "Improving conditions" },
            { day: "Tuesday", date: "Jan 14", high: 57, low: 45, condition: "Sunny", icon: "☀️", description: "Nice and sunny" }
        ],
        details: {
            humidity: 68,
            windSpeed: 10,
            windDirection: "W",
            uvIndex: 3,
            uvRating: "Moderate",
            visibility: 12,
            pressure: 1015,
            pressureTrend: "steady",
            sunrise: "8:35 AM",
            sunset: "5:15 PM"
        }
    },
    "Sydney": {
        location: "Sydney",
        current: {
            temp: 82,
            condition: "Sunny",
            icon: "☀️",
            feelsLike: 85,
            high: 86,
            low: 72
        },
        hourly: [
            { time: "Now", temp: 82, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "2PM", temp: 84, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "3PM", temp: 85, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "4PM", temp: 86, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "5PM", temp: 84, condition: "Sunny", icon: "☀️", precipitation: 0 },
            { time: "6PM", temp: 81, condition: "Clear", icon: "☀️", precipitation: 0 },
            { time: "7PM", temp: 78, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "8PM", temp: 76, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "9PM", temp: 75, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "10PM", temp: 74, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "11PM", temp: 73, condition: "Clear", icon: "🌙", precipitation: 0 },
            { time: "12AM", temp: 72, condition: "Clear", icon: "🌙", precipitation: 0 }
        ],
        daily: [
            { day: "Today", date: "Jan 8", high: 86, low: 72, condition: "Sunny", icon: "☀️", description: "Perfect beach weather" },
            { day: "Thursday", date: "Jan 9", high: 88, low: 74, condition: "Sunny", icon: "☀️", description: "Hot and sunny" },
            { day: "Friday", date: "Jan 10", high: 87, low: 73, condition: "Partly cloudy", icon: "⛅", description: "Mostly sunny" },
            { day: "Saturday", date: "Jan 11", high: 84, low: 71, condition: "Partly cloudy", icon: "⛅", description: "Partly cloudy" },
            { day: "Sunday", date: "Jan 12", high: 82, low: 70, condition: "Cloudy", icon: "☁️", description: "Clouds increasing" },
            { day: "Monday", date: "Jan 13", high: 79, low: 68, condition: "Rainy", icon: "🌧️", description: "Showers likely" },
            { day: "Tuesday", date: "Jan 14", high: 80, low: 69, condition: "Partly cloudy", icon: "⛅", description: "Clearing up" }
        ],
        details: {
            humidity: 62,
            windSpeed: 12,
            windDirection: "SE",
            uvIndex: 9,
            uvRating: "Very High",
            visibility: 15,
            pressure: 1018,
            pressureTrend: "rising",
            sunrise: "5:52 AM",
            sunset: "8:03 PM"
        }
    }
};

export default function SkyeWeatherApp() {
    const [selectedCity, setSelectedCity] = useState<string>("San Francisco");
    const [isCelsius, setIsCelsius] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showCityList, setShowCityList] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(WEATHER_DATA);
    const [isUsingAPI, setIsUsingAPI] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentWeather = weatherData[selectedCity];
    const cities = Object.keys(weatherData);

    // Get background color
    const getWeatherColor = (): string => {
        return '#0A77E4';
    };

    // Temperature conversion helper
    const convertTemp = (fahrenheit: number): number => {
        if (isCelsius) {
            return Math.round((fahrenheit - 32) * (5 / 9));
        }
        return fahrenheit;
    };

    // Filter cities based on search query
    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle search submission (for any city in the world)
    const handleSearchSubmit = async () => {
        if (!searchQuery.trim()) return;

        const cityToSearch = searchQuery.trim();
        setShowCityList(false);
        setIsTransitioning(true);

        try {
            setIsLoading(true);
            const response = await fetch(`/api/weather?city=${encodeURIComponent(cityToSearch)}`);

            if (response.ok) {
                const data = await response.json();
                // Add the new city to weatherData using the location name from API
                const cityName = data.location || cityToSearch;
                setWeatherData(prev => ({
                    ...prev,
                    [cityName]: data
                }));
                setSelectedCity(cityName);
                setSearchQuery("");
                setIsUsingAPI(true);
            } else {
                // City not found - could show an error message
                console.log('City not found');
            }
        } catch (error) {
            console.log('Failed to fetch weather data');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }
    };

    // Fetch weather data from API
    const fetchWeatherData = async (city: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

            if (response.ok) {
                const data = await response.json();
                setWeatherData(prev => ({
                    ...prev,
                    [city]: data
                }));
                setIsUsingAPI(true);
            } else {
                // Fallback to placeholder data if API fails
                console.log('API not available, using placeholder data');
            }
        } catch (error) {
            console.log('Failed to fetch weather data, using placeholder data');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle city selection with transition
    const handleCitySelect = (city: string) => {
        if (city === selectedCity) return;

        setIsTransitioning(true);

        setTimeout(() => {
            setSelectedCity(city);
            setSearchQuery("");
            setShowCityList(false);

            // Always try to fetch fresh data from API
            fetchWeatherData(city);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 200);
    };

    // Try to fetch data for initial city on mount
    useEffect(() => {
        fetchWeatherData(selectedCity);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Close city list when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowCityList(false);
        };

        if (showCityList) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showCityList]);

    return (
        <div
            className={`${styles.container} ${ibmPlexMono.className}`}
            style={{ background: getWeatherColor() }}
        >
            {/* Back button */}
            <Link href="/" className={styles.backButton}>
                Back
            </Link>

            <main className={`${styles.main} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                {/* Header with location search */}
                <header className={styles.header}>
                    <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search for a city..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowCityList(true);
                            }}
                            onFocus={() => setShowCityList(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchSubmit();
                                }
                            }}
                        />
                        {showCityList && searchQuery && (
                            <div className={styles.cityList}>
                                {/* Show matching existing cities */}
                                {filteredCities.map((city) => (
                                    <button
                                        key={city}
                                        className={styles.cityButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCitySelect(city);
                                        }}
                                    >
                                        {city}
                                    </button>
                                ))}
                                {/* Always show option to search for the typed city */}
                                <button
                                    className={styles.cityButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSearchSubmit();
                                    }}
                                    style={{ borderTop: filteredCities.length > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
                                >
                                    Search for &quot;{searchQuery}&quot;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* City selector pills */}
                    <div className={styles.cityPills}>
                        {cities.map((city) => (
                            <button
                                key={city}
                                className={`${styles.cityPill} ${selectedCity === city ? styles.cityPillActive : ''}`}
                                onClick={() => handleCitySelect(city)}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Unified weather card */}
                <div className={styles.weatherCard}>
                    {/* Current weather section */}
                    <section className={styles.currentWeather}>
                        <h1 className={`${styles.locationName} ${sofiaSansCondensed.className}`}>{currentWeather.location}</h1>
                        <span className={styles.weatherIcon}>
                            {currentWeather.current.icon}
                        </span>
                        <div className={styles.currentTemp}>
                            <span className={`${styles.tempValue} ${sofiaSansCondensed.className}`}>
                                {convertTemp(currentWeather.current.temp)}°
                            </span>
                        </div>
                        <p className={styles.condition}>{currentWeather.current.condition}</p>
                        <div className={styles.highLow}>
                            <span>H: {convertTemp(currentWeather.current.high)}°</span>
                            <span>L: {convertTemp(currentWeather.current.low)}°</span>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className={styles.divider}></div>

                    {/* Hourly forecast section */}
                    <section className={styles.hourlySection}>
                        <div className={styles.hourlyScroll}>
                            {currentWeather.hourly.map((hour, index) => (
                                <div key={index} className={styles.hourCard}>
                                    <p className={styles.hourTime}>{hour.time}</p>
                                    <span className={styles.hourIcon}>{hour.icon}</span>
                                    <p className={styles.hourTemp}>{convertTemp(hour.temp)}°</p>
                                    <p className={styles.hourPrecip}>{hour.precipitation}%</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Divider */}
                    <div className={styles.divider}></div>

                    {/* Daily forecast section */}
                    <section className={styles.dailySection}>
                        <h2 className={`${styles.sectionTitle} ${sofiaSansCondensed.className}`}>7-day forecast</h2>
                        <div className={styles.dailyList}>
                            {currentWeather.daily.map((day, index) => (
                                <div key={index} className={styles.dayRow}>
                                    <div className={styles.dayLeft}>
                                        <p className={styles.dayName}>{day.day}</p>
                                    </div>
                                    <div className={styles.dayCenter}>
                                        <span className={styles.dayIcon}>{day.icon}</span>
                                    </div>
                                    <div className={styles.dayRight}>
                                        <span className={styles.dayLow}>{convertTemp(day.low)}°</span>
                                        <div className={styles.tempBar}></div>
                                        <span className={styles.dayHigh}>{convertTemp(day.high)}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Divider */}
                    <div className={styles.divider}></div>

                    {/* Detailed weather metrics */}
                    <section className={styles.detailsSection}>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>Humidity</p>
                                <p className={styles.detailValue}>{currentWeather.details.humidity}%</p>
                            </div>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>Wind</p>
                                <p className={styles.detailValue}>
                                    {currentWeather.details.windSpeed} mph {currentWeather.details.windDirection}
                                </p>
                            </div>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>UV Index</p>
                                <p className={styles.detailValue}>
                                    {currentWeather.details.uvIndex} ({currentWeather.details.uvRating})
                                </p>
                            </div>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>Visibility</p>
                                <p className={styles.detailValue}>{currentWeather.details.visibility} mi</p>
                            </div>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>Pressure</p>
                                <p className={styles.detailValue}>
                                    {currentWeather.details.pressure} mb
                                    <span className={styles.pressureTrend}>
                                        {currentWeather.details.pressureTrend === 'rising' ? ' ↑' :
                                            currentWeather.details.pressureTrend === 'falling' ? ' ↓' : ' →'}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.detailItem}>
                                <p className={styles.detailLabel}>Sunrise / Sunset</p>
                                <p className={styles.detailValue}>
                                    {currentWeather.details.sunrise} / {currentWeather.details.sunset}
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
