export type EventType = 'single' | 'duration' | 'full_day' | 'multi_day' | 'recurring';
export type EventCategory = 'general' | 'work' | 'personal' | 'health' | 'social' | 'other';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface AppEvent {
    id: number;
    title: string;
    description: string | null;
    event_type: EventType;
    start_datetime: string;     // ISO datetime
    end_datetime: string | null;
    is_all_day: boolean;
    location: string | null;
    color: string;
    category: EventCategory;
    is_recurring: boolean;
    recurring_pattern: RecurringPattern | null;
    status: EventStatus;
    created_at: string;
    updated_at: string;
}

export interface RecurringPattern {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    end_date?: string;
}

export interface CreateEventInput {
    title: string;
    description?: string;
    event_type?: EventType;
    start_datetime: string;
    end_datetime?: string;
    is_all_day?: boolean;
    location?: string;
    color?: string;
    category?: EventCategory;
    is_recurring?: boolean;
    recurring_pattern?: RecurringPattern;
}

export interface UpdateEventInput {
    title?: string;
    description?: string;
    event_type?: EventType;
    start_datetime?: string;
    end_datetime?: string;
    is_all_day?: boolean;
    location?: string;
    color?: string;
    category?: EventCategory;
    status?: EventStatus;
    is_recurring?: boolean;
    recurring_pattern?: RecurringPattern;
}

export interface EventFilter {
    category?: EventCategory;
    status?: EventStatus;
    date?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}
