import React from 'react';
import { School, Puzzle, CalendarDays, GraduationCap, Mic } from 'lucide-react';

export const Schools: React.FC = () => {
  return (
    <section id="escuelas" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-32">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172B] mb-6 leading-tight" style={{ textShadow: '4px 4px 0 #e2e8f0' }}>
                EL <span className="text-[#FF6B6B]">ALIADO ACADÉMICO</span> PARA TU COLEGIO
              </h2>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Desarrollamos y coordinamos la estrategia de Educación Digital 
                institucional desde sala de 4 años hasta 5to año de secundaria.
              </p>
              <a
                href="https://wa.me/5491173708555?text=Hola,%20quiero%20solicitar%20informaci%C3%B3n%20sobre%20el%20servicio%20de%20asesor%C3%ADa%20para%20colegios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center px-6 py-3 bg-[#4ecdc4] hover:bg-[#3dbdb4] text-slate-900 font-pixel tracking-wide border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[6px] active:translate-x-[6px] transition-all"
              >
                CONTACTAR A ASESORÍA
              </a>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Service 1 (Highlighted) */}
              <div className="p-6 border-4 border-slate-900 hover:-translate-y-1 transition-all shadow-[6px_6px_0_0_#0f172a] hover:shadow-[10px_10px_0_0_#0f172a] bg-[#ffe66d] sm:col-span-2">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#0f172a] bg-[#ff6b6b] text-white">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="font-pixel text-xl text-slate-900 mb-3 uppercase">Implementación Curricular</h3>
                <p className="text-slate-800 font-medium leading-relaxed">Diseñamos la ruta de aprendizaje articulando programación, robótica e IA directamente dentro del horario escolar.</p>
              </div>

              {/* Service 2 */}
              <div className="p-6 border-4 border-slate-900 hover:-translate-y-1 transition-all shadow-[6px_6px_0_0_#0f172a] hover:shadow-[10px_10px_0_0_#0f172a] bg-white">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#0f172a] bg-[#4ecdc4] text-slate-900">
                  <Puzzle className="w-6 h-6" />
                </div>
                <h3 className="font-pixel text-xl text-slate-900 mb-3 uppercase">Talleres Extraescolares</h3>
                <p className="text-slate-800 font-medium leading-relaxed">1 hora semanal con actividades planificadas y kits propios. Disponible en opción presencial o virtual.</p>
              </div>

              {/* Service 3 */}
              <div className="p-6 border-4 border-slate-900 hover:-translate-y-1 transition-all shadow-[6px_6px_0_0_#0f172a] hover:shadow-[10px_10px_0_0_#0f172a] bg-white">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#0f172a] bg-[#4ecdc4] text-slate-900">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className="font-pixel text-xl text-slate-900 mb-3 uppercase">Días Especiales</h3>
                <p className="text-slate-800 font-medium leading-relaxed">"Club del Codigo en la escuela": actividades de programación y robótica diseñadas para alumnos de 5 a 13 años.</p>
              </div>

              {/* Service 4 */}
              <div className="p-6 border-4 border-slate-900 hover:-translate-y-1 transition-all shadow-[6px_6px_0_0_#0f172a] hover:shadow-[10px_10px_0_0_#0f172a] bg-white">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#0f172a] bg-[#4ecdc4] text-slate-900">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-pixel text-xl text-slate-900 mb-3 uppercase">Capacitación Docente</h3>
                <p className="text-slate-800 font-medium leading-relaxed">Recursos como "Aula STEAM" para alfabetización digital y "Workshop de IA para docentes" usando herramientas como Google AI Studio. Disponible en opción presencial o virtual.</p>
              </div>

              {/* Service 5 */}
              <div className="p-6 border-4 border-slate-900 hover:-translate-y-1 transition-all shadow-[6px_6px_0_0_#0f172a] hover:shadow-[10px_10px_0_0_#0f172a] bg-white">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#0f172a] bg-[#4ecdc4] text-slate-900">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="font-pixel text-xl text-slate-900 mb-3 uppercase">Conferencias para Familias</h3>
                <p className="text-slate-800 font-medium leading-relaxed">Charlas sobre tecnología y educación digital impartidas por Erica Diaz, experta en educación digital y familia.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
