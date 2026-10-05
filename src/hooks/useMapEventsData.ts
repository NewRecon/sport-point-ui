import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { Dayjs } from 'dayjs';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';
import type { CreateEventFormValues } from '../components/CreateEventModal';

// Четкий и понятный тип для диапазона дат без внутренних дженериков antd
type DateRangeType = [Dayjs | null, Dayjs | null];

export const useMapEventsData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  // Стейты фильтров
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        
        // Извлекаем элементы строго по индексам массива
        const startDayjs = dateRange && dateRange[0] ? dateRange[0] : null;
        const endDayjs = dateRange && dateRange[1] ? dateRange[1] : null;

        const filters = {
          category: selectedCategory,
          dateFrom: startDayjs ? startDayjs.startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
          dateTo: endDayjs ? endDayjs.endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
        };

        const data = await eventService.getAllEvents(filters);
        
        if (!ignore) {
          setEvents(data);
        }
      } catch (error) {
        if (!ignore) {
          const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных';
          message.error(errorMessage);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchFilteredData();

    return () => {
      ignore = true;
    };
  }, [selectedCategory, dateRange, refreshTrigger]);

  const handleCreateSubmit = async (values: CreateEventFormValues): Promise<void> => {
    const [latitude, longitude] = selectedCoords || [47.222480, 39.718577];

    try {
      const newEvent = {
        title: values.title,
        description: values.description,
        date: values.date.format('YYYY-MM-DDTHH:mm:ss'),
        category: values.category,
        locationName: values.locationName,
        latitude,
        longitude,
        totalParticipants: values.totalParticipants,
        currentParticipants: 0
      };

      await eventService.createEvent(newEvent);
      message.success('Событие успешно создано!');
      setIsModalOpen(false);
      setSelectedCoords(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось создать событие';
      message.error(errorMessage);
    }
  };

  const openModalWithDefaultCoords = (): void => {
    setSelectedCoords([47.222480, 39.718577]);
    setIsModalOpen(true);
  };

  return {
    loading,
    events,
    isModalOpen,
    selectedCoords,
    selectedCategory,
    dateRange,
    setIsModalOpen,
    setSelectedCoords,
    setSelectedCategory,
    setDateRange,
    handleCreateSubmit,
    openModalWithDefaultCoords,
  };
};
