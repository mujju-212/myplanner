import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import Tag, { TagAppearance } from '../common/Tag';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useThemeStore } from '../../stores/useThemeStore';

type TodoItemProps = {
  title: string;
  tagLabel: string;
  tagAppearance: TagAppearance;
  time: string;
  isCompleted?: boolean;
  priorityColor?: string;
  onToggle?: () => void;
  onPress?: () => void;
};

export default function TodoItem({
  title,
  tagLabel,
  tagAppearance,
  time,
  isCompleted = false,
  priorityColor = colors.danger,
  onToggle,
  onPress,
}: TodoItemProps) {
  const tc = useThemeStore().colors;
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <Pressable onPress={onToggle} style={styles.checkboxContainer}>
          <MaterialIcons
            name={isCompleted ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={isCompleted ? tc.primary : tc.textSecondary}
          />
        </Pressable>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: tc.textPrimary }, isCompleted && { textDecorationLine: 'line-through', color: tc.textSecondary }]}>
            {title}
          </Text>
          <Tag label={tagLabel} appearance={tagAppearance} />
        </View>

        <View style={styles.rightContainer}>
          <Text style={[styles.time, { color: tc.textSecondary }]}>{time}</Text>
          <View style={[styles.dot, { backgroundColor: priorityColor }]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold as any,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});
