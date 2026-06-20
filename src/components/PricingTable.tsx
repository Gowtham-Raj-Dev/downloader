'use client';

import { useState, useEffect } from 'react';
import { Check, X, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PricingTable() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.isPremium && data.premiumExpiry && data.premiumExpiry > Date.now()) {
              setIsPremium(true);
            } else {
              setIsPremium(false);
            }
          }
        } catch (err) {
          console.error("Error fetching status:", err);
        }
      } else {
        setIsLoggedIn(false);
        setIsPremium(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="w-full max-w-5xl grid md:grid-cols-3 gap-6 mx-auto">
      {/* Guest Tier */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-sm opacity-80 text-left flex flex-col">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Guest User</h3>
        <p className="text-3xl font-black text-neutral-900 dark:text-white mb-6">₹0 <span className="text-sm text-neutral-500 font-normal">/ forever</span></p>
        <ul className="space-y-4 mb-8 text-sm text-neutral-600 dark:text-neutral-400 flex-1">
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-neutral-400" /> 20 Single Downloads / day</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-neutral-400" /> Standard Speed</li>
          <li className="flex items-center gap-3"><X className="w-5 h-5 text-red-400" /> Multi-URL Batch Downloading</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Pinterest Downloader</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> YT Description Tools</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 100% Ad-Free Experience</li>
        </ul>
        {isLoading ? (
          <div className="w-full py-3 mt-auto flex justify-center text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : !isLoggedIn ? (
          <div className="w-full py-3 mt-auto bg-neutral-100 dark:bg-zinc-800 text-neutral-500 rounded-lg text-center font-bold text-sm select-none border border-neutral-200 dark:border-zinc-700">
            Currently Active
          </div>
        ) : (
          <div className="w-full py-3 mt-auto text-neutral-400 rounded-lg text-center font-bold text-sm select-none">
            Logged In
          </div>
        )}
      </div>

      {/* Free Account Tier */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-sm text-left flex flex-col">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Free Account</h3>
        <p className="text-3xl font-black text-neutral-900 dark:text-white mb-6">₹0 <span className="text-sm text-neutral-500 font-normal">/ forever</span></p>
        <ul className="space-y-4 mb-8 text-sm text-neutral-600 dark:text-neutral-400 flex-1">
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 100 Single Downloads / day</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Standard Speed</li>
          <li className="flex items-center gap-3"><X className="w-5 h-5 text-red-400" /> Multi-URL Batch Downloading</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Pinterest Downloader</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> YT Description Tools</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 100% Ad-Free Experience</li>
        </ul>
        {isLoading ? (
          <div className="w-full py-3 mt-auto flex justify-center text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : !isLoggedIn ? (
          <Link href="/login" className="block w-full py-3 mt-auto bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-center font-bold text-sm transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-800">
            Sign Up Free
          </Link>
        ) : !isPremium ? (
          <div className="w-full py-3 mt-auto bg-neutral-100 dark:bg-zinc-800 text-neutral-500 rounded-lg text-center font-bold text-sm select-none border border-neutral-200 dark:border-zinc-700">
            Currently Active
          </div>
        ) : (
          <div className="w-full py-3 mt-auto text-neutral-400 rounded-lg text-center font-bold text-sm select-none">
            VIP Active
          </div>
        )}
      </div>

      {/* VIP Tier */}
      <div className="bg-gradient-to-b from-indigo-500/10 to-transparent border-2 border-indigo-500 p-8 rounded-2xl shadow-xl relative transform md:-translate-y-2 text-left flex flex-col">
        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
          <Zap className="w-3 h-3" /> Most Popular
        </div>
        <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">VIP Pass</h3>
        <p className="text-3xl font-black text-neutral-900 dark:text-white mb-6">₹29 <span className="text-sm text-neutral-500 font-normal">/ 3 Days</span></p>
        <ul className="space-y-4 mb-8 text-sm text-neutral-700 dark:text-neutral-300 font-medium flex-1">
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-500" /> Unlimited Single Downloads</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-500" /> Priority High-Speed Servers</li>
          <li className="flex items-center gap-3 font-bold text-indigo-600 dark:text-indigo-400"><Check className="w-5 h-5 text-indigo-500" /> Unlimited Multi-URL Batch Downloading</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-500" /> Pinterest Downloader</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-500" /> YT Description Tools</li>
          <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-500" /> 100% Ad-Free Experience</li>
        </ul>
        {isLoading ? (
          <div className="w-full py-3 mt-auto flex justify-center text-indigo-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : isPremium ? (
          <Link href="/profile" className="block w-full py-3 mt-auto bg-green-500 hover:bg-green-600 text-white rounded-lg text-center font-bold text-sm transition-colors shadow-md">
            VIP Active (Go to Profile)
          </Link>
        ) : (
          <Link href="/profile" className="block w-full py-3 mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-center font-bold text-sm transition-colors shadow-md">
            Upgrade Now
          </Link>
        )}
      </div>
    </div>
  );
}
