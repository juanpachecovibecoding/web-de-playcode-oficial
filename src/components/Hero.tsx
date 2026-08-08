import React from 'react';
import { Sparkles, Rocket, MonitorPlay } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none pixel-grid"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-16 h-16 bg-[#1e3a5f] border-4 border-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,0.1)] animate-bounce"
          style={{ animationDuration: '3s' }}
        ></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#2a5280] border-4 border-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,0.1)] rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#152945] border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] text-white font-pixel tracking-wide mb-8 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="leading-relaxed">LEVEL UP EDUCACIÓN S.T.E.A.M.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            La plataforma STEAM <br className="hidden sm:block" />
            <span className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#152945] tracking-wider block mt-4 sm:mt-6 text-shadow-slate">
              PARA TU ACADEMIA O COLEGIO
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Potencia tu institución educativa con nuestra <strong>plataforma LMS de marca blanca</strong>. 
            Te proveemos de recursos interactivos únicos, lecciones listas para usar, y el software necesario 
            para que gestiones a tus docentes y alumnos de forma profesional.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-[#152945] hover:bg-[#1e3a5f] text-white font-pixel tracking-wide border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[6px] active:translate-x-[6px] transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              <Rocket className="w-5 h-5 shrink-0" />
              CONOCER LA SOLUCIÓN
            </a>
            <a
              href="#nosotros"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-pixel tracking-wide border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[6px] active:translate-x-[6px] transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              <MonitorPlay className="w-5 h-5 shrink-0" />
              SOBRE NOSOTROS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
