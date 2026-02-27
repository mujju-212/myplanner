export interface DailyLog {
    id: number;
    date: string; // YYYY-MM-DD
    what_i_did: string | null;
    achievements: string | null;
    learnings: string | null;
    challenges: string | null;
    tomorrow_intention: string | null;
    gratitude: string | null;
    productivity_rating: number | null;
    satisfaction_rating: number | null;
    completion_rating: number | null;
    energy_rating: number | null;
    overall_rating: number | null;
    mood: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface CreateDailyLogInput {
    date: string;
    what_i_did?: string;
    achievements?: string;
    learnings?: string;
    challenges?: string;
    tomorrow_intention?: string;
    gratitude?: string;
    productivity_rating?: number;
    satisfaction_rating?: number;
    completion_rating?: number;
    energy_rating?: number;
    overall_rating?: number;
    mood?: string;
    tags?: string[];
}

export interface UpdateDailyLogInput {
    what_i_did?: string;
    achievements?: string;
    learnings?: string;
    challenges?: string;
    tomorrow_intention?: string;
    gratitude?: string;
    productivity_rating?: number;
    satisfaction_rating?: number;
    completion_rating?: number;
    energy_rating?: number;
    overall_rating?: number;
    mood?: string;
    tags?: string[];
}
