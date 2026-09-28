import { API_BASE_URL } from './config';
import type { LoginValues } from '../components/LoginForm';
import type { RegisterValues } from '../components/RegisterForm';

export const authService = {
  async login(values: LoginValues) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при входе');
    }
    return data;
  },

  async register(values: RegisterValues) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при регистрации');
    }
    return data;
  }
};
