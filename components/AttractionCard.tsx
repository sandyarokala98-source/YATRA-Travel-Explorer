import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Attraction } from '@/types/destination';

interface AttractionCardProps {
  attraction: Attraction;
  index: number;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  index,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={[styles.container, SHADOWS.card]}>
      <View style={styles.imageContainer}>
        {!imageError ? (
          <Image
            source={{ uri: attraction.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="camera-outline" size={28} color={COLORS.primaryMedium} />
          </View>
        )}
        {attraction.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{attraction.tag}</Text>
          </View>
        )}
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {attraction.name}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {attraction.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSubtle,
  },
  tagBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(11, 37, 24, 0.8)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  tagText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  indexCircle: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
