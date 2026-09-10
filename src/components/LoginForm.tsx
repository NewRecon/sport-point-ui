import React from 'react';
import { Form, Input, Button } from 'antd';

export interface LoginValues {
  username: string;
  password?: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Логин"
        name="username"
        rules={[{ required: true, message: 'Введите логин!' }]}
      >
        <Input placeholder="Введите логин" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль!' }]}
      >
        <Input.Password placeholder="Введите пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
