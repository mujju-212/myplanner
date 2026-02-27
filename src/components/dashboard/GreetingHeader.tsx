import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useThemeStore } from '../../stores/useThemeStore';

type GreetingHeaderProps = {
  name?: string;
  unreadCount?: number;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
};

export default function GreetingHeader({
  name = 'Mujju',
  unreadCount = 1,
  onSearchPress,
  onNotificationPress,
  onMenuPress,
}: GreetingHeaderProps) {
  const tc = useThemeStore().colors;
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.appName, { color: tc.primary }]}>MyPlanner</Text>
        <Text style={[styles.greeting, { color: tc.textPrimary }]}>Good Morning, {name}</Text>
        <Text style={[styles.date, { color: tc.textSecondary }]}>{today}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Pressable onPress={onMenuPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: tc.cardBackground, opacity: pressed ? 0.6 : 1, cursor: 'pointer' as any }]}>
          <MaterialIcons name="menu" size={24} color={tc.textPrimary} />
        </Pressable>
        <Pressable onPress={onNotificationPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: tc.cardBackground, opacity: pressed ? 0.6 : 1, cursor: 'pointer' as any }]}>
          <MaterialIcons name="notifications-none" size={24} color={tc.textPrimary} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { borderColor: tc.background }]} pointerEvents="none">
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </Pressable>
        <Pressable onPress={onSearchPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: tc.cardBackground, opacity: pressed ? 0.6 : 1, cursor: 'pointer' as any }]}>
          <MaterialIcons name="search" size={24} color={tc.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  appName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    marginBottom: 4,
  },
  greeting: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold as any,
    marginBottom: 4,
  },
  date: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as any,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  iconButton: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: typography.weights.bold as any,
  },
});
