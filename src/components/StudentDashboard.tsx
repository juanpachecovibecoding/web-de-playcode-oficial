import React, { useState } from 'react';
import {
  BookOpen,
  LogOut,
  Code2,
  CheckCircle2,
  Video,
  User,
  Image,
  Palette,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Circle,
  MessageSquare,
  Heart,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  X,
  Clock,
  LayoutDashboard,
  Award,
  Trophy,
  FolderOpen
} from 'lucide-react';

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
  inventory?: string[];
  unopenedChestsCount?: number;
  unlockedBadgeIds?: string[];
}

interface Course {
  id: string;
  title: string;
  ageGroup: string;
  price: string;
  type: 'Presencial' | 'Virtual';
  studentsCount: number;
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
  studentIds?: string[];
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
  chestAwarded?: boolean;
}

interface GameItem {
  id: string;
  name: string;
  type: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  badgeName: string;
}

export const GAME_ITEMS: Record<string, GameItem> = {
  'libro-sabiduria': {
    id: 'libro-sabiduria',
    name: 'Códice del Logos',
    type: 'Libro de Sabiduría',
    emoji: '📖',
    rarity: 'common',
    description: 'Otorgado a los aprendices que acceden al portal de Play Code por primera vez.',
    badgeName: 'Aprendiz Curioso'
  },
  'baston-codigo': {
    id: 'baston-codigo',
    name: 'Llaves del Reino',
    type: 'Bastón de Mago',
    emoji: '🗝️',
    rarity: 'rare',
    description: 'Otorgado a los magos que completan al menos 5 lecciones de programación.',
    badgeName: 'Maestro del Código'
  },
  'espada-verdad': {
    id: 'espada-verdad',
    name: 'La Palabra de Verdad',
    type: 'Espada Legendaria',
    emoji: '🗡️',
    rarity: 'epic',
    description: 'Forjada cuando tus publicaciones del foro reciben 10 o más reacciones ✅ por veracidad.',
    badgeName: 'Portador de la Verdad'
  },
  'escudo-debug': {
    id: 'escudo-debug',
    name: 'Escudo de la Fe-Elijo creer',
    type: 'Escudo Protector',
    emoji: '🛡️',
    rarity: 'legendary',
    description: 'Entregado a los guardianes digitales que completan el 100% de un curso oficial.',
    badgeName: 'Guardián Digital'
  }
};

interface Resource {
  id: string;
  name: string;
  description: string;
  courseId: string;
  url: string;
  imageUrl?: string;
}

interface StudentDashboardProps {
  student: Student;
  students: Student[];
  classrooms: Classroom[];
  meetings: Meeting[];
  lessons: Lesson[];
  courses: Course[];
  platforms: Platform[];
  posts: ForumPost[];
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  resources: Resource[];
  onLogout: () => void;
  onSaveProfile: (updated: Student) => void;
  dbStatus: 'connecting' | 'connected' | 'error';
  dbError: string | null;
  firebaseProjectId: string;
}

interface ThemeStyles {
  bg: string;
  sidebarBg: string;
  sidebarBorder: string;
  activeTabBg: string;
  activeTabText: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  textColor: string;
  subtextColor: string;
  primaryBtnBg: string;
  primaryBtnHover: string;
  primaryBtnText: string;
  badgeBg: string;
  badgeText: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabActiveBg: string;
  tabActiveText: string;
  tabInactiveText: string;
  tabInactiveHover: string;
  tabShadow: string;
}

const themePalettes: Record<'default' | 'cyberpunk' | 'playcode', ThemeStyles> = {
  default: {
    bg: 'bg-[#f3f7fa]',
    sidebarBg: 'bg-[#0d1b2e]',
    sidebarBorder: 'border-[#1e385c]',
    activeTabBg: 'bg-[#a3b8cc]',
    activeTabText: 'text-[#0d1b2e] border-[#0d1b2e] shadow-[2px_2px_0_0_#ffffff]',
    headerBorder: 'border-[#a3b8cc]',
    cardBg: 'bg-white',
    cardBorder: 'border-2 border-[#0d1b2e]',
    cardShadow: 'shadow-[4px_4px_0_0_#0d1b2e]',
    textColor: 'text-[#0d1b2e]',
    subtextColor: 'text-[#6180a6]',
    primaryBtnBg: 'bg-[#2a4e7c]',
    primaryBtnHover: 'hover:bg-[#1e385c]',
    primaryBtnText: 'text-white border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000]',
    badgeBg: 'bg-[#f0f4f8] text-[#2a4e7c] border border-[#a3b8cc]',
    badgeText: 'text-[#2a4e7c]',
    tabBarBg: 'bg-[#2a4e7c]',
    tabBarBorder: 'border-[#0d1b2e]',
    tabActiveBg: 'bg-white',
    tabActiveText: 'text-[#2a4e7c] font-extrabold border-b-4 border-[#2a4e7c]',
    tabInactiveText: 'text-white',
    tabInactiveHover: 'hover:bg-[#1e385c]',
    tabShadow: 'shadow-[4px_4px_0_0_#0d1b2e]'
  },
  cyberpunk: {
    bg: 'bg-[#08020f]',
    sidebarBg: 'bg-[#1a0033]',
    sidebarBorder: 'border-[#ff00ff]',
    activeTabBg: 'bg-[#ff00ff]',
    activeTabText: 'text-white border-[#ff00ff] shadow-[2px_2px_0_0_#7b6eff]',
    headerBorder: 'border-[#ff00ff]',
    cardBg: 'bg-[#130321]',
    cardBorder: 'border-2 border-[#8b2ae2]',
    cardShadow: 'shadow-[4px_4px_0_0_#ff00ff]',
    textColor: 'text-[#fdf2ff]',
    subtextColor: 'text-[#df73e3]',
    primaryBtnBg: 'bg-[#ff00ff]',
    primaryBtnHover: 'hover:bg-[#9400d3]',
    primaryBtnText: 'text-white border-2 border-[#7b6eff] shadow-[2px_2px_0_0_#7b6eff]',
    badgeBg: 'bg-[#8b2ae2]/30 text-[#df73e3] border border-[#ff00ff]',
    badgeText: 'text-[#df73e3]',
    tabBarBg: 'bg-[#1a0033]',
    tabBarBorder: 'border-[#ff00ff]',
    tabActiveBg: 'bg-[#ff00ff]',
    tabActiveText: 'text-white font-extrabold border-b-4 border-[#ff00ff]',
    tabInactiveText: 'text-[#df73e3]',
    tabInactiveHover: 'hover:bg-[#8b2ae2]/40',
    tabShadow: 'shadow-[4px_4px_0_0_#ff00ff]'
  },
  playcode: {
    bg: 'bg-slate-55',
    sidebarBg: 'bg-[#001f4a]',
    sidebarBorder: 'border-[#f2900f]',
    activeTabBg: 'bg-[#ffe66d]',
    activeTabText: 'text-[#001f4a] border-[#001f4a] shadow-[2px_2px_0_0_#f2900f]',
    headerBorder: 'border-[#f2900f]',
    cardBg: 'bg-white',
    cardBorder: 'border-2 border-[#001f4a]',
    cardShadow: 'shadow-[4px_4px_0_0_#001f4a]',
    textColor: 'text-[#001f4a]',
    subtextColor: 'text-[#ff6b6b]',
    primaryBtnBg: 'bg-[#ffe66d]',
    primaryBtnHover: 'hover:bg-[#ffd166]',
    primaryBtnText: 'text-[#001f4a] border-2 border-[#001f4a] shadow-[2px_2px_0_0_#001f4a]',
    badgeBg: 'bg-[#4ecdc4]/20 text-[#001f4a] border border-[#001f4a]',
    badgeText: 'text-[#001f4a]',
    tabBarBg: 'bg-[#001f4a]',
    tabBarBorder: 'border-[#001f4a]',
    tabActiveBg: 'bg-[#ffe66d]',
    tabActiveText: 'text-[#001f4a] font-extrabold border-b-4 border-[#ffe66d]',
    tabInactiveText: 'text-white',
    tabInactiveHover: 'hover:bg-[#203a61]',
    tabShadow: 'shadow-[4px_4px_0_0_#001f4a]'
  }
};

