import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

export default function AboutModalScreen() {
  const router = useRouter();

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.brandCard}>
        <View style={styles.brandIconCircle}>
          <Ionicons name="compass" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.brandTitle}>YATRA</Text>
        <Text style={styles.brandTagline}>Discover India, Your Way.</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionBadgeText}>GDGC VNRVJIET Assignment Edition</Text>
        </View>
      </View>

      {/* Purpose & Mission */}
      <View style={[styles.sectionCard, SHADOWS.card]}>
        <Text style={styles.sectionTitle}>ABOUT THE APPLICATION</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.boldText}>YATRA</Text> is a premium travel discovery application crafted specifically for the{' '}
          <Text style={styles.boldText}>GDGC VNRVJIET App Development Domain Volunteer Recruitment Assignment</Text>.
          It celebrates India's extraordinary geographic and cultural diversity—from sun-soaked shores and alpine peaks to ancient monuments and adrenaline adventures.
        </Text>
      </View>

      {/* Architecture Highlights */}
      <View style={[styles.sectionCard, SHADOWS.card]}>
        <Text style={styles.sectionTitle}>ARCHITECTURE & FEATURES</Text>

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Ionicons name="sparkles" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Smart Match Recommendation Engine</Text>
            <Text style={styles.featureDesc}>
              A 100% deterministic, weighted scoring algorithm matching 5 user preferences (budget, style, duration, climate, group) with transparent match reasoning.
            </Text>
          </View>
        </View>

        <View style={styles.featureDivider} />

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Ionicons name="cloud" size={16} color={COLORS.primaryMedium} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Live Open-Meteo Weather Integration</Text>
            <Text style={styles.featureDesc}>
              Direct REST integration with Open-Meteo providing live temperature, atmospheric conditions, humidity, wind, and travel advisory notes without paid API keys.
            </Text>
          </View>
        </View>

        <View style={styles.featureDivider} />

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Ionicons name="heart" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Persistent Wishlist (AsyncStorage)</Text>
            <Text style={styles.featureDesc}>
              Synchronized state across Home, Details, and Wishlist screens backed by persistent local storage that survives app restarts.
            </Text>
          </View>
        </View>

        <View style={styles.featureDivider} />

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Ionicons name="map" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Google Maps External Navigation</Text>
            <Text style={styles.featureDesc}>
              One-touch deep link to Google Maps with exact coordinates for real-time routing, traffic, and satellite imagery.
            </Text>
          </View>
        </View>
      </View>

      {/* Tech Stack Summary */}
      <View style={[styles.sectionCard, SHADOWS.card]}>
        <Text style={styles.sectionTitle}>TECHNOLOGY STACK</Text>
        <View style={styles.techChipsRow}>
          {[
            'React Native 0.88',
            'Expo SDK 58',
            'Expo Router (Tabs + Stack)',
            'TypeScript',
            'AsyncStorage',
            'Open-Meteo API',
            'Expo Linear Gradient',
            '@expo/vector-icons',
          ].map((tech) => (
            <View key={tech} style={styles.techChip}>
              <Text style={styles.techChipText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Dismiss Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.back()}
        activeOpacity={0.88}
        accessibilityRole="button"
      >
        <Text style={styles.closeBtnText}>Return to App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  brandCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  brandIconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  versionBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  versionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryMedium,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  featureItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: 4,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  featureDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  techChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryMedium,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  closeBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
});
