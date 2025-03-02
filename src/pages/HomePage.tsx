import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import { BarChart3, DollarSign, Users, FileText, PlusCircle } from 'lucide-react';
import { format, parseISO, isAfter, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

const HomePage: React.FC = () => {
  const { clients } = useClients();

  const totalClients = clients.length;
  const acceptedClients = clients.filter((client) => client.status === 'ACCEPTED').length;
  const pendingClients = clients.filter((client) => client.status === 'PENDING' || client.status === 'SENT' || client.status === 'IN_NEGOTIATION').length;
  const lostClients = clients.filter((client) => client.status === 'LOST').length;

  const totalOneTimeAmount = clients
    .filter((client) => client.status === 'ACCEPTED')
    .reduce((sum, client) => sum + client.oneTimeAmount, 0);

  const totalMonthlyAmount = clients
    .filter((client) => client.status === 'ACCEPTED')
    .reduce((sum, client) => sum + client.monthlyAmount, 0);

  const recentClients = [...clients]
    .sort((a, b) => {
      return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
    })
    .slice(0, 5);

  const recentNotes = clients
    .flatMap((client) =>
      client.notes.map((note) => ({
        ...note,
        clientName: client.name,
        clientId: client.id
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const today = new Date();
  const recentActivity = isAfter(today, subDays(today, 7)) ? clients.length > 0 : false;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{totalClients}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">{acceptedClients} aceptados</span>
              <span className="text-yellow-600">{pendingClients} pendientes</span>
              <span className="text-red-600">{lostClients} perdidos</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Únicos</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalOneTimeAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">De proyectos aceptados</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Mensuales</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalMonthlyAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Recurrentes</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Actividad Reciente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {recentActivity ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Últimos 7 días</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Clientes Recientes</h2>
            <Link to="/clients" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todos
            </Link>
          </div>
          {recentClients.length > 0 ? (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(client.sentDate), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'LOST'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {client.status === 'ACCEPTED'
                        ? 'Aceptado'
                        : client.status === 'LOST'
                        ? 'Perdido'
                        : client.status === 'SENT'
                        ? 'Enviado'
                        : client.status === 'PENDING'
                        ? 'Pendiente'
                        : 'En Negociación'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay clientes registrados</p>
              <Link
                to="/clients/new"
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Agregar cliente
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Notas Recientes</h2>
          </div>
          {recentNotes.length > 0 ? (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="p-3 hover:bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(note.date), 'dd MMM', { locale: es })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Cliente: <Link to={`/clients/${note.clientId}/notes`} className="text-blue-600 hover:underline">{note.clientName}</Link>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          tag === 'MEETING'
                            ? 'bg-blue-100 text-blue-800'
                            : tag === 'REMINDER'
                            ? 'bg-yellow-100 text-yellow-800'
                            : tag === 'IMPORTANT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tag === 'MEETING'
                          ? 'Reunión'
                          : tag === 'REMINDER'
                          ? 'Recordatorio'
                          : tag === 'FOLLOW_UP'
                          ? 'Seguimiento'
                          : tag === 'NEGOTIATION'
                          ? 'Negociación'
                          : tag === 'IMPORTANT'
                          ? 'Importante'
                          : 'General'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay notas registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;