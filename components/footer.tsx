'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Facebook, Twitter, Instagram } from 'lucide-react';
import { Language, t } from '@/lib/constants';

export default function Footer() {
  const [language, setLanguage] = useState<Language>('uz');
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  return (
    <footer className="h-screen flex items-center bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-bold mb-4">NeoDoc AI</h3>
            <p className="text-text-secondary mb-4">
              {t('footer.desc', language)}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-secondary hover:text-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition">
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h4 className="font-bold mb-4">{t('footer.links', language)}</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.privacy', language)}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.terms', language)}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.contact', language)}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.blog', language)}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Product */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="font-bold mb-4">{t('footer.product', language)}</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <Link href="/#features" className="hover:text-primary transition">
                  {t('header.features', language)}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary transition">
                  {t('header.pricing', language)}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.api', language)}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  {t('footer.guide', language)}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h4 className="font-bold mb-4">{t('footer.news', language)}</h4>
            <p className="text-text-secondary text-sm mb-4">{t('footer.news-desc', language)}</p>
            <div className="flex bg-surface rounded-lg overflow-hidden">
              <input type="email" placeholder="Email" className="flex-1 px-4 py-2 bg-transparent outline-none text-sm" />
              <button className="px-4 py-2 bg-primary text-white hover:bg-primary-dark transition">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">© 2026 NeoDoc AI. {t('footer.rights', language)}</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-text-secondary text-sm">
            <a href="#" className="hover:text-primary transition">
              {t('footer.privacy', language)}
            </a>
            <a href="#" className="hover:text-primary transition">
              {t('footer.terms', language)}
            </a>
            <a href="#" className="hover:text-primary transition">
              {t('footer.contact', language)}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
