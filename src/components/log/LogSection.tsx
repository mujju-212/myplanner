import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useThemeStore } from '../../stores/useThemeStore';

type LogSectionProps = {
    title: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
};

export default function LogSection({ title, placeholder, value, onChangeText }: LogSectionProps) {
    const [expanded, setExpanded] = useState(false);
    const tc = useThemeStore().colors;

    return (
        <Card style={styles.card}>
            <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: tc.textPrimary }]}>{title}</Text>
                    {!expanded && (
                        <Text style={[styles.preview, { color: tc.textSecondary }]} numberOfLines={1}>
                            {value || placeholder}
                        </Text>
                    )}
                </View>
                <MaterialIcons
                    name={expanded ? "expand-less" : "chevron-right"}
                    size={24}
                    color={tc.textSecondary}
                />
            </Pressable>

            {expanded && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { color: tc.textPrimary }]}
                        placeholder={placeholder}
                        placeholderTextColor={tc.textSecondary}
                        value={value}
                        onChangeText={onChangeText}
                        multiline
                        autoFocus
                    />
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 0,
        marginVertical: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold as any,
    },
    preview: {
        fontSize: typography.sizes.sm,
        marginTop: 4,
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    input: {
        fontSize: typography.sizes.sm,
        minHeight: 80,
        textAlignVertical: 'top',
    }
});
