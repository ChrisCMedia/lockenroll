import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ClockIcon, UserIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { appointmentAPI, configAPI } from '../../utils/api';

const AdminAppointments = () => {
  // Zustand
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filter, setFilter] = useState({
    status: '',
    staffId: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Daten laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Terminplanerconfig laden (für Services und Mitarbeiter)
        const configRes = await configAPI.getConfig();
        setStaff(configRes.data.config.staff || []);
        
        // Termine für das ausgewählte Datum laden
        const fetchAppointments = async () => {
          const queryParams = { date: currentDate };
          
          // Filter hinzufügen, wenn gesetzt
          if (filter.status) queryParams.status = filter.status;
          if (filter.staffId) queryParams.staffId = filter.staffId;
          
          const appointmentsRes = await appointmentAPI.getAppointments(queryParams);
          setAppointments(appointmentsRes.data.appointments || []);
        };
        
        await fetchAppointments();
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
        setError('Fehler beim Laden der Termine. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentDate, filter]);
  
  // Termin Status ändern
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      await appointmentAPI.updateAppointment(appointmentId, { status: newStatus });
      
      // Termine neu laden
      const updatedAppointmentsRes = await appointmentAPI.getAppointments({
        date: currentDate,
        ...(filter.status && { status: filter.status }),
        ...(filter.staffId && { staffId: filter.staffId })
      });
      
      setAppointments(updatedAppointmentsRes.data.appointments || []);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Terminstatus:', err);
      setError('Der Status konnte nicht aktualisiert werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Termin löschen
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      setLoading(true);
      await appointmentAPI.deleteAppointment(selectedAppointment._id);
      
      // Termine neu laden
      const updatedAppointmentsRes = await appointmentAPI.getAppointments({
        date: currentDate,
        ...(filter.status && { status: filter.status }),
        ...(filter.staffId && { staffId: filter.staffId })
      });
      
      setAppointments(updatedAppointmentsRes.data.appointments || []);
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Löschen des Termins:', err);
      setError('Der Termin konnte nicht gelöscht werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Termin aktualisieren
  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    
    try {
      setLoading(true);
      await appointmentAPI.updateAppointment(selectedAppointment._id, selectedAppointment);
      
      // Termine neu laden
      const updatedAppointmentsRes = await appointmentAPI.getAppointments({
        date: currentDate,
        ...(filter.status && { status: filter.status }),
        ...(filter.staffId && { staffId: filter.staffId })
      });
      
      setAppointments(updatedAppointmentsRes.data.appointments || []);
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Termins:', err);
      setError('Der Termin konnte nicht aktualisiert werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filterwert ändern
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  // Aktualisierte Termindetails
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    
    // Für verschachtelte Objekte
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSelectedAppointment(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSelectedAppointment(prev => ({ ...prev, [name]: value }));
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-serif text-primary">Terminverwaltung</h1>
      
      {/* Filteroptionen und Datumswahl */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Datumswahl */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Datum
            </label>
            <input
              type="date"
              id="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          {/* Status-Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Alle Status</option>
              <option value="confirmed">Bestätigt</option>
              <option value="completed">Abgeschlossen</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
          
          {/* Mitarbeiter-Filter */}
          <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
              Stylist
            </label>
            <select
              id="staffId"
              name="staffId"
              value={filter.staffId}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Alle Stylisten</option>
              {staff.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Termine-Tabelle */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Termine werden geladen...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Keine Termine für die ausgewählten Kriterien gefunden.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uhrzeit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dienstleistung
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stylist
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center">
                        <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
                        {appointment.startTime} - {appointment.endTime} Uhr
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.customer.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.service.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.service.price.toFixed(2)} € | {appointment.service.duration} Min.
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center">
                        <UserIcon className="h-5 w-5 mr-1 text-gray-400" />
                        {appointment.staff.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'confirmed' 
                          ? 'Bestätigt' 
                          : appointment.status === 'completed'
                            ? 'Abgeschlossen'
                            : 'Storniert'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Status-Aktionen */}
                        {appointment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'completed')}
                              className="text-green-600 hover:text-green-900 focus:outline-none"
                              title="Als abgeschlossen markieren"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                              title="Stornieren"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {/* Bearbeiten-Button */}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none"
                          title="Bearbeiten"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Löschen-Button */}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          title="Löschen"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Bearbeiten-Modal */}
      {isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Termin bearbeiten</h3>
            </div>
            
            <form onSubmit={handleUpdateAppointment} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kundendaten */}
                <div>
                  <h4 className="font-medium mb-2">Kundendaten</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="customer.name" className="block text-sm text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="customer.name"
                        name="customer.name"
                        value={selectedAppointment.customer.name}
                        onChange={handleAppointmentChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="customer.email" className="block text-sm text-gray-700 mb-1">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        id="customer.email"
                        name="customer.email"
                        value={selectedAppointment.customer.email}
                        onChange={handleAppointmentChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="customer.phone" className="block text-sm text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="customer.phone"
                        name="customer.phone"
                        value={selectedAppointment.customer.phone}
                        onChange={handleAppointmentChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Termindetails */}
                <div>
                  <h4 className="font-medium mb-2">Termindetails</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="status" className="block text-sm text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={selectedAppointment.status}
                        onChange={handleAppointmentChange}
                        className="input-field"
                      >
                        <option value="confirmed">Bestätigt</option>
                        <option value="completed">Abgeschlossen</option>
                        <option value="cancelled">Storniert</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm text-gray-700 mb-1">
                        Datum
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={format(new Date(selectedAppointment.date), 'yyyy-MM-dd')}
                        onChange={handleAppointmentChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="startTime" className="block text-sm text-gray-700 mb-1">
                          Startzeit
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={selectedAppointment.startTime}
                          onChange={handleAppointmentChange}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endTime" className="block text-sm text-gray-700 mb-1">
                          Endzeit
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={selectedAppointment.endTime}
                          onChange={handleAppointmentChange}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notizen */}
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm text-gray-700 mb-1">
                  Notizen
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={selectedAppointment.notes || ''}
                  onChange={handleAppointmentChange}
                  className="input-field min-h-[80px]"
                />
              </div>
              
              {/* Footer mit Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Wird gespeichert...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Löschen-Modal */}
      {isDeleteModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Termin löschen</h3>
            </div>
            
            <div className="p-6">
              <p className="mb-4">
                Möchtest du wirklich den Termin von <span className="font-semibold">{selectedAppointment.customer.name}</span> am{' '}
                <span className="font-semibold">
                  {format(new Date(selectedAppointment.date), 'd. MMMM yyyy', { locale: de })}
                </span> um{' '}
                <span className="font-semibold">{selectedAppointment.startTime} Uhr</span> löschen?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAppointment}
                  className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? 'Wird gelöscht...' : 'Löschen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments; 