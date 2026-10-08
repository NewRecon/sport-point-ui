export interface JwtPayload {
  USER_ID: string;
  USERNAME: string;
  NAME?: string;
  ROLES: string[];
  exp: number;
}

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Некорректный JWT: ожидалось 3 части');
    return null;
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // atob → бинарная строка (Latin-1); превращаем её в байты и декодируем как UTF-8
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    const json = new TextDecoder('utf-8').decode(bytes);

    return JSON.parse(json) as JwtPayload;
  } catch (error) {
    console.error('Не удалось распарсить JWT', error);
    return null;
  }
};