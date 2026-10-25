import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { DESTINATIONS } from '@/data/destinations';
import { useWishlist } from '@/hooks/useWishlist';
import { mapsService } from '@/services/mapsService';
import { WeatherCard } from '@/components/WeatherCard';
import { AttractionCard } from '@/components/AttractionCard';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSaved, toggleWishlist } = useWishlist();

  const [imageError, setImageError] = useState(false);
  const [openingMap, setOpeningMap] = useState(false);

  const destination = DESTINATIONS.find((d) => d.id === id);
  const saved = destination ? isSaved(destination.id) : false;

  // Handle Invalid / Non-existent ID gracefully
  if (!destination) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="compass-outline" size={64} color={COLORS.primary} />
        <Text style={styles.errorTitle}>Destination Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The travel destination you are looking for does not exist or may have been moved.
        </Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(tabs)')}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={16} color={COLORS.textLight} />
          <Text style={styles.backHomeBtnText}>Back to Explore</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleOpenGoogleMaps = async () => {
    setOpeningMap(true);
    try {
      const success = await mapsService.openDestinationInMaps(
        destination.coordinates.latitude,
        destination.coordinates.longitude,
        destination.name
      );
      if (!success) {
        Alert.alert(
          'Map Link',
          `Could not open map application. You can search "${destination.name}, India" directly on Google Maps.`
        );
      }
    } catch {
      Alert.alert('Map Link', 'Unable to launch mapping application.');
    } finally {
      setOpeningMap(false);
    }
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(destination.id);
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }, // Extra padding for sticky bottom bar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IMAGE HEADER */}
        <View style={styles.heroContainer}>
          {!imageError ? (
            <Image
              source={{ uri: destination.heroImage }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.heroFallback}>
              <Ionicons name="image-outline" size={48} color={COLORS.primaryMedium} />
              <Text style={styles.heroFallbackText}>{destination.name}</Text>
            </View>
          )}

          <LinearGradient
            colors={['rgba(11, 37, 24, 0.4)', 'transparent', 'rgba(11, 37, 24, 0.85)']}
            style={styles.heroGradient}
          />

          {/* Floating Top Controls (Safe Area Aware) */}
          <View style={[styles.floatingTopBar, { paddingTop: insets.top + SPACING.sm }]}>
            <TouchableOpacity
              style={styles.floatingCircleBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back to previous screen"
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.floatingTopRight}>
              <TouchableOpacity
                style={[
                  styles.floatingCircleBtn,
                  saved && styles.floatingCircleBtnActive,
                ]}
                onPress={handleWishlistToggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Ionicons
                  name={saved ? 'heart' : 'heart-outline'}
                  size={20}
                  color={saved ? COLORS.accent : COLORS.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Bottom Information */}
          <View style={styles.heroBottomInfo}>
            <View style={styles.categoryBadgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{destination.category.toUpperCase()}</Text>
              </View>
              {destination.highlightTag && (
                <View style={styles.highlightBadge}>
                  <Text style={styles.highlightBadgeText}>{destination.highlightTag}</Text>
                </View>
              )}
            </View>

            <Text style={styles.destinationTitle}>{destination.name}</Text>

            <View style={styles.stateRatingRow}>
              <Ionicons name="location-sharp" size={16} color={COLORS.accentLight} />
              <Text style={styles.stateTitle}>{destination.state}, India</Text>
              <Text style={styles.heroDot}>•</Text>
              <Ionicons name="star" size={14} color={COLORS.starGold} />
              <Text style={styles.ratingNumber}>{destination.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}>({destination.reviewsCount} reviews)</Text>
            </View>
          </View>
        </View>

        {/* MAIN BODY CONTENT */}
        <View style={styles.bodyContent}>
          {/* QUICK STATS CARDS */}
          <View style={[styles.statsGrid, SHADOWS.subtle]}>
            <View style={styles.statBox}>
              <View style={styles.statIconCircle}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.statBoxLabel}>BEST TIME</Text>
              <Text style={styles.statBoxValue} numberOfLines={2}>
                {destination.bestTimeToVisit}
              </Text>
            </View>

            <View style={styles.statBoxDivider} />

            <View style={styles.statBox}>
              <View style={styles.statIconCircle}>
                <Ionicons name="wallet-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.statBoxLabel}>EST. BUDGET</Text>
              <Text style={styles.statBoxValue}>{destination.approximateBudget}</Text>
              <Text style={styles.statBoxSub}>per person</Text>
            </View>

            <View style={styles.statBoxDivider} />

            <View style={styles.statBox}>
              <View style={styles.statIconCircle}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.statBoxLabel}>DURATION</Text>
              <Text style={styles.statBoxValue}>{destination.recommendedDuration}</Text>
              <Text style={styles.statBoxSub}>ideal itinerary</Text>
            </View>
          </View>

          {/* TRAVEL STYLE TAGS */}
          <View style={styles.stylesTagsSection}>
            <Text style={styles.sectionHeading}>SUITABLE TRAVEL STYLES</Text>
            <View style={styles.tagsRow}>
              {destination.suitableFor.map((style) => (
                <View key={style} style={styles.stylePill}>
                  <Ionicons name="sparkles-outline" size={12} color={COLORS.primaryMedium} />
                  <Text style={styles.stylePillText}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* EDITORIAL OVERVIEW */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>ABOUT THIS DESTINATION</Text>
            <Text style={styles.bodyParagraph}>{destination.fullDescription}</Text>
          </View>

          {/* LIVE WEATHER WIDGET (Open-Meteo Integration) */}
          <View style={styles.sectionBlock}>
            <WeatherCard
              latitude={destination.coordinates.latitude}
              longitude={destination.coordinates.longitude}
              destinationName={destination.name}
            />
          </View>

          {/* TOP ATTRACTIONS */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>POPULAR ATTRACTIONS</Text>
              <Text style={styles.sectionCountText}>
                {destination.attractions.length} must-visit spots
              </Text>
            </View>

            {destination.attractions.map((attraction, idx) => (
              <AttractionCard key={attraction.id} attraction={attraction} index={idx} />
            ))}
          </View>

          {/* GOOGLE MAPS EXTERNAL NAVIGATION BUTTON */}
          <View style={styles.mapsSection}>
            <View style={styles.mapsCard}>
              <View style={styles.mapsIconCircle}>
                <Ionicons name="map" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.mapsTextGroup}>
                <Text style={styles.mapsCardTitle}>Explore on Google Maps</Text>
                <Text style={styles.mapsCardSub}>
                  View satellite maps, terrain, live directions, and nearby landmarks.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.openMapsBtn, SHADOWS.card]}
              onPress={handleOpenGoogleMaps}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={`Open ${destination.name} in Google Maps`}
            >
              <Ionicons name="navigate-circle-outline" size={18} color={COLORS.textLight} />
              <Text style={styles.openMapsBtnText}>
                {openingMap ? 'Opening Maps...' : 'Open in Google Maps'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM ACTION BAR */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING.md },
        ]}
      >
        <TouchableOpacity
          style={styles.mapQuickIconBtn}
          onPress={handleOpenGoogleMaps}
          accessibilityRole="button"
          accessibilityLabel="Open map"
        >
          <Ionicons name="map-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.wishlistPrimaryBtn,
            saved && styles.wishlistPrimaryBtnSaved,
            SHADOWS.card,
          ]}
          onPress={handleWishlistToggle}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? COLORS.textInverse : COLORS.textLight}
          />
          <Text
            style={[
              styles.wishlistPrimaryBtnText,
              saved && styles.wishlistPrimaryBtnTextSaved,
            ]}
          >
            {saved ? 'In Your Wishlist' : 'Add to Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 380,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryDark,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFallbackText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  floatingTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  floatingCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  floatingCircleBtnActive: {
    backgroundColor: COLORS.accentSoft,
  },
  floatingTopRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  heroBottomInfo: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    zIndex: 2,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryBadgeText: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  highlightBadge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  highlightBadgeText: {
    color: COLORS.textInverse,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  destinationTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  stateRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  heroDot: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 3,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  reviewsCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  bodyContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  statBoxSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  statBoxDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  stylesTagsSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stylePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stylePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryMedium,
  },
  sectionBlock: {
    marginBottom: SPACING.xl,
  },
  bodyParagraph: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  mapsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  mapsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  mapsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapsTextGroup: {
    flex: 1,
  },
  mapsCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  mapsCardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  openMapsBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  mapQuickIconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistPrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wishlistPrimaryBtnSaved: {
    backgroundColor: COLORS.accent,
  },
  wishlistPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  wishlistPrimaryBtnTextSaved: {
    color: COLORS.textInverse,
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  backHomeBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
});
