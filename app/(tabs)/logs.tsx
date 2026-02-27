import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert, TextInput, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { format, addDays, subDays } from 'date-fns';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useLogStore } from '../../src/stores/useLogStore';
import { useThemeStore } from '../../src/stores/useThemeStore';

const MOODS = [
  { key: 'great', emoji: '😁', label: 'Great' },
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'bad', emoji: '😞', label: 'Bad' },
  { key: 'terrible', emoji: '😣', label: 'Terrible' },
];
const MOOD_EMOJI: Record<string, string> = { great: '😁', good: '🙂', okay: '😐', bad: '😞', terrible: '😣' };

export default function DailyLogScreen() {
  const router = useRouter();
  const tc = useThemeStore().colors;
  const { currentLog, logs, loadLogForDate, loadLogs, saveLog, isLoading } = useLogStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mood, setMood] = useState('good');
  const [journal, setJournal] = useState('');
  const [rating, setRating] = useState(7);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => { loadLogForDate(dateKey); loadLogs(); }, [dateKey, loadLogForDate]);

  useEffect(() => {
    if (currentLog && currentLog.date === dateKey) {
      setMood(currentLog.mood || 'good');
      setJournal(currentLog.what_i_did || '');
      setRating(currentLog.overall_rating || 7);
    } else if (!currentLog || currentLog.date !== dateKey) {
      setMood('good');
      setJournal('');
      setRating(7);
    }
  }, [currentLog, dateKey]);

  const goToPreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  const showSaveAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
    else Alert.alert(title, msg);
  };

  const handleSave = useCallback(async () => {
    try {
      await saveLog({ date: dateKey, what_i_did: journal || undefined, overall_rating: rating, mood });
      showSaveAlert('Saved!', 'Your daily log has been saved.');
      loadLogs(); // Refresh history
    } catch (error: any) {
      showSaveAlert('Error', error.message || 'Failed to save log.');
    }
  }, [dateKey, journal, rating, mood, saveLog]);

  const todayStr = format(selectedDate, 'EEEE, MMMM d');
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

  // Sort past logs newest first
  const pastLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      {/* Header with date navigation */}
      <View style={styles.header}>
        <View style={[styles.dateSelector, { backgroundColor: tc.cardBackground }]}>
          <Pressable style={styles.arrow} onPress={goToPreviousDay}>
            <MaterialIcons name="chevron-left" size={28} color={tc.textSecondary} />
          </Pressable>
          <View style={styles.dateInfo}>
            {isToday && <Text style={[styles.todayLabel, { color: tc.primary }]}>Today</Text>}
            <Text style={[styles.dateText, { color: tc.textPrimary }]}>{todayStr}</Text>
          </View>
          <Pressable style={styles.arrow} onPress={goToNextDay}>
            <MaterialIcons name="chevron-right" size={28} color={tc.textSecondary} />
          </Pressable>
        </View>

        {/* Tabs: Write / History */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tab, activeTab === 'write' && { backgroundColor: tc.primary }]}
            onPress={() => setActiveTab('write')}
          >
            <MaterialIcons name="edit" size={16} color={activeTab === 'write' ? '#FFF' : tc.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'write' ? '#FFF' : tc.textSecondary }]}>Write</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'history' && { backgroundColor: tc.primary }]}
            onPress={() => setActiveTab('history')}
          >
            <MaterialIcons name="history" size={16} color={activeTab === 'history' ? '#FFF' : tc.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'history' ? '#FFF' : tc.textSecondary }]}>History ({pastLogs.length})</Text>
          </Pressable>
        </View>

        {/* Quick links */}
        <View style={styles.reviewNav}>
          <Pressable style={[styles.reviewBtn, { backgroundColor: tc.cardBackground }]} onPress={() => router.push('/log/weekly')}>
            <MaterialIcons name="date-range" size={16} color={tc.primary} />
            <Text style={[styles.reviewBtnText, { color: tc.textPrimary }]}>Weekly</Text>
          </Pressable>
          <Pressable style={[styles.reviewBtn, { backgroundColor: tc.cardBackground }]} onPress={() => router.push('/log/monthly')}>
            <MaterialIcons name="calendar-today" size={16} color={tc.primary} />
            <Text style={[styles.reviewBtnText, { color: tc.textPrimary }]}>Monthly</Text>
          </Pressable>
        </View>
      </View>

      {activeTab === 'write' ? (
        /* WRITE TAB */
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Mood Picker */}
          <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>How was your day?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <Pressable
                key={m.key}
                style={[styles.moodItem, { backgroundColor: tc.cardBackground }, mood === m.key && { backgroundColor: tc.primary + '20', borderColor: tc.primary, borderWidth: 2 }]}
                onPress={() => setMood(m.key)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, { color: mood === m.key ? tc.primary : tc.textSecondary }]}>{m.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Journal */}
          <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Journal</Text>
          <View style={[styles.journalCard, { backgroundColor: tc.cardBackground }]}>
            <TextInput
              style={[styles.journalInput, { color: tc.textPrimary }]}
              placeholder="Write about your day..."
              placeholderTextColor={tc.textSecondary}
              value={journal}
              onChangeText={setJournal}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Rating */}
          <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Rate your day</Text>
          <View style={[styles.ratingCard, { backgroundColor: tc.cardBackground }]}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <Pressable key={n} onPress={() => setRating(n)} style={styles.starBtn}>
                  <MaterialIcons name={n <= rating ? 'star' : 'star-border'} size={28} color={n <= rating ? tc.warning : tc.border} />
                </Pressable>
              ))}
            </View>
            <Text style={[styles.ratingText, { color: tc.textPrimary }]}>{rating}/10</Text>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      ) : (
        /* HISTORY TAB */
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {pastLogs.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="event-note" size={64} color={tc.border} />
              <Text style={[styles.emptyText, { color: tc.textSecondary }]}>No past logs yet.</Text>
              <Text style={[styles.emptyText, { color: tc.textSecondary }]}>Start writing in the "Write" tab!</Text>
            </View>
          ) : (
            pastLogs.map(log => (
              <Pressable
                key={log.date}
                style={[styles.historyCard, { backgroundColor: tc.cardBackground }]}
                onPress={() => router.push(`/log/daily/${log.date}`)}
              >
                <View style={styles.historyLeft}>
                  <Text style={styles.historyEmoji}>{MOOD_EMOJI[log.mood || 'good'] || '🙂'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyDate, { color: tc.textPrimary }]}>
                    {(() => { try { return format(new Date(log.date), 'EEEE, MMM d, yyyy'); } catch { return log.date; } })()}
                  </Text>
                  {log.what_i_did && (
                    <Text style={[styles.historyPreview, { color: tc.textSecondary }]} numberOfLines={2}>
                      {log.what_i_did}
                    </Text>
                  )}
                </View>
                <View style={styles.historyRight}>
                  {log.overall_rating && (
                    <View style={styles.historyRating}>
                      <MaterialIcons name="star" size={14} color={tc.warning} />
                      <Text style={[styles.historyRatingText, { color: tc.textPrimary }]}>{log.overall_rating}</Text>
                    </View>
                  )}
                  <MaterialIcons name="chevron-right" size={20} color={tc.textSecondary} />
                </View>
              </Pressable>
            ))
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* Save Button - only on write tab */}
      {activeTab === 'write' && (
        <View style={styles.bottomContainer}>
          <Pressable style={styles.mainSaveBtn} onPress={handleSave} disabled={isLoading}>
            <LinearGradient colors={[tc.gradientStart, tc.gradientEnd]} style={styles.mainSaveGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialIcons name="save" size={22} color="#FFF" />
              <Text style={styles.mainSaveText}>{isLoading ? 'Saving...' : 'Save Log'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 8 },
  dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, marginBottom: 10 },
  dateInfo: { alignItems: 'center' as const },
  todayLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold as any, marginBottom: 2 },
  dateText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold as any, color: colors.textPrimary },
  arrow: { padding: 8 },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.cardBackground },
  tabText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any },
  reviewNav: { flexDirection: 'row', gap: 10 },
  reviewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  reviewBtnText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium as any },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  sectionLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any, textTransform: 'uppercase' as const, letterSpacing: 1, marginTop: 20, marginBottom: 10 },
  moodRow: { flexDirection: 'row', gap: 8 },
  moodItem: { flex: 1, alignItems: 'center' as const, paddingVertical: 12, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.medium as any },
  journalCard: { borderRadius: 16, padding: 4, minHeight: 200 },
  journalInput: { padding: 16, fontSize: typography.sizes.md, lineHeight: 24, minHeight: 180 },
  ratingCard: { borderRadius: 16, padding: 20, alignItems: 'center' as const },
  starsRow: { flexDirection: 'row', gap: 2 },
  starBtn: { padding: 2 },
  ratingText: { marginTop: 8, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any },
  bottomContainer: { position: 'absolute' as const, bottom: 32, left: 20, right: 20 },
  mainSaveBtn: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  mainSaveGradient: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' as const, flexDirection: 'row', justifyContent: 'center' as const, gap: 8 },
  mainSaveText: { color: '#FFF', fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any },
  // History styles
  emptyHistory: { alignItems: 'center' as const, paddingTop: 60, gap: 8 },
  emptyText: { fontSize: typography.sizes.md },
  historyCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 8, gap: 12 },
  historyLeft: { width: 40, height: 40, borderRadius: 20, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: 'rgba(128,128,128,0.1)' },
  historyEmoji: { fontSize: 22 },
  historyDate: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold as any },
  historyPreview: { fontSize: typography.sizes.xs, marginTop: 2 },
  historyRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyRating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  historyRatingText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any },
});
