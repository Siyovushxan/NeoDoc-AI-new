'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Language, t } from '@/lib/constants';

export default function PricingSection() {
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

  const plans = [
    {
      name: 'Bepul',
      price: '$0',
      credits: '10',
      features: [t('dashboard.credits', language) + ': 10', t('header.docs', language), 'Watermark'],
      cta: t('common.view', language),
      highlighted: false,
    },
    {
      name: 'Starter',
      price: '$4.99',
      period: 'bir marta',
      credits: '20',
      features: [t('dashboard.credits', language) + ': 20', t('header.docs', language), 'Watermark'],
      cta: t('pricing.buy', language),
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/oy',
      credits: 'Cheksiz',
      features: [t('dashboard.credits', language) + ': ∞', 'No Watermark', 'Priority'],
      cta: t('pricing.subscribe', language),
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('pricing.title', language)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            {t('pricing.subtitle', language)}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-[32px] overflow-hidden transition-all duration-500 ${
                plan.highlighted ? 'ring-4 ring-primary/20 scale-105 z-10 shadow-3xl shadow-primary/20' : 'bg-surface/40 border border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                  Tavsiya etiladi
                </div>
              )}
              <div className={`p-10 h-full flex flex-col ${plan.highlighted ? 'bg-primary text-white' : ''}`}>
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-sm text-text-secondary">{plan.period}</span>}
                </div>
                <div className={`text-sm mb-10 font-bold ${plan.highlighted ? 'text-white/80' : 'text-primary'}`}>
                  {plan.credits} ta kredit
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <div className={`rounded-full p-1 ${plan.highlighted ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <Check size={14} className={plan.highlighted ? 'text-white' : 'text-primary'} />
                      </div>
                      <span className={plan.highlighted ? 'text-white/90 font-medium' : 'text-text-secondary'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:shadow-xl hover:shadow-white/20'
                      : 'bg-primary text-white hover:bg-primary-hover'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
