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
  username: string;
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
  username: string;
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
  googleAuthAllowed?: boolean;
  googleEmail?: string;
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

interface ForumComment {
  id: string;
  content: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  imageUrl?: string; // base64
  likes: number;
  likedBy: string[]; // usernames of users who liked
  reactions: { [key: string]: number }; // emoji -> count
  reactedBy: { [userUsername: string]: string }; // userUsername -> emoji
  createdAt: string;
  comments: ForumComment[];
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

  const [attemptedUsername, setAttemptedUsername] = useState(() => {
    return localStorage.getItem('playcode_attempted_username') || '';
  });

  const [attemptedName, setAttemptedName] = useState(() => {
    return localStorage.getItem('playcode_attempted_name') || '';
  });

  // Centralized State — initialized EMPTY; Firestore is the single source of truth.
  // localStorage is only used as a read-only fallback if Firestore fails.
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

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
      setDbStatus('connected');
      setDbError(null);
    } catch (err: any) {
      console.error(`Error syncing ${collectionName} to Firebase:`, err);
      setDbStatus('error');
      setDbError(err.message || String(err));
    }
  };

  // Load data from Firebase on mount
  React.useEffect(() => {
    const fetchData = async () => {
      setDbStatus('connecting');
      try {
        // 1. Fetch Courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const loadedCourses = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
        setCourses(loadedCourses);

        // 2. Fetch Students
        const studentsSnap = await getDocs(collection(db, 'students'));
        const loadedStudents = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
        setStudents(loadedStudents);

        // 3. Fetch Meetings
        const meetingsSnap = await getDocs(collection(db, 'meetings'));
        const loadedMeetings = meetingsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Meeting));
        setMeetings(loadedMeetings);

        // 4. Fetch Classrooms
        const classroomsSnap = await getDocs(collection(db, 'classrooms'));
        const loadedClassrooms = classroomsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Classroom));
        setClassrooms(loadedClassrooms);

        // 5. Fetch Lessons
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        const loadedLessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
        setLessons(loadedLessons);

        // 6. Fetch Platforms
        const platformsSnap = await getDocs(collection(db, 'platforms'));
        const loadedPlatforms = platformsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Platform));
        setPlatforms(loadedPlatforms);

        // 7. Fetch Forum Posts
        const forumSnap = await getDocs(collection(db, 'forum_posts'));
        let loadedForumPosts: ForumPost[] = [];
        if (forumSnap.empty) {
          const initial = [
            {
              id: 'post-1',
              title: '¡Bienvenidos al Foro Estudiantil de Play Code! 🚀',
              content: '¡Hola a todos! Este es nuestro espacio para compartir dudas, proyectos y aprender juntos. ¡Cuéntanos qué estás programando hoy!',
              authorName: 'Juan Pacheco',
              authorUsername: 'juanpacheco',
              authorAvatar: '🧠',
              likes: 3,
              likedBy: [],
              reactions: { '🚀': 4, '🎉': 2 },
              reactedBy: {},
              createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
              comments: [
                {
                  id: 'comment-1',
                  content: '¡Me encanta este nuevo foro! Voy a subir un screenshot de mi proyecto de HTML pronto.',
                  authorName: 'Lucas Pérez',
                  authorUsername: 'lucasperez',
                  createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
                }
              ]
            }
          ];
          for (const p of initial) {
            await setDoc(doc(db, 'forum_posts', p.id), p);
          }
          loadedForumPosts = initial as ForumPost[];
        } else {
          loadedForumPosts = forumSnap.docs.map(d => ({ id: d.id, ...d.data() } as ForumPost));
        }
        setForumPosts(loadedForumPosts);

        setDbLoaded(true);
        setDbStatus('connected');
        setDbError(null);
      } catch (err: any) {
        console.error("Error loading data from Firebase:", err);
        setDbStatus('error');
        setDbError(err.message || String(err));
        // Fallback: load from localStorage (read-only — dbLoaded stays false so sync effects won't write back)
        try {
          const lc = (key: string) => { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; };
          setCourses(lc('playcode_courses') || []);
          setStudents(lc('playcode_students') || []);
          setMeetings(lc('playcode_meetings') || []);
          setClassrooms(lc('playcode_classrooms') || []);
          setLessons(lc('playcode_lessons') || []);
          setPlatforms(lc('playcode_platforms') || []);
          setForumPosts(lc('playcode_forum_posts') || []);
        } catch { /* localStorage also failed, arrays stay empty */ }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync state changes with localStorage and Firebase (only after loading and dbLoaded are complete)
  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_forum_posts', JSON.stringify(forumPosts));
    syncCollection('forum_posts', forumPosts);
  }, [forumPosts, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_platforms', JSON.stringify(platforms));
    syncCollection('platforms', platforms);
  }, [platforms, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_lessons', JSON.stringify(lessons));
    syncCollection('lessons', lessons);
  }, [lessons, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_courses', JSON.stringify(courses));
    syncCollection('courses', courses);
  }, [courses, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_students', JSON.stringify(students));
    syncCollection('students', students);
  }, [students, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_meetings', JSON.stringify(meetings));
    syncCollection('meetings', meetings);
  }, [meetings, loading, dbLoaded]);

  React.useEffect(() => {
    if (loading || !dbLoaded) return;
    localStorage.setItem('playcode_classrooms', JSON.stringify(classrooms));
    syncCollection('classrooms', classrooms);
  }, [classrooms, loading, dbLoaded]);

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
    localStorage.setItem('playcode_attempted_username', attemptedUsername);
  }, [attemptedUsername]);

  React.useEffect(() => {
    localStorage.setItem('playcode_attempted_name', attemptedName);
  }, [attemptedName]);

  const handleLogin = (username: string, password?: string, name?: string): { success: boolean; error?: string } => {
    const googleEmail = username.toLowerCase().trim();
    const formattedUsername = username.toLowerCase().replace(/\s+/g, '').trim();

    // 1. Superadmin verification
    // Google Auth Superadmin Login: matches email "juanpacheco@playcode.com.ar"
    // Manual Superadmin Login: username is "juanpacheco" or "juanpacheco@playcode.com.ar" and password is correct
    const isSuperAdminGoogle = password === undefined && googleEmail === 'juanpacheco@playcode.com.ar';
    const isSuperAdminManual = password !== undefined && (formattedUsername === 'juanpacheco' || formattedUsername === 'juanpacheco@playcode.com.ar');

    if (isSuperAdminGoogle || isSuperAdminManual) {
      if (isSuperAdminManual) {
        if (password !== 'admin123') {
          return { success: false, error: 'Contraseña de administrador incorrecta.' };
        }
      }
      const u: LoggedInUser = { username: 'juanpacheco', name: name || 'Juan Pacheco', role: 'superadmin' };
      setUser(u);
      setView('dashboard');
      return { success: true };
    }

    if (password !== undefined) {
      // 2. Student verification: Manual login (username + password)
      const existingStudent = students.find(s => s.username === formattedUsername);
      if (!existingStudent) {
        return { success: false, error: 'No se encontró ninguna cuenta asociada a este usuario.' };
      }
      const expectedPassword = existingStudent.password || '123456';
      if (password !== expectedPassword) {
        return { success: false, error: 'Contraseña incorrecta.' };
      }

      if (existingStudent.status === 'Pendiente') {
        setAttemptedUsername(formattedUsername);
        setAttemptedName(existingStudent.name);
        setView('pending_activation');
        return { success: true };
      }

      const u: LoggedInUser = { username: formattedUsername, name: existingStudent.name, role: 'student', id: existingStudent.id };
      setUser(u);
      setView('student_dashboard');
      return { success: true };
    } else {
      // 3. Student verification: Google SSO login (password is undefined)
      // Find student with Google SSO allowed matching the Google email
      const existingStudentGoogle = students.find(
        s => s.googleAuthAllowed && s.googleEmail?.toLowerCase().trim() === googleEmail
      );

      if (!existingStudentGoogle) {
        return {
          success: false,
          error: 'Este correo de Google no está autorizado para Google SSO. Inicia sesión con usuario y contraseña o contacta al administrador.'
        };
      }

      if (existingStudentGoogle.status === 'Pendiente') {
        setAttemptedUsername(existingStudentGoogle.username);
        setAttemptedName(existingStudentGoogle.name);
        setView('pending_activation');
        return { success: true };
      }

      const u: LoggedInUser = {
        username: existingStudentGoogle.username,
        name: existingStudentGoogle.name,
        role: 'student',
        id: existingStudentGoogle.id
      };
      setUser(u);
      setView('student_dashboard');
      return { success: true };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    localStorage.removeItem('playcode_user');
    localStorage.removeItem('playcode_view');
    localStorage.removeItem('playcode_attempted_username');
    localStorage.removeItem('playcode_attempted_name');
  };

  if (loading && (view === 'dashboard' || view === 'student_dashboard' || view === 'pending_activation')) {
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
            Hola <strong className="text-[#0d1b2e]">{attemptedName}</strong>, tu usuario <strong className="text-[#0d1b2e]">{attemptedUsername}</strong> ha sido registrado de forma segura.
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
            La cuenta <strong className="text-[#0d1b2e]">{attemptedUsername}</strong> no está autorizada.
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
        userUsername={user.username}
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
        posts={forumPosts}
        setPosts={setForumPosts}
        dbStatus={dbStatus}
        dbError={dbError}
        firebaseProjectId={db.app.options.projectId || 'playcode-39ce5'}
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
          posts={forumPosts}
          setPosts={setForumPosts}
          onLogout={handleLogout}
          onSaveProfile={(updated) => {
            setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
          }}
          dbStatus={dbStatus}
          dbError={dbError}
          firebaseProjectId={db.app.options.projectId || 'playcode-39ce5'}
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
