import React from 'react';

function Services() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Unsere Leistungen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Haarschnitt</h2>
          <p className="text-gray-700">Professionelle Haarschnitte für Damen, Herren und Kinder. Unser erfahrenes Team berät Sie gerne zum passenden Schnitt für Ihren Typ.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Coloration</h2>
          <p className="text-gray-700">Von dezenten Highlights bis hin zu kompletten Farbveränderungen - wir setzen Ihre Wünsche mit hochwertigen Produkten um.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Styling</h2>
          <p className="text-gray-700">Ob Hochzeit, besonderer Anlass oder einfach für den Alltag - wir stylen Ihr Haar passend zu jedem Event.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Haarpflege</h2>
          <p className="text-gray-700">Spezielle Behandlungen für strapaziertes Haar, Tiefenreinigung und pflegende Masken für gesundes, glänzendes Haar.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Beratung</h2>
          <p className="text-gray-700">Individuelle Beratung zu Haarpflege, Styling-Produkten und der optimalen Routine für Ihren Haartyp.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Barber-Service</h2>
          <p className="text-gray-700">Professionelle Bartpflege und -styling für Herren. Von der klassischen Rasur bis zum Trimmen und Formen.</p>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Preisliste</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Leistung</th>
                <th className="px-4 py-2 text-right">Preis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Damenhaarschnitt</td>
                <td className="px-4 py-2 text-right">ab 35€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Herrenhaarschnitt</td>
                <td className="px-4 py-2 text-right">ab 25€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Kinderhaarschnitt</td>
                <td className="px-4 py-2 text-right">ab 20€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Coloration</td>
                <td className="px-4 py-2 text-right">ab 60€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Strähnchen</td>
                <td className="px-4 py-2 text-right">ab 70€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Hochsteckfrisur</td>
                <td className="px-4 py-2 text-right">ab 50€</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Bartpflege</td>
                <td className="px-4 py-2 text-right">ab 15€</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Services; 