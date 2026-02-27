import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { useThemeStore } from '../../stores/useThemeStore';

type FABProps = {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function FAB({ onPress, icon = 'add' }: FABProps) {
  const tc = useThemeStore().colors;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: tc.cardBackground },
        pressed ? shadows.sm : shadows.glow,
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <LinearGradient
        colors={[tc.gradientStart, tc.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name={icon} size={32} color={colors.textWhite} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardBackground,
    padding: 4,
  },
  gradient: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});
