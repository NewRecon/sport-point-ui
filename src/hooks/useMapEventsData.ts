import { useState, useEffect } from 'react';
import { message } from 'antd';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';
import type { CreateEventFormValues } from '../components/CreateEventModal';

export const useMapEventsData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const refreshEventsList = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления данных';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await eventService.getAllEvents();
        if (isMounted) setEvents(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных';
        message.error(errorMessage);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleCreateSubmit = async (values: CreateEventFormValues): Promise<void> => {
    const [latitude, longitude] = selectedCoords || [47.222480, 39.718577];

    try {
      const newEvent = {
        title: values.title,
        description: values.description,
        date: values.date.format('DD.MM.YYYY HH:mm'),
        locationName: values.locationName,
        latitude,
        longitude
      };

      await eventService.createEvent(newEvent);
      message.success('Событие успешно создано!');
      setIsModalOpen(false);
      setSelectedCoords(null);
      await refreshEventsList();
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
    setIsModalOpen,
    setSelectedCoords,
    handleCreateSubmit,
    openModalWithDefaultCoords,
  };
};
