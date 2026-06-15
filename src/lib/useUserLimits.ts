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

  const checkDailyLimit = (type: 'single' | 'multi') => {
    if (isPremium) return true; // Premium has no hard limits
    
    // For Multi, if not premium, they can't use it
    if (type === 'multi') return false; 
    
    // For Single, track in localStorage
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_downloads_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0');
    
    const limit = isLoggedIn ? 10 : 2;
    
    return count < limit;
  };

  const incrementDailyLimit = () => {
    if (isPremium) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_downloads_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (count + 1).toString());
  };

  return { isLoggedIn, isPremium, isLoading, checkDailyLimit, incrementDailyLimit };
}
