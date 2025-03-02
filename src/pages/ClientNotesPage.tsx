import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import { ArrowLeft, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Note, NoteTag, NOTE_TAG_OPTIONS } from '../types';

const ClientNotesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, addNote, updateNote, deleteNote } = useClients();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [tagFilter, setTagFilter] = useState<NoteTag | null>(null);

  const clientId = parseInt(id || '0', 10);
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Cliente no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">El cliente que buscas no existe.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }

  const handleAddNote = (data: Omit<Note, 'id' | 'clientId'>) => {
    addNote(clientId, data);
    setShowForm(false);
    toast.success('Nota agregada correctamente');
  };

  const handleUpdateNote = (data: Omit<Note, 'id' | 'clientId'>) => {
    if (editingNote) {
      updateNote(clientId, editingNote.id, data);
      setEditingNote(null);
      toast.success('Nota actualizada correctamente');
    }
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      deleteNote(clientId, noteId);
      toast.success('Nota eliminada correctamente');
    }
  };

  const handleEditNote = (noteId: number) => {
    const note = client.notes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(note);
      setShowForm(true);
    }
  };

  const filteredNotes = tagFilter
    ? client.notes.filter((note) => note.tags.includes(tagFilter))
    : client.notes;

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notas de {client.name}</h1>
          <p className="text-sm text-gray-500">
            {client.notes.length} {client.notes.length === 1 ? 'nota' : 'notas'} registradas
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {NOTE_TAG_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setTagFilter(tagFilter === option.value ? null : option.value)}
              className={`px-3 py-1 text-sm rounded-full ${
                tagFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
              {tagFilter === option.value && <X className="inline-block ml-1 h-3 w-3" />}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setEditingNote(null);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Nueva Nota
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingNote ? 'Editar Nota' : 'Nueva Nota'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingNote(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <NoteForm
            onSubmit={editingNote ? handleUpdateNote : handleAddNote}
            initialData={editingNote || undefined}
            isEditing={!!editingNote}
          />
        </div>
      )}

      {sortedNotes.length > 0 ? (
        <div className="space-y-6">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No hay notas registradas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {tagFilter
              ? 'No hay notas con el filtro seleccionado'
              : 'Comienza agregando una nueva nota para este cliente'}
          </p>
          {!tagFilter && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingNote(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Nueva Nota
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientNotesPage;