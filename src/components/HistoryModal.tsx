import React from 'react';
import { History, X, Trash2, ArrowLeft, Clock } from 'lucide-react';
import { HistoryItem } from '../types/translator';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">سجل الكلمات المترجمة</h3>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors text-xs flex items-center gap-1"
                title="مسح السجل بالكامل"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">مسح</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
              <Clock className="w-8 h-8 text-slate-600 mb-2" />
              <span>لا توجد عمليات بحث سابقة بعد</span>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-right transition-all group"
              >
                <div className="flex-1 truncate">
                  <div className="font-bold text-xs text-white truncate flex items-center gap-2">
                    <span>{item.word}</span>
                    <span className="text-slate-500 font-normal">➔</span>
                    <span className="text-indigo-300 font-semibold truncate">{item.translation}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                    <span className="uppercase font-mono">{item.sourceLang} → {item.targetLang}</span>
                    <span>·</span>
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 mr-2 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
