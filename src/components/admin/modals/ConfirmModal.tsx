import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  showConfirmModal: boolean;
  confirmModalConfig: {
    title: string;
    message: string;
    isDanger?: boolean;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  showConfirmModal,
  confirmModalConfig,
  onClose
}) => {
  return (
    <AnimatePresence>
      {showConfirmModal && confirmModalConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 md:p-7 max-w-sm w-full shadow-2xl relative space-y-4 text-center border border-gray-150"
          >
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${confirmModalConfig.isDanger ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-base font-bold text-green-deep">
                {confirmModalConfig.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {confirmModalConfig.message}
              </p>
            </div>

            <div className="flex justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                {confirmModalConfig.cancelText || "Batal"}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModalConfig.onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-white font-semibold rounded-xl text-xs transition-all shadow cursor-pointer ${
                  confirmModalConfig.isDanger 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-green-deep hover:bg-green-mid'
                }`}
              >
                {confirmModalConfig.confirmText || "Ya"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
