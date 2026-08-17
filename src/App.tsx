import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { Schools } from './components/Schools';
import { Corporate } from './components/Corporate';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';

const App: React.FC = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [informationalBookings, setInformationalBookings] = useState<Array<{ date: string; timeSlot: string; status: string }>>(() => {
    const saved = localStorage.getItem('playcode_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const bookingSettings = {
    weeklySlots: {
      monday: ['15:00-16:00', '16:00-17:00', '17:00-18:00'],
      tuesday: ['15:00-16:00', '16:00-17:00', '17:00-18:00'],
      wednesday: ['15:00-16:00', '16:00-17:00', '17:00-18:00'],
      thursday: ['15:00-16:00', '16:00-17:00', '17:00-18:00'],
      friday: ['15:00-16:00', '16:00-17:00', '17:00-18:00'],
    },
  };

  const handleSubmitBooking = async (bookingData: {
    date: string;
    timeSlot: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    notes: string;
  }) => {
    const newBooking = { ...bookingData, status: 'Pendiente', id: Date.now().toString() };
    const updated = [...informationalBookings, newBooking];
    setInformationalBookings(updated);
    localStorage.setItem('playcode_bookings', JSON.stringify(updated));
  };

  const handleGoToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#a3b8cc] selection:text-[#0d1b2e] antialiased">
      <Navbar onGoToPlatform={handleGoToContact} />
      <Hero />
      <About />
      <Courses />
      <Schools />
      <Corporate />
      <Footer onBookMeeting={() => setBookingModalOpen(true)} />
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        weeklySlots={bookingSettings.weeklySlots}
        existingBookings={informationalBookings}
        onSubmitBooking={handleSubmitBooking}
      />
    </div>
  );
};

export default App;
