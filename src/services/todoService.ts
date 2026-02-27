import { todoRepository } from '../database/repositories/todoRepository';
import { gamificationService } from './gamificationService';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter } from '../types/todo.types';

class TodoService {
    async getTodos(filter?: TodoFilter): Promise<Todo[]> {
        return todoRepository.findAll(filter);
    }

    async getTodosForDate(date: string): Promise<Todo[]> {
        return todoRepository.findAll({ date });
    }

    async createTodo(input: CreateTodoInput): Promise<Todo> {
        if (!input.title || input.title.trim() === '') {
            throw new Error('Todo title is required');
        }

        if (input.start_date && input.end_date && input.start_date > input.end_date) {
            throw new Error('Start date cannot be after end date');
        }

        const todo = await todoRepository.insert(input);

        await gamificationService.awardXP('create_todo');

        return todo;
    }

    async updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
        return todoRepository.update(id, input);
    }

    async completeTodo(id: number, notesAfter?: string): Promise<Todo> {
        const todo = await todoRepository.findById(id);
        if (!todo) {
            throw new Error('Todo not found');
        }
        if (todo.status === 'completed') {
            throw new Error('Already completed');
        }

        const updatedTodo = await todoRepository.complete(id);

        // Notes logic can go here (saving notes_after) depending on schema

        await gamificationService.awardXP(
            todo.priority === 'urgent' ? 'complete_urgent_todo' : 'complete_todo'
        );
        await gamificationService.incrementStat('total_todos_completed');

        return updatedTodo;
    }

    async deleteTodo(id: number): Promise<void> {
        await todoRepository.delete(id);
    }

    async archiveTodo(id: number): Promise<void> {
        await todoRepository.update(id, { status: 'archived' });
    }
}

export const todoService = new TodoService();
