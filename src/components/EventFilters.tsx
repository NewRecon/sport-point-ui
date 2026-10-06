import React from 'react';
import { Select, DatePicker, Button, Dropdown, Badge } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

type DateRangeType = [Dayjs | null, Dayjs | null];

const EVENT_CATEGORIES = [
    { value: 'EXERCISE', label: 'Тренировка' },
    { value: 'COMPETITION', label: 'Соревнование' },
    { value: 'GAME', label: 'Игра' },
    { value: 'MARATHON', label: 'Марафон' },
    { value: 'FESTIVAL', label: 'Фестиваль' },
];

interface EventFiltersProps {
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    dateRange: DateRangeType | null;
    onDateRangeChange: (dates: DateRangeType | null) => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
    selectedCategory,
    onCategoryChange,
    dateRange,
    onDateRangeChange,
}) => {
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCategoryChange(null);
        onDateRangeChange(null);
    };

    const hasFilters = selectedCategory !== null || dateRange !== null;
    const activeFiltersCount = [selectedCategory !== null, dateRange !== null].filter(Boolean).length;

    const dropdownContent = (
        <div
            style={{
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '280px'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Фильтрация событий</div>

            <div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Категория</div>
                <Select
                    placeholder="Выбрать категорию"
                    style={{ width: '100%' }}
                    allowClear
                    value={selectedCategory}
                    onChange={(value) => onCategoryChange(value || null)}
                    options={EVENT_CATEGORIES}
                />
            </div>

            <div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Диапазон дат</div>
                <RangePicker
                    placeholder={['С даты', 'По дату']}
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={(dates) => {
                        if (!dates) {
                            onDateRangeChange(null);
                        } else {
                            const startDate = dates[0] as unknown as Dayjs | null;
                            const endDate = dates[1] as unknown as Dayjs | null;
                            onDateRangeChange([startDate, endDate]);
                        }
                    }}
                />
            </div>

            {hasFilters && (
                <Button type="primary" danger ghost onClick={handleClear} style={{ marginTop: '4px' }}>
                    Сбросить все фильтры
                </Button>
            )}
        </div>
    );

    return (
        <Dropdown
            dropdownRender={() => dropdownContent}
            trigger={['click']}
            placement="bottomLeft"
        >
            <Badge count={activeFiltersCount} color="#1890ff" offset={[-2, 2]}>
                <Button
                    type={hasFilters ? "primary" : "default"}
                    icon={<FilterOutlined />}
                    size="large"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {hasFilters ? "Фильтры активны" : "Фильтры"}
                </Button>
            </Badge>
        </Dropdown>
    );
};
