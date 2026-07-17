import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { Schools } from './components/Schools';
import { Corporate } from './components/Corporate';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ShieldAlert, ArrowLeft, Clock } from 'lucide-react';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

interface LoggedInUser {
  email: string;
  name: string;
  role: 'superadmin' | 'student';
  id?: string;
}

interface Course {
  id: string;
  title: string;
  ageGroup: string;
  price: string;
  type: 'Presencial' | 'Virtual';
  studentsCount: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  course?: string;
  status: 'Activo' | 'Completado' | 'Pendiente';
  bio?: string;
  avatar?: string;
  photoUrl?: string;
  theme?: 'default' | 'cyberpunk' | 'playcode';
  password?: string;
  completedLessonIds?: string[];
  role?: 'admin' | 'docente' | 'alumno' | 'profesor';
  platformId?: string;
  aulaId?: string;
  platformIds?: string[];
  aulaIds?: string[];
}

interface PlatformAula {
  id: string;
  name: string;
  ageRange: string;
  modality: 'Presencial' | 'Virtual';
  description?: string;
  schedule?: string;
  courseIds?: string[];
  meetingUrl?: string;
}

interface Platform {
  id: string;
  name: string;
  description?: string;
  aulas: PlatformAula[];
}

interface Meeting {
  id: string;
  name: string;
  url: string;
}

interface Classroom {
  id: string;
  name: string;
  description: string;
  dateTime?: string;
  students: string[];
  meetingId?: string;
  lessonIds?: string[];
  imageUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  courseName: string;
  htmlContent: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'student_dashboard' | 'pending_activation' | 'unauthorized'>(() => {
    const savedView = localStorage.getItem('playcode_view');
    return (savedView as any) || 'landing';
  });
  
