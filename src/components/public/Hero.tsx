import React from 'react';
import { Calendar, Clock, Users, Flag, MapPin, Car, GitBranch } from 'lucide-react';
import Button from '../common/Button';
// En Vite, los archivos en la carpeta 'public' se sirven desde la raíz.
// Por lo tanto, la ruta correcta es '/logo.png' y no '../public/logo.png'.
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900">
        <div className="absolute inset-0 bg-black/60"></div>
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/7876643/pexels-photo-7876643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-4">
          <img src={logo} alt="Rosario Indoor Kart Logo" className="max-w-md md:max-w-lg mx-auto" />
        </div>

        <p className="text-xl md:text-2xl font-medium mb-3 text-red-100">
          🏁 La adrenalina que buscás 🏁
        </p>

        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Viví la experiencia del karting más emocionante de Rosario. 
          Circuito cubierto, cronometraje computarizado y diversión garantizada.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 w-full max-w-4xl">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center justify-center h-full">
            <GitBranch className="h-8 w-8 text-red-400 mb-2" />
            <div className="text-xl font-bold">330m²</div>
            <div className="text-sm text-gray-300">Circuito cubierto</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center justify-center h-full">
            <Car className="h-8 w-8 text-orange-400 mb-2" />
            <div className="text-xl font-bold">8 Karts</div>
            <div className="text-sm text-gray-300">En simultáneo</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center justify-center h-full">
            <Flag className="h-8 w-8 text-yellow-400 mb-2" />
            <div className="text-xl font-bold">Qualy + Carrera</div>
            <div className="text-sm text-gray-300">Toda la emoción</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center justify-center h-full">
            <Clock className="h-8 w-8 text-green-400 mb-2" />
            <div className="text-xl font-bold">Timing Profesional</div>
            <div className="text-sm text-gray-300">Tiempos reales</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <Button
            onClick={onBookingClick}
            size="lg"
            className="text-xl px-8 py-4 shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <Calendar className="h-6 w-6 mr-2" />
            <span>¡RESERVÁ AHORA!</span>
          </Button>

          <a
            href={`https://wa.me/5493416188143?text=¡Hola! Quiero consultar sobre karting`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            <WhatsAppIcon className="h-6 w-6 mr-2" />
            <span>Consultá por WhatsApp</span>
          </a>
        </div>

        {/* Quick Info */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-8 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-red-400" />
            <span>Anchorena 2750, Rosario</span>
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
