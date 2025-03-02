import React, { useState } from 'react';
import { useClients } from '../context/ClientContext';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { format, parseISO, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';

const ReportsPage: React.FC = () => {
  const { clients } = useClients();
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());

  // Status distribution
  const statusCounts = clients.reduce(
    (acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Country distribution
  const countryCounts = clients.reduce(
    (acc, client) => {
      const countryName = client.country.name;
      acc[countryName] = (acc[countryName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Services distribution
  const serviceCounts = clients.reduce(
    (acc, client) => {
      client.services.forEach((service) => {
        acc[service.name] = (acc[service.name] || 0) + 1;
      });
      if (client.customService) {
        acc[client.customService] = (acc[client.customService] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Monthly data for the selected year
  const monthlyData = Array(12)
    .fill(0)
    .map((_, index) => {
      const monthClients = clients.filter((client) => {
        const date = parseISO(client.sentDate);
        return getMonth(date) === index && getYear(date) === yearFilter;
      });

      return {
        month: format(new Date(yearFilter, index), 'MMMM', { locale: es }),
        count: monthClients.length,
        accepted: monthClients.filter((c) => c.status === 'ACCEPTED').length,
        lost: monthClients.filter((c) => c.status === 'LOST').length,
        pending: monthClients.filter(
          (c) => c.status === 'PENDING' || c.status === 'SENT' || c.status === 'IN_NEGOTIATION'
        ).length
      };
    });

  // Calculate total amounts
  const totalOneTimeAmount = clients
    .filter((client) => client.status === 'ACCEPTED')
    .reduce((sum, client) => sum + client.oneTimeAmount, 0);

  const totalMonthlyAmount = clients
    .filter((client) => client.status === 'ACCEPTED')
    .reduce((sum, client) => sum + client.monthlyAmount, 0);

  // Calculate conversion rate
  const totalProposals = clients.length;
  const acceptedProposals = clients.filter((client) => client.status === 'ACCEPTED').length;
  const conversionRate = totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;

  // Available years for filtering
  const availableYears = Array.from(
    new Set(clients.map((client) => getYear(parseISO(client.sentDate))))
  ).sort((a, b) => b - a);

  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Presupuestos</p>
              <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasa de Conversión</p>
              <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <PieChart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Únicos</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalOneTimeAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Mensuales</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalMonthlyAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Distribución por Estado</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    status === 'ACCEPTED'
                      ? 'bg-green-500'
                      : status === 'LOST'
                      ? 'bg-red-500'
                      : status === 'SENT'
                      ? 'bg-blue-500'
                      : status === 'PENDING'
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'ACCEPTED'
                        ? 'Aceptado'
                        : status === 'LOST'
                        ? 'Perdido'
                        : status === 'SENT'
                        ? 'Enviado'
                        : status === 'PENDING'
                        ? 'Pendiente'
                        : 'En Negociación'}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'ACCEPTED'
                          ? 'bg-green-500'
                          : status === 'LOST'
                          ? 'bg-red-500'
                          : status === 'SENT'
                          ? 'bg-blue-500'
                          : status === 'PENDING'
                          ? 'bg-yellow-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${(count / clients.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Distribución por País</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(countryCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([country, count], index) => (
                <div key={country} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 bg-blue-${500 - index * 100 > 0 ? 500 - index * 100 : 500}`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{country}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full bg-blue-${500 - index * 100 > 0 ? 500 - index * 100 : 500}`}
                        style={{ width: `${(count / clients.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Distribución por Servicio</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(serviceCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([service, count], index) => (
                <div key={service} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 bg-green-${500 - index * 100 > 0 ? 500 - index * 100 : 500}`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{service}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full bg-green-${500 - index * 100 > 0 ? 500 - index * 100 : 500}`}
                        style={{
                          width: `${(count / Object.values(serviceCounts).reduce((a, b) => a + b, 0)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Presupuestos por Mes ({yearFilter})</h2>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value, 10))}
              className="text-sm border-gray-300 rounded-md"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{data.month}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {data.accepted > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          {data.accepted} aceptados
                        </span>
                      )}
                      {data.pending > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                          {data.pending} pendientes
                        </span>
                      )}
                      {data.lost > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                          {data.lost} perdidos
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{data.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                    <div className="flex h-2">
                      <div
                        className="h-2 bg-green-500"
                        style={{
                          width: `${data.count > 0 ? (data.accepted / data.count) * 100 : 0}%`
                        }}
                      ></div>
                      <div
                        className="h-2 bg-yellow-500"
                        style={{
                          width: `${data.count > 0 ? (data.pending / data.count) * 100 : 0}%`
                        }}
                      ></div>
                      <div
                        className="h-2 bg-red-500"
                        style={{
                          width: `${data.count > 0 ? (data.lost / data.count) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;