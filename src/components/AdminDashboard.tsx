import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Code2,
  Video,
  ExternalLink,
  Pencil,
  Search,
  Eye,
  X,
  MessageSquare,
  Heart,
  Send,
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

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
  password?: string;
  completedLessonIds?: string[];
  role?: 'admin' | 'docente' | 'alumno' | 'profesor';
  platformId?: string;
  aulaId?: string;
  platformIds?: string[];
  aulaIds?: string[];
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
  students: string[]; // Enrolled student IDs
  meetingId?: string; // Selected meeting ID
  lessonIds?: string[]; // Linked lesson IDs
  imageUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  courseName: string;
  htmlContent: string;
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

interface AdminDashboardProps {
  userEmail: string;
  userName: string;
  onLogout: () => void;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  platforms: Platform[];
  setPlatforms: React.Dispatch<React.SetStateAction<Platform[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userEmail,
  userName,
  onLogout,
  courses,
  setCourses,
  students,
  setStudents,
  meetings,
  setMeetings,
  classrooms,
  setClassrooms,
  lessons,
  setLessons,
  platforms,
  setPlatforms
}) => {
  void setCourses;
  void courses;
  const [activeTab, setActiveTab] = useState<'inicio' | 'cursos' | 'usuarios' | 'docentes' | 'clases' | 'meetings' | 'contenido' | 'config' | 'foro' | 'plataformas'>('inicio');

  // Platforms state is received from props!
  const [expandedPlatformId, setExpandedPlatformId] = useState<string | null>('platform-1');

  // Aula course linkages
  const [newAulaCourseIds, setNewAulaCourseIds] = useState<string[]>([]);
  const [newAulaCourseSearch, setNewAulaCourseSearch] = useState('');
  const [isNewAulaCourseDropdownOpen, setIsNewAulaCourseDropdownOpen] = useState(false);
  const [editAulaCourseIds, setEditAulaCourseIds] = useState<string[]>([]);
  const [editAulaCourseSearch, setEditAulaCourseSearch] = useState('');
  const [isEditAulaCourseDropdownOpen, setIsEditAulaCourseDropdownOpen] = useState(false);

  // Student creation platform fields
  const [newStudentPlatformIds, setNewStudentPlatformIds] = useState<string[]>([]);
  const [newStudentAulaIds, setNewStudentAulaIds] = useState<string[]>([]);
  const [newStudentPlatformSearch, setNewStudentPlatformSearch] = useState('');
  const [newStudentAulaSearch, setNewStudentAulaSearch] = useState('');
  const [isNewStudentPlatformDropdownOpen, setIsNewStudentPlatformDropdownOpen] = useState(false);
  const [isNewStudentAulaDropdownOpen, setIsNewStudentAulaDropdownOpen] = useState(false);

  // Student editing states
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentRole, setEditStudentRole] = useState<'admin' | 'docente' | 'alumno' | 'profesor'>('alumno');
  const [editStudentPassword, setEditStudentPassword] = useState('');
  const [editStudentPlatformIds, setEditStudentPlatformIds] = useState<string[]>([]);
  const [editStudentAulaIds, setEditStudentAulaIds] = useState<string[]>([]);
  const [editStudentPlatformSearch, setEditStudentPlatformSearch] = useState('');
  const [editStudentAulaSearch, setEditStudentAulaSearch] = useState('');
  const [isEditStudentPlatformDropdownOpen, setIsEditStudentPlatformDropdownOpen] = useState(false);
  const [isEditStudentAulaDropdownOpen, setIsEditStudentAulaDropdownOpen] = useState(false);
  // Platform creation
  const [showNewPlatformForm, setShowNewPlatformForm] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformDesc, setNewPlatformDesc] = useState('');
  // Platform editing
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [editPlatformName, setEditPlatformName] = useState('');
  const [editPlatformDesc, setEditPlatformDesc] = useState('');
  const [showNewAulaForPlatform, setShowNewAulaForPlatform] = useState<string | null>(null);
  const [newAulaName, setNewAulaName] = useState('');
  const [newAulaAge, setNewAulaAge] = useState('');
  const [newAulaModality, setNewAulaModality] = useState<'Presencial' | 'Virtual'>('Presencial');
  const [newAulaDesc, setNewAulaDesc] = useState('');
  const [newAulaSchedule, setNewAulaSchedule] = useState('');
  const [newAulaMeetingUrl, setNewAulaMeetingUrl] = useState('');
  // Aula editing
  const [editingAula, setEditingAula] = useState<{ platformId: string; aulaId: string } | null>(null);
  const [editAulaName, setEditAulaName] = useState('');
  const [editAulaAge, setEditAulaAge] = useState('');
  const [editAulaModality, setEditAulaModality] = useState<'Presencial' | 'Virtual'>('Presencial');
  const [editAulaDesc, setEditAulaDesc] = useState('');
  const [editAulaSchedule, setEditAulaSchedule] = useState('');
  const [editAulaMeetingUrl, setEditAulaMeetingUrl] = useState('');

  // Forum moderation state
  const [posts, setPosts] = useState<any[]>([]);

  // Forum creation & editing states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  // Edit Post states
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostImage, setEditPostImage] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [forumSearchQuery, setForumSearchQuery] = useState('');

  // Load posts on tab change or mount
  useEffect(() => {
    const saved = localStorage.getItem('playcode_forum_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Initialize with welcome post by Juan Pacheco
      const initialPosts = [
        {
          id: 'post-1',
          title: '¡Bienvenidos al Foro Estudiantil de Play Code! 🚀',
          content: '¡Hola a todos! Este es nuestro espacio para compartir dudas, proyectos y aprender juntos. ¡Cuéntanos qué estás programando hoy!',
          authorName: 'Juan Pacheco',
          authorEmail: 'juanpacheco@playcode.com.ar',
          authorAvatar: '🧠',
          likes: 3,
          likedBy: [],
          reactions: { '🚀': 4, '🎉': 2 },
          reactedBy: {},
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
          comments: [
            {
              id: 'comment-1',
              content: '¡Me encanta este nuevo foro! Voy a subir un screenshot de mi proyecto de HTML pronto.',
              authorName: 'Lucas Pérez',
              authorEmail: 'lucas@playcode.com',
              createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
            }
          ]
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('playcode_forum_posts', JSON.stringify(initialPosts));
    }
  }, [activeTab]);

  // Platform CRUD handlers
  const handleCreatePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatformName.trim()) return;
    const newPlatform: Platform = {
      id: 'platform-' + Date.now(),
      name: newPlatformName.trim(),
      description: newPlatformDesc.trim(),
      aulas: []
    };
    setPlatforms(prev => [...prev, newPlatform]);
    setExpandedPlatformId(newPlatform.id);
    setNewPlatformName('');
    setNewPlatformDesc('');
    setShowNewPlatformForm(false);
  };

  const handleDeletePlatform = (platformId: string) => {
    if (!confirm('¿Eliminar esta entidad y todas sus aulas?')) return;
    setPlatforms(prev => prev.filter(p => p.id !== platformId));
    if (expandedPlatformId === platformId) setExpandedPlatformId(null);
  };

  const handleStartEditPlatform = (platform: Platform) => {
    setEditingPlatformId(platform.id);
    setEditPlatformName(platform.name);
    setEditPlatformDesc(platform.description || '');
  };

  const handleSaveEditPlatform = (platformId: string) => {
    if (!editPlatformName.trim()) return;
    setPlatforms(prev => prev.map(p =>
      p.id === platformId ? { ...p, name: editPlatformName.trim(), description: editPlatformDesc.trim() } : p
    ));
    setEditingPlatformId(null);
  };

  // Aula CRUD handlers
  const handleCreateAula = (e: React.FormEvent, platformId: string) => {
    e.preventDefault();
    if (!newAulaName.trim() || !newAulaAge.trim()) return;
    const newAula: PlatformAula = {
      id: 'aula-' + Date.now(),
      name: newAulaName.trim(),
      ageRange: newAulaAge.trim(),
      modality: newAulaModality,
      description: newAulaDesc.trim(),
      schedule: newAulaSchedule.trim(),
      courseIds: newAulaCourseIds,
      meetingUrl: newAulaModality === 'Virtual' ? newAulaMeetingUrl.trim() : undefined
    };
    setPlatforms(prev => prev.map(p =>
      p.id === platformId ? { ...p, aulas: [...p.aulas, newAula] } : p
    ));
    setNewAulaName('');
    setNewAulaAge('');
    setNewAulaModality('Presencial');
    setNewAulaDesc('');
    setNewAulaSchedule('');
    setNewAulaMeetingUrl('');
    setNewAulaCourseIds([]);
    setNewAulaCourseSearch('');
    setIsNewAulaCourseDropdownOpen(false);
    setShowNewAulaForPlatform(null);
  };

  const handleDeleteAula = (platformId: string, aulaId: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id === platformId ? { ...p, aulas: p.aulas.filter(a => a.id !== aulaId) } : p
    ));
  };

  const handleStartEditAula = (platformId: string, aula: PlatformAula) => {
    setEditingAula({ platformId, aulaId: aula.id });
    setEditAulaName(aula.name);
    setEditAulaAge(aula.ageRange);
    setEditAulaModality(aula.modality);
    setEditAulaDesc(aula.description || '');
    setEditAulaSchedule(aula.schedule || '');
    setEditAulaCourseIds(aula.courseIds || []);
    setEditAulaMeetingUrl(aula.meetingUrl || '');
  };

  const handleSaveEditAula = (platformId: string, aulaId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editAulaName.trim() || !editAulaAge.trim()) return;
    setPlatforms(prev => prev.map(p =>
      p.id === platformId
        ? {
          ...p,
          aulas: p.aulas.map(a =>
            a.id === aulaId
              ? {
                  ...a,
                  name: editAulaName.trim(),
                  ageRange: editAulaAge.trim(),
                  modality: editAulaModality,
                  description: editAulaDesc.trim(),
                  schedule: editAulaSchedule.trim(),
                  courseIds: editAulaCourseIds,
                  meetingUrl: editAulaModality === 'Virtual' ? editAulaMeetingUrl.trim() : undefined
                }
              : a
          )
        }
        : p
    ));
    setEditAulaCourseIds([]);
    setEditAulaCourseSearch('');
    setIsEditAulaCourseDropdownOpen(false);
    setEditAulaMeetingUrl('');
    setEditingAula(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Por favor selecciona una imagen menor a 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditPostImage(reader.result as string);
        } else {
          setNewPostImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: 'post-' + Date.now(),
      title: newPostTitle,
      content: newPostContent,
      authorName: 'Juan Pacheco',
      authorEmail: 'juanpacheco@playcode.com.ar',
      authorAvatar: '🧠',
      imageUrl: newPostImage || undefined,
      likes: 0,
      likedBy: [],
      reactions: { '🚀': 0, '🎉': 0, '💻': 0, '🧠': 0 },
      reactedBy: {},
      createdAt: new Date().toISOString(),
      comments: []
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));

    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage(null);
    setShowAddPostForm(false);
  };

  const handleStartEditPost = (post: any) => {
    setEditingPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setEditPostImage(post.imageUrl || null);
  };

  const handleSaveEditPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostTitle.trim() || !editPostContent.trim() || !editingPostId) return;

    const updated = posts.map(post => {
      if (post.id !== editingPostId) return post;
      return {
        ...post,
        title: editPostTitle,
        content: editPostContent,
        imageUrl: editPostImage || undefined
      };
    });

    setPosts(updated);
    localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));

    setEditingPostId(null);
    setEditPostTitle('');
    setEditPostContent('');
    setEditPostImage(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este post de forma permanente?')) {
      const updated = posts.filter(p => p.id !== postId);
      setPosts(updated);
      localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      const updated = posts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.filter((c: any) => c.id !== commentId)
        };
      });
      setPosts(updated);
      localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));
    }
  };

  // Admin interaction states and handlers
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleLikePostInteractive = (postId: string) => {
    const userEmail = 'juanpacheco@playcode.com.ar';
    const updated = posts.map(post => {
      if (post.id !== postId) return post;
      const postLikedBy = post.likedBy || [];
      const hasLiked = postLikedBy.includes(userEmail);
      const likedBy = hasLiked
        ? postLikedBy.filter((email: string) => email !== userEmail)
        : [...postLikedBy, userEmail];
      const likes = hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
      return { ...post, likes, likedBy };
    });
    setPosts(updated);
    localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));
  };

  const handleReactToPostInteractive = (postId: string, emoji: string) => {
    const userEmail = 'juanpacheco@playcode.com.ar';
    const updated = posts.map(post => {
      if (post.id !== postId) return post;

      const postReactedBy = post.reactedBy || {};
      const postReactions = post.reactions || { '🚀': 0, '🎉': 0, '💻': 0, '🧠': 0 };

      const previousReaction = postReactedBy[userEmail];
      const reactedBy = { ...postReactedBy, [userEmail]: emoji };
      const reactions = { ...postReactions };

      if (previousReaction === emoji) {
        reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
        delete reactedBy[userEmail];
      } else {
        if (previousReaction) {
          reactions[previousReaction] = Math.max(0, (reactions[previousReaction] || 1) - 1);
        }
        reactions[emoji] = (reactions[emoji] || 0) + 1;
      }

      return { ...post, reactions, reactedBy };
    });
    setPosts(updated);
    localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));
  };

  const handleAddCommentInteractive = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    const updated = posts.map(post => {
      if (post.id !== postId) return post;
      const newComment = {
        id: 'comment-' + Date.now(),
        content: text,
        authorName: 'Juan Pacheco',
        authorEmail: 'juanpacheco@playcode.com.ar',
        createdAt: new Date().toISOString()
      };
      return { ...post, comments: [...(post.comments || []), newComment] };
    });

    setPosts(updated);
    localStorage.setItem('playcode_forum_posts', JSON.stringify(updated));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Modal States for Lessons
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonCourseName, setNewLessonCourseName] = useState('');
  const [newLessonHtmlContent, setNewLessonHtmlContent] = useState('');

  // Editing Lesson State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonCourseName, setEditLessonCourseName] = useState('');
  const [editLessonHtmlContent, setEditLessonHtmlContent] = useState('');



  // Modal States for Adding Student
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('123456');
  const [newStudentRole, setNewStudentRole] = useState<'admin' | 'docente' | 'alumno' | 'profesor'>('alumno');

  // Modal States for Adding Meeting
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingUrl, setNewMeetingUrl] = useState('');

  // Modal States for Adding Class
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassImageUrl, setNewClassImageUrl] = useState('');
  const [selectedClassStudents, setSelectedClassStudents] = useState<string[]>([]);

  // Modal States for Editing Class
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassDescription, setEditClassDescription] = useState('');
  const [editClassImageUrl, setEditClassImageUrl] = useState('');
  const [selectedEditClassStudents, setSelectedEditClassStudents] = useState<string[]>([]);

  // Search filters for Modals
  const [addStudentSearch, setAddStudentSearch] = useState('');
  const [editStudentSearch, setEditStudentSearch] = useState('');
  const [isAddStudentDropdownOpen, setIsAddStudentDropdownOpen] = useState(false);
  const [isEditStudentDropdownOpen, setIsEditStudentDropdownOpen] = useState(false);

  // Lesson Selection States in Class Modals
  const [selectedClassLessons, setSelectedClassLessons] = useState<string[]>([]);
  const [selectedEditClassLessons, setSelectedEditClassLessons] = useState<string[]>([]);
  const [addClassLessonSearch, setAddClassLessonSearch] = useState('');
  const [editClassLessonSearch, setEditClassLessonSearch] = useState('');
  const [isAddClassLessonDropdownOpen, setIsAddClassLessonDropdownOpen] = useState(false);
  const [isEditClassLessonDropdownOpen, setIsEditClassLessonDropdownOpen] = useState(false);

  // Lesson content search filter
  const [lessonSearchFilter, setLessonSearchFilter] = useState('');

  // Lesson preview modal
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);



  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName,
      email: newStudentEmail,
      status: 'Activo',
      password: newStudentPassword || '123456',
      role: newStudentRole,
      platformIds: newStudentPlatformIds,
      aulaIds: newStudentAulaIds
    };
    setStudents([...students, newStudent]);

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPassword('123456');
    setNewStudentRole('alumno');
    setNewStudentPlatformIds([]);
    setNewStudentAulaIds([]);
    setNewStudentPlatformSearch('');
    setNewStudentAulaSearch('');
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('¿Estás seguro de eliminar a este usuario?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const toggleStudentStatus = (id: string) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Activo' ? 'Completado' : s.status === 'Completado' ? 'Pendiente' : 'Activo';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleStartEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setEditStudentName(student.name);
    setEditStudentEmail(student.email);
    setEditStudentRole(student.role || 'alumno');
    setEditStudentPassword(student.password || '123456');
    setEditStudentPlatformIds(student.platformIds || (student.platformId ? [student.platformId] : []));
    setEditStudentAulaIds(student.aulaIds || (student.aulaId ? [student.aulaId] : []));
    setEditStudentPlatformSearch('');
    setEditStudentAulaSearch('');
    setShowEditStudentModal(true);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId || !editStudentName.trim() || !editStudentEmail.trim()) return;

    setStudents(prev => prev.map(s => {
      if (s.id === editingStudentId) {
        return {
          ...s,
          name: editStudentName.trim(),
          email: editStudentEmail.trim(),
          role: editStudentRole,
          password: editStudentPassword || '123456',
          platformIds: editStudentPlatformIds,
          aulaIds: editStudentAulaIds
        };
      }
      return s;
    }));

    setEditingStudentId(null);
    setEditStudentName('');
    setEditStudentEmail('');
    setEditStudentRole('alumno');
    setEditStudentPassword('');
    setEditStudentPlatformIds([]);
    setEditStudentAulaIds([]);
    setEditStudentPlatformSearch('');
    setEditStudentAulaSearch('');
    setShowEditStudentModal(false);
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingName || !newMeetingUrl) return;
    const newMeeting: Meeting = {
      id: 'm' + Date.now().toString(),
      name: newMeetingName,
      url: newMeetingUrl
    };
    setMeetings([...meetings, newMeeting]);
    setNewMeetingName('');
    setNewMeetingUrl('');
    setShowAddMeetingModal(false);
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este Meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
      // Clean up reference in classes
      setClassrooms(classrooms.map(c => c.meetingId === id ? { ...c, meetingId: undefined } : c));
    }
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonHtmlContent) return;
    const newLesson: Lesson = {
      id: 'l' + Date.now().toString(),
      title: newLessonTitle,
      courseName: newLessonCourseName || '',
      htmlContent: newLessonHtmlContent
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle('');
    setNewLessonCourseName('');
    setNewLessonHtmlContent('');
    setShowAddLessonModal(false);
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta lección?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleStartEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonCourseName(lesson.courseName || '');
    setEditLessonHtmlContent(lesson.htmlContent);
  };

  const handleSaveEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editLessonTitle || !editLessonHtmlContent) return;
    setLessons(lessons.map(l => l.id === editingLesson.id ? {
      ...l,
      title: editLessonTitle,
      courseName: editLessonCourseName || '',
      htmlContent: editLessonHtmlContent
    } : l));
    setEditingLesson(null);
  };

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;
    const newClass: Classroom = {
      id: 'c' + Date.now().toString(),
      name: newClassName,
      description: newClassDescription,
      imageUrl: newClassImageUrl || undefined,
      students: selectedClassStudents,
      lessonIds: selectedClassLessons
    };
    setClassrooms([...classrooms, newClass]);
    setNewClassName('');
    setNewClassDescription('');
    setNewClassImageUrl('');
    setSelectedClassStudents([]);
    setSelectedClassLessons([]);
    setAddStudentSearch('');
    setAddClassLessonSearch('');
    setShowAddClassModal(false);
  };

  const handleDeleteClassroom = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      setClassrooms(classrooms.filter(c => c.id !== id));
    }
  };

  const handleStartEditClass = (cls: Classroom) => {
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditClassDescription(cls.description);
    setEditClassImageUrl(cls.imageUrl || '');
    setSelectedEditClassStudents(cls.students);
    setSelectedEditClassLessons(cls.lessonIds || []);

    setEditStudentSearch('');
    setEditClassLessonSearch('');
  };

  const handleSaveEditClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editClassName) return;
    setClassrooms(classrooms.map(c => c.id === editingClass.id ? {
      ...c,
      name: editClassName,
      description: editClassDescription,
      imageUrl: editClassImageUrl || undefined,
      students: selectedEditClassStudents,
      lessonIds: selectedEditClassLessons
    } : c));
    setEditStudentSearch('');
    setEditClassLessonSearch('');
    setEditClassImageUrl('');
    setEditingClass(null);
  };



  const totalStudents = students.length;

  return (
    <div className="min-h-screen bg-[#f3f7fa] flex flex-col md:flex-row text-[#0d1b2e] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d1b2e] text-slate-100 flex flex-col border-r-4 border-[#1e385c]">
        {/* Brand header */}
        <div className="p-6 border-b border-[#1e385c] flex items-center gap-3">
          <div className="bg-[#1e385c] p-1.5 border border-[#6180a6] text-[#a3b8cc] shadow-[1px_1px_0_0_#ffffff]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-pixel text-sm tracking-wider text-white block">Play Code</span>
            <span className="text-[9px] text-[#a3b8cc] font-bold uppercase tracking-widest">LMS Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'inicio'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> INICIO / MÉTRICAS
          </button>

          <button
            onClick={() => setActiveTab('clases')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'clases'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> CURSOS
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'meetings'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <Video className="w-3.5 h-3.5" /> MEETINGS
          </button>

          <button
            onClick={() => setActiveTab('contenido')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'contenido'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <Code2 className="w-3.5 h-3.5" /> CONTENIDO / LECCIONES
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'usuarios'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <Users className="w-3.5 h-3.5" /> USUARIOS
          </button>

          <button
            onClick={() => setActiveTab('docentes')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'docentes'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> DOCENTES
          </button>

          <button
            onClick={() => setActiveTab('plataformas')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'plataformas'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <Building2 className="w-3.5 h-3.5" /> PLATAFORMAS
          </button>

          <button
            onClick={() => setActiveTab('foro')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'foro'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> FOROS (MODERAR)
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs border transition-all cursor-pointer ${activeTab === 'config'
                ? 'bg-[#a3b8cc] text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff] translate-x-0.5 -translate-y-0.5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e385c]/50'
              }`}
          >
            <Settings className="w-3.5 h-3.5" /> CONFIGURACIÓN
          </button>
        </nav>

        {/* Footer Sidebar with Logout */}
        <div className="p-4 border-t border-[#1e385c] bg-[#091220]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#2a4e7c] text-white flex items-center justify-center font-bold text-xs uppercase border border-[#6180a6]">
              {userName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-200 block truncate">{userName}</span>
              <span className="text-[9px] text-[#a3b8cc] block truncate">{userEmail}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1e385c] hover:bg-[#2a4e7c] text-slate-100 font-bold text-xs border border-[#6180a6] shadow-[2px_2px_0_0_#0d1b2e] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[2px] active:translate-x-[2px] transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-[#a3b8cc] mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0d1b2e]">Panel de Control</h1>
            <p className="text-[#6180a6] font-medium text-xs">Administración y control general de la academia.</p>
          </div>
          <div className="bg-[#2a4e7c] text-white border-2 border-[#0d1b2e] px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold shadow-[2px_2px_0_0_#0d1b2e]">
            Superadmin
          </div>
        </header>

        {/* Dynamic Tab Rendering */}

        {/* INICIO TAB */}
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-bold text-[#6180a6] uppercase block mb-1">Usuarios Registrados</span>
                <span className="text-3xl font-bold text-[#0d1b2e] block">{totalStudents}</span>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#2a4e7c]">
                  <TrendingUp className="w-3 h-3" /> +12% este mes
                </div>
              </div>

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-bold text-[#6180a6] uppercase block mb-1">Cursos Activos</span>
                <span className="text-3xl font-bold text-[#0d1b2e] block">{classrooms.length}</span>
                <span className="text-[10px] font-medium text-slate-500 block mt-2.5">Cursos Registrados</span>
              </div>

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-bold text-[#6180a6] uppercase block mb-1">Salas de Meeting</span>
                <span className="text-3xl font-bold text-[#0d1b2e] block">{meetings.length}</span>
                <span className="text-[10px] font-medium text-slate-500 block mt-2.5">Google Meet disponibles</span>
              </div>

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-bold text-[#6180a6] uppercase block mb-1">Plataforma Cloud</span>
                <span className="text-lg font-bold text-[#0d1b2e] block truncate">edu.playcode.com.ar</span>
                <div className="mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2a4e7c] animate-ping"></span>
                  <span className="text-[9px] font-bold text-[#2a4e7c]">ONLINE</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-[#0d1b2e] p-6 shadow-[4px_4px_0_0_#0d1b2e] lg:col-span-2">
                <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 border-b border-[#a3b8cc] pb-2 uppercase tracking-wider">Actividad Reciente</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#a3b8cc]">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f0f4f8] p-1.5 border border-[#0d1b2e] text-[#2a4e7c]">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-[#6180a6] font-bold uppercase">NUEVO ALUMNO</p>
                        <p className="text-xs font-semibold text-[#0d1b2e]">Lucas Gómez se inscribió en "Robótica y Programación"</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Hace 15m</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-[#a3b8cc]">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f0f4f8] p-1.5 border border-[#0d1b2e] text-[#2a4e7c]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-[#6180a6] font-bold uppercase">CLASE FINALIZADA</p>
                        <p className="text-xs font-semibold text-[#0d1b2e]">Erica Diaz finalizó la clase de "Aula Maker" en sede CCA</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Hace 2h</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-[#a3b8cc]">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f0f4f8] p-1.5 border border-[#0d1b2e] text-[#2a4e7c]">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-[#6180a6] font-bold uppercase">CÓDIGO SUBIDO</p>
                        <p className="text-xs font-semibold text-[#0d1b2e]">Mateo Fernández entregó su proyecto final de Arduino</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Ayer</span>
                  </div>
                </div>
              </div>

              {/* Monochromatic Quick Actions */}
              <div className="bg-white border-2 border-[#0d1b2e] p-6 shadow-[4px_4px_0_0_#0d1b2e]">
                <h3 className="text-xs font-bold mb-4 tracking-wider text-[#0d1b2e] uppercase">ACCIONES RÁPIDAS</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddClassModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[2px] active:translate-x-[2px] transition-all cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> PLANIFICAR CLASE
                  </button>

                  <button
                    onClick={() => setShowAddMeetingModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#a3b8cc] hover:bg-[#6180a6] text-[#0d1b2e] hover:text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#0d1b2e] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px] transition-all cursor-pointer text-xs"
                  >
                    <Video className="w-3.5 h-3.5" /> AGREGAR GOOGLE MEET
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLASES TAB */}
        {activeTab === 'clases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-[#0d1b2e]">Cursos Registrados</h2>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Curso
              </button>
            </div>

            <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e] overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#0d1b2e] text-white border-b-2 border-[#1e385c]">
                    <th className="p-3 font-semibold uppercase tracking-wider">Curso</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Descripción</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a3b8cc]/30">
                  {classrooms.map((cls) => {
                    return (
                      <tr key={cls.id} className="hover:bg-[#f0f4f8]/50 font-medium">
                        <td className="p-3 text-[#0d1b2e] font-bold">{cls.name}</td>
                        <td className="p-3 text-slate-500 max-w-[300px] truncate" title={cls.description}>
                          {cls.description || <span className="text-slate-350 italic">Sin descripción</span>}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditClass(cls)}
                              className="text-slate-400 hover:text-[#2a4e7c] p-1 cursor-pointer transition-colors"
                              title="Editar Curso"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClassroom(cls.id)}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                              title="Eliminar Curso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {classrooms.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                        No hay cursos registrados. ¡Crea un curso para comenzar!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEETINGS TAB */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-[#0d1b2e]">Salas de Google Meet</h2>
              <button
                onClick={() => setShowAddMeetingModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Meeting
              </button>
            </div>

            <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e] overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#0d1b2e] text-white border-b-2 border-[#1e385c]">
                    <th className="p-3 font-semibold uppercase tracking-wider">ID</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Nombre del Enlace</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">URL de Google Meet</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a3b8cc]/30">
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-[#f0f4f8]/50 font-medium">
                      <td className="p-3 text-slate-400 font-bold">{meeting.id}</td>
                      <td className="p-3 text-[#0d1b2e] font-bold">{meeting.name}</td>
                      <td className="p-3">
                        <a
                          href={meeting.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2a4e7c] hover:underline font-bold flex items-center gap-1.5"
                        >
                          {meeting.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Eliminar Meeting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {meetings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                        No hay salas creadas. Crea una para ofrecerla al agendar clases.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* USUARIOS TAB */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-[#0d1b2e]">Usuarios Registrados</h2>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Usuario
              </button>
            </div>

            <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e] overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#0d1b2e] text-white border-b-2 border-[#1e385c]">
                    <th className="p-3 font-semibold uppercase tracking-wider">ID</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Nombre</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Correo</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Rol</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Plataforma / Aula</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Estado</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a3b8cc]/30">
                  {/* Admin Row — always first, highlighted */}
                  <tr className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200 font-medium">
                    <td className="p-3 text-amber-500 font-bold">★</td>
                    <td className="p-3 text-[#0d1b2e] font-bold flex items-center gap-2">
                      {userName}
                      <span className="text-[8px] bg-amber-400 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Tú</span>
                    </td>
                    <td className="p-3 text-[#6180a6]">{userEmail}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 border-2 border-amber-400 font-bold text-[10px] rounded shadow-[1px_1px_0_0_#b45309]">Admin</span>
                    </td>
                    <td className="p-3 text-[#2a4e7c]">—</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-[#dcfce7] text-[#16a34a] border-2 border-[#0d1b2e] font-bold text-[10px] rounded">Activo</span>
                    </td>
                    <td className="p-3 text-slate-300 text-[10px] italic">Protegido</td>
                  </tr>

                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-[#f0f4f8]/50 font-medium">
                      <td className="p-3 text-slate-400 font-bold">{student.id}</td>
                      <td className="p-3 text-[#0d1b2e] font-bold">{student.name}</td>
                      <td className="p-3 text-[#6180a6]">{student.email}</td>
                      <td className="p-3">
                        <select
                          value={student.role || 'alumno'}
                          onChange={(e) => {
                            const newRole = e.target.value as 'admin' | 'docente' | 'alumno' | 'profesor';
                            setStudents(students.map(s => s.id === student.id ? { ...s, role: newRole } : s));
                          }}
                          className="p-1.5 border-2 border-[#0d1b2e] bg-white font-bold text-[10px] rounded cursor-pointer shadow-[1px_1px_0_0_#000000] focus:outline-none"
                        >
                          <option value="alumno">Alumno</option>
                          <option value="docente">Docente</option>
                          <option value="profesor">Profesor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {(() => {
                          const currentPlatformIds = student.platformIds || (student.platformId ? [student.platformId] : []);
                          const currentAulaIds = student.aulaIds || (student.aulaId ? [student.aulaId] : []);

                          if (currentPlatformIds.length === 0) {
                            return <span className="text-slate-400 italic">No asignado</span>;
                          }

                          return (
                            <div className="space-y-1.5">
                              {currentPlatformIds.map(pId => {
                                const plat = platforms.find(p => p.id === pId);
                                if (!plat) return null;
                                const platformAulas = plat.aulas.filter(a => currentAulaIds.includes(a.id));
                                return (
                                  <div key={pId} className="border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                                    <span className="font-bold text-slate-800 block text-[11px]">{plat.name}</span>
                                    {platformAulas.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 mt-0.5">
                                        {platformAulas.map(a => (
                                          <span key={a.id} className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.2 rounded font-medium">
                                            {a.name}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-slate-400 italic">Sin aula asignada</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`px-3 py-1 border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1px_1px_0_0_#1e3a8a] active:translate-y-[1px] active:shadow-[0px_0px_0_0_#0f172a] ${student.status === 'Activo'
                              ? 'bg-[#dcfce7] text-[#16a34a]'
                              : student.status === 'Completado'
                                ? 'bg-[#e0f2fe] text-[#0284c7]'
                                : 'bg-[#fef9c3] text-[#ca8a04]'
                            }`}
                          title="Cambiar estado"
                        >
                          {student.status}
                        </button>
                        {student.status === 'Pendiente' && (
                          <button
                            onClick={() => {
                              setStudents(students.map(s => s.id === student.id ? { ...s, status: 'Activo' } : s));
                            }}
                            className="px-2.5 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                          >
                            Activar
                          </button>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditStudent(student)}
                            className="px-2 py-1 bg-[#ffe66d] hover:bg-[#ffd166] text-[#001f4a] border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                            title="Editar usuario"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCENTES TAB */}
        {activeTab === 'docentes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0d1b2e] border-b border-slate-200 pb-4">
              Cuerpo Docente y Directivos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#f0f4f8] text-[#2a4e7c] flex items-center justify-center font-bold text-base border-2 border-[#0d1b2e] shadow-[1px_1px_0_0_#000000]">
                    ED
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0d1b2e]">Erica Diaz</h3>
                    <p className="text-[10px] text-[#6180a6] font-bold mb-2 uppercase">Co-fundadora & Pedagogía</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Lidera la planificación de clases, talleres de Aula Maker y la coordinación pedagógica en colegios asociados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#f0f4f8] text-[#2a4e7c] flex items-center justify-center font-bold text-base border-2 border-[#0d1b2e] shadow-[1px_1px_0_0_#000000]">
                    JP
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0d1b2e]">Juan Pacheco</h3>
                    <p className="text-[10px] text-[#6180a6] font-bold mb-2 uppercase">Co-fundador & Tecnología</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Supervisión técnica de la plataforma, diseño de planes curriculares de IA y talleres de capacitación tecnológica.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0d1b2e] border-b border-slate-200 pb-4">
              Configuración de la Plataforma
            </h2>

            <div className="bg-white border-2 border-[#0d1b2e] p-6 shadow-[4px_4px_0_0_#0d1b2e] max-w-xl">
              <form onSubmit={(e) => { e.preventDefault(); alert('Configuración guardada correctamente.'); }} className="space-y-5 text-xs">
                <div>
                  <label className="font-bold text-[#6180a6] block mb-1.5">Nombre del LMS</label>
                  <input
                    type="text"
                    defaultValue="Play Code Academia"
                    className="w-full p-2 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#6180a6] block mb-1.5">Dominio Principal</label>
                  <input
                    type="text"
                    defaultValue="edu.playcode.com.ar"
                    className="w-full p-2 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 border border-[#a3b8cc] rounded accent-[#2a4e7c] cursor-pointer"
                    id="strict-auth"
                  />
                  <label htmlFor="strict-auth" className="font-semibold text-slate-650 cursor-pointer">
                    Exigir verificación Google Auth a todos los accesos
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer text-xs"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FORO MODERATION TAB */}
        {activeTab === 'foro' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in zoom-in duration-150">
            {!selectedPostId && (
              <>
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0d1b2e]">Moderación de Foros</h2>
                    <p className="text-xs text-[#6180a6] font-semibold mt-1">
                      Supervisa las publicaciones y comentarios de la comunidad. Elimina contenidos que no cumplan las normas.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddPostForm(!showAddPostForm)}
                      className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer text-xs flex items-center gap-1.5"
                    >
                      {showAddPostForm ? 'Cancelar' : 'Nueva Publicación'} <Plus className="w-3.5 h-3.5" />
                    </button>
                    <div className="bg-[#2a4e7c] text-white border-2 border-[#0d1b2e] px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold shadow-[2px_2px_0_0_#0d1b2e]">
                      {posts.length} PUBLICACIÓN{posts.length !== 1 ? 'ES' : ''}
                    </div>
                  </div>
                </div>

                {/* Buscador del Foro */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={forumSearchQuery}
                    onChange={(e) => setForumSearchQuery(e.target.value)}
                    placeholder="Buscar publicaciones por título, contenido o autor..."
                    className="w-full pl-9 pr-9 py-2 border-2 border-[#0d1b2e] rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                  />
                  {forumSearchQuery && (
                    <button
                      onClick={() => setForumSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Formulario para nuevo Post del Admin */}
                {showAddPostForm && (
                  <form onSubmit={handleCreatePost} className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0d1b2e]">Crear Nueva Publicación como Administrador</h3>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-655 block">Título</label>
                      <input
                        type="text"
                        required
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Ej. Novedades sobre el curso de IA 🚀"
                        className="w-full px-3 py-2 border-2 border-[#0d1b2e] rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-655 block">Mensaje / Contenido</label>
                      <textarea
                        required
                        rows={4}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Escribe el anuncio o mensaje del foro..."
                        className="w-full px-3 py-2 border-2 border-[#0d1b2e] rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-655 block">Subir Imagen (Opcional)</label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-2 file:border-[#0d1b2e] file:text-xs file:font-bold file:bg-[#f0f4f8] file:text-[#2a4e7c] file:cursor-pointer hover:file:bg-slate-100"
                        />
                        {newPostImage && (
                          <button
                            type="button"
                            onClick={() => setNewPostImage(null)}
                            className="text-xs text-red-655 hover:underline font-bold"
                          >
                            Quitar Imagen
                          </button>
                        )}
                      </div>

                      {newPostImage && (
                        <div className="mt-2 border-2 border-[#0d1b2e] rounded max-w-xs overflow-hidden shadow-[2px_2px_0_0_#0d1b2e]">
                          <img src={newPostImage} alt="Preview" className="w-full object-cover max-h-48" />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer text-xs"
                      >
                        Publicar en el Foro
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* EDIT POST MODAL */}
            {editingPostId && (
              <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-xl p-5 animate-in fade-in zoom-in duration-150">
                  <h3 className="text-sm font-bold text-[#0d1b2e] mb-2 uppercase tracking-wider">Editar Publicación</h3>
                  <p className="text-[10px] text-slate-500 mb-4 font-semibold">Modifica los detalles de la publicación seleccionada.</p>
                  <form onSubmit={handleSaveEditPost} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-[#6180a6] block mb-1">Título</label>
                      <input
                        type="text"
                        required
                        value={editPostTitle}
                        onChange={(e) => setEditPostTitle(e.target.value)}
                        className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#6180a6] block mb-1">Mensaje / Contenido</label>
                      <textarea
                        required
                        rows={5}
                        value={editPostContent}
                        onChange={(e) => setEditPostContent(e.target.value)}
                        className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#6180a6] block mb-1.5">Imagen (Base64)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border file:border-slate-350 file:text-xs file:font-semibold file:bg-slate-50 file:cursor-pointer"
                        />
                        {editPostImage && (
                          <button
                            type="button"
                            onClick={() => setEditPostImage(null)}
                            className="text-xs text-red-655 font-bold hover:underline"
                          >
                            Quitar Imagen
                          </button>
                        )}
                      </div>
                      {editPostImage && (
                        <div className="mt-2 border border-slate-300 rounded max-w-[200px] overflow-hidden">
                          <img src={editPostImage} alt="Edit preview" className="w-full object-cover max-h-36" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostId(null);
                          setEditPostTitle('');
                          setEditPostContent('');
                          setEditPostImage(null);
                        }}
                        className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-655 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Listado de Posts */}
            {selectedPostId ? (
              (() => {
                const post = posts.find(p => p.id === selectedPostId);
                if (!post) {
                  setSelectedPostId(null);
                  return null;
                }
                const userEmail = 'juanpacheco@playcode.com.ar';
                const hasLiked = (post.likedBy || []).includes(userEmail);
                const userReaction = (post.reactedBy || {})[userEmail];
                return (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => setSelectedPostId(null)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 font-bold text-xs border-2 border-[#0d1b2e] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] text-slate-800"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver al Foro
                    </button>

                    <div className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] flex flex-col gap-4">
                      {/* Autor, fecha y acción principal de borrar */}
                      <div className="flex justify-between items-start pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] border border-slate-350 flex items-center justify-center font-bold text-sm shadow-[1px_1px_0_0_#0d1b2e]">
                            {post.authorAvatar || '🚀'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">{post.authorName}</span>
                            <span className="text-[9px] text-slate-400 block font-medium">{post.authorEmail}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-mono">
                            {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditPost(post)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] border border-amber-300 rounded cursor-pointer transition-all"
                              title="Editar Publicación"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>EDITAR</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeletePost(post.id);
                                setSelectedPostId(null);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-655 font-bold text-[10px] border border-red-300 rounded cursor-pointer transition-all"
                              title="Eliminar Publicación Completa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ELIMINAR</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detalle del Post */}
                      <div>
                        <h3 className="text-sm font-bold text-[#0d1b2e] mb-1.5 leading-snug">{post.title}</h3>
                        <p className="text-xs text-slate-655 whitespace-pre-wrap leading-relaxed font-semibold">{post.content}</p>
                      </div>

                      {/* Imagen del Post */}
                      {post.imageUrl && (
                        <div className="border-2 border-[#0d1b2e] rounded overflow-hidden max-w-md shadow-[2px_2px_0_0_#0d1b2e]">
                          <img src={post.imageUrl} alt={post.title} className="w-full object-cover max-h-60" />
                        </div>
                      )}

                      {/* Botones de Interaccion (Likes y Reacciones) */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        {/* Botón de Like */}
                        <button
                          onClick={() => handleLikePostInteractive(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${hasLiked
                              ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-[1px_1px_0_0_#e11d48]'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 shadow-[1px_1px_0_0_#cbd5e1]'
                            }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-600' : ''}`} />
                          <span>{post.likes}</span>
                        </button>

                        {/* Reaction Emojis Picker */}
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5 shadow-[1px_1px_0_0_#cbd5e1]">
                          {['🚀', '🎉', '💻', '🧠'].map((emoji) => {
                            const count = post.reactions?.[emoji] || 0;
                            const isSelected = userReaction === emoji;
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleReactToPostInteractive(post.id, emoji)}
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all cursor-pointer ${isSelected
                                    ? 'bg-[#ffe66d] border border-[#001f4a] font-bold scale-110'
                                    : 'hover:bg-slate-200 border border-transparent'
                                  }`}
                                title={`Reaccionar con ${emoji}`}
                              >
                                <span>{emoji}</span>
                                {count > 0 && <span className="text-[9px] font-bold text-slate-600">{count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Listado de comentarios a moderar */}
                      <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-4">
                        <h4 className="text-xs font-bold text-[#0d1b2e] uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#2a4e7c]" />
                          Comentarios ({post.comments?.length || 0})
                        </h4>

                        {post.comments && post.comments.length > 0 ? (
                          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                            {post.comments.map((comment: any) => (
                              <div key={comment.id} className="bg-white border border-slate-200 p-2.5 rounded flex justify-between items-start gap-4 shadow-[1.5px_1.5px_0_0_#cbd5e1]">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-800">{comment.authorName}</span>
                                    <span className="text-[8px] text-slate-455 font-medium">({comment.authorEmail})</span>
                                    <span className="text-[8px] text-slate-400 bg-slate-50 px-1 rounded font-mono">
                                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-655 font-semibold">{comment.content}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-slate-400 hover:text-red-650 p-1 cursor-pointer transition-colors"
                                  title="Eliminar Comentario"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic font-medium">Sin comentarios en esta publicación. ¡Sé el primero en responder!</p>
                        )}

                        {/* Input para agregar comentario como admin */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Escribe un comentario como administrador..."
                            className="flex-1 px-3 py-1.5 border-2 border-slate-300 rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCommentInteractive(post.id);
                            }}
                          />
                          <button
                            onClick={() => handleAddCommentInteractive(post.id)}
                            className="p-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white rounded border border-[#0d1b2e] shadow-[1px_1px_0_0_#000000] active:translate-y-[1px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer"
                            title="Enviar comentario"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const query = forumSearchQuery.toLowerCase().trim();
                const filteredPosts = query
                  ? posts.filter(post =>
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.authorName.toLowerCase().includes(query)
                  )
                  : posts;
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPostId(post.id)}
                          className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] flex flex-col justify-between overflow-hidden hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all"
                        >
                          {post.imageUrl ? (
                            <div className="w-full h-32 overflow-hidden border-b-2 border-[#0d1b2e] shrink-0">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-[#0d1b2e] to-[#1e385c] border-b-2 border-[#0d1b2e] flex items-center justify-center shrink-0">
                              <MessageSquare className="w-10 h-10 text-[#a3b8cc]/20" />
                            </div>
                          )}

                          <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div>
                              {/* Autor & Fecha */}
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-[#f0f4f8] border border-slate-350 flex items-center justify-center font-bold text-xs shadow-[0.5px_0.5px_0_0_#0d1b2e]">
                                  {post.authorAvatar || '🚀'}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold text-slate-800 block truncate leading-none">{post.authorName}</span>
                                  <span className="text-[8px] text-slate-455 block font-mono mt-0.5 leading-none">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <h4 className="text-xs font-bold mb-1 line-clamp-2 leading-tight text-[#0d1b2e]">{post.title}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-3 font-semibold leading-relaxed">{post.content}</p>
                            </div>

                            {/* Footer: Likes y Comentarios */}
                            <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[9px] font-bold text-slate-500">
                              <div className="flex items-center gap-2">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments?.length || 0}</span>
                              </div>
                              <span className="text-[#2a4e7c] uppercase hover:underline">Ver más &rarr;</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredPosts.length === 0 && (
                      <div className="p-12 text-center bg-white border-2 border-dashed border-slate-300 rounded shadow-[3px_3px_0_0_#cbd5e1]">
                        <p className="text-slate-400 text-xs italic font-medium">
                          {posts.length === 0
                            ? "No hay ninguna publicación en el foro actualmente."
                            : "No se encontraron publicaciones que coincidan con tu búsqueda."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* PLATAFORMAS TAB */}
        {activeTab === 'plataformas' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0d1b2e]">Plataformas</h2>
                <p className="text-xs text-[#6180a6] font-semibold mt-1">
                  Gestiona entidades educativas y sus aulas. Cada entidad puede tener múltiples aulas con distintas edades y modalidades.
                </p>
              </div>
              <button
                onClick={() => setShowNewPlatformForm(!showNewPlatformForm)}
                className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer text-xs flex items-center gap-1.5"
              >
                {showNewPlatformForm ? 'Cancelar' : 'Nueva Entidad'} <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nuevo Platform Form */}
            {showNewPlatformForm && (
              <form
                onSubmit={handleCreatePlatform}
                className="bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#0d1b2e] space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0d1b2e]">Crear Nueva Entidad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Nombre de la Entidad *</label>
                    <input
                      type="text"
                      required
                      value={newPlatformName}
                      onChange={e => setNewPlatformName(e.target.value)}
                      placeholder="Ej. Play Code, Coder Academy..."
                      className="w-full px-3 py-2 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Descripción</label>
                    <input
                      type="text"
                      value={newPlatformDesc}
                      onChange={e => setNewPlatformDesc(e.target.value)}
                      placeholder="Descripción breve de la entidad..."
                      className="w-full px-3 py-2 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowNewPlatformForm(false)} className="px-3 py-1.5 border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancelar</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white text-xs font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] cursor-pointer">Crear Entidad</button>
                </div>
              </form>
            )}

            {/* Lista de Plataformas (Accordion) */}
            <div className="space-y-4">
              {platforms.map(platform => (
                <div key={platform.id} className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e]">
                  {/* Entity Header */}
                  {editingPlatformId === platform.id ? (
                    <div className="p-4 border-b-2 border-[#0d1b2e] bg-[#f0f6ff] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input
                        type="text"
                        value={editPlatformName}
                        onChange={e => setEditPlatformName(e.target.value)}
                        className="flex-1 px-2 py-1.5 border-2 border-[#2a4e7c] text-sm font-bold focus:outline-none"
                        placeholder="Nombre de la entidad"
                      />
                      <input
                        type="text"
                        value={editPlatformDesc}
                        onChange={e => setEditPlatformDesc(e.target.value)}
                        className="flex-1 px-2 py-1.5 border-2 border-slate-300 text-xs focus:outline-none"
                        placeholder="Descripción"
                      />
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleSaveEditPlatform(platform.id)} className="px-3 py-1.5 bg-[#2a4e7c] text-white text-xs font-bold border border-[#0d1b2e] cursor-pointer hover:bg-[#1e385c]">Guardar</button>
                        <button onClick={() => setEditingPlatformId(null)} className="px-3 py-1.5 border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border-b-2 border-[#0d1b2e] group"
                      onClick={() => setExpandedPlatformId(expandedPlatformId === platform.id ? null : platform.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-[#0d1b2e] flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-[#a3b8cc]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#0d1b2e] leading-tight">{platform.name}</h3>
                          {platform.description && (
                            <p className="text-[11px] text-slate-500 truncate">{platform.description}</p>
                          )}
                        </div>
                        <span className="ml-2 bg-[#e8f0fe] text-[#2a4e7c] border border-[#2a4e7c] text-[9px] font-bold px-2 py-0.5 uppercase shrink-0">
                          {platform.aulas.length} aula{platform.aulas.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                          onClick={e => { e.stopPropagation(); handleStartEditPlatform(platform); }}
                          className="p-1.5 text-slate-400 hover:text-[#2a4e7c] border border-transparent hover:border-[#2a4e7c] transition-all cursor-pointer"
                          title="Editar entidad"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeletePlatform(platform.id); }}
                          className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-400 transition-all cursor-pointer"
                          title="Eliminar entidad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expandedPlatformId === platform.id
                          ? <ChevronDown className="w-4 h-4 text-[#2a4e7c]" />
                          : <ChevronRight className="w-4 h-4 text-slate-400" />
                        }
                      </div>
                    </div>
                  )}

                  {/* Aulas Accordion */}
                  {expandedPlatformId === platform.id && (
                    <div className="p-4 space-y-3">
                      {/* Aulas Table */}
                      {platform.aulas.length > 0 && (
                        <div className="border border-slate-200 overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-[#f0f4f8] border-b border-slate-200">
                              <tr>
                                <th className="text-left px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider">Aula</th>
                                <th className="text-left px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider">Edades</th>
                                <th className="text-left px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider">Modalidad</th>
                                <th className="text-left px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider hidden sm:table-cell">Día y Horario</th>
                                <th className="text-left px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider hidden sm:table-cell">Descripción</th>
                                <th className="text-center px-3 py-2 font-bold text-[#0d1b2e] uppercase tracking-wider">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {platform.aulas.map(aula => (
                                <tr key={aula.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                  <td className="px-3 py-2.5 font-bold text-[#0d1b2e]">{aula.name}</td>
                                  <td className="px-3 py-2.5 text-slate-600">{aula.ageRange}</td>
                                  <td className="px-3 py-2.5">
                                    <div className="flex flex-col gap-1 items-start">
                                      <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase border ${aula.modality === 'Virtual'
                                          ? 'bg-[#e8f0fe] text-[#2a4e7c] border-[#2a4e7c]'
                                          : 'bg-[#e8f7ee] text-[#2a6b3c] border-[#2a6b3c]'
                                        }`}>
                                        {aula.modality}
                                      </span>
                                      {aula.modality === 'Virtual' && aula.meetingUrl && (
                                        <a
                                          href={aula.meetingUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#2C7EEA] hover:underline text-[9px] font-bold flex items-center gap-0.5 mt-0.5"
                                        >
                                          Google Meet <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-600 hidden sm:table-cell max-w-[150px] truncate">{aula.schedule || '—'}</td>
                                  <td className="px-3 py-2.5 text-slate-500 hidden sm:table-cell max-w-[150px] truncate">{aula.description || '—'}</td>
                                  <td className="px-3 py-2.5">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleStartEditAula(platform.id, aula)}
                                        className="p-1.5 text-slate-400 hover:text-[#2a4e7c] border border-transparent hover:border-[#2a4e7c] transition-all cursor-pointer"
                                        title="Editar aula"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAula(platform.id, aula.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-400 transition-all cursor-pointer"
                                        title="Eliminar aula"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Formulario Nueva Aula */}
                      {showNewAulaForPlatform === platform.id ? (
                        <form onSubmit={e => handleCreateAula(e, platform.id)} className="border-2 border-dashed border-[#2a4e7c] bg-[#f0f6ff] p-4 space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2a4e7c]">Nueva Aula en {platform.name}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 block">Nombre del Aula *</label>
                              <input
                                type="text"
                                required
                                value={newAulaName}
                                onChange={e => setNewAulaName(e.target.value)}
                                placeholder="Ej. Aula Maker"
                                className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 block">Rango de Edad *</label>
                              <input
                                type="text"
                                required
                                value={newAulaAge}
                                onChange={e => setNewAulaAge(e.target.value)}
                                placeholder="Ej. 6 a 8 años"
                                className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 block">Modalidad</label>
                              <select
                                value={newAulaModality}
                                onChange={e => setNewAulaModality(e.target.value as 'Presencial' | 'Virtual')}
                                className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white cursor-pointer"
                              >
                                <option value="Presencial">Presencial</option>
                                <option value="Virtual">Virtual</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 block">Día y Horario</label>
                              <input
                                type="text"
                                value={newAulaSchedule}
                                onChange={e => setNewAulaSchedule(e.target.value)}
                                placeholder="Ej. Lunes 18:00"
                                className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 block">Descripción</label>
                              <input
                                type="text"
                                value={newAulaDesc}
                                onChange={e => setNewAulaDesc(e.target.value)}
                                placeholder="Descripción breve..."
                                className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                              />
                            </div>
                            {newAulaModality === 'Virtual' && (
                              <div className="space-y-1 col-span-full">
                                <label className="text-[10px] font-bold text-slate-600 block font-mono">ENLACE DE GOOGLE MEET *</label>
                                <input
                                  type="url"
                                  required
                                  value={newAulaMeetingUrl}
                                  onChange={e => setNewAulaMeetingUrl(e.target.value)}
                                  placeholder="https://meet.google.com/abc-defg-hij"
                                  className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                                />
                              </div>
                            )}
                            <div className="space-y-1 col-span-full relative">
                              <label className="text-[10px] font-bold text-slate-600 block font-mono">VINCULAR CURSOS A ESTA AULA</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={newAulaCourseSearch}
                                  onChange={e => {
                                    setNewAulaCourseSearch(e.target.value);
                                    setIsNewAulaCourseDropdownOpen(true);
                                  }}
                                  onFocus={() => setIsNewAulaCourseDropdownOpen(true)}
                                  placeholder="Buscar y seleccionar cursos..."
                                  className="w-full px-2 py-1.5 border-2 border-[#0d1b2e] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] bg-white"
                                />
                                {newAulaCourseSearch.trim().length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setNewAulaCourseSearch('')}
                                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-650 cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>

                              {isNewAulaCourseDropdownOpen && (() => {
                                const filteredCourses = classrooms.filter(c =>
                                  !newAulaCourseIds.includes(c.id) &&
                                  c.name.toLowerCase().includes(newAulaCourseSearch.toLowerCase())
                                );

                                return (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNewAulaCourseDropdownOpen(false)} />
                                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                                      {filteredCourses.map(course => (
                                        <button
                                          key={course.id}
                                          type="button"
                                          onClick={() => {
                                            setNewAulaCourseIds([...newAulaCourseIds, course.id]);
                                            setNewAulaCourseSearch('');
                                            setIsNewAulaCourseDropdownOpen(false);
                                          }}
                                          className="w-full text-left px-3 py-2 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                                        >
                                          <span className="font-semibold text-slate-800 text-[11px]">{course.name}</span>
                                          {course.description && (
                                            <span className="text-[9px] text-slate-400 font-normal truncate max-w-[280px]">{course.description}</span>
                                          )}
                                        </button>
                                      ))}
                                      {filteredCourses.length === 0 && (
                                        <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                                          No se encontraron cursos disponibles.
                                        </div>
                                      )}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Selected courses badges */}
                            {newAulaCourseIds.length > 0 && (
                              <div className="col-span-full">
                                <label className="font-semibold text-slate-500 block mb-1 text-[10px]">Cursos Vinculados:</label>
                                <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded bg-slate-50 max-h-24 overflow-y-auto">
                                  {newAulaCourseIds.map(id => {
                                    const course = classrooms.find(c => c.id === id);
                                    if (!course) return null;
                                    return (
                                      <span key={id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#2a4e7c] text-white font-bold text-[9px] rounded uppercase shadow-[1px_1px_0_0_#000000]">
                                        {course.name}
                                        <button
                                          type="button"
                                          onClick={() => setNewAulaCourseIds(newAulaCourseIds.filter(cid => cid !== id))}
                                          className="text-[#ffe66d] hover:text-white font-bold ml-1 cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => { setShowNewAulaForPlatform(null); setNewAulaSchedule(''); }} className="px-3 py-1.5 border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancelar</button>
                            <button type="submit" className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white text-xs font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] cursor-pointer">Agregar Aula</button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => { setShowNewAulaForPlatform(platform.id); setEditingAula(null); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 text-xs font-bold text-slate-400 hover:border-[#2a4e7c] hover:text-[#2a4e7c] transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Agregar Aula
                        </button>
                      )}

                      {platform.aulas.length === 0 && showNewAulaForPlatform !== platform.id && (
                        <p className="text-center text-xs text-slate-400 italic py-2">Esta entidad aún no tiene aulas. Haz clic en "Agregar Aula" para comenzar.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {platforms.length === 0 && (
                <div className="p-12 text-center bg-white border-2 border-dashed border-slate-300 shadow-[3px_3px_0_0_#cbd5e1]">
                  <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs italic font-medium">No hay entidades registradas. Crea tu primera plataforma con el botón "Nueva Entidad".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENIDO TAB */}
        {activeTab === 'contenido' && (() => {
          const q = lessonSearchFilter.toLowerCase();
          const filteredLessons = q
            ? lessons.filter(l => l.title.toLowerCase().includes(q))
            : lessons;

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0d1b2e]">Contenido Educativo</h2>
                  <p className="text-xs text-[#6180a6] font-semibold mt-1">Crea y administra lecciones con código HTML interactivo para tus usuarios.</p>
                </div>
                <button
                  onClick={() => {
                    setNewLessonTitle('');
                    setNewLessonCourseName('');
                    setNewLessonHtmlContent('');
                    setShowAddLessonModal(true);
                  }}
                  className="px-3.5 py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] active:translate-y-[3px] active:shadow-[0px_0px_0_0_#000000] transition-all flex items-center gap-2 cursor-pointer text-xs uppercase shrink-0"
                >
                  <Plus className="w-4 h-4" /> Nueva Lección
                </button>
              </div>

              {/* Predictive Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6180a6] pointer-events-none" />
                <input
                  type="text"
                  value={lessonSearchFilter}
                  onChange={(e) => setLessonSearchFilter(e.target.value)}
                  placeholder="Buscar lección por título..."
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-[#0d1b2e] bg-white text-sm text-slate-800 font-semibold rounded shadow-[2px_2px_0_0_#0d1b2e] focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] focus:shadow-[3px_3px_0_0_#2a4e7c] transition-all placeholder:text-slate-400 placeholder:font-medium"
                />
                {lessonSearchFilter && (
                  <button
                    onClick={() => setLessonSearchFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Stats Banner */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-[#6180a6]">
                <span className="bg-[#f0f4f8] border border-[#a3b8cc] px-2.5 py-1 rounded">
                  {filteredLessons.length} {filteredLessons.length === 1 ? 'lección' : 'lecciones'}
                  {q && ` de ${lessons.length}`}
                </span>
              </div>

              {/* Lessons Table */}
              <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e] overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[#0d1b2e] text-white border-b-2 border-[#1e385c]">
                      <th className="p-3 font-semibold uppercase tracking-wider">Título de la Lección</th>
                      <th className="p-3 font-semibold uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#a3b8cc]/30">
                    {filteredLessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-[#f0f4f8]/50 font-medium">
                        <td className="p-3 text-[#0d1b2e] font-bold">{lesson.title}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => setPreviewLesson(lesson)}
                              className="text-slate-400 hover:text-indigo-650 p-1 cursor-pointer transition-colors"
                              title="Vista previa"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEditLesson(lesson)}
                              className="text-slate-400 hover:text-[#2a4e7c] p-1 cursor-pointer transition-colors"
                              title="Editar Lección"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                              title="Eliminar Lección"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLessons.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-slate-400 italic">
                          No se encontraron lecciones.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* LESSON PREVIEW MODAL */}
        {previewLesson && (
          <div className="fixed inset-0 bg-[#0d1b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#000000] w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0d1b2e] to-[#1e385c] px-5 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-white/60" />
                  <h3 className="text-sm font-bold text-white">{previewLesson.title}</h3>
                </div>
                <button
                  onClick={() => setPreviewLesson(null)}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/25 text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-0">
                <div
                  className="lesson-preview-content"
                  dangerouslySetInnerHTML={{ __html: previewLesson.htmlContent }}
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        )}
      </main>



      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-sm p-5 animate-in fade-in zoom-in duration-155">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Registrar Usuario</h3>
            <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="ej. Sofía Díaz"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="ej. sofia@hotmail.com"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Rol del Usuario</label>
                <select
                  value={newStudentRole}
                  onChange={(e) => setNewStudentRole(e.target.value as 'admin' | 'docente' | 'alumno' | 'profesor')}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-slate-900"
                >
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Plataformas (Multi-Select Predictivo) */}
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Plataformas (Entidades)</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded bg-white min-h-[38px] items-center">
                    {newStudentPlatformIds.map(pId => {
                      const plat = platforms.find(p => p.id === pId);
                      return (
                        <span key={pId} className="flex items-center gap-1 text-[10px] font-bold bg-[#ffe66d] text-[#0d1b2e] border border-[#0d1b2e] px-2 py-0.5 rounded shadow-[1px_1px_0_0_#000000]">
                          {plat?.name}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPlats = newStudentPlatformIds.filter(id => id !== pId);
                              setNewStudentPlatformIds(updatedPlats);
                              // Also remove any assigned aulas that belong to this platform
                              const platAulas = plat?.aulas.map(a => a.id) || [];
                              setNewStudentAulaIds(prev => prev.filter(aId => !platAulas.includes(aId)));
                            }}
                            className="text-[#0d1b2e] hover:text-red-600 font-bold ml-0.5 focus:outline-none cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <input
                      type="text"
                      value={newStudentPlatformSearch}
                      onChange={(e) => {
                        setNewStudentPlatformSearch(e.target.value);
                        setIsNewStudentPlatformDropdownOpen(true);
                      }}
                      onFocus={() => setIsNewStudentPlatformDropdownOpen(true)}
                      placeholder={newStudentPlatformIds.length === 0 ? "Buscar y seleccionar plataformas..." : "Agregar más..."}
                      className="flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-455 min-w-[120px]"
                    />
                  </div>

                  {isNewStudentPlatformDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNewStudentPlatformDropdownOpen(false)} />
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#0d1b2e] rounded shadow-lg max-h-48 overflow-y-auto">
                        {(() => {
                          const filtered = platforms.filter(p => 
                            !newStudentPlatformIds.includes(p.id) &&
                            p.name.toLowerCase().includes(newStudentPlatformSearch.toLowerCase())
                          );
                          if (filtered.length === 0) {
                            return (
                              <div className="p-2 text-slate-500 text-center text-xs">
                                No se encontraron plataformas
                              </div>
                            );
                          }
                          return filtered.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setNewStudentPlatformIds([...newStudentPlatformIds, p.id]);
                                setNewStudentPlatformSearch('');
                                setIsNewStudentPlatformDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-slate-100 cursor-pointer font-semibold text-slate-800 text-xs flex justify-between items-center"
                            >
                              <span>{p.name}</span>
                              <span className="text-[9px] text-slate-400 font-normal">Hacer clic para agregar</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Aulas (Multi-Select Predictivo) */}
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Aulas</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded bg-white min-h-[38px] items-center">
                    {newStudentAulaIds.map(aId => {
                      let aulaName = '';
                      let platformName = '';
                      for (const p of platforms) {
                        if (newStudentPlatformIds.includes(p.id)) {
                          const match = p.aulas.find(a => a.id === aId);
                          if (match) {
                            aulaName = match.name;
                            platformName = p.name;
                            break;
                          }
                        }
                      }
                      if (!aulaName) return null;
                      return (
                        <span key={aId} className="flex items-center gap-1 text-[10px] font-bold bg-[#ffe66d]/40 text-[#0d1b2e] border border-[#0d1b2e] px-2 py-0.5 rounded shadow-[1px_1px_0_0_#000000]">
                          {aulaName} <span className="text-[8px] font-normal text-slate-500">({platformName})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewStudentAulaIds(newStudentAulaIds.filter(id => id !== aId));
                            }}
                            className="text-[#0d1b2e] hover:text-red-600 font-bold ml-0.5 focus:outline-none cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <input
                      type="text"
                      disabled={newStudentPlatformIds.length === 0}
                      value={newStudentAulaSearch}
                      onChange={(e) => {
                        setNewStudentAulaSearch(e.target.value);
                        setIsNewStudentAulaDropdownOpen(true);
                      }}
                      onFocus={() => setIsNewStudentAulaDropdownOpen(true)}
                      placeholder={
                        newStudentPlatformIds.length === 0 
                          ? "Primero agrega plataformas..." 
                          : newStudentAulaIds.length === 0 
                            ? "Buscar y seleccionar aulas..." 
                            : "Agregar más..."
                      }
                      className="flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-455 min-w-[120px] disabled:cursor-not-allowed"
                    />
                  </div>

                  {isNewStudentAulaDropdownOpen && newStudentPlatformIds.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNewStudentAulaDropdownOpen(false)} />
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#0d1b2e] rounded shadow-lg max-h-48 overflow-y-auto">
                        {(() => {
                          const available = platforms
                            .filter(p => newStudentPlatformIds.includes(p.id))
                            .flatMap(p => p.aulas.map(a => ({ ...a, platformName: p.name })))
                            .filter(a => 
                              !newStudentAulaIds.includes(a.id) &&
                              a.name.toLowerCase().includes(newStudentAulaSearch.toLowerCase())
                            );

                          if (available.length === 0) {
                            return (
                              <div className="p-2 text-slate-500 text-center text-xs">
                                No se encontraron aulas disponibles
                              </div>
                            );
                          }
                          return available.map(a => (
                            <div
                              key={a.id}
                              onClick={() => {
                                setNewStudentAulaIds([...newStudentAulaIds, a.id]);
                                setNewStudentAulaSearch('');
                                setIsNewStudentAulaDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-slate-100 cursor-pointer font-semibold text-slate-800 text-xs flex justify-between items-center"
                            >
                              <div>
                                <span>{a.name}</span>
                                <span className="text-[9px] text-slate-500 ml-1.5">({a.ageRange})</span>
                              </div>
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 border border-slate-200 rounded font-normal">
                                {a.platformName}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Contraseña de Acceso</label>
                <input
                  type="text"
                  required
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="ej. 123456"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {showEditStudentModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-sm p-5 animate-in fade-in zoom-in duration-155">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Editar Usuario</h3>
            <form onSubmit={handleSaveEditStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  placeholder="ej. Sofía Díaz"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                  placeholder="ej. sofia@hotmail.com"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Rol del Usuario</label>
                <select
                  value={editStudentRole}
                  onChange={(e) => setEditStudentRole(e.target.value as 'admin' | 'docente' | 'alumno' | 'profesor')}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-slate-900"
                >
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Plataformas (Multi-Select Predictivo) */}
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Plataformas (Entidades)</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded bg-white min-h-[38px] items-center">
                    {editStudentPlatformIds.map(pId => {
                      const plat = platforms.find(p => p.id === pId);
                      return (
                        <span key={pId} className="flex items-center gap-1 text-[10px] font-bold bg-[#ffe66d] text-[#0d1b2e] border border-[#0d1b2e] px-2 py-0.5 rounded shadow-[1px_1px_0_0_#000000]">
                          {plat?.name}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPlats = editStudentPlatformIds.filter(id => id !== pId);
                              setEditStudentPlatformIds(updatedPlats);
                              // Also remove any assigned aulas that belong to this platform
                              const platAulas = plat?.aulas.map(a => a.id) || [];
                              setEditStudentAulaIds(prev => prev.filter(aId => !platAulas.includes(aId)));
                            }}
                            className="text-[#0d1b2e] hover:text-red-600 font-bold ml-0.5 focus:outline-none cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <input
                      type="text"
                      value={editStudentPlatformSearch}
                      onChange={(e) => {
                        setEditStudentPlatformSearch(e.target.value);
                        setIsEditStudentPlatformDropdownOpen(true);
                      }}
                      onFocus={() => setIsEditStudentPlatformDropdownOpen(true)}
                      placeholder={editStudentPlatformIds.length === 0 ? "Buscar y seleccionar plataformas..." : "Agregar más..."}
                      className="flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-455 min-w-[120px]"
                    />
                  </div>

                  {isEditStudentPlatformDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsEditStudentPlatformDropdownOpen(false)} />
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#0d1b2e] rounded shadow-lg max-h-48 overflow-y-auto">
                        {(() => {
                          const filtered = platforms.filter(p => 
                            !editStudentPlatformIds.includes(p.id) &&
                            p.name.toLowerCase().includes(editStudentPlatformSearch.toLowerCase())
                          );
                          if (filtered.length === 0) {
                            return (
                              <div className="p-2 text-slate-500 text-center text-xs">
                                No se encontraron plataformas
                              </div>
                            );
                          }
                          return filtered.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setEditStudentPlatformIds([...editStudentPlatformIds, p.id]);
                                setEditStudentPlatformSearch('');
                                setIsEditStudentPlatformDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-slate-100 cursor-pointer font-semibold text-slate-800 text-xs flex justify-between items-center"
                            >
                              <span>{p.name}</span>
                              <span className="text-[9px] text-slate-400 font-normal">Hacer clic para agregar</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Aulas (Multi-Select Predictivo) */}
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Aulas</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded bg-white min-h-[38px] items-center">
                    {editStudentAulaIds.map(aId => {
                      let aulaName = '';
                      let platformName = '';
                      for (const p of platforms) {
                        if (editStudentPlatformIds.includes(p.id)) {
                          const match = p.aulas.find(a => a.id === aId);
                          if (match) {
                            aulaName = match.name;
                            platformName = p.name;
                            break;
                          }
                        }
                      }
                      if (!aulaName) return null;
                      return (
                        <span key={aId} className="flex items-center gap-1 text-[10px] font-bold bg-[#ffe66d]/40 text-[#0d1b2e] border border-[#0d1b2e] px-2 py-0.5 rounded shadow-[1px_1px_0_0_#000000]">
                          {aulaName} <span className="text-[8px] font-normal text-slate-500">({platformName})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditStudentAulaIds(editStudentAulaIds.filter(id => id !== aId));
                            }}
                            className="text-[#0d1b2e] hover:text-red-600 font-bold ml-0.5 focus:outline-none cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <input
                      type="text"
                      disabled={editStudentPlatformIds.length === 0}
                      value={editStudentAulaSearch}
                      onChange={(e) => {
                        setEditStudentAulaSearch(e.target.value);
                        setIsEditStudentAulaDropdownOpen(true);
                      }}
                      onFocus={() => setIsEditStudentAulaDropdownOpen(true)}
                      placeholder={
                        editStudentPlatformIds.length === 0 
                          ? "Primero agrega plataformas..." 
                          : editStudentAulaIds.length === 0 
                            ? "Buscar y seleccionar aulas..." 
                            : "Agregar más..."
                      }
                      className="flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-455 min-w-[120px] disabled:cursor-not-allowed"
                    />
                  </div>

                  {isEditStudentAulaDropdownOpen && editStudentPlatformIds.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsEditStudentAulaDropdownOpen(false)} />
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#0d1b2e] rounded shadow-lg max-h-48 overflow-y-auto">
                        {(() => {
                          const available = platforms
                            .filter(p => editStudentPlatformIds.includes(p.id))
                            .flatMap(p => p.aulas.map(a => ({ ...a, platformName: p.name })))
                            .filter(a => 
                              !editStudentAulaIds.includes(a.id) &&
                              a.name.toLowerCase().includes(editStudentAulaSearch.toLowerCase())
                            );

                          if (available.length === 0) {
                            return (
                              <div className="p-2 text-slate-500 text-center text-xs">
                                No se encontraron aulas disponibles
                              </div>
                            );
                          }
                          return available.map(a => (
                            <div
                              key={a.id}
                              onClick={() => {
                                setEditStudentAulaIds([...editStudentAulaIds, a.id]);
                                setEditStudentAulaSearch('');
                                setIsEditStudentAulaDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-slate-100 cursor-pointer font-semibold text-slate-800 text-xs flex justify-between items-center"
                            >
                              <div>
                                <span>{a.name}</span>
                                <span className="text-[9px] text-slate-500 ml-1.5">({a.ageRange})</span>
                              </div>
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 border border-slate-200 rounded font-normal">
                                {a.platformName}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Contraseña de Acceso</label>
                <input
                  type="text"
                  required
                  value={editStudentPassword}
                  onChange={(e) => setEditStudentPassword(e.target.value)}
                  placeholder="ej. 123456"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditStudentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEETING MODAL */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-sm p-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Nueva Sala Virtual</h3>
            <form onSubmit={handleAddMeeting} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre Identificador</label>
                <input
                  type="text"
                  required
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                  placeholder="ej. Clase de Robótica Viernes"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Enlace de Google Meet (URL)</label>
                <input
                  type="url"
                  required
                  value={newMeetingUrl}
                  onChange={(e) => setNewMeetingUrl(e.target.value)}
                  placeholder="ej. https://meet.google.com/abc-defg-hij"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMeetingModal(false)}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Crear Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CLASSROOM (CLASE) MODAL */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#000000] w-full max-w-md p-6 animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Nuevo Curso</h3>
            <form onSubmit={handleAddClassroom} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre del Curso</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="ej. Fundamentos de Programación con Scratch"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Descripción</label>
                <textarea
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Escribe los objetivos del curso..."
                  rows={2}
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">URL de Imagen de Portada</label>
                <input
                  type="text"
                  value={newClassImageUrl}
                  onChange={(e) => setNewClassImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>



              <div className="relative">
                <label className="font-bold text-[#6180a6] block mb-1">Añadir Usuarios a esta Clase</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Buscar usuario por nombre o curso..."
                    value={addStudentSearch}
                    onChange={(e) => {
                      setAddStudentSearch(e.target.value);
                      setIsAddStudentDropdownOpen(true);
                    }}
                    onFocus={() => setIsAddStudentDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsAddStudentDropdownOpen(false), 200)}
                    className="w-full p-2 border border-[#a3b8cc] rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-[11px]"
                  />
                  {addStudentSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddStudentSearch('');
                        setIsAddStudentDropdownOpen(false);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 font-bold px-1.5 cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isAddStudentDropdownOpen && addStudentSearch.trim().length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                    {students
                      .filter(st =>
                        !selectedClassStudents.includes(st.id) &&
                        (st.name.toLowerCase().includes(addStudentSearch.toLowerCase()) ||
                          (st.course || '').toLowerCase().includes(addStudentSearch.toLowerCase()))
                      )
                      .map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedClassStudents([...selectedClassStudents, st.id]);
                            setAddStudentSearch('');
                            setIsAddStudentDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800">{st.name}</span>
                          <span className="text-[9px] text-slate-400">{st.course || 'Sin curso'}</span>
                        </button>
                      ))}
                    {students.filter(st =>
                      !selectedClassStudents.includes(st.id) &&
                      (st.name.toLowerCase().includes(addStudentSearch.toLowerCase()) ||
                        (st.course || '').toLowerCase().includes(addStudentSearch.toLowerCase()))
                    ).length === 0 && (
                        <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                          No se encontraron usuarios disponibles.
                        </div>
                      )}
                  </div>
                )}

                {/* Selected Students Badges */}
                {selectedClassStudents.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded bg-slate-50">
                    {selectedClassStudents.map(id => {
                      const st = students.find(s => s.id === id);
                      if (!st) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 bg-white border-2 border-[#0d1b2e] px-2 py-0.5 rounded font-bold text-slate-800 text-[10px] shadow-[1.5px_1.5px_0_0_#000000]"
                        >
                          {st.name} <span className="text-[8px] text-slate-400 font-semibold">({st.course})</span>
                          <button
                            type="button"
                            onClick={() => setSelectedClassStudents(selectedClassStudents.filter(sid => sid !== id))}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="font-bold text-[#6180a6] block mb-1">Vincular Lecciones a esta Clase</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Buscar lección por nombre o curso..."
                    value={addClassLessonSearch}
                    onChange={(e) => {
                      setAddClassLessonSearch(e.target.value);
                      setIsAddClassLessonDropdownOpen(true);
                    }}
                    onFocus={() => setIsAddClassLessonDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsAddClassLessonDropdownOpen(false), 200)}
                    className="w-full p-2 border border-[#a3b8cc] rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-[11px]"
                  />
                  {addClassLessonSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddClassLessonSearch('');
                        setIsAddClassLessonDropdownOpen(false);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 font-bold px-1.5 cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isAddClassLessonDropdownOpen && addClassLessonSearch.trim().length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                    {lessons
                      .filter(l =>
                        !selectedClassLessons.includes(l.id) &&
                        (l.title.toLowerCase().includes(addClassLessonSearch.toLowerCase()) ||
                          l.courseName.toLowerCase().includes(addClassLessonSearch.toLowerCase()))
                      )
                      .map(l => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setSelectedClassLessons([...selectedClassLessons, l.id]);
                            setAddClassLessonSearch('');
                            setIsAddClassLessonDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800">{l.title}</span>
                          <span className="text-[9px] text-slate-400">{l.courseName}</span>
                        </button>
                      ))}
                    {lessons.filter(l =>
                      !selectedClassLessons.includes(l.id) &&
                      (l.title.toLowerCase().includes(addClassLessonSearch.toLowerCase()) ||
                        l.courseName.toLowerCase().includes(addClassLessonSearch.toLowerCase()))
                    ).length === 0 && (
                        <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                          No se encontraron lecciones disponibles.
                        </div>
                      )}
                  </div>
                )}

                {/* Selected Lessons Badges */}
                {selectedClassLessons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded bg-slate-50">
                    {selectedClassLessons.map(id => {
                      const lesson = lessons.find(l => l.id === id);
                      if (!lesson) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 bg-white border-2 border-[#0d1b2e] px-2 py-0.5 rounded font-bold text-slate-800 text-[10px] shadow-[1.5px_1.5px_0_0_#000000]"
                        >
                          {lesson.title} <span className="text-[8px] text-slate-400 font-semibold">({lesson.courseName})</span>
                          <button
                            type="button"
                            onClick={() => setSelectedClassLessons(selectedClassLessons.filter(lid => lid !== id))}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Crear Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLASSROOM (CLASE) MODAL */}
      {editingClass && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#000000] w-full max-w-md p-6 animate-in fade-in zoom-in duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-4 uppercase tracking-wider">Editar Curso</h3>
            <form onSubmit={handleSaveEditClassroom} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre del Curso</label>
                <input
                  type="text"
                  required
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  placeholder="ej. Fundamentos de Programación con Scratch"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Descripción</label>
                <textarea
                  value={editClassDescription}
                  onChange={(e) => setEditClassDescription(e.target.value)}
                  placeholder="Escribe los objetivos del curso..."
                  rows={2}
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">URL de Imagen de Portada</label>
                <input
                  type="text"
                  value={editClassImageUrl}
                  onChange={(e) => setEditClassImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900"
                />
              </div>



              <div className="relative">
                <label className="font-bold text-[#6180a6] block mb-1">Asignar Usuarios a esta Clase</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Buscar usuario por nombre o curso..."
                    value={editStudentSearch}
                    onChange={(e) => {
                      setEditStudentSearch(e.target.value);
                      setIsEditStudentDropdownOpen(true);
                    }}
                    onFocus={() => setIsEditStudentDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsEditStudentDropdownOpen(false), 200)}
                    className="w-full p-2 border border-[#a3b8cc] rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-[11px]"
                  />
                  {editStudentSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditStudentSearch('');
                        setIsEditStudentDropdownOpen(false);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 font-bold px-1.5 cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isEditStudentDropdownOpen && editStudentSearch.trim().length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                    {students
                      .filter(st =>
                        !selectedEditClassStudents.includes(st.id) &&
                        (st.name.toLowerCase().includes(editStudentSearch.toLowerCase()) ||
                          (st.course || '').toLowerCase().includes(editStudentSearch.toLowerCase()))
                      )
                      .map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedEditClassStudents([...selectedEditClassStudents, st.id]);
                            setEditStudentSearch('');
                            setIsEditStudentDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800">{st.name}</span>
                          <span className="text-[9px] text-slate-400">{st.course || 'Sin curso'}</span>
                        </button>
                      ))}
                    {students.filter(st =>
                      !selectedEditClassStudents.includes(st.id) &&
                      (st.name.toLowerCase().includes(editStudentSearch.toLowerCase()) ||
                        (st.course || '').toLowerCase().includes(editStudentSearch.toLowerCase()))
                    ).length === 0 && (
                        <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                          No se encontraron usuarios disponibles.
                        </div>
                      )}
                  </div>
                )}

                {/* Selected Students Badges */}
                {selectedEditClassStudents.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded bg-slate-50">
                    {selectedEditClassStudents.map(id => {
                      const st = students.find(s => s.id === id);
                      if (!st) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 bg-white border-2 border-[#0d1b2e] px-2 py-0.5 rounded font-bold text-slate-800 text-[10px] shadow-[1.5px_1.5px_0_0_#000000]"
                        >
                          {st.name} <span className="text-[8px] text-slate-400 font-semibold">({st.course})</span>
                          <button
                            type="button"
                            onClick={() => setSelectedEditClassStudents(selectedEditClassStudents.filter(sid => sid !== id))}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="font-bold text-[#6180a6] block mb-1">Vincular Lecciones a esta Clase</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Buscar lección por nombre o curso..."
                    value={editClassLessonSearch}
                    onChange={(e) => {
                      setEditClassLessonSearch(e.target.value);
                      setIsEditClassLessonDropdownOpen(true);
                    }}
                    onFocus={() => setIsEditClassLessonDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsEditClassLessonDropdownOpen(false), 200)}
                    className="w-full p-2 border border-[#a3b8cc] rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-[11px]"
                  />
                  {editClassLessonSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditClassLessonSearch('');
                        setIsEditClassLessonDropdownOpen(false);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 font-bold px-1.5 cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isEditClassLessonDropdownOpen && editClassLessonSearch.trim().length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                    {lessons
                      .filter(l =>
                        !selectedEditClassLessons.includes(l.id) &&
                        (l.title.toLowerCase().includes(editClassLessonSearch.toLowerCase()) ||
                          l.courseName.toLowerCase().includes(editClassLessonSearch.toLowerCase()))
                      )
                      .map(l => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setSelectedEditClassLessons([...selectedEditClassLessons, l.id]);
                            setEditClassLessonSearch('');
                            setIsEditClassLessonDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800">{l.title}</span>
                          <span className="text-[9px] text-slate-400">{l.courseName}</span>
                        </button>
                      ))}
                    {lessons.filter(l =>
                      !selectedEditClassLessons.includes(l.id) &&
                      (l.title.toLowerCase().includes(editClassLessonSearch.toLowerCase()) ||
                        l.courseName.toLowerCase().includes(editClassLessonSearch.toLowerCase()))
                    ).length === 0 && (
                        <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                          No se encontraron lecciones disponibles.
                        </div>
                      )}
                  </div>
                )}

                {/* Selected Lessons Badges */}
                {selectedEditClassLessons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded bg-slate-50">
                    {selectedEditClassLessons.map(id => {
                      const lesson = lessons.find(l => l.id === id);
                      if (!lesson) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 bg-white border-2 border-[#0d1b2e] px-2 py-0.5 rounded font-bold text-slate-800 text-[10px] shadow-[1.5px_1.5px_0_0_#000000]"
                        >
                          {lesson.title} <span className="text-[8px] text-slate-400 font-semibold">({lesson.courseName})</span>
                          <button
                            type="button"
                            onClick={() => setSelectedEditClassLessons(selectedEditClassLessons.filter(lid => lid !== id))}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LESSON MODAL */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-2xl p-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-2 uppercase tracking-wider">Nueva Lección</h3>
            <p className="text-[10px] text-slate-500 mb-4">Crea contenido estructurado. Puedes usar cualquier etiqueta HTML, estilos en línea (inline CSS) y scripts básicos.</p>
            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre de la Lección</label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="ej. Introducción a Loops en Scratch"
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Código de Embebido (Genially, Canva, YouTube, HTML, etc.)</label>
                <div className="border-2 border-[#0d1b2e] rounded overflow-hidden">
                  <div className="bg-[#1e293b] text-slate-400 px-3 py-1.5 border-b border-[#0d1b2e] font-mono text-[9px] flex justify-between items-center">
                    <span>embed-code.html</span>
                    <span className="text-[#ffe66d] font-bold">EMBED CODE / IFRAME / HTML</span>
                  </div>
                  <textarea
                    required
                    rows={10}
                    value={newLessonHtmlContent}
                    onChange={(e) => setNewLessonHtmlContent(e.target.value)}
                    placeholder="Pega aquí el código HTML / iframe brindado por Genially, Canva, YouTube, Scratch, etc.&#10;&#10;Ejemplo:&#10;<iframe src='https://view.genially.com/...' width='100%' height='500' allowfullscreen></iframe>"
                    className="w-full p-3 bg-[#0f172a] text-[#ffd166] font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Crear Lección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-2xl p-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-2 uppercase tracking-wider">Editar Lección</h3>
            <p className="text-[10px] text-slate-500 mb-4">Modifica los detalles y actualiza el código HTML de la lección.</p>
            <form onSubmit={handleSaveEditLesson} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Nombre de la Lección</label>
                <input
                  type="text"
                  required
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                  className="w-full p-2 border border-[#a3b8cc] rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Código de Embebido (Genially, Canva, YouTube, HTML, etc.)</label>
                <div className="border-2 border-[#0d1b2e] rounded overflow-hidden">
                  <div className="bg-[#1e293b] text-slate-400 px-3 py-1.5 border-b border-[#0d1b2e] font-mono text-[9px] flex justify-between items-center">
                    <span>embed-code.html</span>
                    <span className="text-[#ffe66d] font-bold">EMBED CODE / IFRAME / HTML</span>
                  </div>
                  <textarea
                    required
                    rows={10}
                    value={editLessonHtmlContent}
                    onChange={(e) => setEditLessonHtmlContent(e.target.value)}
                    placeholder="Pega aquí el código HTML / iframe brindado por Genially, Canva, YouTube, Scratch, etc.&#10;&#10;Ejemplo:&#10;<iframe src='https://view.genially.com/...' width='100%' height='500' allowfullscreen></iframe>"
                    className="w-full p-3 bg-[#0f172a] text-[#ffd166] font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAula && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] w-full max-w-md p-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-[#0d1b2e] mb-2 uppercase tracking-wider">Modificar Aula</h3>
            <p className="text-[10px] text-slate-500 mb-4">Modifica la información general de esta aula y asocia los cursos correspondientes.</p>
            <form onSubmit={(e) => handleSaveEditAula(editingAula.platformId, editingAula.aulaId, e)} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6180a6] block mb-1">Nombre del Aula</label>
                  <input
                    type="text"
                    required
                    value={editAulaName}
                    onChange={(e) => setEditAulaName(e.target.value)}
                    placeholder="ej. Aula Maker"
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#6180a6] block mb-1">Rango de Edad</label>
                  <input
                    type="text"
                    required
                    value={editAulaAge}
                    onChange={(e) => setEditAulaAge(e.target.value)}
                    placeholder="ej. de 6 a 8 años"
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6180a6] block mb-1">Modalidad</label>
                  <select
                    value={editAulaModality}
                    onChange={(e) => setEditAulaModality(e.target.value as 'Presencial' | 'Virtual')}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] bg-white font-semibold text-slate-900"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#6180a6] block mb-1">Día y Horario</label>
                  <input
                    type="text"
                    value={editAulaSchedule}
                    onChange={(e) => setEditAulaSchedule(e.target.value)}
                    placeholder="ej. Sábados 10:00 - 12:00"
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6180a6] block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editAulaDesc}
                  onChange={(e) => setEditAulaDesc(e.target.value)}
                  placeholder="ej. Aula enfocada en proyectos presenciales para los más pequeños..."
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium resize-none"
                />
              </div>

              {editAulaModality === 'Virtual' && (
                <div>
                  <label className="font-bold text-[#6180a6] block mb-1">Enlace de Google Meet *</label>
                  <input
                    type="url"
                    required
                    value={editAulaMeetingUrl}
                    onChange={(e) => setEditAulaMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium"
                  />
                </div>
              )}

              {/* Buscador predictivo de cursos */}
              <div className="relative">
                <label className="font-bold text-[#6180a6] block mb-1">Buscar y Agregar Cursos</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Escribe el nombre del curso..."
                    value={editAulaCourseSearch}
                    onChange={(e) => {
                      setEditAulaCourseSearch(e.target.value);
                      setIsEditAulaCourseDropdownOpen(true);
                    }}
                    onFocus={() => setIsEditAulaCourseDropdownOpen(true)}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-medium"
                  />
                  {editAulaCourseSearch && (
                    <button
                      type="button"
                      onClick={() => { setEditAulaCourseSearch(''); setIsEditAulaCourseDropdownOpen(false); }}
                      className="absolute right-2 text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isEditAulaCourseDropdownOpen && (() => {
                  const filteredCourses = classrooms.filter(c =>
                    !editAulaCourseIds.includes(c.id) &&
                    c.name.toLowerCase().includes(editAulaCourseSearch.toLowerCase())
                  );

                  return (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsEditAulaCourseDropdownOpen(false)} />
                      <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000000] max-h-40 overflow-y-auto rounded text-[11px]">
                        {filteredCourses.map(course => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => {
                              setEditAulaCourseIds([...editAulaCourseIds, course.id]);
                              setEditAulaCourseSearch('');
                              setIsEditAulaCourseDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-[#f0f4f8] border-b last:border-0 border-slate-100 flex flex-col cursor-pointer"
                          >
                            <span className="font-semibold text-slate-800">{course.name}</span>
                            {course.description && (
                              <span className="text-[9px] text-slate-400 font-normal truncate max-w-[280px]">{course.description}</span>
                            )}
                          </button>
                        ))}
                        {filteredCourses.length === 0 && (
                          <div className="p-2.5 text-slate-400 italic text-[10px] text-center">
                            No se encontraron cursos disponibles.
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Badges de cursos seleccionados */}
              {editAulaCourseIds.length > 0 && (
                <div>
                  <label className="font-semibold text-slate-500 block mb-1 text-[10px]">Cursos Vinculados a esta Aula:</label>
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded bg-slate-50 max-h-24 overflow-y-auto">
                    {editAulaCourseIds.map(id => {
                      const course = classrooms.find(c => c.id === id);
                      if (!course) return null;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#2a4e7c] text-white font-bold text-[9px] rounded uppercase shadow-[1px_1px_0_0_#000000]">
                          {course.name}
                          <button
                            type="button"
                            onClick={() => setEditAulaCourseIds(editAulaCourseIds.filter(cid => cid !== id))}
                            className="text-[#ffe66d] hover:text-white font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAula(null);
                    setEditAulaCourseIds([]);
                    setEditAulaCourseSearch('');
                    setIsEditAulaCourseDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 border border-[#a3b8cc] rounded font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000] transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
