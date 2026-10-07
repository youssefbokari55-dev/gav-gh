import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { WordTranslationResult } from '../types/translator';

interface CameraOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLangCode: string;
  onResultReceived: (result: WordTranslationResult) => void;
}

export const CameraOcrModal: React.FC<CameraOcrModalProps> = ({
  isOpen,
  onClose,
  targetLangCode,
  onResultReceived,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('الرجاء اختيار ملف صورة صالح');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTranslateImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/translate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          targetLang: targetLangCode,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'فشلت معالجة الصورة');
      }

      const resultData = await res.json();
      onResultReceived(resultData);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء قراءة الكلمة من الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-sm text-white">ترجمة صورة أو لافتة بالكاميرا</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedImage ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 px-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850/60 hover:bg-slate-800/80 transition-all flex flex-col items-center justify-center gap-3 text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white mb-0.5">التقط صورة بالكاميرا أو اختر صورة</div>
                  <div className="text-xs text-slate-400">يدعم لافتات الشوارع، قوائم الطعام، والكتب بأي لغة</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-h-60 bg-black flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Snapshot"
                  className="w-full h-auto object-contain max-h-60"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  title="إلغاء الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تغيير الصورة</span>
                </button>

                <button
                  type="button"
                  onClick={handleTranslateImage}
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>قراءة وترجمة الكلمة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
