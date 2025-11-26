interface ErrorFallbackProps {
  error: Error;
}
export const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div className="error-message">
    <p>Ошибка при отображении содержимого заметки: {error.message}</p>
  </div>
);
