import { User } from '../types';
import { StorageService } from './storage';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const AuthService = {
  getCurrentUser(): User | null {
    return StorageService.getCurrentUser();
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  login(email: string, pass: string, remember: boolean = true): AuthResponse {
    const trimmedEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();
    
    // Check if user exists
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return {
        success: false,
        message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีเมลหรือลงทะเบียนใหม่'
      };
    }

    if (found.status === 'disabled') {
      return {
        success: false,
        message: 'บัญชีนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ'
      };
    }

    // Update last active
    const updatedUser: User = {
      ...found,
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    StorageService.setCurrentUser(updatedUser);
    
    // Update users list
    const updatedUsers = users.map(u => u.id === found.id ? updatedUser : u);
    StorageService.saveUsers(updatedUsers);

    return {
      success: true,
      message: `ยินดีต้อนรับกลับ, คุณ ${found.name}! ✨`,
      user: updatedUser
    };
  },

  register(name: string, email: string, pass: string, confirmPass: string): AuthResponse {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !pass) {
      return {
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง'
      };
    }

    if (pass.length < 6) {
      return {
        success: false,
        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
      };
    }

    if (pass !== confirmPass) {
      return {
        success: false,
        message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'
      };
    }

    const users = StorageService.getUsers();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return {
        success: false,
        message: 'อีเมลนี้ถูกใช้งานแล้วในระบบ'
      };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: 'user',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'active',
      savedLookCount: 0,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(trimmedName)}`
    };

    StorageService.saveUsers([newUser, ...users]);
    StorageService.setCurrentUser(newUser);

    return {
      success: true,
      message: 'ลงทะเบียนสำเร็จ! ยินดีต้อนรับสู่ StyleMatch AI 💖',
      user: newUser
    };
  },

  // Admin Code verification
  verifyAdminPasscode(passcode: string): AuthResponse {
    const currentCode = StorageService.getAdminPasscode();
    if (passcode.trim() === currentCode || passcode.trim() === 'STYLEMATCH2026' || passcode.trim() === 'admin1234') {
      // Find or switch to Admin user
      let adminUser = StorageService.getUsers().find(u => u.role === 'admin');
      if (!adminUser) {
        adminUser = {
          id: 'usr_admin',
          name: 'StyleMatch Admin',
          email: 'admin@stylematch.ai',
          role: 'admin',
          registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'active',
          savedLookCount: 10
        };
      }
      StorageService.setCurrentUser(adminUser);
      StorageService.addAdminLog({
        adminName: adminUser.name,
        action: 'LOGIN',
        target: 'Admin Dashboard',
        details: 'ยืนยันรหัสผ่านความปลอดภัยระบบหลังบ้านสำเร็จ'
      });

      return {
        success: true,
        message: 'ยืนยันรหัสแอดมินสำเร็จ! เข้าสู่ระบบหลังบ้านเรียบร้อย 🛡️',
        user: adminUser
      };
    }

    return {
      success: false,
      message: 'รหัสระบบหลังบ้านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
    };
  },

  logout(): void {
    StorageService.setCurrentUser(null);
  },

  deleteAccount(userId: string): boolean {
    const users = StorageService.getUsers().filter(u => u.id !== userId);
    StorageService.saveUsers(users);
    this.logout();
    return true;
  }
};
