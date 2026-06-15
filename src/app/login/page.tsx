'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next') || '/';

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Email/Password Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        router.push(nextPath);
      } else {
        setIsLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router, nextPath]);

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
      // `onAuthStateChanged` will handle the redirect
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code !== 'auth/cancelled-popup-request' && err.code !== 'auth/popup-closed-by-user') {
        console.error('Login error:', err);
        setAuthError('Failed to login with Google.');
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUp && password !== confirmPassword) {
      setAuthError("Passwords don't match.");
      return;
    }
    
    setIsAuthProcessing(true);
    setAuthError(null);
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Create initial user doc
        await setDoc(doc(db, 'users', userCred.user.uid), {
          isPremium: false,
          premiumExpiry: null,
          email: email,
          totalFetches: 0,
          totalDownloads: 0,
          totalPayments: 0,
          totalSpent: 0,
          paymentHistory: [],
          stats: {
            instagram: {
              single: { fetches: 0, downloads: 0 },
              multi: { fetches: 0, downloads: 0 }
            },
            youtube: {
              single: { fetches: 0, downloads: 0 },
              multi: { fetches: 0, downloads: 0 }
            }
          }
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // `onAuthStateChanged` will handle the redirect
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Email is already registered. Please sign in.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || 'Authentication failed.');
      }
    } finally {
      setIsAuthProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 mt-12 mb-12">
        <div className="w-full max-w-4xl text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            {isSignUp 
              ? 'Join us to get unrestricted access and manage your downloads.'
              : 'Login to your account to continue and manage your downloads.'}
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          {isLoadingAuth ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="p-8 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                {isSignUp ? 'Fill in your details below.' : 'Enter your email and password.'}
              </p>
              
              {authError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs rounded-lg text-left">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                {isSignUp && (
                  <div>
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isSignUp}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isAuthProcessing || !email || !password || (isSignUp && !confirmPassword)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAuthProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-zinc-900 px-2 text-neutral-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-neutral-700 rounded-button font-bold flex items-center justify-center gap-3 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button 
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