const avatarChoices = ['🚀', '💻', '🤖', '🎨', '🧠', '👾', '🎮', '🦄'];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  students,
  classrooms,
  meetings,
  lessons,
  courses,
  platforms,
  posts,
  setPosts,
  resources,
  onLogout,
  onSaveProfile,
  dbStatus,
  dbError,
  firebaseProjectId
}) => {
  void courses; // courses prop kept for API compatibility; aula courses now use classrooms
  void firebaseProjectId;
  void meetings;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'aprendizaje' | 'recursos' | 'certificados' | 'puntos' | 'foro' | 'perfil'>('dashboard');
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<Classroom | null>(null);
  const [hideLessonsSidebar, setHideLessonsSidebar] = useState(false);
  const [palette, setPalette] = useState<'default' | 'cyberpunk' | 'playcode'>(student.theme || 'default');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [revealedItem, setRevealedItem] = useState<GameItem | null>(null);
  const [showChestModal, setShowChestModal] = useState(false);

  // Auto-award items based on Firestore student logs
  React.useEffect(() => {
    const inv = student.inventory || [];
    const badges = student.unlockedBadgeIds || [];
    let updated = false;
    const nextStudent = { ...student };
    
    // 1. Initial item: libro-sabiduria
    if (!inv.includes('libro-sabiduria')) {
      nextStudent.inventory = [...inv, 'libro-sabiduria'];
      if (!badges.includes('Aprendiz Curioso')) {
        nextStudent.unlockedBadgeIds = [...badges, 'Aprendiz Curioso'];
      }
      updated = true;
    }
    
    // 2. Baston del Compilador: Completed >= 5 lessons
    const lessonsCount = student.completedLessonIds?.length || 0;
    if (lessonsCount >= 5 && !inv.includes('baston-codigo') && !badges.includes('Maestro del Código') && (student.unopenedChestsCount || 0) === 0) {
      nextStudent.unopenedChestsCount = (student.unopenedChestsCount || 0) + 1;
      updated = true;
    }
    
    // 3. Escudo de la Fe-Elijo creer: 100% course lessons completed
    const studentClassrooms = classrooms.filter(c => student.aulaIds?.includes(c.id));
    const allLessonIds = Array.from(new Set(studentClassrooms.flatMap(c => c.lessonIds || [])));
    const completedCount = allLessonIds.filter(id => student.completedLessonIds?.includes(id)).length;
    const progress = allLessonIds.length > 0 ? (completedCount / allLessonIds.length) * 100 : 0;
    
    if (progress === 100 && allLessonIds.length > 0 && !inv.includes('escudo-debug') && !badges.includes('Guardián Digital') && (student.unopenedChestsCount || 0) === 0) {
      nextStudent.unopenedChestsCount = (student.unopenedChestsCount || 0) + 1;
      updated = true;
    }

    if (updated) {
      onSaveProfile(nextStudent);
    }
  }, [student, classrooms, onSaveProfile]);

  const handleOpenChest = () => {
    if ((student.unopenedChestsCount || 0) <= 0 || isOpeningChest || chestOpened) return;
    
    setIsOpeningChest(true);
    
    setTimeout(() => {
      setIsOpeningChest(false);
      
      const inv = student.inventory || [];
      const hasQualifiedForumPost = posts.some(p => p.authorUsername === student.username && (p.reactions?.['✅'] || 0) >= 10);
      let itemToGive: GameItem = GAME_ITEMS['libro-sabiduria'];
      
      if (hasQualifiedForumPost && !inv.includes('espada-verdad')) {
        itemToGive = GAME_ITEMS['espada-verdad'];
      } else if ((student.completedLessonIds?.length || 0) >= 5 && !inv.includes('baston-codigo')) {
        itemToGive = GAME_ITEMS['baston-codigo'];
      } else {
        const studentClassrooms = classrooms.filter(c => student.aulaIds?.includes(c.id));
        const allLessonIds = Array.from(new Set(studentClassrooms.flatMap(c => c.lessonIds || [])));
        const completedCount = allLessonIds.filter(id => student.completedLessonIds?.includes(id)).length;
        const progress = allLessonIds.length > 0 ? (completedCount / allLessonIds.length) * 100 : 0;
        
        if (progress === 100 && allLessonIds.length > 0 && !inv.includes('escudo-debug')) {
          itemToGive = GAME_ITEMS['escudo-debug'];
        } else {
          const pool = Object.keys(GAME_ITEMS);
          const randomId = pool[Math.floor(Math.random() * pool.length)];
          itemToGive = GAME_ITEMS[randomId];
        }
      }
      
      setRevealedItem(itemToGive);
      setChestOpened(true);
      
      const nextStudent = {
        ...student,
        unopenedChestsCount: Math.max(0, (student.unopenedChestsCount || 1) - 1),
        inventory: [...inv, itemToGive.id],
        unlockedBadgeIds: Array.from(new Set([...(student.unlockedBadgeIds || []), itemToGive.badgeName]))
      };
      
      onSaveProfile(nextStudent);
    }, 1200);
  };

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [forumSearchQuery, setForumSearchQuery] = useState('');

  // Forum handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (limit to 2MB to keep base64 reasonable for localStorage)
      if (file.size > 2 * 1024 * 1024) {
        alert('Por favor selecciona una imagen menor a 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: 'post-' + Date.now(),
      title: newPostTitle,
      content: newPostContent,
      authorName: student.name,
      authorUsername: student.username,
      authorAvatar: student.avatar || '🚀',
      imageUrl: newPostImage || undefined,
      likes: 0,
      likedBy: [],
      reactions: { '🚀': 0, '🎉': 0, '💻': 0, '🧠': 0 },
      reactedBy: {},
      createdAt: new Date().toISOString(),
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage(null);
    setShowAddPostForm(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        const userUsername = student.username;
        const hasLiked = post.likedBy.includes(userUsername);
        const likedBy = hasLiked
          ? post.likedBy.filter(username => username !== userUsername)
          : [...post.likedBy, userUsername];
        const likes = hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
        return { ...post, likes, likedBy };
      })
    );
  };

  const handleReactToPost = (postId: string, emoji: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        const userUsername = student.username;
        
        // Initialize reactedBy and reactions if they don't exist
        const postReactedBy = post.reactedBy || {};
        const postReactions = post.reactions || { '🚀': 0, '🎉': 0, '💻': 0, '🧠': 0 };

        const previousReaction = postReactedBy[userUsername];
        
        const reactedBy = { ...postReactedBy, [userUsername]: emoji };
        const reactions = { ...postReactions };

        if (previousReaction === emoji) {
          reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
          delete reactedBy[userUsername];
        } else {
          if (previousReaction) {
            reactions[previousReaction] = Math.max(0, (reactions[previousReaction] || 1) - 1);
          }
          reactions[emoji] = (reactions[emoji] || 0) + 1;
        }

        return { ...post, reactions, reactedBy };
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        const newComment: ForumComment = {
          id: 'comment-' + Date.now(),
          content: text,
          authorName: student.name,
          authorUsername: student.username,
          createdAt: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newComment] };
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    }
  };
  
  // Lesson settings
  const [selectedClassroomForLessons, setSelectedClassroomForLessons] = useState<Classroom | null>(null);
  const [selectedLessonForPreview, setSelectedLessonForPreview] = useState<Lesson | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Platform & Aula navigation states
  const [insidePlatform, setInsidePlatform] = useState(false);
  const [currentPlatformId, setCurrentPlatformId] = useState<string | null>(() => {
    if (student.platformIds && student.platformIds.length > 0) {
      return student.platformIds[0];
    }
    return student.platformId || null;
  });
  const [selectedPlatformAula, setSelectedPlatformAula] = useState<PlatformAula | null>(null);
  const [selectedPlatformCourse, setSelectedPlatformCourse] = useState<Classroom | null>(null);
  const [selectedPlatformLesson, setSelectedPlatformLesson] = useState<Lesson | null>(null);

  // Profile settings
  const [bio, setBio] = useState(student.bio || '¡Hola! Soy alumno en Play Code y estoy programando el futuro.');
  const [selectedAvatar, setSelectedAvatar] = useState(student.avatar || '🚀');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(student.photoUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveProfile({
      ...student,
      bio,
      avatar: selectedAvatar,
      photoUrl: customPhotoUrl,
      theme: palette
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Get active theme styles
  const t = themePalettes[palette];

  // Filter classes belonging to this student
  const myClassrooms = classrooms.filter(cls => cls.students.includes(student.id));

  // Calculate course progress based on lessons assigned to the student's classrooms (with fallback to course name)
  const studentClassroomLessonIds = Array.from(
    new Set(myClassrooms.flatMap(cls => cls.lessonIds || []))
  );
  const courseLessons = studentClassroomLessonIds.length > 0
    ? lessons.filter(l => studentClassroomLessonIds.includes(l.id))
    : lessons.filter(l => l.courseName === (student.course || ''));

  const completedLessonIds = student.completedLessonIds || [];
  const completedCourseLessons = courseLessons.filter(l => completedLessonIds.includes(l.id));
  const progressPercent = courseLessons.length > 0 
    ? Math.round((completedCourseLessons.length / courseLessons.length) * 100) 
    : 0;

  const leaderboardStudents = React.useMemo(() => {
    const activeStudentAulaIds = student.aulaIds || [];
    const filtered = students.filter((s: Student) => {
      const isSameRole = s.role === 'alumno' || !s.role;
      const sharesAula = (s.aulaIds || []).some((id: string) => activeStudentAulaIds.includes(id));
      return isSameRole && sharesAula;
    });

    if (filtered.length === 0) {
      const activePlatformIds = student.platformIds || (student.platformId ? [student.platformId] : []);
      const platformFiltered = students.filter((s: Student) => {
        const isSameRole = s.role === 'alumno' || !s.role;
        const sharesPlatform = (s.platformIds || []).some((id: string) => activePlatformIds.includes(id)) || s.platformId === student.platformId;
        return isSameRole && sharesPlatform;
      });
      filtered.push(...platformFiltered);
    }

    const uniqueStudentsMap = new Map<string, Student>();
    filtered.forEach((s: Student) => uniqueStudentsMap.set(s.id, s));
    
    if (!uniqueStudentsMap.has(student.id)) {
      uniqueStudentsMap.set(student.id, student);
    }
    
    const uniqueList = Array.from(uniqueStudentsMap.values());

    return uniqueList.sort((a: Student, b: Student) => {
      const xpA = (a.completedLessonIds?.length || 0) * 100;
      const xpB = (b.completedLessonIds?.length || 0) * 100;
      return xpB - xpA;
    });
  }, [students, student, classrooms]);

  const toggleLessonCompletion = (lessonId: string) => {
    let updatedCompleted: string[];
    if (completedLessonIds.includes(lessonId)) {
      updatedCompleted = completedLessonIds.filter(id => id !== lessonId);
    } else {
      updatedCompleted = [...completedLessonIds, lessonId];
    }
    onSaveProfile({
      ...student,
      completedLessonIds: updatedCompleted
    });
  };

  return (
    <div className={`min-h-screen ${t.bg} flex flex-col ${t.textColor} font-sans transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className={`w-full ${t.sidebarBg} text-slate-100 border-b-4 ${t.sidebarBorder} transition-colors duration-300 sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className={`p-1.5 border border-white/20 bg-opacity-20 text-white shadow-[1px_1px_0_0_#ffffff]`}>
              <Code2 className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-pixel text-sm tracking-wider text-white block">Play Code</span>
              <span className="text-[9px] text-[#a3b8cc] font-bold uppercase tracking-widest">Portal Alumno</span>
            </div>
          </div>

          {/* Right side: User Profile Info & Logout */}
          <div className="flex items-center gap-3">
            {/* Database Sync Status Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[9px]">
              {dbStatus === 'connected' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-400 font-bold uppercase hidden md:inline">Sincronizado</span>
                </>
              )}
              {dbStatus === 'connecting' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  <span className="text-amber-400 font-bold uppercase hidden md:inline">Conectando</span>
                </>
              )}
              {dbStatus === 'error' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-rose-400 font-bold uppercase hover:underline" title={dbError || 'Error de conexión'}>Modo Local</span>
                </>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {customPhotoUrl ? (
                <img
                  src={customPhotoUrl}
                  alt={student.name}
                  className={`w-7 h-7 rounded-full border object-cover ${t.sidebarBorder}`}
                  onError={() => setCustomPhotoUrl('')}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs border border-white/20">
                  {selectedAvatar}
                </div>
              )}
              <div className="text-left leading-tight max-w-[120px]">
                <span className="text-xs font-bold text-slate-200 block truncate">{student.name}</span>
                <span className="text-[9px] text-slate-400 block truncate">{student.username}</span>
              </div>
            </div>

            {student.unopenedChestsCount && student.unopenedChestsCount > 0 ? (
              <button
                onClick={() => setShowChestModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[1.5px_1.5px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[1.5px] active:translate-x-[1.5px] font-extrabold text-xs transition-all cursor-pointer animate-pulse rounded"
              >
                <span>🎁</span>
                <span>¡Cofre Listo!</span>
              </button>
            ) : null}

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-100 font-bold text-xs border border-white/20 shadow-[1.5px_1.5px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[1.5px] active:translate-x-[1.5px] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        {/* Header with Greeting */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">¡Hola, {student.name}!</h1>
            <p className="text-slate-500 font-medium text-xs">Bienvenido a tu panel personal de Play Code.</p>
          </div>
          <div className="shrink-0 bg-[#2a4e7c] text-white border-2 border-[#0d1b2e] px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold shadow-[2px_2px_0_0_#0d1b2e]">
            ALUMNO ACTIVO
          </div>
        </header>

        {/* Navigation Tabs Bar */}
        <div className={`w-full ${t.tabBarBg} border-2 ${t.tabBarBorder} ${t.tabShadow} flex overflow-x-auto mb-8 scrollbar-thin select-none`}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
              activeTab === 'dashboard'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Panel de Control</span>
          </button>

          {student.id !== 'guest-student' && (
            <button
              onClick={() => {
                setActiveTab('aprendizaje');
                setSelectedCourseName(null);
                setSelectedClassroomForLessons(null);
                setSelectedLessonForPreview(null);
              }}
              className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
                activeTab === 'aprendizaje'
                  ? `${t.tabActiveBg} ${t.tabActiveText}`
                  : `${t.tabInactiveText} ${t.tabInactiveHover}`
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Mis Cursos</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('recursos')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
              activeTab === 'recursos'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            <span>Recursos</span>
          </button>

          <button
            onClick={() => setActiveTab('certificados')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
              activeTab === 'certificados'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Certificados</span>
          </button>

          <button
            onClick={() => setActiveTab('puntos')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
              activeTab === 'puntos'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Mis Puntos</span>
          </button>

          <button
            onClick={() => setActiveTab('foro')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer border-r-2 ${t.tabBarBorder} last:border-r-0 ${
              activeTab === 'foro'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Foro Estudiantil</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 min-w-[155px] py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'perfil'
                ? `${t.tabActiveBg} ${t.tabActiveText}`
                : `${t.tabInactiveText} ${t.tabInactiveHover}`
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Mi Perfil & Diseño</span>
          </button>
        </div>

        {/* TAB 0A: PANEL DE CONTROL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {student.unopenedChestsCount && student.unopenedChestsCount > 0 ? (
              <div className="p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <span className="text-4xl animate-bounce">🎁</span>
                  <div>
                    <h3 className="font-bold text-lg text-amber-600">¡Tienes recompensas pendientes!</h3>
                    <p className="text-xs text-slate-500 font-semibold">Has recibido un cofre de recompensas. Ábrelo ahora para descubrir tu ítem especial e insignias.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChestModal(true)}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold border-2 border-slate-900 shadow-[4px_4px_0_0_#000000] active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000] transition-all rounded text-xs shrink-0 cursor-pointer"
                >
                  ¡ABRIR COFRE AHORA!
                </button>
              </div>
            ) : null}

            {/* Grid for Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Student Welcome Profile */}
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {customPhotoUrl ? (
                      <img
                        src={customPhotoUrl}
                        alt={student.name}
                        className="w-16 h-16 rounded-full border-2 border-[#0d1b2e] object-cover"
                        onError={() => setCustomPhotoUrl('')}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-[#0d1b2e] text-4xl flex items-center justify-center">
                        {selectedAvatar}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base leading-tight">{student.name}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{student.username}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic mt-2">
                    "{bio || 'Sin biografía establecida.'}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-[#2a4e7c]">
                  <span>ESTADO: ACTIVO</span>
                  <button onClick={() => setActiveTab('perfil')} className="hover:underline cursor-pointer">
                    Editar Perfil &rarr;
                  </button>
                </div>
              </div>

              {/* Card 2: Classroom & Platform Status (hidden for guest) */}
              {student.id !== 'guest-student' && (
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} flex flex-col justify-between`}>
                <div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#2a4e7c] text-white rounded">
                    MI ESPACIO
                  </span>
                  <h4 className="text-base font-bold mt-2">Aulas y Plataformas</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Accede a las aulas virtuales asignadas para tus clases.
                  </p>
                  
                  {(() => {
                    const currentPlatformIds = student.platformIds || (student.platformId ? [student.platformId] : []);
                    const assignedPlatforms = platforms.filter(p => currentPlatformIds.includes(p.id));
                    if (assignedPlatforms.length > 0) {
                      return (
                        <div className="mt-3 space-y-2">
                          {assignedPlatforms.map(p => (
                            <div key={p.id} className="text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-2 rounded flex justify-between items-center">
                              <span className="truncate">{p.name}</span>
                              <span className="text-[9px] text-emerald-600 font-bold">Activo</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <div className="mt-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-center text-xs text-slate-400">
                        No estás registrado en ninguna plataforma actualmente.
                      </div>
                    );
                  })()}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveTab('aprendizaje');
                      setInsidePlatform(false);
                    }}
                    className="w-full text-center py-2 bg-[#2a4e7c] text-white font-bold text-xs border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] hover:bg-[#1e385c] cursor-pointer"
                  >
                    Ir a Mis Cursos
                  </button>
                </div>
              </div>
              )}

              {/* Card 3: Gamification level & Points */}
              {(() => {
                const totalXP = completedLessonIds.length * 100;
                const level = Math.floor(completedLessonIds.length / 3) + 1;
                const nextLevelXP = 300;
                const progressToNextLevel = (totalXP % nextLevelXP) / nextLevelXP * 100;

                return (
                  <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-400">
                          NIVEL {level}
                        </span>
                        <Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                      <h4 className="text-base font-bold mt-2">Puntos y Nivel</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        ¡Completa lecciones para ganar XP y subir de nivel!
                      </p>

                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-600">XP Totales:</span>
                          <span className="font-mono font-bold text-amber-600">{totalXP} XP</span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-1">
                            <span>PROGRESO AL SIGUIENTE NIVEL</span>
                            <span>{Math.round(progressToNextLevel)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 border border-[#0d1b2e] h-2">
                            <div 
                              className="bg-amber-500 h-full transition-all duration-300"
                              style={{ width: `${progressToNextLevel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab('puntos')}
                        className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-[#001f4a] font-bold text-xs border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#000000] cursor-pointer"
                      >
                        Ver Tabla de Puntos
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Row: Resume learning and community */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Learning Progress Summary (hidden for guest) */}
              {student.id !== 'guest-student' && (
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} space-y-4`}>
                <h3 className="font-bold text-base border-b border-slate-100 pb-2">Mi Progreso de Aprendizaje</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                      <span>Progreso de Cursos</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 border border-[#0d1b2e] h-3.5">
                      <div 
                        className="bg-[#2a4e7c] h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                      <span className="text-xl font-bold font-mono text-[#2a4e7c] block">{completedCourseLessons.length}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Completadas</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded">
                      <span className="text-xl font-bold font-mono text-slate-700 block">{courseLessons.length}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Lecciones Asignadas</span>
                    </div>
                  </div>
                  
                  {courseLessons.length > 0 && completedCourseLessons.length < courseLessons.length && (
                    <div className="p-3.5 bg-amber-50 border-2 border-[#0d1b2e] flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-bold text-amber-700 uppercase block">Próxima Lección recomendada:</span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {courseLessons.find(l => !completedLessonIds.includes(l.id))?.title || 'Continuar aprendiendo'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('aprendizaje');
                          setInsidePlatform(false);
                        }}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 border border-[#0d1b2e] font-bold text-[10px] cursor-pointer"
                      >
                        Continuar &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Community Feed Preview */}
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} space-y-4`}>
                <h3 className="font-bold text-base border-b border-slate-100 pb-2">Actividad del Foro Estudiantil</h3>
                
                <div className="space-y-3">
                  {posts.slice(0, 2).map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        setSelectedPostId(p.id);
                        setActiveTab('foro');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-[#2a4e7c] block truncate">{p.title}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Por {p.authorName} • {new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 shrink-0">
                        ❤️ {p.likes}
                      </div>
                    </div>
                  ))}
                  
                  {posts.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No hay publicaciones recientes en el foro.
                    </p>
                  )}
                  
                  <button
                    onClick={() => setActiveTab('foro')}
                    className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 border-2 border-[#0d1b2e] text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    Ver Todo el Foro
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}



        {/* TAB 0C: CERTIFICADOS */}
        {activeTab === 'certificados' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold">Mis Certificados Oficiales</h2>
              <p className="text-xs text-slate-500 mt-1">
                Al completar el 100% de las lecciones de cualquier curso, podrás descargar tu diploma acreditativo de Play Code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const activeCoursesToCert = myClassrooms.length > 0 
                  ? myClassrooms 
                  : (student.course ? [{ id: 'legacy', name: student.course, description: 'Programa curricular Play Code', students: [student.id] }] : []);
                
                if (activeCoursesToCert.length === 0) {
                  return (
                    <div className="col-span-2 p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 text-slate-400 italic text-xs">
                      No estás registrado en ningún curso para generar certificados.
                    </div>
                  );
                }

                return activeCoursesToCert.map(course => {
                  const cLessons = course.id === 'legacy'
                    ? lessons.filter(l => l.courseName === course.name)
                    : (course.lessonIds ? lessons.filter(l => course.lessonIds!.includes(l.id)) : []);
                  const completed = cLessons.filter(l => completedLessonIds.includes(l.id));
                  const progress = cLessons.length > 0 ? Math.round((completed.length / cLessons.length) * 100) : 0;
                  const isCompleted = progress === 100 && cLessons.length > 0;

                  return (
                    <div 
                      key={course.id} 
                      className={`p-6 border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] flex flex-col justify-between ${
                        isCompleted ? 'bg-gradient-to-br from-amber-50 to-white' : 'bg-white opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 border ${
                            isCompleted ? 'bg-amber-100 text-amber-700 border-amber-400' : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {isCompleted ? 'DESBLOQUEADO' : 'EN CURSO'}
                          </span>
                          <Award className={`w-6 h-6 ${isCompleted ? 'text-amber-500' : 'text-slate-300'}`} />
                        </div>
                        <h3 className="text-base font-bold">{course.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{course.description || 'Programa oficial de Play Code'}</p>

                        <div className="mt-4">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                            <span>PROGRESO</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 border border-[#0d1b2e] h-2">
                            <div 
                              className={`h-full transition-all duration-300 ${isCompleted ? 'bg-amber-500' : 'bg-[#2a4e7c]'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {isCompleted ? (
                          <button
                            onClick={() => setSelectedCertificateCourse(course as Classroom)}
                            className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-[#001f4a] font-bold border-2 border-[#0d1b2e] text-xs shadow-[2px_2px_0_0_#000000] cursor-pointer"
                          >
                            Ver y Descargar Certificado
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full text-center py-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs cursor-not-allowed"
                          >
                            Completa el 100% de las clases para desbloquear
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal de Certificado */}
            {selectedCertificateCourse && (
              <div className="fixed inset-0 z-50 bg-[#0d1b2e]/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white border-4 border-[#0d1b2e] shadow-[8px_8px_0_0_#000000] max-w-2xl w-full p-8 relative flex flex-col items-center text-center space-y-6">
                  <button
                    onClick={() => setSelectedCertificateCourse(null)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="border-4 border-double border-amber-400 p-8 w-full space-y-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#2a4e7c] block uppercase">PLAY CODE ACADEMY</span>
                    
                    <div className="w-16 h-16 bg-amber-100 border-2 border-amber-500 rounded-full mx-auto flex items-center justify-center">
                      <Award className="w-9 h-9 text-amber-600" />
                    </div>

                    <h2 className="font-serif text-3xl text-[#0d1b2e]">CERTIFICADO DE ACOMPLETAMIENTO</h2>
                    
                    <p className="text-xs text-slate-500 italic">Este certificado oficial se otorga con honor a:</p>
                    
                    <p className="text-xl font-bold font-serif text-[#0d1b2e] border-b-2 border-slate-300 pb-2 max-w-md mx-auto">
                      {student.name}
                    </p>

                    <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                      Por haber completado con éxito y de manera sobresaliente el plan de estudios completo para el curso
                      <strong className="text-[#0d1b2e] block text-sm mt-1">{selectedCertificateCourse.name}</strong>
                      demostrando competencias y habilidades digitales en programación, desarrollo de software y tecnologías STEAM.
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-8 text-[10px] font-bold text-slate-500 border-t border-slate-100 max-w-md mx-auto">
                      <div>
                        <span className="block border-b border-slate-300 pb-1 font-serif text-slate-800 text-xs italic">Juan Pacheco</span>
                        <span className="block uppercase tracking-wider mt-1 text-[8px]">Director General</span>
                      </div>
                      <div>
                        <span className="block border-b border-slate-300 pb-1 font-mono text-slate-800 text-xs">{new Date().toLocaleDateString()}</span>
                        <span className="block uppercase tracking-wider mt-1 text-[8px]">Fecha de Aprobación</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white border-2 border-[#0d1b2e] font-bold text-xs shadow-[3px_3px_0_0_#000000] cursor-pointer"
                  >
                    🖨️ Imprimir / Guardar PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 0D: MIS PUNTOS */}
        {activeTab === 'puntos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold">Mis Logros y Clasificación</h2>
              <p className="text-xs text-slate-500 mt-1">
                Gana puntos XP completando lecciones y participando activamente en la comunidad. ¡Desbloquea insignias y recolecta ítems legendarios!
              </p>
            </div>

            {/* Top row stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#2a4e7c] text-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] p-5 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85">Nivel de Programador</span>
                <span className="text-3xl font-bold block font-mono">Lvl {Math.floor(completedLessonIds.length / 3) + 1}</span>
                <span className="text-[9px] block opacity-75">Siguiente nivel en {3 - (completedLessonIds.length % 3)} lecciones</span>
              </div>
              <div className="bg-amber-400 text-[#0d1b2e] border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] p-5 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85">Puntos Totales (XP)</span>
                <span className="text-3xl font-bold block font-mono">{(student.completedLessonIds?.length || 0) * 100} XP</span>
                <span className="text-[9px] block opacity-75">100 XP por cada lección completada</span>
              </div>
              <div className="bg-[#2ec4b6] text-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] p-5 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85">Insignias Desbloqueadas</span>
                <span className="text-3xl font-bold block font-mono">
                  {(student.unlockedBadgeIds || []).length} / 4
                </span>
                <span className="text-[9px] block opacity-75">¡Abre cofres para obtenerlas todas!</span>
              </div>
            </div>

            {/* Inventario RPG de Ítems */}
            <div className="bg-slate-900 border-4 border-amber-500 rounded p-6 shadow-[4px_4px_0_0_#0d1b2e] text-slate-100">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                <span className="text-2xl">🎒</span>
                <div className="text-left">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">Inventario RPG del Programador</h3>
                  <p className="text-[9px] text-slate-400">Objetos mágicos obtenidos de cofres tras tus logros académicos y aportes de veracidad en el foro.</p>
                </div>
              </div>

              {/* Grid de Celdas de Inventario */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {Object.values(GAME_ITEMS).map((item) => {
                  const hasItem = (student.inventory || []).includes(item.id);
                  let borderClass = 'border-slate-800 bg-slate-950/40 opacity-40';
                  
                  if (hasItem) {
                    if (item.rarity === 'common') borderClass = 'border-slate-400 bg-slate-800';
                    if (item.rarity === 'rare') borderClass = 'border-blue-500 bg-blue-950/30';
                    if (item.rarity === 'epic') borderClass = 'border-purple-500 bg-purple-950/30 animate-pulse';
                    if (item.rarity === 'legendary') borderClass = 'border-amber-500 bg-amber-950/30 animate-glow';
                  }

                  return (
                    <div 
                      key={item.id}
                      className={`border-2 p-4 rounded flex flex-col items-center text-center transition-all ${borderClass}`}
                    >
                      <span className={`text-4xl mb-2 select-none filter ${hasItem ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'grayscale'}`}>
                        {item.emoji}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 truncate w-full">{item.name}</h4>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                        {item.rarity === 'common' && 'Común'}
                        {item.rarity === 'rare' && 'Raro'}
                        {item.rarity === 'epic' && 'Épico'}
                        {item.rarity === 'legendary' && 'Legendario'}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-2 font-medium leading-tight line-clamp-2">
                        {hasItem ? item.description : '¡Cofre Requerido!'}
                      </p>
                      {hasItem ? (
                        <span className="text-[8px] font-extrabold text-emerald-400 mt-2">✓ OBTENIDO</span>
                      ) : (
                        <span className="text-[8px] font-bold text-slate-500 mt-2">🔒 BLOQUEADO</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              
              {/* Badges List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mis Insignias</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Aprendiz Curioso', emoji: '📖', desc: 'Otorgado por ingresar al portal y reclamar el Códice del Logos.' },
                    { name: 'Maestro del Código', emoji: '🗝️', desc: 'Completar al menos 5 lecciones de programación en Play Code.' },
                    { name: 'Portador de la Verdad', emoji: '🗡️', desc: 'Recibir 10 o más reacciones ✅ por veracidad en el foro.' },
                    { name: 'Guardián Digital', emoji: '🛡️', desc: 'Completar el 100% de las clases de un curso oficial.' }
                  ].map((badge) => {
                    const unlocked = (student.unlockedBadgeIds || []).includes(badge.name);
                    return (
                      <div 
                        key={badge.name}
                        className={`p-4 border-2 border-[#0d1b2e] rounded flex items-center gap-3 ${unlocked ? 'bg-white' : 'bg-slate-50 opacity-60'}`}
                      >
                        <span className="text-3xl">{badge.emoji}</span>
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-slate-800">{badge.name}</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5">{badge.desc}</p>
                          {unlocked ? (
                            <span className="text-[8px] font-bold text-emerald-600 block mt-1">✓ DESBLOQUEADO</span>
                          ) : (
                            <span className="text-[8px] font-bold text-slate-400 block mt-1">BLOQUEADO</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clasificación General del Aula</h3>
                
                <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f0f4f8] border-b border-[#0d1b2e] text-[10px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-2">Pos</th>
                        <th className="px-4 py-2">Estudiante</th>
                        <th className="px-4 py-2 text-right">XP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {leaderboardStudents.map((s, index) => {
                        const isSelf = s.id === student.id;
                        const pos = index + 1;
                        let posDisplay = `${pos}`;
                        if (pos === 1) posDisplay = '🥇 1';
                        if (pos === 2) posDisplay = '🥈 2';
                        if (pos === 3) posDisplay = '🥉 3';

                        const rowClass = isSelf 
                          ? 'bg-blue-50 border-y-2 border-blue-200' 
                          : pos === 1 
                            ? 'bg-amber-50' 
                            : '';
                            
                        const nameColor = isSelf ? 'text-blue-900 font-extrabold' : 'text-slate-800';

                        return (
                          <tr key={s.id} className={rowClass}>
                            <td className="px-4 py-3 font-bold">{posDisplay}</td>
                            <td className={`px-4 py-3 ${nameColor}`}>{s.name} {isSelf && '(Tú)'}</td>
                            <td className={`px-4 py-3 text-right font-mono ${isSelf ? 'text-blue-800 font-extrabold' : 'text-slate-750'}`}>
                              {(s.completedLessonIds?.length || 0) * 100} XP
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'aprendizaje' && (
          <div>
            {insidePlatform ? (
              <div className="space-y-6">
                {/* Platform Navigation */}
                {!selectedPlatformAula ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <button 
                          onClick={() => setInsidePlatform(false)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Volver a mi Aprendizaje
                        </button>
                        <h3 className="text-xl font-bold mt-4 text-[#0d1b2e]">
                          {platforms.find(p => p.id === (currentPlatformId || student.platformId))?.name || 'Mi Plataforma'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {platforms.find(p => p.id === (currentPlatformId || student.platformId))?.description || 'Accede a tus aulas y contenidos vinculados.'}
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mis Aulas Inscritas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(() => {
                        const myPlatformObj = platforms.find(p => p.id === (currentPlatformId || student.platformId));
                        if (!myPlatformObj) return null;

                        const currentAulaIds = student.aulaIds || (student.aulaId ? [student.aulaId] : []);
                        const platformAulas = myPlatformObj.aulas.filter(a => currentAulaIds.includes(a.id));

                        if (platformAulas.length === 0) {
                          return (
                            <div className="col-span-3 bg-yellow-50 border-2 border-yellow-300 p-4 font-semibold text-xs text-yellow-700">
                              No tienes aulas asignadas en esta plataforma. Solicita acceso a tu administrador.
                            </div>
                          );
                        }
                        
                        return platformAulas.map(myAula => (
                          <div 
                            key={myAula.id}
                            onClick={() => setSelectedPlatformAula(myAula)}
                            className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all flex flex-col justify-between`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${t.badgeBg}`}>
                                  {myAula.modality.toUpperCase()}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">{myAula.ageRange}</span>
                              </div>
                              <h4 className="text-lg font-bold">{myAula.name}</h4>
                              <p className="text-xs text-slate-500 mt-2">{myAula.description}</p>
                              
                              {myAula.schedule && (
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{myAula.schedule}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                              <span className="text-[10px] font-bold text-[#2a4e7c] uppercase">Entrar al Aula</span>
                              <ArrowRight className="w-4 h-4 text-[#2a4e7c]" />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                ) : !selectedPlatformCourse ? (
                  <div className="space-y-6">
                    <div>
                      <button 
                        onClick={() => setSelectedPlatformAula(null)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver a Aulas
                      </button>
                      <h3 className="text-xl font-bold mt-4 text-[#0d1b2e]">Aula: {selectedPlatformAula.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{selectedPlatformAula.description}</p>
                      {selectedPlatformAula.schedule && (
                        <p className="text-[11px] text-[#2a4e7c] font-bold mt-1">Horario: {selectedPlatformAula.schedule}</p>
                      )}
                      {selectedPlatformAula.modality === 'Virtual' && selectedPlatformAula.meetingUrl && (
                        <div className="mt-4 p-4 bg-[#e8f0fe] border-2 border-[#2a4e7c] shadow-[4px_4px_0_0_#2a4e7c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-xl">
                          <div>
                            <span className="text-[9px] font-bold text-[#2a4e7c] uppercase tracking-wider block font-mono">Clase en Vivo</span>
                            <h4 className="text-xs font-bold text-[#0d1b2e] mt-0.5">Accede a tu clase en tiempo real por Google Meet</h4>
                          </div>
                          <a
                            href={selectedPlatformAula.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] text-xs transition-all shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer"
                          >
                            <Video className="w-4 h-4" /> Unirse a la Clase
                          </a>
                        </div>
                      )}
                    </div>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cursos de este Aula</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(() => {
                        // courseIds en el aula referencia IDs de classrooms (c1, c2...), no del catálogo
                        const aulaCourses = classrooms.filter(c => selectedPlatformAula.courseIds?.includes(c.id));
                        if (aulaCourses.length === 0) {
                          return (
                            <div className="col-span-3 bg-slate-50 border-2 border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 font-medium">
                              No hay cursos configurados para esta aula actualmente.
                            </div>
                          );
                        }
                        return aulaCourses.map(course => {
                          const courseLessons = course.lessonIds && course.lessonIds.length > 0
                            ? lessons.filter(l => course.lessonIds!.includes(l.id))
                            : lessons.filter(l => l.courseName === course.name);
                          const completedCourseLessons = courseLessons.filter(l => student.completedLessonIds?.includes(l.id));
                          const progressPercent = courseLessons.length > 0 
                            ? Math.round((completedCourseLessons.length / courseLessons.length) * 100) 
                            : 0;

                          return (
                            <div 
                              key={course.id}
                              onClick={() => {
                                setSelectedPlatformCourse(course);
                                const cLessons = course.lessonIds && course.lessonIds.length > 0
                                  ? lessons.filter(l => course.lessonIds!.includes(l.id))
                                  : lessons.filter(l => l.courseName === course.name);
                                if (cLessons.length > 0) {
                                  setSelectedPlatformLesson(cLessons[0]);
                                } else {
                                  setSelectedPlatformLesson(null);
                                }
                              }}
                              className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all flex flex-col justify-between`}
                            >
                              <div>
                                {course.imageUrl && (
                                  <img src={course.imageUrl} alt={course.name} className="w-full h-28 object-cover mb-3 rounded" />
                                )}
                                <h4 className="text-lg font-bold line-clamp-2">{course.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                                
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mb-1">
                                    <span>PROGRESO</span>
                                    <span>{progressPercent}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 border border-[#0d1b2e] h-2">
                                    <div 
                                      className="bg-[#2a4e7c] h-full transition-all duration-300"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                  <span className="text-[8px] text-slate-400 mt-1.5 block">
                                    {completedCourseLessons.length} de {courseLessons.length} lecciones completadas
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                                <span className="text-[10px] font-bold text-[#2a4e7c] uppercase">Ingresar al Curso</span>
                                <ArrowRight className="w-4 h-4 text-[#2a4e7c]" />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button 
                            onClick={() => {
                              setSelectedPlatformCourse(null);
                              setSelectedPlatformLesson(null);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Aula
                          </button>

                          {selectedPlatformLesson && (
                            <button
                              onClick={() => setHideLessonsSidebar(!hideLessonsSidebar)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a4e7c] hover:bg-[#1e385c] text-white border-2 border-[#0d1b2e] font-bold text-[10px] rounded cursor-pointer transition-all shadow-[1.5px_1.5px_0_0_#000000] active:translate-y-[1.5px] active:shadow-[0px_0px_0_0_#000000]"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              {hideLessonsSidebar ? "Mostrar lista de lecciones" : "Ocultar lista de lecciones"}
                            </button>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mt-4 text-[#0d1b2e]">{selectedPlatformCourse.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">Contenido didáctico del curso en {selectedPlatformAula.name}</p>
                      </div>
                    </div>

                    {(() => {
                      const courseLessons = selectedPlatformCourse.lessonIds && selectedPlatformCourse.lessonIds.length > 0
                        ? lessons.filter(l => selectedPlatformCourse.lessonIds!.includes(l.id))
                        : lessons.filter(l => l.courseName === selectedPlatformCourse.name);
                      if (courseLessons.length === 0) {
                        return (
                          <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                            No hay lecciones cargadas para este curso en este momento.
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          {(!hideLessonsSidebar || !selectedPlatformLesson) && (
                            <div className="lg:col-span-4 space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lecciones del Curso</h4>
                              <div className="space-y-2">
                                {courseLessons.map((l, index) => {
                                  const isSelected = selectedPlatformLesson?.id === l.id;
                                  const isCompleted = student.completedLessonIds?.includes(l.id);
                                  return (
                                    <div
                                      key={l.id}
                                      onClick={() => setSelectedPlatformLesson(l)}
                                      className={`p-3 border-2 border-[#0d1b2e] cursor-pointer transition-all flex items-center justify-between ${
                                        isSelected 
                                          ? 'bg-[#ffe66d] shadow-[2px_2px_0_0_#000000] translate-x-0.5 -translate-y-0.5' 
                                          : 'bg-white hover:bg-slate-50 shadow-[1px_1px_0_0_#0d1b2e]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded shrink-0">
                                          L{index + 1}
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 truncate">{l.title}</span>
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={isCompleted || false}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          toggleLessonCompletion(l.id);
                                        }}
                                        className="w-3.5 h-3.5 border-2 border-[#0d1b2e] rounded-sm cursor-pointer accent-[#2a4e7c]"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className={(hideLessonsSidebar && selectedPlatformLesson) ? "lg:col-span-12" : "lg:col-span-8"}>
                            {selectedPlatformLesson ? (
                              <div className="bg-white border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#0d1b2e] p-5 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <button
                                      onClick={() => setHideLessonsSidebar(!hideLessonsSidebar)}
                                      className="p-1.5 bg-[#f0f4f8] hover:bg-slate-200 border-2 border-[#0d1b2e] shadow-[1px_1px_0_0_#0d1b2e] active:translate-y-[1px] active:shadow-none transition-all text-slate-700 cursor-pointer flex items-center justify-center shrink-0"
                                      title={hideLessonsSidebar ? "Mostrar lista de lecciones" : "Ocultar lista de lecciones"}
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </button>
                                    <h4 className="text-base font-bold text-[#0d1b2e] truncate">{selectedPlatformLesson.title}</h4>
                                  </div>
                                  <div className="flex items-center gap-2.5 shrink-0 bg-[#ffe66d]/30 border-2 border-[#0d1b2e] shadow-[2px_2px_0_0_#0d1b2e] px-3 py-1.5 rounded">
                                    <span className="text-[10px] font-bold text-[#0d1b2e] uppercase tracking-wider">Marcar completada</span>
                                    <input
                                      type="checkbox"
                                      checked={student.completedLessonIds?.includes(selectedPlatformLesson.id) || false}
                                      onChange={() => toggleLessonCompletion(selectedPlatformLesson.id)}
                                      className="w-4 h-4 border-2 border-[#0d1b2e] rounded-sm cursor-pointer accent-[#2a4e7c] bg-white"
                                    />
                                  </div>
                                </div>
                                <div 
                                  className="prose max-w-none text-xs text-slate-700 leading-relaxed overflow-x-auto"
                                  dangerouslySetInnerHTML={{ __html: selectedPlatformLesson.htmlContent }}
                                />
                              </div>
                            ) : (
                              <div className="bg-slate-50 border-2 border-dashed border-slate-350 p-8 text-center text-xs text-slate-500">
                                Selecciona una lección de la lista para comenzar a aprender.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : !selectedCourseName ? (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  {(student.platformId || (student.platformIds && student.platformIds.length > 0)) ? 'Mis Plataformas' : 'Mis Cursos Inscritos'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {!student.platformId && student.course && (
                    <div 
                      onClick={() => setSelectedCourseName(student.course || '')}
                      className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${t.badgeBg}`}>
                            ACTIVO
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h4 className="text-lg font-bold line-clamp-2">{student.course}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Programa curricular Play Code</p>
 
                        {/* Progress Bar */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mb-1">
                            <span>PROGRESO DE LECCIONES</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-200 border border-[#0d1b2e] h-2">
                            <div 
                              className="bg-[#2a4e7c] h-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-slate-400 mt-1.5 block">
                            {completedCourseLessons.length} de {courseLessons.length} lecciones completadas
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                        <span className="text-[10px] font-bold text-[#2a4e7c] uppercase">Ver Clases del Curso</span>
                        <ArrowRight className="w-4 h-4 text-[#2a4e7c]" />
                      </div>
                    </div>
                  )}
 
                  {/* Render Platform cards if platformIds or platformId is assigned */}
                  {(() => {
                    const currentPlatformIds = student.platformIds || (student.platformId ? [student.platformId] : []);
                    const assignedPlatforms = platforms.filter(p => currentPlatformIds.includes(p.id));

                    return assignedPlatforms.map(myPlatform => {
                      const currentAulaIds = student.aulaIds || (student.aulaId ? [student.aulaId] : []);
                      const platformAulas = myPlatform.aulas.filter(a => currentAulaIds.includes(a.id));

                      return (
                        <div 
                          key={myPlatform.id}
                          onClick={() => {
                            setCurrentPlatformId(myPlatform.id);
                            setInsidePlatform(true);
                          }}
                          className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all flex flex-col justify-between border-dashed`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-400">
                                PLATAFORMA
                              </span>
                              <Sparkles className="w-4 h-4 text-amber-500" />
                            </div>
                            <h4 className="text-lg font-bold line-clamp-2">{myPlatform.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {myPlatform.description || 'Accede a tus aulas y contenidos vinculados.'}
                            </p>
                            
                            {platformAulas.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 block uppercase">Aulas Asignadas ({platformAulas.length}):</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {platformAulas.map(a => (
                                    <span key={a.id} className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                      {a.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                            <span className="text-[10px] font-bold text-amber-600 uppercase">Ingresar a la Plataforma</span>
                            <ArrowRight className="w-4 h-4 text-amber-600" />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : selectedClassroomForLessons ? (
              <div className="space-y-6">
                {/* Back button and Classroom Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-200 pb-4 mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedClassroomForLessons(null);
                        setSelectedLessonForPreview(null);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 font-bold text-xs border-2 border-[#0d1b2e] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver a Clases
                    </button>

                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 font-bold text-xs border-2 border-[#0d1b2e] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000]"
                    >
                      {isSidebarCollapsed ? (
                        <>
                          <ChevronRight className="w-3.5 h-3.5" /> Mostrar Lecciones
                        </>
                      ) : (
                        <>
                          <ChevronLeft className="w-3.5 h-3.5" /> Ocultar Lecciones
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Workspace de Estudio</span>
                    <h3 className="text-sm font-bold text-[#0d1b2e] uppercase tracking-wider">
                      {selectedClassroomForLessons.name}
                    </h3>
                  </div>
                </div>

                {/* Workspace Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left panel: collapsible/scrollable list of lessons */}
                  <div className={`space-y-4 ${isSidebarCollapsed ? 'hidden' : 'lg:col-span-1 block'}`}>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lecciones de la Clase</h4>
                    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                      {selectedClassroomForLessons.lessonIds && selectedClassroomForLessons.lessonIds.map(id => {
                        const lesson = lessons.find(l => l.id === id);
                        if (!lesson) return null;
                        const isSelected = selectedLessonForPreview?.id === lesson.id;
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className={`w-full text-left p-3.5 border-2 transition-all flex flex-col gap-1.5 ${
                              isSelected
                                ? `border-[#0d1b2e] ${t.activeTabBg} ${t.activeTabText} shadow-[2.5px_2.5px_0_0_#0d1b2e]`
                                : `bg-white border-slate-350 text-slate-700 hover:border-slate-400 hover:bg-slate-50`
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLessonCompletion(lesson.id);
                                }}
                                className="cursor-pointer p-0.5 hover:bg-slate-200/60 rounded transition-all mt-0.5 border-0 bg-transparent flex items-center justify-center"
                                title={isCompleted ? "Marcar como incompleto" : "Marcar como completado"}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                ) : (
                                  <Circle className="w-4.5 h-4.5 text-slate-350 hover:text-[#2a4e7c]" />
                                )}
                              </button>
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => setSelectedLessonForPreview(lesson)}
                              >
                                <span className="font-bold text-xs line-clamp-2 block">{lesson.title}</span>
                                <span className="text-[8px] text-slate-400 font-semibold uppercase block mt-0.5">ID: {lesson.id}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(!selectedClassroomForLessons.lessonIds || selectedClassroomForLessons.lessonIds.length === 0) && (
                        <div className="p-4 text-center border-2 border-dashed border-slate-300 text-slate-400 text-xs italic bg-slate-50">
                          No hay lecciones vinculadas.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right panel: Content viewer */}
                  <div className={isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'}>
                    {selectedLessonForPreview ? (
                      <div className="bg-white border-4 border-[#0d1b2e] shadow-[6px_6px_0_0_#000000] overflow-hidden w-full flex flex-col">
                        {/* Embed Frame */}
                        <div className="bg-slate-50 flex items-center justify-center">
                          <div
                            key={selectedLessonForPreview.id}
                            className="w-full flex justify-center items-center [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:min-h-[500px] [&_iframe]:aspect-video"
                            dangerouslySetInnerHTML={{ __html: selectedLessonForPreview.htmlContent }}
                          />
                        </div>

                        {/* Control Footer */}
                        <div className="bg-white border-t-4 border-[#0d1b2e] p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                          <div className="text-left">
                            <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Estás estudiando</span>
                            <h4 className="text-xs font-bold text-[#0d1b2e]">{selectedLessonForPreview.title}</h4>
                          </div>

                          <button
                            onClick={() => toggleLessonCompletion(selectedLessonForPreview.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 font-bold text-xs border-2 border-[#0d1b2e] transition-all cursor-pointer shadow-[3px_3px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] ${
                              completedLessonIds.includes(selectedLessonForPreview.id)
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-[#ffd166] text-[#001f4a] hover:bg-[#ffc233]'
                            }`}
                          >
                            {completedLessonIds.includes(selectedLessonForPreview.id) ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Lección Completada ✓
                              </>
                            ) : (
                              <>
                                <Circle className="w-4 h-4" /> Marcar como Completada
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-4 border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-400 italic text-xs h-[50vh] flex items-center justify-center">
                        Selecciona una lección del panel izquierdo para comenzar.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedCourseName(null)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 font-bold text-xs border-2 border-[#0d1b2e] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver a Cursos
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border-2 border-[#0d1b2e] p-5 shadow-[4px_4px_0_0_#000000] mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#ffd166] border border-[#0d1b2e] uppercase text-[#001f4a]">
                      Curso Activo
                    </span>
                    <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide">{selectedCourseName}</h2>
                  </div>

                  <div className="w-full md:w-80">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                      <span>TU PROGRESO EN EL CURSO</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 border border-[#0d1b2e] h-2.5">
                      <div 
                        className="bg-[#2a4e7c] h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      {completedCourseLessons.length} de {courseLessons.length} lecciones completadas
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Mis Cursos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {myClassrooms.map(cls => {
                      return (
                        <div key={cls.id} className={`${t.cardBg} ${t.cardBorder} ${t.cardShadow} flex flex-col justify-between overflow-hidden`}>
                          {cls.imageUrl ? (
                            <div 
                              onClick={() => {
                                if (cls.lessonIds && cls.lessonIds.length > 0) {
                                  setSelectedClassroomForLessons(cls);
                                  const firstId = cls.lessonIds?.[0];
                                  const firstLesson = lessons.find(l => l.id === firstId);
                                  setSelectedLessonForPreview(firstLesson || null);
                                }
                              }}
                              className="w-full h-32 overflow-hidden border-b-2 border-[#0d1b2e] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                              title="Haga clic para ver las lecciones de este curso"
                            >
                              <img
                                src={cls.imageUrl}
                                alt={cls.name}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                if (cls.lessonIds && cls.lessonIds.length > 0) {
                                  setSelectedClassroomForLessons(cls);
                                  const firstId = cls.lessonIds?.[0];
                                  const firstLesson = lessons.find(l => l.id === firstId);
                                  setSelectedLessonForPreview(firstLesson || null);
                                }
                              }}
                              className="w-full h-32 bg-gradient-to-br from-[#0d1b2e] to-[#1e385c] border-b-2 border-[#0d1b2e] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                              title="Haga clic para ver las lecciones de este curso"
                            >
                              <BookOpen className="w-10 h-10 text-[#a3b8cc]/20" />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div
                              onClick={() => {
                                if (cls.lessonIds && cls.lessonIds.length > 0) {
                                  setSelectedClassroomForLessons(cls);
                                  const firstId = cls.lessonIds?.[0];
                                  const firstLesson = lessons.find(l => l.id === firstId);
                                  setSelectedLessonForPreview(firstLesson || null);
                                }
                              }}
                              className={cls.lessonIds && cls.lessonIds.length > 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
                              title={cls.lessonIds && cls.lessonIds.length > 0 ? 'Haga clic para ver las lecciones de este curso' : ''}
                            >
                              <h4 className="text-sm font-bold mb-1 line-clamp-2 leading-tight">{cls.name}</h4>
                              <p className="text-[11px] text-slate-500 mb-3 line-clamp-3">{cls.description}</p>
                            </div>


                          </div>
                        </div>
                      );
                    })}
                    {myClassrooms.length === 0 && (
                      <div className={`col-span-full text-center py-8 ${t.cardBg} border ${t.cardBorder} text-slate-400 italic text-xs`}>
                        No tienes cursos asignados por el momento.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {activeTab === 'recursos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#0d1b2e] font-pixel uppercase tracking-wide">
                Biblioteca de Recursos
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Aqui tienes acceso a servidores privados de Play Code, asi como tambien a herramientas, juegos y apps desarrolladas por nosotros para ayudarte en tu aprendizaje
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.length === 0 ? (
                <div className="col-span-3 bg-white border-4 border-[#0d1b2e] p-8 text-center text-xs text-slate-500 rounded font-semibold shadow-[6px_6px_0_0_#0d1b2e]">
                  No hay recursos disponibles en este momento.
                </div>
              ) : (
                resources.map((res) => {
                  const relatedCourse = courses.find(c => c.id === res.courseId || c.title === res.courseId);
                  return (
                    <div 
                      key={res.id} 
                      className={`${t.cardBg} ${t.cardBorder} p-5 ${t.cardShadow} hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all flex flex-col justify-between`}
                    >
                      <div>
                        {res.imageUrl && (
                          <img 
                            src={res.imageUrl} 
                            alt={res.name}
                            className="w-full h-32 object-cover border-2 border-[#0d1b2e] rounded mb-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase">
                            {relatedCourse ? relatedCourse.title : 'General'}
                          </span>
                          <BookOpen className="w-4 h-4 text-amber-500" />
                        </div>
                        <h4 className="text-base font-bold text-[#0d1b2e] line-clamp-2">{res.name}</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {res.description}
                        </p>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#2a4e7c] hover:bg-[#1e385c] text-white font-bold border-2 border-[#0d1b2e] shadow-[2.5px_2.5px_0_0_#000000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                        >
                          Acceder al Recurso <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}


        {/* TAB 2: MI PERFIL & DISEÑO */}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Preview Card */}
            <div className="space-y-6 lg:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider">Vista Previa</h3>
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} text-center flex flex-col items-center`}>
                {customPhotoUrl ? (
                  <img
                    src={customPhotoUrl}
                    alt={student.name}
                    className="w-24 h-24 rounded-full border-4 border-[#0d1b2e] object-cover mb-4 shadow-[3px_3px_0_0_#2a4e7c]"
                    onError={() => setCustomPhotoUrl('')}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#f0f4f8] text-5xl flex items-center justify-center border-4 border-[#0d1b2e] mb-4 shadow-[3px_3px_0_0_#2a4e7c]">
                    {selectedAvatar}
                  </div>
                )}

                <h4 className="text-lg font-bold">{student.name}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.username}</span>

                <div className="my-4 border-t border-slate-200/50 w-full pt-4">
                  <p className="text-xs italic text-slate-500 px-2 leading-relaxed">
                    "{bio || 'Sin biografía'}"
                  </p>
                </div>

                {(() => {
                  const currentPlatformIds = student.platformIds || (student.platformId ? [student.platformId] : []);
                  const currentAulaIds = student.aulaIds || (student.aulaId ? [student.aulaId] : []);

                  if (currentPlatformIds.length > 0) {
                    return (
                      <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {currentPlatformIds.map(pId => {
                          const plat = platforms.find(p => p.id === pId);
                          if (!plat) return null;
                          const platAulas = plat.aulas.filter(a => currentAulaIds.includes(a.id));
                          const aulasStr = platAulas.map(a => a.name).join(', ');
                          return (
                            <div key={pId} className={`text-[10px] font-bold px-3 py-1 ${t.badgeBg} rounded-full`}>
                              Plataforma: {plat.name} {aulasStr ? `(${aulasStr})` : ''}
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else if (student.course) {
                    return (
                      <div className={`mt-2 text-[10px] font-bold px-3 py-1 ${t.badgeBg} rounded-full`}>
                        Curso: {student.course}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Customization Form & Themes */}
            <div className="space-y-8 lg:col-span-2">
              
              {/* Form Customization */}
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} space-y-5 text-xs`}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Personalizar Perfil
                </h3>

                <div>
                  <label className="font-bold text-slate-500 block mb-1.5">Seleccionar Avatar (Emoji)</label>
                  <div className="flex flex-wrap gap-2">
                    {avatarChoices.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => { setSelectedAvatar(emoji); setCustomPhotoUrl(''); }}
                        className={`w-10 h-10 text-xl border-2 rounded flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer ${
                          selectedAvatar === emoji && !customPhotoUrl ? 'border-[#2a4e7c] bg-[#f0f4f8]' : 'border-slate-350 bg-white'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1.5 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" /> O Vincular Foto de Perfil (URL)
                  </label>
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://ejemplo.com/tu-foto.jpg"
                    className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Ingresa el enlace directo a una imagen JPG/PNG para usarla en lugar del avatar.</p>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1.5">Biografía corta</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Cuéntanos un poco sobre ti..."
                    rows={3}
                    maxLength={160}
                    className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 resize-none font-semibold"
                  />
                  <p className="text-[9px] text-slate-400 text-right mt-1">{bio.length}/160 caracteres</p>
                </div>
              </div>

              {/* Theme Selector */}
              <div className={`${t.cardBg} ${t.cardBorder} p-6 ${t.cardShadow} space-y-4`}>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <Palette className="w-4 h-4" /> Seleccionar Tema del Panel
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Theme 1 Card */}
                  <button
                    onClick={() => setPalette('default')}
                    className={`p-4 border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-28 ${
                      palette === 'default'
                        ? 'border-[#2a4e7c] bg-[#f0f4f8] shadow-[3px_3px_0_0_#2a4e7c]'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0d1b2e] block">Paleta 1</span>
                      <span className="text-[9px] text-[#6180a6] uppercase font-bold">Default Blue</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0d1b2e]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#2a4e7c]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#a3b8cc]"></span>
                    </div>
                  </button>

                  {/* Theme 2 Card */}
                  <button
                    onClick={() => setPalette('cyberpunk')}
                    className={`p-4 border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-28 ${
                      palette === 'cyberpunk'
                        ? 'border-[#ff00ff] bg-[#8b2ae2]/10 shadow-[3px_3px_0_0_#ff00ff]'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Paleta 2</span>
                      <span className="text-[9px] text-[#ff00ff] uppercase font-bold">Cyberpunk / Neon</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#1a0033]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ff00ff]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#7b6eff]"></span>
                    </div>
                  </button>

                  {/* Theme 3 Card */}
                  <button
                    onClick={() => setPalette('playcode')}
                    className={`p-4 border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-28 ${
                      palette === 'playcode'
                        ? 'border-[#001f4a] bg-slate-100 shadow-[3px_3px_0_0_#f2900f]'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#001f4a] block">Paleta 3</span>
                      <span className="text-[9px] text-[#f2900f] uppercase font-bold">Play Code Web</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#001f4a]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ffe66d]"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f2900f]"></span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 justify-end">
                {isSaved && (
                  <span className="text-xs font-bold text-emerald-600 animate-pulse bg-emerald-55 border border-emerald-300 px-3 py-1 rounded">
                    ¡Cambios guardados con éxito! ✓
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className={`px-6 py-2.5 ${t.primaryBtnBg} ${t.primaryBtnHover} ${t.primaryBtnText} text-xs font-bold transition-all shadow-[3px_3px_0_0_#000000] active:translate-y-[3px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer`}
                >
                  Guardar Perfil y Tema
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FORO ESTUDIANTIL */}
        {activeTab === 'foro' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Cabecera del Foro y Formulario */}
            {!selectedPostId && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className={`text-xl font-bold ${t.textColor}`}>Foro de Discusión</h2>
                    <p className={`text-xs ${t.subtextColor} font-semibold mt-1`}>
                      Comparte tus dudas, ideas, proyectos y reacciona a las publicaciones de tus compañeros.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddPostForm(!showAddPostForm)}
                    className={`px-4 py-2 text-xs font-bold transition-all shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer flex items-center gap-1.5 ${
                      showAddPostForm 
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-2 border-slate-400' 
                        : `${t.primaryBtnBg} ${t.primaryBtnHover} ${t.primaryBtnText}`
                    }`}
                  >
                    {showAddPostForm ? 'Cancelar' : 'Nueva Publicación'} <Plus className="w-3.5 h-3.5" />
                  </button>
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

                {/* Formulario para nuevo Post */}
                {showAddPostForm && (
                  <form onSubmit={handleCreatePost} className={`${t.cardBg} ${t.cardBorder} ${t.cardShadow} p-5 space-y-4`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${t.textColor}`}>Crear Nueva Publicación</h3>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Título</label>
                      <input
                        type="text"
                        required
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Ej. ¿Cómo centrar un div en CSS? 🤔"
                        className="w-full px-3 py-2 border-2 border-[#0d1b2e] rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-655 block">Mensaje / Contenido</label>
                      <textarea
                        required
                        rows={4}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Describe tu duda o comparte el código/proyecto que estás construyendo..."
                        className="w-full px-3 py-2 border-2 border-[#0d1b2e] rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 block">Subir Imagen (Opcional)</label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-2 file:border-[#0d1b2e] file:text-xs file:font-bold file:bg-[#f0f4f8] file:text-[#2a4e7c] file:cursor-pointer hover:file:bg-slate-100"
                        />
                        {newPostImage && (
                          <button
                            type="button"
                            onClick={() => setNewPostImage(null)}
                            className="text-xs text-red-650 hover:underline font-bold"
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
                        className={`px-5 py-2 ${t.primaryBtnBg} ${t.primaryBtnHover} ${t.primaryBtnText} text-xs font-bold transition-all shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] cursor-pointer`}
                      >
                        Publicar en el Foro
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* Listado de Posts */}
            {selectedPostId ? (
              (() => {
                const post = posts.find(p => p.id === selectedPostId);
                if (!post) {
                  setSelectedPostId(null);
                  return null;
                }
                const hasLiked = post.likedBy.includes(student.username);
                const userReaction = post.reactedBy?.[student.username];
                return (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => setSelectedPostId(null)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 font-bold text-xs border-2 border-[#0d1b2e] bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-y-[2px] active:shadow-[0px_0px_0_0_#000000] text-slate-800"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver al Foro
                    </button>

                    <div className={`${t.cardBg} ${t.cardBorder} ${t.cardShadow} p-5 flex flex-col gap-4`}>
                      {/* Header: Autor y Fecha */}
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#f0f4f8] border border-slate-300 flex items-center justify-center font-bold text-sm shadow-[1px_1px_0_0_#0d1b2e] overflow-hidden">
                            {post.authorAvatar && (post.authorAvatar.startsWith('http') || post.authorAvatar.startsWith('/') || post.authorAvatar.startsWith('data:')) ? (
                              <img src={post.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              post.authorAvatar || '🚀'
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">{post.authorName}</span>
                            <span className="text-[9px] text-slate-400 block font-medium">{post.authorUsername}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {post.authorUsername === student.username && (
                            <button
                              onClick={() => {
                                handleDeletePost(post.id);
                                setSelectedPostId(null);
                              }}
                              className="text-slate-400 hover:text-red-655 p-1 cursor-pointer transition-colors"
                              title="Eliminar Publicación"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Titulo y Mensaje */}
                      <div>
                        <h3 className="text-sm font-bold text-[#0d1b2e] mb-1.5 leading-snug">{post.title}</h3>
                        <p className="text-xs text-slate-655 whitespace-pre-wrap leading-relaxed font-semibold">{post.content}</p>
                      </div>

                      {/* Imagen cargada */}
                      {post.imageUrl && (
                        <div className="border-2 border-[#0d1b2e] rounded overflow-hidden max-w-lg shadow-[3px_3px_0_0_#0d1b2e] group">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full object-cover max-h-[350px] transition-transform duration-300 group-hover:scale-101" 
                          />
                        </div>
                      )}

                      {/* Botones de Interaccion (Likes y Reacciones) */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        {/* Botón de Like */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                            hasLiked
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
                                onClick={() => handleReactToPost(post.id, emoji)}
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all cursor-pointer ${
                                  isSelected 
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

                      {/* Seccion de Comentarios */}
                      <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-4">
                        <h4 className="text-xs font-bold text-[#0d1b2e] uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#2a4e7c]" />
                          Comentarios ({post.comments.length})
                        </h4>
                        
                        {/* Lista de comentarios */}
                        {post.comments.length > 0 ? (
                          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="bg-white border border-slate-200 p-2.5 rounded shadow-[1.5px_1.5px_0_0_#cbd5e1]">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-slate-800">{comment.authorName}</span>
                                  <span className="text-[8px] text-slate-400 font-semibold bg-slate-50 px-1 rounded">
                                    {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-655 font-semibold">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic font-medium">Nadie ha comentado todavía. ¡Sé el primero!</p>
                        )}

                        {/* Input para agregar comentario */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Escribe un comentario..."
                            className="flex-1 px-3 py-1.5 border-2 border-slate-300 rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2a4e7c] text-slate-900 bg-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
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
                          className={`${t.cardBg} ${t.cardBorder} ${t.cardShadow} flex flex-col justify-between overflow-hidden hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] cursor-pointer transition-all`}
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
                                <div className="w-6 h-6 rounded-full bg-[#f0f4f8] border border-slate-350 flex items-center justify-center font-bold text-xs shadow-[0.5px_0.5px_0_0_#0d1b2e] overflow-hidden">
                                  {post.authorAvatar && (post.authorAvatar.startsWith('http') || post.authorAvatar.startsWith('/') || post.authorAvatar.startsWith('data:')) ? (
                                    <img src={post.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    post.authorAvatar || '🚀'
                                  )}
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
                      <div className="p-10 text-center bg-white border-2 border-dashed border-slate-350 rounded space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-slate-400 text-xs italic">
                          {posts.length === 0 
                            ? "El foro está vacío. ¡Publica algo para iniciar la conversación!" 
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
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 1px) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translate(2px, -1px) rotate(1deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)); }
          50% { filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.9)); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes particle-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.5); opacity: 0; }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-pop-in {
          animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-particle-1 { animation: particle-up 1.5s ease-out infinite; }
        .animate-particle-2 { animation: particle-up 1.8s ease-out infinite 0.3s; }
        .animate-particle-3 { animation: particle-up 1.2s ease-out infinite 0.6s; }
      `}} />

      {showChestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-slate-900 text-slate-100 border-4 border-amber-500 rounded-lg shadow-2xl p-6 overflow-hidden flex flex-col items-center">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_60%)] pointer-events-none" />

            <button 
              onClick={() => {
                if (!isOpeningChest) {
                  setShowChestModal(false);
                  setChestOpened(false);
                  setRevealedItem(null);
                }
              }}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 text-lg font-bold disabled:opacity-50"
              disabled={isOpeningChest}
            >
              ✕
            </button>

            {!chestOpened ? (
              <div className="flex flex-col items-center py-6 text-center">
                <h2 className="text-xl font-bold text-amber-400 mb-6 tracking-wide uppercase">Cofre de Recompensas</h2>
                
                <div className="relative w-48 h-48 flex items-center justify-center my-4">
                  {isOpeningChest && (
                    <div className="absolute inset-0 w-full h-full rounded-full bg-amber-400/20 blur-xl animate-pulse" />
                  )}
                  
                  <div 
                    onClick={handleOpenChest}
                    className={`cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95 ${isOpeningChest ? 'animate-shake' : 'animate-float'}`}
                    style={{ fontSize: '90px' }}
                  >
                    📦
                  </div>
                </div>

                <p className="text-sm text-slate-350 max-w-xs mt-4">
                  {isOpeningChest ? '¡Abriendo el cofre...!' : '¡Haz clic sobre el cofre para revelar tu recompensa legendaria!'}
                </p>

                {!isOpeningChest && (
                  <button
                    onClick={handleOpenChest}
                    className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold border-2 border-slate-900 shadow-[4px_4px_0_0_#000] rounded text-xs tracking-wider"
                  >
                    ABRIR COFRE 🗝️
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center animate-pop-in">
                <h2 className="text-lg font-extrabold text-emerald-400 mb-2 uppercase tracking-wider">¡RECOMPENSA REVELADA!</h2>
                <span className="text-[9px] text-amber-400 font-extrabold uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded border border-amber-500/30">
                  {revealedItem?.rarity === 'common' && 'Común'}
                  {revealedItem?.rarity === 'rare' && 'Raro'}
                  {revealedItem?.rarity === 'epic' && 'Épico'}
                  {revealedItem?.rarity === 'legendary' && 'Legendario'}
                </span>

                <div className="relative w-40 h-40 flex items-center justify-center my-6 animate-float">
                  <div className="absolute inset-0 w-full h-full rounded-full bg-amber-400/15 blur-lg animate-glow" />
                  
                  <span className="absolute text-xl animate-particle-1" style={{ top: '20%', left: '20%' }}>✨</span>
                  <span className="absolute text-xl animate-particle-2" style={{ top: '30%', right: '20%' }}>🌟</span>
                  <span className="absolute text-xl animate-particle-3" style={{ bottom: '20%', left: '30%' }}>✨</span>

                  <span className="text-8xl select-none filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                    {revealedItem?.emoji}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-100 mb-1">{revealedItem?.name}</h3>
                <p className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider mb-3">Tipo: {revealedItem?.type}</p>
                
                <p className="text-xs text-slate-350 max-w-xs px-2 mb-6 font-semibold leading-relaxed">
                  {revealedItem?.description}
                </p>

                <div className="w-full bg-slate-950/50 border border-slate-800 p-3.5 rounded mb-6 flex items-center gap-3">
                  <div className="text-2xl">🏆</div>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Insignia Desbloqueada</p>
                    <p className="text-xs font-extrabold text-amber-400">{revealedItem?.badgeName}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowChestModal(false);
                    setChestOpened(false);
                    setRevealedItem(null);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold border-2 border-slate-900 shadow-[4px_4px_0_0_#000] rounded uppercase tracking-wider text-xs transition-transform active:translate-y-0.5 cursor-pointer"
                >
                  Guardar en mi Inventario
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
