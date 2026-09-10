import { API_BASE_URL, getHeaders } from './config';
import type { LoginValues } from '../components/LoginForm';
import type { RegisterValues } from '../components/RegisterForm';

export const authService = {
  async login(values: LoginValues) {
    const response = await fetch(`${API_BASE_URL}/v1/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при входе');
    }
    return data;
  },

  async register(values: RegisterValues) {
    const response = await fetch(`${API_BASE_URL}/v1/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при регистрации');
    }
    return data;
  }
};
