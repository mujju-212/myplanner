import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';

const MOODS = [
  { id: 'sad', emoji: '😢' },
  { id: 'neutral', emoji: '😐' },
  { id: 'good', emoji: '🙂' },
  { id: 'happy', emoji: '😊' },
  { id: 'great', emoji: '🤩' },
];

type MoodSelectorProps = {
  selected?: string;
  onSelect: (mood: string) => void;
};

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      {MOODS.map((m) => {
        const isSelected = selected === m.id;
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            style={[
              styles.emojiContainer,
              isSelected && styles.selectedContainer
            ]}
          >
            <Text style={[styles.emoji, isSelected && styles.selectedEmoji]}>{m.emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 16,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedContainer: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 28,
    opacity: 0.6,
  },
  selectedEmoji: {
    opacity: 1,
  },
});
