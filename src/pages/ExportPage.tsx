import React from 'react';
import { useClients } from '../context/ClientContext';
import { CSVLink } from 'react-csv';
import { FileText, Download } from 'lucide-react';

const ExportPage: React.FC = () => {
  const { exportToCSV } = useClients();
  const { data, headers } = exportToCSV();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportar Datos</h2>
        <p className="text-gray-600 mb-6">
          Exporta todos los datos de presupuestos a un archivo CSV que podrás abrir en Excel, Google Sheets u otras
          aplicaciones de hojas de cálculo.
        </p>

        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Archivo CSV listo para descargar</h3>
            <p className="mt-1 text-sm text-gray-500">Contiene {data.length} registros de presupuestos</p>
            <div className="mt-6">
              <CSVLink
                data={data}
                headers={headers}
                filename="nicea_presupuestos.csv"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar CSV
              </CSVLink>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-md font-medium text-gray-900 mb-2">Información incluida en el archivo:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>ID del cliente</li>
            <li>Nombre del cliente</li>
            <li>Servicios contratados</li>
            <li>Servicios personalizados</li>
            <li>Fecha de necesidad</li>
            <li>Fecha de envío del presupuesto</li>
            <li>Estado del proyecto</li>
            <li>País del cliente</li>
            <li>Moneda utilizada</li>
            <li>Monto único</li>
            <li>Monto mensual</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Las notas asociadas a cada cliente no se incluyen en este archivo CSV. Para exportar
            notas específicas, visita la página de notas del cliente correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;