import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useTodoStore } from '../../src/stores/useTodoStore';
import { useLogStore } from '../../src/stores/useLogStore';
import { useThemeStore } from '../../src/stores/useThemeStore';

export default function AnalyticsScreen() {
  const router = useRouter();
  const tc = useThemeStore().colors;
  const { todos } = useTodoStore();
  const { logs } = useLogStore();

  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.status === 'completed').length;
  const pendingTodos = todos.filter(t => t.status === 'pending').length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const totalLogs = logs.length;
  const avgOverall = logs.length > 0
    ? (logs.reduce((sum, l) => sum + (l.overall_rating || 0), 0) / logs.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Total Tasks', value: totalTodos.toString(), icon: 'assignment', color: tc.primary },
    { label: 'Completed', value: completedTodos.toString(), icon: 'check-circle', color: tc.success },
    { label: 'Pending', value: pendingTodos.toString(), icon: 'pending', color: tc.warning },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: 'trending-up', color: tc.primary },
    { label: 'Daily Logs', value: totalLogs.toString(), icon: 'insert-drive-file', color: tc.primary },
    { label: 'Avg Rating', value: avgOverall, icon: 'star', color: tc.warning },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: tc.cardBackground }]}>
          <MaterialIcons name="arrow-back" size={24} color={tc.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: tc.cardBackground }]}>
              <MaterialIcons name={s.icon as any} size={24} color={s.color} />
              <Text style={[styles.statValue, { color: tc.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: tc.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Priority Breakdown */}
        <Text style={[styles.sectionTitle, { color: tc.textPrimary }]}>Priority Breakdown</Text>
        <View style={[styles.breakdownCard, { backgroundColor: tc.cardBackground }]}>
          {['urgent', 'high', 'medium', 'low'].map(p => {
            const count = todos.filter(t => t.priority === p).length;
            const pct = totalTodos > 0 ? Math.round((count / totalTodos) * 100) : 0;
            const barColor = p === 'urgent' ? tc.danger : p === 'high' ? tc.warning : p === 'medium' ? tc.primary : tc.success;
            return (
              <View key={p} style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: tc.textSecondary }]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
                <View style={[styles.breakdownBar, { backgroundColor: tc.border }]}><View style={[styles.breakdownFill, { width: `${pct}%`, backgroundColor: barColor }]} /></View>
                <Text style={[styles.breakdownValue, { color: tc.textPrimary }]}>{count}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerBtn: { padding: 8, borderRadius: 20, backgroundColor: colors.cardBackground },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semiBold as any, color: colors.textPrimary },
  content: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 18, alignItems: 'center', gap: 6 },
  statValue: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any, color: colors.textPrimary, marginTop: 24, marginBottom: 12 },
  breakdownCard: { backgroundColor: colors.cardBackground, borderRadius: 16, padding: 16 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  breakdownLabel: { width: 70, fontSize: typography.sizes.sm, color: colors.textSecondary },
  breakdownBar: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' as const },
  breakdownFill: { height: '100%' as any, borderRadius: 4 },
  breakdownValue: { width: 24, textAlign: 'right' as const, fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any, color: colors.textPrimary },
});
