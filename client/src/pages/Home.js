import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ScissorsIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Platzhalter für Salon-Bild
const salonImage = 'https://via.placeholder.com/800x500?text=Locken%27Roll+Salon';

const Home = () => {
  return (
    <div>
      {/* Hero-Bereich */}
      <section className="hero-section py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">Locken'Roll</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Dein Friseursalon in Limburg für stilvolle Haarschnitte und Styling mit Persönlichkeit
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/termin"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Termin buchen
            </Link>
            <Link
              to="/leistungen"
              className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center"
            >
              <ScissorsIcon className="h-5 w-5 mr-2" />
              Unsere Leistungen
            </Link>
          </div>
        </div>
      </section>

      {/* Willkommen-Bereich */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 font-serif text-primary">Herzlich willkommen bei Locken'Roll!</h2>
              <p className="text-lg mb-4">
                In unserem Salon verbinden wir traditionelles Handwerk mit moderner Styling-Expertise
                und bieten dir Friseurdienstleistungen auf höchstem Niveau.
              </p>
              <p className="text-lg mb-4">
                Bei uns steht deine Persönlichkeit im Mittelpunkt. Wir nehmen uns Zeit für eine ausführliche Beratung,
                um deinen individuellen Typ zu betonen und dir eine Frisur zu zaubern, die perfekt zu dir passt.
              </p>
              <p className="text-lg mb-6">
                In unserem stilvollen Ambiente kannst du entspannen und dich wohlfühlen, während unser erfahrenes
                Team sich um deine Haare kümmert. Wir verwenden ausschließlich hochwertige Produkte, die deinem Haar
                Glanz und Vitalität verleihen.
              </p>
              <Link
                to="/anfahrt"
                className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                So findest du uns
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src={salonImage}
                alt="Locken'Roll Salon"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leistungen-Vorschau */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 font-serif text-primary text-center">Unsere Leistungen</h2>
          <p className="text-lg mb-12 text-center max-w-3xl mx-auto">
            Von klassischen Haarschnitten bis hin zu kreativen Farbtechniken - bei uns bist du in guten Händen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Damen */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden service-card transition-transform">
              <div className="bg-primary-light text-primary-dark p-4 text-center font-semibold">
                Woman
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Haarschnitt</span>
                    <span className="font-semibold">ab 36 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Coloration</span>
                    <span className="font-semibold">ab 59 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Strähnen</span>
                    <span className="font-semibold">ab 69 €</span>
                  </li>
                </ul>
                <Link
                  to="/leistungen"
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  Alle Leistungen
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Herren */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden service-card transition-transform">
              <div className="bg-secondary-light text-secondary-dark p-4 text-center font-semibold">
                Gentleman
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Haarschnitt</span>
                    <span className="font-semibold">ab 25 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bartpflege</span>
                    <span className="font-semibold">ab 15 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Coloration</span>
                    <span className="font-semibold">ab 42 €</span>
                  </li>
                </ul>
                <Link
                  to="/leistungen"
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  Alle Leistungen
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Kinder */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden service-card transition-transform">
              <div className="bg-primary-light text-primary-dark p-4 text-center font-semibold">
                Kinder
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Bis 6 Jahre</span>
                    <span className="font-semibold">ab 17 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>7-12 Jahre</span>
                    <span className="font-semibold">ab 22 €</span>
                  </li>
                </ul>
                <Link
                  to="/leistungen"
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  Alle Leistungen
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Kosmetik */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden service-card transition-transform">
              <div className="bg-secondary-light text-secondary-dark p-4 text-center font-semibold">
                Kosmetik
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Augenbrauen</span>
                    <span className="font-semibold">ab 18 €</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Gesichtsbehandlung</span>
                    <span className="font-semibold">ab 55 €</span>
                  </li>
                </ul>
                <Link
                  to="/leistungen"
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  Alle Leistungen
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA-Bereich */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 font-serif">Vereinbare jetzt deinen Termin</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sichere dir deinen Wunschtermin bequem online und lass dich von unserem professionellen Team verwöhnen.
          </p>
          <Link
            to="/termin"
            className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition-colors inline-flex items-center"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Termin buchen
          </Link>
        </div>
      </section>

      {/* Standort-Bereich */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 font-serif text-primary">Besuche uns in Limburg</h2>
              <address className="not-italic text-lg mb-6">
                <p className="mb-2">Locken'Roll</p>
                <p className="mb-2">Grabenstraße 39</p>
                <p className="mb-4">65549 Limburg</p>
                <p className="mb-2">
                  <span className="font-semibold">Tel:</span> 06431 9716744
                </p>
                <p className="mb-4">
                  <span className="font-semibold">E-Mail:</span>{' '}
                  <a 
                    href="mailto:info@lockenroll.de" 
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    info@lockenroll.de
                  </a>
                </p>
              </address>
              <h3 className="text-xl font-bold mb-3 font-serif">Öffnungszeiten:</h3>
              <ul className="space-y-1 mb-6">
                <li>Montag: geschlossen</li>
                <li>Dienstag - Freitag: 9:00 - 18:00 Uhr</li>
                <li>Samstag: 9:00 - 16:00 Uhr</li>
              </ul>
              <Link
                to="/anfahrt"
                className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                Anfahrt & Karte
              </Link>
            </div>
            <div className="md:w-1/2">
              {/* Google Maps als Platzhalter (mit iframe oder als Bild) */}
              <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  title="Locken'Roll Standort"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2547.6763539576537!2d8.066673!3d50.384361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bc2109a67151b3%3A0x9f437ff06cda50e0!2sGrabenstra%C3%9Fe%2039%2C%2065549%20Limburg%20an%20der%20Lahn!5e0!3m2!1sde!2sde!4v1642527131937!5m2!1sde!2sde"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 