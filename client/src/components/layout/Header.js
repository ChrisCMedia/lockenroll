import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();
  
  // Aktiven Link prüfen
  const isActive = (path) => location.pathname === path;
  
  // Admin-Bereich erkennen
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Navigationslinks (abhängig vom Bereich)
  const navLinks = isAdminPage 
    ? [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/termine', label: 'Termine' },
        { path: '/admin/leistungen', label: 'Leistungen' },
        { path: '/admin/mitarbeiter', label: 'Mitarbeiter' },
        { path: '/admin/einstellungen', label: 'Einstellungen' }
      ]
    : [
        { path: '/', label: 'Startseite' },
        { path: '/leistungen', label: 'Leistungen' },
        { path: '/termin', label: 'Termin buchen' },
        { path: '/anfahrt', label: 'Anfahrt' }
      ];
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary font-serif">Locken'Roll</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin-Links */}
            {!isAdminPage && isAuthenticated && (
              <Link
                to="/admin"
                className="text-base font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
            
            {/* Auth-Links */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-base font-medium text-gray-600 hover:text-primary transition-colors">
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  {currentUser?.name || 'Benutzer'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  {isAdminPage ? (
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Zur Website
                    </Link>
                  ) : (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin-Bereich
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : (
              isAdminPage && (
                <Link
                  to="/admin/login"
                  className="text-base font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Anmelden
                </Link>
              )
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-primary focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1 rounded-md ${
                    isActive(link.path) 
                      ? 'bg-primary-light text-primary font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Admin-Links für Mobilgeräte */}
              {!isAdminPage && isAuthenticated && (
                <Link
                  to="/admin"
                  className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* Auth-Links für Mobilgeräte */}
              {isAuthenticated ? (
                <>
                  {isAdminPage ? (
                    <Link 
                      to="/"
                      className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Zur Website
                    </Link>
                  ) : (
                    <Link 
                      to="/admin"
                      className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin-Bereich
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100 text-left w-full"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                isAdminPage && (
                  <Link
                    to="/admin/login"
                    className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 