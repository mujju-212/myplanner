import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type TagAppearance = 'work' | 'personal' | 'health' | 'default';

type TagProps = {
  label: string;
  appearance?: TagAppearance;
};

export default function Tag({ label, appearance = 'default' }: TagProps) {
  let backgroundColor = colors.border;
  let textColor = colors.textSecondary;

  switch (appearance) {
    case 'work':
      backgroundColor = colors.tagWork;
      textColor = colors.textWhite;
      break;
    case 'personal':
      backgroundColor = colors.tagPersonal;
      textColor = colors.textWhite;
      break;
    case 'health':
      backgroundColor = colors.tagHealth;
      textColor = colors.textWhite;
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12, // Pill shape
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as any,
  }
});
