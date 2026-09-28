import {
  SkinToneType,
  FaceShapeType,
  BodyProportionType,
  SkinAnalysisResult,
  FaceShapeResult,
  BodyProportionResult,
  MakeupRecommendation,
  HairstyleItemRecommendation,
  OutfitRecommendation,
  CompleteLook,
  FullAnalysisResult
} from '../types';
import {
  COOL_TONE_PALETTE,
  WARM_TONE_PALETTE,
  NEUTRAL_TONE_PALETTE,
  INITIAL_HAIRSTYLES,
  INITIAL_OUTFITS,
  INITIAL_OCCASIONS
} from '../data/mockData';

export interface ImageQualityCheck {
  isValid: boolean;
  warning?: string;
  isBlurryOrDark?: boolean;
}

export const AiService = {
  // Check image quality (e.g. brightness, size, blur heuristic)
  validateUploadedImage(file: File): Promise<ImageQualityCheck> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        return resolve({
          isValid: false,
          warning: 'ไฟล์ที่อัปโหลดไม่ใช่รูปภาพ กรุณาเลือกไฟล์รูปภาพ เช่น JPG, PNG หรือ WebP'
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        return resolve({
          isValid: false,
          warning: 'ขนาดไฟล์ภาพใหญ่เกิน 10MB กรุณาเลือกรูปภาพขนาดเล็กลง'
        });
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        // Simple canvas sampling to detect extreme darkness/blown out
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve({ isValid: true });

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;

        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        const avgBrightness = totalBrightness / (100 * 100);

        if (avgBrightness < 35) {
          resolve({
            isValid: true,
            isBlurryOrDark: true,
            warning: 'ภาพถ่ายค่อนข้างมืด AI อาจวิเคราะห์สีผิวและรูปหน้าคลาดเคลื่อนได้ แนะนำให้ถ่ายในที่แสงสว่างธรรมชาติ'
          });
        } else if (avgBrightness > 240) {
          resolve({
            isValid: true,
            isBlurryOrDark: true,
            warning: 'ภาพถ่ายมีแสงจ้าสว่างเกินไป (Overexposed) อาจทำให้สีผิวและคอนทัวร์ผิดเพี้ยน'
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          isValid: false,
          warning: 'ไม่สามารถอ่านไฟล์ภาพได้ กรุณาลองใหม่อีกครั้ง'
        });
      };
      img.src = objectUrl;
    });
  },

  // Skin tone analysis
  async analyzeSkinTone(params: {
    imageBase64?: string;
    quiz?: {
      veinColor?: string; // 'green' | 'blue-purple' | 'both'
      jewelryTone?: string; // 'gold' | 'silver' | 'both'
      sunReaction?: string; // 'tan-easily' | 'burn-easily' | 'burn-then-tan'
      naturalTone?: string; // 'yellowish' | 'pinkish' | 'balanced'
    };
  }): Promise<SkinAnalysisResult> {
    // Try server API first if available
    try {
      const res = await fetch('/api/analyze/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.skinTone) return json.skinTone;
      }
    } catch {
      // fallback to algorithmic reasoning
    }

    // Algorithmic evaluation based on inputs
    let warmScore = 0;
    let coolScore = 0;

    if (params.quiz) {
      if (params.quiz.veinColor === 'green') warmScore += 3;
      if (params.quiz.veinColor === 'blue-purple') coolScore += 3;
      if (params.quiz.veinColor === 'both') {
        warmScore += 1;
        coolScore += 1;
      }

      if (params.quiz.jewelryTone === 'gold') warmScore += 2;
      if (params.quiz.jewelryTone === 'silver') coolScore += 2;
      if (params.quiz.jewelryTone === 'both') {
        warmScore += 1;
        coolScore += 1;
      }

      if (params.quiz.sunReaction === 'tan-easily') warmScore += 2;
      if (params.quiz.sunReaction === 'burn-easily') coolScore += 2;

      if (params.quiz.naturalTone === 'yellowish') warmScore += 3;
      if (params.quiz.naturalTone === 'pinkish') coolScore += 3;
    } else if (params.imageBase64) {
      // Heuristic for photo analysis demo
      warmScore = 3;
      coolScore = 1;
    }

    let tone: SkinToneType = 'Warm Tone';
    let confidence = 94;

    if (Math.abs(warmScore - coolScore) <= 1) {
      tone = 'Neutral Tone';
      confidence = 90;
    } else if (coolScore > warmScore) {
      tone = 'Cool Tone';
      confidence = 96;
    } else {
      tone = 'Warm Tone';
      confidence = 95;
    }

    if (tone === 'Warm Tone') {
      return {
        tone: 'Warm Tone',
        confidence,
        veinAppearance: 'เส้นเลือดที่ข้อมือมีโทนเขียวมะกอกหรือเขียวขี้ม้าเด่นชัด',
        sunReaction: 'ผิวคล้ำขึ้นหรือเปลี่ยนเป็นสีแทนทองได้ง่ายเมื่อโดนแดด ไม่ค่อยแสบแดงจัด',
        jewelryComplement: 'เครื่องประดับโลหะสีทอง (Yellow Gold) และทองเหลือง ขับผิวได้ผ่องที่สุด',
        description: 'ผิวของคุณมีเม็ดสีอันเดอร์โทนเหลือง-ทองอันอบอุ่น (Golden Warm Glow) ดูสุขภาพดี มีชีวิตชีวา และเปล่งประกายเมื่อเจอกับแสงธรรมชาติ',
        bestColors: [
          { name: 'Warm Apricot', hex: '#F4A281' },
          { name: 'Coral Peach', hex: '#E77461' },
          { name: 'Caramel Bronze', hex: '#A06E50' },
          { name: 'Olive Green', hex: '#556B2F' },
          { name: 'Mustard Yellow', hex: '#FFDB58' },
          { name: 'Terracotta', hex: '#C86446' }
        ],
        tryColors: [
          { name: 'Warm Off-White', hex: '#FAF0E6' },
          { name: 'Deep Burgundy Wine', hex: '#65000B' },
          { name: 'Seafoam Teal', hex: '#008080' }
        ],
        contrastColors: [
          { name: 'Icy Magenta', hex: '#CA1F7B' },
          { name: 'Stark Cool Neon Blue', hex: '#00FFFF' },
          { name: 'Ash Grey Silver', hex: '#A8A9AD' }
        ]
      };
    } else if (tone === 'Cool Tone') {
      return {
        tone: 'Cool Tone',
        confidence,
        veinAppearance: 'เส้นเลือดที่ข้อมือมีโทนสีน้ำเงิน หรือม่วงชัดเจน',
        sunReaction: 'ผิวไวต่อแดด มักแสบแดง ลอกง่าย ก่อนจะค่อยๆ คล้ำลง',
        jewelryComplement: 'เครื่องประดับสีเงิน (Silver), พลอยสีขาว หรือไวท์โกลด์ ขับประกายผิวได้เจิดจรัส',
        description: 'ผิวของคุณมีเม็ดสีอันเดอร์โทนชมพู-น้ำเงิน (Rosy Cool Radiance) ผิวดูโปร่งใส มีความกระจ่างและเปล่งประกายสดชื่น',
        bestColors: [
          { name: 'Berry Rose', hex: '#BD3B67' },
          { name: 'Lavender Mauve', hex: '#B39EB5' },
          { name: 'Icy Sky Blue', hex: '#A5C9EB' },
          { name: 'Emerald Cool Green', hex: '#2E8B57' },
          { name: 'Plum Wine', hex: '#581845' },
          { name: 'Charcoal Grey', hex: '#36454F' }
        ],
        tryColors: [
          { name: 'Cobalt Blue', hex: '#0047AB' },
          { name: 'Baby Pink', hex: '#F4C2C2' },
          { name: 'Pure Snow White', hex: '#FFFFFF' }
        ],
        contrastColors: [
          { name: 'Mustard Ochre', hex: '#B8860B' },
          { name: 'Bright Orange Tangerine', hex: '#FFA500' },
          { name: 'Muddy Earth Yellow', hex: '#9B7653' }
        ]
      };
    } else {
      return {
        tone: 'Neutral Tone',
        confidence,
        veinAppearance: 'เส้นเลือดมีทั้งสีเขียวปนน้ำเงินอมม่วง หรือแยกสีได้ไม่ชัดเจน',
        sunReaction: 'เมื่อโดนแดดอาจมีรอยแดงเล็กน้อย จากนั้นจะปรับเป็นสีแทนอย่างสม่ำเสมอ',
        jewelryComplement: 'สวมใส่ได้ทั้งเครื่องประดับทอง เงิน และโรสโกลด์ (Rose Gold) เข้ากับผิวได้ทุกแบบ',
        description: 'ผิวของคุณมีความสมดุลระหว่างโทนเหลืองและชมพูอย่างลงตัว เป็นโทนผิวที่ยืดหยุ่นมาก สามารถสนุกกับเฉดสีได้หลากหลาย',
        bestColors: [
          { name: 'Dusty Rose', hex: '#CB7F86' },
          { name: 'Almond Nude', hex: '#C88A75' },
          { name: 'Champagne Glow', hex: '#E5C992' },
          { name: 'Soft Sage', hex: '#9CAF88' },
          { name: 'Muted Navy', hex: '#264E70' },
          { name: 'Warm Taupe', hex: '#967468' }
        ],
        tryColors: [
          { name: 'Mauve Pink', hex: '#E0B0FF' },
          { name: 'Peach Coral', hex: '#F88379' },
          { name: 'Soft Denim', hex: '#5B84B1' }
        ],
        contrastColors: [
          { name: 'Ultra Saturated Neon Yellow', hex: '#DFFF00' },
          { name: 'Harsh Matte Black', hex: '#000000' }
        ]
      };
    }
  },

  // Face shape analysis
  async analyzeFaceShape(params: {
    imageBase64?: string;
    shapeSelect?: FaceShapeType;
  }): Promise<FaceShapeResult> {
    const shape: FaceShapeType = params.shapeSelect || 'Oval';

    const thaiNames: Record<FaceShapeType, string> = {
      Oval: 'รูปหน้าไข่ (Oval Shape)',
      Round: 'รูปหน้ากลม (Round Shape)',
      Square: 'รูปหน้าเหลี่ยม (Square Shape)',
      Rectangle: 'รูปหน้ายาว / สี่เหลี่ยมผืนผ้า (Rectangle Shape)',
      Heart: 'รูปหน้ารูปหัวใจ (Heart Shape)',
      Diamond: 'รูปหน้าเพชร (Diamond Shape)'
    };

    const descriptions: Record<FaceShapeType, string> = {
      Oval: 'รูปหน้าของคุณมีสัดส่วนที่สมดุลเป็นธรรมชาติ ความยาวของใบหน้าได้สัดส่วนกับความกว้าง โหนกแก้มโค้งมนนุ่มนวล และคางสอบมนพอดี',
      Round: 'รูปหน้าของคุณมีความโค้งมนนุ่มนวล ความกว้างและความยาวของใบหน้าใกล้เคียงกัน พวงแก้มอิ่มสดใส ดูอ่อนเยาว์และมีเสน่ห์เป็นธรรมชาติ',
      Square: 'รูปหน้าของคุณมีโครงสร้างสันกรามที่คมชัดได้รูป หน้าผากและโหนกแก้มกว้างใกล้เคียงกับแนวขากรรไกร ให้ลุคที่มั่นใจ โฉบเฉี่ยว และทรงพลัง',
      Rectangle: 'รูปหน้าของคุณมีมิติตามแนวยาวที่สง่างาม สัดส่วนหน้าผากและขากรรไกรสมดุล ให้ความรู้สึกภูมิฐาน ฉลาด และมีบุคลิกภาพโดดเด่น',
      Heart: 'รูปหน้าของคุณมีช่วงหน้าผากกว้างรับกับโหนกแก้มสวย และค่อยๆ เรียวลงสู่ปลายคางที่ได้รูป ชวนมองและดึงดูดสายตาอย่างมีเสน่ห์',
      Diamond: 'รูปหน้าของคุณมีโหนกแก้มที่เด่นชัดสวยงาม หน้าผากและคางเรียวสอบ ให้มิติแสงเงาที่คมชัดและขึ้นกล้องเป็นพิเศษ'
    };

    const tips: Record<FaceShapeType, string> = {
      Oval: 'รูปหน้ารูปไข่สามารถเลือกทรงผมได้หลากหลายเกือบทุกสไตล์ ทั้งผมสั้น ผมยาว หรือหน้าม้า เน้นเปิดกรอบหน้าให้เห็นความสมดุล',
      Round: 'ทรงผมที่มีเลเยอร์สไลซ์ข้าง ปอยผมเคลียแก้ม หรือการเซ็ตยกโคนสูง (Volume at top) จะช่วยสร้างมิติและนำสายตาให้ดูเรียวละมุนขึ้น',
      Square: 'ลอนคลื่นนุ่มนวล (Soft waves) เลเยอร์พริ้วไหว หรือหน้าม้าปัดข้างเคิร์ทเท่นแบงส์ ช่วยลดทอนความแข็งของแนวกราม ให้ลุคชิคละมุน',
      Rectangle: 'ทรงผมที่มีวอลลุ่มด้านข้าง เลเยอร์ระดับบ่า หรือหน้าม้าซีทรู จะช่วยปรับสัดส่วนความยาวให้ดูกลมกลืนลงตัว',
      Heart: 'ทรงผมที่มีวอลลุ่มช่วงปลายคาง เช่น บ็อบสไลซ์ปลาย หรือผมดัดลอนคลายระดับอก จะช่วยบาลานซ์ความกว้างของหน้าผากได้อย่างงดงาม',
      Diamond: 'ทรงผมประบ่ามีเลเยอร์ หรือหน้าม้าปัดข้าง จะช่วยเน้นโหนกแก้มอันเป็นเอกลักษณ์ของคุณให้ดูนุ่มนวลและมีเสน่ห์ดึงดูด'
    };

    // Filter hairstyle recommendations
    const matchingHair = INITIAL_HAIRSTYLES.filter(h => h.faceShapes.includes(shape)).slice(0, 4);

    return {
      shape,
      thaiName: thaiNames[shape],
      confidence: 93,
      description: descriptions[shape],
      bestHairStyles: matchingHair.map(h => ({
        name: h.name,
        category: h.category as any,
        lookType: h.looks[0] as any,
        description: h.description,
        stylingTips: h.stylingTips
      })),
      stylingTips: tips[shape]
    };
  },

  // Body proportion analysis (respectful, neutral terminology, silhouette balancing)
  async analyzeBodyProportion(params: {
    proportionType?: BodyProportionType;
  }): Promise<BodyProportionResult> {
    const type: BodyProportionType = params.proportionType || 'Straight';

    const results: Record<BodyProportionType, BodyProportionResult> = {
      Straight: {
        type: 'Straight',
        thaiName: 'สัดส่วนแนวตรง (Straight / Column)',
        generalDescription: 'สัดส่วนช่วงไหล่ เอว และสะโพกมีความกว้างใกล้เคียงกันเป็นแนวเส้นตรงที่สง่างาม คล่องแคล่ว และแมตช์เสื้อผ้าได้หลากหลายทรง',
        clothingFocus: 'การสร้างเส้นสายและมิติด้วยเข็มขัด การตัดต่อลายผ้า หรือโครงเสื้อผ้าที่ทิ้งตัวมีมิติ',
        topAdvice: 'เสื้อคอวี คอเหลี่ยม เสื้อที่มีดีเทลระบายช่วงอก หรือเสื้อครอปจับคู่กับเข็มขัดเพื่อเน้นเอว',
        bottomAdvice: 'กางเกงขากระบอกตรง (Straight Leg), กางเกงพับจีบ หรือกระโปรงทรงเอ (A-Line) ที่ช่วยเพิ่มความพริ้วไหว',
        layeringAdvice: 'สวมแจ็คเก็ตแบบเปิดกระดุมหน้า หรือคาร์ดิแกนที่ยาวระดับสะโพกเพื่อนำสายตาเป็นแนวตั้ง',
        silhouetteAdvice: 'สร้างลูกเล่นความสมดุลด้วยการจับคู่ชิ้นบนพอดีตัวกับชิ้นล่างทรงบาน หรือเพิ่มเข็มขัดชิ้นโปรด'
      },
      Triangle: {
        type: 'Triangle',
        thaiName: 'สัดส่วนทรงสามเหลี่ยม (Triangle / Pear)',
        generalDescription: 'สัดส่วนช่วงสะโพกและต้นขามีความเด่นชัดสวยงาม ช่วงไหล่และหน้าอกมีความเพรียวนุ่มนวล',
        clothingFocus: 'การสร้างความสมดุลโดยดึงดูดสายตาสู่ช่วงบน และเลือกท่อนล่างที่ทิ้งตัวสบาย',
        topAdvice: 'เสื้อเปิดไหล่ (Off-shoulder), เสื้อแขนพอง, เสื้อปกกว้าง หรือเสื้อที่มีลวดลายและสีสันสดใส',
        bottomAdvice: 'กางเกงผ้าทิ้งตัวขากว้าง (Wide-leg), กางเกงเอวสูงสีเข้ม หรือกระโปรงทรงบานพลิ้วไหว',
        layeringAdvice: 'เสื้อเบลเซอร์หรือแจ็คเก็ตที่มีโครงสร้างช่วงไหล่เล็กน้อย ความยาวคลุมเหนือหรือใต้สะโพก',
        silhouetteAdvice: 'เน้นสีสว่างหรือลูกเล่นที่ท่อนบน คู่กับท่อนล่างสีเอิร์ธหรือสีพื้นเรียบเพื่อความสง่างาม'
      },
      'Inverted Triangle': {
        type: 'Inverted Triangle',
        thaiName: 'สัดส่วนทรงสามเหลี่ยมคว่ำ (Inverted Triangle)',
        generalDescription: 'สัดส่วนช่วงไหล่และหลังมีโครงสร้างสง่า มั่นคง และช่วงสะโพกเรียวเพรียว',
        clothingFocus: 'การสร้างความโปร่งสบายช่วงไหล่และเพิ่มมิติความเคลื่อนไหวให้กับท่อนล่าง',
        topAdvice: 'เสื้อคอวี เสื้อคอยู หรือเสื้อแขนสโลป (Raglan) โทนสีเรียบ ไม่เสริมฟองน้ำหนา',
        bottomAdvice: 'กางเกงคาร์โก้, กางเกงทรงบอลลูน, กระโปรงพลีท หรือกางเกงยีนส์ขากระบอกใหญ่',
        layeringAdvice: 'เสื้อคลุมตัวยาวผ่าหน้า หรือคาร์ดิแกนคอเปิดที่ไม่เพิ่มวอลลุ่มช่วงไหล่',
        silhouetteAdvice: 'จับคู่ท่อนบนโทนสีเข้มหรือดีไซน์คลีน กับท่อนล่างที่มีลูกเล่นกระเป๋าหรือสีสันสดใส'
      },
      Hourglass: {
        type: 'Hourglass',
        thaiName: 'สัดส่วนทรงนาฬิกาทราย (Hourglass)',
        generalDescription: 'สัดส่วนช่วงไหล่และสะโพกมีความกว้างสมดุลกันอย่างเป็นธรรมชาติ พร้อมแนวเอวที่คอดชัดเจน',
        clothingFocus: 'การเน้นแนวเส้นโค้งตามธรรมชาติของสรีระ และเลือกเนื้อผ้าที่โอบรับอย่างนุ่มนวล',
        topAdvice: 'เสื้อป้ายอก (Wrap Top), เสื้อคอหัวใจ หรือเสื้อผ้าถักเนื้อนุ่มที่เข้ารูปพอดีตัว',
        bottomAdvice: 'กางเกงเอวสูงทรงตรง, กระโปรงทรงสอบผ่าข้าง หรือกระโปรงผ้าซาตินพริ้ว',
        layeringAdvice: 'เสื้อโค้ตหรือเบลเซอร์ที่มีเชือกผูกเอว (Belted Trench/Blazer)',
        silhouetteAdvice: 'รักษาแนวเอวให้เห็นเด่นชัด หลีกเลี่ยงเสื้อผ้าทรงกล่องหนาเตอะที่บังเส้นสายธรรมชาติ'
      },
      Rectangle: {
        type: 'Rectangle',
        thaiName: 'สัดส่วนทรงสี่เหลี่ยมผืนผ้า (Rectangle)',
        generalDescription: 'สัดส่วนลำตัวมีโครงสร้างเรียบเท่ ทันสมัย เป็นทรงที่เหมาะกับแฟชั่นแนวสตรีท มินิมอล และเทเลอร์สูท',
        clothingFocus: 'การเล่นกับเลเยอร์ ความสั้นยาว และโครงสร้างผ้าที่มีเท็กซ์เจอร์',
        topAdvice: 'เสื้อเชิ้ตโอเวอร์ไซส์, สเวตเตอร์ไหมพรมถักลาย, เสื้อคอปีน',
        bottomAdvice: 'กางเกงทรงชิโน่หลวม, กางเกงยีนส์เดนิมพับขา, กระโปรงพลีทมีมิติ',
        layeringAdvice: 'เสื้อกั๊ก (Vest) ทับเชิ้ต หรือสวมแจ็คเก็ตบอมเบอร์เพิ่มมิติ',
        silhouetteAdvice: 'ใช้เทคนิค Layering 2-3 ชั้นเพื่อสร้างความมีมิติและน่าค้นหา'
      },
      'Custom / Not sure': {
        type: 'Custom / Not sure',
        thaiName: 'สัดส่วนเฉพาะบุคคล (Custom / Free Flow)',
        generalDescription: 'สไตล์ของคุณไร้ขีดจำกัด การแต่งกายเป็นเรื่องของความมั่นใจ ความสบาย และความสุขในทุกๆ วัน',
        clothingFocus: 'เน้นความสบายตัว การเลือกเนื้อผ้าระบายอากาศดี และซิลูเอทที่ทำให้คุณยิ้มได้หน้ากระจก',
        topAdvice: 'เสื้อที่คุณสวมแล้วรู้สึกมั่นใจ คล่องตัว ไม่รัดแน่นเกินไป',
        bottomAdvice: 'กางเกงหรือกระโปรงที่มีขอบเอวยืดหยุ่นได้ดี เคลื่อนไหวได้อิสระ',
        layeringAdvice: 'คาร์ดิแกนหรือแจ็คเก็ตน้ำหนักเบาที่สามารถสวมใส่และถอดเก็บได้ง่าย',
        silhouetteAdvice: 'ให้ความสำคัญกับ “ความรู้สึกสบายและความมั่นใจ” เป็นอันดับหนึ่ง'
      }
    };

    return results[type] || results['Straight'];
  },

  // Generate complete look
  async generateCompleteLook(params: {
    skinTone: SkinToneType;
    faceShape: FaceShapeType;
    bodyProportion: BodyProportionType;
    selectedStyles: string[];
    occasion?: string;
    festival?: string;
    hairPref?: string;
  }): Promise<CompleteLook> {
    const occ = params.occasion || 'ไปคาเฟ่';
    const primaryStyle = params.selectedStyles[0] || 'Korean';
    const isFestival = !!params.festival;

    // Palette based on skin tone
    let basePalette = params.skinTone === 'Warm Tone' ? WARM_TONE_PALETTE : params.skinTone === 'Cool Tone' ? COOL_TONE_PALETTE : NEUTRAL_TONE_PALETTE;

    // Harmonized makeup
    let makeupSummary = '';
    if (params.skinTone === 'Warm Tone') {
      makeupSummary = 'รองพื้นผิวโกลว์ W20-W25, บลัชออนสีพีชแอปริคอตนุ่มละมุน, ลิปโทนคอรัลกำมะหยี่ และอายแชโดว์ประกายแชมเปญบรอนซ์';
    } else if (params.skinTone === 'Cool Tone') {
      makeupSummary = 'รองพื้นโทน C15-C20, บลัชมอฟกลีบกุหลาบเย็น, ลิปสติกสีเบอร์รี่โรสฉ่ำวาว และอายแชโดว์คูลโทปประกายมุกเงิน';
    } else {
      makeupSummary = 'รองพื้นบาลานซ์ N20, บลัชออนดัสตี้โรสธรรมชาติ, ลิปอัลมอนด์นู้ดซาติน และอายไลเนอร์สีน้ำตาลซอฟต์';
    }

    // Hair summary
    const hair = INITIAL_HAIRSTYLES.find(h => h.faceShapes.includes(params.faceShape)) || INITIAL_HAIRSTYLES[0];
    const hairSummary = `${hair.name} (${hair.thaiName}) - ${hair.stylingTips}`;

    // Outfit matching
    const matchingOutfit = INITIAL_OUTFITS.find(o => o.occasion === occ || o.style === primaryStyle) || INITIAL_OUTFITS[0];

    const title = isFestival 
      ? `✨ Festive Look: ${params.festival} (${primaryStyle} Style)`
      : `✨ Signature ${primaryStyle} Look for ${occ}`;

    const theme = `${primaryStyle} Fashion Harmony with ${params.skinTone}`;

    const harmonyExplanation = `ลุคนี้ถูกออกแบบมาเพื่อขับจุดเด่นของสีผิว ${params.skinTone} ด้วยคู่สีที่ส่งเสริมกันอย่างสมบูรณ์แบบ รูปหน้า ${params.faceShape} ได้รับการเสริมมิติด้วยทรงผม ${hair.category} และโครงสร้างชุดได้รับการปรับแต่งให้เหมาะกับสรีระ ${params.bodyProportion} ทำให้คุณดูโดดเด่น สบายตัว และมั่นใจเต็มเปี่ยมในโอกาส ${occ}`;

    return {
      id: `look_${Date.now()}`,
      title,
      date: new Date().toISOString().substring(0, 10),
      theme,
      occasion: occ,
      festival: params.festival,
      vibe: matchingOutfit.description,
      skinTone: params.skinTone,
      faceShape: params.faceShape,
      bodyProportion: params.bodyProportion,
      makeupSummary,
      hairSummary,
      top: matchingOutfit.top,
      bottom: matchingOutfit.bottom,
      shoes: matchingOutfit.shoes,
      accessories: matchingOutfit.accessories,
      colorPalette: basePalette.slice(0, 4),
      harmonyExplanation,
      isFavorite: false
    };
  }
};
