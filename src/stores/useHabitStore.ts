import { create } from 'zustand';
import { Habit, HabitCompletion, CreateHabitInput, UpdateHabitInput, HabitFilter } from '../types/habit.types';
import { habitService } from '../services/habitService';

interface HabitState {
    habits: Habit[];
    todayCompletions: HabitCompletion[];
    isLoading: boolean;
    error: string | null;
    loadHabits: (filter?: HabitFilter) => Promise<void>;
    loadTodayCompletions: () => Promise<void>;
    addHabit: (input: CreateHabitInput) => Promise<Habit>;
    updateHabit: (id: number, input: UpdateHabitInput) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    toggleCompletion: (habitId: number, date: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: [],
    todayCompletions: [],
    isLoading: false,
    error: null,

    loadHabits: async (filter?) => {
        try {
            set({ isLoading: true, error: null });
            const habits = await habitService.getHabits(filter);
            set({ habits, isLoading: false });
        } catch (e: any) { set({ error: e.message, isLoading: false }); }
    },

    loadTodayCompletions: async () => {
        const today = new Date().toISOString().split('T')[0];
        const completions = await habitService.getCompletionsForDate(today);
        set({ todayCompletions: completions });
    },

    addHabit: async (input) => {
        const habit = await habitService.createHabit(input);
        set(s => ({ habits: [habit, ...s.habits] }));
        return habit;
    },

    updateHabit: async (id, input) => {
        const habit = await habitService.updateHabit(id, input);
        set(s => ({ habits: s.habits.map(h => h.id === id ? habit : h) }));
    },

    deleteHabit: async (id) => {
        await habitService.deleteHabit(id);
        set(s => ({ habits: s.habits.filter(h => h.id !== id) }));
    },

    toggleCompletion: async (habitId, date) => {
        const { todayCompletions } = get();
        const existing = todayCompletions.find(c => c.habit_id === habitId && c.date === date);
        if (existing) {
            await habitService.undoCompletion(habitId, date);
            set(s => ({ todayCompletions: s.todayCompletions.filter(c => !(c.habit_id === habitId && c.date === date)) }));
            // Refresh habits for updated streak
            const habits = await habitService.getHabits();
            set({ habits });
        } else {
            const comp = await habitService.logCompletion(habitId, date);
            set(s => ({ todayCompletions: [...s.todayCompletions, comp] }));
            const habits = await habitService.getHabits();
            set({ habits });
        }
    },
}));
