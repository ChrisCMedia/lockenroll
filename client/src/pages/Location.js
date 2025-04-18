import React from 'react';

function Location() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Anfahrt</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">So finden Sie uns</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Adresse</h3>
            <p className="mb-4">
              Lockenroll Friseursalon<br />
              Musterstraße 123<br />
              10115 Berlin
            </p>
            
            <h3 className="text-lg font-medium mb-2">Kontakt</h3>
            <p className="mb-4">
              Telefon: 030 12345678<br />
              E-Mail: info@lockenroll.de
            </p>
            
            <h3 className="text-lg font-medium mb-2">Öffnungszeiten</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>Montag:</div>
              <div>09:00 - 18:00 Uhr</div>
              <div>Dienstag:</div>
              <div>09:00 - 18:00 Uhr</div>
              <div>Mittwoch:</div>
              <div>09:00 - 18:00 Uhr</div>
              <div>Donnerstag:</div>
              <div>09:00 - 20:00 Uhr</div>
              <div>Freitag:</div>
              <div>09:00 - 20:00 Uhr</div>
              <div>Samstag:</div>
              <div>10:00 - 16:00 Uhr</div>
              <div>Sonntag:</div>
              <div>Geschlossen</div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Anfahrt</h2>
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-medium mb-2">Mit öffentlichen Verkehrsmitteln</h3>
            <p className="mb-4">
              U-Bahn: U2, U8 (Haltestelle Alexanderplatz)<br />
              S-Bahn: S3, S5, S7, S9 (Haltestelle Alexanderplatz)<br />
              Bus: 100, 200 (Haltestelle Musterstraße)
            </p>
            
            <h3 className="text-lg font-medium mb-2">Mit dem Auto</h3>
            <p className="mb-4">
              Parkplätze sind in den umliegenden Straßen vorhanden.<br />
              Parkhäuser finden Sie in unmittelbarer Nähe am Alexanderplatz.
            </p>
            
            {/* Hier könnte später eine Karteneinbindung erfolgen */}
            <div className="mt-4 bg-gray-200 rounded h-64 flex items-center justify-center">
              <p className="text-gray-600">Kartenansicht wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location; 