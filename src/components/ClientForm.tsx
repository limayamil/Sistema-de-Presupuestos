import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Client, SERVICES, COUNTRIES, PROJECT_STATUS_OPTIONS, ServiceType, Country, ProjectStatus } from '../types';

type ClientFormProps = {
  onSubmit: (data: Omit<Client, 'id' | 'notes'>) => void;
  initialData?: Omit<Client, 'notes'>;
  isEditing?: boolean;
};

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(initialData?.services || []);
  const [hasCustomService, setHasCustomService] = useState<boolean>(!!initialData?.customService);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(initialData?.country || null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Omit<Client, 'id' | 'notes'>>({
    defaultValues: initialData || {
      name: '',
      services: [],
      customService: '',
      needDate: format(new Date(), 'yyyy-MM-dd'),
      sentDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'PENDING',
      country: COUNTRIES[0],
      currency: 'USD',
      oneTimeAmount: 0,
      monthlyAmount: 0
    }
  });

  const watchCountry = watch('country');

  useEffect(() => {
    if (watchCountry && watchCountry !== selectedCountry) {
      setSelectedCountry(watchCountry);
      setValue('currency', watchCountry.currency);
    }
  }, [watchCountry, selectedCountry, setValue]);

  const handleServiceChange = (service: ServiceType, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  const handleFormSubmit = (data: Omit<Client, 'id' | 'notes'>) => {
    const formData = {
      ...data,
      services: selectedServices
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Cliente
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'El nombre del cliente es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servicios</label>
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
            {SERVICES.map((service) => (
              <div key={service.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={selectedServices.some((s) => s.id === service.id)}
                  onChange={(e) => handleServiceChange(service, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`service-${service.id}`} className="ml-2 text-sm text-gray-700">
                  {service.name}
                </label>
              </div>
            ))}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="custom-service"
                checked={hasCustomService}
                onChange={(e) => setHasCustomService(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="custom-service" className="ml-2 text-sm text-gray-700">
                Servicio Personalizado
              </label>
            </div>
            {hasCustomService && (
              <input
                type="text"
                {...register('customService')}
                placeholder="Especificar servicio"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <div>
          <label htmlFor="needDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Necesidad
          </label>
          <input
            id="needDate"
            type="date"
            {...register('needDate', { required: 'La fecha de necesidad es requerida' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.needDate && <p className="mt-1 text-sm text-red-600">{errors.needDate.message}</p>}
        </div>

        <div>
          <label htmlFor="sentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Envío
          </label>
          <input
            id="sentDate"
            type="date"
            {...register('sentDate', { required: 'La fecha de envío es requerida' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.sentDate && <p className="mt-1 text-sm text-red-600">{errors.sentDate.message}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado del Proyecto
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROJECT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            País
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ? JSON.stringify(field.value) : ''}
                onChange={(e) => {
                  const value = e.target.value ? JSON.parse(e.target.value) : null;
                  field.onChange(value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.id} value={JSON.stringify(country)}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              >
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="ARS">ARS (Peso Argentino)</option>
              </select>
            )}
          />
          <p className="mt-1 text-xs text-gray-500">La moneda se establece automáticamente según el país seleccionado</p>
        </div>

        <div>
          <label htmlFor="oneTimeAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto Único
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {selectedCountry?.currency === 'USD' ? '$' : selectedCountry?.currency === 'EUR' ? '€' : '$'}
              </span>
            </div>
            <input
              id="oneTimeAmount"
              type="number"
              step="0.01"
              min="0"
              {...register('oneTimeAmount', { valueAsNumber: true })}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto Mensual
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {selectedCountry?.currency === 'USD' ? '$' : selectedCountry?.currency === 'EUR' ? '€' : '$'}
              </span>
            </div>
            <input
              id="monthlyAmount"
              type="number"
              step="0.01"
              min="0"
              {...register('monthlyAmount', { valueAsNumber: true })}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Actualizar Cliente' : 'Agregar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;