import {
  MakeupCatalogItem,
  HairstyleCatalogItem,
  OutfitCatalogItem,
  OccasionCatalogItem,
  FestivalCatalogItem,
  StyleCategoryCatalogItem,
  User,
  AdminLog,
  FullAnalysisResult,
  CompleteLook,
  UserProfileData
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ADMIN_LOGS,
  INITIAL_MAKEUP,
  INITIAL_HAIRSTYLES,
  INITIAL_OUTFITS,
  INITIAL_OCCASIONS,
  INITIAL_FESTIVALS,
  INITIAL_STYLES
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'stylematch_users',
  CURRENT_USER: 'stylematch_current_user',
  ADMIN_PASSCODE: 'stylematch_admin_passcode',
  MAKEUP: 'stylematch_catalog_makeup',
  HAIRSTYLES: 'stylematch_catalog_hairstyles',
  OUTFITS: 'stylematch_catalog_outfits',
  OCCASIONS: 'stylematch_catalog_occasions',
  FESTIVALS: 'stylematch_catalog_festivals',
  STYLES: 'stylematch_catalog_styles',
  ADMIN_LOGS: 'stylematch_admin_logs',
  SAVED_LOOKS: 'stylematch_saved_looks',
  LATEST_ANALYSIS: 'stylematch_latest_analysis',
  USER_PROFILES: 'stylematch_user_profiles',
  ANALYSIS_COUNT: 'stylematch_total_analyses'
};

const DEFAULT_ADMIN_PASSCODE = 'admin1234';

// Helper for local storage with fallback
function getStoredJson<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultVal;
  }
}

