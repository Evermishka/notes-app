import { ErrorBoundary } from 'react-error-boundary';
import { useNotesSelectors } from '@/features/notes-crud';
import { NoteRenderer } from './NoteRenderer';
import { ErrorFallback } from '@/shared/components';
import { logError } from '@/shared/utils';

export const NoteViewer = () => {
  const { currentSelectedNote } = useNotesSelectors();

  if (!currentSelectedNote) {
    return null;
  }

  return (
    <div className="note-viewer">
      <div className="prose prose-sm max-w-none">
        {/* Обработка ошибок рендера Markdown */}
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
          <NoteRenderer content={currentSelectedNote.content} />
        </ErrorBoundary>
      </div>
    </div>
  );
};
