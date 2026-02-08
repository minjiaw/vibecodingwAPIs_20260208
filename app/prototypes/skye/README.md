# Skye - Weather App Prototype

A beautiful weather application with a modern blue design and bold typography. Features real-time weather data from OpenWeatherMap API with automatic fallback to placeholder data.

## Features

### Current Weather Display
- Large, easy-to-read temperature display
- Weather condition with emoji icons
- "Feels like" temperature
- Daily high and low temperatures
- Temperature unit toggle (°F ↔ °C)

### Location Management
- Search bar for quick city lookup
- Quick-select city pills for easy switching
- Smooth transitions when changing locations
- Support for multiple cities:
  - San Francisco
  - New York
  - Tokyo
  - London
  - Paris
  - Sydney

### Hourly Forecast
- Horizontally scrollable 24-hour forecast
- Hour-by-hour temperature, conditions, and precipitation chances
- Visual weather icons for each hour
- Smooth hover interactions

### 7-Day Forecast
- Weekly outlook with daily high/low temperatures
- Weather conditions and descriptions
- Organized in easy-to-read cards
- Responsive grid layout

### Detailed Weather Metrics
- **Humidity**: Current humidity percentage
- **Wind**: Speed (mph) and direction
- **UV Index**: Current UV level with safety rating
- **Visibility**: Distance in miles
- **Pressure**: Atmospheric pressure with trend indicators (rising/falling/steady)
- **Sunrise/Sunset**: Daily sun times

## Design Philosophy

### Modern Minimal Design
- **Bold Typography**: Sofia Sans Condensed Extra Bold for headings (all caps)
- **Monospace Data**: IBM Plex Mono for all weather data
- **Clean Blue Background**: Solid blue (#0A77E4) background
- **White Text**: High contrast white text throughout
- **Minimal Interface**: Transparent borders, no shadows
- **Smooth Animations**: Subtle transitions when changing cities

### Color Palette
- Background: Blue (#0A77E4)
- Primary text: White
- Secondary text: White with reduced opacity
- Active elements: White background with blue text
- Borders: White with transparency

## Technical Details

### Built With
- **Next.js**: React framework with API routes
- **TypeScript**: Type-safe code
- **CSS Modules**: Scoped styling
- **React Hooks**: State management (useState, useEffect)
- **OpenWeatherMap API**: Real-time weather data

### Data Structure
Weather data is organized with TypeScript interfaces:
- `WeatherData`: Complete weather information for each city
- `CurrentWeather`: Current conditions and temperature
- `HourlyForecast`: Hour-by-hour predictions
- `DailyForecast`: 7-day outlook
- `WeatherDetails`: Additional metrics (humidity, wind, UV, etc.)

### API Integration
The app uses OpenWeatherMap API for real weather data with intelligent fallback:
- **With API Key**: Fetches live weather data for any city
- **Without API Key**: Uses curated placeholder data for 6 cities
- Automatic fallback ensures the app always works

### Responsive Design
- Mobile-first approach
- Adapts to various screen sizes
- Touch-friendly interactions
- Optimized for both desktop and mobile viewing

## Setup

### Option 1: With Real Weather Data (Recommended)

1. **Get an API Key**:
   - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
   - Generate an API key from your account dashboard
   - Free tier includes 1,000 API calls per day

2. **Configure Environment Variable**:
   - Create a `.env.local` file in the project root
   - Add your API key:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

The app will now fetch real-time weather data for any city you search!

### Option 2: Without API Key (Placeholder Mode)

Simply run the app without setting up the API key:
- Works with 6 pre-configured cities (San Francisco, New York, Tokyo, London, Paris, Sydney)
- Uses curated placeholder data
- Perfect for design demos and offline development

## Usage

1. **Navigate**: Click "Skye" from the homepage
2. **Select Location**: Use the search bar or click city pills to change location
3. **Explore Forecasts**: Scroll through hourly data, view daily forecasts
4. **View Details**: Check comprehensive weather metrics at the bottom

## API Features

When connected to OpenWeatherMap:
- **Any City**: Search for weather in any city worldwide
- **Real-time Data**: Current weather conditions
- **Forecasts**: 3-hour interval forecasts for 5 days
- **Automatic Updates**: Fresh data on every city change
- **Graceful Fallback**: Automatically uses placeholder data if API fails
