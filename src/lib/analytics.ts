import { auth, db } from '@/lib/firebase';
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';

export type Platform = 'instagram' | 'youtube';
export type ActionType = 'single' | 'multi';
export type Action = 'fetch' | 'download';

export const trackUserAction = async (
  platform: Platform,
  type: ActionType,
  action: Action,
  count: number = 1
) => {
  try {
    const user = auth.currentUser;
    if (!user) return; // Only track for logged-in users

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        isPremium: false,
        premiumExpiry: null,
        email: user.email || '',
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
    }
    
    const updateData: Record<string, unknown> = {};
    
    if (action === 'fetch') {
      updateData['totalFetches'] = increment(count);
      updateData[`stats.${platform}.${type}.fetches`] = increment(count);
    } else if (action === 'download') {
      updateData['totalDownloads'] = increment(count);
      updateData[`stats.${platform}.${type}.downloads`] = increment(count);
    }

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error tracking user action:", error);
  }
};
