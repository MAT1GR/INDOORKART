import React from 'react';
import { Trophy, Clock, Zap, Crown, Star } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { Plan } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const PlansSection: React.FC = () => {
  const { data: plans, loading } = useApi<Plan[]>('/public/plans?method=cash');

  if (loading) {
    return (
      <section id="planes" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white">Cargando planes...</p>
          </div>
        </div>
      </section>
    );
  }

  const getPlanIcon = (planName: string) => {
    if (planName.includes('15')) return <Crown className="h-8 w-8" />;
    if (planName.includes('Doble') || planName.includes('Promo')) return <Star className="h-8 w-8" />;
    return <Trophy className="h-8 w-8" />;
  };

  const getPlanColor = (index: number) => {
    const colors = ['from-blue-600 to-blue-700', 'from-red-600 to-red-700', 'from-purple-600 to-purple-700'];
    return colors[index % colors.length];
  };

  return (
    <section id="planes" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Elegí tu <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">experiencia</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Todos los planes incluyen 2 vueltas de clasificación + briefing de seguridad + cronometraje computarizado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans?.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${getPlanColor(index)} p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/10 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-white mb-6">
                  {getPlanIcon(plan.name)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-white">
                    <Clock className="h-4 w-4 mr-3 text-yellow-300" />
                    <span className="text-sm">{plan.qualyLaps} vueltas clasificación</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Zap className="h-4 w-4 mr-3 text-yellow-300" />
                    <span className="text-sm">{plan.raceLaps} vueltas de carrera</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Trophy className="h-4 w-4 mr-3 text-yellow-300" />
                    <span className="text-sm">Cronometraje profesional</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-white mb-1">
                    {plan.currentPrice ? formatCurrency(plan.currentPrice.amount / 100) : 'Consultar'}
                  </div>
                  <div className="text-sm text-blue-100">por piloto (efectivo)</div>
                </div>

                {/* CTA */}
                <Button
                  variant="secondary"
                  className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => {
                    const bookingSection = document.querySelector('#booking');
                    bookingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Elegir este plan
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Formas de pago</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">💵</div>
              <div className="text-white font-medium">Efectivo</div>
              <div className="text-green-400 text-sm">Mejor precio</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">🏦</div>
              <div className="text-white font-medium">Transferencia</div>
              <div className="text-gray-400 text-sm">Bancaria</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-white font-medium">Mercado Pago</div>
              <div className="text-gray-400 text-sm">Online</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-white font-medium">Tarjeta</div>
              <div className="text-gray-400 text-sm">Débito/Crédito</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            Se requiere seña del 50% para confirmar la reserva
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;