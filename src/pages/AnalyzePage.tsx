import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  Check,
  AlertCircle,
  ShieldCheck,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Palette
} from 'lucide-react';
import {
  SkinToneType,
  FaceShapeType,
  BodyProportionType,
  FullAnalysisResult
} from '../types';
import { AiService } from '../services/aiService';
import { StorageService } from '../services/storage';
import { PrivacyModal } from '../components/common/PrivacyModal';

interface AnalyzePageProps {
  onNavigate: (path: string) => void;
  initialMode?: 'image' | 'quiz';
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate, initialMode = 'quiz' }) => {
  const [method, setMethod] = useState<'image' | 'quiz'>(initialMode);
  const [step, setStep] = useState<number>(1);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);

  // Quiz questions state
  const [veinColor, setVeinColor] = useState<string>('green');
  const [jewelryTone, setJewelryTone] = useState<string>('gold');
  const [sunReaction, setSunReaction] = useState<string>('tan-easily');
  const [naturalTone, setNaturalTone] = useState<string>('yellowish');

  // Face shape
  const [selectedFaceShape, setSelectedFaceShape] = useState<FaceShapeType>('Oval');

  // Body proportion
  const [selectedBody, setSelectedBody] = useState<BodyProportionType>('Straight');

  // Styles multi-select
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Korean', 'Casual']);

  // Occasion & Festival
  const [selectedOccasion, setSelectedOccasion] = useState<string>('ไปคาเฟ่');
  const [selectedFestival, setSelectedFestival] = useState<string>('');

  // Loading animation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState('กำลังวิเคราะห์สไตล์ของคุณ...');
  const [loadingProgress, setLoadingProgress] = useState(15);

  const styleOptions = [
    'Casual',
    'Korean',
    'Street',
    'Minimal',
    'Sporty',
    'Smart Casual',
    'Vintage',
    'Y2K',
    'Cute',
    'Cool',
    'Formal',
    'Luxury',
    'Japanese'
  ];

  const occasionOptions = [
    'ไปโรงเรียน',
    'ไปมหาวิทยาลัย',
    'ไปเที่ยว',
    'ไปห้าง',
    'ไปคาเฟ่',
    'ไปงานวันเกิด',
    'ไปงานแต่ง',
    'ไปสัมภาษณ์',
    'ไปออกเดต',
    'ไปออกกำลังกาย',
    'งานทางการ',
    'งานกึ่งทางการ',
    'อยู่บ้าน'
  ];

  const festivalOptions = [
    '',
    'New Year',
    "Valentine's Day",
    'Songkran',
    'Halloween',
    'Christmas',
    'Loy Krathong',
    'Birthday',
    'Graduation',
    'School Event',
    'Summer',
    'Winter',
    'Rainy Season'
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const check = await AiService.validateUploadedImage(file);
    if (!check.isValid) {
      alert(check.warning);
      return;
    }

    if (check.warning) {
      setPhotoWarning(check.warning);
    } else {
      setPhotoWarning(null);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoBase64(base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setLoadingProgress(20);
    setLoadingText('กำลังตรวจจับเม็ดสีผิวและอันเดอร์โทน...');

    setTimeout(() => {
      setLoadingProgress(50);
      setLoadingText('กำลังเทียบสัดส่วนรูปหน้าและรูปทรงกระดูก...');
    }, 900);

    setTimeout(() => {
      setLoadingProgress(75);
      setLoadingText('กำลังคำนวณสมดุลเสื้อผ้าและคอลเลกชันเฉดสี...');
    }, 1800);

    setTimeout(async () => {
      setLoadingProgress(95);
      setLoadingText('กำลังรวบรวม Complete Look เฉพาะคุณ ✨');

      // 1. Analyze skin tone
      const skinRes = await AiService.analyzeSkinTone({
        imageBase64: method === 'image' && photoBase64 ? photoBase64 : undefined,
        quiz: method === 'quiz' ? { veinColor, jewelryTone, sunReaction, naturalTone } : undefined
      });

      // 2. Analyze face shape
      const faceRes = await AiService.analyzeFaceShape({
        imageBase64: method === 'image' && photoBase64 ? photoBase64 : undefined,
        shapeSelect: selectedFaceShape
      });

      // 3. Analyze body
      const bodyRes = await AiService.analyzeBodyProportion({
        proportionType: selectedBody
      });

      // 4. Generate complete look
      const completeLook = await AiService.generateCompleteLook({
        skinTone: skinRes.tone,
        faceShape: selectedFaceShape,
        bodyProportion: selectedBody,
        selectedStyles,
        occasion: selectedOccasion,
        festival: selectedFestival || undefined
      });

      const fullResult: FullAnalysisResult = {
        id: `analysis_${Date.now()}`,
        createdAt: new Date().toISOString(),
        method,
        photoUrl: photoPreview || undefined,
        skinTone: skinRes,
        faceShape: faceRes,
        bodyProportion: bodyRes,
        makeup: {
          foundation: {
            undertone: skinRes.tone === 'Warm Tone' ? 'Yellow/Golden W20-W30' : skinRes.tone === 'Cool Tone' ? 'Rose/Pink C15-C25' : 'Neutral Buff N20-N25',
            advice: 'ทดลองเกลี่ยบริเวณสันกรามในแสงธรรมชาติเพื่อเช็คว่ากลืนไปกับลำคอ ไม่ทำให้หน้าลอยหรือหมอง',
            recommendedShades: skinRes.tone === 'Warm Tone' ? ['Warm Beige W20', 'Golden Sand W25'] : skinRes.tone === 'Cool Tone' ? ['Cool Porcelain C15', 'Rose Ivory C20'] : ['Natural Buff N20', 'Balanced Nude N25']
          },
          blush: {
            categoryName: skinRes.tone === 'Warm Tone' ? 'Peach & Coral' : skinRes.tone === 'Cool Tone' ? 'Mauve & Berry Rose' : 'Dusty Rose & Apricot',
            colors: skinRes.bestColors.slice(0, 2),
            applicationTips: 'ปัดบริเวณโหนกแก้มเฉียงขึ้นไปหากกหู เพื่อสร้างมิติยกกระชับกรอบหน้า'
          },
          lip: {
            categoryName: skinRes.tone === 'Warm Tone' ? 'Warm Coral, Peach, Terracotta' : skinRes.tone === 'Cool Tone' ? 'Berry, Plum, Rose Cool' : 'Almond Nude, Rosy Pink',
            colors: skinRes.bestColors.slice(1, 3),
            finishRecommendation: 'Velvet หรือ Tint ฉ่ำวาวบางเบา',
            applicationTips: 'แต้มกึ่งกลางริมฝีปากแล้วเบลนด์ออกขอบปากฟุ้งๆ สไตล์เกาหลี'
          },
          eyeshadow: {
            categoryName: skinRes.tone === 'Warm Tone' ? 'Caramel Bronze & Gold' : skinRes.tone === 'Cool Tone' ? 'Taupe Lilac & Silver' : 'Champagne & Earth',
            palette: skinRes.bestColors.slice(2, 5),
            applicationTips: 'ลงสีสว่างเป็นเบสทั่วเปลือกตา แล้วคัดเบ้าด้วยสีเข้มขึ้นเล็กน้อยตรงหางตา'
          }
        },
        hairstyles: faceRes.bestHairStyles,
        outfit: {
          top: completeLook.top,
          bottom: completeLook.bottom,
          outerwear: completeLook.outerwear,
          shoes: completeLook.shoes,
          accessories: [completeLook.accessories],
          colorPalette: skinRes.bestColors.slice(0, 4),
          silhouetteBalance: bodyRes.silhouetteAdvice,
          layeringTip: bodyRes.layeringAdvice,
          whyItWorks: completeLook.harmonyExplanation
        },
        selectedStyles,
        occasion: selectedOccasion,
        festival: selectedFestival || undefined,
        completeLook
      };

      StorageService.setLatestAnalysis(fullResult);
      setIsAnalyzing(false);
      onNavigate('/analysis-result');
    }, 2600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onConfirm={() => {
          setMethod('image');
        }}
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>ขั้นตอนที่ {step} จาก 4</span>
          <span>
            {step === 1 && 'เลือกวิธีวิเคราะห์สีผิว'}
            {step === 2 && 'วิเคราะห์รูปหน้า'}
            {step === 3 && 'วิเคราะห์สัดส่วนการแต่งตัว'}
            {step === 4 && 'เลือกสไตล์และโอกาส'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SKIN TONE ANALYSIS */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block mb-2">
              🎨 Step 1: Skin Tone Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              วิเคราะห์โทนสีผิวของคุณ (Personal Color)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              เลือกว่าคุณต้องการอัปโหลดรูปใบหน้าให้ AI ประมวลผล หรือตอบคำถาม 4 ข้อง่ายๆ
            </p>
          </div>

          {/* Method Toggle Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                if (!photoBase64) {
                  setPrivacyModalOpen(true);
                } else {
                  setMethod('image');
                }
              }}
              className={`p-4 rounded-2xl border text-center transition-all ${
                method === 'image'
                  ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold shadow-md shadow-pink-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-6 h-6 mx-auto mb-1.5 text-pink-600" />
              <span className="text-xs sm:text-sm block font-bold">วิธีที่ 1: อัปโหลดรูปภาพ</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">AI สแกนสีผิวอัตโนมัติ</span>
            </button>

            <button
              onClick={() => setMethod('quiz')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                method === 'quiz'
                  ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700 font-bold shadow-md shadow-indigo-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-6 h-6 mx-auto mb-1.5 text-indigo-600" />
              <span className="text-xs sm:text-sm block font-bold">วิธีที่ 2: ตอบแบบสอบถาม</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">เส้นเลือด & แสงแดด</span>
            </button>
          </div>

          {/* METHOD 1: PHOTO UPLOAD */}
          {method === 'image' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm max-w-xl mx-auto text-center">
              {photoPreview ? (
                <div className="space-y-4">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-pink-400">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoBase64(null);
                        setPhotoWarning(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                      title="ลบรูปภาพ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {photoWarning && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 text-left">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>{photoWarning}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    รูปภาพพร้อมสำหรับการวิเคราะห์ ✨ สามารถเปลี่ยนรูปใหม่ได้ตลอดเวลา
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 hover:border-pink-500 transition-colors bg-slate-50/50">
                    <Upload className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800 mb-1">
                      คลิกเพื่ออัปโหลด หรือลากไฟล์ภาพมาที่นี่
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      แนะนำภาพถ่ายหน้าตรง แสงสว่างธรรมชาติ ไม่ใส่ฟิลเตอร์หนัก (JPG, PNG ไม่เกิน 10MB)
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold cursor-pointer hover:opacity-95 shadow-md">
                      <Camera className="w-4 h-4" />
                      <span>เลือกรูปถ่ายใบหน้า</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>รูปภาพมีความเป็นส่วนตัวสูง ไม่ถูกเผยแพร่สู่ภายนอก</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* METHOD 2: QUIZ QUESTIONS */}
          {method === 'quiz' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Question 1: Vein */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-800">
                  1. เมื่อมองเส้นเลือดที่ข้อมือในที่แสงธรรมชาติ เห็นสีอะไรเด่นชัดที่สุด?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'green', label: 'สีเขียว / เขียวมะกอก', desc: 'โทนอุ่น (Warm Tone)' },
                    { id: 'blue-purple', label: 'สีน้ำเงิน / ม่วง', desc: 'โทนเย็น (Cool Tone)' },
                    { id: 'both', label: 'ปนกัน / แยกยาก', desc: 'โทนกลาง (Neutral Tone)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setVeinColor(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        veinColor === opt.id
                          ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Jewelry */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-800">
                  2. เครื่องประดับโลหะสีใดที่รู้สึกว่าใส่แล้วขับผิวเปล่งปลั่งที่สุด?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'gold', label: 'สีทอง (Gold / Brass)', desc: 'เข้ากับอันเดอร์โทนเหลือง' },
                    { id: 'silver', label: 'สีเงิน (Silver / White Gold)', desc: 'เข้ากับอันเดอร์โทนชมพู' },
                    { id: 'both', label: 'ใส่ได้ทั้งคู่ / โรสโกลด์', desc: 'เข้ากับอันเดอร์โทนกลาง' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setJewelryTone(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        jewelryTone === opt.id
                          ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Sun reaction */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-800">
                  3. เมื่อผิวสัมผัสแดดแรงๆ โดยไม่ได้ทากันแดด ผิวมีปฏิกิริยาอย่างไร?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'tan-easily', label: 'ผิวคล้ำขึ้นทันที ไม่ค่อยแสบแดง', desc: 'มีเมลานินโทนอบอุ่น' },
                    { id: 'burn-easily', label: 'แสบแดงง่าย ลอกง่าย คล้ำยาก', desc: 'ผิวบอบบางโทนเย็น' },
                    { id: 'burn-then-tan', label: 'แดงเล็กน้อย แล้วเปลี่ยนเป็นแทน', desc: 'ปฏิกิริยาสมดุล' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSunReaction(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        sunReaction === opt.id
                          ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Natural overall tone */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-800">
                  4. เมื่อเทียบกับกระดาษสีขาวบริสุทธิ์ ผิวโดยรวมของคุณมีความรู้สึกอย่างไร?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'yellowish', label: 'อมเหลือง / ทอง / อบอุ่น', desc: 'Warm Undertone' },
                    { id: 'pinkish', label: 'อมชมพู / ขาวซีด / โปร่งแสง', desc: 'Cool Undertone' },
                    { id: 'balanced', label: 'สมดุล ไม่เหลืองหรือชมพูชัด', desc: 'Neutral Undertone' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setNaturalTone(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        naturalTone === opt.id
                          ? 'border-pink-500 bg-pink-50/70 text-pink-700 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-pink-500/25 flex items-center gap-2"
            >
              <span>ถัดไป: วิเคราะห์รูปหน้า</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: FACE SHAPE */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold inline-block mb-2">
              💇 Step 2: Face Shape Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              เลือกลักษณะรูปหน้าของคุณ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              เพื่อช่วยแนะนำทรงผมและสไตล์การแต่งหน้าที่เข้ากับมิติกรอบหน้า
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                id: 'Oval' as FaceShapeType,
                name: 'รูปหน้าไข่ (Oval)',
                desc: 'สัดส่วนสมดุล ความยาวได้สัดส่วนกับความกว้าง โหนกแก้มโค้งมน',
                icon: '🥚'
              },
              {
                id: 'Round' as FaceShapeType,
                name: 'รูปหน้ากลม (Round)',
                desc: 'ความกว้างและยาวใกล้เคียงกัน พวงแก้มอิ่มสดใส เส้นสายโค้งมน',
                icon: '⚪'
              },
              {
                id: 'Square' as FaceShapeType,
                name: 'รูปหน้าเหลี่ยม (Square)',
                desc: 'สันกรามและขากรรไกรคมชัด หน้าผากกว้างเท่าขากรรไกร มีมิติเท่',
                icon: '⏹️'
              },
              {
                id: 'Rectangle' as FaceShapeType,
                name: 'รูปหน้ายาว (Rectangle)',
                desc: 'ความยาวใบหน้าโดดเด่น คางและหน้าผากได้รูป สง่างามภูมิฐาน',
                icon: '▯'
              },
              {
                id: 'Heart' as FaceShapeType,
                name: 'รูปหน้ารูปหัวใจ (Heart)',
                desc: 'หน้าผากกว้างรับกับโหนกแก้ม ค่อยๆ สอบเรียวสู่ปลายคางแหลมสวย',
                icon: '🤍'
              },
              {
                id: 'Diamond' as FaceShapeType,
                name: 'รูปหน้าเพชร (Diamond)',
                desc: 'โหนกแก้มสูงเด่น หน้าผากและปลายคางเรียว มิติแสงเงาคมชัด',
                icon: '💎'
              }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedFaceShape(item.id)}
                className={`p-5 rounded-3xl border text-left transition-all ${
                  selectedFaceShape === item.id
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900 font-bold shadow-md shadow-purple-500/10 scale-[1.02]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <p className="text-sm font-bold mb-1">{item.name}</p>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-6 max-w-3xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-pink-500/25 flex items-center gap-2"
            >
              <span>ถัดไป: วิเคราะห์สัดส่วนรูปร่าง</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BODY PROPORTION (Respectful, Neutral wording) */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold inline-block mb-2">
              👕 Step 3: Silhouette & Balance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              วิเคราะห์สัดส่วนการแต่งตัว
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              คำแนะนำเพื่อการบาลานซ์ซิลูเอท เสื้อ กางเกง และเลเยอร์อย่างลงตัว โดยไม่มีการให้คะแนนหรือตัดสินรูปร่าง
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                id: 'Straight' as BodyProportionType,
                name: 'Straight / Column',
                desc: 'ไหล่ เอว และสะโพกมีความกว้างใกล้เคียงกัน เหมาะกับการเล่นเลเยอร์และใส่เข็มขัดเน้นมิติ',
                tag: 'คลาสสิก & คล่องตัว'
              },
              {
                id: 'Triangle' as BodyProportionType,
                name: 'Triangle / Pear',
                desc: 'สะโพกโดดเด่น ช่วงบนเพรียว เหมาะกับเสื้อเปิดไหล่หรือมีดีเทลช่วงบน คู่กับกางเกงทิ้งตัวสบาย',
                tag: 'บาลานซ์ช่วงบน'
              },
              {
                id: 'Inverted Triangle' as BodyProportionType,
                name: 'Inverted Triangle',
                desc: 'ช่วงไหล่และหลังสง่างาม สะโพกเพรียว เหมาะกับเสื้อคอวี และกางเกงขากว้างหรือคาร์โก้',
                tag: 'บาลานซ์ช่วงล่าง'
              },
              {
                id: 'Hourglass' as BodyProportionType,
                name: 'Hourglass',
                desc: 'ไหล่และสะโพกสมดุลกันตามธรรมชาติ เอวคอดชัดเจน เหมาะกับเสื้อป้ายอกหรือกางเกงเอวสูง',
                tag: 'โอบรับเส้นสายธรรมชาติ'
              },
              {
                id: 'Rectangle' as BodyProportionType,
                name: 'Rectangle',
                desc: 'โครงสร้างลำตัวแบบโมเดิร์น เหมาะกับแฟชั่นแนวสตรีท เชิ้ตโอเวอร์ไซส์ และแจ็คเก็ตบอมเบอร์',
                tag: 'โมเดิร์นเลเยอร์'
              },
              {
                id: 'Custom / Not sure' as BodyProportionType,
                name: 'Custom / Not sure',
                desc: 'ไม่แน่ใจ หรือเน้นความสบายเป็นหลัก ระบบจะแนะนำการแต่งกายที่ยืดหยุ่นและสวมใส่สบายที่สุด',
                tag: 'อิสระ & มั่นใจ'
              }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedBody(item.id)}
                className={`p-5 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                  selectedBody === item.id
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-md shadow-blue-500/10 scale-[1.02]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{item.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-6 max-w-3xl mx-auto">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-pink-500/25 flex items-center gap-2"
            >
              <span>ถัดไป: สไตล์และโอกาส</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: STYLES, OCCASION & GENERATE */}
      {step === 4 && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold inline-block mb-2">
              ✨ Step 4: Personalize & Generate
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              เลือกสไตล์ที่คุณชื่นชอบ & โอกาส
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              สามารถเลือกสไตล์ได้มากกว่า 1 ข้อ ระบบจะนำทุกมิติมาผสานเป็น Complete Look
            </p>
          </div>

          {/* Styles Multi-Select */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                สไตล์ที่คุณชอบ (เลือกได้หลายข้อ)
              </h3>
              <span className="text-xs text-pink-600 font-semibold">
                เลือกแล้ว {selectedStyles.length} แบบ
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {styleOptions.map((st) => {
                const isSelected = selectedStyles.includes(st);
                return (
                  <button
                    key={st}
                    onClick={() => toggleStyle(st)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion Selection */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              เลือกโอกาส / สถานการณ์ (Occasion)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {occasionOptions.map((occ) => {
                const isSelected = selectedOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`p-3 rounded-2xl text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Festival (Optional) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              ต้องการแต่งตัวรับเทศกาลพิเศษหรือไม่? (ไม่บังคับ)
            </h3>
            <div className="flex flex-wrap gap-2">
              {festivalOptions.map((fes) => {
                const isSelected = selectedFestival === fes;
                return (
                  <button
                    key={fes || 'none'}
                    onClick={() => setSelectedFestival(fes)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white font-bold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {fes ? `🎉 ${fes}` : 'ทั่วไป (ไม่ระบุเทศกาล)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button
              onClick={handleRunAnalysis}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-black text-sm shadow-xl shadow-pink-500/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>✨ Generate My Look! (สร้างสไตล์ของฉัน)</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern AI Analysis Loading Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Glow animations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-pink-500/30 mb-6 relative">
              <Sparkles className="w-10 h-10 text-white animate-spin" />
            </div>

            <h3 className="text-xl font-bold mb-2">กำลังวิเคราะห์สไตล์ของคุณ...</h3>
            <p className="text-xs text-pink-400 font-medium mb-6 animate-pulse">
              {loadingText}
            </p>

            {/* Animated progress bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4 p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              ระบบกำลังเชื่อมโยงโทนสีผิว รูปหน้า โครงสร้างสรีระ และสไตล์ความชอบ เพื่อให้ได้ลุคที่กลมกลืนและเป็นธรรมชาติที่สุด
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
