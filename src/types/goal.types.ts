export type GoalCategory = 'health' | 'career' | 'finance' | 'learning' | 'personal' | 'social' | 'creative' | 'fitness' | 'general';
export type GoalType = 'achievement' | 'measurable' | 'habit_based';
export type GoalDuration = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
export type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'failed' | 'deferred' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface Goal {
    id: number;
    title: string;
    description: string | null;
    category: GoalCategory;
    goal_type: GoalType;
    target_value: number | null;
    current_value: number;
    unit: string | null;
    duration_type: GoalDuration;
    start_date: string | null;
    end_date: string | null;
    status: GoalStatus;
    priority: GoalPriority;
    color: string;
    icon: string;
    completed_at: string | null;
    completion_notes: string | null;
    milestones: GoalMilestone[];
    created_at: string;
    updated_at: string;
}

export interface GoalMilestone {
    id: number;
    goal_id: number;
    title: string;
    target_date: string | null;
    is_completed: boolean;
    completed_at: string | null;
    position: number;
}

export interface CreateGoalInput {
    title: string;
    description?: string;
    category?: GoalCategory;
    goal_type?: GoalType;
    target_value?: number;
    unit?: string;
    duration_type?: GoalDuration;
    start_date?: string;
    end_date?: string;
    priority?: GoalPriority;
    color?: string;
    icon?: string;
    milestones?: { title: string; target_date?: string }[];
}

export interface UpdateGoalInput {
    title?: string;
    description?: string;
    category?: GoalCategory;
    goal_type?: GoalType;
    target_value?: number;
    current_value?: number;
    unit?: string;
    duration_type?: GoalDuration;
    start_date?: string;
    end_date?: string;
    status?: GoalStatus;
    priority?: GoalPriority;
    color?: string;
    icon?: string;
    completion_notes?: string;
}

export interface GoalFilter {
    category?: GoalCategory;
    status?: GoalStatus;
    priority?: GoalPriority;
    search?: string;
}
