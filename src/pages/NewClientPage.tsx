import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import ClientForm from '../components/ClientForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const NewClientPage: React.FC = () => {
  const { addClient } = useClients();
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    addClient(data);
    toast.success('Cliente agregado correctamente');
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
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h1>
      </div>

      <ClientForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewClientPage;