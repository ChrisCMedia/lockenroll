import React, { useState, useEffect } from 'react';

function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    specialization: '',
    bio: '',
    workDays: []
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulierte Daten laden
  useEffect(() => {
    setTimeout(() => {
      setStaff([
        {
          id: 1,
          name: 'Anna Müller',
          position: 'Stylistin',
          specialization: 'Haarschnitt, Coloration',
          bio: 'Anna ist seit 10 Jahren im Friseurhandwerk tätig und spezialisiert sich auf moderne Schnitte und Farbtechniken.',
          workDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr']
        },
        {
          id: 2,
          name: 'Thomas Weber',
          position: 'Meister',
          specialization: 'Herrenschnitte, Bartpflege',
          bio: 'Thomas ist Friseurmeister mit über 15 Jahren Erfahrung, spezialisiert auf klassische Herrenschnitte und Rasuren.',
          workDays: ['Mo', 'Di', 'Do', 'Fr', 'Sa']
        },
        {
          id: 3,
          name: 'Lisa Neumann',
          position: 'Junior-Stylistin',
          specialization: 'Styling, Föhnen',
          bio: 'Lisa hat ihre Ausbildung letztes Jahr abgeschlossen und bringt frische, moderne Ideen ins Team.',
          workDays: ['Mi', 'Do', 'Fr', 'Sa']
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'workDays') {
      const day = e.target.value;
      const isChecked = e.target.checked;
      
      if (isChecked) {
        setFormData({
          ...formData,
          workDays: [...formData.workDays, day]
        });
      } else {
        setFormData({
          ...formData,
          workDays: formData.workDays.filter(d => d !== day)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setStaff(staff.map(member => 
        member.id === editingId ? { ...formData, id: editingId } : member
      ));
      setEditingId(null);
    } else {
      const newStaffMember = {
        ...formData,
        id: Date.now()
      };
      setStaff([...staff, newStaffMember]);
    }
    
    // Formular zurücksetzen
    setFormData({
      name: '',
      position: '',
      specialization: '',
      bio: '',
      workDays: []
    });
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditingId(member.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten?')) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mitarbeiter verwalten</h1>

      {/* Formular für neue/bearbeitete Mitarbeiter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
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
              <label className="block text-gray-700 mb-1" htmlFor="position">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Position auswählen</option>
                <option value="Meister">Meister/in</option>
                <option value="Stylist">Stylist/in</option>
                <option value="Junior-Stylist">Junior-Stylist/in</option>
                <option value="Azubi">Auszubildende/r</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="specialization">Spezialisierung</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="z.B. Färben, Herrenschnitte, etc."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="bio">Kurzbeschreibung</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Arbeitstage</label>
            <div className="flex flex-wrap gap-4">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
                <label key={day} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="workDays"
                    value={day}
                    checked={formData.workDays.includes(day)}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {editingId ? 'Aktualisieren' : 'Hinzufügen'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    position: '',
                    specialization: '',
                    bio: '',
                    workDays: []
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

      {/* Liste der Mitarbeiter */}
      <h2 className="text-2xl font-semibold mb-4">Mitarbeiterübersicht</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Daten werden geladen...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <div className="flex">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Löschen
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 font-medium mb-2">{member.position}</p>
              <p className="text-gray-600 mb-3">
                <strong>Spezialisierung:</strong> {member.specialization}
              </p>
              <p className="text-gray-600 mb-4">{member.bio}</p>
              
              <div>
                <strong className="text-gray-700">Arbeitstage:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.workDays.map(day => (
                    <span key={day} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminStaff; 