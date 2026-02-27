import { create } from 'zustand';
import { Platform } from 'react-native';

let AsyncStorage: any = null;
if (Platform.OS === 'web') { AsyncStorage = require('@react-native-async-storage/async-storage').default; }

const SETTINGS_KEY = 'app_settings';

interface SettingsState {
    notificationsEnabled: boolean;
    toggleNotifications: () => void;
    loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    notificationsEnabled: true,

    toggleNotifications: async () => {
        const newVal = !get().notificationsEnabled;
        set({ notificationsEnabled: newVal });
        try {
            if (AsyncStorage) {
                const raw = await AsyncStorage.getItem(SETTINGS_KEY);
                const settings = raw ? JSON.parse(raw) : {};
                settings.notificationsEnabled = newVal;
                await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            }
        } catch { }
    },

    loadSettings: async () => {
        try {
            if (AsyncStorage) {
                const raw = await AsyncStorage.getItem(SETTINGS_KEY);
                if (raw) {
                    const settings = JSON.parse(raw);
                    if (settings.notificationsEnabled !== undefined) {
                        set({ notificationsEnabled: settings.notificationsEnabled });
                    }
                }
            }
        } catch { }
    },
}));
