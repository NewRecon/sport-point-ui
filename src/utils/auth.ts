export interface JwtPayload {
  USER_ID: string;
  USERNAME: string;
  ROLES: string[];
  exp: number;
}

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as JwtPayload;
  } catch (error) {
    console.error('Не удалось распарсить JWT', error);
    return null;
  }
};