import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kontakt */}
          <div>
            <h3 className="text-xl font-semibold mb-4 font-serif">Kontakt</h3>
            <address className="not-italic">
              <p className="mb-2">Locken'Roll</p>
              <p className="mb-2">Grabenstraße 39</p>
              <p className="mb-2">65549 Limburg</p>
              <p className="mb-2">
                <span className="font-semibold">Tel:</span> 06431 9716744
              </p>
              <p>
                <span className="font-semibold">E-Mail:</span>{' '}
                <a 
                  href="mailto:info@lockenroll.de" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  info@lockenroll.de
                </a>
              </p>
            </address>
          </div>
          
          {/* Öffnungszeiten */}
          <div>
            <h3 className="text-xl font-semibold mb-4 font-serif">Öffnungszeiten</h3>
            <ul>
              <li className="mb-1">Montag: geschlossen</li>
              <li className="mb-1">Dienstag: 9:00 - 18:00 Uhr</li>
              <li className="mb-1">Mittwoch: 9:00 - 18:00 Uhr</li>
              <li className="mb-1">Donnerstag: 9:00 - 18:00 Uhr</li>
              <li className="mb-1">Freitag: 9:00 - 18:00 Uhr</li>
              <li>Samstag: 9:00 - 16:00 Uhr</li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 font-serif">Links</h3>
            <ul>
              <li className="mb-2">
                <Link 
                  to="/" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Startseite
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/leistungen" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Leistungen
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/termin" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Termin buchen
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/anfahrt" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Anfahrt
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/impressum" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  to="/datenschutz" 
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Locken'Roll. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 