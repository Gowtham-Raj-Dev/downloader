import { motion, AnimatePresence } from 'framer-motion';
import { Download, AlertCircle, Settings, X, ExternalLink } from 'lucide-react';

interface DownloadAllModalProps {
  isOpen: boolean;
  videoCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DownloadAllModal({ isOpen, videoCount, onConfirm, onClose }: DownloadAllModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-outer overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50 dark:bg-zinc-900/40 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Browser Permission Required</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Downloading {videoCount} videos directly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              To save all videos seamlessly, your browser will show a security popup asking to <strong>&quot;Download multiple files&quot;</strong>.
            </p>

            {/* Instruction Graphic */}
            <div className="bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-card p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Browser Prompt Example
              </p>
              <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 shadow-sm rounded-lg p-3 text-sm">
                <p className="font-medium text-neutral-800 dark:text-neutral-200 mb-3 text-xs">
                  This site wants to <br /> <span className="font-normal text-neutral-600 dark:text-neutral-400">Download multiple files</span>
                </p>
                <div className="flex gap-2 justify-end">
                  <span className="px-3 py-1.5 rounded-button text-xs font-medium bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 line-through opacity-50">Block</span>
                  <span className="px-3 py-1.5 rounded-button text-xs font-bold bg-blue-600 text-white shadow-md animate-pulse cursor-default">Allow</span>
                </div>
              </div>
            </div>

            {/* Blocked Instruction */}
            <div className="flex items-start gap-3 p-3 rounded-card bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300">
              <Settings className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">What if I accidentally clicked Block?</p>
                <p className="opacity-90">
                  Look for a small <strong>download icon with a red X</strong> or <strong>site settings icon</strong> in your browser&apos;s URL address bar. Click it and select &quot;Always allow&quot;.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50 dark:bg-zinc-900/40 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-button text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('hasSeenDownloadAllPopup', 'true');
                }
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 rounded-button text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-2 transition-colors active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Got it, Start Downloading</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
