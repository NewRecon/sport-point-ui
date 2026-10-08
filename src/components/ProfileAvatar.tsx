import React, { useState } from 'react';
import { Avatar, Upload, message, Tooltip } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { profileService } from '../api/profileService';

const RUSTFS_URL = import.meta.env.VITE_RUSTFS_URL as string;
const BUCKET = 'avatars';

interface ProfileAvatarProps {
  objectName?: string | null;
  editable: boolean;
  onUploaded: (objectName: string) => void;
  size?: number;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  objectName,
  editable,
  onUploaded,
  size = 120,
}) => {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const avatarSrc =
    localPreview ?? (objectName ? `${RUSTFS_URL}/${BUCKET}/${objectName}` : undefined);

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Можно загружать только изображения');
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 >= 10) {
      message.error('Файл должен быть меньше 10 МБ');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    try {
      const newObjectName = await profileService.uploadAvatar(file as File);
      setLocalPreview(URL.createObjectURL(file as File));
      onUploaded(newObjectName);
      message.success('Аватар обновлён');
      onSuccess?.({});
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Не удалось загрузить аватар');
      onError?.(e as Error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{ position: 'relative', width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Avatar
          size={size}
          src={avatarSrc}
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1677ff' }}
        />

        {editable && (
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
          >
            <Tooltip title="Загрузить аватар">
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: hovered || uploading ? 1 : 0,
                  transition: 'opacity 0.2s',
                  color: '#fff',
                  fontSize: size * 0.3,
                }}
              >
                <CameraOutlined spin={uploading} />
              </div>
            </Tooltip>
          </Upload>
        )}
      </div>
    </div>
  );
};