function setStoredJson<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Passcode
  getAdminPasscode(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE) || DEFAULT_ADMIN_PASSCODE;
  },
  setAdminPasscode(newCode: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, newCode);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'SYSTEM',
      target: 'Security',
      details: 'อัปเดตรหัสผ่านระบบหลังบ้าน (Admin Passcode)'
    });
  },

  // Users
  getUsers(): User[] {
    return getStoredJson<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users: User[]): void {
    setStoredJson(STORAGE_KEYS.USERS, users);
  },
  getCurrentUser(): User | null {
    return getStoredJson<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user: User | null): void {
    setStoredJson(STORAGE_KEYS.CURRENT_USER, user);
  },
  updateUserStatus(userId: string, status: 'active' | 'disabled'): void {
    const users = this.getUsers().map(u => u.id === userId ? { ...u, status } : u);
    this.saveUsers(users);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'USER_STATUS',
      target: `User ${userId}`,
      details: `เปลี่ยนสถานะบัญชีเป็น ${status}`
    });
  },

  // Makeup Catalog
  getMakeup(): MakeupCatalogItem[] {
    return getStoredJson<MakeupCatalogItem[]>(STORAGE_KEYS.MAKEUP, INITIAL_MAKEUP);
  },
  saveMakeup(items: MakeupCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.MAKEUP, items);
  },
  addMakeup(item: MakeupCatalogItem): void {
    const list = [item, ...this.getMakeup()];
    this.saveMakeup(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'CREATE',
      target: `Makeup: ${item.name}`,
      details: `เพิ่มข้อมูลเครื่องสำอางหมวด ${item.category}`
    });
  },
  updateMakeup(item: MakeupCatalogItem): void {
    const list = this.getMakeup().map(i => i.id === item.id ? item : i);
    this.saveMakeup(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'UPDATE',
      target: `Makeup: ${item.name}`,
      details: `แก้ไขข้อมูลเครื่องสำอาง ${item.name}`
    });
  },
  deleteMakeup(id: string): void {
    const list = this.getMakeup().filter(i => i.id !== id);
    this.saveMakeup(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'DELETE',
      target: `Makeup ID: ${id}`,
      details: `ลบข้อมูลเครื่องสำอาง`
    });
  },

  // Hairstyles
  getHairstyles(): HairstyleCatalogItem[] {
    return getStoredJson<HairstyleCatalogItem[]>(STORAGE_KEYS.HAIRSTYLES, INITIAL_HAIRSTYLES);
  },
  saveHairstyles(items: HairstyleCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.HAIRSTYLES, items);
  },
  addHairstyle(item: HairstyleCatalogItem): void {
    const list = [item, ...this.getHairstyles()];
    this.saveHairstyles(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'CREATE',
      target: `Hairstyle: ${item.name}`,
      details: `เพิ่มข้อมูลทรงผม ${item.name}`
    });
  },
  updateHairstyle(item: HairstyleCatalogItem): void {
    const list = this.getHairstyles().map(i => i.id === item.id ? item : i);
    this.saveHairstyles(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'UPDATE',
      target: `Hairstyle: ${item.name}`,
      details: `แก้ไขข้อมูลทรงผม ${item.name}`
    });
  },
  deleteHairstyle(id: string): void {
    const list = this.getHairstyles().filter(i => i.id !== id);
    this.saveHairstyles(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'DELETE',
      target: `Hairstyle ID: ${id}`,
      details: `ลบข้อมูลทรงผม`
    });
  },

  // Outfits
  getOutfits(): OutfitCatalogItem[] {
    return getStoredJson<OutfitCatalogItem[]>(STORAGE_KEYS.OUTFITS, INITIAL_OUTFITS);
  },
  saveOutfits(items: OutfitCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.OUTFITS, items);
  },
  addOutfit(item: OutfitCatalogItem): void {
    const list = [item, ...this.getOutfits()];
    this.saveOutfits(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'CREATE',
      target: `Outfit: ${item.title}`,
      details: `เพิ่มชุดแต่งกายสไตล์ ${item.style}`
    });
  },
  updateOutfit(item: OutfitCatalogItem): void {
    const list = this.getOutfits().map(i => i.id === item.id ? item : i);
    this.saveOutfits(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'UPDATE',
      target: `Outfit: ${item.title}`,
      details: `แก้ไขข้อมูลชุด ${item.title}`
    });
  },
  deleteOutfit(id: string): void {
    const list = this.getOutfits().filter(i => i.id !== id);
    this.saveOutfits(list);
    this.addAdminLog({
      adminName: 'Admin',
      action: 'DELETE',
      target: `Outfit ID: ${id}`,
      details: `ลบข้อมูลชุดแต่งกาย`
    });
  },

  // Occasions
  getOccasions(): OccasionCatalogItem[] {
    return getStoredJson<OccasionCatalogItem[]>(STORAGE_KEYS.OCCASIONS, INITIAL_OCCASIONS);
  },
  saveOccasions(items: OccasionCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.OCCASIONS, items);
  },

  // Festivals
  getFestivals(): FestivalCatalogItem[] {
    return getStoredJson<FestivalCatalogItem[]>(STORAGE_KEYS.FESTIVALS, INITIAL_FESTIVALS);
  },
  saveFestivals(items: FestivalCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.FESTIVALS, items);
  },

  // Styles
  getStyles(): StyleCategoryCatalogItem[] {
    return getStoredJson<StyleCategoryCatalogItem[]>(STORAGE_KEYS.STYLES, INITIAL_STYLES);
  },
  saveStyles(items: StyleCategoryCatalogItem[]): void {
    setStoredJson(STORAGE_KEYS.STYLES, items);
  },

  // Admin Logs
  getAdminLogs(): AdminLog[] {
    return getStoredJson<AdminLog[]>(STORAGE_KEYS.ADMIN_LOGS, INITIAL_ADMIN_LOGS);
  },
  addAdminLog(log: Omit<AdminLog, 'id' | 'timestamp'>): void {
    const logs = this.getAdminLogs();
    const newLog: AdminLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setStoredJson(STORAGE_KEYS.ADMIN_LOGS, [newLog, ...logs.slice(0, 49)]);
  },

  // Latest Analysis Result
  getLatestAnalysis(): FullAnalysisResult | null {
    return getStoredJson<FullAnalysisResult | null>(STORAGE_KEYS.LATEST_ANALYSIS, null);
  },
  setLatestAnalysis(res: FullAnalysisResult): void {
    setStoredJson(STORAGE_KEYS.LATEST_ANALYSIS, res);
    const count = this.getAnalysisCount() + 1;
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_COUNT, String(count));
  },
  getAnalysisCount(): number {
    const val = localStorage.getItem(STORAGE_KEYS.ANALYSIS_COUNT);
    return val ? parseInt(val, 10) : 142; // realistic starting count
  },

  // Saved Looks
  getSavedLooks(): CompleteLook[] {
    return getStoredJson<CompleteLook[]>(STORAGE_KEYS.SAVED_LOOKS, [
      {
        id: 'look_sample_01',
        title: 'Cafe Hopping Soft Korean Look',
        date: '2026-09-25',
        theme: 'Korean Aesthetic & Warm Harmony',
        occasion: 'ไปคาเฟ่',
        vibe: 'ละมุน สบายตา ถ่ายรูปขึ้นกล้อง',
        skinTone: 'Warm Tone',
        faceShape: 'Oval',
        bodyProportion: 'Straight',
        makeupSummary: 'พีชคอรัลซาติน ตาประกายแชมเปญ และพวงแก้มแอปริคอตส้มระเรื่อ',
        hairSummary: 'เคิร์ทเท่นแบงส์พร้อมซอฟต์เลเยอร์ ปลายงุ้มรับกรอบหน้า',
        top: 'เสื้อเชิ้ตลินินโอเวอร์ไซส์สีครีมข้าวโอ๊ต',
        bottom: 'กางเกงขายาวขาตรงผ้าฝ้ายสีน้ำตาลทราย',
        outerwear: 'คาร์ดิแกนไหมพรมบางสีอัลมอนด์พาดไหล่',
        shoes: 'สนีกเกอร์หนังมินิมอลสีขาว',
        accessories: 'กระเป๋าผ้าแคนวาสและแว่นตากรอบเงิน',
        colorPalette: [
          { name: 'Oatmeal Cream', hex: '#FFFDD0' },
          { name: 'Warm Apricot', hex: '#F4A281' },
          { name: 'Sand Brown', hex: '#B38B6D' },
          { name: 'Sage Accent', hex: '#9CAF88' }
        ],
        harmonyExplanation: 'การเลือกคู่สีอบอุ่นแบบ Monochromatic ช่วยให้ผิววอร์มโทนดูผ่องและสดใส เข้ากับบรรยากาศคาเฟ่ได้อย่างลงตัว',
        isFavorite: true
      },
      {
        id: 'look_sample_02',
        title: 'Smart Presentation Power Look',
        date: '2026-09-27',
        theme: 'Modern Professional & High Confidence',
        occasion: 'ไปสัมภาษณ์',
        vibe: 'น่าเชื่อถือ สง่างาม ทันสมัย',
        skinTone: 'Cool Tone',
        faceShape: 'Heart',
        bodyProportion: 'Triangle',
        makeupSummary: 'เบอร์รี่โรสฉ่ำวาว อายแชโดว์คูลโทป และคิ้วเรียงเส้นธรรมชาติ',
        hairSummary: 'บ็อบปลายตรงทัดหูข้างหนึ่ง เสริมความมั่นใจ',
        top: 'เสื้อเบลเซอร์สีกรมท่าทรงเทเลอร์ ทับเสื้อยืดพรีเมียมสีขาว',
        bottom: 'กางเกงสแล็คเอวสูงขาตรงสีดำสนิท',
        shoes: 'รองเท้าโลฟเฟอร์หนังเรียบสีดำ',
        accessories: 'เข็มขัดหนังหัวเหลี่ยมเงิน นาฬิกาข้อมือสายเหล็ก',
        colorPalette: [
          { name: 'Deep Navy', hex: '#1B263B' },
          { name: 'Cool Berry', hex: '#BD3B67' },
          { name: 'Crisp White', hex: '#FFFFFF' },
          { name: 'Slate Grey', hex: '#708090' }
        ],
        harmonyExplanation: 'คู่สีกรมท่าและเบอร์รี่โรสช่วยดึงความสว่างของคูลโทนออกมา โครงสร้างเบลเซอร์ช่วยสร้างสมดุลของช่วงไหล่ให้สง่างาม',
        isFavorite: true
      }
    ]);
  },
  saveLook(look: CompleteLook): void {
    const current = this.getSavedLooks();
    const existingIdx = current.findIndex(l => l.id === look.id);
    if (existingIdx >= 0) {
      current[existingIdx] = look;
      setStoredJson(STORAGE_KEYS.SAVED_LOOKS, current);
    } else {
      setStoredJson(STORAGE_KEYS.SAVED_LOOKS, [look, ...current]);
    }
  },
  deleteSavedLook(id: string): void {
    const current = this.getSavedLooks().filter(l => l.id !== id);
    setStoredJson(STORAGE_KEYS.SAVED_LOOKS, current);
  },

  // User Profile
  getUserProfile(userId: string): UserProfileData {
    const profiles = getStoredJson<Record<string, UserProfileData>>(STORAGE_KEYS.USER_PROFILES, {});
    return profiles[userId] || {
      skinTone: 'Warm Tone',
      faceShape: 'Oval',
      bodyProportion: 'Straight',
      favoriteStyles: ['Korean', 'Casual', 'Minimal'],
      favoriteColors: ['#F4A281', '#E3DAC9', '#1B263B'],
      hairPreferences: ['Curtain Bangs', 'Layer', 'Soft Wave'],
      bio: 'กำลังค้นหาสไตล์ที่ใช่และมั่นใจในตัวเองทุกวัน ✨'
    };
  },
  saveUserProfile(userId: string, data: UserProfileData): void {
    const profiles = getStoredJson<Record<string, UserProfileData>>(STORAGE_KEYS.USER_PROFILES, {});
    profiles[userId] = data;
    setStoredJson(STORAGE_KEYS.USER_PROFILES, profiles);
  }
};
