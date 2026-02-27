import { Platform } from 'react-native';

export const shadows = {
    // Soft, slightly blue-tinted drop shadows for the neumorphic feeling
    sm: Platform.select({
        ios: {
            shadowColor: '#85C1E9',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: {
            elevation: 2,
        },
    }),
    md: Platform.select({
        ios: {
            shadowColor: '#85C1E9',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        android: {
            elevation: 4,
        },
    }),
    lg: Platform.select({
        ios: {
            shadowColor: '#4A9BE2',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
        },
        android: {
            elevation: 8,
        },
    }),
    // For the active/gradient components like the Save Button or FAB
    glow: Platform.select({
        ios: {
            shadowColor: '#4A9BE2',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
        },
        android: {
            elevation: 6,
        },
    }),
};
