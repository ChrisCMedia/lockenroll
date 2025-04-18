import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Seite nicht gefunden</h2>
      
      <p className="text-xl mb-8">
        Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
      </p>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Vielleicht suchen Sie nach:</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">Startseite</Link>
          </li>
          <li>
            <Link to="/leistungen" className="text-blue-600 hover:underline">Unsere Leistungen</Link>
          </li>
          <li>
            <Link to="/termin" className="text-blue-600 hover:underline">Termin buchen</Link>
          </li>
          <li>
            <Link to="/anfahrt" className="text-blue-600 hover:underline">Anfahrt</Link>
          </li>
        </ul>
      </div>
      
      <Link 
        to="/" 
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}

export default NotFound; 