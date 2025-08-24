import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Branch } from '../../types';

interface ContactSectionProps {
  branch: Branch;
}

const ContactSection: React.FC<ContactSectionProps> = ({ branch }) => {
  const openHours = JSON.parse(branch.openHours);

  return (
    <section id="contacto" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para la <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">adrenalina?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Contactanos para reservar tu experiencia o resolver cualquier duda que tengas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Información de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Dirección</h4>
                    <p className="text-gray-300">{branch.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Teléfono</h4>
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">WhatsApp</h4>
                    <a
                      href={`https://wa.me/5493416188143?text=¡Hola! Quiero hacer una consulta sobre karting`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      Enviar mensaje
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-600 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Horarios</h4>
                    <div className="text-gray-300 space-y-1">
                      <p>Martes a Domingo: {openHours.start} - {openHours.end}</p>
                      <p className="text-red-400">Lunes: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`https://wa.me/5493416188143?text=¡Hola! Quiero reservar una carrera de karting`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-colors group"
              >
                <MessageCircle className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold mb-1">WhatsApp</h4>
                <p className="text-sm text-green-100">Respuesta inmediata</p>
              </a>

              <a
                href={`tel:${branch.phone}`}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center transition-colors group"
              >
                <Phone className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold mb-1">Llamar</h4>
                <p className="text-sm text-blue-100">Atención personalizada</p>
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 rounded-2xl text-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">¡Tu carrera te está esperando!</h3>
              <p className="text-red-100 text-lg">
                Reservá ahora y asegurate tu lugar en la pista
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-4">🏁 ¿Por qué elegir Rosario Indoor Kart?</h4>
                <ul className="space-y-3 text-red-100">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Circuito cubierto de 330m²</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Cronometraje computarizado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Karts profesionales mantenidos diariamente</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Personal capacitado en seguridad</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Buffet y área de descanso</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ¡RESERVÁ TU EXPERIENCIA!
                </button>
                <p className="text-red-200 text-sm mt-3">
                  Seña del 50% • Confirmación inmediata • Diversión garantizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;