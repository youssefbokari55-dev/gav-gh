import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle2, Smartphone, Sparkles, Mic, Camera, WifiOff, Share2 } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstalled();
        onClose();
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>التوافق مع أندرويد (Android)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                  متوافق 100%
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">تطبيق ويب تقدمي (PWA) قابل للتثبيت كأي تطبيق عادي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto text-right">
          {/* Main Answer Highlight */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-white text-sm block mb-1">
                  نعم، التطبيق مصمم ومجهّز بالكامل للعمل على هواتف أندرويد!
                </span>
                تمت برمجته كـ <strong>Progressive Web App (PWA)</strong>، مما يعني أنه يمكنك تثبيته على شاشة هاتفك الأندرويد الرئيسية ليفتح كأي تطبيق أصلي بدون شريط المتصفح وبأيقونة مخصصة وسرعة فائقة.
              </div>
            </div>
          </div>

          {/* Native 1-Click Install Button if Chrome Prompt Available */}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت التطبيق على هاتف أندرويد بنقرة واحدة</span>
            </button>
          )}

          {/* Features on Android */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2">مميزات التطبيق على أندرويد:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">إدخال صوتي بالميكروفون</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">ترجمة الصور بالكاميرا</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">نطق أصوات Google TTS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">دفتر مفردات بدون إنترنت</span>
              </div>
            </div>
          </div>

          {/* How to Install Steps on Android */}
          <div className="bg-slate-800/50 border border-slate-750 rounded-2xl p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>خطوات التثبيت على أي هاتف أندرويد (Google Chrome):</span>
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 pr-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>افتح هذا الرابط على متصفح <strong>Google Chrome</strong> في هاتفك.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>اضغط على قائمة المتصفح <strong>(الثلاث نقاط ⋮)</strong> في أعلى الزاوية.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>اختر <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</span>
              </li>
            </ol>
          </div>

          {/* Share/Copy link button */}
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{copiedLink ? 'تم نسخ رابط التطبيق بنجاح!' : 'نسخ رابط التطبيق لفتحه على هاتفك'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
