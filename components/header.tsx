'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { Language, t } from '@/lib/constants';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('uz');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language | null;
    if (saved) setLanguage(saved);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Kreditlarni real vaqtda kuzatish
        return onSnapshot(doc(db, 'users', u.uid), (doc) => {
          if (doc.exists()) setCredits(doc.data().credits);
        });
      } else {
        setCredits(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event('languageChange'));
  };

  if (!mounted) return null;

  const navItems = [
    { key: 'header.features', href: '/#features' },
    { key: 'header.pricing', href: '/#pricing' },
    { key: 'header.docs', href: '/#docs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NeoDoc AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboard && navItems.map((item) => (
              <Link key={item.key} href={item.href} className="text-text-secondary hover:text-text-primary transition">
                {t(item.key, language)}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 border border-border rounded-lg p-2">
              <Globe size={16} className="text-text-secondary" />
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value as Language)} className="bg-transparent border-none outline-none text-sm cursor-pointer">
                <option value="uz">O&apos;z</option>
                <option value="ru">Рус</option>
                <option value="en">Eng</option>
              </select>
            </div>

            {/* Auth/Profile Section */}
            <div className="hidden md:flex items-center gap-4">
              {!isDashboard ? (
                <>
                  <Link href="/auth/login" className="text-text-secondary hover:text-text-primary transition font-medium">
                    {t('header.login', language)}
                  </Link>
                  <Link href="/dashboard" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
                    {t('header.start', language)}
                  </Link>
                </>
              ) : (
                user && (
                  <div className="flex items-center gap-4 border-l border-border pl-4">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-text-primary">{user.displayName || user.email}</p>
                      <p className="text-xs text-primary font-bold">{credits !== null ? credits : '...'} {t('dashboard.credits', language)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" /> : <User size={20} />}
                    </div>
                    <button onClick={() => signOut(auth)} className="text-text-secondary hover:text-error transition">
                      <LogOut size={20} />
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mt-4 space-y-4">
            {!isDashboard && (
              <>
                {navItems.map((item) => (
                  <Link key={item.key} href={item.href} className="block text-text-secondary hover:text-text-primary transition">
                    {t(item.key, language)}
                  </Link>
                ))}
                <Link href="/auth/login" className="block text-text-secondary hover:text-text-primary transition">
                  {t('header.login', language)}
                </Link>
                <Link href="/dashboard" className="block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-center">
                  {t('header.start', language)}
                </Link>
              </>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  );
}
