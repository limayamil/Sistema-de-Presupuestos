import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import ClientForm from '../components/ClientForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EditClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, updateClient } = useClients();
  const navigate = useNavigate();

  const clientId = parseInt(id || '0', 10);
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Cliente no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">El cliente que intentas editar no existe.</p>
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

  const handleSubmit = (data: any) => {
    updateClient(clientId, data);
    toast.success('Cliente actualizado correctamente');
    navigate('/clients');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Editar Cliente: {client.name}</h1>
      </div>

      <ClientForm onSubmit={handleSubmit} initialData={client} isEditing />
    </div>
  );
};

export default EditClientPage;