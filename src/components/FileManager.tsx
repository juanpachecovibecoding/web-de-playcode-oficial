import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  Folder, FileText, FileCode, Image, Upload, Plus, Trash2, 
  Pencil, Search, ChevronRight, Grid, List, Download, Copy, Check, FileArchive, Eye
} from 'lucide-react';

export interface VirtualFile {
  id: string;
  name: string;
  type: 'file' | 'directory';
  mimeType?: string;
  size: number;
  parentId: string;
  content?: string; // base64 or plain text
  createdAt: string;
  updatedAt: string;
}

interface FileManagerProps {
  files: VirtualFile[];
  setFiles: React.Dispatch<React.SetStateAction<VirtualFile[]>>;
}

export const FileManager: React.FC<FileManagerProps> = ({ files, setFiles }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Creation State
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Rename State
  const [renamingItem, setRenamingItem] = useState<VirtualFile | null>(null);
  const [renameName, setRenameName] = useState('');

  // Editor State
  const [editingFile, setEditingFile] = useState<VirtualFile | null>(null);
  const [editorContent, setEditorContent] = useState('');

  // Preview State
  const [previewFile, setPreviewFile] = useState<VirtualFile | null>(null);

  // Copy success indicator
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: VirtualFile;
  } | null>(null);

  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, item: VirtualFile) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered files in current folder
  
  // Filtered files in current folder
  const currentItems = files.filter(f => f.parentId === currentFolderId);
  const filteredItems = currentItems.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Folders tree for sidebar
  const folders = files.filter(f => f.type === 'directory');

  // Breadcrumbs path
  const getBreadcrumbs = (folderId: string): Array<{ id: string; name: string }> => {
    const list: Array<{ id: string; name: string }> = [];
    let current = files.find(f => f.id === folderId);
    while (current) {
      list.unshift({ id: current.id, name: current.name });
      current = files.find(f => f.id === current?.parentId);
    }
    list.unshift({ id: 'root', name: 'Archivos' });
    return list;
  };

  const breadcrumbs = getBreadcrumbs(currentFolderId);

  // Size formatter
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to determine if a file is editable text
  const isEditable = (file: VirtualFile): boolean => {
    const name = file.name.toLowerCase();
    const mime = file.mimeType || '';
    return (
      mime.startsWith('text/') || 
      name.endsWith('.html') || 
      name.endsWith('.css') || 
      name.endsWith('.js') || 
      name.endsWith('.json') || 
      name.endsWith('.md') ||
      name.endsWith('.txt')
    );
  };

  const isImage = (file: VirtualFile): boolean => {
    return file.mimeType?.startsWith('image/') || false;
  };

  // File type icons
  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'directory') {
      return <Folder className="w-10 h-10 text-yellow-500 fill-yellow-200" />;
    }
    const name = file.name.toLowerCase();
    if (isImage(file)) {
      if (file.content) {
        return (
          <img 
            src={file.content} 
            alt={file.name} 
            className="w-10 h-10 object-cover border border-slate-300"
          />
        );
      }
      return <Image className="w-10 h-10 text-blue-500" />;
    }
    if (name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.js')) {
      return <FileCode className="w-10 h-10 text-indigo-500" />;
    }
    if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.rar')) {
      return <FileArchive className="w-10 h-10 text-orange-500" />;
    }
    return <FileText className="w-10 h-10 text-slate-500" />;
  };

  // Actions
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const id = `dir-${Date.now()}`;
    const newDir: VirtualFile = {
      id,
      name: newFolderName.trim(),
      type: 'directory',
      size: 0,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'files', id), newDir);
      setFiles(prev => [...prev, newDir]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Error al crear la carpeta');
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const id = `file-${Date.now()}`;
    const newFile: VirtualFile = {
      id,
      name: newFileName.trim(),
      type: 'file',
      mimeType: 'text/html', // Default to html
      size: 0,
      parentId: currentFolderId,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'files', id), newFile);
      setFiles(prev => [...prev, newFile]);
      setNewFileName('');
      setShowNewFileModal(false);
      // Open editor immediately
      setEditingFile(newFile);
      setEditorContent('');
    } catch (err) {
      console.error('Error creating file:', err);
      alert('Error al crear el archivo');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert('El tamaño máximo permitido para archivos en base de datos es de 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const id = `file-${Date.now()}`;
        const newFile: VirtualFile = {
          id,
          name: file.name,
          type: 'file',
          mimeType: file.type,
          size: file.size,
          parentId: currentFolderId,
          content: reader.result as string, // base64 Data URL
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'files', id), newFile);
          setFiles(prev => [...prev, newFile]);
        } catch (err) {
          console.error('Error uploading file:', err);
          alert('Error al subir el archivo');
        }
      };
      if (file.type.startsWith('text/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveEditor = async () => {
    if (!editingFile) return;
    try {
      const updated: VirtualFile = {
        ...editingFile,
        content: editorContent,
        size: new Blob([editorContent]).size,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'files', editingFile.id), updated);
      setFiles(prev => prev.map(f => f.id === editingFile.id ? updated : f));
      setEditingFile(null);
    } catch (err) {
      console.error('Error saving file:', err);
      alert('Error al guardar el archivo');
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingItem || !renameName.trim()) return;

    try {
      const updated: VirtualFile = {
        ...renamingItem,
        name: renameName.trim(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'files', renamingItem.id), updated);
      setFiles(prev => prev.map(f => f.id === renamingItem.id ? updated : f));
      setRenamingItem(null);
    } catch (err) {
      console.error('Error renaming file:', err);
      alert('Error al renombrar');
    }
  };

  const handleDeleteItem = async (item: VirtualFile) => {
    // Check if it's a directory and has files inside
    if (item.type === 'directory') {
      const children = files.filter(f => f.parentId === item.id);
      if (children.length > 0) {
        if (!confirm(`La carpeta "${item.name}" contiene ${children.length} archivos. ¿Deseas eliminarla junto con todo su contenido?`)) {
          return;
        }
        // Recursively delete children
        try {
          for (const child of children) {
            await deleteDoc(doc(db, 'files', child.id));
          }
        } catch (err) {
          console.error('Error deleting sub-items:', err);
        }
      } else {
        if (!confirm(`¿Eliminar la carpeta "${item.name}"?`)) return;
      }
    } else {
      if (!confirm(`¿Eliminar el archivo "${item.name}"?`)) return;
    }

    try {
      await deleteDoc(doc(db, 'files', item.id));
      // Remove from local state
      const deleteIds = new Set([item.id]);
      if (item.type === 'directory') {
        const collectChildren = (dirId: string) => {
          files.filter(f => f.parentId === dirId).forEach(f => {
            deleteIds.add(f.id);
            if (f.type === 'directory') collectChildren(f.id);
          });
        };
        collectChildren(item.id);
      }
      setFiles(prev => prev.filter(f => !deleteIds.has(f.id)));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error al eliminar');
    }
  };

  const handleDownload = (file: VirtualFile) => {
    if (!file.content) return;
    const element = document.createElement('a');
    let fileUrl = file.content;
    
    // If it's raw text content, turn it into blob
    if (!file.content.startsWith('data:')) {
      const blob = new Blob([file.content], { type: file.mimeType || 'text/plain' });
      fileUrl = URL.createObjectURL(blob);
    }
    
    element.href = fileUrl;
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyPath = (file: VirtualFile) => {
    if (!file.content) return;
    // Copy the raw base64 contents (or text content)
    navigator.clipboard.writeText(file.content);
    setCopiedFileId(file.id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  const handleItemClick = (item: VirtualFile) => {
    if (item.type === 'directory') {
      setCurrentFolderId(item.id);
    } else {
      // File clicked
      if (isEditable(item)) {
        setEditingFile(item);
        setEditorContent(item.content || '');
      } else {
        setPreviewFile(item);
      }
    }
  };

  return (
    <div className="bg-white border-4 border-slate-900 shadow-[6px_6px_0_0_#000] p-6 w-full min-h-[500px] flex flex-col font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-2 border-slate-200 mb-6">
        <div>
          <h3 className="text-base font-bold text-[#0d1b2e] uppercase tracking-wider flex items-center gap-2">
            <Folder className="w-5 h-5 text-yellow-500 fill-yellow-250" />
            Explorador de Archivos
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sube imágenes, recursos y edita archivos de texto</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-[#2ec4b6] hover:bg-[#20a396] text-white border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Subir Archivo
          </button>

          <button
            onClick={() => setShowNewFolderModal(true)}
            className="px-3 py-2 bg-[#ffe66d] hover:bg-[#ffd166] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Carpeta
          </button>

          <button
            onClick={() => setShowNewFileModal(true)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo Código
          </button>

          <div className="flex border-2 border-slate-900 shadow-[2px_2px_0_0_#000] ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-[#a3b8cc] text-[#0d1b2e]' : 'bg-white text-slate-400'}`}
              title="Vista Grilla"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-[#a3b8cc] text-[#0d1b2e]' : 'bg-white text-slate-400'}`}
              title="Vista Detalles"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main split area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar directory tree */}
        <aside className="w-full md:w-48 bg-slate-50 border-2 border-slate-200 p-4 rounded text-xs font-semibold space-y-2 shrink-0 max-h-[450px] overflow-y-auto">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 border-b pb-1">Carpetas</div>
          <button
            onClick={() => setCurrentFolderId('root')}
            className={`w-full text-left px-2 py-1.5 flex items-center gap-2 rounded transition-all cursor-pointer ${currentFolderId === 'root' ? 'bg-[#001F4A]/10 text-[#001F4A]' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Folder className="w-4 h-4 text-yellow-500 fill-yellow-250" />
            <span>Raíz (root)</span>
          </button>

          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setCurrentFolderId(folder.id)}
              className={`w-full text-left px-2 py-1.5 flex items-center gap-2 rounded transition-all pl-4 cursor-pointer truncate ${currentFolderId === folder.id ? 'bg-[#001F4A]/10 text-[#001F4A]' : 'hover:bg-slate-100 text-slate-600'}`}
              title={folder.name}
            >
              <Folder className="w-4 h-4 text-yellow-500 fill-yellow-200" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </aside>

        {/* Directory Explorer area */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Breadcrumbs and search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-wrap">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-350" />}
                  <button 
                    onClick={() => setCurrentFolderId(crumb.id)}
                    className={`hover:text-slate-800 transition-colors cursor-pointer ${crumb.id === currentFolderId ? 'text-slate-900 font-extrabold' : ''}`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-48 text-xs font-semibold">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar archivos..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900"
              />
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="flex-1 border-2 border-slate-100 rounded p-4 min-h-[300px] bg-slate-50/50">
              {filteredItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-12">
                  Esta carpeta está vacía.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id}
                      className="group bg-white border-2 border-slate-200 hover:border-slate-900 rounded p-3 flex flex-col items-center justify-between text-center relative hover:shadow-[3px_3px_0_0_#0d1b2e] transition-all cursor-pointer min-h-[120px]"
                      onClick={() => handleItemClick(item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                    >
                      <div className="flex-1 flex items-center justify-center mb-2">
                        {getFileIcon(item)}
                      </div>
                      
                      <span className="font-bold text-[10px] text-slate-800 break-all truncate max-w-full block" title={item.name}>
                        {item.name}
                      </span>
                      
                      {item.type === 'file' && (
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                          {formatBytes(item.size)}
                        </span>
                      )}

                      {/* Dropdown Options Hover */}
                      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameName(item.name);
                            setRenamingItem(item);
                          }}
                          className="p-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-550 rounded"
                          title="Renombrar"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {item.type === 'file' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPath(item);
                            }}
                            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-550 rounded"
                            title="Copiar ruta/base64"
                          >
                            {copiedFileId === item.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item);
                          }}
                          className="p-1 bg-white hover:bg-red-50 border border-slate-300 text-red-500 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="flex-1 border-2 border-slate-100 rounded overflow-hidden min-h-[300px] bg-white">
              {filteredItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-12">
                  Esta carpeta está vacía.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs font-semibold">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[9px] bg-slate-50">
                        <th className="p-3">Nombre</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Tamaño</th>
                        <th className="p-3">Modificado</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(item => (
                        <tr 
                          key={item.id} 
                          className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                          onClick={() => handleItemClick(item)}
                          onContextMenu={(e) => handleContextMenu(e, item)}
                        >
                          <td className="p-3 flex items-center gap-2">
                            <span className="shrink-0">{getFileIcon(item)}</span>
                            <span className="font-bold text-slate-800 break-all">{item.name}</span>
                          </td>
                          <td className="p-3 text-slate-500">
                            {item.type === 'directory' ? 'Carpeta' : (item.mimeType || 'Archivo')}
                          </td>
                          <td className="p-3 text-slate-500">
                            {item.type === 'file' ? formatBytes(item.size) : '--'}
                          </td>
                          <td className="p-3 text-slate-400 text-[10px]">
                            {new Date(item.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {item.type === 'file' && (
                                <>
                                  <button
                                    onClick={() => handleDownload(item)}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                    title="Descargar archivo"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCopyPath(item)}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                    title="Copiar contenido base64"
                                  >
                                    {copiedFileId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setRenameName(item.name);
                                  setRenamingItem(item);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                title="Renombrar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="p-1 hover:bg-red-50 rounded text-red-500"
                                title="Eliminar"
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
            </div>
          )}
        </div>
      </div>

      {/* NEW FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 shadow-[6px_6px_0_0_#000] w-full max-w-sm p-5 text-xs font-semibold">
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-yellow-500 fill-yellow-250" /> Nueva Carpeta
            </h4>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Nombre de la Carpeta *</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="ej. ImagenesClases"
                  className="w-full p-2 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#ffe66d] hover:bg-[#ffd166] text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] cursor-pointer"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW FILE MODAL */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 shadow-[6px_6px_0_0_#000] w-full max-w-sm p-5 text-xs font-semibold">
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-500" /> Nuevo Archivo de Código
            </h4>
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Nombre del Archivo (con extensión) *</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="ej. index.html, styles.css"
                  className="w-full p-2 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2ec4b6] hover:bg-[#20a396] text-white font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] cursor-pointer"
                >
                  Crear y Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME ITEM MODAL */}
      {renamingItem && (
        <div className="fixed inset-0 bg-[#0d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 shadow-[6px_6px_0_0_#000] w-full max-w-sm p-5 text-xs font-semibold">
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-1.5">
              <Pencil className="w-4 h-4" /> Renombrar Elemento
            </h4>
            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">Nuevo Nombre *</label>
                <input
                  type="text"
                  required
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#001F4A] text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenamingItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#ffe66d] hover:bg-[#ffd166] text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEXT / CODE EDITOR MODAL */}
      {editingFile && (
        <div className="fixed inset-0 bg-[#0d1b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#000] w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="bg-[#001F4A] text-white px-5 py-4 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-[#ffe66d]" />
                <span className="font-pixel text-xs tracking-wider">Editor de Código: {editingFile.name}</span>
              </div>
              <button 
                onClick={() => setEditingFile(null)} 
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Simple Textarea Editor */}
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full p-4 font-mono text-xs bg-[#0f172a] text-[#ffd166] resize-none focus:outline-none leading-relaxed border-0"
                placeholder="Escribe tu código aquí..."
              />
            </div>

            <div className="p-4 border-t-2 border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setEditingFile(null)}
                className="px-4 py-2 border-2 border-slate-400 font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditor}
                className="px-5 py-2 bg-[#2ec4b6] hover:bg-[#20a396] text-white font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer text-xs uppercase"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL (e.g. Images) */}
      {previewFile && (
        <div className="fixed inset-0 bg-[#0d1b2e]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#000] w-full max-w-lg p-5 flex flex-col text-xs font-semibold">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <span className="font-bold text-slate-800 break-all">{previewFile.name}</span>
              <button onClick={() => setPreviewFile(null)} className="text-slate-450 hover:text-slate-950 font-bold cursor-pointer">✕</button>
            </div>

            <div className="flex-1 flex justify-center items-center bg-slate-50 p-6 rounded border border-slate-200 max-h-[350px] overflow-hidden">
              {isImage(previewFile) && previewFile.content ? (
                <img 
                  src={previewFile.content} 
                  alt={previewFile.name} 
                  className="max-w-full max-h-[300px] object-contain rounded border shadow"
                />
              ) : (
                <div className="text-center space-y-4">
                  {getFileIcon(previewFile)}
                  <p className="text-slate-500 font-medium">Este tipo de archivo no soporta previsualización en el navegador.</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-1.5 border-t pt-3 font-semibold text-slate-500 text-[10px]">
              <div>Tipo: <span className="text-slate-800">{previewFile.mimeType || 'Desconocido'}</span></div>
              <div>Tamaño: <span className="text-slate-800">{formatBytes(previewFile.size)}</span></div>
              <div>Subido el: <span className="text-slate-800">{new Date(previewFile.createdAt).toLocaleString('es-ES')}</span></div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  handleCopyPath(previewFile);
                  alert('¡Ruta copiada al portapapeles!');
                }}
                className="flex-1 py-2 bg-[#ffe66d] hover:bg-[#ffd166] text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer text-center text-xs uppercase"
              >
                Copiar base64 URL
              </button>
              <button
                onClick={() => handleDownload(previewFile)}
                className="flex-1 py-2 bg-[#2ec4b6] hover:bg-[#20a396] text-white font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer text-center text-xs uppercase"
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {contextMenu && (
        <div 
          className="fixed bg-white border-3 border-slate-900 shadow-[4px_4px_0_0_#000] z-50 text-xs font-bold text-slate-700 py-1 w-44 rounded flex flex-col"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item.type === 'directory' ? (
            <>
              <button
                onClick={() => {
                  setCurrentFolderId(contextMenu.item.id);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Folder className="w-3.5 h-3.5 text-yellow-500 fill-yellow-250" /> Abrir Carpeta
              </button>
              <button
                onClick={() => {
                  setRenameName(contextMenu.item.name);
                  setRenamingItem(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" /> Renombrar
              </button>
              <hr className="border-slate-200 my-1" />
              <button
                onClick={() => {
                  handleDeleteItem(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-650 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleItemClick(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" /> {isEditable(contextMenu.item) ? 'Editar' : 'Previsualizar'}
              </button>
              {isEditable(contextMenu.item) && (
                <button
                  onClick={() => {
                    setEditingFile(contextMenu.item);
                    setEditorContent(contextMenu.item.content || '');
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" /> Editar Código
                </button>
              )}
              <button
                onClick={() => {
                  handleDownload(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Descargar
              </button>
              <button
                onClick={() => {
                  handleCopyPath(contextMenu.item);
                  alert('¡Vínculo base64 copiado al portapapeles!');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Vínculo
              </button>
              <button
                onClick={() => {
                  setRenameName(contextMenu.item.name);
                  setRenamingItem(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#ffe66d] hover:text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" /> Renombrar
              </button>
              <hr className="border-slate-200 my-1" />
              <button
                onClick={() => {
                  handleDeleteItem(contextMenu.item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-650 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
