import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Note, ServiceType, ProjectStatus, Country, NoteTag } from '../types';

type ClientContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'notes'>) => void;
  updateClient: (id: number, client: Omit<Client, 'id' | 'notes'>) => void;
  deleteClient: (id: number) => void;
  addNote: (clientId: number, note: Omit<Note, 'id' | 'clientId'>) => void;
  updateNote: (clientId: number, noteId: number, note: Omit<Note, 'id' | 'clientId'>) => void;
  deleteNote: (clientId: number, noteId: number) => void;
  exportToCSV: () => { data: any[]; headers: { label: string; key: string }[] };
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (client: Omit<Client, 'id' | 'notes'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now(),
      notes: []
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: number, updatedClient: Omit<Client, 'id' | 'notes'>) => {
    setClients(
      clients.map((client) => {
        if (client.id === id) {
          return { ...client, ...updatedClient };
        }
        return client;
      })
    );
  };

  const deleteClient = (id: number) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  const addNote = (clientId: number, note: Omit<Note, 'id' | 'clientId'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now(),
      clientId
    };

    setClients(
      clients.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            notes: [...client.notes, newNote]
          };
        }
        return client;
      })
    );
  };

  const updateNote = (clientId: number, noteId: number, updatedNote: Omit<Note, 'id' | 'clientId'>) => {
    setClients(
      clients.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            notes: client.notes.map((note) => {
              if (note.id === noteId) {
                return {
                  ...note,
                  ...updatedNote
                };
              }
              return note;
            })
          };
        }
        return client;
      })
    );
  };

  const deleteNote = (clientId: number, noteId: number) => {
    setClients(
      clients.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            notes: client.notes.filter((note) => note.id !== noteId)
          };
        }
        return client;
      })
    );
  };

  const exportToCSV = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Nombre del Cliente', key: 'name' },
      { label: 'Servicios', key: 'services' },
      { label: 'Servicio Personalizado', key: 'customService' },
      { label: 'Fecha de Necesidad', key: 'needDate' },
      { label: 'Fecha de Envío', key: 'sentDate' },
      { label: 'Estado', key: 'status' },
      { label: 'País', key: 'country' },
      { label: 'Moneda', key: 'currency' },
      { label: 'Monto Único', key: 'oneTimeAmount' },
      { label: 'Monto Mensual', key: 'monthlyAmount' }
    ];

    const data = clients.map((client) => ({
      id: client.id,
      name: client.name,
      services: client.services.map((service) => service.name).join(', '),
      customService: client.customService || '',
      needDate: client.needDate,
      sentDate: client.sentDate,
      status: client.status,
      country: client.country.name,
      currency: client.currency,
      oneTimeAmount: client.oneTimeAmount,
      monthlyAmount: client.monthlyAmount
    }));

    return { data, headers };
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        addNote,
        updateNote,
        deleteNote,
        exportToCSV
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};