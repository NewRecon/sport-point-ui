import React from 'react';
import { Form, Input, Button } from 'antd';

export interface LoginValues {
  email: string;
  password?: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Введите корректный email!' }]}
      >
        <Input placeholder="example@mail.com" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль!' }]}
      >
        <Input.Password placeholder="Ваш пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
