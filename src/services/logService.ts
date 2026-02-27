import { logRepository } from '../database/repositories/logRepository';
import { gamificationService } from './gamificationService';
import { DailyLog, CreateDailyLogInput, UpdateDailyLogInput } from '../types/log.types';

class LogService {
    async getDailyLog(date: string): Promise<DailyLog | null> {
        return logRepository.findByDate(date);
    }

    async getAllLogs(): Promise<DailyLog[]> {
        return logRepository.findAll();
    }

    async getRecentLogs(limit: number = 7): Promise<DailyLog[]> {
        return logRepository.findRecent(limit);
    }

    async saveDailyLog(input: CreateDailyLogInput): Promise<DailyLog> {
        if (!input.date || input.date.trim() === '') {
            throw new Error('Date is required for a daily log');
        }

        const log = await logRepository.upsert(input);

        // award XP for completing a daily log
        await gamificationService.awardXP('complete_daily_log');

        return log;
    }

    async updateDailyLog(date: string, input: UpdateDailyLogInput): Promise<DailyLog> {
        return logRepository.update(date, input);
    }

    async deleteDailyLog(date: string): Promise<void> {
        await logRepository.delete(date);
    }
}

export const logService = new LogService();
