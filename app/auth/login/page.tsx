'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Language, t } from '@/lib/constants';
import Header from '@/components/header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('uz');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          credits: 10,
          plan: 'free',
          createdAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('auth.login', language)}</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-muted">{t('auth.email', language)}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-muted">{t('auth.password', language)}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
              {loading ? t('common.loading', language) : t('auth.signin-email', language)}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-text-muted">Or</span>
            </div>
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-3 border border-border bg-surface text-text-main rounded-xl hover:bg-border transition-all flex items-center justify-center gap-2 font-medium">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {t('auth.signin-google', language)}
          </button>

          <p className="mt-8 text-center text-text-muted text-sm">
            {language === 'uz' ? "Hisobingiz yo'qmi?" : language === 'ru' ? "Нет аккаунта?" : "Don't have an account?"}{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              {t('auth.signup', language)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}