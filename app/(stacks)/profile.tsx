import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useThemeStore } from '../../src/stores/useThemeStore';

export default function ProfileScreen() {
  const router = useRouter();
  const tc = useThemeStore().colors;
  const [name, setName] = useState('Mujju');
  const [profession, setProfession] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tc.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: tc.cardBackground }]}>
          <MaterialIcons name="arrow-back" size={24} color={tc.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tc.textPrimary }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <LinearGradient colors={[tc.gradientStart, tc.gradientEnd]} style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <Pressable style={[styles.editAvatarBtn, { backgroundColor: tc.primary, borderColor: tc.background }]}><MaterialIcons name="camera-alt" size={16} color="#FFF" /></Pressable>
        </View>

        <Text style={[styles.label, { color: tc.textSecondary }]}>Name</Text>
        <TextInput style={[styles.input, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={tc.textSecondary} />

        <Text style={[styles.label, { color: tc.textSecondary }]}>Profession</Text>
        <TextInput style={[styles.input, { backgroundColor: tc.cardBackground, color: tc.textPrimary, borderColor: tc.border }]} value={profession} onChangeText={setProfession} placeholder="e.g. Student, Developer" placeholderTextColor={tc.textSecondary} />

        <Pressable style={styles.saveBtn} onPress={() => { Alert.alert('Saved', 'Profile updated'); router.back(); }}>
          <LinearGradient colors={[tc.gradientStart, tc.gradientEnd]} style={styles.saveGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.saveBtnText}>Save Profile</Text>
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
  content: { padding: 20, alignItems: 'center' as const },
  avatarSection: { position: 'relative' as const, marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center' as const, justifyContent: 'center' as const },
  avatarText: { fontSize: 40, fontWeight: '700' as const, color: '#FFF' },
  editAvatarBtn: { position: 'absolute' as const, bottom: 0, right: 0, backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 3, borderColor: colors.background },
  label: { alignSelf: 'flex-start' as const, fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold as any, color: colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: { width: '100%' as any, backgroundColor: colors.cardBackground, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  saveBtn: { width: '100%' as any, marginTop: 32 },
  saveGradient: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' as const },
  saveBtnText: { color: '#FFF', fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any },
});
