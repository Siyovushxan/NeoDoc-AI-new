'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import { Document as AppDocument, DocumentType, Language, t } from '@/lib/constants';
import { FileText, FileBarChart, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, QuerySnapshot, DocumentData } from 'firebase/firestore';

type FilterType = 'all' | 'presentation' | 'docx' | 'infografika';

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [language, setLanguage] = useState<Language>('uz');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Forma holati (state)
  const [topic, setTopic] = useState('');
  const [docType, setDocType] = useState<DocumentType>('referat');
  const [docLanguage, setDocLanguage] = useState<Language>('uz');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Hujjatni o'chirish funksiyasi
  const handleDelete = async (id: string, storagePath?: string) => {
    if (window.confirm(t('common.delete', language) + '?')) {
      try {
        await deleteDoc(doc(db, 'documents', id));
        // Agar storagePath bo'lsa, faylni ham o'chirish
        if (storagePath) {
          await deleteObject(ref(storage, storagePath));
        }
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  // Hujjatni yuklab olish funksiyasi (simulyatsiya)
  const handleDownload = (doc: AppDocument) => {
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert(t('common.error', language));
    }
  };

  // Yangi hujjat yaratish funksiyasi
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !user) return;

    setIsGenerating(true);
    
    try {
      // Firestore'ga yangi zapros yozish
      const docRef = await addDoc(collection(db, 'documents'), {
        userId: user.uid,
        title: topic,
        type: docType,
        language: docLanguage,
        status: 'generating',
        createdAt: serverTimestamp(),
      });

      // API endpointni chaqirish (Hujjatni AI generatsiya qilishi uchun)
      await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ 
          topic, 
          type: docType, 
          lang: docLanguage, 
          userId: user.uid,
          documentId: docRef.id,
          additionalNotes: notes
        })
      });

      setTopic('');
      setNotes('');
    } catch (error) {
      alert(t('common.error', language));
    } finally {
      setIsGenerating(false);
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
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser: FirebaseUser | null) => {
      if (currentUser) {
        setUser(currentUser);
        // Foydalanuvchi hujjatlarini Firestore'dan olish
        const q = query(collection(db, 'documents'), where('userId', '==', currentUser.uid));
        const unsubscribeDocs = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
          const docsData = snapshot.docs.map((snapDoc: any) => ({ 
            id: snapDoc.id, 
            ...snapDoc.data() 
          } as AppDocument));
          setDocuments(docsData);
        });
        return () => unsubscribeDocs();
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  if (!mounted) return null;

  const filteredDocuments = documents.filter((doc: AppDocument) => {
    if (filter === 'all') return true;
    if (filter === 'presentation') return doc.type === 'presentation';
    if (filter === 'docx') return ['referat', 'kurs_ishi', 'mustaqil_talim'].includes(doc.type);
    if (filter === 'infografika') return doc.type === 'infografika';
    return true;
  });

  const getIcon = (type: string) => {
    if (type === 'presentation') return <FileBarChart className="text-orange-500" />;
    if (type === 'infografika') return <ImageIcon className="text-green-500" />;
    return <FileText className="text-blue-500" />;
  };

  // TODO: Add Firebase auth check

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6 text-text-main">{t('dashboard.title', language)}</h2>
                <div className="space-y-2 text-text-secondary text-sm">
                  <div
                    onClick={() => setFilter('all')}
                    className={`p-2 rounded cursor-pointer transition ${
                      filter === 'all' ? 'bg-primary bg-opacity-10 text-primary font-bold' : 'hover:bg-background/50'
                    }`}
                  >
                    {t('dashboard.filter_all', language)}
                  </div>
                  <div
                    onClick={() => setFilter('presentation')}
                    className={`p-2 rounded cursor-pointer transition ${
                      filter === 'presentation' ? 'bg-primary bg-opacity-10 text-primary font-bold' : 'hover:bg-background/50'
                    }`}
                  >
                    {t('dashboard.filter_pptx', language)}
                  </div>
                  <div
                    onClick={() => setFilter('docx')}
                    className={`p-2 rounded cursor-pointer transition ${
                      filter === 'docx' ? 'bg-primary bg-opacity-10 text-primary font-bold' : 'hover:bg-background/50'
                    }`}
                  >
                    {t('dashboard.filter_docx', language)}
                  </div>
                  <div
                    onClick={() => setFilter('infografika')}
                    className={`p-2 rounded cursor-pointer transition ${
                      filter === 'infografika' ? 'bg-primary bg-opacity-10 text-primary font-bold' : 'hover:bg-background/50'
                    }`}
                  >
                    {t('dashboard.filter_png', language)}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Create New Document */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 mb-8 text-white">
                <h2 className="text-3xl font-bold mb-4">{t('dashboard.new-doc', language)}</h2>
                <p className="mb-6">{t('hero.subtitle', language)}</p>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dashboard.topic', language)}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
                      placeholder={t('dashboard.topic-placeholder', language)}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('dashboard.type', language)}</label>
                      <select 
                        value={docType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDocType(e.target.value as DocumentType)}
                        className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="referat">{t('features.referat', language)}</option>
                        <option value="kurs_ishi">{t('features.kurs', language)}</option>
                        <option value="mustaqil_talim">{t('features.mustaqil', language)}</option>
                        <option value="presentation">{t('features.presentation', language)}</option>
                        <option value="infografika">{t('features.infografika', language)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('dashboard.language', language)}</label>
                      <select 
                        value={docLanguage} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDocLanguage(e.target.value as Language)} 
                        className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="uz">O&apos;zbek</option>
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dashboard.notes', language)}</label>
                    <textarea
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                      placeholder={t('dashboard.notes-placeholder', language)}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-500 resize-none h-24"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className={`w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
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
                  <div className="grid grid-cols-1 gap-4">
                    {filteredDocuments.map((doc: AppDocument) => (
                      <div key={doc.id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-background rounded-lg group-hover:bg-primary/5 transition">
                            {getIcon(doc.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-text-main">{doc.title}</h4>
                            <p className="text-xs text-text-muted uppercase tracking-wider">{doc.type} • {doc.language}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDownload(doc)}
                            className="p-2 hover:bg-background rounded-lg text-text-muted hover:text-primary transition" 
                            title={t('common.download', language)}
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id, doc.storagePath)}
                            className="p-2 hover:bg-background rounded-lg text-text-muted hover:text-error transition" 
                            title={t('common.delete', language)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
                    <p>{t('common.loading', language)}</p>
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
