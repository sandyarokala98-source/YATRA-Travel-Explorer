import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { weatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/destination';

interface WeatherCardProps {
  latitude: number;
  longitude: number;
  destinationName: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  latitude,
  longitude,
  destinationName,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherService.fetchLiveWeather(latitude, longitude, force);
        setWeather(data);
      } catch (err: any) {
        console.warn('WeatherCard: Error fetching weather', err?.message);
        setError('Live weather is currently offline or unreachable.');
      } finally {
        setLoading(false);
      }
    },
    [latitude, longitude]
  );

  useEffect(() => {
    fetchWeather(false);
  }, [fetchWeather]);

  const renderWeatherIcon = (iconName: string) => {
    const validIcons: Record<string, keyof typeof Feather.glyphMap> = {
      sun: 'sun',
      cloud: 'cloud',
      'cloud-rain': 'cloud-rain',
      'cloud-drizzle': 'cloud-drizzle',
      'cloud-lightning': 'cloud-lightning',
      'cloud-snow': 'cloud-snow',
    };
    const icon = validIcons[iconName] || 'cloud';
    return <Feather name={icon} size={30} color={COLORS.primary} />;
  };

  return (
    <View style={[styles.card, SHADOWS.card]}>
      {/* Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Ionicons name="partly-sunny-outline" size={16} color={COLORS.primaryMedium} />
          <Text style={styles.sectionTitle}>CURRENT WEATHER</Text>
        </View>

        <TouchableOpacity
          onPress={() => fetchWeather(true)}
          style={styles.refreshButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Refresh current weather data"
        >
          <Feather name="refresh-cw" size={13} color={COLORS.textMuted} />
          <Text style={styles.refreshText}>Live Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && !weather && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching live atmospheric data for {destinationName}...</Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && !weather && (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={28} color={COLORS.textMuted} />
          <Text style={styles.errorTitle}>Weather data temporarily unavailable</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchWeather(true)}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry Weather Fetch</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Content */}
      {weather && (
        <View style={styles.weatherBody}>
          <View style={styles.mainMetricsRow}>
            <View style={styles.tempGroup}>
              <Text style={styles.tempNumber}>{weather.temperature}°</Text>
              <Text style={styles.tempUnit}>C</Text>
              <View style={styles.conditionTextGroup}>
                <Text style={styles.conditionTitle}>{weather.condition}</Text>
                <Text style={styles.subtextWmo}>Open-Meteo live feed</Text>
              </View>
            </View>

            <View style={styles.iconCircle}>
              {renderWeatherIcon(weather.iconName)}
            </View>
          </View>

          {/* Secondary stats: Humidity & Wind */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="droplet" size={14} color={COLORS.info} />
              <Text style={styles.statLabel}>Humidity</Text>
              <Text style={styles.statValue}>{weather.humidity}%</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Feather name="wind" size={14} color={COLORS.primaryMedium} />
              <Text style={styles.statLabel}>Wind Speed</Text>
              <Text style={styles.statValue}>{weather.windSpeed} km/h</Text>
            </View>
          </View>

          {/* Travel Weather Advisory */}
          <View style={styles.travelNoteBox}>
            <Ionicons name="sparkles" size={14} color={COLORS.accent} style={{ marginTop: 2 }} />
            <Text style={styles.travelNoteText}>{weather.travelNote}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  refreshText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  loadingContainer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  errorSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  weatherBody: {
    gap: SPACING.md,
  },
  mainMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    lineHeight: 44,
  },
  tempUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.accent,
    marginTop: 2,
    marginRight: SPACING.sm,
  },
  conditionTextGroup: {
    justifyContent: 'center',
    paddingLeft: 4,
  },
  conditionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtextWmo: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
  },
  travelNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.accentSoft,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  travelNoteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.accentDark,
    lineHeight: 17,
    fontWeight: '500',
  },
});
