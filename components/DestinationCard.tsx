import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Destination } from '@/types/destination';
import { useWishlist } from '@/hooks/useWishlist';

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
  variant?: 'featured' | 'standard' | 'horizontal';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onPress,
  variant = 'standard',
}) => {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(destination.id);
  const [imageError, setImageError] = useState(false);

  const handleHeartPress = async (e: any) => {
    e?.stopPropagation?.();
    await toggleWishlist(destination.id);
  };

  // --- FEATURED VARIANT (Large Hero Card) ---
  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[styles.featuredContainer, SHADOWS.elevated]}
        onPress={onPress}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${destination.name}, ${destination.state}`}
      >
        <View style={styles.featuredImageWrapper}>
          {!imageError ? (
            <Image
              source={{ uri: destination.heroImage }}
              style={styles.featuredImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons name="image-outline" size={36} color={COLORS.primaryMedium} />
              <Text style={styles.fallbackText}>{destination.name}</Text>
            </View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(11, 37, 24, 0.45)', 'rgba(8, 28, 21, 0.92)']}
            style={styles.featuredGradient}
          />

          {/* Top badges & Heart Button */}
          <View style={styles.featuredTopRow}>
            <View style={styles.categoryBadgeDark}>
              <Text style={styles.categoryBadgeTextDark}>{destination.category.toUpperCase()}</Text>
            </View>

            <TouchableOpacity
              onPress={handleHeartPress}
              style={[styles.heartButtonGlass, saved && styles.heartButtonGlassActive]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={20}
                color={saved ? COLORS.accent : COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Information */}
          <View style={styles.featuredBottomContent}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.starGold} />
              <Text style={styles.ratingTextWhite}>{destination.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCountWhite}>({destination.reviewsCount})</Text>
              {destination.highlightTag && (
                <View style={styles.highlightBadge}>
                  <Text style={styles.highlightBadgeText}>{destination.highlightTag}</Text>
                </View>
              )}
            </View>

            <Text style={styles.featuredTitle} numberOfLines={1}>
              {destination.name}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={COLORS.accentLight} />
              <Text style={styles.featuredState}>{destination.state}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.featuredDuration}>{destination.recommendedDuration}</Text>
            </View>

            <View style={styles.featuredFooter}>
              <Text style={styles.featuredBudgetLabel}>Approx. Budget</Text>
              <Text style={styles.featuredBudgetValue}>{destination.approximateBudget} / person</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // --- HORIZONTAL / COMPACT VARIANT ---
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={[styles.horizontalContainer, SHADOWS.card]}
        onPress={onPress}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${destination.name}`}
      >
        <View style={styles.horizontalImageWrapper}>
          {!imageError ? (
            <Image
              source={{ uri: destination.heroImage }}
              style={styles.horizontalImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.horizontalFallback}>
              <Ionicons name="image-outline" size={24} color={COLORS.primaryMedium} />
            </View>
          )}
          <View style={styles.horizontalCategoryPill}>
            <Text style={styles.horizontalCategoryText}>{destination.category}</Text>
          </View>
        </View>

        <View style={styles.horizontalContent}>
          <View style={styles.horizontalHeaderRow}>
            <Text style={styles.horizontalTitle} numberOfLines={1}>
              {destination.name}
            </Text>
            <TouchableOpacity
              onPress={handleHeartPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={19}
                color={saved ? COLORS.accent : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.locationRowCompact}>
            <Ionicons name="location-outline" size={12} color={COLORS.accent} />
            <Text style={styles.stateTextCompact}>{destination.state}</Text>
          </View>

          <Text style={styles.shortDescriptionText} numberOfLines={2}>
            {destination.shortDescription}
          </Text>

          <View style={styles.horizontalFooterRow}>
            <View style={styles.ratingBadgeCompact}>
              <Ionicons name="star" size={11} color={COLORS.starGold} />
              <Text style={styles.ratingTextCompact}>{destination.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.budgetCompactText}>{destination.approximateBudget}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // --- STANDARD CARD VARIANT (Default Grid / Explorer) ---
  return (
    <TouchableOpacity
      style={[styles.cardContainer, SHADOWS.card]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${destination.name}, ${destination.state}`}
    >
      <View style={styles.cardImageWrapper}>
        {!imageError ? (
          <Image
            source={{ uri: destination.heroImage }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="image-outline" size={32} color={COLORS.primaryMedium} />
            <Text style={styles.fallbackText}>{destination.name}</Text>
          </View>
        )}

        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent']}
          style={styles.cardTopGradient}
        />

        {/* Top Badges */}
        <View style={styles.cardTopBar}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{destination.category}</Text>
          </View>

          <TouchableOpacity
            onPress={handleHeartPress}
            style={[styles.heartButtonCircle, saved && styles.heartButtonCircleActive]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Saved in wishlist' : 'Save to wishlist'}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={17}
              color={saved ? COLORS.accent : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Rating Floating Tag */}
        <View style={styles.ratingFloatingTag}>
          <Ionicons name="star" size={12} color={COLORS.starGold} />
          <Text style={styles.ratingFloatingText}>{destination.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {destination.name}
        </Text>

        <View style={styles.cardLocationRow}>
          <Ionicons name="location-outline" size={13} color={COLORS.accent} />
          <Text style={styles.cardState} numberOfLines={1}>
            {destination.state}
          </Text>
        </View>

        <Text style={styles.cardSnippet} numberOfLines={2}>
          {destination.shortDescription}
        </Text>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.budgetTinyLabel}>EST. BUDGET</Text>
            <Text style={styles.budgetAmountText}>{destination.approximateBudget}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color={COLORS.primaryMedium} />
            <Text style={styles.durationBadgeText}>{destination.recommendedDuration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Featured Styles
  featuredContainer: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
  },
  featuredImageWrapper: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
  },
  featuredImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    zIndex: 2,
  },
  categoryBadgeDark: {
    backgroundColor: 'rgba(11, 37, 24, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryBadgeTextDark: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heartButtonGlass: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(11, 37, 24, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heartButtonGlassActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  featuredBottomContent: {
    padding: SPACING.lg,
    zIndex: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  ratingTextWhite: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  reviewCountWhite: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  highlightBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginLeft: 6,
  },
  highlightBadgeText: {
    color: COLORS.textInverse,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: COLORS.textLight,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: SPACING.sm,
  },
  featuredState: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  dotSeparator: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  featuredDuration: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  featuredBudgetLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredBudgetValue: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '700',
  },

  // Standard Card Styles
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  cardImageWrapper: {
    height: 190,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardTopBar: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  heartButtonCircle: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heartButtonCircleActive: {
    backgroundColor: COLORS.accentSoft,
  },
  ratingFloatingTag: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(11, 37, 24, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  ratingFloatingText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  cardState: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  cardSnippet: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  budgetTinyLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  budgetAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryMedium,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryMedium,
  },

  // Horizontal Card Styles
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    height: 130,
  },
  horizontalImageWrapper: {
    width: 120,
    height: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalCategoryPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(11, 37, 24, 0.75)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xs,
  },
  horizontalCategoryText: {
    color: COLORS.textLight,
    fontSize: 9,
    fontWeight: '700',
  },
  horizontalContent: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  horizontalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  locationRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  stateTextCompact: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  shortDescriptionText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginVertical: 4,
  },
  horizontalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingTextCompact: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  budgetCompactText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryMedium,
  },

  // Fallbacks
  imageFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  horizontalFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
});
