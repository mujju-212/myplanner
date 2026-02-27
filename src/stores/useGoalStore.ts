import { create } from 'zustand';
import { Goal, CreateGoalInput, UpdateGoalInput, GoalFilter } from '../types/goal.types';
import { goalService } from '../services/goalService';

interface GoalState {
    goals: Goal[];
    selectedGoal: Goal | null;
    isLoading: boolean;
    error: string | null;
    loadGoals: (filter?: GoalFilter) => Promise<void>;
    addGoal: (input: CreateGoalInput) => Promise<Goal>;
    updateGoal: (id: number, input: UpdateGoalInput) => Promise<void>;
    deleteGoal: (id: number) => Promise<void>;
    achieveGoal: (id: number, notes?: string) => Promise<void>;
    updateProgress: (id: number, value: number) => Promise<void>;
    completeMilestone: (goalId: number, milestoneId: number) => Promise<void>;
    selectGoal: (goal: Goal | null) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
    goals: [],
    selectedGoal: null,
    isLoading: false,
    error: null,

    loadGoals: async (filter?) => {
        try {
            set({ isLoading: true, error: null });
            const goals = await goalService.getGoals(filter);
            set({ goals, isLoading: false });
        } catch (e: any) { set({ error: e.message, isLoading: false }); }
    },

    addGoal: async (input) => {
        const goal = await goalService.createGoal(input);
        set(s => ({ goals: [goal, ...s.goals] }));
        return goal;
    },

    updateGoal: async (id, input) => {
        const goal = await goalService.updateGoal(id, input);
        set(s => ({ goals: s.goals.map(g => g.id === id ? goal : g), selectedGoal: s.selectedGoal?.id === id ? goal : s.selectedGoal }));
    },

    deleteGoal: async (id) => {
        await goalService.deleteGoal(id);
        set(s => ({ goals: s.goals.filter(g => g.id !== id), selectedGoal: s.selectedGoal?.id === id ? null : s.selectedGoal }));
    },

    achieveGoal: async (id, notes?) => {
        const goal = await goalService.achieveGoal(id, notes);
        set(s => ({ goals: s.goals.map(g => g.id === id ? goal : g) }));
    },

    updateProgress: async (id, value) => {
        const goal = await goalService.updateProgress(id, value);
        set(s => ({ goals: s.goals.map(g => g.id === id ? goal : g) }));
    },

    completeMilestone: async (goalId, milestoneId) => {
        const goal = await goalService.completeMilestone(goalId, milestoneId);
        set(s => ({ goals: s.goals.map(g => g.id === goalId ? goal : g), selectedGoal: s.selectedGoal?.id === goalId ? goal : s.selectedGoal }));
    },

    selectGoal: (goal) => set({ selectedGoal: goal }),
}));
