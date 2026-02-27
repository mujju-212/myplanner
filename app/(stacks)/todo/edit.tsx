import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { useTodoStore } from '../../../src/stores/useTodoStore';
import PrioritySelector from '../../../src/components/common/PrioritySelector';
import { useThemeStore } from '../../../src/stores/useThemeStore';

export default function TodoEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tc = useThemeStore().colors;
  const { todos, updateTodo } = useTodoStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueTime, setDueTime] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (id) {
      const found = todos.find(t => t.id === Number(id));
      if (found) {
        setTitle(found.title);
        setDescription(found.description || '');
        setPriority(found.priority as any);
        setDueTime(found.due_time || '');
        setTags((found.tags || []).join(', '));
      }
    }
  }, [id, todos]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      await updateTodo(Number(id), {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_time: dueTime.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: tc.cardBackground }]}>
          <MaterialIcons name="close" size={24} color={tc.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>Edit Task</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.label, { color: tc.textSecondary }]}>Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor={tc.textSecondary}
        />

        <Text style={[styles.label, { color: tc.textSecondary }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details..."
          placeholderTextColor={tc.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: tc.textSecondary }]}>Priority</Text>
        <PrioritySelector selected={priority} onSelect={setPriority} />

        <Text style={[styles.label, { color: tc.textSecondary }]}>Due Time</Text>
        <TextInput
          style={[styles.input, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]}
          value={dueTime}
          onChangeText={setDueTime}
          placeholder="e.g. 14:00"
          placeholderTextColor={tc.textSecondary}
        />

        <Text style={[styles.label, { color: tc.textSecondary }]}>Tags (comma-separated)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]}
          value={tags}
          onChangeText={setTags}
          placeholder="work, personal"
          placeholderTextColor={tc.textSecondary}
        />

        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <LinearGradient
            colors={[tc.gradientStart, tc.gradientEnd]}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerBtn: { padding: 8, borderRadius: 20, backgroundColor: colors.cardBackground },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semiBold as any, color: colors.textPrimary },
  scrollContent: { padding: 20 },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any, color: colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: colors.cardBackground, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 100, textAlignVertical: 'top' as const },
  saveBtn: { marginTop: 32, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  saveGradient: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' as const },
  saveBtnText: { color: '#FFF', fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any },
});
