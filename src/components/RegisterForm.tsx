import React from 'react';
import { Form, Input, Button } from 'antd';

export interface RegisterValues {
  name: string;
  email: string;
  password?: string;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterValues) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Логин"
        name="username"
        rules={[{ required: true, message: 'Введите логин!' }]}
      >
        <Input placeholder="Придумайте логин" />
      </Form.Item>

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
        rules={[{ required: true, min: 6, message: 'Пароль должен быть от 6 символов!' }]}
      >
        <Input.Password placeholder="Придумайте пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};
