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
            ¡Te esperamos para que tengas una experiencia única!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Map */}
          <div className="relative h-96 lg:h-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.209403925736!2d-60.67642862365269!3d-32.998254273571945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7abf60a995aad%3A0xfcbc319555b2e134!2sRosario%20Indoor%20kart!5e0!3m2!1ses-419!2sar!4v1756078076852!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Rosario Indoor Kart"
            />
            
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900">Rosario Indoor Kart</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex flex-col justify-center space-y-8">
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
                  onClick={() => window.open(`https://maps.app.goo.gl/TgfKkuiUcSXH1nUa7left`, '_blank')}
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
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contacto</h3>
                <a
                  href={`tel:${branch.phone}`}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  📞 {branch.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Section - Centered Below */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-left flex items-left justify-left">
            <Car className="h-8 w-8 text-orange-600 mr-3" />
            ¿Cómo llegar?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center justify-center md:justify-start">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                En auto
              </h4>
              <p className="text-sm text-gray-600">
                Fácil acceso desde el centro por Av. Ovidio Lagos.
                Estacionamiento disponible en la zona.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center justify-center md:justify-start">
                <Bus className="h-5 w-5 mr-2 text-green-600" />
                Transporte público
              </h4>
              <p className="text-sm text-gray-600">
                Líneas de colectivos cercanas: <br />112 Negra, 112 Roja, 131, 132, 134, 135, 145 133 Cabin 9, 145 133 Soldini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;