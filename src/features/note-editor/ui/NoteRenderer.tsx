import ReactMarkdown from 'react-markdown';
import { remarkPlugins } from '@/shared/config';
import { LinkComponent } from '@/shared/components/LinkComponent';

interface NoteRendererProps {
  content: string;
}

export const NoteRenderer = ({ content }: NoteRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={{
        a: LinkComponent,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
