import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { DESTINATIONS } from '@/data/destinations';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter, CategoryOption } from '@/components/CategoryFilter';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');

  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: DESTINATIONS.length,
      Beaches: 0,
      Mountains: 0,
      Heritage: 0,
      Adventure: 0,
    };
    DESTINATIONS.forEach((d) => {
      if (counts[d.category] !== undefined) {
        counts[d.category]++;
      }
    });
    return counts;
  }, []);

  // Filtered destinations: Search and Category work together
  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DESTINATIONS.filter((destination) => {
      // 1. Category check
      const matchesCategory =
        selectedCategory === 'All' || destination.category === selectedCategory;

      // 2. Search check (destination name, state, or key attractions)
      const matchesSearch =
        query.length === 0 ||
        destination.name.toLowerCase().includes(query) ||
        destination.state.toLowerCase().includes(query) ||
        destination.attractions.some((a) => a.name.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredDestination = useMemo(() => {
    return DESTINATIONS.find((d) => d.isFeatured) || DESTINATIONS[0];
  }, []);

  const popularDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => d.rating >= 4.8);
  }, []);

  const isFilteringActive = searchQuery.trim().length > 0 || selectedCategory !== 'All';

  const navigateToDetails = (destinationId: string) => {
    router.push(`/destination/${destinationId}`);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>YATRA</Text>
              <View style={styles.brandDot} />
            </View>
            <Text style={styles.tagline}>Discover India, Your Way.</Text>
          </View>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => router.push('/modal')}
            accessibilityRole="button"
            accessibilityLabel="About Yatra and recruitment info"
          >
            <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Field */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Manali, Goa, Jaipur, Hampi..."
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Category Filter Chips */}
        <View style={styles.categorySection}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
          />
        </View>

        {/* Active Filtering Mode */}
        {isFilteringActive ? (
          <View style={styles.filteredResultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {selectedCategory === 'All' ? 'Search Results' : selectedCategory}
              </Text>
              <Text style={styles.resultsSubtitle}>
                {filteredDestinations.length}{' '}
                {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
              </Text>
            </View>

            {filteredDestinations.length > 0 ? (
              <View style={styles.cardsGrid}>
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onPress={() => navigateToDetails(destination.id)}
                    variant="standard"
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                iconName="search-outline"
                title="No destinations found"
                message={`We couldn't find any destinations matching "${searchQuery}" in ${selectedCategory}. Try searching for another location or clearing your filters.`}
                actionLabel="Clear Filters"
                onAction={clearAllFilters}
              />
            )}
          </View>
        ) : (
          /* Default Rich Discovery Mode */
          <>
            {/* Featured Hero Banner */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Featured Experience</Text>
              <Text style={styles.sectionSubtitle}>Handpicked by travelers</Text>
            </View>

            <View style={styles.featuredWrapper}>
              <DestinationCard
                destination={featuredDestination}
                onPress={() => navigateToDetails(featuredDestination.id)}
                variant="featured"
              />
            </View>

            {/* Smart Match Banner */}
            <TouchableOpacity
              style={[styles.matchBanner, SHADOWS.card]}
              onPress={() => router.push('/match')}
              activeOpacity={0.92}
              accessibilityRole="button"
              accessibilityLabel="Launch Smart Destination Matcher quiz"
            >
              <LinearGradient
                colors={['#1B4332', '#0B2518']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.matchBannerGradient}
              >
                <View style={styles.matchBannerContent}>
                  <View style={styles.matchBannerBadge}>
                    <Ionicons name="sparkles" size={13} color={COLORS.accentLight} />
                    <Text style={styles.matchBannerBadgeText}>SMART MATCH ENGINE</Text>
                  </View>

                  <Text style={styles.matchBannerTitle}>Unsure where to wander?</Text>
                  <Text style={styles.matchBannerSub}>
                    Answer 5 quick travel preferences and our recommendation engine will calculate your dream trip.
                  </Text>

                  <View style={styles.matchBannerCTA}>
                    <Text style={styles.matchBannerCTAText}>Start Travel Quiz</Text>
                    <Ionicons name="arrow-forward" size={15} color={COLORS.textLight} />
                  </View>
                </View>

                <View style={styles.matchBannerIconBackdrop}>
                  <Ionicons name="compass" size={90} color="rgba(255, 255, 255, 0.08)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Popular Destinations Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top Rated Destinations</Text>
              <Text style={styles.sectionSubtitle}>India’s highest-rated escapes</Text>
            </View>

            <View style={styles.cardsGrid}>
              {popularDestinations.slice(0, 4).map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onPress={() => navigateToDetails(destination.id)}
                  variant="standard"
                />
              ))}
            </View>

            {/* All Escapes Catalog */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>All Curated Escapes</Text>
              <Text style={styles.sectionSubtitle}>Explore the diversity of the subcontinent</Text>
            </View>

            <View style={styles.cardsGrid}>
              {DESTINATIONS.slice(4).map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onPress={() => navigateToDetails(destination.id)}
                  variant="standard"
                />
              ))}
            </View>
          </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    marginLeft: 3,
    marginTop: 6,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categorySection: {
    marginVertical: SPACING.xs,
  },
  sectionHeaderRow: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  featuredWrapper: {
    marginBottom: SPACING.lg,
  },
  matchBanner: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  matchBannerGradient: {
    padding: SPACING.lg,
    position: 'relative',
  },
  matchBannerContent: {
    zIndex: 2,
  },
  matchBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 90, 50, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  matchBannerBadgeText: {
    color: COLORS.accentLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  matchBannerTitle: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  matchBannerSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: '85%',
    marginBottom: SPACING.md,
  },
  matchBannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  matchBannerCTAText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  matchBannerIconBackdrop: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    zIndex: 1,
  },
  cardsGrid: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
  },
  filteredResultsSection: {
    paddingTop: SPACING.sm,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  resultsSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
