import { ErrorBoundary } from 'react-error-boundary';
import { useNoteState } from '@/entities/note';
import { ErrorFallback } from '@/shared/components';
import { logError } from '@/shared/utils';
import { NoteRenderer } from './NoteRenderer';

export const NoteViewer = () => {
  const state = useNoteState();

  if (!state.selectedNote) {
    return null;
  }

  return (
    <div className="note-viewer">
      <div className="prose prose-sm max-w-none">
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
          <NoteRenderer content={state.selectedNote.content} />
        </ErrorBoundary>
      </div>
    </div>
  );
};
