import React from 'react';

function Imprint() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
        <p className="mb-6">
          Lockenroll GmbH<br />
          Musterstraße 123<br />
          10115 Berlin<br />
          Deutschland
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
        <p className="mb-6">
          Telefon: 030 12345678<br />
          E-Mail: info@lockenroll.de
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Vertreten durch</h2>
        <p className="mb-6">
          Max Mustermann<br />
          Geschäftsführer
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Handelsregister</h2>
        <p className="mb-6">
          Amtsgericht Berlin-Charlottenburg<br />
          HRB 12345
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Umsatzsteuer-ID</h2>
        <p className="mb-6">
          Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE123456789
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
        <p className="mb-6">
          Berufsbezeichnung: Friseurbetrieb<br />
          Zuständige Kammer: Handwerkskammer Berlin<br />
          Verliehen in: Deutschland
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Streitschlichtung</h2>
        <p className="mb-6">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            https://ec.europa.eu/consumers/odr/
          </a>.<br /><br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Haftung für Inhalte</h2>
        <p className="mb-6">
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen 
          Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, 
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf 
          eine rechtswidrige Tätigkeit hinweisen.
        </p>
      </div>
    </div>
  );
}

export default Imprint; 