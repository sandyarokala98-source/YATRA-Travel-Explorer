import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { DestinationCategory } from '@/types/destination';

export type CategoryOption = 'All' | DestinationCategory;

interface CategoryFilterProps {
  selectedCategory: CategoryOption;
  onSelectCategory: (category: CategoryOption) => void;
  counts?: Record<string, number>;
}

interface CategoryConfig {
  id: CategoryOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'All', label: 'All Destinations', icon: 'compass-outline' },
  { id: 'Beaches', label: 'Beaches', icon: 'sunny-outline' },
  { id: 'Mountains', label: 'Mountains', icon: 'trail-sign-outline' },
  { id: 'Heritage', label: 'Heritage', icon: 'business-outline' },
  { id: 'Adventure', label: 'Adventure', icon: 'bonfire-outline' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = counts ? counts[cat.id] : undefined;

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            style={[styles.pill, isSelected && styles.pillSelected]}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter by ${cat.label}`}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={isSelected ? COLORS.textLight : COLORS.primary}
              style={styles.icon}
            />
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {cat.label}
            </Text>
            {count !== undefined && (
              <View
                style={[
                  styles.badge,
                  isSelected ? styles.badgeSelected : styles.badgeDefault,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextSelected : styles.badgeTextDefault,
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1.2,
    borderColor: COLORS.border,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.1,
  },
  labelSelected: {
    color: COLORS.textLight,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDefault: {
    backgroundColor: COLORS.surfaceSubtle,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextDefault: {
    color: COLORS.primaryMedium,
  },
  badgeTextSelected: {
    color: COLORS.textLight,
  },
});
