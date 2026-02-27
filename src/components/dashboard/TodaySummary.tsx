import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import ProgressRing from '../common/ProgressRing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useThemeStore } from '../../stores/useThemeStore';

type TodaySummaryProps = {
  todosCompleted: number;
  todosTotal: number;
  streakDays: number;
  productivityScore: number;
};

export default function TodaySummary({
  todosCompleted,
  todosTotal,
  streakDays,
  productivityScore,
}: TodaySummaryProps) {
  const tc = useThemeStore().colors;
  const completionPercentage = todosTotal > 0 ? (todosCompleted / todosTotal) * 100 : 0;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={160}
    >
      <Card gradient style={styles.card}>
        <Text style={[styles.title, { color: tc.textPrimary }]}>Today's Todos</Text>
        <View style={styles.metricContainer}>
          <ProgressRing progress={completionPercentage / 100} radius={36} strokeWidth={8}>
            <Text style={[styles.mainNumber, { color: tc.textPrimary }]}>{Math.round(completionPercentage)}<Text style={styles.percent}>%</Text></Text>
          </ProgressRing>
        </View>
        <Text style={[styles.subtitle, { color: tc.textSecondary }]}>{todosCompleted} of {todosTotal} Completed</Text>
      </Card>

      <Card gradient style={styles.card}>
        <Text style={[styles.title, { color: tc.textPrimary }]}>Habit Streak</Text>
        <View style={styles.metricContainer}>
          <MaterialIcons name="local-fire-department" size={56} color="#FF9800" />
        </View>
        <Text style={[styles.mainNumber, { color: tc.textPrimary }]}>{streakDays} <Text style={[styles.subtitle, { color: tc.textSecondary }]}>Days</Text></Text>
      </Card>

      <Card gradient style={styles.card}>
        <Text style={[styles.title, { color: tc.textPrimary }]}>Productivity Score</Text>
        <View style={styles.metricContainer}>
          <MaterialIcons name="insights" size={50} color={tc.primaryLight} />
        </View>
        <View style={[styles.scorePill, { backgroundColor: tc.cardBackground }]}>
          <Text style={[styles.scoreNumber, { color: tc.textPrimary }]}>{productivityScore}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    width: 150,
    height: 180,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold as any,
    textAlign: 'center',
  },
  metricContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
  },
  percent: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as any,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as any,
  },
  scorePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#85C1E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    bottom: 20,
  },
  scoreNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
  }
});
