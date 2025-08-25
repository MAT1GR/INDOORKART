import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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

const faqs = [
  {
    question: '¿Puedo ir sin reserva?',
    answer: 'No recomendamos venir sin reserva ya que trabajamos con horarios específicos y cupos limitados. La reserva online te garantiza tu lugar y evita esperas innecesarias.',
  },
  {
    question: '¿Qué pasa si llueve?',
    answer: 'Nuestro circuito es 100% cubierto, por lo que funcionamos con cualquier clima. Rain or shine, ¡la diversión está asegurada!',
  },
  {
    question: '¿Los cascos están incluidos?',
    answer: 'Sí, proporcionamos cascos homologados sin costo adicional. Son sanitizados después de cada uso para tu seguridad e higiene.',
  },
  {
    question: '¿Puedo cancelar mi reserva?',
    answer: 'Podés cancelar hasta 24 horas antes, pero la seña del 50% no se reintegra. También podés reprogramar una vez sin costo adicional.',
  },
  {
    question: '¿Hay descuentos para grupos grandes?',
    answer: 'Consultá por WhatsApp sobre promociones especiales para grupos de 6 o más personas, cumpleaños, despedidas y eventos corporativos.',
  },
  {
    question: '¿Qué incluye cada plan?',
    answer: 'Todos los planes incluyen briefing de seguridad, uso de casco, 2 vueltas de clasificación, vueltas de carrera según el plan y cronometraje computarizado.',
  },
  {
    question: '¿Necesito experiencia previa?',
    answer: 'No es necesario. Brindamos un briefing completo antes de cada carrera y nuestro personal supervisa constantemente para garantizar tu seguridad.',
  },
  {
    question: '¿Qué formas de pago aceptan?',
    answer: 'Aceptamos efectivo (mejor precio), transferencia bancaria, Mercado Pago y tarjetas de débito/crédito. Se requiere seña del 50% para confirmar la reserva.',
  },
  {
    question: '¿Los menores de edad pueden correr?',
    answer: 'Sí, pero deben tener mínimo 15 años cumplidos y presentar documento. Los menores de 18 necesitan autorización de un adulto responsable presente.',
  },
  {
    question: '¿Hay estacionamiento?',
    answer: 'Sí, disponemos de estacionamiento gratuito para nuestros clientes. También hay opciones de transporte público cercanas.',
  },
];

const FAQSection: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Preguntas <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">frecuentes</span>
          </h2>
          <p className="text-xl text-gray-600">
            Respondemos las dudas más comunes para que tengas toda la información
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-2xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-2 rounded-lg mt-1">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                </div>
                
                <div className="flex-shrink-0">
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="ml-12">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ¿No encontraste tu respuesta?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está disponible para resolver todas tus dudas
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href={`https://wa.me/5493416188143?text=¡Hola! Tengo una consulta sobre karting`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                <span><WhatsAppIcon></WhatsAppIcon></span>
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;