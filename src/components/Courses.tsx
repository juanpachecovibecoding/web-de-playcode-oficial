import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Courses: React.FC = () => {
  return (
    <section id="servicios" className="py-24 bg-[#152945] relative border-y-8 border-slate-900">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none pixel-grid-colored"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] text-slate-900 font-pixel tracking-wide mb-4">
            QUÉ OFRECEMOS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-black">
            Solución Todo en Uno
          </h2>
          <p className="text-xl text-white font-medium text-shadow-black-sm">
            Te equipamos con la infraestructura, el contenido educativo y las herramientas interactivas 
            para que dirijas tu academia o escuela con excelencia tecnológica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* LMS */}
          <div className="bg-white p-8 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] hover:shadow-[12px_12px_0_0_#0f172a] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#2a5280] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-[10px] px-3 py-1">
              TECNOLOGÍA
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">LMS Marca Blanca</h3>
              <p className="text-slate-600 font-medium mb-6">Tu propio portal de aprendizaje</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Tu logo, nombre y paleta de colores personalizada.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Paneles separados para Administradores, Docentes y Alumnos.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Gestión de aulas, agendas, enlaces de clases virtuales y legajos.</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20solicitar%20una%20demostraci%C3%B3n%20del%20LMS%20Marca%20Blanca"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#152945] hover:bg-[#1e3a5f] text-white font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              SOLICITAR DEMO
            </a>
          </div>

          {/* Currículo */}
          <div className="bg-white p-8 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] hover:shadow-[12px_12px_0_0_#0f172a] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#2a5280] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-[10px] px-3 py-1">
              CURRÍCULO
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Contenido STEAM</h3>
              <p className="text-slate-600 font-medium mb-6">Lecciones listas para el aula</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Secuencias didácticas de Programación, Robótica e IA.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Adaptado para diferentes rangos de edad (6 a 18 años).</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#2a5280] shrink-0" />
                  <span>Guías detalladas para el docente e instructores de tu centro.</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20conocer%20los%20contenidos%20curriculares%20STEAM"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#152945] hover:bg-[#1e3a5f] text-white font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              VER PROGRAMAS
            </a>
          </div>

          {/* Recursos Gamificados */}
          <div className="bg-slate-900 p-8 border-4 border-[#2a5280] shadow-[8px_8px_0_0_#2a5280] hover:-translate-y-1 transition-all relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#1e3a5f] border-l-4 border-b-4 border-slate-900 text-slate-900 font-pixel text-[10px] px-3 py-1">
              RECURSOS
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Recursos Interactivos</h3>
              <p className="text-slate-400 font-medium mb-6">Juegos y simuladores propios</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Acceso a juegos únicos creados por Play Code (Cloud Constructor).</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Gamificación incorporada: cofres, insignias y sistema de ítems.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Actualizaciones constantes y mantenimiento de servidores incluido.</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491173708555?text=Hola,%20quiero%20conocer%20los%20recursos%20interactivos%20de%20Play%20Code"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#1e3a5f] hover:bg-[#2a5280] text-slate-900 font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#ffffff] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center block"
            >
              PROBAR RECURSOS
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
