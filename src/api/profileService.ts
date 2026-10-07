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
      throw new Error(data.message || 'Не удалось загрузить профиль');
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
};