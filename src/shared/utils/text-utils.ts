import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from '../config';

export const stripMarkdown = (text: string): string => {
  return (
    text
      // Удаляем заголовки
      .replace(/^#{1,6}\s+/gm, '')
      // Удаляем жирный текст
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      // Удаляем курсив
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Удаляем зачеркнутый текст
      .replace(/~~(.*?)~~/g, '$1')
      // Удаляем инлайн код
      .replace(/`([^`]+)`/g, '$1')
      // Удаляем блоки кода
      .replace(/```[\s\S]*?```/g, '')
      // Удаляем ссылки, оставляем текст
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Удаляем изображения
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Удаляем маркеры списков
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // Удаляем нумерованные списки
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Удаляем цитаты
      .replace(/^>\s+/gm, '')
      // Удаляем горизонтальные линии
      .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '')
      // Удаляем лишние пробелы и переводы строк
      .replace(/\n+/g, ' ')
      .trim()
  );
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const truncateTitle = (text: string): string => {
  return truncateText(text, TITLE_MAX_LENGTH);
};

export const truncateContent = (text: string): string => {
  const plainText = stripMarkdown(text);
  return truncateText(plainText, CONTENT_MAX_LENGTH);
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
