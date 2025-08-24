import React from 'react';
import { MapPin, Clock, Phone, Car, Bus, Navigation } from 'lucide-react';
import { Branch } from '../../types';

interface LocationSectionProps {
  branch: Branch;
}

const LocationSection: React.FC<LocationSectionProps> = ({ branch }) => {
  const openHours = JSON.parse(branch.openHours);
  
  return (
    <section id="ubicacion" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Vení a <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">visitarnos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Te esperamos en el corazón de Rosario con fácil acceso y todas las comodidades
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.123!2d-60.655!3d-32.956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU3JzIxLjYiUyA2MMKwMzknMTguMCJX!5e0!3m2!1sen!2sar!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Rosario Indoor Kart"
            />
            
            {/* Map Overlay */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900">Rosario Indoor Kart</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dirección</h3>
                <p className="text-gray-600 leading-relaxed">
                  {branch.address}
                </p>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                  className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium mt-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Ver en Google Maps</span>
                </button>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Horarios de atención</h3>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Martes a Domingo:</strong> {openHours.start} - {openHours.end}</p>
                  <p><strong className="text-red-600">Lunes:</strong> Cerrado</p>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  💡 Llegá 15 minutos antes de tu horario reservado
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contacto</h3>
                <div className="space-y-2">
                  <a
                    href={`tel:${branch.phone}`}
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    📞 {branch.phone}
                  </a>
                  <a
                    href={`https://wa.me/5493416188143?text=¡Hola! Quiero hacer una consulta sobre karting`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Car className="h-6 w-6 text-orange-600 mr-2" />
                ¿Cómo llegar?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Car className="h-4 w-4 mr-2 text-blue-600" />
                    En auto
                  </h4>
                  <p className="text-sm text-gray-600">
                    Fácil acceso desde el centro por Av. Francia o Av. Pellegrini. 
                    Estacionamiento disponible.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Bus className="h-4 w-4 mr-2 text-green-600" />
                    Transporte público
                  </h4>
                  <p className="text-sm text-gray-600">
                    Líneas de colectivos cercanas: 101, 102, 146. 
                    Parada a 2 cuadras del local.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;