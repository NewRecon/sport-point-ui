import React from 'react';
import { Card, Tabs, message } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import type { LoginValues } from '../components/LoginForm';

import { RegisterForm } from '../components/RegisterForm';
import type { RegisterValues } from '../components/RegisterForm';

import { authService } from '../api/authService';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const onLoginSubmit = async (values: LoginValues): Promise<void> => {
    try {
      const data = await authService.login(values);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      message.success('Успешный вход!');
      navigate('/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось войти';
      message.error(errorMessage);
    }
  };

  const onRegisterSubmit = async (values: RegisterValues): Promise<void> => {
    try {
      await authService.register(values);
      message.success('Регистрация успешна! Войдите в аккаунт.');
      navigate('/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось зарегистрироваться';
      message.error(errorMessage);
    }
  };

  const tabItems: TabsProps['items'] = [
    { key: 'login', label: 'Вход', children: <LoginForm onSubmit={onLoginSubmit} /> },
    { key: 'register', label: 'Регистрация', children: <RegisterForm onSubmit={onRegisterSubmit} /> },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Tabs defaultActiveKey="login" items={tabItems} centered />
      </Card>
    </div>
  );
};

export default AuthPage;
