import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'guest' | 'free' | 'multi' | null;
}

export default function LimitExceededModal({ isOpen, onClose, type }: LimitExceededModalProps) {
  if (!type) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full pointer-events-auto relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className={`absolute top-0 left-0 w-full h-1 ${type === 'guest' ? 'bg-blue-500' : 'bg-indigo-500'}`} />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg
                  ${type === 'guest' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}
                >
                  {type === 'guest' ? <LogIn className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                </div>

                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {type === 'guest' && 'Guest Limit Reached'}
                  {type === 'free' && 'Daily Limit Reached'}
                  {type === 'multi' && 'VIP Exclusive Feature'}
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  {type === 'guest' && 'You have used your 2 free downloads for today. Sign up for a free account to get 10 downloads per day!'}
                  {type === 'free' && 'You have used your 10 free downloads for today. Upgrade to a VIP Pass for unlimited, high-speed access!'}
                  {type === 'multi' && 'Batch downloading multiple URLs at once is a premium feature. Upgrade to VIP to unlock this superpower!'}
                </p>

                {type === 'guest' ? (
                  <div className="w-full space-y-3">
                    <Link href="/login" onClick={onClose} className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
                      Sign In Now
                    </Link>
                    <button onClick={onClose} className="w-full py-3 px-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium transition-colors">
                      Maybe Later
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <Link href="/" onClick={onClose} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-indigo-500/20">
                      <Zap className="w-4 h-4" /> Upgrade to VIP
                    </Link>
                    <button onClick={onClose} className="w-full py-3 px-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
