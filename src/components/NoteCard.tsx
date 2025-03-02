import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
import { Note, NOTE_TAG_OPTIONS } from '../types';
import clsx from 'clsx';

type NoteCardProps = {
  note: Note;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'MEETING':
        return 'bg-blue-100 text-blue-800';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-800';
      case 'FOLLOW_UP':
        return 'bg-green-100 text-green-800';
      case 'NEGOTIATION':
        return 'bg-purple-100 text-purple-800';
      case 'IMPORTANT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={clsx('bg-white rounded-lg shadow-sm overflow-hidden', 
      note.tags.includes('IMPORTANT') && 'border-l-4 border-red-500')}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
            <p className="text-sm text-gray-500">
              {format(parseISO(note.date), 'dd MMMM yyyy', { locale: es })}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => {
              const tagLabel = NOTE_TAG_OPTIONS.find((option) => option.value === tag)?.label || tag;
              return (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
                >
                  {tagLabel}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>

      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(note.id)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
        >
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-sm text-red-600 hover:text-red-800 flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NoteCard;