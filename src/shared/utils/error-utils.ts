import type { ErrorInfo } from 'react';

export const logError = (error: Error, errorInfo: ErrorInfo) => {
  console.error('Error rendering note content:', error, errorInfo);
};
