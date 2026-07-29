import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, X, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklySlots: { [key: string]: string[] };
  existingBookings: Array<{ date: string; timeSlot: string; status: string }>;
  onSubmitBooking: (bookingData: {
    date: string;
    timeSlot: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    notes: string;
  }) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  weeklySlots,
  existingBookings,
  onSubmitBooking,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar');

  // Form Fields
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const dayKeysEN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const monthNamesES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const isDateInPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(dateStr + 'T00:00:00');
    return dateToCheck < today;
  };

  // Get available slots for a specific date
  const getSlotsForDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayIndex = dateObj.getDay();
    const dayKey = dayKeysEN[dayIndex];
    const slots = weeklySlots[dayKey] || [];
    return slots;
  };

  const isSlotBooked = (dateStr: string, slotStr: string) => {
    return existingBookings.some(
      b => b.date === dateStr && b.timeSlot === slotStr && b.status !== 'Cancelada'
    );
  };

  const handleDateSelect = (day: number) => {
    const dateStr = formatDateString(year, month, day);
    if (isDateInPast(dateStr)) return;

    const slots = getSlotsForDate(dateStr);
    if (slots.length === 0) return; // No slots configured for this weekday

    setSelectedDateStr(dateStr);
    setSelectedSlot(null);
    setStep('calendar'); // Stay on calendar view to pick a slot
  };

  const handleNextStep = () => {
    if (selectedDateStr && selectedSlot) {
      setStep('form');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr || !selectedSlot || !visitorName.trim() || !visitorEmail.trim() || !visitorPhone.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmitBooking({
        date: selectedDateStr,
        timeSlot: selectedSlot,
        visitorName: visitorName.trim(),
        visitorEmail: visitorEmail.trim(),
        visitorPhone: visitorPhone.trim(),
        notes: notes.trim(),
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al agendar la reunión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedDateStr(null);
    setSelectedSlot(null);
    setVisitorName('');
    setVisitorEmail('');
    setVisitorPhone('');
    setNotes('');
    setStep('calendar');
    setError('');
    onClose();
  };

  // Days Grid
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <div className="fixed inset-0 bg-[#0d1b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#001F4A] text-white px-5 py-4 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#F2900F] p-1.5 border-2 border-slate-900 text-[#001F4A]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-sm sm:text-base tracking-wider">Agendar Reunión Informativa</h3>
          </div>
          <button onClick={resetModal} className="text-slate-400 hover:text-white font-bold text-lg leading-none cursor-pointer p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {step === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Calendar Date Picker */}
              <div className="md:col-span-7">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-900 text-sm">{monthNamesES[month]} {year}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 border-2 border-slate-900 hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 border-2 border-slate-900 hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, idx) => (
                    <div key={idx} className="font-extrabold text-slate-400 py-1 uppercase">{d}</div>
                  ))}
                  {daysArray.map((day, idx) => {
                    if (day === null) return <div key={idx} className="p-2"></div>;

                    const dateStr = formatDateString(year, month, day);
                    const isPast = isDateInPast(dateStr);
                    const slots = getSlotsForDate(dateStr);
                    const hasSlots = slots.length > 0;
                    const isSelected = selectedDateStr === dateStr;

                    // Disable past days, or days with no slots configured
                    const isDisabled = isPast || !hasSlots;

                    return (
                      <button
                        key={idx}
                        disabled={isDisabled}
                        onClick={() => handleDateSelect(day)}
                        className={`p-2 border font-bold text-xs transition-all ${
                          isSelected
                            ? 'bg-[#ffe66d] border-2 border-slate-900 shadow-[2px_2px_0_0_#000] z-10 text-slate-900'
                            : isDisabled
                              ? 'text-slate-300 border-transparent bg-transparent cursor-not-allowed'
                              : 'border-slate-200 hover:border-slate-900 hover:bg-slate-50 cursor-pointer text-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-4">
                  * Las reuniones se realizan de lunes a viernes en los horarios disponibles.
                </div>
              </div>

              {/* Right Column: Time Slots */}
              <div className="md:col-span-5 flex flex-col border-t-2 md:border-t-0 md:border-l-2 border-slate-100 pt-6 md:pt-0 md:pl-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2ec4b6]" />
                  Horarios Disponibles
                </h4>

                {selectedDateStr ? (
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-bold text-slate-500 mb-3">
                      Seleccionado: <span className="text-slate-900">{new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </p>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex-1">
                      {getSlotsForDate(selectedDateStr).map((slot, idx) => {
                        const isBooked = isSlotBooked(selectedDateStr, slot);
                        const isSlotSelected = selectedSlot === slot;

                        return (
                          <button
                            key={idx}
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full py-2.5 px-3 text-left border-2 font-bold text-xs transition-all flex justify-between items-center ${
                              isBooked
                                ? 'bg-slate-50 border-slate-200 text-slate-350 cursor-not-allowed'
                                : isSlotSelected
                                  ? 'bg-[#2ec4b6] border-slate-900 text-white shadow-[2px_2px_0_0_#000] translate-y-[-1px]'
                                  : 'bg-white border-slate-300 hover:border-slate-900 text-slate-700 cursor-pointer'
                            }`}
                          >
                            <span>{slot}</span>
                            <span className="text-[10px] font-extrabold uppercase">
                              {isBooked ? 'Ocupado' : (isSlotSelected ? 'Seleccionado' : 'Disponible')}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={!selectedSlot}
                      onClick={handleNextStep}
                      className="w-full mt-4 py-3 bg-[#0d1b2e] hover:bg-[#1e385c] text-white font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 italic">
                    Selecciona una fecha en el calendario para ver los horarios disponibles.
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="max-w-lg mx-auto">
              {/* Back Button */}
              <button
                onClick={() => setStep('calendar')}
                className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al calendario
              </button>

              <div className="bg-[#f8fafc] border-2 border-slate-200 p-4 mb-6 rounded text-xs">
                <span className="font-bold text-slate-450 block uppercase tracking-wider text-[9px] mb-1">Reunión Informativa Reservada</span>
                <p className="font-bold text-slate-800">
                  📅 {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="font-bold text-[#2ec4b6] mt-0.5">
                  ⏰ {selectedSlot} hs
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-500 text-red-950 font-bold p-3 text-xs mb-4 rounded leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder="juan.perez@email.com"
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Teléfono / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="+54 9 11 1234 5678"
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">¿Qué te gustaría consultar? (Opcional)</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Consultas sobre costos, edades, clases de prueba, etc."
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-[#2ec4b6] hover:bg-[#20a396] text-white font-bold border-3 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer text-sm uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Agendando...' : 'Confirmar Reserva'}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 max-w-md mx-auto">
              <div className="inline-flex bg-green-50 p-4 border-3 border-green-500 text-green-600 rounded-full mb-6">
                <CheckCircle2 className="w-16 h-16 animate-bounce" />
              </div>
              <h3 className="font-pixel text-lg text-slate-900 tracking-wider mb-3">¡Reserva Solicitada con Éxito!</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                Hemos registrado tu solicitud para el día <strong className="text-slate-800">{new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</strong> a las <strong className="text-[#2ec4b6]">{selectedSlot} hs</strong>.
              </p>
              <div className="bg-[#f0f9ff] border border-sky-300 p-4 text-left text-xs text-sky-850 rounded mb-8 font-medium">
                📌 <strong>¿Qué sigue?</strong> Nos comunicaremos contigo por <strong>WhatsApp</strong> o <strong>Correo Electrónico</strong> a la brevedad para confirmar la reunión y enviarte el enlace de Google Meet.
              </div>
              <button
                onClick={resetModal}
                className="py-3 px-6 bg-[#0d1b2e] hover:bg-[#1e385c] text-white font-pixel text-xs border-2 border-slate-900 shadow-[3px_3px_0_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer"
              >
                ENTENDIDO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
