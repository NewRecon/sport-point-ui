import React from 'react';
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd'; // Добавили InputNumber
import type { Dayjs } from 'dayjs';

export interface CreateEventFormValues {
  title: string;
  description: string;
  date: Dayjs;
  locationName: string;
  totalParticipants: number;
}

interface CreateEventModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateEventFormValues) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = (): void => {
    form.submit();
  };

  const handleFinish = (values: CreateEventFormValues): void => {
    onSubmit(values);
    form.resetFields();
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
          label="Место проведения (адрес)" 
          name="locationName" 
          rules={[{ required: true, message: 'Укажите адрес!' }]}
        >
          <Input placeholder="Например: Сквер комсомольцев, площадка №1" />
        </Form.Item>

        <Form.Item 
          label="Максимум участников" 
          name="totalParticipants" 
          rules={[{ required: true, message: 'Укажите максимальное количество участников!' }]}
          initialValue={10} // Значение по умолчанию
        >
          <InputNumber 
            min={2} 
            max={100} 
            style={{ width: '100%' }} 
            placeholder="Например: 10" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
