import React from 'react';
import { Calendar, MapPin, CheckCircle2, Monitor } from 'lucide-react';

export const Courses: React.FC = () => {
  return (
    <section id="cursos" className="py-24 bg-[#ff6b6b] relative border-y-8 border-slate-900">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none pixel-grid-colored"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] text-slate-900 font-pixel tracking-wide mb-4">
            OFERTA ACADÉMICA
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-black">
            Nuestros Cursos
          </h2>
          <p className="text-xl text-white font-medium text-shadow-black-sm">
            Propuestas presenciales y virtuales diseñadas a medida para distintas edades, 
            garantizando el mejor aprendizaje tecnológico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Presencial 1 */}
          <div className="bg-white p-8 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] hover:shadow-[12px_12px_0_0_#0f172a] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#4ecdc4] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-xs px-3 py-1">
              PRESENCIAL
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Aula Maker</h3>
              <p className="text-slate-600 font-medium mb-6">Para chicos de 6 a 8 años</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Inicio: Todo el año</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>CCA Centro Cristiano Académico (4 de Enero 2567, Santa Fe)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Uso de kits de tecnología rotativos</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20informaci%C3%B3n%20del%20curso%20de%20Aula%20Maker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              INSCRIBIRSE
            </a>
          </div>

          {/* Presencial 2 */}
          <div className="bg-white p-8 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] hover:shadow-[12px_12px_0_0_#0f172a] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#4ecdc4] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-xs px-3 py-1">
              PRESENCIAL
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Robótica y Programación</h3>
              <p className="text-slate-600 font-medium mb-6">Para chicos de 9 a 13 años</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Inicio: Todo el año</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>CCA Centro Cristiano Académico (4 de Enero 2567, Santa Fe)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Proyectos avanzados con Arduino</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20informaci%C3%B3n%20del%20curso%20de%20Rob%C3%B3tica%20y%20Programaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              INSCRIBIRSE
            </a>
          </div>

          {/* Virtual */}
          <div className="bg-slate-900 p-8 border-4 border-[#ffe66d] shadow-[8px_8px_0_0_#ffe66d] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#ffe66d] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-xs px-3 py-1">
              VIRTUAL
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">PlayCoders</h3>
              <p className="text-slate-400 font-medium mb-6">Para chicos de 9 a 13 años</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <Calendar className="w-5 h-5 text-[#ffe66d] shrink-0" />
                  <span>Inicio: Todo el año</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <Monitor className="w-5 h-5 text-[#ffe66d] shrink-0" />
                  <span>Para toda Latinoamérica</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#ffe66d] shrink-0" />
                  <span>Plataformas interactivas online</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20informaci%C3%B3n%20del%20curso%20de%20PlayCoders"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#ffe66d] hover:bg-yellow-300 text-slate-900 font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#ffffff] active:shadow-[0px_0px_0_0_#ffffff] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              INSCRIBIRSE AHORA
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
