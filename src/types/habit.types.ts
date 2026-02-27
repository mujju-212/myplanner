export type HabitCategory = 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'social' | 'creative' | 'general';
export type HabitFrequency = 'daily' | 'specific_days' | 'x_per_week';
export type HabitTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
    id: number;
    title: string;
    description: string | null;
    category: HabitCategory;
    frequency_type: HabitFrequency;
    specific_days: number[];
    times_per_week: number | null;
    time_of_day: HabitTimeOfDay;
    reminder_time: string | null;
    color: string;
    icon: string;
    current_streak: number;
    longest_streak: number;
    total_completions: number;
    is_active: boolean;
    start_date: string;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface HabitCompletion {
    id: number;
    habit_id: number;
    date: string;
    completed_at: string;
    notes: string | null;
}

export interface CreateHabitInput {
    title: string;
    description?: string;
    category?: HabitCategory;
    frequency_type?: HabitFrequency;
    specific_days?: number[];
    times_per_week?: number;
    time_of_day?: HabitTimeOfDay;
    reminder_time?: string;
    color?: string;
    icon?: string;
}

export interface UpdateHabitInput {
    title?: string;
    description?: string;
    category?: HabitCategory;
    frequency_type?: HabitFrequency;
    specific_days?: number[];
    times_per_week?: number;
    time_of_day?: HabitTimeOfDay;
    reminder_time?: string;
    color?: string;
    icon?: string;
    is_active?: boolean;
}

export interface HabitFilter {
    category?: HabitCategory;
    is_active?: boolean;
    search?: string;
}
