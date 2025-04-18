import React, { useState, useEffect } from 'react';

function AdminServices() {
  // Zustand für Dienstleistungen und Formulardaten
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: '',
    category: 'haircut'
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulierte Daten laden
  useEffect(() => {
    // In einer echten App würden diese Daten von einer API geladen
    setTimeout(() => {
      setServices([
        {
          id: 1,
          name: 'Damenhaarschnitt',
          description: 'Professioneller Haarschnitt inkl. Beratung und Styling',
          duration: 60,
          price: 35,
          category: 'haircut'
        },
        {
          id: 2,
          name: 'Herrenhaarschnitt',
          description: 'Kurzer oder klassischer Herrenhaarschnitt inkl. Styling',
          duration: 30,
          price: 25,
          category: 'haircut'
        },
        {
          id: 3,
          name: 'Coloration',
          description: 'Komplette Haarfärbung in Wunschfarbe',
          duration: 90,
          price: 60,
          category: 'color'
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handler für Formularänderungen
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'duration' ? parseInt(value, 10) || '' : value
    });
  };

  // Service hinzufügen oder aktualisieren
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Service aktualisieren
      setServices(services.map(service => 
        service.id === editingId ? { ...formData, id: editingId } : service
      ));
      setEditingId(null);
    } else {
      // Neuen Service hinzufügen
      const newService = {
        ...formData,
        id: Date.now() // Einfache ID-Generierung für Demozwecke
      };
      setServices([...services, newService]);
    }
    
    // Formular zurücksetzen
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: '',
      category: 'haircut'
    });
  };

  // Service bearbeiten
  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service.id);
  };

  // Service löschen
  const handleDelete = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Dienstleistung löschen möchten?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leistungen verwalten</h1>

      {/* Formular für neue/bearbeitete Dienstleistungen */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Dienstleistung bearbeiten' : 'Neue Dienstleistung erstellen'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="category">Kategorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="haircut">Haarschnitt</option>
                <option value="color">Coloration</option>
                <option value="styling">Styling</option>
                <option value="treatment">Behandlung</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="description">Beschreibung</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="duration">Dauer (Min.)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                min="5"
                step="5"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="price">Preis (€)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {editingId ? 'Aktualisieren' : 'Erstellen'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    description: '',
                    duration: 30,
                    price: '',
                    category: 'haircut'
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Abbrechen
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste der Dienstleistungen */}
      <h2 className="text-2xl font-semibold mb-4">Leistungsübersicht</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Daten werden geladen...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Kategorie</th>
                <th className="px-4 py-2 text-left">Dauer</th>
                <th className="px-4 py-2 text-left">Preis</th>
                <th className="px-4 py-2 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                  <td className="px-4 py-2">
                    {service.category === 'haircut' && 'Haarschnitt'}
                    {service.category === 'color' && 'Coloration'}
                    {service.category === 'styling' && 'Styling'}
                    {service.category === 'treatment' && 'Behandlung'}
                  </td>
                  <td className="px-4 py-2">{service.duration} Min.</td>
                  <td className="px-4 py-2">{service.price} €</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminServices; 