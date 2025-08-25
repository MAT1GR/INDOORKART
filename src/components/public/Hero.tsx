import React from 'react';
import { Calendar, Clock, Users, Flag, MapPin, Car, GitBranch } from 'lucide-react';
import Button from '../common/Button';
import logo from '../public/logo.png';

// SVG for WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

interface HeroProps {
  onBookingClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookingClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-gray-900">
        <div className="absolute inset-0 bg-black/60"></div>
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/7876643/pexels-photo-7876643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full max-w-6xl mx-auto">
        
        {/* Logo - Movido más arriba con transform y con más margen inferior */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl transform -translate-y-8 md:-translate-y-10">
          <img src={logo} alt="Rosario Indoor Kart Logo" className="w-full h-auto" />
        </div>

        
        
        {/* Descripción con más margen inferior */}
        <div className="text-base sm:text-lg md:text-xl mb-10 md:mb-12 text-gray-200 max-w-2xl mx-auto">
          {/* Texto corto para móviles */}
          <p className="md:hidden">
            Viví la experiencia del karting más emocionante de Rosario.
          </p>
          {/* Texto largo para pantallas más grandes */}
          <p className="hidden md:block">
            Viví la experiencia del karting más emocionante de Rosario. 
            Circuito cubierto, cronometraje computarizado y diversión garantizada.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-12 w-full max-w-4xl">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10 flex flex-col items-center justify-center h-full">
            <Car className="h-6 w-6 md:h-8 md:w-8 text-orange-400 mb-2" />
            <div className="text-sm md:text-lg font-bold text-center">Máxima Velocidad</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10 flex flex-col items-center justify-center h-full">
            <GitBranch className="h-6 w-6 md:h-8 md:w-8 text-red-400 mb-2" />
            <div className="text-sm md:text-lg font-bold text-center">Adrenalina Pura</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10 flex flex-col items-center justify-center h-full">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 mb-2" />
            <div className="text-sm md:text-lg font-bold text-center">Desafiá a Amigos</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10 flex flex-col items-center justify-center h-full">
            <Flag className="h-6 w-6 md:h-8 md:w-8 text-green-400 mb-2" />
            <div className="text-sm md:text-lg font-bold text-center">Viví la Carrera</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full mb-10 md:mb-12">
          <Button
            onClick={onBookingClick}
            size="lg"
            className="w-full sm:w-auto text-lg md:text-xl px-8 py-3 shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <Calendar className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            <span>¡RESERVÁ AHORA!</span>
          </Button>
          <a
            href={`https://wa.me/5493416188143?text=¡Hola! Quiero consultar sobre karting`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base md:text-lg font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            <WhatsAppIcon className="h-5 w-5 md:h-6 md:h-6 mr-2" />
            <span>Consultá por WhatsApp</span>
          </a>
        </div>

        {/* Quick Info */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-8 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-red-400" />
            <span>Anchorena 2751, Rosario</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-400" />
            <span>Mar-Dom: 17:00-23:00</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-yellow-400" />
            <span>Hasta 8 pilotos por tanda</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;