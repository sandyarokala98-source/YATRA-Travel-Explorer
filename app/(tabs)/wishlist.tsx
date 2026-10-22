import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useWishlist } from '@/hooks/useWishlist';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';

export default function WishlistScreen() {
  const router = useRouter();
  const { savedDestinations, clearWishlist } = useWishlist();

  const handleClearAll = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all saved destinations from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            if (typeof clearWishlist === 'function') {
              await clearWishlist();
            }
          },
        },
      ]
    );
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
          <View>
            <View style={styles.badgeRow}>
              <Ionicons name="heart" size={14} color={COLORS.accent} />
              <Text style={styles.badgeLabel}>SAVED FOR LATER</Text>
            </View>
            <Text style={styles.title}>Your Travel Wishlist</Text>
            <Text style={styles.subtitle}>
              {savedDestinations.length === 0
                ? 'No destinations saved yet'
                : `${savedDestinations.length} ${
                    savedDestinations.length === 1 ? 'destination' : 'destinations'
                  } saved for your upcoming journeys`}
            </Text>
          </View>

          {savedDestinations.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear all wishlist items"
            >
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        {savedDestinations.length > 0 ? (
          <View style={styles.cardsGrid}>
            {savedDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onPress={() => router.push(`/destination/${destination.id}`)}
                variant="standard"
              />
            ))}
          </View>
        ) : (
          <EmptyState
            iconName="heart-outline"
            title="Your wishlist is waiting"
            message="Explore the rich heritage, majestic mountains, and sun-soaked beaches of India and tap the heart icon to save your favorites."
            actionLabel="Explore Destinations"
            onAction={() => router.push('/(tabs)')}
          />
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
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    maxWidth: 240,
    lineHeight: 18,
  },
  clearBtn: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  cardsGrid: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
});
