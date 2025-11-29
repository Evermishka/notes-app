import { createTheme } from '@mantine/core';

export const theme = createTheme({
  // Цветовая палитра
  colors: {
    primary: [
      '#e7f0ff', // 0 - очень светлый
      '#c8d9ff', // 1
      '#9bbfff', // 2
      '#6da4ff', // 3
      '#3f8bff', // 4
      '#0B64F4', // 5 - основной primary
      '#094fcc', // 6 - hover (затемнить на 15%)
      '#0636a6', // 7 - active (затемнить на 30%)
      '#042680', // 8
      '#021350', // 9 - самый тёмный
    ],
    secondary: [
      '#e8f8f0', // 0 - очень светлый
      '#c8f0d8', // 1
      '#a8e8c0', // 2
      '#7ddfa5', // 3
      '#52d689', // 4
      '#00C853', // 5 - основной secondary (более яркий зеленый)
      '#00b845', // 6 - hover (затемнить на 15%)
      '#00a238', // 7 - active (затемнить на 30%)
      '#008c2d', // 8
      '#006622', // 9 - самый тёмный
    ],
    danger: [
      '#fceaea', // 0 - очень светлый
      '#f7d0d0', // 1
      '#f1b7b7', // 2
      '#ea9c9c', // 3
      '#e28282', // 4
      '#D42525', // 5 - основной danger
      '#ba1f1f', // 6 - hover (затемнить на 15%)
      '#9f1919', // 7 - active (затемнить на 30%)
      '#851414', // 8
      '#6a0f0f', // 9 - самый тёмный
    ],
    neutral: [
      '#F3F4F6', // 0 - Neutral-Light (фон приложения)
      '#e8eaed', // 1
      '#d1d5db', // 2
      '#9ca3af', // 3
      '#808B99', // 4 - Neutral-Medium (разделители, плейсхолдеры)
      '#6b7280', // 5
      '#4b5563', // 6
      '#374151', // 7
      '#1F2937', // 8 - Neutral-Dark (основной текст)
      '#111827', // 9 - самый тёмный
    ],
  },

  // Основные цвета
  primaryColor: 'primary',
  primaryShade: 5,

  // Шрифты
  fontFamily: 'Manrope, sans-serif',

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '641px',
    md: '1025px',
  },

  // Радиусы скругления
  radius: {
    xs: '4px', // мелкие элементы
    sm: '8px', // инпуты, иконки в кнопках
    md: '12px', // кнопки, карточки
    lg: '16px', // контейнеры
    xl: '20px',
  },

  // Отступы
  spacing: {
    xs: '8px', // между элементами
    sm: '12px', // внутри блоков
    md: '16px', // отступы контейнеров
    lg: '20px', // между секциями
    xl: '24px', // внешние отступы
  },

  // Типография
  fontSizes: {
    xs: '12px', // Small
    sm: '14px', // Button text
    md: '16px', // Body
    lg: '18px', // H3 tablet
    xl: '20px', // H3 desktop
    '2xl': '22px', // H2 tablet
    '3xl': '24px', // H1 mobile, H2 mobile
    '4xl': '26px', // H2 desktop
    '5xl': '28px', // H1 tablet
    '6xl': '32px', // H1 desktop
  },

  // Высота строк
  lineHeights: {
    xs: '1.2', // H1
    sm: '1.3', // H2
    md: '1.4', // H3, Small
    lg: '1.5', // Body
  },

  // Размеры компонентов
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
      styles: {
        root: {
          height: '48px', // Touch-friendly
        },
      },
    },

    Input: {
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
      styles: {
        input: {
          borderColor: 'var(--mantine-color-neutral-4)',
          '&:focus': {
            borderColor: 'var(--mantine-color-primary-5)',
          },
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'sm',
      },
    },

    ActionIcon: {
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
    },

    Burger: {
      defaultProps: {
        size: 'md',
      },
    },
  },

  // Другие настройки
  focusRing: 'auto',
  respectReducedMotion: true,

  // Состояния для интерактивных элементов
  activeClassName: 'mantine-active',
  focusClassName: 'mantine-focus',
});

export type AppTheme = typeof theme;
