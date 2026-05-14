'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Layers, BarChart3, Zap, Globe } from 'lucide-react';
import { Language, t } from '@/lib/constants';

export default function FeaturesSection() {
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

  const featuresList = [
    {
      icon: <FileText size={32} />,
      title: t('features.presentation', language),
      description: t('features.presentation-desc', language),
    },
    {
      icon: <BookOpen size={32} />,
      title: t('features.referat', language),
      description: t('features.referat-desc', language),
    },
    {
      icon: <Layers size={32} />,
      title: t('features.kurs', language),
      description: t('features.kurs-desc', language),
    },
    {
      icon: <Zap size={32} />,
      title: t('features.mustaqil', language),
      description: t('features.mustaqil-desc', language),
    },
    {
      icon: <BarChart3 size={32} />,
      title: t('features.infografika', language),
      description: t('features.infografika-desc', language),
    },
    {
      icon: <Globe size={32} />,
      title: t('features.multilang', language),
      description: t('features.multilang-desc', language),
    },
  ];

  return (
    <section id="features" className="h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Barcha Hujjat Turlari
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Bir platformada professional darajadagi 5 xil hujjat shablonidan foydalaning
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-10 glass-card glass-card-hover rounded-3xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-text-main">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
