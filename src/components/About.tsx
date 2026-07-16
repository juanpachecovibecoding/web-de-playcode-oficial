import React from 'react';
import { Cpu, Rocket, Users, Lightbulb, Brain, MessageSquare, ShieldCheck } from 'lucide-react';
import eriImage from '../assets/eri.jpg';
import juanImage from '../assets/juan.jpg';

export const About: React.FC = () => {
  return (
    <section id="nosotros" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Top section: About Us Intro and Parque Tecnológico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block px-3 py-1 bg-purple-100 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] text-purple-700 text-sm font-pixel tracking-wide mb-6">
              SOBRE NOSOTROS
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Más de 7 años transformando la educación
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              En Play Code diseñamos, planificamos y llevamos adelante experiencias 
              educativas innovadoras utilizando el enfoque <strong>S.T.E.A.M.</strong> 
              (Ciencia, Tecnología, Ingeniería, Arte y Matemáticas).
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Nuestro propósito es despertar el amor por el conocimiento científico 
              y tecnológico, trabajando de forma integral para potenciar habilidades.
            </p>
          </div>

          <div>
            <div className="bg-slate-900 p-8 text-white border-4 border-indigo-500 shadow-[8px_8px_0_0_#4f46e5] relative overflow-hidden mt-0 lg:mt-24">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
                <Cpu className="w-32 h-32 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Rocket className="text-purple-200 w-5 h-5" /> Parque Tecnológico
              </h3>
              <p className="text-indigo-100 mb-4 leading-relaxed">
                Contamos con kits que rotan según el curso. Destacamos <strong>Arduino</strong>, 
                una placa de desarrollo electrónico para proyectos interactivos enfocados a 
                soluciones reales (ej. contenedor de basura inteligente).
              </p>
            </div>
          </div>
        </div>

        {/* Middle section: El Equipo Directivo */}
        <div className="bg-slate-50 p-6 md:p-10 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a]">
          <h3 className="font-pixel text-2xl text-slate-900 mb-10 flex items-center gap-3">
            <Users className="text-indigo-600 w-8 h-8" /> EL EQUIPO DIRECTIVO
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Erica */}
            <div className="flex flex-col gap-6">
              <img
                src={eriImage}
                alt="Erica Diaz"
                className="w-full aspect-square object-cover shadow-[8px_8px_0_0_#0f172a] border-2 border-slate-900 transition-all duration-300 hover:grayscale"
              />
              <div>
                <h4 className="font-bold text-xl text-slate-900">Erica Diaz</h4>
                <p className="text-sm font-semibold text-purple-600 mb-3">Co-fundadora · Tecnología Educativa & Diseño de Experiencias</p>
                <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>Docente, diseñadora de experiencias educativas y especialista en adopción tecnológica. Lleva más de 8 años enseñando programación y robótica a niños y jóvenes, primero desde Play Code —la plataforma que co-fundó en 2017— y hoy desde el aula de La Salle y el Centro Cristiano Académico en Santa Fe.</p>
                  <p>Tiene formación en Tecnología Educativa (UTN), Diploma Superior en Educación y Nuevas Tecnologías (FLACSO) y fue reconocida como emprendedora destacada por la Secretaría de Ambiente y Desarrollo Sustentable de la Nación.</p>
                  <p>En <a href="https://www.linkedin.com/company/devtechar/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">DevTech</a> lidera el diseño de las experiencias de capacitación: cómo se enseña la tecnología importa tanto como la tecnología misma.</p>
                  <p className="italic font-medium text-slate-900 border-l-4 border-purple-400 pl-4 mt-4 py-1">"No basta con implementar una herramienta. Hay que diseñar la experiencia para que las personas quieran y puedan usarla."</p>
                </div>
              </div>
            </div>

            {/* Juan */}
            <div className="flex flex-col gap-6">
              <img
                src={juanImage}
                alt="Juan Pacheco"
                className="w-full aspect-square object-cover shadow-[8px_8px_0_0_#0f172a] border-2 border-slate-900 transition-all duration-300 hover:grayscale"
              />
              <div>
                <h4 className="font-bold text-xl text-slate-900">Juan Pacheco</h4>
                <p className="text-sm font-semibold text-indigo-600 mb-3">Co-fundador · Gestión Educativa & Estrategia en IA</p>
                <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>Desarrollador con más de 20 años de experiencia en tecnología y una formación poco común: Experto Universitario en Counseling y Diplomado en Gestión Educativa con mención en IA y Análisis de Datos (UTN). También certificado en Azure AI por Microsoft y en IA aplicada por la Universidad de Maryland.</p>
                  <p>Co-fundó Play Code en 2017, donde acompañó a más de 600 familias en el desarrollo de habilidades digitales. Hoy en <a href="https://www.linkedin.com/company/devtechar/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">DevTech</a> diseña e implementa las soluciones técnicas — desde arquitecturas de software hasta sistemas de automatización con IA — con foco en que el cambio tecnológico funcione de verdad para las personas que tienen que adoptarlo.</p>
                  <p className="italic font-medium text-slate-900 border-l-4 border-indigo-400 pl-4 mt-4 py-1">"Construir la solución técnica es solo la mitad del trabajo. La otra mitad es acompañar a las personas que tienen que usarla."</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: Beneficios STEAM */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-pixel text-2xl text-slate-900 mb-8 text-center">BENEFICIOS S.T.E.A.M.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
              <div className="bg-indigo-100 p-3 border-2 border-slate-900 text-indigo-600">
                <Lightbulb className="w-6 h-6" />
              </div>
              <span className="text-slate-800 font-medium text-lg">Favorece el aprendizaje autónomo</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
              <div className="bg-indigo-100 p-3 border-2 border-slate-900 text-indigo-600">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-slate-800 font-medium text-lg">Aumenta la retención y comprensión de conceptos</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
              <div className="bg-indigo-100 p-3 border-2 border-slate-900 text-indigo-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-slate-800 font-medium text-lg">Mejora la creatividad y la comunicación</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
              <div className="bg-indigo-100 p-3 border-2 border-slate-900 text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-slate-800 font-medium text-lg">Fomenta el trabajo en equipo y colaborativo</span>
            </div>

            <div className="flex items-start sm:items-center gap-4 bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all md:col-span-2 w-full max-w-2xl mx-auto">
              <div className="bg-[#ff6b6b] p-3 border-2 border-slate-900 text-white shrink-0 mt-1 sm:mt-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-bold text-lg mb-1">Ciudadanía Digital y Entorno Seguro</span>
                <span className="text-slate-600 text-sm font-medium leading-relaxed">
                  No solo enseñamos tecnología. Fomentamos valores, prevenimos riesgos digitales 
                  y acompañamos a la familia para un uso sano de las herramientas.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
