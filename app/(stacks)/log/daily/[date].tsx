import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors } from '../../../../src/theme/colors';
import { typography } from '../../../../src/theme/typography';
import { useLogStore } from '../../../../src/stores/useLogStore';
import { useThemeStore } from '../../../../src/stores/useThemeStore';

const MOOD_EMOJI: Record<string, string> = { great: '😁', good: '🙂', okay: '😐', bad: '😞', terrible: '😣' };

export default function DailyLogDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const tc = useThemeStore().colors;
  const { currentLog, loadLogForDate } = useLogStore();

  useEffect(() => {
    if (date) loadLogForDate(date);
  }, [date]);

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'EEEE, MMMM d, yyyy'); }
    catch { return d; }
  };

  if (!currentLog) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: tc.cardBackground }]}>
            <MaterialIcons name="arrow-back" size={24} color={tc.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>Daily Log</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event-note" size={64} color={tc.border} />
          <Text style={[styles.emptyText, { color: tc.textSecondary }]}>No log found for {date}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: tc.cardBackground }]}>
          <MaterialIcons name="arrow-back" size={24} color={tc.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>Daily Log</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.dateText, { color: tc.textPrimary }]}>{formatDate(currentLog.date)}</Text>

        {/* Mood */}
        {currentLog.mood && (
          <View style={[styles.moodBadge, { backgroundColor: tc.primary + '20' }]}>
            <Text style={styles.moodEmoji}>{MOOD_EMOJI[currentLog.mood] || '🙂'}</Text>
            <Text style={[styles.moodText, { color: tc.primary }]}>{currentLog.mood}</Text>
          </View>
        )}

        {/* Journal */}
        {currentLog.what_i_did && (
          <View style={[styles.journalCard, { backgroundColor: tc.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="edit-note" size={20} color={tc.primary} />
              <Text style={[styles.sectionTitle, { color: tc.textPrimary }]}>Journal</Text>
            </View>
            <Text style={[styles.journalText, { color: tc.textSecondary }]}>{currentLog.what_i_did}</Text>
          </View>
        )}

        {/* Rating */}
        {currentLog.overall_rating && (
          <View style={[styles.ratingCard, { backgroundColor: tc.cardBackground }]}>
            <Text style={[styles.ratingLabel, { color: tc.textSecondary }]}>Day Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <MaterialIcons
                  key={n}
                  name={n <= currentLog.overall_rating! ? 'star' : 'star-border'}
                  size={24}
                  color={n <= currentLog.overall_rating! ? tc.warning : tc.border}
                />
              ))}
            </View>
            <Text style={[styles.ratingValue, { color: tc.textPrimary }]}>{currentLog.overall_rating}/10</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerBtn: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semiBold as any },
  emptyContainer: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const },
  emptyText: { marginTop: 12, fontSize: typography.sizes.md },
  scrollContent: { padding: 20 },
  dateText: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, marginBottom: 12 },
  moodBadge: { flexDirection: 'row', alignSelf: 'flex-start' as const, alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 16 },
  moodEmoji: { fontSize: 20 },
  moodText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any, textTransform: 'capitalize' as const },
  journalCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold as any },
  journalText: { fontSize: typography.sizes.md, lineHeight: 22 },
  ratingCard: { borderRadius: 16, padding: 20, alignItems: 'center' as const },
  ratingLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium as any, marginBottom: 10 },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingValue: { marginTop: 8, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any },
});
