'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import PricingSection from '@/components/pricing-section';
import Footer from '@/components/footer';

export default function Home() {
  const { scrollYProgress } = useScroll();
  
  // Skrolga qarab harakatlanadigan chiziqlar uchun transformatsiyalar
  const line1Y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const line2Y = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const line3Y = useTransform(scrollYProgress, [0, 1], ['-20%', '120%']);

  return (
    <main className="relative">
      {/* Background Parallax Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ y: line1Y }}
          className="absolute left-[15%] top-[-50%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/20 to-transparent"
        />
        <motion.div 
          style={{ y: line2Y }}
          className="absolute left-[45%] top-[-50%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-accent/20 to-transparent"
        />
        <motion.div 
          style={{ y: line3Y }}
          className="absolute right-[20%] top-[-50%] w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/10 to-transparent"
        />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
        />
      </div>

      <Header />
      <div className="relative z-10">
        <div className="full-page-section"><HeroSection /></div>
        <div className="full-page-section"><FeaturesSection /></div>
        <div className="full-page-section"><PricingSection /></div>
        <div className="full-page-section"><Footer /></div>
      </div>
    </main>
  );
}
