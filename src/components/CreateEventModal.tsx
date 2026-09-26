import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';

// Описываем типы полей, которые придут из формы
export interface CreateEventFormValues {
  title: string;
  description: string;
  date: Dayjs; // Компонент DatePicker возвращает объект Dayjs
  locationName: string;
}

interface CreateEventModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateEventFormValues) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = (): void => {
    form.submit(); // При клике на "Создать" триггерим отправку формы
  };

  const handleFinish = (values: CreateEventFormValues): void => {
    onSubmit(values);
    form.resetFields(); // Очищаем поля формы после успешной отправки
  };

  return (
    <Modal
      title="Создать новое спортивное событие"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Создать"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish} 
        style={{ marginTop: '16px' }}
      >
        <Form.Item 
          label="Название события" 
          name="title" 
          rules={[{ required: true, message: 'Введите название!' }]}
        >
          <Input placeholder="Например: Футбольный матч 5х5" />
        </Form.Item>

        <Form.Item 
          label="Описание" 
          name="description" 
          rules={[{ required: true, message: 'Добавьте описание!' }]}
        >
          <Input.TextArea placeholder="Где собираетесь, какой инвентарь брать..." rows={3} />
        </Form.Item>

        <Form.Item 
          label="Дата и время" 
          name="date" 
          rules={[{ required: true, message: 'Выберите дату!' }]}
        >
          <DatePicker 
            showTime 
            format="DD.MM.YYYY HH:mm" 
            style={{ width: '100%' }} 
            placeholder="Выберите день и время" 
          />
        </Form.Item>

        <Form.Item 
          label="Место проведения (текст)" 
          name="locationName" 
          rules={[{ required: true, message: 'Укажите адрес!' }]}
        >
          <Input placeholder="Например: Сквер комсомольцев, площадка №1" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
