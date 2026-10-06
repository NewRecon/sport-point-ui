import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { Dayjs } from 'dayjs';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';
import type { CreateEventFormValues } from '../components/CreateEventModal';

type DateRangeType = [Dayjs | null, Dayjs | null];

export interface MapEventsDataResult {
  loading: boolean;
  events: EventData[];
  isModalOpen: boolean;
  selectedCoords: [number, number] | null;
  selectedCategory: string | null;
  dateRange: DateRangeType | null;
  address: string;
  loadingAddress: boolean;
  setIsModalOpen: (open: boolean) => void;
  setSelectedCoords: (coords: [number, number] | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setDateRange: (dates: DateRangeType | null) => void;
  setAddress: (address: string) => void;
  handleCreateSubmit: (values: CreateEventFormValues) => Promise<void>;
  openModalWithDefaultCoords: () => Promise<void>;
  openModalWithCoords: () => Promise<void>;
}

export const useMapEventsData = (): MapEventsDataResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const [address, setAddress] = useState<string>('');
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    const fetchFilteredData = async () => {
      try {
        setLoading(true);
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

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const params = [
        'format=jsonv2',
        'lat=' + lat,
        'lon=' + lng,
        'accept-language=ru'
      ];

      const queryString = params.join('&');

      const openstreetmapUrl = 'https://nominatim.openstreetmap.org/reverse?' + queryString;

      const response = await fetch(openstreetmapUrl.toString(), {
        headers: { 'User-Agent': 'SportsEventApp/1.0' }
      });

      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || '';
        const road = data.address.road || '';
        const houseNumber = data.address.house_number || '';

        const addressParts = [city, road, houseNumber].filter(Boolean);
        setAddress(addressParts.join(', ') || data.display_name);
      } else {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (error) {
      console.error('Ошибка обратного геокодирования:', error);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  const openModalWithCoords = async (): Promise<void> => {
    if (!selectedCoords) return;
    setIsModalOpen(true);
    await fetchAddressFromCoords(selectedCoords[0], selectedCoords[1]);
  };

  const openModalWithDefaultCoords = async (): Promise<void> => {
    const defaultCoords: [number, number] = [47.222480, 39.718577];
    setSelectedCoords(defaultCoords);
    setIsModalOpen(true);
    await fetchAddressFromCoords(defaultCoords[0], defaultCoords[1]);
  };

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
        isCreatorParticipant: values.isCreatorParticipant,
      };

      await eventService.createEvent(newEvent);
      message.success('Событие успешно создано!');
      setIsModalOpen(false);
      setSelectedCoords(null);
      setAddress('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось создать событие';
      message.error(errorMessage);
    }
  };

  return {
    loading,
    events,
    isModalOpen,
    selectedCoords,
    selectedCategory,
    dateRange,
    address,
    loadingAddress,
    setIsModalOpen,
    setSelectedCoords,
    setSelectedCategory,
    setDateRange,
    setAddress,
    handleCreateSubmit,
    openModalWithDefaultCoords,
    openModalWithCoords,
  };
};