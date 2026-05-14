'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Zap, ArrowRight, Play } from 'lucide-react';
import { Language, t } from '@/lib/constants';

export default function HeroSection() {
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

  const stats = [
    { value: '10K+', label: t('hero.stats.docs', language) },
    { value: '30s', label: t('hero.stats.time', language) },
    { value: '3', label: t('hero.stats.langs', language) },
  ];

  return (
    <section className="relative h-screen flex flex-col items-center justify-center pt-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] hero-glow pointer-events-none blur-[120px]" />
      
      {/* Animated Background Shapes */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto px-4 text-center z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-surface/50 border border-border rounded-full text-sm font-medium text-primary backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {t('hero.badge', language)}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tight text-text-main"
        >
          {t('hero.title', language).split(' ').map((word, i) => (
            <span key={i} className={word.toLowerCase().includes('professional') ? 'text-primary' : ''}>
              {word}{' '}
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          {t('hero.subtitle', language)}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
        >
          <button className="px-10 py-5 bg-primary text-white rounded-2xl hover:bg-primary-hover shadow-2xl shadow-primary/30 transition-all font-bold text-xl cursor-pointer flex items-center justify-center gap-2 group">
            {t('hero.cta-primary', language)}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          <button className="px-10 py-5 border border-border bg-surface/50 text-text-main rounded-2xl hover:bg-surface transition-all font-bold text-xl cursor-pointer flex items-center justify-center gap-2">
            <Play size={18} className="text-primary fill-primary" />
            {t('hero.cta-secondary', language)}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-black text-text-main mb-1 tracking-tight">{stat.value}</div>
              <div className="text-text-muted text-sm uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Floating Cards Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative h-48 md:h-64 w-full hidden sm:flex items-center justify-center pointer-events-none"
        >
          {/* PowerPoint Card */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-5, 0, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[5%] lg:left-[15%] transform -translate-x-1/2 top-0 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E72] p-5 rounded-3xl shadow-2xl w-56 z-10 opacity-40 lg:opacity-100"
          >
            <FileText className="text-white mb-3" size={32} />
            <div className="text-white font-bold text-lg">PowerPoint</div>
            <div className="text-white text-xs opacity-90">Prezentatsiya</div>
          </motion.div>

          {/* Word Card */}
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [5, 2, 5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[5%] lg:right-[15%] transform translate-x-1/2 top-12 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] p-5 rounded-3xl shadow-2xl w-56 z-10 opacity-40 lg:opacity-100"
          >
            <FileText className="text-white mb-3" size={32} />
            <div className="text-white font-bold text-lg">Word Documents</div>
            <div className="text-white text-xs opacity-90">Hujjatlar</div>
          </motion.div>

          {/* Infografika Card */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 transform -translate-x-1/2 bottom-0 bg-gradient-to-br from-[#F7B801] to-[#F4A518] p-5 rounded-3xl shadow-2xl w-48 z-20"
          >
            <BarChart3 className="text-white mb-2" size={24} />
            <div className="text-white font-bold text-base">Infographics</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
