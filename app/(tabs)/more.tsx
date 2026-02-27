import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../../src/components/common/Sidebar';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { clearAllData, downloadJSON, exportAllData, importAllData, triggerImportDialog } from '../../src/utils/dataUtils';

interface MenuItemProps {
  icon: string;
  iconFamily?: 'material' | 'feather';
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

function MenuItem({ icon, iconFamily = 'material', title, subtitle, onPress, rightElement, iconBg, iconColor }: MenuItemProps) {
  const IconComponent = iconFamily === 'feather' ? Feather : MaterialIcons;
  const tc = useThemeStore().colors;
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg || tc.primaryLight + '20' }]}>
        <IconComponent name={icon as any} size={20} color={iconColor || (iconBg ? '#FFF' : tc.primary)} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: tc.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: tc.textSecondary }]}>{subtitle}</Text>}
      </View>
      {rightElement || <MaterialIcons name="chevron-right" size={22} color={tc.textSecondary} />}
    </TouchableOpacity>
  );
}

export default function MoreTab() {
  const router = useRouter();
  const { isDark, toggleTheme, loadTheme, colors: themeColors } = useThemeStore();
  const { notificationsEnabled, toggleNotifications, loadSettings } = useSettingsStore();
  const [showSidebar, setShowSidebar] = React.useState(false);

  useEffect(() => { loadTheme(); loadSettings(); }, []);

  const handleExport = async () => {
    try {
      const json = await exportAllData();
      downloadJSON(json, `myplanner_backup_${new Date().toISOString().split('T')[0]}.json`);
      Alert.alert('Exported!', 'Your data has been downloaded as a JSON file.');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const handleImport = async () => {
    try {
      const json = await triggerImportDialog();
      await importAllData(json);
      Alert.alert('Imported!', 'Data restored. Restart the app to see changes.');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const handleClear = () => {
    Alert.alert('Clear All Data', 'This will permanently delete everything. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All', style: 'destructive', onPress: async () => {
          await clearAllData();
          Alert.alert('Cleared', 'All data has been deleted. Restart the app.');
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Sidebar visible={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with menu button */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: themeColors.cardBackground }]} 
            onPress={() => setShowSidebar(true)}
          >
            <MaterialIcons name="menu" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* Profile Card */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Mujju</Text>
            <Text style={styles.profileLevel}>Level 1 • Beginner</Text>
          </View>
          <MaterialIcons name="edit" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: themeColors.cardBackground }]}>
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Done</Text>
          </View>
        </View>

        {/* Features Section */}
        <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>Features</Text>
        <View style={[styles.menuGroup, { backgroundColor: themeColors.cardBackground }]}>
          <MenuItem icon="flag" title="Goals" subtitle="Set and track your goals" onPress={() => router.push('/goal/create')} />
          <MenuItem icon="loop" title="Habits" subtitle="Build daily habits" onPress={() => router.push('/habit/create')} />
          <MenuItem icon="date-range" title="Weekly Review" subtitle="Review your week" onPress={() => router.push('/log/weekly')} />
          <MenuItem icon="calendar-today" title="Monthly Review" subtitle="Review your month" onPress={() => router.push('/log/monthly')} />
          <MenuItem icon="bar-chart" title="Analytics" subtitle="View your productivity insights" onPress={() => router.push('/analytics')} />
          <MenuItem icon="emoji-events" title="Achievements" subtitle="Badges and milestones" onPress={() => router.push('/achievements')} />
          <MenuItem icon="search" title="Search" subtitle="Find anything in your planner" onPress={() => router.push('/search')} />
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>Preferences</Text>
        <View style={[styles.menuGroup, { backgroundColor: themeColors.cardBackground }]}>
          <MenuItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle={isDark ? 'On' : 'Off'}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            }
          />
          <MenuItem
            icon="notifications"
            title="Notifications"
            subtitle={notificationsEnabled ? 'Enabled' : 'Disabled'}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            }
          />
        </View>

        {/* Data Section */}
        <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>Data</Text>
        <View style={[styles.menuGroup, { backgroundColor: themeColors.cardBackground }]}>
          <MenuItem icon="download-cloud" iconFamily="feather" title="Export Data" subtitle="Download as JSON" onPress={handleExport} />
          <MenuItem icon="upload-cloud" iconFamily="feather" title="Import Data" subtitle="Restore from backup" onPress={handleImport} />
          <MenuItem icon="delete-outline" title="Clear All Data" subtitle="Delete everything" iconBg={themeColors.danger + '20'} iconColor={themeColors.danger} onPress={handleClear} />
        </View>

        {/* About Section */}
        <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>About</Text>
        <View style={[styles.menuGroup, { backgroundColor: themeColors.cardBackground }]}>
          <MenuItem icon="info" title="About MyPlanner" subtitle="Version 1.0.0" />
          <MenuItem icon="star" title="Rate App" />
          <MenuItem icon="share" iconFamily="feather" title="Share with Friends" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menuButton: {
    padding: 10,
    borderRadius: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    gap: 14,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: '#FFF',
  },
  profileLevel: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold as any,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  menuGroup: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as any,
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
