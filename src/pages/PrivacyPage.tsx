import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card
        style={{
          width: 800,
          maxWidth: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/auth')}
            style={{ padding: 0 }}
          >
            Ко входу
          </Button>

          <Title level={2} style={{ margin: 0 }}>
            Политика конфиденциальности
          </Title>

          <Paragraph type="secondary">
            Дата последнего обновления: 01.01.2025
          </Paragraph>

          <Title level={4}>1. Общие положения</Title>
          <Paragraph>
            Настоящая Политика конфиденциальности описывает, как
            приложение «Sport Point» (далее — «Приложение») собирает,
            использует и защищает персональные данные пользователей.
          </Paragraph>
          <Paragraph>
            Используя Приложение и регистрируясь в нём, вы соглашаетесь
            с условиями настоящей Политики и даёте согласие на обработку
            своих персональных данных в соответствии с Федеральным законом
            от 27.07.2006 № 152-ФЗ «О персональных данных».
          </Paragraph>

          <Title level={4}>2. Какие данные мы собираем</Title>
          <Paragraph>
            В процессе регистрации и использования Приложения мы можем
            собирать следующие данные:
          </Paragraph>
          <ul>
            <li>имя (отображаемое имя);</li>
            <li>логин;</li>
            <li>адрес электронной почты;</li>
            <li>геолокация (при создании спортивных событий на карте);</li>
            <li>данные о созданных и посещённых событиях.</li>
          </ul>

          <Title level={4}>3. Цели обработки данных</Title>
          <Paragraph>
            Персональные данные обрабатываются исключительно для:
          </Paragraph>
          <ul>
            <li>предоставления доступа к функционалу Приложения;</li>
            <li>отображения информации о спортивных событиях;</li>
            <li>связи с вами по вопросам работы Приложения;</li>
            <li>улучшения качества сервиса.</li>
          </ul>

          <Title level={4}>4. Передача данных третьим лицам</Title>
          <Paragraph>
            Мы не передаём ваши персональные данные третьим лицам,
            за исключением случаев, предусмотренных законодательством РФ.
          </Paragraph>

          <Title level={4}>5. Защита данных</Title>
          <Paragraph>
            Мы принимаем необходимые организационные и технические меры
            для защиты персональных данных от неправомерного доступа,
            уничтожения, изменения, блокирования и иных неправомерных действий.
          </Paragraph>

          <Title level={4}>6. Права пользователя</Title>
          <Paragraph>Вы имеете право:</Paragraph>
          <ul>
            <li>запросить информацию об обработке ваших персональных данных;</li>
            <li>потребовать уточнения, блокирования или уничтожения данных;</li>
            <li>отозвать согласие на обработку персональных данных.</li>
          </ul>
          <Paragraph>
            Для реализации своих прав свяжитесь с нами по адресу:{' '}
            <Text code>support@sportpoint.local</Text>
          </Paragraph>

          <Title level={4}>7. Изменения в политике</Title>
          <Paragraph>
            Мы оставляем за собой право изменять настоящую Политику.
            Актуальная версия всегда доступна на этой странице.
            Продолжение использования Приложения после изменений означает
            согласие с новой редакцией.
          </Paragraph>

        </Space>
      </Card>
    </div>
  );
};

export default PrivacyPage;