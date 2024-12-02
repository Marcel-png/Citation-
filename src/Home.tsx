import React, { useState } from "react";
import Formulaire from "./Formulaire";

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Typage explicite
  const [showForm, setShowForm] = useState<"login" | "signup" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleShowLoginForm = (): void => {
    setShowForm("login");
    setIsMenuOpen(false);
  };

  const handleShowSignupForm = (): void => {
    setShowForm("signup");
    setIsMenuOpen(false);
  };

  const handleCloseForm = (): void => {
    setShowForm(null);
  };

  const handleToggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
    alert("Vous êtes déconnecté !");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-800">SiteW</div>
        {/* Bouton hamburger */}
        <div className="md:hidden">
          <button
            className="text-gray-600 focus:outline-none"
            onClick={handleToggleMenu}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Liens pour écrans larges */}
        <nav className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button className="text-gray-600" onClick={handleShowLoginForm}>Se connecter</button>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg"
                onClick={handleShowSignupForm}
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              <button className="text-gray-600">Profil</button>
              <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg">
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Menu hamburger */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={handleToggleMenu}></div>
          <div className="fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg z-20 transition-transform duration-300 ease-in-out">
            <nav className="flex flex-col p-4 space-y-4">
              {!isLoggedIn ? (
                <>
                  <button className="text-gray-600 text-left" onClick={handleShowLoginForm}>Se connecter</button>
                  <button className="bg-purple-600 text-white py-2 px-4 rounded-lg text-left" onClick={handleShowSignupForm}>
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  <button className="text-gray-600 text-left">Profil</button>
                  <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg text-left">
                    Déconnexion
                  </button>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Contenu principal ou formulaire */}
      {showForm ? (
        <Formulaire
          isRegistered={showForm === "login"} 
          onClose={handleCloseForm}
        />
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-gray-200 h-40 rounded-lg shadow-md"></div>
          ))}
        </main>
      )}
    </div>
  );
};

export default Home;