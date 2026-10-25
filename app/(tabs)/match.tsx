import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { DESTINATIONS } from '@/data/destinations';
import {
  BudgetTier,
  DurationTier,
  MatchResult,
  PreferredClimate,
  TravelGroup,
  TravelStyle,
  UserPreferences,
} from '@/types/destination';
import { recommendationService } from '@/services/recommendationService';
import { storageService } from '@/services/storageService';
import { MatchOptionGroup, MatchOptionItem } from '@/components/MatchOptionGroup';
import { useWishlist } from '@/hooks/useWishlist';

const TRAVEL_STYLES: MatchOptionItem<TravelStyle>[] = [
  { id: 'relaxation', title: 'Relaxation', subtitle: 'Unwind & recharge', icon: 'cafe-outline' },
  { id: 'adventure', title: 'Adventure', subtitle: 'Thrills & trekking', icon: 'bonfire-outline' },
  { id: 'nature', title: 'Nature', subtitle: 'Scenic wilderness', icon: 'leaf-outline' },
  { id: 'heritage', title: 'Heritage', subtitle: 'History & temples', icon: 'business-outline' },
  { id: 'romantic', title: 'Romantic', subtitle: 'Couples getaway', icon: 'heart-outline' },
  { id: 'family', title: 'Family Trip', subtitle: 'All generations', icon: 'people-outline' },
];

const BUDGET_TIERS: MatchOptionItem<BudgetTier>[] = [
  { id: 'Budget', title: 'Budget', subtitle: '< ₹12,000 / person', icon: 'wallet-outline' },
  { id: 'Moderate', title: 'Moderate', subtitle: '₹12,000 - ₹25,000', icon: 'cash-outline' },
  { id: 'Premium', title: 'Premium', subtitle: '> ₹25,000 / person', icon: 'diamond-outline' },
];

const DURATION_TIERS: MatchOptionItem<DurationTier>[] = [
  { id: 'weekend', title: 'Weekend', subtitle: '2 - 3 Days escape', icon: 'time-outline' },
  { id: '3-5-days', title: '3–5 Days', subtitle: 'Classic getaway', icon: 'calendar-outline' },
  { id: '6+-days', title: '6+ Days', subtitle: 'Extended immersion', icon: 'airplane-outline' },
];

const CLIMATE_SETTINGS: MatchOptionItem<PreferredClimate>[] = [
  { id: 'beach', title: 'Beaches', subtitle: 'Sun, sand & ocean', icon: 'sunny-outline' },
  { id: 'mountains', title: 'Mountains', subtitle: 'Pines & crisp air', icon: 'trail-sign-outline' },
  { id: 'heritage', title: 'Historic Cities', subtitle: 'Forts & palaces', icon: 'library-outline' },
  { id: 'adventure', title: 'Outdoor Terrains', subtitle: 'Rapids & passes', icon: 'flame-outline' },
];

const TRAVEL_GROUPS: MatchOptionItem<TravelGroup>[] = [
  { id: 'solo', title: 'Solo', subtitle: 'Independent journey', icon: 'person-outline' },
  { id: 'couple', title: 'Couple', subtitle: 'Intimate duo trip', icon: 'heart-half-outline' },
  { id: 'friends', title: 'Friends', subtitle: 'Group adventures', icon: 'people-outline' },
  { id: 'family', title: 'Family', subtitle: 'Wholesome travel', icon: 'home-outline' },
];

