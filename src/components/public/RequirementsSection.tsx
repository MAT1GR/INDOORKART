import React from 'react';
import { AlertTriangle, Users, Scale, Clock, Shield, FileText } from 'lucide-react';

const requirements = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Edad mínima: 15 años',
    description: 'Requisito estricto por seguridad. Traer documento de identidad.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: 'Peso máximo: 110 kg',
    description: 'Por las características técnicas de nuestros karts profesionales.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Llegar 15 min antes',
    description: 'Tiempo necesario para el briefing de seguridad obligatorio.',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Documento válido',
    description: 'DNI, pasaporte o licencia de conducir para verificar edad.',
    color: 'text-purple-600 bg-purple-100',
  },
];

const safetyRules = [
  'Uso obligatorio de casco (incluido)',
  'Prohibido el contacto intencional',
  'Velocidad controlada según experiencia',
  'Personal capacitado supervisando',
  'Karts con sistemas de seguridad',
  'Pista diseñada para máxima seguridad',
];

const RequirementsSection: React.FC = () => {
  return (
    <section id="requisitos" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Requisitos y <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Seguridad</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu seguridad es lo más importante. Conocé todo lo que necesitás para disfrutar al máximo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Requirements */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              Requisitos obligatorios
            </h3>

            <div className="space-y-6">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className={`p-2 rounded-lg ${req.color}`}>
                    {req.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {req.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {req.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mt-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">
                    ¡Importante!
                  </h4>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    Estos requisitos son <strong>no negociables</strong> por razones de seguridad. 
                    Si no cumplís con alguno, no podremos permitir tu participación en la carrera.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Rules */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              Normas de seguridad
            </h3>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="space-y-4">
                {safetyRules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">
                      Compromiso con la seguridad
                    </h4>
                    <p className="text-green-700 text-sm">
                      Nuestro personal está entrenado para garantizar que todos 
                      disfruten de una experiencia emocionante pero siempre segura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-6">
            ¿Qué incluye tu experiencia?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="font-medium mb-2">Equipamiento</h4>
              <p className="text-sm text-red-100">Casco homologado incluido</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="font-medium mb-2">Briefing</h4>
              <p className="text-sm text-red-100">Instrucción de seguridad</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-8 w-8" />
              </div>
              <h4 className="font-medium mb-2">Cronometraje</h4>
              <p className="text-sm text-red-100">Tiempos en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;