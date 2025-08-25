import React from 'react';
import { Calendar, UserCheck, Flag, Trophy } from 'lucide-react';

const steps = [
  {
    icon: <Calendar className="h-10 w-10 text-red-400" />,
    title: '1. Reservá tu Turno',
    description: 'Elegí el día y la hora que prefieras. Podés reservar para vos o para todo tu grupo de amigos.',
  },
  {
    icon: <UserCheck className="h-10 w-10 text-red-400" />,
    title: '2. Equipate y Briefing',
    description: 'Te damos todo el equipo necesario y una breve charla de seguridad antes de empezar.',
  },
  {
    icon: <Flag className="h-10 w-10 text-red-400" />,
    title: '3. Clasificación y Carrera',
    description: 'Salí a la pista, clasificá y demostrá quién es el más rápido en la carrera final.',
  },
  {
    icon: <Trophy className="h-10 w-10 text-red-400" />,
    title: '4. Podio y Resultados',
    description: 'Al final, revisamos los tiempos de todos. ¡El más rápido se lleva la gloria!',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Cómo <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">funciona</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Correr es muy simple. Seguí estos 4 pasos y preparate para la adrenalina.
          </p>
        </div>

        <div className="relative">
          {/* Línea de fondo (solo en desktop) */}
          <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-full bg-gray-800" />

          <div className="relative flex flex-col items-center space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex w-full md:w-1/2 items-center mb-0 md:mb-16
                  ${index % 2 === 0 ? 'md:pr-12 md:self-start' : 'md:pl-12 md:self-end'}
                `}
              >
                {/* Contenido de la Tarjeta */}
                <div className={`bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 w-full text-center md:text-left transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10`}>
                  <div className="mb-4 inline-block">{step.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                
                {/* Círculo en la línea (solo en desktop) */}
                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full border-4 border-black 
                  ${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}
                `}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;