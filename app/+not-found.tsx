import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Screen Not Found' }} />
      <View style={styles.container}>
        <Ionicons name="compass-outline" size={60} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.title}>Lost Your Path?</Text>
        <Text style={styles.message}>
          The travel destination or screen you were trying to reach does not exist.
        </Text>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.button} accessibilityRole="button">
            <Ionicons name="arrow-back" size={16} color={COLORS.textLight} />
            <Text style={styles.buttonText}>Return to Explore</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: SPACING.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: RADIUS.full,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
  },
});
