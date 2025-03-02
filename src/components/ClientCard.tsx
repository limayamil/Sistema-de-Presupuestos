import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Trash2, FileText } from 'lucide-react';
import { Client, PROJECT_STATUS_OPTIONS } from '../types';

type ClientCardProps = {
  client: Client;
  onDelete: (id: number) => void;
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const statusLabel = PROJECT_STATUS_OPTIONS.find((option) => option.value === client.status)?.label || client.status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_NEGOTIATION':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.country.name}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
            {statusLabel}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Servicios:</span>
            <span className="text-gray-700">
              {client.services.map((s) => s.name).join(', ')}
              {client.customService && (client.services.length > 0 ? ', ' : '') + client.customService}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha de necesidad:</span>
            <span className="text-gray-700">
              {format(parseISO(client.needDate), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha de envío:</span>
            <span className="text-gray-700">
              {format(parseISO(client.sentDate), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Monto único:</span>
            <span className="text-gray-700 font-medium">
              {formatCurrency(client.oneTimeAmount, client.currency)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Monto mensual:</span>
            <span className="text-gray-700 font-medium">
              {formatCurrency(client.monthlyAmount, client.currency)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Notas:</span>
            <span className="text-gray-700">{client.notes.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 flex justify-between">
        <Link
          to={`/clients/${client.id}/notes`}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FileText className="w-4 h-4 mr-1" />
          Ver notas
        </Link>
        <div className="flex space-x-3">
          <Link
            to={`/clients/edit/${client.id}`}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Link>
          <button
            onClick={() => onDelete(client.id)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;