import React, { useState } from 'react';
import { Search, ExternalLink, Cpu, Code, Sparkles, BookOpen, Layers, ArrowLeft, Terminal, Users } from 'lucide-react';
import type { Resource, Course } from '../App';

interface PublicResourcesProps {
  resources: Resource[];
  courses: Course[];
  onBack: () => void;
}

// Featured default resources used at Play Code when custom resources are empty or as showcase
const DEFAULT_STEAM_RESOURCES: Resource[] = [
  {
    id: 'def-1',
    name: 'Arduino Web Editor & Cloud',
    description: 'Entorno de programación y simulación electrónica para proyectos de robótica interactiva y automatización.',
    courseId: 'Robótica y Programación',
    url: 'https://create.arduino.cc/',
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    ageGroup: '9 a 13 años'
  },
  {
    id: 'def-2',
    name: 'Scratch MIT',
    description: 'Plataforma del MIT para aprender programación por bloques, crear videojuegos, historias animadas y dinámicas lógicas.',
    courseId: 'Aula Maker',
    url: 'https://scratch.mit.edu/',
    imageUrl: 'https://images.unsplash.com/photo-1516116211223-4c71424afd67?w=600&auto=format&fit=crop&q=80',
    ageGroup: '6 a 8 años'
  },
  {
    id: 'def-3',
    name: 'Tinkercad Circuits & 3D',
    description: 'Modelado 3D y simulación virtual de circuitos integrados con sensores, motores y componentes electrónicos.',
    courseId: 'Robótica y Programación',
    url: 'https://www.tinkercad.com/',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    ageGroup: '9 a 13 años'
  },
  {
    id: 'def-4',
    name: 'Code.org Studio',
    description: 'Plataforma internacional de ciencias de la computación con desafíos de lógica y código paso a paso para estudiantes.',
    courseId: 'PlayCoders',
    url: 'https://studio.code.org/',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    ageGroup: '6 a 13 años'
  },
  {
    id: 'def-5',
    name: 'Google AI Studio',
    description: 'Herramientas de experimentación con modelos de Inteligencia Artificial para proyectos educativos y prototipos.',
    courseId: 'Capacitación Docente & IA',
    url: 'https://aistudio.google.com/',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    ageGroup: 'Docentes & Familias'
  },
  {
    id: 'def-6',
    name: 'MakeCode micro:bit',
    description: 'Editor visual y en Python para programar dispositivos físicos, sensores de movimiento y microcontroladores.',
    courseId: 'Aula Maker',
    url: 'https://makecode.microbit.org/',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
    ageGroup: '6 a 13 años'
  }
];

export const PublicResources: React.FC<PublicResourcesProps> = ({ resources, courses, onBack }) => {
  const [search, setSearch] = useState('');

  // Combine custom Firestore resources and default resources (filtering duplicates if any)
  const displayResources = resources.length > 0 ? resources : DEFAULT_STEAM_RESOURCES;

  const filteredResources = displayResources.filter(res => {
    return res.name.toLowerCase().includes(search.toLowerCase()) || 
           res.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0d1b2e] text-white font-sans selection:bg-[#ffe66d] selection:text-slate-900 flex flex-col">
      
      {/* Header */}
      <header className="bg-[#001F4A] border-b-4 border-slate-900 px-6 py-4 flex items-center justify-between shadow-[0_4px_0_0_#000000] shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#4ecdc4] p-1.5 border-2 border-slate-900 text-slate-900 font-pixel text-[10px] tracking-widest uppercase">
            Play Code
          </div>
          <span className="text-white font-extrabold text-sm tracking-wide hidden sm:inline">Recursos Educativos</span>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-white border-2 border-slate-900 shadow-[3px_3px_0_0_#000] active:translate-y-[2px] active:shadow-none font-pixel text-xs tracking-wider uppercase cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la Web
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Banner Section */}
        <div className="bg-slate-900 border-4 border-[#ffe66d] shadow-[8px_8px_0_0_#ffe66d] p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <Cpu className="w-64 h-64 text-[#ffe66d]" />
          </div>
          
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffe66d] border-2 border-slate-900 text-slate-900 font-pixel text-xs tracking-wider">
              <Sparkles className="w-4 h-4" /> HERRAMIENTAS & RECURSOS STEAM
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Recursos Digitales para el Aprendizaje
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
              Explorá las aplicaciones, plataformas de programación, simuladores y recursos interactivos que utilizamos en nuestras clases e instituciones educativas.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar recurso por nombre o descripción..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-slate-700 focus:border-[#4ecdc4] text-white text-sm font-semibold rounded shadow-[3px_3px_0_0_#000] focus:outline-none transition-all placeholder:text-slate-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Counter Badge */}
          <div className="flex items-center gap-2 font-pixel text-xs text-[#4ecdc4] bg-slate-900 border-2 border-slate-700 px-4 py-3 shadow-[3px_3px_0_0_#000] shrink-0">
            <Layers className="w-4 h-4" />
            <span>{filteredResources.length} {filteredResources.length === 1 ? 'RECURSO' : 'RECURSOS'}</span>
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.length === 0 ? (
            <div className="col-span-full bg-slate-900 border-4 border-slate-700 p-12 text-center text-slate-400 font-semibold rounded shadow-[6px_6px_0_0_#000]">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-base text-white font-bold mb-1">No se encontraron recursos</p>
              <p className="text-xs text-slate-400">Intenta buscar con otros términos o limpia el filtro de búsqueda.</p>
            </div>
          ) : (
            filteredResources.map((res) => {
              const relatedCourse = courses.find(c => c.id === res.courseId || c.title === res.courseId);
              const courseTag = relatedCourse ? relatedCourse.title : (res.courseId || 'Herramienta STEAM');

              return (
                <div
                  key={res.id}
                  className="bg-slate-900 border-4 border-slate-800 hover:border-[#4ecdc4] p-6 shadow-[6px_6px_0_0_#000000] hover:shadow-[10px_10px_0_0_#4ecdc4] hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Image Preview or Fallback Header */}
                    {res.imageUrl ? (
                      <div className="overflow-hidden border-2 border-slate-800 rounded h-40 bg-slate-950">
                        <img
                          src={res.imageUrl}
                          alt={res.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-slate-950 border-2 border-slate-800 rounded flex items-center justify-center text-[#4ecdc4] group-hover:text-[#ffe66d] transition-colors">
                        <Terminal className="w-12 h-12" />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-pixel px-2.5 py-1 bg-[#ffe66d] text-slate-900 border border-slate-900 font-bold uppercase tracking-wider">
                          {courseTag}
                        </span>
                        {res.ageGroup && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#1e385c] text-[#4ecdc4] border border-[#2a4e7c] rounded flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#ffe66d]" /> {res.ageGroup}
                          </span>
                        )}
                      </div>
                      <Code className="w-4 h-4 text-[#4ecdc4] shrink-0" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-white group-hover:text-[#4ecdc4] transition-colors leading-snug">
                      {res.name}
                    </h3>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-4 border-t border-slate-800">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-[#4ecdc4] hover:bg-[#3dbdb4] text-slate-900 font-pixel tracking-wide border-4 border-slate-900 shadow-[4px_4px_0_0_#000000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer no-underline font-bold"
                    >
                      ACCEDER AL RECURSO <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 border-t-2 border-slate-800 bg-[#001F4A] text-center text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0 mt-16">
        © {new Date().getFullYear()} Play Code. Plataforma Educativa S.T.E.A.M.
      </footer>

    </div>
  );
};
