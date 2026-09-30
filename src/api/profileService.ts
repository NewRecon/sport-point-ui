import { API_BASE_URL, getHeaders } from './config';

export interface UserProfileData {
  name: string;
  bio: string;
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
  }
};
