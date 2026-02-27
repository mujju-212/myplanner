import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDB } from '../database/database';

export const XP_AWARDS = {
    create_todo: 5,
    complete_todo: 10,
    complete_urgent_todo: 20,
    create_event: 5,
    complete_daily_log: 20,
    complete_weekly_log: 30,
    complete_monthly_log: 50,
    complete_habit: 10,
    achieve_goal: 100,
    complete_milestone: 25,
    maintain_streak_bonus: 5,
    complete_project: 150,
    ai_chat: 2,
} as const;

export const LEVELS = [
    { level: 1, title: 'Beginner', min_xp: 0, max_xp: 100 },
    { level: 2, title: 'Starter', min_xp: 100, max_xp: 300 },
    { level: 3, title: 'Organizer', min_xp: 300, max_xp: 600 },
    { level: 4, title: 'Planner', min_xp: 600, max_xp: 1000 },
    { level: 5, title: 'Achiever', min_xp: 1000, max_xp: 1500 },
];

class GamificationService {
    private async getWebStats() {
        try {
            const data = await AsyncStorage.getItem('user_stats');
            if (data) return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse web stats', e);
        }
        return { total_xp: 0, current_level: 1, current_log_streak: 0, total_todos_completed: 0 };
    }

    private async setWebStats(stats: any) {
        try {
            await AsyncStorage.setItem('user_stats', JSON.stringify(stats));
        } catch (e) {
            console.error('Failed to save web stats', e);
        }
    }

    async awardXP(action: keyof typeof XP_AWARDS, customAmount?: number) {
        const amount = customAmount || XP_AWARDS[action];

        try {
            if (Platform.OS === 'web') {
                const stats = await this.getWebStats();
                const newXp = stats.total_xp + amount;
                let newLevel = stats.current_level;
                const nextLevelDef = LEVELS.find(l => l.level === newLevel + 1);

                if (nextLevelDef && newXp >= nextLevelDef.min_xp) {
                    newLevel++;
                    console.log(`Level Up! You are now level ${newLevel}: ${nextLevelDef.title}`);
                }

                await this.setWebStats({ ...stats, total_xp: newXp, current_level: newLevel });
            } else {
                const db = getDB();
                await db.withTransactionAsync(async () => {
                    const statsRow = await db.getAllAsync<{ total_xp: number; current_level: number }>(
                        'SELECT total_xp, current_level FROM user_stats LIMIT 1'
                    );
                    const stats = statsRow.length > 0 ? statsRow[0] : null;

                    if (!stats) return;

                    const newXp = stats.total_xp + amount;

                    let newLevel = stats.current_level;
                    const nextLevelDef = LEVELS.find(l => l.level === newLevel + 1);

                    if (nextLevelDef && newXp >= nextLevelDef.min_xp) {
                        newLevel++;
                        console.log(`Level Up! You are now level ${newLevel}: ${nextLevelDef.title}`);
                    }

                    await db.runAsync(
                        'UPDATE user_stats SET total_xp = ?, current_level = ?',
                        [newXp, newLevel]
                    );
                });
            }
        } catch (e) {
            console.error('Failed to award XP', e);
        }
    }

    async incrementStat(statName: 'total_todos_completed' | 'current_log_streak') {
        try {
            if (Platform.OS === 'web') {
                const stats = await this.getWebStats();
                stats[statName] = (stats[statName] || 0) + 1;
                await this.setWebStats(stats);
            } else {
                const db = getDB();
                await db.runAsync(`UPDATE user_stats SET ${statName} = ${statName} + 1`);
            }
        } catch (e) {
            console.error(`Failed to increment stat: ${statName}`, e);
        }
    }
}

export const gamificationService = new GamificationService();
