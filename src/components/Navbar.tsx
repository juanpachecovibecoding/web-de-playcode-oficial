import React, { useState, useEffect } from 'react';
import { Code2, Menu, X } from 'lucide-react';

interface NavbarProps {
  onGoToPlatform: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoToPlatform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#001F4A] p-2 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] text-[#F2900F]">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="font-pixel text-xl sm:text-2xl tracking-wide text-slate-900">
              Play Code
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#nosotros"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Nosotros
            </a>
            <a
              href="#cursos"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Cursos
            </a>
            <a
              href="#escuelas"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Para Escuelas
            </a>
            <a
              href="#empresas"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Para Empresas
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                onGoToPlatform();
              }}
              className="px-6 py-2.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-pixel tracking-wide border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer"
            >
              IR A LA PLATAFORMA
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden bg-white border-t border-slate-100 w-full absolute left-0 top-full shadow-lg`}
      >
        <div className="px-4 py-4 space-y-4 flex flex-col">
          <a
            href="#nosotros"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-indigo-600"
          >
            Nosotros
          </a>
          <a
            href="#cursos"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-indigo-600"
          >
            Cursos
          </a>
          <a
            href="#escuelas"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-indigo-600"
          >
            Para Escuelas
          </a>
          <a
            href="#empresas"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-indigo-600"
          >
            Para Empresas
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              onGoToPlatform();
            }}
            className="w-full px-6 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-pixel tracking-wide border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all text-center uppercase cursor-pointer"
          >
            IR A LA PLATAFORMA
          </button>
        </div>
      </div>
    </nav>
  );
};
