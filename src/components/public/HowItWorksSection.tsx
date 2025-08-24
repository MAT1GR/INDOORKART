import React from 'react';
import { Calendar, Clock, Car, Trophy, CheckCircle, Users } from 'lucide-react';

const steps = [
  {
    icon: <Calendar className="h-8 w-8" />,
    title: '1. Reservá online',
    description: 'Elegí tu fecha, horario y plan favorito. Confirmá con seña del 50%.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: '2. Llegá 15 min antes',
    description: 'Vení con documento. Te esperamos en Anchorena 2751 para el briefing.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: '3. ¡A correr!',
    description: 'Clasificación + carrera con cronometraje computarizado en tiempo real.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: '4. Conocé tu tiempo',
    description: 'Recibí tu posición final y tiempos de vuelta. ¡Desafiate a mejorar!',
    color: 'from-purple-500 to-purple-600',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Cómo <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">funciona?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde la reserva hasta la bandera a cuadros, todo está pensado para que vivas la mejor experiencia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}

              {/* Step Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
            <div className="text-red-600 mb-4">
              <Users className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Hasta 8 pilotos
            </h3>
            <p className="text-gray-600">
              Reservá desde 1 hasta 8 karts para tu grupo. Perfecta para cumpleaños, despedidas o salidas con amigos.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <div className="text-blue-600 mb-4">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Seguridad total
            </h3>
            <p className="text-gray-600">
              Briefing obligatorio, equipamiento incluido y pista diseñada con las mejores medidas de seguridad.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
            <div className="text-green-600 mb-4">
              <Trophy className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Cronometraje pro
            </h3>
            <p className="text-gray-600">
              Sistema computarizado que registra cada vuelta en tiempo real. ¡Conocé tu posición al instante!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;