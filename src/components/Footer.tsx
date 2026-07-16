import React from 'react';
import { Code2, Instagram, Facebook, Linkedin, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-slate-950 text-slate-300 py-16 border-t-8 border-slate-900 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none pixel-grid-cyan"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 text-white">
              <div className="bg-[#001F4A] p-2 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] text-[#F2900F]">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="font-pixel font-bold text-xl sm:text-2xl tracking-wide">Play Code</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Despertando el amor por la ciencia y tecnología a través del enfoque STEAM para formar los creadores del mañana.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/playcodelatam/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 border-2 border-transparent hover:border-[#4ecdc4] text-slate-400 hover:text-[#4ecdc4] hover:shadow-[4px_4px_0_0_#4ecdc4] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/playcodelatam/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 border-2 border-transparent hover:border-[#ff6b6b] text-slate-400 hover:text-[#ff6b6b] hover:shadow-[4px_4px_0_0_#ff6b6b] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/playcodelatam"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 border-2 border-transparent hover:border-[#ffe66d] text-slate-400 hover:text-[#ffe66d] hover:shadow-[4px_4px_0_0_#ffe66d] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-pixel text-white mb-6 tracking-wide text-sm sm:text-base">NAVEGACIÓN</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#nosotros" className="hover:text-[#4ecdc4] transition-colors">Sobre Nosotros</a></li>
              <li><a href="#cursos" className="hover:text-[#4ecdc4] transition-colors">Cursos y Oferta Académica</a></li>
              <li><a href="#escuelas" className="hover:text-[#4ecdc4] transition-colors">Propuestas para Escuelas</a></li>
              <li><a href="#empresas" className="hover:text-[#4ecdc4] transition-colors">Experiencias Corporativas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-white mb-6 tracking-wide text-sm sm:text-base">CURSOS DESTACADOS</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>Aula Maker (6 a 8 años)</li>
              <li>Robótica y Programación (9 a 13 años)</li>
              <li>PlayCoders Virtual (Latam)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-white mb-6 tracking-wide text-sm sm:text-base">CONTACTO</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#ff6b6b] w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  Belgrano 3349<br />
                  Santa Fe, Argentina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#ffe66d] w-5 h-5 shrink-0" />
                <a href="mailto:hola@playcode.com.ar" className="hover:text-[#ffe66d] transition-colors">
                  hola@playcode.com.ar
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t-4 border-slate-900 mt-16 pt-8 text-center text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 font-medium">
          <p>© {currentYear} Play Code. Todos los derechos reservados.</p>
          <p>
            Diseñado con <span className="text-[#ff6b6b] text-lg leading-none align-middle">♥</span> para el futuro.
          </p>
        </div>
      </div>
    </footer>
  );
};
