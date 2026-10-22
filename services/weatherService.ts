import { WeatherData } from '@/types/destination';

// Cache structure: key is `lat_lon`, value is WeatherData with timestamp
const weatherCache = new Map<string, WeatherData>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

/**
 * Maps WMO Weather Code to human-readable description, icon name, and travel advice.
 * Standard WMO codes reference: https://open-meteo.com/en/docs
 */
export function interpretWmoCode(
  code: number,
  tempC: number
): { condition: string; iconName: string; travelNote: string } {
  // Clear sky
  if (code === 0) {
    if (tempC > 30) {
      return {
        condition: 'Sunny & Warm',
        iconName: 'sun',
        travelNote: 'Clear and bright! Stay hydrated and carry sunscreen for day trips.',
      };
    }
    if (tempC < 15) {
      return {
        condition: 'Crisp & Clear',
        iconName: 'sun',
        travelNote: 'Crisp mountain air and blue skies. Dress in cozy layers.',
      };
    }
    return {
      condition: 'Sunny & Pleasant',
      iconName: 'sun',
      travelNote: 'Optimal conditions for sightseeing, photography, and open-air travel.',
    };
  }

  // Mainly clear, partly cloudy, overcast
  if (code === 1 || code === 2) {
    return {
      condition: 'Partly Cloudy',
      iconName: 'cloud',
      travelNote: 'Gentle cloud cover with pleasant daylight. Ideal for wandering around.',
    };
  }

  if (code === 3) {
    return {
      condition: 'Overcast',
      iconName: 'cloud',
      travelNote: 'Cool overcast skies. Comfortable for walking tours and historic visits.',
    };
  }

  // Fog & Mist
  if (code === 45 || code === 48) {
    return {
      condition: 'Misty / Foggy',
      iconName: 'cloud-drizzle',
      travelNote: 'Atmospheric mist. Drive carefully and enjoy the dreamy landscape views.',
    };
  }

  // Drizzle
  if (code >= 51 && code <= 55) {
    return {
      condition: 'Light Drizzle',
      iconName: 'cloud-rain',
      travelNote: 'Mild drizzle refreshing the greenery. Carry a light windbreaker.',
    };
  }

  // Rain: slight, moderate, heavy
  if (code >= 61 && code <= 65) {
    return {
      condition: 'Rain Showers',
      iconName: 'cloud-rain',
      travelNote: 'Passing rain showers. Keep an umbrella handy while exploring.',
    };
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return {
      condition: 'Snowfall',
      iconName: 'cloud-snow',
      travelNote: 'Enchanting snow on the peaks. Heavy woolens and thermal wear essential.',
    };
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return {
      condition: 'Thunderstorm',
      iconName: 'cloud-lightning',
      travelNote: 'Active thunderstorms. Plan indoor heritage or cafe visits until it clears.',
    };
  }

  // Fallback for showers
  if (code >= 80 && code <= 82) {
    return {
      condition: 'Scattered Showers',
      iconName: 'cloud-rain',
      travelNote: 'Intermittent showers expected. Great time for cozy local cafe stops.',
    };
  }

  // Generic fallback
  return {
    condition: 'Mild Weather',
    iconName: 'cloud',
    travelNote: 'Mild conditions prevailing. Favorable for regional discovery.',
  };
}

export const weatherService = {
  /**
   * Fetches current live weather from Open-Meteo for given coordinates with caching & timeout
   */
  async fetchLiveWeather(
    latitude: number,
    longitude: number,
    forceRefresh = false
  ): Promise<WeatherData> {
    const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    const now = Date.now();

    // Check valid in-memory cache
    if (!forceRefresh) {
      const cached = weatherCache.get(cacheKey);
      if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
        return cached;
      }
    }

    // Build URL with target parameters
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9-second timeout

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const json = await response.json();
      const current = json?.current;

      if (!current || typeof current.temperature_2m !== 'number') {
        throw new Error('Invalid Open-Meteo payload format');
      }

      const tempC = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m ?? 0);
      const windSpeed = Math.round(current.wind_speed_10m ?? 0);
      const weatherCode = current.weather_code ?? 0;

      const { condition, iconName, travelNote } = interpretWmoCode(weatherCode, tempC);

      const data: WeatherData = {
        temperature: tempC,
        condition,
        weatherCode,
        humidity,
        windSpeed,
        iconName,
        travelNote,
        fetchedAt: now,
      };

      // Store in cache
      weatherCache.set(cacheKey, data);
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      // If we have an expired cache entry, return it rather than failing hard
      const expiredCache = weatherCache.get(cacheKey);
      if (expiredCache) {
        return expiredCache;
      }
      throw err;
    }
  },

  /**
   * Clears the current weather cache
   */
  clearCache(): void {
    weatherCache.clear();
  },
};
