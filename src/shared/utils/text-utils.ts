import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from '../config';

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const truncateTitle = (text: string): string => {
  return truncateText(text, TITLE_MAX_LENGTH);
};

export const truncateContent = (text: string): string => {
  return truncateText(text, CONTENT_MAX_LENGTH);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });
};
