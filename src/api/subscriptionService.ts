import { API_BASE_URL, getHeaders } from './config';

export interface SubscriptionData {
  eventId: string;
}

export const subscriptionService = {
  async subscribe(subscriptionData: SubscriptionData) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/subscribe`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(subscriptionData),
    });
    if (!response.ok) throw new Error('Не удалось записаться на событие');
  }
}