export default function SmartMatchScreen() {
  const router = useRouter();
  const { isSaved, toggleWishlist } = useWishlist();

  const [preferences, setPreferences] = useState<UserPreferences>({
    travelStyle: 'relaxation',
    budgetTier: 'Moderate',
    durationTier: '3-5-days',
    climate: 'beach',
    travelGroup: 'couple',
  });

  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Load saved preferences on mount if available
  useEffect(() => {
    async function loadSavedPrefs() {
      const saved = await storageService.getUserPreferences();
      if (saved) {
        setPreferences(saved);
      }
    }
    loadSavedPrefs();
  }, []);

  const handleCalculate = async () => {
    // Persist current preferences
    await storageService.saveUserPreferences(preferences);

    // Run transparent deterministic recommendation engine
    const scored = recommendationService.calculateMatches(DESTINATIONS, preferences);
    setResults(scored);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setPreferences({
      travelStyle: null,
      budgetTier: null,
      durationTier: null,
      climate: null,
      travelGroup: null,
    });
    setResults(null);
    setHasCalculated(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Ionicons name="sparkles" size={14} color={COLORS.accent} />
            <Text style={styles.badgeLabel}>SMART RECOMMENDATION ENGINE</Text>
          </View>
          <Text style={styles.title}>Find Your Ideal Match</Text>
          <Text style={styles.subtitle}>
            Select your travel preferences below. Our algorithm calculates transparent matches with exact reasons for each destination.
          </Text>
        </View>

        {/* RESULTS VIEW */}
        {hasCalculated && results ? (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsSummaryBar}>
              <View>
                <Text style={styles.resultsCountTitle}>
                  {results.length} Ranked Destinations
                </Text>
                <Text style={styles.resultsCountSubtitle}>
                  Sorted by algorithm compatibility score
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setHasCalculated(false)}
                accessibilityRole="button"
              >
                <Ionicons name="options-outline" size={15} color={COLORS.primary} />
                <Text style={styles.editButtonText}>Adjust Criteria</Text>
              </TouchableOpacity>
            </View>

            {/* Results Cards */}
            {results.map((match, index) => {
              const { destination, score, matchReasons, partialMatch } = match;
              const saved = isSaved(destination.id);

              return (
                <View key={destination.id} style={[styles.resultCard, SHADOWS.card]}>
                  {/* Card Image with Score Badge */}
                  <TouchableOpacity
                    style={styles.cardImageWrapper}
                    onPress={() => router.push(`/destination/${destination.id}`)}
                    activeOpacity={0.9}
                  >
                    {imageErrors[destination.id] ? (
                      <View style={[styles.resultImage, styles.resultImageFallback]}>
                        <Ionicons name="image-outline" size={36} color={COLORS.primaryMedium} />
                        <Text style={styles.fallbackText}>{destination.name}</Text>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: destination.heroImage }}
                        style={styles.resultImage}
                        resizeMode="cover"
                        onError={() => setImageErrors((current) => ({ ...current, [destination.id]: true }))}
                      />
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(11, 37, 24, 0.75)']}
                      style={styles.imageGradient}
                    />

                    {/* Top rank & Score Badges */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.rankPill}>
                        <Text style={styles.rankPillText}>#{index + 1} PICK</Text>
                      </View>

                      <View
                        style={[
                          styles.scorePill,
                          score >= 80 ? styles.scorePillHigh : styles.scorePillMedium,
                        ]}
                      >
                        <Text style={styles.scorePillText}>{score}% MATCH</Text>
                      </View>
                    </View>

                    {/* Bottom image overlay text */}
                    <View style={styles.imageOverlayBottom}>
                      <Text style={styles.destinationName}>{destination.name}</Text>
                      <View style={styles.locationInline}>
                        <Ionicons name="location-outline" size={13} color={COLORS.accentLight} />
                        <Text style={styles.stateName}>{destination.state}</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.categoryName}>{destination.category}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Card Content & Match Explanations */}
                  <View style={styles.resultCardBody}>
                    <View style={styles.whySection}>
                      <Text style={styles.whyTitle}>WHY THIS MATCHES YOU:</Text>
                      <View style={styles.reasonsList}>
                        {matchReasons.map((reason, idx) => (
                          <View key={idx} style={styles.reasonRow}>
                            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                            <Text style={styles.reasonText}>{reason}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {partialMatch && (
                      <View style={styles.partialMatchBanner}>
                        <Ionicons name="information-circle-outline" size={14} color={COLORS.accent} />
                        <Text style={styles.partialMatchText}>
                          Partial match alternative — budget or duration slightly varied.
                        </Text>
                      </View>
                    )}

                    <View style={styles.cardBottomBar}>
                      <View>
                        <Text style={styles.budgetLabel}>APPROX. BUDGET</Text>
                        <Text style={styles.budgetAmount}>{destination.approximateBudget}</Text>
                      </View>

                      <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                          style={[
                            styles.wishlistIconBtn,
                            saved && styles.wishlistIconBtnActive,
                          ]}
                          onPress={() => toggleWishlist(destination.id)}
                          accessibilityRole="button"
                          accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                        >
                          <Ionicons
                            name={saved ? 'heart' : 'heart-outline'}
                            size={18}
                            color={saved ? COLORS.accent : COLORS.primary}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.detailsBtn}
                          onPress={() => router.push(`/destination/${destination.id}`)}
                          accessibilityRole="button"
                        >
                          <Text style={styles.detailsBtnText}>View Details</Text>
                          <Ionicons name="chevron-forward" size={14} color={COLORS.textLight} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Recalculate CTA */}
            <TouchableOpacity
              style={styles.resetButtonBottom}
              onPress={handleReset}
              accessibilityRole="button"
            >
              <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
              <Text style={styles.resetButtonText}>Reset All Preferences</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* PREFERENCES FORM */
          <View style={styles.formContainer}>
            {/* 1. Travel Style */}
            <MatchOptionGroup<TravelStyle>
              title="1. What is your preferred travel style?"
              description="Pick the primary mood or activity for this journey"
              options={TRAVEL_STYLES}
              selectedValue={preferences.travelStyle}
              onSelect={(val) => setPreferences({ ...preferences, travelStyle: val })}
            />

            {/* 2. Budget Tier */}
            <MatchOptionGroup<BudgetTier>
              title="2. Estimated budget per person?"
              description="Includes stay, local transport, food and experiences"
              options={BUDGET_TIERS}
              selectedValue={preferences.budgetTier}
              onSelect={(val) => setPreferences({ ...preferences, budgetTier: val })}
            />

            {/* 3. Trip Duration */}
            <MatchOptionGroup<DurationTier>
              title="3. How long do you plan to travel?"
              description="Choose the timeframe for your journey"
              options={DURATION_TIERS}
              selectedValue={preferences.durationTier}
              onSelect={(val) => setPreferences({ ...preferences, durationTier: val })}
            />

            {/* 4. Climate & Landscape */}
            <MatchOptionGroup<PreferredClimate>
              title="4. Preferred terrain or climate?"
              description="What natural environment speaks to you most?"
              options={CLIMATE_SETTINGS}
              selectedValue={preferences.climate}
              onSelect={(val) => setPreferences({ ...preferences, climate: val })}
            />

            {/* 5. Travel Group */}
            <MatchOptionGroup<TravelGroup>
              title="5. Who are you traveling with?"
              description="Helps calibrate vibe, pace, and accessibility"
              options={TRAVEL_GROUPS}
              selectedValue={preferences.travelGroup}
              onSelect={(val) => setPreferences({ ...preferences, travelGroup: val })}
            />

            {/* Calculate Button */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.calculateBtn, SHADOWS.card]}
                onPress={handleCalculate}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Calculate top matching destinations"
              >
                <Ionicons name="sparkles" size={18} color={COLORS.textLight} />
                <Text style={styles.calculateBtnText}>Calculate Best Matches</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clearPrefsBtn}
                onPress={handleReset}
                accessibilityRole="button"
              >
                <Text style={styles.clearPrefsText}>Clear Selections</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  formActions: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  calculateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: RADIUS.full,
    gap: 8,
  },
  calculateBtnText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  clearPrefsBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearPrefsText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },

  // Results Styles
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  resultsSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultsCountTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  resultsCountSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  cardImageWrapper: {
    height: 190,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  resultImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultImageFallback: {
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    marginTop: SPACING.xs,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardTopRow: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankPill: {
    backgroundColor: 'rgba(11, 37, 24, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: RADIUS.full,
  },
  rankPillText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  scorePillHigh: {
    backgroundColor: COLORS.accent,
  },
  scorePillMedium: {
    backgroundColor: COLORS.primaryMedium,
  },
  scorePillText: {
    color: COLORS.textInverse,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageOverlayBottom: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  destinationName: {
    color: COLORS.textLight,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  locationInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stateName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  dotSeparator: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  categoryName: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  resultCardBody: {
    padding: SPACING.md,
  },
  whySection: {
    marginBottom: SPACING.md,
  },
  whyTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  reasonsList: {
    gap: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  partialMatchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentSoft,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  partialMatchText: {
    fontSize: 11,
    color: COLORS.accentDark,
    flex: 1,
  },
  cardBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  budgetLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  budgetAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wishlistIconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistIconBtnActive: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  detailsBtnText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  resetButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
