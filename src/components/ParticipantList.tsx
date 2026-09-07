import React from 'react';
import { List, Avatar, Typography } from 'antd';
import type { Participant } from '../api/eventService';

const { Text } = Typography;

interface ParticipantListProps {
  items: Participant[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ items }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={items}
      renderItem={(user) => (
        <List.Item>
          <List.Item.Meta
            /* Вместо картинки выводим первую букву имени пользователя */
            avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{user.name[0]?.toUpperCase()}</Avatar>}
            title={<Text strong>{user.name}</Text>}
            description={user.email}
          />
        </List.Item>
      )}
    />
  );
};
