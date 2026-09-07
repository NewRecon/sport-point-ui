import { API_BASE_URL, getHeaders } from './config';

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  locationName: string;
  lat: number;  // Широта для карты
  lng: number;  // Долгота для карты
  participants: Participant[];
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

  // 2. Оставляем прошлый метод получения одного ивента (пригодится при клике)
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
  }
};
