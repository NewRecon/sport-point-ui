import { API_BASE_URL, getHeaders } from './config';

export interface EventSubscription {
  userId: string;
  username: string;
}

export interface EventData {
  id: string;
  title: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description: string;
  date: string;
  category: string;
  ownerId: string;
  totalParticipants: number;
  eventSubscriptions: EventSubscription[];
}

export interface EventFilterParams {
  category?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export const eventService = {
  async getAllEvents(filters?: EventFilterParams): Promise<EventData[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    }

    const queryString = queryParams.toString();

    let url = `${API_BASE_URL}/events`;
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить список событий');
    }
    return data;
  },

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

  async createEvent(
    event: Omit<EventData, 'id' | 'ownerId' | 'eventSubscriptions'>
  ): Promise<EventData> {
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
