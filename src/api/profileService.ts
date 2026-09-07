import { API_BASE_URL, getHeaders } from './config';

export interface UserProfileData {
  name: string;
  email: string;
  role: string;
  regDate: string;
}

export const profileService = {
  async getProfile(): Promise<UserProfileData> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getHeaders(), // Тут автоматически прикрепится Authorization: Bearer <token>
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Не удалось загрузить профиль');
    }

    return data;
  }
};
