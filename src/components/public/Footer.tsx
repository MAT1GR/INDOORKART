import React from 'react';
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              🏎️ ROSARIO INDOOR KART
            </h3>
            <p className="text-gray-400 mb-6">
              La experiencia de karting más emocionante de Rosario. 
              Circuito cubierto, karts profesionales y diversión garantizada para toda la familia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-red-400">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-400">Anchorena 2750, Rosario, Santa Fe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+5493416188143" className="text-gray-400 hover:text-white transition-colors">
                  +54 9 341 618 8143
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Mar-Dom: 17:00-23:00</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-red-400">Enlaces rápidos</h4>
            <div className="space-y-2 text-sm">
              <a href="#planes" className="block text-gray-400 hover:text-white transition-colors">
                Planes y precios
              </a>
              <a href="#como-funciona" className="block text-gray-400 hover:text-white transition-colors">
                Cómo funciona
              </a>
              <a href="#requisitos" className="block text-gray-400 hover:text-white transition-colors">
                Requisitos
              </a>
              <a href="#galeria" className="block text-gray-400 hover:text-white transition-colors">
                Galería
              </a>
              <a href="#faq" className="block text-gray-400 hover:text-white transition-colors">
                Preguntas frecuentes
              </a>
              <a href="/mi-reserva" className="block text-red-400 hover:text-red-300 transition-colors">
                Mi reserva
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm">
              © 2025 Rosario Indoor Kart. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
              <span>en Rosario, Argentina</span>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-xs mt-4">
            <p>Edad mínima: 15 años • Peso máximo: 110 kg • Conducción responsable</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;