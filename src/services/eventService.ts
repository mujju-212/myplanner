import { eventRepository } from '../database/repositories/eventRepository';
import { AppEvent, CreateEventInput, UpdateEventInput, EventFilter } from '../types/event.types';

class EventService {
    async createEvent(input: CreateEventInput): Promise<AppEvent> {
        if (!input.title?.trim()) throw new Error('Event title is required');
        if (!input.start_datetime) throw new Error('Start date/time is required');
        return eventRepository.insert({ ...input, title: input.title.trim() });
    }

    async getEvents(filter?: EventFilter): Promise<AppEvent[]> {
        return eventRepository.findAll(filter);
    }

    async getEventById(id: number): Promise<AppEvent | null> {
        return eventRepository.findById(id);
    }

    async getEventsForDate(date: string): Promise<AppEvent[]> {
        return eventRepository.findByDate(date);
    }

    async updateEvent(id: number, input: UpdateEventInput): Promise<AppEvent> {
        return eventRepository.update(id, input);
    }

    async deleteEvent(id: number): Promise<void> {
        return eventRepository.delete(id);
    }

    async completeEvent(id: number): Promise<AppEvent> {
        return eventRepository.update(id, { status: 'completed' });
    }

    async cancelEvent(id: number): Promise<AppEvent> {
        return eventRepository.update(id, { status: 'cancelled' });
    }
}

export const eventService = new EventService();
