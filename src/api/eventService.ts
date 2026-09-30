import { API_BASE_URL, getHeaders } from './config';

export interface EventData {
  id: string;
  title: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description: string;
  date: string;
  totalParticipants: number;
  currentParticipants: number;
}

export const eventService = {
  // 1. Получение ВСЕХ ивентов для карты и бокового списка
  async getAllEvents(): Promise<EventData[]> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить список событий');
    }
    return data;
  },

  // 2. Получение одного ивента
  async getEventById(id: string): Promise<EventData> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить событие');
    }
    return data;
  },

  // 3. Метод создания нового ивента
  async createEvent(event: Omit<EventData, 'participants'>): Promise<EventData> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(event),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Не удалось создать событие');
    return data;
  }
};
