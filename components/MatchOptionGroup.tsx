import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export interface MatchOptionItem<T> {
  id: T;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface MatchOptionGroupProps<T> {
  title: string;
  description?: string;
  options: MatchOptionItem<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
}

export function MatchOptionGroup<T extends string>({
  title,
  description,
  options,
  selectedValue,
  onSelect,
}: MatchOptionGroupProps<T>) {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{title}</Text>
      {description && <Text style={styles.groupDescription}>{description}</Text>}

      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = selectedValue === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${opt.title}${opt.subtitle ? ', ' + opt.subtitle : ''}`}
            >
              <View
                style={[
                  styles.iconWrap,
                  isSelected && styles.iconWrapSelected,
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={18}
                  color={isSelected ? COLORS.textLight : COLORS.primary}
                />
              </View>

              <View style={styles.textWrap}>
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected,
                  ]}
                >
                  {opt.title}
                </Text>
                {opt.subtitle && (
                  <Text
                    style={[
                      styles.optionSubtitle,
                      isSelected && styles.optionSubtitleSelected,
                    ]}
                  >
                    {opt.subtitle}
                  </Text>
                )}
              </View>

              {isSelected && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color={COLORS.textLight} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: SPACING.xl,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionCard: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 56,
  },
  optionCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  textWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  optionTitleSelected: {
    color: COLORS.textLight,
  },
  optionSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  optionSubtitleSelected: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
