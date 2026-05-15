'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import { DocumentType, Language, t } from '@/lib/constants';
import { FileText, FileBarChart, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection, query, where, onSnapshot,
  deleteDoc, doc, orderBy,
} from 'firebase/firestore';

interface DocItem {
  id: string;
  title: string;
  type: string;
  language: string;
  status: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: any;
}

type FilterType = 'all' | 'presentation' | 'docx' | 'infografika';

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [language, setLanguage] = useState<Language>('uz');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [topic, setTopic] = useState('');
  const [docType, setDocType] = useState<DocumentType>('referat');
  const [docLanguage, setDocLanguage] = useState<Language>('uz');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getNotesPlaceholder = (lang: Language) => ({
    uz: "Masalan: 5-bob uchun ko'proq misollar qo'shing",
    ru: 'Например: добавьте больше примеров для главы 5',
    en: 'E.g: Add more examples for chapter 5',
  }[lang]);

  // Base64 dan fayl yuklab olish
  const downloadFromBase64 = (base64: string, contentType: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !user) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          type: docType,
          lang: docLanguage,
          userId: user.uid,
          additionalNotes: notes,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      // Faylni avtomatik yuklab olish
      if (data.fileBase64) {
        downloadFromBase64(data.fileBase64, data.contentType, data.fileName);
      }

      setTopic('');
      setNotes('');

    } catch (error: any) {
      alert(
        language === 'uz' ? `Xato: ${error.message}` :
        language === 'ru' ? `Ошибка: ${error.message}` :
        `Error: ${error.message}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (docItem: DocItem) => {
    if (docItem.fileUrl) {
      window.open(docItem.fileUrl, '_blank');
    } else {
      alert(
        language === 'uz' ? 'Fayl topilmadi' :
        language === 'ru' ? 'Файл не найден' : 'File not found'
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      language === 'uz' ? "O'chirilsinmi?" :
      language === 'ru' ? 'Удалить?' : 'Delete?'
    );
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLanguage(saved);
    const handleLangChange = () => {
      const current = localStorage.getItem('language') as Language;
      if (current) setLanguage(current);
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(
          collection(db, 'documents'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const unsubscribeDocs = onSnapshot(q, (snapshot) => {
          setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DocItem)));
        });
        return () => unsubscribeDocs();
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  if (!mounted) return null;

  const filteredDocuments = documents.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'presentation') return d.type === 'presentation';
    if (filter === 'docx') return ['referat', 'kurs_ishi', 'mustaqil_talim'].includes(d.type);
    if (filter === 'infografika') return d.type === 'infografika';
    return true;
  });

  const getIcon = (type: string) => {
    if (type === 'presentation') return <FileBarChart className="text-orange-500" />;
    if (type === 'infografika') return <ImageIcon className="text-green-500" />;
    return <FileText className="text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ready: 'text-green-400 bg-green-400/10',
      generating: 'text-yellow-400 bg-yellow-400/10',
      failed: 'text-red-400 bg-red-400/10',
    };
    const labels: Record<string, string> = {
      ready: '✓ Tayyor',
      generating: '⏳ Yaratilmoqda',
      failed: '✗ Xato',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">{t('dashboard.title', language)}</h2>
                <div className="space-y-1 text-sm">
                  {[
                    { key: 'all', label: t('dashboard.filter_all', language) },
                    { key: 'presentation', label: t('dashboard.filter_pptx', language) },
                    { key: 'docx', label: t('dashboard.filter_docx', language) },
                    { key: 'infografika', label: t('dashboard.filter_png', language) },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setFilter(item.key as FilterType)}
                      className={`p-2 rounded cursor-pointer transition ${
                        filter === item.key
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-text-secondary hover:bg-background/50'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-3">
              {/* Create Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 mb-8 text-white"
              >
                <h2 className="text-3xl font-bold mb-2">{t('dashboard.new-doc', language)}</h2>
                <p className="mb-6 opacity-80 text-sm">{t('hero.subtitle', language)}</p>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dashboard.topic', language)}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('dashboard.topic-placeholder', language)}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('dashboard.type', language)}</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as DocumentType)}
                        className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none"
                      >
                        <option value="referat">{t('features.referat', language)}</option>
                        <option value="kurs_ishi">{t('features.kurs', language)}</option>
                        <option value="mustaqil_talim">{t('features.mustaqil', language)}</option>
                        <option value="presentation">{t('features.presentation', language)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('dashboard.language', language)}</label>
                      <select
                        value={docLanguage}
                        onChange={(e) => setDocLanguage(e.target.value as Language)}
                        className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none"
                      >
                        <option value="uz">O'zbek</option>
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dashboard.notes', language)}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={getNotesPlaceholder(language)}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none resize-none h-20 placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || !topic}
                    className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                        />
                        {t('common.loading', language)}
                      </>
                    ) : t('dashboard.create', language)}
                  </button>
                </form>
              </motion.div>

              {/* Documents List */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-2xl font-bold mb-4">{t('dashboard.history', language)}</h3>

                {filteredDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDocuments.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-background rounded-lg group-hover:bg-primary/5 transition">
                            {getIcon(docItem.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-text-main">{docItem.title}</h4>
                              {getStatusBadge(docItem.status)}
                            </div>
                            <p className="text-xs text-text-muted uppercase tracking-wider">
                              {docItem.type} • {docItem.language}
                              {docItem.fileSize ? ` • ${(docItem.fileSize / 1024).toFixed(0)} KB` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDownload(docItem)}
                            disabled={!docItem.fileUrl}
                            title={t('common.download', language)}
                            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-background transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(docItem.id)}
                            title={t('common.delete', language)}
                            className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-background transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-secondary">
                    <FileText size={40} className="mx-auto mb-4 opacity-30" />
                    <p>
                      {language === 'uz' ? "Hujjatlar yo'q. Yuqoridan yangi hujjat yarating!" :
                       language === 'ru' ? 'Нет документов. Создайте новый выше!' :
                       'No documents yet. Create one above!'}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}