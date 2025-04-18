import React, { useState, useEffect } from 'react';
import { format, parseISO, isValid, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, UserIcon, ScissorsIcon, ClockIcon } from '@heroicons/react/24/outline';
import { configAPI, appointmentAPI } from '../utils/api';

const AppointmentBooking = () => {
  // Zustand
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Daten laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, staffRes] = await Promise.all([
          configAPI.getServices(),
          configAPI.getStaff()
        ]);
        
        setServices(servicesRes.data.services);
        setStaff(staffRes.data.staff);
        setError(null);
        
        // Verfügbare Tage für die nächsten 4 Wochen generieren
        const days = [];
        const today = new Date();
        
        for (let i = 0; i < 28; i++) {
          const day = addDays(today, i);
          // Sonntag (0) und Montag (1) ausschließen
          if (day.getDay() !== 0 && day.getDay() !== 1) {
            days.push(format(day, 'yyyy-MM-dd'));
          }
        }
        
        setAvailableDays(days);
        
        if (days.length > 0) {
          setSelectedDate(days[0]);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
        setError('Die Daten konnten nicht geladen werden. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Zeitslots bei Änderung von Datum oder Mitarbeiter laden
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !isValid(parseISO(selectedDate))) return;
      
      try {
        setLoading(true);
        const res = await appointmentAPI.getAvailableSlots(
          selectedDate, 
          selectedStaff ? selectedStaff.id : null
        );
        
        setAvailableSlots(res.data.availableSlots);
        setSelectedTime(''); // Zeit zurücksetzen bei Änderungen
      } catch (err) {
        console.error('Fehler beim Laden der Zeitslots:', err);
        setError('Die verfügbaren Zeiten konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [selectedDate, selectedStaff]);

  // Formular-Handler
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Zum nächsten Schritt
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Zum vorherigen Schritt
  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Termin buchen
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Bitte wähle Dienstleistung, Datum und Uhrzeit aus.');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError('Bitte fülle alle erforderlichen Felder aus.');
      return;
    }

    try {
      setLoading(true);
      
      // Terminbuchung-Objekt erstellen
      const appointmentData = {
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        serviceId: selectedService.id,
        staffId: selectedStaff?.id || staff[0].id, // Falls kein Mitarbeiter ausgewählt wurde, den ersten nehmen
        date: selectedDate,
        startTime: selectedTime,
        notes: customerInfo.notes
      };
      
      await appointmentAPI.createAppointment(appointmentData);
      
      // Erfolg setzen und Formular zurücksetzen
      setBookingSuccess(true);
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      setCustomerInfo({
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
      
    } catch (err) {
      console.error('Fehler bei der Terminbuchung:', err);
      setError(
        err.response?.data?.message || 
        'Dein Termin konnte nicht gebucht werden. Bitte versuche es später erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Erfolgsmeldung
  if (bookingSuccess) {
    return (
      <div className="py-12 bg-neutral-light min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 font-serif text-primary">Vielen Dank für deine Buchung!</h2>
              <p className="text-lg mb-6">
                Dein Termin wurde erfolgreich gebucht. Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.
              </p>
              <button 
                onClick={() => {
                  setBookingSuccess(false);
                  setCurrentStep(1);
                }}
                className="btn-primary"
              >
                Neuen Termin buchen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ladeanzeige
  if (loading && currentStep === 1) {
    return (
      <div className="py-12 bg-neutral-light min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-neutral-light min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-white">
            <h1 className="text-3xl font-bold font-serif">Termin buchen</h1>
            <p className="mt-2">Buche deinen Wunschtermin in wenigen Schritten</p>
          </div>
          
          {/* Fortschrittsanzeige */}
          <div className="flex border-b border-gray-200">
            <div 
              className={`flex-1 py-3 px-4 text-center ${
                currentStep === 1 ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
            >
              1. Dienstleistung
            </div>
            <div 
              className={`flex-1 py-3 px-4 text-center ${
                currentStep === 2 ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
            >
              2. Datum & Uhrzeit
            </div>
            <div 
              className={`flex-1 py-3 px-4 text-center ${
                currentStep === 3 ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
            >
              3. Deine Daten
            </div>
          </div>
          
          {/* Fehlermeldung */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          
          {/* Schritt 1: Dienstleistung auswählen */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 font-serif text-primary">
                <ScissorsIcon className="h-6 w-6 inline-block mr-2" />
                Wähle deine Dienstleistung
              </h2>
              
              {/* Dienstleistungskategorien */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Woman', 'Gentleman', 'Kinder', 'Kosmetik'].map(category => (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-3 font-medium border-b">
                      {category}
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {services
                          .filter(service => service.category === category)
                          .map(service => (
                            <div
                              key={service.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedService?.id === service.id
                                  ? 'border-primary bg-primary-light'
                                  : 'hover:border-primary hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedService(service)}
                            >
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">{service.name}</h3>
                                  <p className="text-sm text-gray-600">{service.description}</p>
                                  <p className="text-xs text-gray-500">Dauer: ca. {service.duration} Min.</p>
                                </div>
                                <div className="text-right font-bold">
                                  {service.price.toFixed(2)} €
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mitarbeiter auswählen */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6 font-serif text-primary">
                  <UserIcon className="h-6 w-6 inline-block mr-2" />
                  Wähle deinen Stylisten (optional)
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedStaff === null
                        ? 'border-primary bg-primary-light'
                        : 'hover:border-primary hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStaff(null)}
                  >
                    <div className="text-center">
                      <h3 className="font-medium mb-1">Keine Präferenz</h3>
                      <p className="text-sm text-gray-600">Nächster verfügbarer Stylist</p>
                    </div>
                  </div>
                  
                  {staff.map(person => (
                    <div
                      key={person.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedStaff?.id === person.id
                          ? 'border-primary bg-primary-light'
                          : 'hover:border-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStaff(person)}
                    >
                      <div className="text-center">
                        <h3 className="font-medium mb-1">{person.name}</h3>
                        <p className="text-sm text-gray-600">{person.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 text-right">
                <button
                  className="btn-primary"
                  onClick={goToNextStep}
                  disabled={!selectedService}
                >
                  Weiter zur Terminauswahl
                </button>
              </div>
            </div>
          )}
          
          {/* Schritt 2: Datum und Uhrzeit auswählen */}
          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 font-serif text-primary">
                <CalendarIcon className="h-6 w-6 inline-block mr-2" />
                Wähle Datum und Uhrzeit
              </h2>
              
              {/* Zusammenfassung der ausgewählten Dienstleistung */}
              <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Ausgewählte Dienstleistung:</h3>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{selectedService.name}</p>
                    <p className="text-sm text-gray-600">Dauer: ca. {selectedService.duration} Min.</p>
                    {selectedStaff && (
                      <p className="text-sm text-gray-600">Stylist: {selectedStaff.name}</p>
                    )}
                  </div>
                  <div className="text-right font-bold">
                    {selectedService.price.toFixed(2)} €
                  </div>
                </div>
              </div>
              
              {/* Datumsauswahl */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Datum auswählen:</h3>
                <div className="flex flex-wrap gap-2">
                  {availableDays.slice(0, 14).map(day => {
                    const date = parseISO(day);
                    return (
                      <button
                        key={day}
                        className={`p-2 border rounded-md text-center min-w-[90px] ${
                          selectedDate === day
                            ? 'border-primary bg-primary-light text-primary-dark font-medium'
                            : 'hover:border-primary hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-xs mb-1">
                          {format(date, 'EEEE', { locale: de })}
                        </div>
                        <div>
                          {format(date, 'd. MMM', { locale: de })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Uhrzeitauswahl */}
              <div>
                <h3 className="font-medium mb-3">
                  <ClockIcon className="h-5 w-5 inline-block mr-1" />
                  Uhrzeit auswählen für {selectedDate && format(parseISO(selectedDate), 'd. MMMM yyyy', { locale: de })}:
                </h3>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Verfügbare Zeiten werden geladen...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">
                    <p>Leider sind für diesen Tag keine Termine verfügbar. Bitte wähle einen anderen Tag.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        className={`py-2 px-3 border rounded-md text-center appointment-time-slot ${
                          selectedTime === time ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time} Uhr
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={goToPrevStep}
                >
                  Zurück
                </button>
                <button
                  className="btn-primary"
                  onClick={goToNextStep}
                  disabled={!selectedDate || !selectedTime}
                >
                  Weiter zur Dateneingabe
                </button>
              </div>
            </div>
          )}
          
          {/* Schritt 3: Kundendaten eingeben */}
          {currentStep === 3 && (
            <form onSubmit={handleBookAppointment} className="p-6">
              <h2 className="text-2xl font-bold mb-6 font-serif text-primary">
                Deine Kontaktdaten
              </h2>
              
              {/* Zusammenfassung der Termindetails */}
              <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Termindetails:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Dienstleistung:</strong> {selectedService.name}</p>
                    <p><strong>Preis:</strong> {selectedService.price.toFixed(2)} €</p>
                    <p><strong>Dauer:</strong> ca. {selectedService.duration} Min.</p>
                  </div>
                  <div>
                    <p><strong>Datum:</strong> {selectedDate && format(parseISO(selectedDate), 'd. MMMM yyyy', { locale: de })}</p>
                    <p><strong>Uhrzeit:</strong> {selectedTime} Uhr</p>
                    {selectedStaff && <p><strong>Stylist:</strong> {selectedStaff.name}</p>}
                  </div>
                </div>
              </div>
              
              {/* Formular */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-Mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Telefon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-gray-700 font-medium mb-1">Anmerkungen</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleCustomerInfoChange}
                    className="input-field min-h-[100px]"
                    placeholder="Spezielle Wünsche oder Anmerkungen zu deinem Termin"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 text-sm text-gray-600 mb-6">
                <p>* Pflichtfelder</p>
                <p className="mt-2">
                  Mit der Buchung des Termins akzeptierst du unsere Datenschutzrichtlinien 
                  und erklärst dich damit einverstanden, dass wir deine Daten zur Terminverarbeitung speichern.
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={goToPrevStep}
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Termin wird gebucht...
                    </>
                  ) : (
                    'Termin buchen'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking; 