import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

export interface RegisterValues {
  username: string;
  name: string;
  email: string;
  password?: string;
  privacyConsent: boolean;
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
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Введите Имя!' }]}
      >
        <Input placeholder="Введите имя" />
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

      <Form.Item
        name="privacyConsent"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      'Необходимо согласие на обработку персональных данных'
                    )
                  ),
          },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Checkbox>
          Я согласен на обработку персональных данных в соответствии с{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            политикой конфиденциальности
          </a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};