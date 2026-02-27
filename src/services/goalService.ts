import { goalRepository } from '../database/repositories/goalRepository';
import { Goal, CreateGoalInput, UpdateGoalInput, GoalFilter } from '../types/goal.types';

class GoalService {
    async createGoal(input: CreateGoalInput): Promise<Goal> {
        if (!input.title?.trim()) throw new Error('Goal title is required');
        return goalRepository.insert({ ...input, title: input.title.trim() });
    }

    async getGoals(filter?: GoalFilter): Promise<Goal[]> {
        return goalRepository.findAll(filter);
    }

    async getGoalById(id: number): Promise<Goal | null> {
        return goalRepository.findById(id);
    }

    async updateGoal(id: number, input: UpdateGoalInput): Promise<Goal> {
        return goalRepository.update(id, input);
    }

    async deleteGoal(id: number): Promise<void> {
        return goalRepository.delete(id);
    }

    async achieveGoal(id: number, notes?: string): Promise<Goal> {
        return goalRepository.update(id, { status: 'achieved', completion_notes: notes });
    }

    async updateProgress(id: number, value: number): Promise<Goal> {
        return goalRepository.updateProgress(id, value);
    }

    async completeMilestone(goalId: number, milestoneId: number): Promise<Goal> {
        return goalRepository.completeMilestone(goalId, milestoneId);
    }
}

export const goalService = new GoalService();
