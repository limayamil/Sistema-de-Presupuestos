import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Note, NoteTag, NOTE_TAG_OPTIONS } from '../types';

type NoteFormProps = {
  onSubmit: (data: Omit<Note, 'id' | 'clientId'>) => void;
  initialData?: Omit<Note, 'clientId'>;
  isEditing?: boolean;
};

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>(initialData?.tags || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Omit<Note, 'id' | 'clientId'>>({
    defaultValues: initialData || {
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      content: '',
      tags: []
    }
  });

  const handleTagChange = (tag: NoteTag, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const handleFormSubmit = (data: Omit<Note, 'id' | 'clientId'>) => {
    const formData = {
      ...data,
      tags: selectedTags
    };
    onSubmit(formData);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link'
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'El título es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'La fecha es requerida' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
          <div className="space-y-2 p-2 border border-gray-300 rounded-md">
            {NOTE_TAG_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${option.value}`}
                  checked={selectedTags.includes(option.value)}
                  onChange={(e) => handleTagChange(option.value, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`tag-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'El contenido es requerido' }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={field.value}
                onChange={field.onChange}
                className="h-64"
              />
            )}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Actualizar Nota' : 'Agregar Nota'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;