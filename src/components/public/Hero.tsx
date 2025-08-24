import React from 'react';
import { Calendar, Clock, Users, Trophy, Flag, MapPin } from 'lucide-react';
import Button from '../common/Button';

interface HeroProps {
  onBookingClick: () => void;
  branch: any;
}

const Hero: React.FC<HeroProps> = ({ onBookingClick, branch }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/7876643/pexels-photo-7876643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
          }}
        ></div>
      </div>

      {/* Animated Racing Stripes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-4 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-full h-4 bg-gradient-to-r from-transparent via-red-500/30 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
      </div>

      {/* Racing Flag Icons */}
      <div className="absolute top-10 left-10 text-white/10 animate-bounce">
        <Flag className="h-16 w-16" />
      </div>
      <div className="absolute bottom-10 right-10 text-white/10 animate-bounce delay-500">
        <Trophy className="h-16 w-16" />
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        {/* New Circuit Badge */}
        {branch?.isNewCircuit && (
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
            <span>🆕</span>
            <span>¡NUEVO CIRCUITO!</span>
          </div>
        )}

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
          ROSARIO
          <br />
          INDOOR KART
        </h1>

        <p className="text-xl md:text-2xl font-medium mb-4 text-red-100">
          🏁 La adrenalina que buscás 🏁
        </p>

        <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
          Viví la experiencia del karting más emocionante de Rosario. 
          Circuito cubierto, cronometraje computarizado y diversión garantizada.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-bold text-red-400">330m²</div>
            <div className="text-sm text-gray-300">Circuito cubierto</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-bold text-orange-400">8</div>
            <div className="text-sm text-gray-300">Karts disponibles</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">15+</div>
            <div className="text-sm text-gray-300">Años mínimo</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400">110kg</div>
            <div className="text-sm text-gray-300">Peso máximo</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Button
            onClick={onBookingClick}
            size="lg"
            className="text-xl px-8 py-4 shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <Calendar className="h-6 w-6 mr-2" />
            ¡RESERVÁ AHORA!
          </Button>

          <a
            href={`https://wa.me/5493416188143?text=¡Hola! Quiero consultar sobre karting`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <span>📱</span>
            <span>Consultá por WhatsApp</span>
          </a>
        </div>

        {/* Quick Info */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-300">
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

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-50 delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-60 delay-1000"></div>
      </div>
    </section>
  );
};

export default Hero;