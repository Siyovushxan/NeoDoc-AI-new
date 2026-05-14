'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Firebase authentication
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-2">Kirish</h1>
            <p className="text-text-secondary mb-8">Akkauntiga kirish uchun email va parolni kiriting</p>

            {error && <div className="mb-4 p-4 bg-error bg-opacity-10 text-error rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-text-secondary" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-text-secondary" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-bold disabled:opacity-50"
              >
                {loading ? 'Yuklanmoqda...' : 'Kirish'}
              </button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">yoki</span>
                </div>
              </div>

              <button className="w-full py-3 border border-border rounded-lg hover:bg-surface transition font-medium">
                Google orqali kirish
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-text-secondary">
              Akkaunt yo'qmi?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary-dark transition font-medium">
                Ro'yxatdan o'ting
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
