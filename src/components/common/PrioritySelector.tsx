import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Priority } from '../../types/todo.types';

type PrioritySelectorProps = {
  selected: Priority;
  onSelect: (priority: Priority) => void;
};

export default function PrioritySelector({ selected, onSelect }: PrioritySelectorProps) {
  const priorities: { id: Priority; label: string; color: string; bg: string }[] = [
    { id: 'low', label: 'Low', color: colors.primary, bg: '#E3F2FD' },
    { id: 'medium', label: 'Medium', color: colors.warning, bg: '#FFF3E0' },
    { id: 'high', label: 'High', color: colors.danger, bg: '#FFEBEE' },
    { id: 'urgent', label: 'Urgent', color: '#D32F2F', bg: '#FFCDD2' },
  ];

  return (
    <View style={styles.container}>
      {priorities.map((p) => {
        const isSelected = selected === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onSelect(p.id)}
            style={[
              styles.pill,
              isSelected ? { backgroundColor: p.color } : { backgroundColor: p.bg },
            ]}
          >
            <Text
              style={[
                styles.text,
                isSelected ? { color: colors.textWhite } : { color: p.color },
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold as any,
  },
});
