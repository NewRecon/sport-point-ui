import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { profileService } from '../api/profileService';
import type { UserProfileData } from '../api/profileService';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialValues: UserProfileData;
  onProfileUpdated: (updatedData: UserProfileData) => void;
}

interface FormValues {
  email: string;
  bio: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialValues,
  onProfileUpdated,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const fullPayload: UserProfileData = {
        name: initialValues.name,
        email: values.email,
        bio: values.bio,
      };

      const updatedData = await profileService.updateProfile(fullPayload);
      
      message.success('Описание профиля обновлено!');
      onProfileUpdated(updatedData);
      onClose();
    } catch (error: unknown) {
      let errorMessage = 'Не удалось обновить профиль';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Редактировать описание"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ bio: initialValues.bio, email: initialValues.email }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Описание профиля"
          name="bio"
        >
          <Input.TextArea 
            rows={5}
            placeholder="Расскажите что-нибудь о себе..."
            maxLength={255}
            showCount 
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваш email!',
            },
            {
              type: 'email',
              message: 'Пожалуйста, введите корректный email-адрес!',
            },
          ]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
