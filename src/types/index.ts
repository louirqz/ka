export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
  lastActive: string;
  status: 'active' | 'disabled';
  avatarUrl?: string;
  savedLookCount?: number;
}

export type SkinToneType = 'Cool Tone' | 'Warm Tone' | 'Neutral Tone';

export type FaceShapeType = 'Oval' | 'Round' | 'Square' | 'Rectangle' | 'Heart' | 'Diamond';

export type BodyProportionType =
  | 'Straight'
  | 'Triangle'
  | 'Inverted Triangle'
  | 'Hourglass'
  | 'Rectangle'
  | 'Custom / Not sure';

export interface ColorItem {
  name: string;
  hex: string;
  pantone?: string;
  category?: string;
}

export interface MakeupRecommendation {
  foundation: {
    undertone: string;
    advice: string;
    recommendedShades: string[];
  };
  blush: {
    categoryName: string;
    colors: ColorItem[];
    applicationTips: string;
  };
  lip: {
    categoryName: string;
    colors: ColorItem[];
    finishRecommendation: string;
    applicationTips: string;
  };
  eyeshadow: {
    categoryName: string;
    palette: ColorItem[];
    applicationTips: string;
  };
}

export interface HairstyleItemRecommendation {
  name: string;
  category: 'Short' | 'Long' | 'Layer' | 'Bob' | 'Wolf Cut' | 'Curtain Bangs' | 'Two Block' | 'Side Part' | 'Undercut' | 'Pixie' | 'Wavy' | 'Straight';
  lookType: 'Clean' | 'Casual' | 'Smart' | 'Cute' | 'Cool' | 'Korean' | 'Sporty' | 'Chic';
  description: string;
  stylingTips: string;
  matchScore?: number;
  genderNeutral?: boolean;
}

export interface OutfitRecommendation {
  top: string;
  bottom: string;
  outerwear?: string;
  shoes: string;
  accessories: string[];
  colorPalette: ColorItem[];
  silhouetteBalance: string;
  layeringTip: string;
  whyItWorks: string;
}

export interface CompleteLook {
  id: string;
  title: string;
  date: string;
  theme: string;
  occasion: string;
  festival?: string;
  vibe: string;
  skinTone: SkinToneType;
  faceShape: FaceShapeType;
  bodyProportion: BodyProportionType;
  makeupSummary: string;
  hairSummary: string;
  top: string;
  bottom: string;
  outerwear?: string;
  shoes: string;
  accessories: string;
  colorPalette: ColorItem[];
  harmonyExplanation: string;
  isFavorite?: boolean;
}

export interface SkinAnalysisResult {
  tone: SkinToneType;
  confidence: number;
  veinAppearance: string;
  sunReaction: string;
  jewelryComplement: string;
  description: string;
  bestColors: ColorItem[];
  tryColors: ColorItem[];
  contrastColors: ColorItem[];
}

export interface FaceShapeResult {
  shape: FaceShapeType;
  thaiName: string;
  confidence: number;
  description: string;
  bestHairStyles: HairstyleItemRecommendation[];
  stylingTips: string;
}

export interface BodyProportionResult {
  type: BodyProportionType;
  thaiName: string;
  generalDescription: string;
  clothingFocus: string;
  topAdvice: string;
  bottomAdvice: string;
  layeringAdvice: string;
  silhouetteAdvice: string;
}

export interface FullAnalysisResult {
  id: string;
  createdAt: string;
  method: 'image' | 'quiz' | 'custom';
  photoUrl?: string;
  skinTone: SkinAnalysisResult;
  faceShape: FaceShapeResult;
  bodyProportion: BodyProportionResult;
  makeup: MakeupRecommendation;
  hairstyles: HairstyleItemRecommendation[];
  outfit: OutfitRecommendation;
  selectedStyles: string[];
  occasion?: string;
  festival?: string;
  completeLook?: CompleteLook;
}

export interface MakeupCatalogItem {
  id: string;
  name: string;
  thaiName: string;
  category: 'Lip' | 'Blush' | 'Eyeshadow' | 'Foundation';
  tone: 'Warm Tone' | 'Cool Tone' | 'Neutral Tone' | 'All';
  hexCode: string;
  colorName: string;
  finish: 'Matte' | 'Glossy' | 'Velvet' | 'Satin' | 'Shimmer';
  description: string;
  suitableOccasions: string[];
}

export interface HairstyleCatalogItem {
  id: string;
  name: string;
  thaiName: string;
  category: string;
  faceShapes: FaceShapeType[];
  looks: string[];
  description: string;
  stylingTips: string;
  genderNeutral: boolean;
  length: 'Short' | 'Medium' | 'Long';
}

export interface OutfitCatalogItem {
  id: string;
  title: string;
  thaiTitle: string;
  style: string;
  occasion: string;
  season: 'All' | 'Summer' | 'Winter' | 'Rainy';
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  colors: string[];
  hexPalette: string[];
  description: string;
  genderNeutral: boolean;
  imageUrl?: string;
}

export interface OccasionCatalogItem {
  id: string;
  name: string;
  thaiName: string;
  category: 'School/Uni' | 'Casual' | 'Social' | 'Work/Formal' | 'Relax';
  recommendedColors: string[];
  colorHexes: string[];
  vibe: string;
  stylingKey: string;
  topSuggestion: string;
  bottomSuggestion: string;
  shoeSuggestion: string;
}

export interface FestivalCatalogItem {
  id: string;
  name: string;
  thaiName: string;
  dateOrSeason: string;
  recommendedStyle: string;
  recommendedColors: string[];
  colorHexes: string[];
  outfitIdeas: string;
  makeupVibe: string;
  hairVibe: string;
}

export interface StyleCategoryCatalogItem {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  keyPieces: string[];
  signatureColors: string[];
  colorHexes: string[];
  vibeKeywords: string[];
}

export interface AdminLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SYSTEM' | 'USER_STATUS';
  target: string;
  details: string;
}

export interface UserProfileData {
  skinTone?: SkinToneType;
  faceShape?: FaceShapeType;
  bodyProportion?: BodyProportionType;
  favoriteStyles: string[];
  favoriteColors: string[];
  hairPreferences: string[];
  bio?: string;
}