  const [user, setUser] = useState<LoggedInUser | null>(() => {
    const savedUser = localStorage.getItem('playcode_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [attemptedEmail, setAttemptedEmail] = useState(() => {
    return localStorage.getItem('playcode_attempted_email') || '';
  });

  const [attemptedName, setAttemptedName] = useState(() => {
    return localStorage.getItem('playcode_attempted_name') || '';
  });

  // Centralized State
  const [courses, setCourses] = useState<Course[]>(() => {
    const local = localStorage.getItem('playcode_courses');
    return local ? JSON.parse(local) : [
      { id: '1', title: 'Aula Maker', ageGroup: '6 a 8 años', price: '$52.600', type: 'Presencial', studentsCount: 240 },
      { id: '2', title: 'Robótica y Programación', ageGroup: '9 a 13 años', price: '$52.600', type: 'Presencial', studentsCount: 310 },
      { id: '3', title: 'PlayCoders', ageGroup: '9 a 13 años', price: '$49.600', type: 'Virtual', studentsCount: 90 },
    ];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const local = localStorage.getItem('playcode_students');
    return local ? JSON.parse(local) : [
      { id: '101', name: 'Lucas Gómez', email: 'lucas.gomez@gmail.com', course: 'Robótica y Programación', status: 'Activo', password: '12356' },
      { id: '102', name: 'Martina Rossi', email: 'martina@outlook.com', course: 'Aula Maker', status: 'Activo', password: '12356' },
      { id: '103', name: 'Mateo Fernández', email: 'mateo.fdz@gmail.com', course: 'PlayCoders', status: 'Completado', password: '12356' },
      { id: '104', name: 'Sofía Díaz', email: 'sofia.diaz@hotmail.com', course: 'Robótica y Programación', status: 'Pendiente', password: '12356' },
    ];
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const local = localStorage.getItem('playcode_meetings');
    return local ? JSON.parse(local) : [
      { id: 'm1', name: 'Meet General PlayCoders', url: 'https://meet.google.com/abc-defg-hij' },
      { id: 'm2', name: 'Taller Arduino Sábado', url: 'https://meet.google.com/xyz-qprs-tuv' }
    ];
  });

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const local = localStorage.getItem('playcode_classrooms');
    return local ? JSON.parse(local) : [
      {
        id: 'c1',
        name: 'Introducción a Robótica Móvil',
        description: 'Conceptos básicos de sensores de proximidad y motores paso a paso.',
        dateTime: '2026-07-20T10:00',
        students: ['101', '104'],
        meetingId: 'm1',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop'
      },
      {
        id: 'c2',
        name: 'Taller de Videojuegos 2D',
        description: 'Lógica física en Scratch y exportación a HTML.',
        dateTime: '2026-07-22T15:30',
        students: ['102', '103'],
        meetingId: 'm2',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop'
      }
    ];
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const local = localStorage.getItem('playcode_lessons');
    return local ? JSON.parse(local) : [
      {
        id: 'l1',
        title: 'Introducción a HTML y CSS',
        courseName: 'PlayCoders',
        htmlContent: `
          <div style="font-family: sans-serif; color: #1e293b; padding: 10px;">
            <h1 style="color: #2a4e7c; border-bottom: 2px solid #2a4e7c; padding-bottom: 5px;">¡Bienvenidos a PlayCoders!</h1>
            <p>En esta lección aprenderemos los conceptos básicos de la estructura de una página web.</p>
            <div style="background-color: #0f172a; color: #f8fafc; padding: 15px; border-radius: 5px; font-family: monospace; margin: 15px 0;">
              &lt;h1&gt;Hola Mundo&lt;/h1&gt;<br/>
              &lt;p&gt;Esta es mi primera página web.&lt;/p>
            </div>
            <p style="background: #e0f2fe; padding: 10px; border-left: 4px solid #0284c7;">
              <strong>Tip:</strong> Puedes experimentar cambiando las etiquetas HTML para ver cómo cambia la página.
            </p>
          </div>
        `
      },
      {
        id: 'l2',
        title: 'Primeros pasos con Scratch',
        courseName: 'Robótica y Programación',
        htmlContent: `
          <div style="font-family: sans-serif; color: #1e293b; padding: 10px;">
            <h1 style="color: #2a4e7c;">Scratch: Lógica básica</h1>
            <p>Usa bloques de movimiento y eventos para mover tu primer objeto en Scratch.</p>
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60" alt="Code" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" />
          </div>
        `
      }
    ];
  });

  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    try {
      const saved = localStorage.getItem('playcode_platforms');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'platform-1',
        name: 'Play Code',
        description: 'Institución educativa de tecnología y programación para niños y jóvenes.',
        aulas: [
          { id: 'aula-1', name: 'Aula Maker', ageRange: '6 a 8 años', modality: 'Presencial', description: 'Introducción a la tecnología y la creatividad digital.', schedule: 'Lunes y Miércoles 18:00', courseIds: ['1'] },
          { id: 'aula-2', name: 'Robótica y Programación', ageRange: '9 a 14 años', modality: 'Presencial', description: 'Programación con robots y proyectos STEAM.', schedule: 'Martes y Jueves 17:30', courseIds: ['2'] },
          { id: 'aula-3', name: 'PlayCoders', ageRange: '9 a 13 años', modality: 'Virtual', description: 'Programación y desarrollo web en modalidad online.', schedule: 'Sábados 10:00', courseIds: ['3'] }
        ]
      }
    ];
  });

  const [loading, setLoading] = useState(true);

  // Helper to sync arrays to Firestore (adds, updates, and deletes)
  const syncCollection = async (collectionName: string, items: any[]) => {
    try {
      // Write/update current items
      for (const item of items) {
        const cleaned = JSON.parse(JSON.stringify(item, (_, value) => value === undefined ? null : value));
        await setDoc(doc(db, collectionName, item.id), cleaned);
      }
      // Delete items that are no longer in the list
      const snap = await getDocs(collection(db, collectionName));
      const currentIds = new Set(items.map(item => item.id));
      for (const d of snap.docs) {
        if (!currentIds.has(d.id)) {
          await deleteDoc(doc(db, collectionName, d.id));
        }
      }
    } catch (err) {
      console.error(`Error syncing ${collectionName} to Firebase:`, err);
    }
  };

  // Load data from Firebase on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        let loadedCourses: Course[] = [];
        if (coursesSnap.empty) {
          const initial = [
            { id: '1', title: 'Aula Maker', ageGroup: '6 a 8 años', price: '$52.600', type: 'Presencial', studentsCount: 240 },
            { id: '2', title: 'Robótica y Programación', ageGroup: '9 a 13 años', price: '$52.600', type: 'Presencial', studentsCount: 310 },
            { id: '3', title: 'PlayCoders', ageGroup: '9 a 13 años', price: '$49.600', type: 'Virtual', studentsCount: 90 },
          ];
          for (const c of initial) {
            await setDoc(doc(db, 'courses', c.id), c);
          }
          loadedCourses = initial as Course[];
        } else {
          loadedCourses = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
        }
        setCourses(loadedCourses);

        // 2. Fetch Students
        const studentsSnap = await getDocs(collection(db, 'students'));
        let loadedStudents: Student[] = [];
        if (studentsSnap.empty) {
          const initial = [
            { id: '101', name: 'Lucas Gómez', email: 'lucas.gomez@gmail.com', course: 'Robótica y Programación', status: 'Activo', password: '12356' },
            { id: '102', name: 'Martina Rossi', email: 'martina@outlook.com', course: 'Aula Maker', status: 'Activo', password: '12356' },
            { id: '103', name: 'Mateo Fernández', email: 'mateo.fdz@gmail.com', course: 'PlayCoders', status: 'Completado', password: '12356' },
            { id: '104', name: 'Sofía Díaz', email: 'sofia.diaz@hotmail.com', course: 'Robótica y Programación', status: 'Pendiente', password: '12356' },
          ];
          for (const s of initial) {
            await setDoc(doc(db, 'students', s.id), s);
          }
          loadedStudents = initial as Student[];
        } else {
          loadedStudents = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
        }
        setStudents(loadedStudents);

        // 3. Fetch Meetings
        const meetingsSnap = await getDocs(collection(db, 'meetings'));
        let loadedMeetings: Meeting[] = [];
        if (meetingsSnap.empty) {
          const initial = [
            { id: 'm1', name: 'Meet General PlayCoders', url: 'https://meet.google.com/abc-defg-hij' },
            { id: 'm2', name: 'Taller Arduino Sábado', url: 'https://meet.google.com/xyz-qprs-tuv' }
          ];
          for (const m of initial) {
            await setDoc(doc(db, 'meetings', m.id), m);
          }
          loadedMeetings = initial as Meeting[];
        } else {
          loadedMeetings = meetingsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Meeting));
        }
        setMeetings(loadedMeetings);

        // 4. Fetch Classrooms
        const classroomsSnap = await getDocs(collection(db, 'classrooms'));
        let loadedClassrooms: Classroom[] = [];
        if (classroomsSnap.empty) {
          const initial = [
            {
              id: 'c1',
              name: 'Introducción a Robótica Móvil',
              description: 'Conceptos básicos de sensores de proximidad y motores paso a paso.',
              dateTime: '2026-07-20T10:00',
              students: ['101', '104'],
              meetingId: 'm1',
              imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop'
            },
            {
              id: 'c2',
              name: 'Taller de Videojuegos 2D',
              description: 'Lógica física en Scratch y exportación a HTML.',
              dateTime: '2026-07-22T15:30',
              students: ['102', '103'],
              meetingId: 'm2',
              imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop'
            }
          ];
          for (const cl of initial) {
            await setDoc(doc(db, 'classrooms', cl.id), cl);
          }
          loadedClassrooms = initial as Classroom[];
        } else {
          loadedClassrooms = classroomsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Classroom));
        }
        setClassrooms(loadedClassrooms);

        // 5. Fetch Lessons
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        let loadedLessons: Lesson[] = [];
        if (lessonsSnap.empty) {
          const initial = [
            {
              id: 'l1',
              title: 'Introducción a HTML y CSS',
              courseName: 'PlayCoders',
              htmlContent: `
                <div style="font-family: sans-serif; color: #1e293b; padding: 10px;">
                  <h1 style="color: #2a4e7c; border-bottom: 2px solid #2a4e7c; padding-bottom: 5px;">¡Bienvenidos a PlayCoders!</h1>
                  <p>En esta lección aprenderemos los conceptos básicos de la estructura de una página web.</p>
                  <div style="background-color: #0f172a; color: #f8fafc; padding: 15px; border-radius: 5px; font-family: monospace; margin: 15px 0;">
                    &lt;h1&gt;Hola Mundo&lt;/h1&gt;<br/>
                    &lt;p&gt;Esta es mi primera página web.&lt;/p>
                  </div>
                  <p style="background: #e0f2fe; padding: 10px; border-left: 4px solid #0284c7;">
                    <strong>Tip:</strong> Puedes experimentar cambiando las etiquetas HTML para ver cómo cambia la página.
                  </p>
                </div>
              `
            },
            {
              id: 'l2',
              title: 'Primeros pasos con Scratch',
              courseName: 'Robótica y Programación',
              htmlContent: `
                <div style="font-family: sans-serif; color: #1e293b; padding: 10px;">
                  <h1 style="color: #2a4e7c;">Scratch: Lógica básica</h1>
                  <p>Usa bloques de movimiento y eventos para mover tu primer objeto en Scratch.</p>
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60" alt="Code" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" />
                </div>
              `
            }
          ];
          for (const les of initial) {
            await setDoc(doc(db, 'lessons', les.id), les);
          }
          loadedLessons = initial as Lesson[];
        } else {
          loadedLessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
        }
        setLessons(loadedLessons);

        // 6. Fetch Platforms
        const platformsSnap = await getDocs(collection(db, 'platforms'));
        let loadedPlatforms: Platform[] = [];
        if (platformsSnap.empty) {
          const initial = [
            {
              id: 'platform-1',
              name: 'Play Code',
              description: 'Institución educativa de tecnología y programación para niños y jóvenes.',
              aulas: [
                { id: 'aula-1', name: 'Aula Maker', ageRange: '6 a 8 años', modality: 'Presencial', description: 'Introducción a la tecnología y la creatividad digital.', schedule: 'Lunes y Miércoles 18:00', courseIds: ['1'] },
                { id: 'aula-2', name: 'Robótica y Programación', ageRange: '9 a 14 años', modality: 'Presencial', description: 'Programación con robots y proyectos STEAM.', schedule: 'Martes y Jueves 17:30', courseIds: ['2'] },
                { id: 'aula-3', name: 'PlayCoders', ageRange: '9 a 13 años', modality: 'Virtual', description: 'Programación y desarrollo web en modal online.', schedule: 'Sábados 10:00', courseIds: ['3'] }
              ]
            }
          ];
          for (const plat of initial) {
            await setDoc(doc(db, 'platforms', plat.id), plat);
          }
          loadedPlatforms = initial as Platform[];
        } else {
          loadedPlatforms = platformsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Platform));
        }
        setPlatforms(loadedPlatforms);

      } catch (err) {
        console.error("Error loading data from Firebase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync state changes with localStorage and Firebase (only after loading is complete)
  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_platforms', JSON.stringify(platforms));
    syncCollection('platforms', platforms);
  }, [platforms, loading]);

  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_lessons', JSON.stringify(lessons));
    syncCollection('lessons', lessons);
  }, [lessons, loading]);

  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_courses', JSON.stringify(courses));
    syncCollection('courses', courses);
  }, [courses, loading]);

  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_students', JSON.stringify(students));
    syncCollection('students', students);
  }, [students, loading]);

  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_meetings', JSON.stringify(meetings));
    syncCollection('meetings', meetings);
  }, [meetings, loading]);

  React.useEffect(() => {
    if (loading) return;
    localStorage.setItem('playcode_classrooms', JSON.stringify(classrooms));
    syncCollection('classrooms', classrooms);
  }, [classrooms, loading]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('playcode_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('playcode_user');
    }
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('playcode_view', view);
  }, [view]);

  React.useEffect(() => {
    localStorage.setItem('playcode_attempted_email', attemptedEmail);
  }, [attemptedEmail]);

  React.useEffect(() => {
    localStorage.setItem('playcode_attempted_name', attemptedName);
  }, [attemptedName]);

  const handleLogin = (email: string, password?: string, name?: string): { success: boolean; error?: string } => {
    const formattedEmail = email.toLowerCase().trim();

    // 1. Superadmin verification
    if (formattedEmail === 'juanpacheco@playcode.com.ar') {
      if (password !== undefined) {
        if (password !== 'admin123') {
          return { success: false, error: 'Contraseña de administrador incorrecta.' };
        }
      }
      const u: LoggedInUser = { email: formattedEmail, name: name || 'Juan Pacheco', role: 'superadmin' };
      setUser(u);
      setView('dashboard');
      return { success: true };
    }

    // 2. Student verification
    const existingStudent = students.find(s => s.email === formattedEmail);

    if (password !== undefined) {
      // Trying email & password login
      if (!existingStudent) {
        return { success: false, error: 'No se encontró ninguna cuenta asociada a este correo electrónico.' };
      }
      const expectedPassword = existingStudent.password || '123456';
      if (password !== expectedPassword) {
        return { success: false, error: 'Contraseña incorrecta.' };
      }

      if (existingStudent.status === 'Pendiente') {
        setAttemptedEmail(formattedEmail);
        setAttemptedName(existingStudent.name);
        setView('pending_activation');
        return { success: true };
      }

      const u: LoggedInUser = { email: formattedEmail, name: existingStudent.name, role: 'student', id: existingStudent.id };
      setUser(u);
      setView('student_dashboard');
      return { success: true };
    } else {
      // Google Login (password is undefined)
      if (!existingStudent) {
        const newStudent: Student = {
          id: Date.now().toString(),
          name: name || 'Nuevo Alumno',
          email: formattedEmail,
          course: 'Robótica y Programación',
          status: 'Pendiente',
          password: '123456'
        };
        setStudents(prev => [...prev, newStudent]);
        setAttemptedEmail(formattedEmail);
        setAttemptedName(name || 'Nuevo Alumno');
        setView('pending_activation');
        return { success: true };
      } else {
        if (existingStudent.status === 'Pendiente') {
          setAttemptedEmail(formattedEmail);
          setAttemptedName(existingStudent.name);
          setView('pending_activation');
          return { success: true };
        } else {
          const u: LoggedInUser = { email: formattedEmail, name: existingStudent.name, role: 'student', id: existingStudent.id };
          setUser(u);
          setView('student_dashboard');
          return { success: true };
        }
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    localStorage.removeItem('playcode_user');
    localStorage.removeItem('playcode_view');
    localStorage.removeItem('playcode_attempted_email');
    localStorage.removeItem('playcode_attempted_name');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex flex-col items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ffe66d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3b8cc] animate-pulse">Cargando Plataforma...</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
  }

  if (view === 'pending_activation') {
    return (
      <div className="min-h-screen bg-[#f3f7fa] flex flex-col items-center justify-center p-4 text-[#0d1b2e] font-sans">
        <div className="w-full max-w-md bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#0d1b2e] p-8 text-center relative">
          <div className="inline-flex bg-[#a3b8cc]/30 p-3 border-2 border-[#0d1b2e] text-[#2a4e7c] mb-6 shadow-[3px_3px_0_0_#0d1b2e]">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Cuenta Pendiente</h2>
          <p className="text-slate-650 text-sm mb-6 leading-relaxed">
            Hola <strong className="text-[#0d1b2e]">{attemptedName}</strong>, tu correo <strong className="text-[#0d1b2e]">{attemptedEmail}</strong> ha sido registrado de forma segura.
          </p>
          <div className="bg-[#f0f4f8] border border-[#a3b8cc] p-4 text-xs font-semibold text-[#2a4e7c] mb-6 text-left rounded">
            Tu cuenta se encuentra pendiente de activación. Por favor, espera a que un administrador active tu acceso. Una vez aprobada, podrás volver a iniciar sesión y acceder a tus clases y enlaces de Google Meet.
          </div>
          <button
            onClick={() => setView('landing')}
            className="w-full py-3 px-4 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (view === 'unauthorized') {
    return (
      <div className="min-h-screen bg-[#f3f7fa] flex flex-col items-center justify-center p-4 text-[#0d1b2e] font-sans">
        <div className="w-full max-w-md bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#0d1b2e] p-8 text-center">
          <div className="inline-flex bg-red-100 p-3 border-2 border-[#0d1b2e] text-red-600 mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0d1b2e] mb-4">Acceso Denegado</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            La cuenta <strong className="text-[#0d1b2e]">{attemptedEmail}</strong> no está autorizada.
          </p>
          <button
            onClick={() => setView('login')}
            className="w-full py-3 px-4 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Intentar con otra cuenta
          </button>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return (
      <AdminDashboard
        userEmail={user.email}
        userName={user.name}
        onLogout={handleLogout}
        courses={courses}
        setCourses={setCourses}
        students={students}
        setStudents={setStudents}
        meetings={meetings}
        setMeetings={setMeetings}
        classrooms={classrooms}
        setClassrooms={setClassrooms}
        lessons={lessons}
        setLessons={setLessons}
        platforms={platforms}
        setPlatforms={setPlatforms}
      />
    );
  }

  if (view === 'student_dashboard' && user && user.id) {
    const studentInfo = students.find(s => s.id === user.id);
    if (studentInfo) {
      return (
        <StudentDashboard
          student={studentInfo}
          classrooms={classrooms}
          meetings={meetings}
          lessons={lessons}
          courses={courses}
          platforms={platforms}
          onLogout={handleLogout}
          onSaveProfile={(updated) => {
            setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#a3b8cc] selection:text-[#0d1b2e] antialiased">
      <Navbar onGoToPlatform={() => setView('login')} />
      <Hero />
      <About />
      <Courses />
      <Schools />
      <Corporate />
      <Footer />
    </div>
  );
};

export default App;
