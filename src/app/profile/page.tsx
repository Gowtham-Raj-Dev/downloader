'use client';

import { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, LogOut, CheckCircle2, AlertCircle, Clock, Zap, DownloadCloud, Search, BarChart3 } from 'lucide-react';

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.72.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

interface PaymentRecord {
  amount: number;
  date: number;
}

interface UserData {
  isPremium: boolean;
  premiumExpiry: number | null;
  email: string;
  totalPayments?: number;
  totalSpent?: number;
  paymentHistory?: PaymentRecord[];
  totalFetches?: number;
  totalDownloads?: number;
  stats?: {
    instagram?: {
      single?: { fetches?: number; downloads?: number };
      multi?: { fetches?: number; downloads?: number };
    };
    youtube?: {
      single?: { fetches?: number; downloads?: number };
      multi?: { fetches?: number; downloads?: number };
    };
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          // Auto-expire in DB if loaded and already expired
          if (data.isPremium && data.premiumExpiry && data.premiumExpiry < Date.now()) {
            await updateDoc(userRef, { isPremium: false });
            data.isPremium = false;
          }
          setUserData(data);
        } else {
          // New user, create document
          const newUserData: UserData = {
            isPremium: false,
            premiumExpiry: null,
            email: currentUser.email || '',
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
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Timer for Expiry
  useEffect(() => {
    if (!userData?.isPremium || !userData.premiumExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = userData.premiumExpiry! - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        setUserData(prev => prev ? { ...prev, isPremium: false } : null);
        clearInterval(interval);
        
        // Auto update in Firestore
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          updateDoc(userRef, { isPremium: false }).catch(console.error);
        }
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  const handlePaymentSuccess = async () => {
    if (!user) return;
    
    // Payment verified via backend HMAC, now update Firestore locally
    const expiryDate = Date.now() + 3 * 60 * 60 * 1000; // 3 hours pass
    const userRef = doc(db, 'users', user.uid);
    const amountPaid = 10;
    
    await updateDoc(userRef, {
      isPremium: true,
      premiumExpiry: expiryDate,
      totalPayments: increment(1),
      totalSpent: increment(amountPaid),
      lastPaymentDate: Date.now(),
      paymentHistory: arrayUnion({
        date: Date.now(),
        amount: amountPaid
      })
    });

    setUserData(prev => prev ? { 
      ...prev, 
      isPremium: true, 
      premiumExpiry: expiryDate,
      totalPayments: (prev.totalPayments || 0) + 1,
      totalSpent: (prev.totalSpent || 0) + amountPaid,
      paymentHistory: [...(prev.paymentHistory || []), { date: Date.now(), amount: amountPaid }]
    } : null);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 mt-6 md:mt-12 mb-8 md:mb-12">
        <div className="w-full max-w-4xl text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
            Your Profile Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            Manage your account, track your VIP status, and view your real-time analytics.
          </p>
        </div>

        {/* Main Dashboard Layout */}
        <div className="w-full max-w-6xl mx-auto">
          {isLoadingAuth ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : !user ? (
            <div className="p-8 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Please sign in to view your profile and manage your VIP pass.
              </p>
              <button
                onClick={() => router.push('/login?next=/profile')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Go to Login Page
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Custom Success Modal */}
              {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                  <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Payment Successful!</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                      Your VIP Pass is now active. You have full access to batch downloading and premium servers.
                    </p>
                    <button 
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full py-3 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold rounded-xl transition-colors"
                    >
                      Awesome, let&apos;s go!
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Logout Modal */}
              {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                  <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LogOut className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Confirm Logout</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                      Are you sure you want to log out of your profile? You will need to sign in again to access VIP features.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          signOut(auth);
                          router.push('/');
                        }}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Left Column: Profile & Subscription */}
              <div className="w-full lg:w-[380px] xl:w-[400px] shrink-0 space-y-6 lg:sticky lg:top-24">
                {/* User Profile Card */}
                <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                        {user.email?.[0].toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-neutral-900 dark:text-white truncate max-w-[180px] sm:max-w-[220px] lg:max-w-[180px]">
                          {user.email?.split('@')[0]}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[180px] sm:max-w-[220px] lg:max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="p-2.5 bg-neutral-50 dark:bg-zinc-950 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer shadow-sm"
                      title="Log out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status Section */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
                    {userData?.isPremium && userData.premiumExpiry && userData.premiumExpiry > Date.now() ? (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-5">
                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-3">
                          <Zap className="w-5 h-5 fill-current" />
                          <span>VIP Pass Active</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">Time Remaining:</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {timeLeft || 'Calculating...'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 mb-6 text-left">
                        <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-bold mb-2">
                          <AlertCircle className="w-5 h-5 text-neutral-400" />
                          <span>No Active VIP Pass</span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                          Upgrade now to unlock batch downloading and high-speed servers.
                        </p>
                        <RazorpayCheckout 
                          userEmail={user.email || ''} 
                          onSuccess={handlePaymentSuccess} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Stats */}
                  {userData?.totalPayments ? (
                    <div className="mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-6">
                      <div className="grid grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-neutral-50 dark:bg-zinc-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Total Payments</p>
                          <p className="text-xl sm:text-2xl font-black text-neutral-800 dark:text-neutral-200">{userData.totalPayments}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                          <p className="text-[10px] sm:text-xs text-green-600/70 dark:text-green-500/70 uppercase tracking-wider font-bold mb-1">Total Spent</p>
                          <p className="text-xl sm:text-2xl font-black text-green-600 dark:text-green-400">₹{userData.totalSpent}</p>
                        </div>
                      </div>
                      
                      {userData.paymentHistory && userData.paymentHistory.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            Payment History
                          </h4>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {[...userData.paymentHistory].reverse().map((payment, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-xl text-sm border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                    <Zap className="w-4 h-4 fill-current" />
                                  </div>
                                  <div className="font-medium text-neutral-700 dark:text-neutral-300">
                                    {new Date(payment.date).toLocaleDateString('en-IN', {
                                      day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                  </div>
                                </div>
                                <div className="font-bold text-green-600 dark:text-green-400 text-base">
                                  ₹{payment.amount}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Right Column: Real-time Analytics Dashboard */}
              <div className="flex-1 w-full flex flex-col gap-6">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-neutral-900 to-black border border-neutral-800 shadow-2xl flex items-center justify-between">
                  {/* Glowing background effect */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Live Analytics</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Real-time Data Sync</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Fetches */}
                  <div className="relative p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden group">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Search className="w-32 h-32 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Total Links Fetched</h4>
                      <p className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
                        {userData?.totalFetches || 0}
                      </p>
                    </div>
                  </div>

                  {/* Total Downloads */}
                  <div className="relative p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden group">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <DownloadCloud className="w-32 h-32 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
                        <DownloadCloud className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Videos Saved to Device</h4>
                      <p className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
                        {userData?.totalDownloads || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Platform Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Instagram Dashboard */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">Instagram</h4>
                    </div>

                    <div className="space-y-6">
                      {/* Single Link */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">Single Links Extracted</span>
                          <span className="font-black text-neutral-900 dark:text-white">{userData?.stats?.instagram?.single?.downloads || 0} Saved</span>
                        </div>
                        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-full" style={{ width: `${Math.min(100, ((userData?.stats?.instagram?.single?.downloads || 0) / Math.max(1, (userData?.totalDownloads || 1))) * 100)}%` }} />
                        </div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase">
                          {userData?.stats?.instagram?.single?.fetches || 0} Total Searches
                        </div>
                      </div>

                      {/* Multi Link */}
                      <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">Multi Links Extracted</span>
                          <span className="font-black text-neutral-900 dark:text-white">{userData?.stats?.instagram?.multi?.downloads || 0} Saved</span>
                        </div>
                        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${Math.min(100, ((userData?.stats?.instagram?.multi?.downloads || 0) / Math.max(1, (userData?.totalDownloads || 1))) * 100)}%` }} />
                        </div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase">
                          {userData?.stats?.instagram?.multi?.fetches || 0} Total Searches
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Dashboard */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">YouTube</h4>
                    </div>

                    <div className="space-y-6">
                      {/* Single Link */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">Single Links Extracted</span>
                          <span className="font-black text-neutral-900 dark:text-white">{userData?.stats?.youtube?.single?.downloads || 0} Saved</span>
                        </div>
                        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, ((userData?.stats?.youtube?.single?.downloads || 0) / Math.max(1, (userData?.totalDownloads || 1))) * 100)}%` }} />
                        </div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase">
                          {userData?.stats?.youtube?.single?.fetches || 0} Total Searches
                        </div>
                      </div>

                      {/* Multi Link */}
                      <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">Multi Links Extracted</span>
                          <span className="font-black text-neutral-900 dark:text-white">{userData?.stats?.youtube?.multi?.downloads || 0} Saved</span>
                        </div>
                        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-rose-600 rounded-full" style={{ width: `${Math.min(100, ((userData?.stats?.youtube?.multi?.downloads || 0) / Math.max(1, (userData?.totalDownloads || 1))) * 100)}%` }} />
                        </div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase">
                          {userData?.stats?.youtube?.multi?.fetches || 0} Total Searches
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
