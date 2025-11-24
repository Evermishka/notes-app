import { useNotesSelectors } from '../model/use-notes-selectors';
import type { Note } from '@/entities/note';

export const NotesList = () => {
  const { allNotes } = useNotesSelectors();

  return (
    <div className="notes-list">
      <h2>Список заметок</h2>
      <ul>
        {allNotes.map((note: Note) => (
          <li key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>
              {note.content.slice(0, 100)}
              {note.content.length > 100 ? '...' : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
