export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'archived';
export type DateType = 'none' | 'single' | 'range' | 'week' | 'month';

export interface Todo {
    id: number;
    list_id: number | null;
    title: string;
    description: string | null;
    priority: Priority;
    status: TodoStatus;
    date_type: DateType;
    start_date: string | null;
    end_date: string | null;
    due_time: string | null;
    is_recurring: boolean;
    tags: string[]; // Stored as JSON string
    position: number;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}

export interface CreateTodoInput {
    title: string;
    description?: string;
    list_id?: number;
    priority?: Priority;
    date_type?: DateType;
    start_date?: string;
    end_date?: string;
    due_time?: string;
    is_recurring?: boolean;
    tags?: string[];
    position?: number;
}

export interface UpdateTodoInput {
    title?: string;
    description?: string;
    list_id?: number;
    priority?: Priority;
    status?: TodoStatus;
    date_type?: DateType;
    start_date?: string;
    end_date?: string;
    due_time?: string;
    tags?: string[];
    position?: number;
}

export interface TodoFilter {
    status?: TodoStatus;
    priority?: Priority;
    list_id?: number;
    date?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    exclude_archived?: boolean;
    limit?: number;
}
