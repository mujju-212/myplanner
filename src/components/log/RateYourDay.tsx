import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Card from '../common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../stores/useThemeStore';

type RateYourDayProps = {
    ratings: {
        productivity: number;
        satisfaction: number;
        completion: number;
        energy: number;
        overall: number;
    };
    onRatingChange: (key: string, value: number) => void;
    autoSummary?: {
        todosCompleted: number;
        eventsLogged: number;
    };
};

export default function RateYourDay({ ratings, onRatingChange, autoSummary }: RateYourDayProps) {
    const tc = useThemeStore().colors;

    const SliderRow = ({ label, value, stateKey }: { label: string; value: number; stateKey: string }) => (
        <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: tc.textPrimary }]}>{label}</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={value}
                onValueChange={(val) => onRatingChange(stateKey, val)}
                minimumTrackTintColor={tc.primary}
                maximumTrackTintColor={tc.border}
                thumbTintColor="#FFFFFF"
            />
        </View>
    );

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: tc.textPrimary }]}>Rate Your Day</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.slidersContainer}>
                    <SliderRow label="Productivity" value={ratings.productivity} stateKey="productivity" />
                    <SliderRow label="Satisfaction" value={ratings.satisfaction} stateKey="satisfaction" />
                    <SliderRow label="Completion" value={ratings.completion} stateKey="completion" />
                    <SliderRow label="Energy" value={ratings.energy} stateKey="energy" />
                    <SliderRow label="Overall" value={ratings.overall} stateKey="overall" />
                </View>

                {autoSummary && (
                    <View style={[styles.autoSummaryContainer, { backgroundColor: tc.background }]}>
                        <View style={styles.summaryHeader}>
                            <MaterialIcons name="check-box" size={16} color={tc.success} />
                            <Text style={[styles.summaryTitle, { color: tc.textPrimary }]}>Auto Summary</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <MaterialIcons name="fact-check" size={16} color={tc.textSecondary} />
                            <Text style={[styles.summaryText, { color: tc.textSecondary }]}>{autoSummary.todosCompleted} Todos Completed</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <MaterialIcons name="event" size={16} color={tc.textSecondary} />
                            <Text style={[styles.summaryText, { color: tc.textSecondary }]}>{autoSummary.eventsLogged} Event Logged</Text>
                        </View>
                    </View>
                )}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semiBold as any,
        color: colors.textPrimary,
    },
    content: {
        flexDirection: 'row',
    },
    slidersContainer: {
        flex: 6,
        paddingRight: 16,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderLabel: {
        width: 90,
        fontSize: typography.sizes.sm,
        color: colors.textPrimary,
        fontWeight: typography.weights.medium as any,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    autoSummaryContainer: {
        flex: 4,
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    summaryTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold as any,
        color: colors.textPrimary,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    summaryText: {
        fontSize: typography.sizes.xs,
        color: colors.textSecondary,
    },
});
