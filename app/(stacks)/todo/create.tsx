import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays } from 'date-fns';
import Card from '../../../src/components/common/Card';
import PrioritySelector from '../../../src/components/common/PrioritySelector';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { useTodoStore } from '../../../src/stores/useTodoStore';
import { useThemeStore } from '../../../src/stores/useThemeStore';

type DateType = 'none' | 'single' | 'range';
type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly';

export default function CreateTodoScreen() {
  const router = useRouter();
  const tc = useThemeStore().colors;
  const { addTodo } = useTodoStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [reminder, setReminder] = useState(false);

  // Date fields
  const [dateType, setDateType] = useState<DateType>('single');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('');

  // Recurring fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<RecurringType>('daily');
  const [recurringInterval, setRecurringInterval] = useState('1');
  const [recurringEndDate, setRecurringEndDate] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      const tagsArr = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const recurringPattern = isRecurring ? {
        type: recurringType,
        interval: parseInt(recurringInterval) || 1,
        end_date: recurringEndDate || undefined,
      } : undefined;

      await addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        date_type: dateType,
        start_date: dateType !== 'none' ? startDate : undefined,
        end_date: dateType === 'range' ? endDate : undefined,
        due_time: dueTime || undefined,
        is_recurring: isRecurring,
        tags: tagsArr.length > 0 ? tagsArr : ['General'],
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save todo');
    }
  };

  const dateTypeOptions: { label: string; value: DateType; icon: string }[] = [
    { label: 'No Date', value: 'none', icon: 'block' },
    { label: 'Single Day', value: 'single', icon: 'today' },
    { label: 'Date Range', value: 'range', icon: 'date-range' },
  ];

  const recurringOptions: { label: string; value: RecurringType }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: tc.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={tc.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>New Task</Text>
        <Pressable style={[styles.headerSaveBtn, { backgroundColor: tc.primaryLight }]} onPress={handleSave}>
          <Text style={styles.headerSaveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title & Description Card */}
        <Card style={styles.inputCard}>
          <TextInput
            style={[styles.titleInput, { color: tc.textPrimary }]}
            placeholder="Task title"
            placeholderTextColor={tc.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          <View style={[styles.divider, { backgroundColor: tc.border }]} />
          <TextInput
            style={[styles.descInput, { color: tc.textPrimary }]}
            placeholder="Description (optional)"
            placeholderTextColor={tc.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </Card>

        {/* Date Type Selector */}
        <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Schedule</Text>
        <View style={styles.chipRow}>
          {dateTypeOptions.map(opt => (
            <Pressable
              key={opt.value}
              style={[styles.chip, { backgroundColor: tc.cardBackground, borderColor: tc.border }, dateType === opt.value && { backgroundColor: tc.primary, borderColor: tc.primary }]}
              onPress={() => setDateType(opt.value)}
            >
              <MaterialIcons name={opt.icon as any} size={16} color={dateType === opt.value ? '#FFF' : tc.textSecondary} />
              <Text style={[styles.chipText, { color: tc.textSecondary }, dateType === opt.value && { color: '#FFF' }]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Date Inputs */}
        {dateType !== 'none' && (
          <Card style={styles.inputCard}>
            <View style={styles.fieldRow}>
              <MaterialIcons name="calendar-today" size={20} color={tc.primary} />
              <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>{dateType === 'range' ? 'Start Date' : 'Date'}</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={startDate}
                  onChange={(e: any) => setStartDate(e.target.value)}
                  style={{ flex: 1, fontSize: 14, color: tc.textPrimary, backgroundColor: tc.background, border: 'none', borderRadius: 10, padding: '8px 12px', textAlign: 'right' as any, outline: 'none', fontFamily: 'inherit' } as any}
                />
              ) : (
                <TextInput style={[styles.fieldInput, { color: tc.textPrimary, backgroundColor: tc.background }]} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" placeholderTextColor={tc.textSecondary} />
              )}
            </View>

            {dateType === 'range' && (
              <>
                <View style={[styles.divider, { backgroundColor: tc.border }]} />
                <View style={styles.fieldRow}>
                  <MaterialIcons name="event" size={20} color={tc.warning} />
                  <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>End Date</Text>
                  {Platform.OS === 'web' ? (
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e: any) => setEndDate(e.target.value)}
                      style={{ flex: 1, fontSize: 14, color: tc.textPrimary, backgroundColor: tc.background, border: 'none', borderRadius: 10, padding: '8px 12px', textAlign: 'right' as any, outline: 'none', fontFamily: 'inherit' } as any}
                    />
                  ) : (
                    <TextInput style={[styles.fieldInput, { color: tc.textPrimary, backgroundColor: tc.background }]} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" placeholderTextColor={tc.textSecondary} />
                  )}
                </View>
              </>
            )}

            <View style={[styles.divider, { backgroundColor: tc.border }]} />
            <View style={styles.fieldRow}>
              <MaterialIcons name="access-time" size={20} color={tc.primary} />
              <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>Time</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e: any) => setDueTime(e.target.value)}
                  style={{ flex: 1, fontSize: 14, color: tc.textPrimary, backgroundColor: tc.background, border: 'none', borderRadius: 10, padding: '8px 12px', textAlign: 'right' as any, outline: 'none', fontFamily: 'inherit' } as any}
                />
              ) : (
                <TextInput style={[styles.fieldInput, { color: tc.textPrimary, backgroundColor: tc.background }]} value={dueTime} onChangeText={setDueTime} placeholder="HH:MM" placeholderTextColor={tc.textSecondary} />
              )}
            </View>
          </Card>
        )}

        {/* Priority */}
        <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Priority</Text>
        <Card style={styles.inputCard}>
          <View style={styles.fieldRow}>
            <PrioritySelector selected={priority} onSelect={setPriority} />
          </View>
        </Card>

        {/* Recurring */}
        <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Recurring</Text>
        <Card style={styles.inputCard}>
          <View style={styles.fieldRow}>
            <MaterialIcons name="repeat" size={20} color={tc.primary} />
            <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>Repeat</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: tc.border, true: tc.primaryLight }}
              thumbColor={isRecurring ? tc.primary : '#f4f3f4'}
            />
          </View>

          {isRecurring && (
            <>
              <View style={[styles.divider, { backgroundColor: tc.border }]} />
              <View style={styles.recurringChips}>
                {recurringOptions.map(opt => (
                  <Pressable
                    key={opt.value}
                    style={[styles.miniChip, { backgroundColor: tc.background, borderColor: tc.border }, recurringType === opt.value && { backgroundColor: tc.primary, borderColor: tc.primary }]}
                    onPress={() => setRecurringType(opt.value)}
                  >
                    <Text style={[styles.miniChipText, { color: tc.textSecondary }, recurringType === opt.value && { color: '#FFF' }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.divider, { backgroundColor: tc.border }]} />
              <View style={styles.fieldRow}>
                <MaterialIcons name="loop" size={20} color={tc.textSecondary} />
                <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>Every</Text>
                <TextInput
                  style={[styles.fieldInput, { width: 50, textAlign: 'center', color: tc.textPrimary, backgroundColor: tc.background }]}
                  value={recurringInterval}
                  onChangeText={setRecurringInterval}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={tc.textSecondary}
                />
                <Text style={[styles.fieldSuffix, { color: tc.textSecondary }]}>
                  {recurringType === 'daily' ? 'day(s)' : recurringType === 'weekly' ? 'week(s)' : 'month(s)'}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: tc.border }]} />
              <View style={styles.fieldRow}>
                <MaterialIcons name="event-busy" size={20} color={tc.danger} />
                <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>Until</Text>
                <TextInput
                  style={[styles.fieldInput, { color: tc.textPrimary, backgroundColor: tc.background }]}
                  value={recurringEndDate}
                  onChangeText={setRecurringEndDate}
                  placeholder="YYYY-MM-DD (optional)"
                  placeholderTextColor={tc.textSecondary}
                />
              </View>
            </>
          )}
        </Card>

        {/* Tags */}
        <Text style={[styles.sectionLabel, { color: tc.textSecondary }]}>Tags</Text>
        <Card style={styles.inputCard}>
          <View style={styles.fieldRow}>
            <MaterialIcons name="label" size={20} color={tc.primary} />
            <TextInput
              style={[styles.fieldInput, { flex: 1, color: tc.textPrimary, backgroundColor: tc.background }]}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="work, personal, health..."
              placeholderTextColor={tc.textSecondary}
            />
          </View>
        </Card>

        {/* Reminder */}
        <Card style={[styles.inputCard, { marginTop: 12 }]}>
          <View style={styles.fieldRow}>
            <MaterialIcons name="notifications" size={20} color={tc.warning} />
            <Text style={[styles.fieldLabel, { color: tc.textPrimary }]}>Reminder</Text>
            <Text style={[styles.fieldSuffix, { color: tc.textSecondary }]}>{reminder ? 'On' : 'Off'}</Text>
            <Switch
              value={reminder}
              onValueChange={setReminder}
              trackColor={{ false: tc.border, true: tc.primaryLight }}
              thumbColor={reminder ? tc.primary : '#f4f3f4'}
            />
          </View>
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Save Button */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.mainSaveBtn} onPress={handleSave}>
          <LinearGradient
            colors={[tc.gradientStart, tc.gradientEnd]}
            style={styles.mainSaveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.mainSaveText}>Create Task</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: colors.background,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.semiBold as any, color: colors.textPrimary },
  headerSaveBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  headerSaveText: { color: colors.textWhite, fontWeight: typography.weights.bold as any, fontSize: typography.sizes.sm },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  sectionLabel: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any,
    color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1,
    marginTop: 20, marginBottom: 8,
  },
  inputCard: { padding: 0, marginVertical: 4 },
  titleInput: {
    padding: 16, fontSize: typography.sizes.lg, fontWeight: typography.weights.semiBold as any,
    color: colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 16 },
  descInput: { padding: 16, height: 80, fontSize: typography.sizes.md, color: colors.textPrimary },

  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium as any },
  chipTextActive: { color: '#FFF' },

  fieldRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  fieldLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium as any, color: colors.textPrimary, minWidth: 70 },
  fieldInput: {
    flex: 1, fontSize: typography.sizes.sm, color: colors.textPrimary, textAlign: 'right',
    backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  fieldSuffix: { fontSize: typography.sizes.sm, color: colors.textSecondary },

  recurringChips: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 8 },
  miniChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  miniChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  miniChipText: { fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: typography.weights.medium as any },
  miniChipTextActive: { color: '#FFF' },

  bottomContainer: { position: 'absolute', bottom: 32, left: 20, right: 20 },
  mainSaveBtn: {
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  mainSaveGradient: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  mainSaveText: { color: colors.textWhite, fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any },
});
