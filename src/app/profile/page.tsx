'use client';

import { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import ThemeToggle from '@/components/ThemeToggle';
import { Loader2, LogOut, CheckCircle2, AlertCircle, Clock, Zap, DownloadCloud, Search, LayoutDashboard, Home, FileText, ChevronRight, ArrowUpDown, Download, Menu, X } from 'lucide-react';

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.72.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" /></svg>
);

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.433 2.979 7.433 6.959 0 4.156-2.618 7.501-6.257 7.501-1.222 0-2.371-.635-2.763-1.383l-.752 2.866c-.272 1.043-1.015 2.345-1.512 3.138 1.171.361 2.428.556 3.722.556 6.621 0 11.988-5.367 11.988-11.987C24.017 5.367 18.638 0 12.017 0z"/>
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
    pinterest?: {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState(3);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const res = await fetch('/api/limits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check', isLoggedIn: true })
        });
        const data = await res.json();
        if (data && data.success) {
          setDailyCount(data.count);
        } else {
          const today = new Date().toISOString().split('T')[0];
          setDailyCount(parseInt(localStorage.getItem(`daily_downloads_${today}`) || '0'));
        }
      } catch (e) {
        console.error("Error fetching limits:", e);
        const today = new Date().toISOString().split('T')[0];
        setDailyCount(parseInt(localStorage.getItem(`daily_downloads_${today}`) || '0'));
      }
    };
    fetchLimits();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          if (data.isPremium && data.premiumExpiry && data.premiumExpiry < Date.now()) {
            await updateDoc(userRef, { isPremium: false });
            data.isPremium = false;
          }
          setUserData(data);
        } else {
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

  useEffect(() => {
    if (!userData?.isPremium || !userData.premiumExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = userData.premiumExpiry! - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        setUserData(prev => prev ? { ...prev, isPremium: false } : null);
        clearInterval(interval);

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

  const handlePaymentSuccess = async (days: number, amount: number) => {
    if (!user) return;

    const expiryDate = Date.now() + days * 24 * 60 * 60 * 1000;
    const userRef = doc(db, 'users', user.uid);
    const amountPaid = amount;

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

  const platformsData = [
    {
      id: 'instagram',
      name: 'Instagram Downloader',
      type: 'Single & Batch Links',
      desc: 'Reels, Posts, IGTV downloading tool.',
      searches: (userData?.stats?.instagram?.single?.fetches || 0) + (userData?.stats?.instagram?.multi?.fetches || 0),
      saved: (userData?.stats?.instagram?.single?.downloads || 0) + (userData?.stats?.instagram?.multi?.downloads || 0),
      status: 'Enabled',
      icon: <Instagram className="w-6 h-6" />,
      bg: 'bg-gradient-to-tr from-purple-500 to-orange-500'
    },
    {
      id: 'youtube',
      name: 'YouTube Downloader',
      type: 'Single & Batch Links',
      desc: 'Shorts and high quality video tool.',
      searches: (userData?.stats?.youtube?.single?.fetches || 0) + (userData?.stats?.youtube?.multi?.fetches || 0),
      saved: (userData?.stats?.youtube?.single?.downloads || 0) + (userData?.stats?.youtube?.multi?.downloads || 0),
      status: 'Enabled',
      icon: <Youtube className="w-6 h-6" />,
      bg: 'bg-red-600'
    },
    {
      id: 'pinterest',
      name: 'Pinterest Downloader',
      type: 'Video & Image Links',
      desc: 'Pins downloader tool.',
      searches: (userData?.stats?.pinterest?.single?.fetches || 0) + (userData?.stats?.pinterest?.multi?.fetches || 0),
      saved: (userData?.stats?.pinterest?.single?.downloads || 0) + (userData?.stats?.pinterest?.multi?.downloads || 0),
      status: 'Enabled',
      icon: <PinterestIcon className="w-6 h-6" />,
      bg: 'bg-[#E60023]'
    }
  ];

  const filteredPlatforms = platformsData
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'desc' ? b.saved - a.saved : a.saved - b.saved);

  const handleExport = () => {
    const headers = ['Platform', 'Type', 'Searches', 'Saved', 'Status'];
    const rows = filteredPlatforms.map(p => `${p.name},${p.type},${p.searches},${p.saved},${p.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'downloader_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="p-8 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Login Required</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Please sign in to view your profile and manage your VIP pass.
          </p>
          <button
            onClick={() => router.push('/login?next=/profile')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (DARK THEME) */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-[280px] shrink-0 bg-[#09090b] text-neutral-300 flex flex-col z-50 shadow-2xl lg:shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-neutral-800`}>

        {/* LOGO AREA */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Download className="w-4 h-4" />
            </div>
            <h1 className="text-[17px] font-extrabold text-white tracking-wide">Downloader</h1>
          </Link>
          <button 
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">

          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3 px-3">Main Menu</h3>
            <div className="space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Home className="w-[18px] h-[18px]" /> Home Page
              </Link>
              <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white bg-indigo-600/10 font-bold rounded-lg transition-colors border border-indigo-500/20">
                <LayoutDashboard className="w-[18px] h-[18px] text-indigo-400" /> Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3 px-3">Your Apps / Tools</h3>
            <div className="space-y-1">
              <Link href="/instagram" className="flex items-center justify-between px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>Insta Downloader</span>
                </div>
              </Link>
              <Link href="/youtube" className="flex items-center justify-between px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Youtube className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>YT Downloader</span>
                </div>
              </Link>
              <Link href="/youtube/description-extractor" className="flex items-center justify-between px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>YT Description</span>
                </div>
              </Link>
              <Link href="/pinterest" className="flex items-center justify-between px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#E60023] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <PinterestIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>Pinterest Downloader</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* SIDEBAR FOOTER (UPGRADE & USER) */}
        <div className="p-4 space-y-4 shrink-0">

          {/* Upgrade Card matching the green "You're on Free Plan" box in reference image */}
          {userData?.isPremium ? (
            <div className="bg-[#18181b] border border-indigo-500/30 p-4 rounded-xl relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <h4 className="text-white text-[13px] font-bold flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" /> VIP Pass Active
              </h4>
              <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">You have full unlimited access to all features.</p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-indigo-300 bg-white/5 py-1.5 px-2 rounded-lg border border-white/5">
                <Clock className="w-3 h-3" /> {timeLeft}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-[#059669]/30 p-4 rounded-xl relative overflow-hidden shadow-[0_0_20px_rgba(5,150,105,0.15)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h4 className="text-white text-[13px] font-bold mb-1">You&apos;re on Free Plan</h4>
                <p className="text-[11px] text-emerald-100/70 mb-3 leading-relaxed">Unlock unlimited access to all features and high-speed servers.</p>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full py-2 bg-white text-[#064e3b] font-bold text-xs rounded-lg hover:bg-neutral-100 transition-all shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Explore Now 🚀
                </button>
              </div>
            </div>
          )}

          {/* User Profile Mini */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setShowLogoutModal(true)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="w-32">
                <p className="text-sm font-bold text-white truncate leading-tight">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-neutral-500 truncate mt-0.5">Logout account</p>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-neutral-500" />
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">

        {/* TOP NAVBAR */}
        <header className="h-16 shrink-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Profile Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="hidden sm:flex px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors items-center gap-2">
              Explore Tools
            </Link>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* PROMO BANNER (Matches "Creators have gained..." banner) */}
            <div className="bg-[#f3f0ff] dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-16 h-12 bg-white dark:bg-black rounded-xl shadow-sm items-center justify-center gap-1.5 border border-purple-100 dark:border-purple-900/50">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  <span className="w-3 h-3 bg-pink-500 rounded-sm"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>
                </div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
                  You have successfully fetched <strong className="text-purple-700 dark:text-purple-400 font-bold">{userData?.totalFetches || 0} links</strong> and saved <strong className="text-purple-700 dark:text-purple-400 font-bold">{userData?.totalDownloads || 0} media files</strong> to your device! 🚀
                </p>
              </div>
              <Link href="/" className="shrink-0 text-sm font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1 transition-colors">
                See how <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* TAB-LIKE HEADER (Automations (4) | Settings) */}
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-px">
              <button className="px-4 py-2 border-b-2 border-neutral-900 dark:border-white text-sm font-bold text-neutral-900 dark:text-white">
                Analytics Stats
              </button>
            </div>

            {/* PLAN DETAILS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                 <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Current Plan <AlertCircle className="w-3 h-3 inline text-neutral-400 ml-1" /></h4>
                 {userData?.isPremium ? (
                   <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Zap className="w-6 h-6 fill-indigo-400 text-indigo-400" /> VIP Premium</span>
                 ) : (
                   <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">Free Plan</span>
                 )}
                 <p className="text-sm text-neutral-500 mt-3 font-medium">
                   {userData?.isPremium ? `Expires on ${new Date(userData.premiumExpiry || 0).toLocaleDateString()}` : "Upgrade to unlock unlimited features & batch."}
                 </p>
               </div>

               <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                 <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Daily Quota Usage <Clock className="w-3 h-3 inline text-neutral-400 ml-1" /></h4>
                 {userData?.isPremium ? (
                   <div className="mt-1">
                     <span className="text-3xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                       ∞ Unlimited
                     </span>
                     <p className="text-sm text-neutral-500 mt-3 font-medium">You have no daily download limits.</p>
                   </div>
                 ) : (
                   <div className="mt-1">
                     <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-neutral-900 dark:text-white">{dailyCount}</span>
                       <span className="text-lg font-bold text-neutral-400">/ 10</span>
                     </div>
                     <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 mt-3 overflow-hidden">
                       <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((dailyCount / 10) * 100, 100)}%` }}></div>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            {/* STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 */}
              <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">TOTAL FETCHES <AlertCircle className="w-3 h-3 inline text-neutral-300 ml-1" /></h4>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-neutral-900 dark:text-white">{userData?.totalFetches || 0}</span>
                  <div className="w-full h-12 mt-4 opacity-50">
                    {/* Simulated graph line matching the image */}
                    <svg viewBox="0 0 100 20" className="w-full h-full preserve-aspect-ratio-none">
                      <path d="M0,20 L100,5" stroke="#10b981" strokeWidth="2" fill="none" />
                      <path d="M0,20 L100,5 L100,20 Z" fill="url(#grad-green)" />
                      <defs>
                        <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#faf5ff] dark:bg-[#1a1423] border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <DownloadCloud className="w-4 h-4 text-purple-400" />
                  <h4 className="text-[11px] font-bold text-purple-500 uppercase tracking-wider">TOTAL DOWNLOADS <AlertCircle className="w-3 h-3 inline text-purple-300 ml-1" /></h4>
                </div>
                <span className="text-4xl font-black text-purple-900 dark:text-purple-100">{userData?.totalDownloads || 0}</span>


              </div>

              {/* Card 3 */}
              <div className="bg-[#fdf4ff] dark:bg-[#1f1522] border border-fuchsia-100 dark:border-fuchsia-900/30 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-4 h-4 text-fuchsia-400" />
                  <h4 className="text-[11px] font-bold text-fuchsia-500 uppercase tracking-wider">TOTAL SPENT <AlertCircle className="w-3 h-3 inline text-fuchsia-300 ml-1" /></h4>
                </div>
                <span className="text-4xl font-black text-fuchsia-900 dark:text-fuchsia-100">₹{userData?.totalSpent || 0}</span>


              </div>

            </div>

            {/* PLATFORM LIST / TABLE (Dynamic) */}
            <div className="pt-4">
              {/* Search Bar / Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
                <div className="relative w-full sm:flex-1 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <button 
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" /> Sort
                  </button>
                  <button 
                    onClick={handleExport}
                    className="flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <div className="col-span-12 md:col-span-5">Platforms</div>
                <div className="col-span-3 text-center hidden md:block">Searches <AlertCircle className="w-3 h-3 inline ml-1" /></div>
                <div className="col-span-2 text-center hidden md:block">Saved <AlertCircle className="w-3 h-3 inline ml-1" /></div>
                <div className="col-span-2 text-right hidden md:block">Status</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4 mt-4">
                {filteredPlatforms.map((platform) => (
                  <div key={platform.id} className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center shadow-sm hover:shadow-md transition-all group">
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4 w-full">
                      <div className={`w-12 h-12 rounded-xl ${platform.bg} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          {platform.name} <span className="text-xs font-normal text-neutral-500">{platform.type}</span>
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{platform.desc}</p>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-3 flex justify-between md:justify-center w-full md:w-auto text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      <span className="md:hidden text-neutral-400">Searches:</span>
                      {platform.searches}
                    </div>
                    <div className="col-span-12 md:col-span-2 flex justify-between md:justify-center w-full md:w-auto text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      <span className="md:hidden text-neutral-400">Saved:</span>
                      {platform.saved}
                    </div>
                    <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end w-full md:w-auto">
                      <span className="md:hidden text-neutral-400 font-bold text-sm">Status:</span>
                      <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md">{platform.status}</span>
                    </div>
                  </div>
                ))}
                
                {filteredPlatforms.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    No platforms found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* MODALS */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowPurchaseModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-2">Custom VIP Pass</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mb-6">
              Select how many days of VIP access you need. 1 Day is ₹10, and each additional day is just ₹9!
            </p>
            
            <div className="flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-neutral-200 dark:border-zinc-700 mb-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Days</span>
                <div className="flex items-center gap-3 mt-1">
                  <button 
                    onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                    className="w-8 h-8 rounded-md bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 flex items-center justify-center font-bold text-lg hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >-</button>
                  <span className="text-xl font-black text-neutral-900 dark:text-white w-6 text-center">{selectedDays}</span>
                  <button 
                    onClick={() => setSelectedDays(selectedDays + 1)}
                    className="w-8 h-8 rounded-md bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 flex items-center justify-center font-bold text-lg hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >+</button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total</span>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">₹{10 + (selectedDays - 1) * 9}</p>
              </div>
            </div>

            <RazorpayCheckout
              userEmail={user.email || ''}
              days={selectedDays}
              amount={10 + (selectedDays - 1) * 9}
              onSuccess={(d, a) => {
                setShowPurchaseModal(false);
                handlePaymentSuccess(d, a);
              }}
              variant="button"
            />
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
              Your VIP Pass is now active.
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-xl transition-colors hover:bg-black">Awesome!</button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Confirm Logout</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold rounded-xl hover:bg-neutral-200 transition-colors">Cancel</button>
              <button onClick={() => { signOut(auth); router.push('/'); }} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">Log Out</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
