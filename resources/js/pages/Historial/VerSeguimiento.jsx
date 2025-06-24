import { Activity, CheckCircle, Clock, MapPin, Navigation, Package, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function VerSeguimiento({ orderNumber, steps }) {
  // Calcular el progreso basado en pasos completados
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  
  return (
    <div className="space-y-6 mb-10">
      <div>
        <h3 className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          Rastreo del Pedido {orderNumber}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-blue-600" />
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2
                ${
                  step.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : step.current
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                }
              `}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.current ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  w-0.5 h-12 mt-2
                  ${step.completed ? "bg-green-500" : "bg-gray-300"}
                `}
                />
              )}
            </div>

            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`font-medium ${
                    step.completed ? "text-green-700" : step.current ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h4>
                {step.current && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Actual
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{step.description}</p>
              {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-3">
            <Truck className="h-5 w-5" />
            <span className="text-sm font-medium">Información de Entrega</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo estimado de entrega: 2-3 días hábiles
            </p>
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Transportista: Express Delivery
            </p>
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Código de seguimiento: TR123456789
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}