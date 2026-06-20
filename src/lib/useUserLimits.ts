import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useUserLimits() {
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
          console.error('Error fetching user status:', err);
        }
      } else {
        setIsLoggedIn(false);
        setIsPremium(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkDailyLimit = async (type: 'single' | 'multi') => {
    if (isPremium) return true; // Premium has no hard limits

    // For Multi, if not premium, they can't use it
    if (type === 'multi') return false;

    try {
      const res = await fetch('/api/limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', isLoggedIn })
      });
      const data = await res.json();
      if (data && data.success) {
        return data.allowed;
      }
    } catch (e) {
      console.warn('Failed to check API limits, using local fallback', e);
    }

    // For Single, track in localStorage
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_downloads_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0');

    const limit = isLoggedIn ? 100 : 20;

    return count < limit;
  };

  const incrementDailyLimit = async () => {
    if (isPremium) return;

    try {
      await fetch('/api/limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'increment', isLoggedIn })
      });
    } catch (e) {
      console.warn('Failed to increment API limits, using local fallback', e);
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `daily_downloads_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (count + 1).toString());
  };

  return { isLoggedIn, isPremium, isLoading, checkDailyLimit, incrementDailyLimit };
}
