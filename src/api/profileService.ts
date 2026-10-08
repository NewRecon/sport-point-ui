import { API_BASE_URL, getHeaders } from './config';

export interface ProfileEventItem {
  eventId: string;
  eventTitle: string;
}

export interface UserProfileData {
  userId?: string;
  name: string;
  bio: string;
  email: string;
  avatarObjectName?: string | null;
  profileEventsOwner?: ProfileEventItem[];
  profileEventsNotOwner?: ProfileEventItem[];
}

export const profileService = {
  async getProfile(): Promise<UserProfileData> {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить профиль');
    }
    return data;
  },

  async updateProfile(profileData: UserProfileData): Promise<UserProfileData> {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось обновить профиль');
    }
    return data;
  },

  async getUserProfile(userId: string): Promise<UserProfileData> {
    const response = await fetch(`${API_BASE_URL}/profiles/user/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить профиль');
    }
    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let message = 'Не удалось загрузить файл';
      try {
        const data = await response.json();
        message = data.message || message;
      } catch {
        // тело не JSON — игнорируем
      }
      throw new Error(message);
    }

    return await response.json();
  },
};