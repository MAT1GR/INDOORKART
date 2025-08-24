import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = '+5493416188143';
  const defaultMessage = '¡Hola! Quiero consultar sobre karting en Rosario Indoor Kart';

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 p-6 max-w-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Rosario Indoor Kart</div>
                <div className="text-sm text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  En línea
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
              ¡Hola! 👋 ¿Tenés alguna consulta sobre karting? Te ayudamos a reservar tu experiencia de adrenalina.
            </div>
          </div>

          <button
            onClick={openWhatsApp}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Enviar mensaje</span>
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={isOpen ? openWhatsApp : () => setIsOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 relative"
        aria-label="Abrir chat de WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        )}

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;