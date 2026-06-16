import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, isLoggedIn } = body;
    
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    
    const cleanIp = ip.replace(/[^a-zA-Z0-9]/g, '_');
    const today = new Date().toISOString().split('T')[0];
    const docId = `ip_${cleanIp}_${today}`;
    
    const limitRef = doc(db, 'ip_limits', docId);
    let currentCount = 0;
    
    try {
      const snap = await getDoc(limitRef);
      if (snap.exists()) {
        currentCount = snap.data().count || 0;
      }
    } catch (dbErr) {
      console.warn('Firebase read error for IP limits (possibly rules), falling back to 0', dbErr);
    }

    const limit = isLoggedIn ? 100 : 20;

    if (action === 'check') {
      return NextResponse.json({ 
        success: true, 
        count: currentCount, 
        allowed: currentCount < limit 
      });
    } else if (action === 'increment') {
      try {
        if (currentCount > 0) {
          await updateDoc(limitRef, { count: increment(1) });
        } else {
          await setDoc(limitRef, { count: 1, date: today, ip });
        }
      } catch (dbErr) {
        console.warn('Firebase write error for IP limits', dbErr);
      }
      return NextResponse.json({ 
        success: true, 
        count: currentCount + 1,
        allowed: (currentCount + 1) < limit
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' });
  } catch (error) {
    console.error('IP Limits API Error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
